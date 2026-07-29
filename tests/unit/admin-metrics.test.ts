import { describe, expect, it } from "vitest";
import { presentMetrics } from "@/lib/analytics/admin-metrics";

describe("admin metrics presentation", () => {
  it("presents explanations for every metric and suppresses small counts", () => {
    const metrics = presentMetrics(
      {
        active_students: 2,
        active_goals: 10,
        goals_without_recent_finalized_data: null,
      },
      5,
    );
    expect(metrics.every((metric) => metric.explanation.length > 0)).toBe(true);
    expect(metrics.find((metric) => metric.key === "active_students")?.result.suppressed).toBe(true);
    expect(metrics.find((metric) => metric.key === "active_goals")?.result.display).toBe("10");
    expect(metrics.find((metric) => metric.key === "goals_without_recent_finalized_data")?.result.display).toBe(
      "No finalized record found",
    );
  });

  it("does not invent ranking language", () => {
    const metrics = presentMetrics({ active_staff: 12 }, 5);
    const staff = metrics.find((metric) => metric.key === "active_staff");
    expect(staff?.label.toLowerCase()).not.toContain("rank");
    expect(staff?.explanation.toLowerCase()).toContain("not a performance ranking");
  });
});
