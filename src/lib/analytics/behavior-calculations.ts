export type DataSufficiencyStatus = "sufficient" | "limited" | "insufficient";

export type DataSufficiencyResult = {
  status: DataSufficiencyStatus;
  reason: string;
  usableCount: number;
};

export type BehaviorObservationPoint = {
  id?: string;
  date: string;
  time?: string | null;
  status?: "draft" | "finalized" | "corrected" | "archived";
  phaseId?: string | null;
  setting?: string | null;
  activity?: string | null;
  count?: number | null;
  observationDurationSeconds?: number | null;
  totalDurationSeconds?: number | null;
  episodeCount?: number | null;
  latencySeconds?: number | null;
  intervalCount?: number | null;
  intervalsPositive?: number | null;
  intensityLevel?: string | number | null;
  antecedentCategory?: string | null;
  consequenceCategory?: string | null;
  replacementObserved?: boolean | null;
};

export type PhaseComparison = {
  phaseA: { id: string; count: number; mean: number | null };
  phaseB: { id: string; count: number; mean: number | null };
  difference: number | null;
  sufficiency: DataSufficiencyResult;
};

function round(value: number, places = 4): number {
  return Number(value.toFixed(places));
}

function finalizedOnly(points: BehaviorObservationPoint[]): BehaviorObservationPoint[] {
  return points.filter((point) => point.status === "finalized" || point.status === "corrected");
}

function numericValues(values: Array<number | null | undefined>): number[] {
  return values.filter(
    (value): value is number => typeof value === "number" && Number.isFinite(value),
  );
}

export function assessDataSufficiency(
  usableCount: number,
  minimum = 3,
  label = "observations",
): DataSufficiencyResult {
  if (usableCount >= minimum) {
    return {
      status: "sufficient",
      reason: `${usableCount} usable ${label} available.`,
      usableCount,
    };
  }
  if (usableCount > 0) {
    return {
      status: "limited",
      reason: `${usableCount} usable ${label}; interpret calculated summaries cautiously.`,
      usableCount,
    };
  }
  return { status: "insufficient", reason: `No usable ${label} available.`, usableCount };
}

export function calculateRate(
  count: number | null | undefined,
  durationSeconds: number | null | undefined,
): number | null {
  if (typeof count !== "number" || typeof durationSeconds !== "number" || durationSeconds <= 0)
    return null;
  return round((count / durationSeconds) * 60);
}

export function calculateDurationAverage(
  totalDurationSeconds: number | null | undefined,
  episodeCount: number | null | undefined,
): number | null {
  if (
    typeof totalDurationSeconds !== "number" ||
    typeof episodeCount !== "number" ||
    episodeCount <= 0
  ) {
    return null;
  }
  return round(totalDurationSeconds / episodeCount);
}

export function median(values: number[]): number | null {
  const usable = numericValues(values);
  if (usable.length === 0) return null;
  const sorted = [...usable].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return round((sorted[mid - 1] + sorted[mid]) / 2);
  return sorted[mid];
}

export function mean(values: number[]): number | null {
  const usable = numericValues(values);
  if (usable.length === 0) return null;
  return round(usable.reduce((sum, value) => sum + value, 0) / usable.length);
}

export function summarizeLatency(points: BehaviorObservationPoint[]): {
  averageSeconds: number | null;
  medianSeconds: number | null;
  sufficiency: DataSufficiencyResult;
} {
  const values = numericValues(finalizedOnly(points).map((point) => point.latencySeconds));
  return {
    averageSeconds: mean(values),
    medianSeconds: median(values),
    sufficiency: assessDataSufficiency(values.length, 3, "latency observations"),
  };
}

export function calculateIntervalPercentage(
  intervalsPositive: number | null | undefined,
  intervalCount: number | null | undefined,
): number | null {
  if (
    typeof intervalsPositive !== "number" ||
    typeof intervalCount !== "number" ||
    intervalCount <= 0 ||
    intervalsPositive < 0 ||
    intervalsPositive > intervalCount
  ) {
    return null;
  }
  return round((intervalsPositive / intervalCount) * 100);
}

