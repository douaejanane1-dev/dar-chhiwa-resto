import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { createCategory, getCategories } from "@/lib/db/repo";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function GET() {
  return NextResponse.json(await getCategories());
}

const schema = z.object({
  name: z.string().min(2),
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  icon: z.string().min(1),
  order: z.number().default(0),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const cat = await createCategory(parsed.data);
  return NextResponse.json(cat, { status: 201 });
}
