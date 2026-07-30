import { describe, expect, it } from "vitest";
import {
  aimLine,
  assertCompatibleUnits,
  calculatePercentage,
  calculateRate,
  calculateReadingAccuracy,
  calculateWordsCorrectPerMinute,
  comparePhases,
  describeSeries,
  groupBySetting,
  linearTrend,
  mean,
  median,
  movingAverage,
  promptLevelDistribution,
  range,
  rateOfImprovement,
  standardDeviation,
  summarizeTaskAnalysis,
  type ObservationPoint,
} from "@/lib/analytics/calculations";

const points: ObservationPoint[] = [
  {
    date: "2026-01-01",
    value: 20,
    measurementType: "percentage",
    status: "finalized",
    phaseId: "baseline",
    setting: "classroom",
    promptLevel: "verbal",
  },
  {
    date: "2026-01-01",
    value: 30,
    measurementType: "percentage",
    status: "finalized",
    phaseId: "baseline",
    setting: "classroom",
    promptLevel: "verbal",
  },
  {
    date: "2026-01-08",
    value: 40,
    measurementType: "percentage",
    status: "draft",
    phaseId: "intervention",
    setting: "therapy",
    promptLevel: "model",
  },
  {
    date: "2026-01-15",
    value: 50,
    measurementType: "percentage",
    status: "corrected",
    phaseId: "intervention",
    setting: "therapy",
    promptLevel: "model",
  },
  {
    date: "2026-01-22",
    value: null,
    measurementType: "percentage",
    status: "finalized",
    phaseId: "maintenance",
    setting: "home",
    promptLevel: "none",
  },
  {
    date: "2026-02-01",
    value: 60,
    measurementType: "percentage",
    status: "finalized",
    phaseId: "generalization",
    setting: "community",
    promptLevel: "none",
  },
];

