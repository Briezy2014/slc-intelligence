import { describe, expect, it, vi } from "vitest";
import { logOperationalEvent } from "@/lib/monitoring/safe-log";

describe("safe operational logging", () => {
  it("redacts jwt-like tokens from details", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    logOperationalEvent(
      { area: "auth", event: "failure", success: false },
      "token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.aaa.bbb leaked",
    );
    expect(String(spy.mock.calls[0]?.[1] ?? "")).toContain("[redacted-jwt]");
    expect(String(spy.mock.calls[0]?.[1] ?? "")).not.toContain(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    );
    spy.mockRestore();
  });
});
