import { describe, expect, it } from "vitest";
import {
  CAUSATION_WARNING,
  componentFidelity,
  fidelityPercent,
  phaseComparison,
  plannedVsDelivered,
  summarizeDosage,
} from "@/lib/analytics/intervention-calculations";

describe("intervention calculations", () => {
  it("scores overall and component fidelity", () => {
    const responses = [
      { componentId: "prompting", response: "yes" as const },
      { componentId: "prompting", response: "partial" as const },
      { componentId: "reinforcement", response: "no" as const },
      { componentId: "reinforcement", response: "not_observed" as const },
    ];

    expect(fidelityPercent(responses)).toEqual({
      percent: 50,
      scoredItems: 3,
      possibleItems: 4,
      sufficiency: {
        status: "sufficient",
        reason: "3 usable fidelity items available.",
        usableCount: 3,
      },
    });
    expect(componentFidelity(responses)).toEqual({
      prompting: { percent: 75, scoredItems: 2 },
      reinforcement: { percent: 0, scoredItems: 1 },
    });
  });

  it("compares planned and delivered dosage", () => {
    expect(
      plannedVsDelivered({ plannedSessions: 5, plannedMinutes: 100 }, [
        { sessionsDelivered: 2, durationMinutes: 30 },
        { sessionsDelivered: 3, durationMinutes: 45 },
      ]),
    ).toEqual({
      plannedSessions: 5,
      deliveredSessions: 5,
      sessionPercent: 100,
      plannedMinutes: 100,
      deliveredMinutes: 75,
      minutePercent: 75,
    });
  });

  it("summarizes dosage values", () => {
    const summary = summarizeDosage([10, 20, 30]);
    expect(summary.average).toBe(20);
    expect(summary.median).toBe(20);
    expect(summary.trend).toMatchObject({ slope: 10, direction: "increasing" });
  });

  it("compares phases with causation warning", () => {
    expect(
      phaseComparison(
        [
          { phaseId: "baseline", value: 5, status: "finalized" },
          { phaseId: "baseline", value: 7, status: "finalized" },
          { phaseId: "implementation", value: 9, status: "corrected" },
          { phaseId: "implementation", value: null, status: "finalized" },
        ],
        "baseline",
        "implementation",
      ),
    ).toMatchObject({
      phaseA: { count: 2, mean: 6 },
      phaseB: { count: 1, mean: 9 },
      difference: 3,
      warning: CAUSATION_WARNING,
    });
  });
});
