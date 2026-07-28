import { describe, expect, it } from "vitest";
import { getPublicEnv, isSupabaseConfigured } from "@/lib/env";

describe("environment schema", () => {
  it("parses empty optional public variables", () => {
    const env = getPublicEnv();
    expect(typeof env.NEXT_PUBLIC_APP_URL === "string").toBe(true);
  });

  it("reports Supabase as not configured when public vars are empty", () => {
    expect(isSupabaseConfigured()).toBe(false);
  });
});
