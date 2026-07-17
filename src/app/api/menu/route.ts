import { NextResponse } from "next/server";
import { getCategories, getMenuItems } from "@/lib/db/repo";

export async function GET() {
  const categories = await getCategories();
  const items = await getMenuItems();
  return NextResponse.json({ categories, items });
}
