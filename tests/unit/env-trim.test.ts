import { describe, expect, it, vi, afterEach } from "vitest";
import { getPublicEnv } from "@/lib/env/public-env";
import { getServerSupabaseConfig } from "@/lib/env/server-env";

describe("environment trimming", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("trims newlines from public Supabase values", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_NAME", "SLC Intelligence");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://slcintelligence.com\n");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "\nhttps://hgjjjtsdarfjdkounvyk.supabase.co\n");
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "\n\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature\n\n",
    );

    const env = getPublicEnv();
    expect(env.NEXT_PUBLIC_APP_URL).toBe("https://slcintelligence.com");
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://hgjjjtsdarfjdkounvyk.supabase.co");
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature");
  });

  it("trims server supabase config values", () => {
    vi.stubEnv("SUPABASE_URL", "\nhttps://hgjjjtsdarfjdkounvyk.supabase.co\n");
    vi.stubEnv("SUPABASE_ANON_KEY", "\n anon-key-value \n");

    const config = getServerSupabaseConfig();
    expect(config.configured).toBe(true);
    if (!config.configured) return;
    expect(config.url).toBe("https://hgjjjtsdarfjdkounvyk.supabase.co");
    expect(config.anonKey).toBe("anon-key-value");
  });
});
