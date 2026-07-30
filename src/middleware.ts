import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = [
  "/command-center",
  "/account",
  "/select-organization",
  "/membership-pending",
  "/unauthorized",
  "/organization",
  "/schools",
  "/programs",
  "/classrooms",
  "/staff",
  "/students",
  "/goals",
  "/progress",
  "/reports",
  "/behavior-detective",
  "/interventions",
  "/accommodations",
  "/services",
  "/family-communication",
  "/meetings",
  "/executive-function",
  "/classroom-operations",
  "/administrative-intelligence",
  "/ai-assist",
];

const AUTH_PREFIXES = ["/sign-in", "/forgot-password", "/reset-password", "/auth/callback"];

function matchesPrefix(pathname: string, prefixes: readonly string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function safeNextPath(request: NextRequest) {
  const path = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  return path.startsWith("/") && !path.startsWith("//") ? path : "/command-center";
}

function applySafeRelativeRedirect(url: URL, next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    url.pathname = "/command-center";
    url.search = "";
    return;
  }

  const parsed = new URL(next, url.origin);
  if (parsed.origin !== url.origin) {
    url.pathname = "/command-center";
    url.search = "";
    return;
  }

  url.pathname = parsed.pathname;
  url.search = parsed.search;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = matchesPrefix(pathname, PROTECTED_PREFIXES);
  const isAuthRoute = matchesPrefix(pathname, AUTH_PREFIXES);

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const { configured, response, user } = await updateSession(request);

  if (!configured) {
    if (isProtectedRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/sign-in";
      redirectUrl.search = "";
      redirectUrl.searchParams.set("message", "configuration-needed");
      redirectUrl.searchParams.set("next", safeNextPath(request));
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    redirectUrl.search = "";
    redirectUrl.searchParams.set("next", safeNextPath(request));
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && user && pathname !== "/auth/callback") {
    const redirectUrl = request.nextUrl.clone();
    applySafeRelativeRedirect(redirectUrl, request.nextUrl.searchParams.get("next"));
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
