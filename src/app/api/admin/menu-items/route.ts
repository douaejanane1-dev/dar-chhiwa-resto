import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { createMenuItem, getMenuItems } from "@/lib/db/repo";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function GET() {
  return NextResponse.json(getMenuItems());
}

const schema = z.object({
  categoryId: z.string(),
  name: z.string().min(2),
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  description: z.string().default(""),
  descriptionAr: z.string().default(""),
  descriptionEn: z.string().default(""),
  price: z.number().positive(),
  image: z.string().default(""),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  spicyLevel: z.number().min(0).max(3).default(0),
  tags: z.array(z.string()).default([]),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.flatten() }, { status: 400 });
  const item = createMenuItem(parsed.data);
  return NextResponse.json(item, { status: 201 });
}
