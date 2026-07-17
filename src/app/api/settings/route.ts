import { NextResponse } from "next/server";
import { getSettings } from "@/lib/db/repo";

export async function GET() {
  return NextResponse.json(await getSettings());
}
