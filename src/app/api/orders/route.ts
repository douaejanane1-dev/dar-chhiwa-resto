import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { createOrder, getOrders, getOrdersByUser, getSettings } from "@/lib/db/repo";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const itemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),
  price: z.number(),
  qty: z.number().min(1),
  image: z.string(),
});

const orderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  items: z.array(itemSchema).min(1),
  paymentMethod: z.enum(["cod", "card"]),
  notes: z.string().optional(),
  address: z.object({
    label: z.string(),
    details: z.string(),
    city: z.string(),
    phone: z.string(),
    lat: z.number(),
    lng: z.number(),
  }),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const orders =
    session.user.role === "admin" ? getOrders() : getOrdersByUser(session.user.id);
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const session = await auth();
  const rlKey = session?.user?.id ? `order:user:${session.user.id}` : `order:ip:${getClientIp(req)}`;
  const { success } = rateLimit(rlKey, { limit: 20, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json({ error: "Too many orders placed. Please slow down." }, { status: 429 });
  }

  const body = await req.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order data", details: parsed.error.flatten() }, { status: 400 });
  }

  const { items, address, customerName, customerPhone, paymentMethod, notes } = parsed.data;
  const settings = getSettings();

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const deliveryFee = subtotal >= settings.minOrder ? settings.deliveryFee : settings.deliveryFee + 5;
  const total = subtotal + deliveryFee;

  const order = createOrder({
    userId: session?.user?.id,
    customerName,
    customerPhone,
    items,
    subtotal,
    deliveryFee,
    total,
    status: "pending",
    paymentMethod,
    paymentStatus: "unpaid",
    address,
    notes,
  });

  return NextResponse.json(order, { status: 201 });
}