describe("analytics calculations", () => {
  it("calculates percentage and rejects invalid counts", () => {
    expect(calculatePercentage(3, 4)).toBe(75);
    expect(() => calculatePercentage(5, 0)).toThrow("total opportunities");
    expect(() => calculatePercentage(5, 4)).toThrow("correct count");
  });

  it("calculates rate per minute and per hour", () => {
    expect(calculateRate(10, 120)).toBe(5);
    expect(calculateRate(2, 3600, "per_hour")).toBe(2);
    expect(() => calculateRate(1, 0)).toThrow("duration");
  });

  it("calculates wcpm and reading accuracy", () => {
    expect(calculateWordsCorrectPerMinute(100, 5, 60)).toBe(95);
    expect(calculateWordsCorrectPerMinute(5, 10, 60)).toBe(0);
    expect(calculateReadingAccuracy(18, 20)).toBe(90);
  });

  it("summarizes task analysis steps", () => {
    expect(
      summarizeTaskAnalysis(["independent", "prompted", "incorrect", "not_attempted"]),
    ).toEqual({
      independent: 1,
      prompted: 1,
      incorrect: 1,
      notAttempted: 1,
      total: 4,
    });
  });

  it("calculates descriptive statistics", () => {
    expect(mean([1, 2, 3, 4])).toBe(2.5);
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(range([4, 1, 3, 2])).toEqual({ min: 1, max: 4, range: 3 });
    expect(standardDeviation([2, 4, 4, 4, 5, 5, 7, 9])).toBe(2.1381);
    expect(mean([])).toBeNull();
    expect(median([])).toBeNull();
    expect(range([])).toBeNull();
    expect(standardDeviation([1])).toBeNull();
  });

  it("calculates trend and ROI with higher-is-better direction", () => {
    expect(
      linearTrend([
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
      ]),
    ).toEqual({ slope: 2, intercept: 0 });
    expect(rateOfImprovement(points, true)).toMatchObject({
      value: 14,
      direction: "improving",
      sufficiency: { status: "ok" },
    });
  });

  it("supports lower-is-better direction", () => {
    const latency: ObservationPoint[] = [
      { date: "2026-01-01", value: 12, measurementType: "latency", status: "finalized" },
      { date: "2026-01-02", value: 10, measurementType: "latency", status: "finalized" },
      { date: "2026-01-03", value: 8, measurementType: "latency", status: "finalized" },
    ];
    expect(rateOfImprovement(latency, false).direction).toBe("improving");
  });

  it("returns unavailable trend for zero or one finalized point", () => {
    expect(rateOfImprovement([], true).sufficiency.status).toBe("unavailable");
    expect(
      rateOfImprovement(
        [{ date: "2026-01-01", value: 1, measurementType: "rate", status: "finalized" }],
        true,
      ).sufficiency.status,
    ).toBe("unavailable");
  });

  it("calculates aim lines and handles missing or invalid dates", () => {
    expect(
      aimLine({
        baseline: 10,
        target: 30,
        startDate: "2026-01-01",
        targetDate: "2026-01-11",
        onDate: "2026-01-06",
      }),
    ).toEqual({ value: 20, sufficiency: { status: "ok" } });
    expect(
      aimLine({
        baseline: 10,
        target: 30,
        startDate: "",
        targetDate: "2026-01-11",
        onDate: "2026-01-06",
      }).sufficiency.status,
    ).toBe("unavailable");
    expect(
      aimLine({
        baseline: 10,
        target: 30,
        startDate: "2026-01-11",
        targetDate: "2026-01-01",
        onDate: "2026-01-06",
      }).sufficiency.status,
    ).toBe("unavailable");
  });

  it("calculates moving averages", () => {
    expect(movingAverage([10, 20, 30, 40], 3)).toEqual([10, 15, 20, 30]);
    expect(() => movingAverage([1], 0)).toThrow("window");
  });

  it("compares intervention phases", () => {
    expect(comparePhases(points, "baseline", "intervention")).toEqual({
      phaseA: { count: 2, mean: 25 },
      phaseB: { count: 1, mean: 50 },
      sufficiency: { status: "ok" },
    });
    expect(comparePhases(points, "baseline", "missing").sufficiency.status).toBe("unavailable");
  });

  it("summarizes prompt distribution, generalization, and maintenance settings", () => {
    expect(promptLevelDistribution(points)).toEqual({ verbal: 2, model: 1, none: 2 });
    expect(groupBySetting(points)).toEqual({
      classroom: [20, 30],
      therapy: [50],
      community: [60],
    });
  });

  it("excludes drafts and handles duplicate dates in series descriptions", () => {
    const described = describeSeries(points);
    expect(described.count).toBe(4);
    expect(described.dateRange).toEqual({ start: "2026-01-01", end: "2026-02-01" });
    expect(described.values).toEqual([20, 30, 50, 60]);
  });

  it("rejects incompatible units and excludes draft-only data", () => {
    expect(
      assertCompatibleUnits([
        { date: "2026-01-01", value: 1, measurementType: "percentage", status: "finalized" },
        { date: "2026-01-02", value: 1, measurementType: "rate", status: "finalized" },
      ]).status,
    ).toBe("unavailable");
    expect(
      describeSeries([{ date: "2026-01-01", value: 1, measurementType: "rate", status: "draft" }])
        .sufficiency.status,
    ).toBe("unavailable");
  });

  it("detects negative trends for higher-is-better measures", () => {
    const declining: ObservationPoint[] = [
      { date: "2026-01-01", value: 90, measurementType: "percentage", status: "finalized" },
      { date: "2026-01-08", value: 70, measurementType: "percentage", status: "finalized" },
      { date: "2026-01-15", value: 50, measurementType: "percentage", status: "finalized" },
    ];
    expect(rateOfImprovement(declining, true).direction).toBe("declining");
  });

  it("excludes archived observations from series analytics", () => {
    const withArchived: ObservationPoint[] = [
      { date: "2026-01-01", value: 10, measurementType: "frequency", status: "finalized" },
      { date: "2026-01-02", value: 999, measurementType: "frequency", status: "archived" },
      { date: "2026-01-03", value: 20, measurementType: "frequency", status: "finalized" },
      { date: "2026-01-04", value: 30, measurementType: "frequency", status: "finalized" },
    ];
    expect(describeSeries(withArchived).values).toEqual([10, 20, 30]);
  });

  it("does not invent zero values for null observations", () => {
    const withNull: ObservationPoint[] = [
      { date: "2026-01-01", value: null, measurementType: "percentage", status: "finalized" },
      { date: "2026-01-02", value: 40, measurementType: "percentage", status: "finalized" },
    ];
    expect(describeSeries(withNull).values).toEqual([40]);
    expect(mean(describeSeries(withNull).values ?? [])).toBe(40);
  });
});
