import {
  calculateIntervalPercentage,
  calculateRate,
  comparePhases,
  groupByDayOfWeek,
  groupByField,
  groupByTimeOfDay,
  intensityDistribution,
  replacementRate,
  summarizeLatency,
  trend,
  type BehaviorObservationPoint,
} from "@/lib/analytics/behavior-calculations";
import type { BehaviorData } from "@/lib/data/behavior";

export function toBehaviorObservationPoints(data: BehaviorData): BehaviorObservationPoint[] {
  return data.sessions.map((session) => {
    const abc = data.abc.find((entry) => entry.session_id === session.id);
    const frequency = data.frequency.find((entry) => entry.session_id === session.id);
    const duration = data.duration.find((entry) => entry.session_id === session.id);
    const latency = data.latency.find((entry) => entry.session_id === session.id);
    const interval = data.interval.find((entry) => entry.session_id === session.id);
    const intensity = data.intensityRatings.find((entry) => entry.session_id === session.id);
    const level = intensity
      ? data.intensityLevels.find((entry) => entry.id === intensity.intensity_level_id)
      : null;
    const antecedent = data.abcAssignments.find(
      (entry) => entry.session_id === session.id && entry.category_type === "antecedent",
    );
    const consequence = data.abcAssignments.find(
      (entry) => entry.session_id === session.id && entry.category_type === "consequence",
    );

    return {
      id: session.id,
      date: session.session_date,
      time: session.session_time,
      status: session.status,
      setting: session.setting,
      activity: session.activity,
      count: frequency?.count ?? null,
      observationDurationSeconds: frequency?.observation_duration_seconds ?? null,
      totalDurationSeconds: duration?.total_duration_seconds ?? abc?.duration_seconds ?? null,
      episodeCount: duration?.episode_count ?? null,
      latencySeconds: latency?.latency_seconds ?? null,
      intervalCount: interval?.interval_count ?? null,
      intervalsPositive: interval?.intervals_positive ?? null,
      intensityLevel: level?.level_number ?? null,
      antecedentCategory: antecedent?.category_code ?? null,
      consequenceCategory: consequence?.category_code ?? null,
      replacementObserved: abc?.replacement_observed ?? null,
    };
  });
}

export function summarizeBehaviorAnalytics(data: BehaviorData) {
  const points = toBehaviorObservationPoints(data);
  const rates = points.map((point) => calculateRate(point.count, point.observationDurationSeconds));
  const intervalPercentages = points.map((point) =>
    calculateIntervalPercentage(point.intervalsPositive, point.intervalCount),
  );
  return {
    points,
    rates,
    intervalPercentages,
    latency: summarizeLatency(points),
    intensityDistribution: intensityDistribution(points),
    timeOfDay: groupByTimeOfDay(points),
    dayOfWeek: groupByDayOfWeek(points),
    bySetting: groupByField(points, "setting"),
    byActivity: groupByField(points, "activity"),
    replacement: replacementRate(points),
    rateTrend: trend(rates.filter((value): value is number => value !== null)),
  };
}

export function compareBehaviorPhases(data: BehaviorData, phaseA: string, phaseB: string) {
  return comparePhases(
    toBehaviorObservationPoints(data),
    phaseA,
    phaseB,
    (point) => calculateRate(point.count, point.observationDurationSeconds),
  );
}
