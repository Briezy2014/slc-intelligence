import {
  mean,
  median,
  trend,
  type DataSufficiencyResult,
} from "@/lib/analytics/behavior-calculations";

export type FidelityResponse = "yes" | "partial" | "no" | "not_observed";

export type FidelityItemResult = {
  componentId?: string | null;
  response: FidelityResponse;
};

export type DosagePlan = {
  plannedSessions?: number | null;
  plannedMinutes?: number | null;
};

export type DosageDelivered = {
  sessionsDelivered?: number | null;
  durationMinutes?: number | null;
};

export type InterventionPhasePoint = {
  phaseId: string;
  value: number | null;
  status?: "draft" | "finalized" | "corrected" | "archived";
};

export const CAUSATION_WARNING =
  "Phase comparisons describe observed differences only; they do not establish cause and should be reviewed by the educational team.";

function round(value: number, places = 4): number {
  return Number(value.toFixed(places));
}

function scoreResponse(response: FidelityResponse): number | null {
  if (response === "yes") return 1;
  if (response === "partial") return 0.5;
  if (response === "no") return 0;
  return null;
}

function sufficiency(usableCount: number, minimum: number, label: string): DataSufficiencyResult {
  if (usableCount >= minimum)
    return {
      status: "sufficient",
      reason: `${usableCount} usable ${label} available.`,
      usableCount,
    };
  if (usableCount > 0) {
    return {
      status: "limited",
      reason: `${usableCount} usable ${label}; educator review required.`,
      usableCount,
    };
  }
  return { status: "insufficient", reason: `No usable ${label} available.`, usableCount };
}

export function fidelityPercent(results: FidelityItemResult[]): {
  percent: number | null;
  scoredItems: number;
  possibleItems: number;
  sufficiency: DataSufficiencyResult;
} {
  const scores = results
    .map((result) => scoreResponse(result.response))
    .filter((score): score is number => score !== null);
  return {
    percent:
      scores.length === 0
        ? null
        : round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100),
    scoredItems: scores.length,
    possibleItems: results.length,
    sufficiency: sufficiency(scores.length, 1, "fidelity items"),
  };
}

export function componentFidelity(
  results: FidelityItemResult[],
): Record<string, { percent: number | null; scoredItems: number }> {
  const grouped = results.reduce<Record<string, FidelityItemResult[]>>((acc, result) => {
    const key = result.componentId ?? "unassigned";
    acc[key] = [...(acc[key] ?? []), result];
    return acc;
  }, {});

  return Object.fromEntries(
    Object.entries(grouped).map(([componentId, componentResults]) => {
      const summary = fidelityPercent(componentResults);
      return [componentId, { percent: summary.percent, scoredItems: summary.scoredItems }];
    }),
  );
}

export function dosagePercent(
  planned: number | null | undefined,
  delivered: number | null | undefined,
): number | null {
  if (typeof planned !== "number" || typeof delivered !== "number" || planned <= 0) return null;
  return round((delivered / planned) * 100);
}

export function plannedVsDelivered(
  planned: DosagePlan,
  delivered: DosageDelivered[],
): {
  plannedSessions: number | null;
  deliveredSessions: number;
  sessionPercent: number | null;
  plannedMinutes: number | null;
  deliveredMinutes: number;
  minutePercent: number | null;
} {
  const deliveredSessions = delivered.reduce((sum, log) => sum + (log.sessionsDelivered ?? 0), 0);
  const deliveredMinutes = delivered.reduce((sum, log) => sum + (log.durationMinutes ?? 0), 0);
  return {
    plannedSessions: planned.plannedSessions ?? null,
    deliveredSessions,
    sessionPercent: dosagePercent(planned.plannedSessions, deliveredSessions),
    plannedMinutes: planned.plannedMinutes ?? null,
    deliveredMinutes,
    minutePercent: dosagePercent(planned.plannedMinutes, deliveredMinutes),
  };
}

export function summarizeDosage(values: number[]): {
  average: number | null;
  median: number | null;
  trend: ReturnType<typeof trend>;
} {
  return {
    average: mean(values),
    median: median(values),
    trend: trend(values),
  };
}

export function phaseComparison(
  points: InterventionPhasePoint[],
  phaseA: string,
  phaseB: string,
): {
  phaseA: { id: string; count: number; mean: number | null };
  phaseB: { id: string; count: number; mean: number | null };
  difference: number | null;
  warning: string;
  sufficiency: DataSufficiencyResult;
} {
  const usable = points.filter(
    (point) =>
      point.value !== null &&
      (point.status === undefined || point.status === "finalized" || point.status === "corrected"),
  );
  const aValues = usable
    .filter((point) => point.phaseId === phaseA)
    .map((point) => point.value as number);
  const bValues = usable
    .filter((point) => point.phaseId === phaseB)
    .map((point) => point.value as number);
  const aMean = mean(aValues);
  const bMean = mean(bValues);
  return {
    phaseA: { id: phaseA, count: aValues.length, mean: aMean },
    phaseB: { id: phaseB, count: bValues.length, mean: bMean },
    difference: aMean === null || bMean === null ? null : round(bMean - aMean),
    warning: CAUSATION_WARNING,
    sufficiency:
      aValues.length > 0 && bValues.length > 0
        ? sufficiency(aValues.length + bValues.length, 4, "phase data points")
        : {
            status: "insufficient",
            reason: "Both phases need usable data points.",
            usableCount: aValues.length + bValues.length,
          },
  };
}
