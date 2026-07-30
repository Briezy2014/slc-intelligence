import { describe, expect, it } from "vitest";
import {
  suppressCount,
  suppressRate,
  suppressionNotice,
} from "@/lib/analytics/small-group-suppression";

describe("small-group suppression", () => {
  it("suppresses positive counts below threshold", () => {
    const r = suppressCount(3, 5);
    expect(r.suppressed).toBe(true);
    expect(r.display).toContain("Suppressed");
    expect(r.value).toBeNull();
  });

  it("allows zero and values at or above threshold", () => {
    expect(suppressCount(0, 5).suppressed).toBe(false);
    expect(suppressCount(5, 5).suppressed).toBe(false);
    expect(suppressCount(5, 5).display).toBe("5");
  });

  it("does not invent zero for missing", () => {
    expect(suppressCount(null, 5).display).toBe("No finalized record found");
  });

  it("suppresses rates when denominator is below threshold", () => {
    const r = suppressRate(2, 3, 5);
    expect(r.suppressed).toBe(true);
  });

  it("documents privacy notice", () => {
    expect(suppressionNotice(5)).toContain("not a legal standard");
  });
});
