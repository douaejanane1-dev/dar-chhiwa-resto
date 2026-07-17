import { prisma } from "./prisma";
import { slugify } from "@/lib/slugify";
import type {
  BlogPost,
  Category,
  Customer,
  MenuItem,
  Order,
  OrderStatus,
  Reservation,
  ReservationStatus,
  RestaurantSettings,
  Review,
  User,
} from "./types";
// Local shape describing what `prisma.order.findMany/create({ include: { items: true } })`
// returns. Defined by hand (rather than imported from the generated
// `@prisma/client` types) so this file type-checks even before `prisma
// generate` has run; it is structurally identical to the real generated
// type once the client is generated.

// ---------------------------------------------------------------------------
// Adapters — Prisma's normalized DB shape <-> the app-facing shape already
// used throughout the UI (Order.items as an array, Order.address as a
// nested object). This keeps every existing component/page untouched: only
// this data-access layer knows about the underlying relational structure.
// ---------------------------------------------------------------------------

interface PrismaOrderItemShape {
  id: string;
  orderId: string;
  menuItemId: string | null;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface PrismaOrderWithItems {
  id: string;
  userId: string | null;
  customerName: string;
  customerPhone: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: Order["paymentMethod"];
  paymentStatus: Order["paymentStatus"];
  notes: string | null;
  stripeSessionId: string | null;
  addressLabel: string;
  addressDetails: string;
  addressCity: string;
  addressPhone: string;
  addressLat: number;
  addressLng: number;
  createdAt: Date;
  updatedAt: Date;
  items: PrismaOrderItemShape[];
}

function toOrder(o: PrismaOrderWithItems): Order {
  return {
    id: o.id,
    userId: o.userId ?? undefined,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    items: o.items.map((it) => ({
      menuItemId: it.menuItemId ?? it.id,
      name: it.name,
      price: it.price,
      qty: it.qty,
      image: it.image,
    })),
    subtotal: o.subtotal,
    deliveryFee: o.deliveryFee,
    total: o.total,
    status: o.status as OrderStatus,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    address: {
      label: o.addressLabel,
      details: o.addressDetails,
      city: o.addressCity,
      phone: o.addressPhone,
      lat: o.addressLat,
      lng: o.addressLng,
    },
    notes: o.notes ?? undefined,
    stripeSessionId: o.stripeSessionId ?? undefined,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  };
}

const orderInclude = { items: true } as const;

// ---------- Categories ----------
export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function createCategory(data: Omit<Category, "id">): Promise<Category> {
  return prisma.category.create({ data });
}

export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<Category | null> {
  try {
    return await prisma.category.update({ where: { id }, data });
  } catch {
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    // MenuItem.categoryId has ON DELETE CASCADE, so related menu items are
    // removed automatically by Postgres.
    await prisma.category.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// ---------- Menu Items ----------
export async function getMenuItems(): Promise<MenuItem[]> {
  return prisma.menuItem.findMany({ orderBy: { name: "asc" } });
}

export async function getMenuItemById(id: string): Promise<MenuItem | undefined> {
  const item = await prisma.menuItem.findUnique({ where: { id } });
  return item ?? undefined;
}

export async function createMenuItem(data: Omit<MenuItem, "id">): Promise<MenuItem> {
  return prisma.menuItem.create({ data });
}

export async function updateMenuItem(
  id: string,
  data: Partial<MenuItem>
): Promise<MenuItem | null> {
  try {
    return await prisma.menuItem.update({ where: { id }, data });
  } catch {
    return null;
  }
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  try {
    await prisma.menuItem.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// ---------- Users ----------
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });
  return user ? { ...user, createdAt: user.createdAt.toISOString(), phone: user.phone ?? undefined } : undefined;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? { ...user, createdAt: user.createdAt.toISOString(), phone: user.phone ?? undefined } : undefined;
}

export async function createUser(data: Omit<User, "id" | "createdAt">): Promise<User> {
  const user = await prisma.user.create({ data });
  return { ...user, createdAt: user.createdAt.toISOString(), phone: user.phone ?? undefined };
}

// ---------- Orders ----------
export async function getOrders(): Promise<Order[]> {
  const orders = await prisma.order.findMany({
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
  return orders.map(toOrder);
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
  return orders.map(toOrder);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const order = await prisma.order.findUnique({ where: { id }, include: orderInclude });
  return order ? toOrder(order) : undefined;
}

export async function createOrder(data: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
  const order = await prisma.order.create({
    data: {
      userId: data.userId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      subtotal: data.subtotal,
      deliveryFee: data.deliveryFee,
      total: data.total,
      status: data.status,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      notes: data.notes,
      stripeSessionId: data.stripeSessionId,
      addressLabel: data.address.label,
      addressDetails: data.address.details,
      addressCity: data.address.city,
      addressPhone: data.address.phone,
      addressLat: data.address.lat,
      addressLng: data.address.lng,
      items: {
        create: data.items.map((it) => ({
          menuItemId: it.menuItemId,
          name: it.name,
          price: it.price,
          qty: it.qty,
          image: it.image,
        })),
      },
    },
    include: orderInclude,
  });
  return toOrder(order);
}

export async function updateOrderPaymentStatus(
  id: string,
  paymentStatus: Order["paymentStatus"],
  stripeSessionId?: string
): Promise<Order | null> {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { paymentStatus, ...(stripeSessionId ? { stripeSessionId } : {}) },
      include: orderInclude,
    });
    return toOrder(order);
  } catch {
    return null;
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  try {
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return null;
    const paymentStatus =
      status === "delivered" && existing.paymentMethod === "cod" ? "paid" : undefined;
    const order = await prisma.order.update({
      where: { id },
      data: { status, ...(paymentStatus ? { paymentStatus } : {}) },
      include: orderInclude,
    });
    return toOrder(order);
  } catch {
    return null;
  }
}

// ---------- Settings ----------
const SETTINGS_ID = "default";

export async function getSettings(): Promise<RestaurantSettings> {
  const settings = await prisma.restaurantSettings.findUnique({ where: { id: SETTINGS_ID } });
  if (!settings) {
    throw new Error(
      "RestaurantSettings row not found — run `npm run seed` to initialize default settings."
    );
  }
  const { id: _id, ...rest } = settings;
  return { ...rest, instagram: rest.instagram ?? undefined, facebook: rest.facebook ?? undefined };
}

export async function updateSettings(
  data: Partial<RestaurantSettings>
): Promise<RestaurantSettings> {
  const settings = await prisma.restaurantSettings.update({ where: { id: SETTINGS_ID }, data });
  const { id: _id, ...rest } = settings;
  return { ...rest, instagram: rest.instagram ?? undefined, facebook: rest.facebook ?? undefined };
}

// ---------- Stats ----------
export async function getStats() {
  const orders = await getOrders();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayOrders = orders.filter((o) => new Date(o.createdAt) >= startOfToday);
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const todayRevenue = todayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) =>
    ["pending", "confirmed", "preparing", "out_for_delivery"].includes(o.status)
  ).length;

