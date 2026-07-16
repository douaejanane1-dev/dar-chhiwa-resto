import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getOrderById, updateOrderPaymentStatus } from "@/lib/db/repo";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { OrderStatusTracker } from "@/components/order-status-tracker";
import { PartyPopper, MapPin, Phone, CreditCard } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "@/lib/i18n/config";

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string; payment?: string }>;
}) {
  const { id } = await params;
  const { session_id } = await searchParams;
  let order = getOrderById(id);
  if (!order) notFound();

  // If returning from Stripe Checkout, verify the session server-side and
  // mark the order as paid. This is the "return URL" verification pattern —
  // for production you'd also want a Stripe webhook as a durable backup
  // in case the customer closes the tab before the redirect completes.
  if (session_id && order.paymentMethod === "card" && order.paymentStatus !== "paid" && isStripeConfigured()) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === "paid" && session.metadata?.orderId === order.id) {
          const updated = updateOrderPaymentStatus(order.id, "paid", session_id);
          if (updated) order = updated;
        }
      } catch {
        // Stripe not reachable / invalid session — leave payment status as-is.
      }
    }
  }

  const cookieStore = await cookies();
  const localeValue = cookieStore.get(COOKIE_NAME)?.value;
  const locale = isValidLocale(localeValue) ? localeValue : defaultLocale;
  const dict = getDictionary(locale);

  const paymentStatusLabel =
    order.paymentStatus === "paid" ? dict.order.paid : order.paymentStatus === "failed" ? dict.order.failed : dict.order.unpaid;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent animate-float">
          <PartyPopper size={30} />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-stone-800">
          {dict.order.thankYou} {order.customerName}!
        </h1>
        <p className="mt-2 text-stone-500">
          {dict.account.orderNumber} #{order.id.slice(0, 8).toUpperCase()} — {dict.order.placed}
        </p>
      </div>

      <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm mb-6">
        <OrderStatusTracker status={order.status} />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <h2 className="font-display font-bold text-stone-800 mb-4">{dict.order.orderDetails}</h2>
          <div className="space-y-2">
            {order.items.map((it) => (
              <div key={it.menuItemId} className="flex justify-between text-sm">
                <span className="text-stone-600">
                  {it.qty}x {it.name}
                </span>
                <span className="font-medium text-stone-800">{it.price * it.qty} MAD</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t space-y-1 text-sm">
            <div className="flex justify-between text-stone-500">
              <span>{dict.order.subtotal}</span>
              <span>{order.subtotal} MAD</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>{dict.order.delivery}</span>
              <span>{order.deliveryFee} MAD</span>
            </div>
            <div className="flex justify-between font-bold text-brand-dark">
              <span>{dict.order.total}</span>
              <span>{order.total} MAD</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-display font-bold text-stone-800">{dict.order.deliveryInfo}</h2>
          <div className="flex items-start gap-2 text-sm text-stone-600">
            <MapPin size={16} className="mt-0.5 text-brand shrink-0" />
            {order.address.label} — {order.address.details}, {order.address.city}
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <Phone size={16} className="text-brand shrink-0" />
            {order.customerPhone}
          </div>
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <CreditCard size={16} className="text-brand shrink-0" />
            {order.paymentMethod === "cod" ? dict.checkout.cod : dict.checkout.card} — {paymentStatusLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
