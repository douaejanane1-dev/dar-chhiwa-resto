import fs from "fs";
import path from "path";
import type { DBShape } from "./types";

const SOURCE_DB_PATH = path.join(process.cwd(), "data", "db.json");

// Vercel (and other read-only serverless) deployments only allow writes under
// /tmp — the deployed source directory itself is read-only. When running
// there, we write to a /tmp copy instead, seeded from the bundled data on
// first access so existing menu/settings content isn't lost.
// NOTE: /tmp is ephemeral (per-instance, wiped on cold start/redeploy) — this
// keeps the app functional on Vercel but is not durable storage. For a real
// production restaurant taking real orders, swap this file-based store for a
// real database (see README: Postgres via Prisma/Drizzle), or deploy to a
// host with a persistent filesystem (Docker/VPS/Render) instead.
const DB_PATH = process.env.VERCEL
  ? path.join("/tmp", "dar-chhiwa-db.json")
  : SOURCE_DB_PATH;

function defaultDB(): DBShape {
  return {
    users: [],
    categories: [],
    menuItems: [],
    orders: [],
    settings: {
      name: "Dar Chhiwa",
      nameAr: "دار الشهيوة",
      nameEn: "Dar Chhiwa",
      tagline: "Le goût authentique, à votre porte",
      taglineAr: "الطعم الأصيل، على بابك",
      taglineEn: "Authentic taste, at your door",
      description:
        "Cuisine marocaine authentique, preparee chaque jour avec des ingredients frais et des recettes familiales.",
      descriptionAr: "مطبخ مغربي أصيل، طبخ يومي بمكونات طازجة ووصفات عائلية.",
      descriptionEn: "Authentic Moroccan cuisine, cooked daily with fresh ingredients and family recipes.",
      logo: "/uploads/logo.svg",
      coverImage: "/uploads/hero.jpg",
      phone: "+212 6 00 00 00 00",
      email: "contact@darchhiwa.ma",
      address: "Zenkat Al Massira, Hay Al Farah",
      city: "Casablanca",
      lat: 33.5731,
      lng: -7.5898,
      openingHours: "Kolyoum: 11:00 - 23:30",
      deliveryFee: 15,
      minOrder: 60,
      currency: "MAD",
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
    blogPosts: [
      {
        id: "post-1",
        slug: "secrets-of-moroccan-tagine",
        title: "Les secrets d'un tagine marocain reussi",
        titleAr: "أسرار طاجين مغربي ناجح",
        titleEn: "Secrets of a Successful Moroccan Tagine",
        excerpt: "Decouvrez les techniques traditionnelles pour un tagine parfait a chaque fois.",
        excerptAr: "اكتشف التقنيات التقليدية لطاجين مثالي في كل مرة.",
        excerptEn: "Discover the traditional techniques for a perfect tagine every time.",
        content: "Le secret d'un bon tagine reside dans la cuisson lente et les epices fraiches...",
        contentAr: "يكمن سر الطاجين الجيد في الطهي البطيء والتوابل الطازجة...",
        contentEn: "The secret of a good tagine lies in slow cooking and fresh spices...",
        coverImage: "/uploads/blog-tagine.jpg",
        author: "Dar Chhiwa",
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };
}

function withDefaults(db: Partial<DBShape>): DBShape {
  const base = defaultDB();
  return {
    users: db.users ?? base.users,
    categories: db.categories ?? base.categories,
    menuItems: db.menuItems ?? base.menuItems,
    orders: db.orders ?? base.orders,
    settings: db.settings ? { ...base.settings, ...db.settings } : base.settings,
    blogPosts: db.blogPosts ?? base.blogPosts,
  };
}

function ensureDB() {
  if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    if (DB_PATH !== SOURCE_DB_PATH && fs.existsSync(SOURCE_DB_PATH)) {
      // Seed the writable /tmp copy from the real bundled data (menu,
      // settings, seeded categories...) instead of starting from scratch.
      fs.copyFileSync(SOURCE_DB_PATH, DB_PATH);
    } else {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB(), null, 2));
    }
  }
}

// Simple in-process write queue to avoid concurrent write corruption
let writing: Promise<unknown> = Promise.resolve();

export function readDB(): DBShape {
  ensureDB();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return withDefaults(JSON.parse(raw) as Partial<DBShape>);
}

export function writeDB(db: DBShape) {
  writing = writing.then(() => {
    ensureDB();
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  });
  return writing;
}

export function mutateDB<T>(fn: (db: DBShape) => T): T {
  const db = readDB();
  const result = fn(db);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  return result;
}
