import { NextResponse } from "next/server";

export function GET() {
  const environment = process.env.NODE_ENV === "production" ? "production" : "development";

  return NextResponse.json({
    status: "ok",
    service: "slc-intelligence",
    environment,
  });
}
