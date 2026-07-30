import type { DataSufficiency } from "@/lib/analytics/calculations";

export const SYSTEM_SUMMARY_LABEL = "System-generated draft language - educator review required";

export type ReportingObservationStats = {
  count: number;
  dateRange?: { start: string | null; end: string | null };
  mean?: number | null;
  median?: number | null;
  trendDirection?:
    "improving" | "declining" | "stable" | "increasing" | "decreasing" | "unavailable";
  trendValue?: number | null;
  sufficiency?:
    DataSufficiency | { status: "sufficient" | "limited" | "insufficient"; reason: string };
  measurementLabel?: string;
  latestValue?: number | null;
  promptSummary?: string | null;
  generalizationSummary?: string | null;
  maintenanceSummary?: string | null;
};

export type DraftProgressSummary = {
  label: typeof SYSTEM_SUMMARY_LABEL;
  summary: string;
  dataSufficiencyStatus: "sufficient" | "limited" | "insufficient";
};

function formatMetric(label: string, value: number | null | undefined): string | null {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return `${label} ${value}`;
}

function sufficiencyStatus(
  stats: ReportingObservationStats,
): DraftProgressSummary["dataSufficiencyStatus"] {
  if (stats.count <= 0) return "insufficient";
  if (stats.sufficiency?.status === "unavailable" || stats.sufficiency?.status === "insufficient") {
    return "insufficient";
  }
  if (stats.sufficiency?.status === "limited" || stats.count < 3) return "limited";
  return "sufficient";
}

function trendPhrase(
  direction: ReportingObservationStats["trendDirection"],
  value: number | null | undefined,
): string | null {
  if (!direction || direction === "unavailable" || value === null || value === undefined)
    return null;
  if (direction === "stable") return "The calculated trend is stable across the available data.";
  return `The calculated trend is ${direction} with a slope of ${value}.`;
}

export function buildProgressReportDraftSummary(
  stats: ReportingObservationStats,
): DraftProgressSummary {
  const status = sufficiencyStatus(stats);
  if (status === "insufficient") {
    return {
      label: SYSTEM_SUMMARY_LABEL,
      dataSufficiencyStatus: status,
      summary:
        "Available finalized/corrected evidence is insufficient for a progress summary. Add educator-reviewed narrative before sharing.",
    };
  }

  const range =
    stats.dateRange?.start && stats.dateRange.end
      ? ` from ${stats.dateRange.start} through ${stats.dateRange.end}`
      : "";
  const metricLabel = stats.measurementLabel ?? "measurement";
  const metrics = [
    formatMetric("mean", stats.mean),
    formatMetric("median", stats.median),
    formatMetric("latest value", stats.latestValue),
  ].filter((part): part is string => Boolean(part));
  const trend = trendPhrase(stats.trendDirection, stats.trendValue);
  const details = [
    `Across ${stats.count} finalized/corrected ${metricLabel} observations${range}, ${
      metrics.length > 0 ? metrics.join(", ") : "numeric summary values were not available"
    }.`,
    trend,
    stats.promptSummary,
    stats.generalizationSummary,
    stats.maintenanceSummary,
    status === "limited"
      ? "Data sufficiency is limited; educator review is required before use."
      : null,
  ].filter((part): part is string => Boolean(part));

  return {
    label: SYSTEM_SUMMARY_LABEL,
    dataSufficiencyStatus: status,
    summary: details.join(" "),
  };
}
