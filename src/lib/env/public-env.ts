import { z } from "zod";

/**
 * Public environment schema for Phase 3+.
 * Supabase URL and anon key are required only when authentication is enabled.
 * Never place service-role keys, access tokens, or other secrets in NEXT_PUBLIC_* variables.
 */
export const publicEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
  NEXT_PUBLIC_APP_NAME: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

function trimEnv(value: string | undefined): string {
  return (value ?? "").trim();
}

export function getPublicEnv(): PublicEnv {
  const parsed = publicEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: trimEnv(process.env.NEXT_PUBLIC_APP_NAME),
    NEXT_PUBLIC_APP_URL: trimEnv(process.env.NEXT_PUBLIC_APP_URL),
    NEXT_PUBLIC_SUPABASE_URL: trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: trimEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  });

  if (!parsed.success) {
    throw new Error("Invalid public environment configuration.");
  }

  return parsed.data;
}

export function isSupabaseConfigured(): boolean {
  const env = getPublicEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getAppDisplayName(): string {
  const name = getPublicEnv().NEXT_PUBLIC_APP_NAME;
  return name && name.length > 0 ? name : "SLC Intelligence";
}
