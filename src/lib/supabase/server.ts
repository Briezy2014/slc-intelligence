import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getServerSupabaseConfig } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

export function assertServerSupabaseConfigured(): void {
  if (!getServerSupabaseConfig().configured) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_URL and SUPABASE_ANON_KEY.",
    );
  }
}

export async function createClient(): Promise<SupabaseClient<Database>> {
  const config = getServerSupabaseConfig();

  if (!config.configured) {
    assertServerSupabaseConfigured();
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies. Middleware/actions refresh sessions.
        }
      },
    },
  });
}

export const createServerSupabaseClient = createClient;
