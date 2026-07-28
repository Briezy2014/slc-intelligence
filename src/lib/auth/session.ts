import { redirect } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { isServerSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export function isSafeRelativePath(value: string | null | undefined): value is string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return false;
  }

  try {
    const parsed = new URL(value, "http://slc.local");
    return parsed.origin === "http://slc.local" && `${parsed.pathname}${parsed.search}` === value;
  } catch {
    return false;
  }
}

export function safeRedirectPath(value: string | null | undefined, fallback = "/command-center") {
  return isSafeRelativePath(value) ? value : fallback;
}

export async function getSession(): Promise<Session | null> {
  if (!isServerSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return session;
}

export async function getUser(): Promise<User | null> {
  if (!isServerSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

export async function requireUser(next?: string): Promise<User> {
  if (!isServerSupabaseConfigured()) {
    redirect(`/sign-in?message=configuration-needed&next=${encodeURIComponent(next ?? "/")}`);
  }

  const user = await getUser();

  if (!user) {
    redirect(`/sign-in?next=${encodeURIComponent(safeRedirectPath(next, "/command-center"))}`);
  }

  return user;
}
