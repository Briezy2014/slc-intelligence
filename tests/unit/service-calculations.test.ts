import { describe, expect, it } from "vitest";
import {
  describeDocumentationGap,
  durationMinutesFromStartEnd,
  summarizePlannedVsRecordedMinutes,
} from "@/lib/analytics/service-calculations";

describe("service calculations", () => {
  it("calculates duration from start and end time", () => {
    expect(durationMinutesFromStartEnd("10:30", "11:00")).toBe(30);
    expect(durationMinutesFromStartEnd("10:30:00", "10:45:00")).toBe(15);
  });

  it("keeps missing duration data unavailable instead of zero", () => {
    expect(durationMinutesFromStartEnd(null, "11:00")).toBeNull();
    expect(durationMinutesFromStartEnd("11:00", "10:30")).toBeNull();
  });

  it("summarizes planned versus recorded minutes with guardrail disclaimer", () => {
    const summary = summarizePlannedVsRecordedMinutes({ plannedMinutes: 30, recordedMinutes: 20 });
    expect(summary.differenceMinutes).toBe(-10);
    expect(summary.label).toContain("below");
    expect(summary.disclaimer).toContain("do not determine compliance or owed minutes");
  });

  it("uses descriptive documentation-gap language", () => {
    expect(describeDocumentationGap({ plannedMinutes: 30, recordedMinutes: null })).toBe(
      "A planned service entry does not yet have recorded minutes.",
    );
    expect(describeDocumentationGap({ plannedMinutes: null, recordedMinutes: null })).toContain(
      "unavailable",
    );
    expect(describeDocumentationGap({ plannedMinutes: 30, recordedMinutes: 20 })).not.toContain(
      "owed",
    );
  });
});
