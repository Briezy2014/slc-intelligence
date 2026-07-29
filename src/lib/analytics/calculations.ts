export type MeasurementType =
  | "percentage"
  | "frequency"
  | "rate"
  | "duration"
  | "latency"
  | "rubric"
  | "prompt_level"
  | "task_analysis"
  | "reading_fluency"
  | "reading_accuracy"
  | "independence"
  | "custom_numeric";

export type ObservationPoint = {
  date: string;
  value: number | null;
  measurementType: MeasurementType;
  phaseId?: string | null;
  setting?: string | null;
  promptLevel?: string | null;
  status?: "draft" | "finalized" | "corrected" | "archived";
};

export type DataSufficiency =
  | { status: "ok"; reason?: undefined }
  | { status: "unavailable"; reason: string };

function finalizedOnly(points: ObservationPoint[]): ObservationPoint[] {
  return points.filter((point) => !point.status || point.status === "finalized" || point.status === "corrected");
}

export function calculatePercentage(correct: number, total: number): number {
  if (total <= 0) throw new Error("total opportunities must be greater than zero");
  if (correct < 0 || correct > total) throw new Error("correct count is out of range");
  return Number(((correct / total) * 100).toFixed(4));
}

export function calculateRate(count: number, durationSeconds: number, unit = "per_minute"): number {
  if (durationSeconds <= 0) throw new Error("duration must be greater than zero");
  if (unit === "per_minute") return Number(((count / durationSeconds) * 60).toFixed(4));
  if (unit === "per_hour") return Number(((count / durationSeconds) * 3600).toFixed(4));
  throw new Error("unsupported rate unit");
}

export function calculateWordsCorrectPerMinute(
  wordsRead: number,
  errors: number,
  timeSeconds: number,
): number {
  if (timeSeconds <= 0) throw new Error("reading time must be greater than zero");
  const correct = Math.max(wordsRead - errors, 0);
  return Number(((correct / timeSeconds) * 60).toFixed(4));
}

export function calculateReadingAccuracy(correct: number, total: number): number {
  return calculatePercentage(correct, total);
}

export function summarizeTaskAnalysis(steps: Array<"independent" | "prompted" | "incorrect" | "not_attempted">) {
  return {
    independent: steps.filter((step) => step === "independent").length,
    prompted: steps.filter((step) => step === "prompted").length,
    incorrect: steps.filter((step) => step === "incorrect").length,
    notAttempted: steps.filter((step) => step === "not_attempted").length,
    total: steps.length,
  };
}

export function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4));
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(4));
  return sorted[mid];
}

export function range(values: number[]): { min: number; max: number; range: number } | null {
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return { min, max, range: Number((max - min).toFixed(4)) };
}

export function standardDeviation(values: number[]): number | null {
  if (values.length < 2) return null;
  const avg = mean(values);
  if (avg === null) return null;
  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / (values.length - 1);
  return Number(Math.sqrt(variance).toFixed(4));
}

export function linearTrend(points: Array<{ x: number; y: number }>): {
  slope: number;
  intercept: number;
} | null {
  if (points.length < 3) return null;
  const n = points.length;
  const sumX = points.reduce((sum, point) => sum + point.x, 0);
  const sumY = points.reduce((sum, point) => sum + point.y, 0);
  const sumXY = points.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumXX = points.reduce((sum, point) => sum + point.x * point.x, 0);
  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return null;
  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  return { slope: Number(slope.toFixed(6)), intercept: Number(intercept.toFixed(6)) };
}

export function rateOfImprovement(
  points: ObservationPoint[],
  higherIsBetter: boolean,
): { value: number; direction: "improving" | "declining" | "stable"; sufficiency: DataSufficiency } {
  const usable = finalizedOnly(points).filter((point) => point.value !== null);
  if (usable.length < 3) {
    return {
      value: 0,
      direction: "stable",
      sufficiency: { status: "unavailable", reason: "Too few observations for trend calculation" },
    };
  }
  const typed = usable.map((point, index) => ({ x: index + 1, y: point.value as number }));
  const trend = linearTrend(typed);
  if (!trend) {
    return {
      value: 0,
      direction: "stable",
      sufficiency: { status: "unavailable", reason: "Trend could not be calculated" },
    };
  }
  const improving =
    (higherIsBetter && trend.slope > 0.0001) || (!higherIsBetter && trend.slope < -0.0001);
  const declining =
    (higherIsBetter && trend.slope < -0.0001) || (!higherIsBetter && trend.slope > 0.0001);
  return {
    value: trend.slope,
    direction: improving ? "improving" : declining ? "declining" : "stable",
    sufficiency: { status: "ok" },
  };
}

