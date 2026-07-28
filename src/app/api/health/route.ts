import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "slc-intelligence",
    bundle: "1",
    supabaseConfigured: isSupabaseConfigured(),
    timestamp: new Date().toISOString(),
  });
}
