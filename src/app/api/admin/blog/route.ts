import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { createBlogPost, getBlogPosts } from "@/lib/db/repo";

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await getBlogPosts());
}

const schema = z.object({
  slug: z.string().optional(),
  title: z.string().min(2),
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  excerpt: z.string().min(1),
  excerptAr: z.string().min(1),
  excerptEn: z.string().min(1),
  content: z.string().min(1),
  contentAr: z.string().min(1),
  contentEn: z.string().min(1),
  coverImage: z.string().min(1),
  author: z.string().min(1),
  published: z.boolean().default(false),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }
  const post = await createBlogPost(parsed.data);
  return NextResponse.json(post, { status: 201 });
}
