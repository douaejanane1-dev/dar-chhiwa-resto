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
  prepTime?: number; // minutes
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

export interface DBShape {
  users: User[];
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  settings: RestaurantSettings;
  blogPosts: BlogPost[];
}
