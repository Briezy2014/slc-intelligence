import { describe, expect, it } from "vitest";
import {
  abcCategoryCounts,
  assessDataSufficiency,
  calculateDurationAverage,
  calculateIntervalPercentage,
  calculateRate,
  comparePhases,
  groupByDayOfWeek,
  groupByField,
  groupByTimeOfDay,
  intensityDistribution,
  median,
  movingAverage,
  replacementRate,
  summarizeLatency,
  trend,
  type BehaviorObservationPoint,
} from "@/lib/analytics/behavior-calculations";

const observations: BehaviorObservationPoint[] = [
  {
    date: "2026-01-05",
    time: "09:15:00",
    status: "finalized",
    phaseId: "baseline",
    setting: "Math",
    activity: "Independent work",
    latencySeconds: 10,
    intensityLevel: 1,
    antecedentCategory: "task",
    consequenceCategory: "attention",
    replacementObserved: false,
    count: 6,
    observationDurationSeconds: 300,
  },
  {
    date: "2026-01-06",
    time: "12:30:00",
    status: "corrected",
    phaseId: "baseline",
    setting: "Math",
    activity: "Independent work",
    latencySeconds: 20,
    intensityLevel: 2,
    antecedentCategory: "task",
    consequenceCategory: "escape",
    replacementObserved: true,
    count: 3,
    observationDurationSeconds: 180,
  },
  {
    date: "2026-01-07",
    time: "15:05:00",
    status: "finalized",
    phaseId: "intervention",
    setting: "Reading",
    activity: "Small group",
    latencySeconds: 30,
    intensityLevel: 2,
    antecedentCategory: "transition",
    consequenceCategory: "attention",
    replacementObserved: true,
    count: 2,
    observationDurationSeconds: 120,
  },
  {
    date: "2026-01-08",
    time: "17:10:00",
    status: "draft",
    phaseId: "intervention",
    setting: "Reading",
    activity: "Small group",
    latencySeconds: 90,
    intensityLevel: 3,
    replacementObserved: false,
  },
];

describe("behavior calculations", () => {
  it("calculates rate, average duration, median, and interval percentage", () => {
    expect(calculateRate(6, 300)).toBe(1.2);
    expect(calculateDurationAverage(90, 3)).toBe(30);
    expect(median([30, 10, 20])).toBe(20);
    expect(calculateIntervalPercentage(7, 10)).toBe(70);
    expect(calculateRate(2, 0)).toBeNull();
  });

  it("summarizes latency and distributions from finalized/corrected observations only", () => {
    expect(summarizeLatency(observations)).toEqual({
      averageSeconds: 20,
      medianSeconds: 20,
      sufficiency: {
        status: "sufficient",
        reason: "3 usable latency observations available.",
        usableCount: 3,
      },
    });
    expect(intensityDistribution(observations)).toEqual({ "1": 1, "2": 2 });
    expect(groupByTimeOfDay(observations)).toEqual({ morning: 1, midday: 1, afternoon: 1 });
    expect(groupByDayOfWeek(observations)).toEqual({ Mon: 1, Tue: 1, Wed: 1 });
    expect(groupByField(observations, "setting")).toEqual({ Math: 2, Reading: 1 });
  });

  it("counts ABC categories and replacement behavior rate", () => {
    expect(abcCategoryCounts(observations, "antecedentCategory")).toEqual({
      task: 2,
      transition: 1,
    });
    expect(abcCategoryCounts(observations, "consequenceCategory")).toEqual({
      attention: 2,
      escape: 1,
    });
    expect(replacementRate(observations)).toEqual({
      percentage: 66.6667,
      observed: 2,
      total: 3,
      sufficiency: {
        status: "sufficient",
        reason: "3 usable replacement behavior observations available.",
        usableCount: 3,
      },
    });
  });

  it("computes trend, moving average, phase comparison, and sufficiency", () => {
    expect(trend([5, 4, 3, 2])).toMatchObject({ slope: -1, direction: "decreasing" });
    expect(movingAverage([2, 4, 10], 2)).toEqual([2, 3, 7]);
    expect(
      comparePhases(observations, "baseline", "intervention", (point) => point.count),
    ).toMatchObject({
      phaseA: { count: 2, mean: 4.5 },
      phaseB: { count: 1, mean: 2 },
      difference: -2.5,
    });
    expect(assessDataSufficiency(1, 3).status).toBe("limited");
  });
});
