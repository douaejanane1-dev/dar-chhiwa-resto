import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSettings, updateSettings } from "@/lib/db/repo";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(getSettings());
}

export async function PUT(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const settings = updateSettings(body);
  return NextResponse.json(settings);
}
