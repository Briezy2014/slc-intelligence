import { describe, expect, it } from "vitest";
import {
  buildProgressReportDraftSummary,
  SYSTEM_SUMMARY_LABEL,
} from "@/lib/analytics/reporting-summaries";

describe("reporting summaries", () => {
  it("labels system summaries as educator-review drafts", () => {
    const summary = buildProgressReportDraftSummary({
      count: 4,
      dateRange: { start: "2026-01-01", end: "2026-01-31" },
      mean: 78.5,
      median: 80,
      latestValue: 82,
      trendDirection: "improving",
      trendValue: 1.25,
      measurementLabel: "percentage",
    });

    expect(summary.label).toBe(SYSTEM_SUMMARY_LABEL);
    expect(summary.dataSufficiencyStatus).toBe("sufficient");
    expect(summary.summary).toContain("Across 4 finalized/corrected percentage observations");
    expect(summary.summary).toContain("mean 78.5");
    expect(summary.summary).toContain("latest value 82");
  });

  it("does not invent zero values when data is unavailable", () => {
    const summary = buildProgressReportDraftSummary({
      count: 2,
      dateRange: { start: "2026-02-01", end: "2026-02-14" },
      measurementLabel: "frequency",
    });

    expect(summary.dataSufficiencyStatus).toBe("limited");
    expect(summary.summary).not.toContain("mean 0");
    expect(summary.summary).not.toContain("median 0");
    expect(summary.summary).toContain("numeric summary values were not available");
  });

  it("returns an insufficiency draft when no observations are available", () => {
    const summary = buildProgressReportDraftSummary({ count: 0 });

    expect(summary.dataSufficiencyStatus).toBe("insufficient");
    expect(summary.summary).toContain("insufficient");
    expect(summary.label).toBe(SYSTEM_SUMMARY_LABEL);
  });
});