  const itemCounts: Record<string, { name: string; qty: number }> = {};
  for (const o of orders) {
    for (const it of o.items) {
      if (!itemCounts[it.menuItemId]) itemCounts[it.menuItemId] = { name: it.name, qty: 0 };
      itemCounts[it.menuItemId].qty += it.qty;
    }
  }
  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const last7days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    const dayOrders = orders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= dayStart.getTime() && t < dayEnd.getTime() && o.status !== "cancelled";
    });
    return {
      date: dayStart.toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit" }),
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    };
  });

  return {
    totalOrders: orders.length,
    todayOrders: todayOrders.length,
    revenue,
    todayRevenue,
    pending,
    topItems,
    last7days,
  };
}

// ---------------------------------------------------------------------------
// Blog (CMS-lite)
// ---------------------------------------------------------------------------

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return posts.map((p: { id: string; slug: string; title: string; titleAr: string; titleEn: string; excerpt: string; excerptAr: string; excerptEn: string; content: string; contentAr: string; contentEn: string; coverImage: string; author: string; published: boolean; createdAt: Date; updatedAt: Date }) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return posts.map((p: { id: string; slug: string; title: string; titleAr: string; titleEn: string; excerpt: string; excerptAr: string; excerptEn: string; content: string; contentAr: string; contentEn: string; coverImage: string; author: string; published: boolean; createdAt: Date; updatedAt: Date }) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const p = await prisma.blogPost.findUnique({ where: { slug } });
  return p ? { ...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() } : undefined;
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  const p = await prisma.blogPost.findUnique({ where: { id } });
  return p ? { ...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() } : undefined;
}

export async function createBlogPost(
  data: Omit<BlogPost, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string }
): Promise<BlogPost> {
  const baseSlug = slugify(data.slug || data.titleEn || data.title);
  let slug = baseSlug;
  let n = 1;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${n++}`;
  }
  const { slug: _incomingSlug, ...rest } = data;
  const p = await prisma.blogPost.create({ data: { ...rest, slug } });
  return { ...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() };
}

export async function updateBlogPost(
  id: string,
  data: Partial<BlogPost>
): Promise<BlogPost | undefined> {
  try {
    const { id: _id, ...rest } = data;
    const p = await prisma.blogPost.update({ where: { id }, data: rest });
    return { ...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() };
  } catch {
    return undefined;
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    await prisma.blogPost.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Reservations (future-ready — schema + data layer only, no storefront UI
// yet; wire up a booking form/admin view against these functions when
// ready).
// ---------------------------------------------------------------------------

export async function createReservation(
  data: Omit<Reservation, "id" | "createdAt" | "updatedAt" | "status"> & { status?: ReservationStatus }
): Promise<Reservation> {
  const r = await prisma.reservation.create({
    data: { ...data, status: data.status ?? "pending" },
  });
  return {
    ...r,
    date: r.date.toISOString(),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    customerId: r.customerId ?? undefined,
    customerEmail: r.customerEmail ?? undefined,
    notes: r.notes ?? undefined,
  };
}

export async function getReservations(): Promise<Reservation[]> {
  const rows = await prisma.reservation.findMany({ orderBy: { date: "asc" } });
  return rows.map((r: { id: string; customerId: string | null; customerName: string; customerPhone: string; customerEmail: string | null; partySize: number; date: Date; status: ReservationStatus; notes: string | null; createdAt: Date; updatedAt: Date }) => ({
    ...r,
    date: r.date.toISOString(),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    customerId: r.customerId ?? undefined,
    customerEmail: r.customerEmail ?? undefined,
    notes: r.notes ?? undefined,
  }));
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
): Promise<Reservation | null> {
  try {
    const r = await prisma.reservation.update({ where: { id }, data: { status } });
    return {
      ...r,
      date: r.date.toISOString(),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      customerId: r.customerId ?? undefined,
      customerEmail: r.customerEmail ?? undefined,
      notes: r.notes ?? undefined,
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Customers (future-ready — lightweight CRM/lead table, no UI yet)
// ---------------------------------------------------------------------------

export async function upsertCustomer(
  data: Omit<Customer, "id" | "createdAt" | "updatedAt">
): Promise<Customer> {
  const c = data.email
    ? await prisma.customer.upsert({
        where: { email: data.email },
        create: data,
        update: data,
      })
    : await prisma.customer.create({ data });
  return {
    ...c,
    email: c.email ?? undefined,
    phone: c.phone ?? undefined,
    notes: c.notes ?? undefined,
    userId: c.userId ?? undefined,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Reviews (future-ready — schema + data layer only, no storefront UI yet;
// the current menu-item ratings shown in the UI are illustrative
// placeholders, not backed by this table until a review form is built)
// ---------------------------------------------------------------------------

export async function createReview(
  data: Omit<Review, "id" | "createdAt" | "published">
): Promise<Review> {
  const r = await prisma.review.create({ data: { ...data, published: false } });
  return { ...r, userId: r.userId ?? undefined, comment: r.comment ?? undefined, createdAt: r.createdAt.toISOString() };
}

export async function getPublishedReviewsForMenuItem(menuItemId: string): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    where: { menuItemId, published: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r: { id: string; menuItemId: string; userId: string | null; customerName: string; rating: number; comment: string | null; published: boolean; createdAt: Date }) => ({
    ...r,
    userId: r.userId ?? undefined,
    comment: r.comment ?? undefined,
    createdAt: r.createdAt.toISOString(),
  }));
}
