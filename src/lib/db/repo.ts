import { v4 as uuid } from "uuid";
import { mutateDB, readDB } from "./store";
import { slugify } from "@/lib/slugify";
import type {
  BlogPost,
  Category,
  MenuItem,
  Order,
  OrderStatus,
  RestaurantSettings,
  User,
} from "./types";

// ---------- Categories ----------
export function getCategories(): Category[] {
  return readDB().categories.sort((a, b) => a.order - b.order);
}

export function createCategory(data: Omit<Category, "id">): Category {
  return mutateDB((db) => {
    const cat: Category = { id: uuid(), ...data };
    db.categories.push(cat);
    return cat;
  });
}

export function updateCategory(id: string, data: Partial<Category>): Category | null {
  return mutateDB((db) => {
    const idx = db.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    db.categories[idx] = { ...db.categories[idx], ...data };
    return db.categories[idx];
  });
}

export function deleteCategory(id: string): boolean {
  return mutateDB((db) => {
    const before = db.categories.length;
    db.categories = db.categories.filter((c) => c.id !== id);
    db.menuItems = db.menuItems.filter((m) => m.categoryId !== id);
    return db.categories.length < before;
  });
}

// ---------- Menu Items ----------
export function getMenuItems(): MenuItem[] {
  return readDB().menuItems;
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return readDB().menuItems.find((m) => m.id === id);
}

export function createMenuItem(data: Omit<MenuItem, "id">): MenuItem {
  return mutateDB((db) => {
    const item: MenuItem = { id: uuid(), ...data };
    db.menuItems.push(item);
    return item;
  });
}

export function updateMenuItem(id: string, data: Partial<MenuItem>): MenuItem | null {
  return mutateDB((db) => {
    const idx = db.menuItems.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    db.menuItems[idx] = { ...db.menuItems[idx], ...data };
    return db.menuItems[idx];
  });
}

export function deleteMenuItem(id: string): boolean {
  return mutateDB((db) => {
    const before = db.menuItems.length;
    db.menuItems = db.menuItems.filter((m) => m.id !== id);
    return db.menuItems.length < before;
  });
}

// ---------- Users ----------
export function getUserByEmail(email: string): User | undefined {
  return readDB().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  return readDB().users.find((u) => u.id === id);
}

export function createUser(data: Omit<User, "id" | "createdAt">): User {
  return mutateDB((db) => {
    const user: User = { id: uuid(), createdAt: new Date().toISOString(), ...data };
    db.users.push(user);
    return user;
  });
}

// ---------- Orders ----------
export function getOrders(): Order[] {
  return readDB().orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrdersByUser(userId: string): Order[] {
  return getOrders().filter((o) => o.userId === userId);
}

export function getOrderById(id: string): Order | undefined {
  return readDB().orders.find((o) => o.id === id);
}

export function createOrder(data: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
  return mutateDB((db) => {
    const now = new Date().toISOString();
    const order: Order = { id: uuid(), createdAt: now, updatedAt: now, ...data };
    db.orders.push(order);
    return order;
  });
}

export function updateOrderPaymentStatus(
  id: string,
  paymentStatus: Order["paymentStatus"],
  stripeSessionId?: string
): Order | null {
  return mutateDB((db) => {
    const idx = db.orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    db.orders[idx].paymentStatus = paymentStatus;
    if (stripeSessionId) db.orders[idx].stripeSessionId = stripeSessionId;
    db.orders[idx].updatedAt = new Date().toISOString();
    return db.orders[idx];
  });
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  return mutateDB((db) => {
    const idx = db.orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    db.orders[idx].status = status;
    db.orders[idx].updatedAt = new Date().toISOString();
    if (status === "delivered" && db.orders[idx].paymentMethod === "cod") {
      db.orders[idx].paymentStatus = "paid";
    }
    return db.orders[idx];
  });
}

// ---------- Settings ----------
export function getSettings(): RestaurantSettings {
  return readDB().settings;
}

export function updateSettings(data: Partial<RestaurantSettings>): RestaurantSettings {
  return mutateDB((db) => {
    db.settings = { ...db.settings, ...data };
    return db.settings;
  });
}

// ---------- Stats ----------
export function getStats() {
  const orders = getOrders();
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

export function getBlogPosts(): BlogPost[] {
  return readDB().blogPosts;
}

export function getPublishedBlogPosts(): BlogPost[] {
  return readDB()
    .blogPosts.filter((p) => p.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return readDB().blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostById(id: string): BlogPost | undefined {
  return readDB().blogPosts.find((p) => p.id === id);
}

export function createBlogPost(
  data: Omit<BlogPost, "id" | "slug" | "createdAt" | "updatedAt"> & { slug?: string }
): BlogPost {
  return mutateDB((db) => {
    const now = new Date().toISOString();
    const baseSlug = slugify(data.slug || data.titleEn || data.title);
    let slug = baseSlug;
    let n = 1;
    while (db.blogPosts.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${n++}`;
    }
    const post: BlogPost = {
      ...data,
      id: uuid(),
      slug,
      createdAt: now,
      updatedAt: now,
    };
    db.blogPosts.push(post);
    return post;
  });
}

export function updateBlogPost(id: string, data: Partial<BlogPost>): BlogPost | undefined {
  return mutateDB((db) => {
    const idx = db.blogPosts.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    db.blogPosts[idx] = {
      ...db.blogPosts[idx],
      ...data,
      id: db.blogPosts[idx].id,
      updatedAt: new Date().toISOString(),
    };
    return db.blogPosts[idx];
  });
}

export function deleteBlogPost(id: string): boolean {
  return mutateDB((db) => {
    const before = db.blogPosts.length;
    db.blogPosts = db.blogPosts.filter((p) => p.id !== id);
    return db.blogPosts.length < before;
  });
}