export function intensityDistribution(points: BehaviorObservationPoint[]): Record<string, number> {
  return finalizedOnly(points).reduce<Record<string, number>>((acc, point) => {
    if (point.intensityLevel === null || point.intensityLevel === undefined) return acc;
    const key = String(point.intensityLevel);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export function groupByTimeOfDay(points: BehaviorObservationPoint[]): Record<string, number> {
  return finalizedOnly(points).reduce<Record<string, number>>((acc, point) => {
    if (!point.time) return acc;
    const hour = Number(point.time.slice(0, 2));
    if (Number.isNaN(hour)) return acc;
    const key =
      hour < 11 ? "morning" : hour < 14 ? "midday" : hour < 17 ? "afternoon" : "after_school";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export function groupByDayOfWeek(points: BehaviorObservationPoint[]): Record<string, number> {
  const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" });
  return finalizedOnly(points).reduce<Record<string, number>>((acc, point) => {
    const time = Date.parse(`${point.date}T00:00:00Z`);
    if (Number.isNaN(time)) return acc;
    const key = formatter.format(new Date(time));
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export function groupByField(
  points: BehaviorObservationPoint[],
  field: "setting" | "activity",
): Record<string, number> {
  return finalizedOnly(points).reduce<Record<string, number>>((acc, point) => {
    const key = point[field]?.trim() || "unspecified";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export function abcCategoryCounts(
  points: BehaviorObservationPoint[],
  field: "antecedentCategory" | "consequenceCategory",
): Record<string, number> {
  return finalizedOnly(points).reduce<Record<string, number>>((acc, point) => {
    const key = point[field]?.trim();
    if (!key) return acc;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export function replacementRate(points: BehaviorObservationPoint[]): {
  percentage: number | null;
  observed: number;
  total: number;
  sufficiency: DataSufficiencyResult;
} {
  const usable = finalizedOnly(points).filter(
    (point) => typeof point.replacementObserved === "boolean",
  );
  const observed = usable.filter((point) => point.replacementObserved).length;
  return {
    percentage: usable.length === 0 ? null : round((observed / usable.length) * 100),
    observed,
    total: usable.length,
    sufficiency: assessDataSufficiency(usable.length, 3, "replacement behavior observations"),
  };
}

export function movingAverage(values: number[], window = 3): Array<number | null> {
  if (window <= 0) throw new Error("window must be positive");
  return values.map((_, index) => {
    const slice = values.slice(Math.max(0, index - window + 1), index + 1);
    return mean(slice);
  });
}

export function trend(values: number[]): {
  slope: number | null;
  direction: "increasing" | "decreasing" | "stable" | "unavailable";
  sufficiency: DataSufficiencyResult;
} {
  const usable = numericValues(values);
  if (usable.length < 3) {
    return {
      slope: null,
      direction: "unavailable",
      sufficiency: assessDataSufficiency(usable.length, 3, "numeric observations"),
    };
  }
  const n = usable.length;
  const sumX = usable.reduce((sum, _value, index) => sum + index + 1, 0);
  const sumY = usable.reduce((sum, value) => sum + value, 0);
  const sumXY = usable.reduce((sum, value, index) => sum + (index + 1) * value, 0);
  const sumXX = usable.reduce((sum, _value, index) => sum + (index + 1) ** 2, 0);
  const denominator = n * sumXX - sumX ** 2;
  if (denominator === 0) {
    return {
      slope: null,
      direction: "unavailable",
      sufficiency: {
        status: "insufficient",
        reason: "Trend denominator was zero.",
        usableCount: usable.length,
      },
    };
  }
  const slope = round((n * sumXY - sumX * sumY) / denominator, 6);
  return {
    slope,
    direction: slope > 0.0001 ? "increasing" : slope < -0.0001 ? "decreasing" : "stable",
    sufficiency: assessDataSufficiency(usable.length, 3, "numeric observations"),
  };
}

export function comparePhases(
  points: BehaviorObservationPoint[],
  phaseA: string,
  phaseB: string,
  valueSelector: (point: BehaviorObservationPoint) => number | null | undefined,
): PhaseComparison {
  const usable = finalizedOnly(points);
  const aValues = numericValues(
    usable.filter((point) => point.phaseId === phaseA).map(valueSelector),
  );
  const bValues = numericValues(
    usable.filter((point) => point.phaseId === phaseB).map(valueSelector),
  );
  const phaseAMean = mean(aValues);
  const phaseBMean = mean(bValues);
  return {
    phaseA: { id: phaseA, count: aValues.length, mean: phaseAMean },
    phaseB: { id: phaseB, count: bValues.length, mean: phaseBMean },
    difference: phaseAMean === null || phaseBMean === null ? null : round(phaseBMean - phaseAMean),
    sufficiency:
      aValues.length > 0 && bValues.length > 0
        ? assessDataSufficiency(aValues.length + bValues.length, 4, "phase observations")
        : {
            status: "insufficient",
            reason: "Both phases need usable observations.",
            usableCount: aValues.length + bValues.length,
          },
  };
}
