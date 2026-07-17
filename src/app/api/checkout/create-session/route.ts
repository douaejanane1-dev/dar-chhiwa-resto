import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getOrderById, getSettings } from "@/lib/db/repo";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({ orderId: z.string() });

export async function POST(req: Request) {
  const { success } = rateLimit(`checkout:${getClientIp(req)}`, { limit: 15, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Le paiement par carte n'est pas encore configuré. Ajoutez STRIPE_SECRET_KEY dans .env (voir README).",
      },
      { status: 503 }
    );
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const order = await getOrderById(parsed.data.orderId);
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  const settings = await getSettings();
  const currency = (settings.currency || "MAD").toLowerCase();
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    new URL(req.url).origin;

  try {
    const lineItems = order.items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
          images: item.image?.startsWith("http") ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    if (order.deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency,
          product_data: { name: "Livraison / التوصيل / Delivery", images: undefined },
          unit_amount: Math.round(order.deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${origin}/order/${order.id}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?payment=cancelled`,
      customer_email: undefined,
      metadata: { orderId: order.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
