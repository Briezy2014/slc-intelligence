import { z } from "zod";

/**
 * Server-only environment schema for Phase 3+.
 * These values intentionally mirror the public Supabase URL and anon key.
 * A service-role key is not required for this bundle and must not be used here.
 */
export const serverEnvSchema = z.object({
  SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function trimEnv(value: string | undefined): string {
  return (value ?? "").trim();
}

export function getServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse({
    SUPABASE_URL: trimEnv(process.env.SUPABASE_URL),
    SUPABASE_ANON_KEY: trimEnv(process.env.SUPABASE_ANON_KEY),
  });

  if (!parsed.success) {
    throw new Error("Invalid server environment configuration.");
  }

  return parsed.data;
}

export function getServerSupabaseConfig():
  { configured: true; url: string; anonKey: string } | { configured: false; url: ""; anonKey: "" } {
  const env = getServerEnv();
  const url = trimEnv(env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = trimEnv(env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !anonKey) {
    return { configured: false, url: "", anonKey: "" };
  }

  return { configured: true, url, anonKey };
}

export function isServerSupabaseConfigured(): boolean {
  return getServerSupabaseConfig().configured;
}
