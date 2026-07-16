import { NextResponse } from "next/server";
import { getCategories, getMenuItems } from "@/lib/db/repo";

export async function GET() {
  const categories = getCategories();
  const items = getMenuItems();
  return NextResponse.json({ categories, items });
}
