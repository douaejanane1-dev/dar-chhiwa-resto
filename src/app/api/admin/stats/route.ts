import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStats } from "@/lib/db/repo";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(await getStats());
}
