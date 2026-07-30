export const PLANNED_VS_RECORDED_DISCLAIMER =
  "Planned and recorded service minutes are descriptive operational records. Missing values remain unavailable, and summaries do not determine compliance or owed minutes.";

export type ServiceMinuteSummary = {
  plannedMinutes: number | null;
  recordedMinutes: number | null;
  differenceMinutes: number | null;
  label: string;
  disclaimer: string;
};

function minutesFromTime(value: string): number | null {
  const [hours, minutes] = value.split(":").map((part) => Number(part));
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
}

export function durationMinutesFromStartEnd(
  startTime?: string | null,
  endTime?: string | null,
): number | null {
  if (!startTime || !endTime) return null;
  const start = minutesFromTime(startTime);
  const end = minutesFromTime(endTime);
  if (start === null || end === null || end < start) return null;
  return end - start;
}

export function summarizePlannedVsRecordedMinutes(args: {
  plannedMinutes?: number | null;
  recordedMinutes?: number | null;
}): ServiceMinuteSummary {
  const plannedMinutes = args.plannedMinutes ?? null;
  const recordedMinutes = args.recordedMinutes ?? null;
  const differenceMinutes =
    plannedMinutes === null || recordedMinutes === null ? null : recordedMinutes - plannedMinutes;

  return {
    plannedMinutes,
    recordedMinutes,
    differenceMinutes,
    label:
      differenceMinutes === null
        ? "Planned or recorded minutes are unavailable."
        : `${Math.abs(differenceMinutes)} minute${Math.abs(differenceMinutes) === 1 ? "" : "s"} ${
            differenceMinutes >= 0 ? "above" : "below"
          } the planned value.`,
    disclaimer: PLANNED_VS_RECORDED_DISCLAIMER,
  };
}

export function describeDocumentationGap(args: {
  plannedMinutes?: number | null;
  recordedMinutes?: number | null;
  recordStatus?: string | null;
}): string {
  if (args.plannedMinutes == null && args.recordedMinutes == null) {
    return "Planned and recorded minutes are unavailable for this entry.";
  }

  if (args.recordedMinutes == null) {
    return "A planned service entry does not yet have recorded minutes.";
  }

  if (args.plannedMinutes == null) {
    return "Recorded minutes are present without a comparable planned minute value.";
  }

  if (args.recordStatus === "draft") {
    return "Recorded minutes are still in draft status and may change after educator review.";
  }

  const difference = args.recordedMinutes - args.plannedMinutes;
  if (difference === 0) return "Recorded minutes match the planned minute value.";
  return difference > 0
    ? "Recorded minutes are greater than the planned minute value."
    : "Recorded minutes are lower than the planned minute value.";
}
