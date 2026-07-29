import { describe, expect, it } from "vitest";
import {
  configurationNeededMessage,
  mapAuthError,
  passwordResetRequestMessage,
} from "@/lib/auth/errors";

describe("auth error mapping", () => {
  it("returns safe generic messages by default", () => {
    expect(mapAuthError({ message: "database exploded with private detail" })).toBe(
      "We could not complete that request. Check your information and try again.",
    );
  });

  it("maps rate limits, weak passwords, and expired sessions", () => {
    expect(mapAuthError({ status: 429 })).toContain("Too many attempts");
    expect(mapAuthError({ message: "Weak password" })).toContain("stronger password");
    expect(mapAuthError({ message: "Session expired" })).toContain("session has expired");
  });

  it("keeps reset and configuration messages non-enumerating", () => {
    expect(passwordResetRequestMessage()).toContain("If an account exists");
    expect(configurationNeededMessage()).toContain("Supabase authentication is not configured");
  });
});