export function aimLine(args: {
  baseline: number;
  target: number;
  startDate: string;
  targetDate: string;
  onDate: string;
}): { value: number; sufficiency: DataSufficiency } {
  const start = Date.parse(args.startDate);
  const end = Date.parse(args.targetDate);
  const current = Date.parse(args.onDate);
  if (Number.isNaN(start) || Number.isNaN(end) || Number.isNaN(current) || end <= start) {
    return {
      value: Number.NaN,
      sufficiency: { status: "unavailable", reason: "Aim line requires valid baseline, target, and dates" },
    };
  }
  const progress = Math.min(Math.max((current - start) / (end - start), 0), 1);
  return {
    value: Number((args.baseline + (args.target - args.baseline) * progress).toFixed(4)),
    sufficiency: { status: "ok" },
  };
}

export function movingAverage(values: number[], window = 3): number[] {
  if (window <= 0) throw new Error("window must be positive");
  return values.map((_, index) => {
    const slice = values.slice(Math.max(0, index - window + 1), index + 1);
    return mean(slice) ?? 0;
  });
}

export function promptLevelDistribution(points: ObservationPoint[]): Record<string, number> {
  return finalizedOnly(points).reduce<Record<string, number>>((acc, point) => {
    const key = point.promptLevel ?? "unspecified";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export function groupBySetting(points: ObservationPoint[]): Record<string, number[]> {
  return finalizedOnly(points).reduce<Record<string, number[]>>((acc, point) => {
    if (point.value === null) return acc;
    const key = point.setting ?? "unspecified";
    acc[key] = [...(acc[key] ?? []), point.value];
    return acc;
  }, {});
}

export function comparePhases(
  points: ObservationPoint[],
  phaseA: string,
  phaseB: string,
): {
  phaseA: { count: number; mean: number | null };
  phaseB: { count: number; mean: number | null };
  sufficiency: DataSufficiency;
} {
  const a = finalizedOnly(points).filter((point) => point.phaseId === phaseA && point.value !== null);
  const b = finalizedOnly(points).filter((point) => point.phaseId === phaseB && point.value !== null);
  const sufficiency: DataSufficiency =
    a.length === 0 || b.length === 0
      ? { status: "unavailable", reason: "Both phases need at least one finalized observation" }
      : { status: "ok" };
  return {
    phaseA: { count: a.length, mean: mean(a.map((point) => point.value as number)) },
    phaseB: { count: b.length, mean: mean(b.map((point) => point.value as number)) },
    sufficiency,
  };
}

export function assertCompatibleUnits(points: ObservationPoint[]): DataSufficiency {
  const types = new Set(finalizedOnly(points).map((point) => point.measurementType));
  if (types.size > 1) {
    return {
      status: "unavailable",
      reason: "Incompatible measurement types cannot be combined",
    };
  }
  return { status: "ok" };
}

export function describeSeries(points: ObservationPoint[]): {
  count: number;
  dateRange: { start: string | null; end: string | null };
  values: number[];
  mean: number | null;
  median: number | null;
  range: { min: number; max: number; range: number } | null;
  standardDeviation: number | null;
  sufficiency: DataSufficiency;
} {
  const usable = finalizedOnly(points).filter((point) => point.value !== null);
  const compatibility = assertCompatibleUnits(points);
  if (compatibility.status === "unavailable") {
    return {
      count: 0,
      dateRange: { start: null, end: null },
      values: [],
      mean: null,
      median: null,
      range: null,
      standardDeviation: null,
      sufficiency: compatibility,
    };
  }
  const values = usable.map((point) => point.value as number);
  const dates = usable.map((point) => point.date).sort();
  return {
    count: values.length,
    dateRange: { start: dates[0] ?? null, end: dates[dates.length - 1] ?? null },
    values,
    mean: mean(values),
    median: median(values),
    range: range(values),
    standardDeviation: standardDeviation(values),
    sufficiency:
      values.length === 0
        ? { status: "unavailable", reason: "No finalized observations" }
        : { status: "ok" },
  };
}
