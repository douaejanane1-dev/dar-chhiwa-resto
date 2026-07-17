// App-facing data types. These intentionally mirror the shape the UI has
// always consumed (e.g. Order.items as an array, Order.address nested) even
// though the underlying PostgreSQL schema (prisma/schema.prisma) normalizes
// orders/order items/address columns into separate, indexed relations. The
// translation between the two happens in src/lib/db/repo.ts so no component
// had to change during the JSON-file -> PostgreSQL migration.

export type Role = "admin" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  order: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  nameAr: string;
  nameEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
  spicyLevel: number; // 0-3
  tags: string[];
  prepTime?: number | null; // minutes
  ingredients?: string[];
  allergens?: string[];
  calories?: number | null;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "card";
export type PaymentStatus = "unpaid" | "paid" | "failed";

export interface DeliveryAddress {
  label: string;
  details: string;
  city: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  address: DeliveryAddress;
  notes?: string;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantSettings {
  name: string;
  nameAr: string;
  nameEn: string;
  tagline: string;
  taglineAr: string;
  taglineEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  logo: string;
  coverImage: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  openingHours: string;
  deliveryFee: number;
  minOrder: number;
  currency: string;
  instagram?: string;
  facebook?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  titleEn: string;
  excerpt: string;
  excerptAr: string;
  excerptEn: string;
  content: string;
  contentAr: string;
  contentEn: string;
  coverImage: string;
  author: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Future-ready (schema + data layer exist; no storefront UI wired up yet)
// ---------------------------------------------------------------------------

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Reservation {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  date: string;
  status: ReservationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  menuItemId: string;
  userId?: string;
  customerName: string;
  rating: number;
  comment?: string;
  published: boolean;
  createdAt: string;
}
