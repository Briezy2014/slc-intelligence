export type ChecklistResponseValue = "yes" | "partial" | "no" | "not_observed" | "not_applicable";
export type PromptLevelValue =
  | "independent"
  | "visual"
  | "gestural"
  | "verbal"
  | "modeled"
  | "partial_physical"
  | "full_physical"
  | "not_observed"
  | "not_applicable";

export type PercentSummary = {
  percent: number | null;
  scoredCount: number;
  totalCount: number;
};

export function checklistCompletionPercent(
  responses: Array<{ response: ChecklistResponseValue | null | undefined }>,
): PercentSummary {
  const scored = responses.filter(
    (item) => item.response !== "not_applicable" && item.response !== "not_observed",
  );
  if (!scored.length) return { percent: null, scoredCount: 0, totalCount: responses.length };
  const points = scored.reduce((sum, item) => {
    if (item.response === "yes") return sum + 1;
    if (item.response === "partial") return sum + 0.5;
    return sum;
  }, 0);
  return {
    percent: Math.round((points / scored.length) * 100),
    scoredCount: scored.length,
    totalCount: responses.length,
  };
}

export function taskCompletionPercent(
  logs: Array<{
    completionStatus: "independent" | "prompted" | "partial" | "not_completed" | "not_applicable";
  }>,
): PercentSummary {
  const scored = logs.filter((log) => log.completionStatus !== "not_applicable");
  if (!scored.length) return { percent: null, scoredCount: 0, totalCount: logs.length };
  const completed = scored.filter((log) =>
    ["independent", "prompted", "partial"].includes(log.completionStatus),
  );
  return {
    percent: Math.round((completed.length / scored.length) * 100),
    scoredCount: scored.length,
    totalCount: logs.length,
  };
}

export function promptDistribution(
  observations: Array<{ promptLevel: PromptLevelValue | null | undefined }>,
): Record<PromptLevelValue, number> {
  const seed: Record<PromptLevelValue, number> = {
    independent: 0,
    visual: 0,
    gestural: 0,
    verbal: 0,
    modeled: 0,
    partial_physical: 0,
    full_physical: 0,
    not_observed: 0,
    not_applicable: 0,
  };
  return observations.reduce((counts, observation) => {
    if (observation.promptLevel) counts[observation.promptLevel] += 1;
    return counts;
  }, seed);
}

export function independencePercent(
  observations: Array<{ promptLevel: PromptLevelValue | null | undefined }>,
): PercentSummary {
  const scored = observations.filter(
    (observation) =>
      observation.promptLevel &&
      !["not_observed", "not_applicable"].includes(observation.promptLevel),
  );
  if (!scored.length) return { percent: null, scoredCount: 0, totalCount: observations.length };
  const independent = scored.filter((observation) => observation.promptLevel === "independent");
  return {
    percent: Math.round((independent.length / scored.length) * 100),
    scoredCount: scored.length,
    totalCount: observations.length,
  };
}

function timeToMinutes(value: string): number | null {
  const [hours, minutes] = value.split(":").map((part) => Number(part));
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
}

export function scheduleBlockDurationMinutes(
  startTime?: string | null,
  endTime?: string | null,
): number | null {
  if (!startTime || !endTime) return null;
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (start === null || end === null || end <= start) return null;
  return end - start;
}

export type ScheduleOverlap = {
  firstId: string;
  secondId: string;
};

export function detectScheduleOverlaps(
  blocks: Array<{ id: string; dayOfWeek: number | null; startTime: string; endTime: string }>,
): ScheduleOverlap[] {
  const overlaps: ScheduleOverlap[] = [];
  const sorted = blocks
    .map((block) => ({
      ...block,
      start: timeToMinutes(block.startTime),
      end: timeToMinutes(block.endTime),
    }))
    .filter(
      (block): block is typeof block & { start: number; end: number } =>
        block.start !== null && block.end !== null,
    )
    .sort((a, b) => (a.dayOfWeek ?? -1) - (b.dayOfWeek ?? -1) || a.start - b.start);

  for (let index = 0; index < sorted.length; index += 1) {
    for (let compareIndex = index + 1; compareIndex < sorted.length; compareIndex += 1) {
      const first = sorted[index];
      const second = sorted[compareIndex];
      if (first.dayOfWeek !== second.dayOfWeek) break;
      if (second.start >= first.end) break;
      overlaps.push({ firstId: first.id, secondId: second.id });
    }
  }
  return overlaps;
}
