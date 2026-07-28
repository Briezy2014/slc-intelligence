import { NextResponse, type NextRequest } from "next/server";
import { isServerSupabaseConfigured } from "@/lib/env";
import { safeRedirectPath } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeRedirectPath(requestUrl.searchParams.get("next"), "/command-center");

  if (!isServerSupabaseConfigured()) {
    const redirectUrl = new URL("/sign-in", requestUrl.origin);
    redirectUrl.searchParams.set("message", "configuration-needed");
    redirectUrl.searchParams.set("next", next);
    return NextResponse.redirect(redirectUrl);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  const redirectUrl = new URL("/sign-in", requestUrl.origin);
  redirectUrl.searchParams.set("message", "auth-error");
  redirectUrl.searchParams.set("next", next);
  return NextResponse.redirect(redirectUrl);
}
