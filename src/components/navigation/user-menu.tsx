import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import { getUser } from "@/lib/auth/session";
import { isServerSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

async function getDisplayName(userId: string, fallbackEmail?: string) {
  if (!isServerSupabaseConfigured()) {
    return fallbackEmail ?? "Account";
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("display_name,preferred_name")
    .eq("id", userId)
    .maybeSingle();

  return data?.preferred_name ?? data?.display_name ?? fallbackEmail ?? "Account";
}

export async function UserMenu() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const displayName = await getDisplayName(user.id, user.email);

  return (
    <div className="border-border bg-background-elevated flex items-center gap-3 rounded-[var(--radius-md)] border px-3 py-2">
      <div className="min-w-0">
        <p className="text-foreground max-w-44 truncate text-sm font-semibold">{displayName}</p>
        <Link href="/account" className="text-accent text-xs font-semibold hover:underline">
          Account
        </Link>
      </div>
      <form action={signOut}>
        <Button type="submit" variant="secondary" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
