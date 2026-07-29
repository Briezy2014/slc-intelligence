import { describe, expect, it } from "vitest";
import {
  checklistCompletionPercent,
  detectScheduleOverlaps,
  independencePercent,
  promptDistribution,
  scheduleBlockDurationMinutes,
  taskCompletionPercent,
} from "@/lib/analytics/executive-function-calculations";

describe("executive function calculations", () => {
  it("calculates checklist completion without scoring unavailable responses as zero", () => {
    const summary = checklistCompletionPercent([
      { response: "yes" },
      { response: "partial" },
      { response: "no" },
      { response: "not_observed" },
      { response: "not_applicable" },
    ]);
    expect(summary).toEqual({ percent: 50, scoredCount: 3, totalCount: 5 });
  });

  it("calculates task completion from scored task logs", () => {
    expect(
      taskCompletionPercent([
        { completionStatus: "independent" },
        { completionStatus: "prompted" },
        { completionStatus: "partial" },
        { completionStatus: "not_completed" },
        { completionStatus: "not_applicable" },
      ]),
    ).toEqual({ percent: 75, scoredCount: 4, totalCount: 5 });
  });

  it("summarizes prompt distribution and independence", () => {
    const observations = [
      { promptLevel: "independent" as const },
      { promptLevel: "visual" as const },
      { promptLevel: "verbal" as const },
      { promptLevel: "not_observed" as const },
    ];
    expect(promptDistribution(observations).independent).toBe(1);
    expect(independencePercent(observations)).toEqual({ percent: 33, scoredCount: 3, totalCount: 4 });
  });

  it("calculates schedule duration and detects same-day overlaps", () => {
    expect(scheduleBlockDurationMinutes("08:00", "08:45")).toBe(45);
    expect(scheduleBlockDurationMinutes("08:45", "08:00")).toBeNull();
    expect(
      detectScheduleOverlaps([
        { id: "a", dayOfWeek: 1, startTime: "08:00", endTime: "08:45" },
        { id: "b", dayOfWeek: 1, startTime: "08:30", endTime: "09:00" },
        { id: "c", dayOfWeek: 2, startTime: "08:30", endTime: "09:00" },
      ]),
    ).toEqual([{ firstId: "a", secondId: "b" }]);
  });
});
