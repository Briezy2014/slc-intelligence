import { suppressCount, type SuppressionResult } from "@/lib/analytics/small-group-suppression";

export type AdminMetricKey =
  | "active_students"
  | "active_staff"
  | "active_classrooms"
  | "active_iep_cycles"
  | "active_goals"
  | "goals_with_recent_finalized_data"
  | "goals_without_recent_finalized_data"
  | "draft_progress_reports"
  | "reports_ready_for_review"
  | "reports_requiring_changes"
  | "finalized_reports"
  | "active_accommodations"
  | "accommodation_records_awaiting_finalization"
  | "active_service_plans"
  | "finalized_service_records"
  | "open_family_follow_ups"
  | "upcoming_meetings"
  | "open_meeting_action_items"
  | "active_behavior_definitions"
  | "behavior_observations_awaiting_finalization"
  | "active_intervention_plans"
  | "fidelity_observations"
  | "executive_function_plans"
  | "classroom_schedule_changes"
  | "open_data_quality_warnings";

export type AdminMetricDefinition = {
  key: AdminMetricKey;
  label: string;
  explanation: string;
  suppress: boolean;
};

export const ADMIN_METRIC_DEFINITIONS: AdminMetricDefinition[] = [
  {
    key: "active_students",
    label: "Active students",
    explanation: "Count of students with status active in the authorized scope.",
    suppress: true,
  },
  {
    key: "active_staff",
    label: "Active staff memberships",
    explanation: "Count of active organization memberships in the authorized scope. Not a performance ranking.",
    suppress: true,
  },
  {
    key: "active_classrooms",
    label: "Active classrooms",
    explanation: "Count of classrooms with status active in the authorized scope.",
    suppress: true,
  },
  {
    key: "active_iep_cycles",
    label: "Active IEP cycles",
    explanation: "Count of IEP cycles currently marked active for authorized students.",
    suppress: true,
  },
  {
    key: "active_goals",
    label: "Active goals",
    explanation: "Count of goals with status active for authorized students.",
    suppress: true,
  },
  {
    key: "goals_with_recent_finalized_data",
    label: "Goals with recent finalized data",
    explanation:
      "Active goals that have at least one finalized progress entry within the selected date range. Reflects documentation presence, not instructional quality.",
    suppress: true,
  },
  {
    key: "goals_without_recent_finalized_data",
    label: "Goals with no recent finalized data",
    explanation:
      "Active goals with no finalized progress entry in the selected date range. May indicate documentation incomplete — not staff failure.",
    suppress: true,
  },
  {
    key: "draft_progress_reports",
    label: "Draft progress reports",
    explanation: "Progress reports currently in draft status within scope.",
    suppress: true,
  },
  {
    key: "reports_ready_for_review",
    label: "Reports ready for review",
    explanation: "Progress reports in ready_for_review status. Neutral workflow label only.",
    suppress: true,
  },
  {
    key: "reports_requiring_changes",
    label: "Reports requiring changes",
    explanation: "Progress reports returned for changes. Not a compliance determination.",
    suppress: true,
  },
  {
    key: "finalized_reports",
    label: "Finalized reports",
    explanation: "Progress reports with status finalized in the selected date range.",
    suppress: true,
  },
  {
    key: "active_accommodations",
    label: "Active accommodations",
    explanation: "Active accommodation records for authorized students.",
    suppress: true,
  },
  {
    key: "accommodation_records_awaiting_finalization",
    label: "Accommodation records awaiting finalization",
    explanation: "Accommodation delivery records still in draft status.",
    suppress: true,
  },
  {
    key: "active_service_plans",
    label: "Active service plans",
    explanation: "Active related-service plans in scope. Does not assert legal sufficiency.",
    suppress: true,
  },
  {
    key: "finalized_service_records",
    label: "Finalized service records",
    explanation: "Service delivery records finalized in the selected date range.",
    suppress: true,
  },
  {
    key: "open_family_follow_ups",
    label: "Open family follow-ups",
    explanation: "Family communication logs marked as requiring follow-up and not yet completed.",
    suppress: true,
  },
  {
    key: "upcoming_meetings",
    label: "Upcoming meetings",
    explanation: "Meetings scheduled on or after today that are not cancelled.",
    suppress: true,
  },
  {
    key: "open_meeting_action_items",
    label: "Open meeting action items",
    explanation: "Meeting action items with status open or in_progress.",
    suppress: true,
  },
  {
    key: "active_behavior_definitions",
    label: "Active behavior definitions",
    explanation: "Active Behavior Detective definitions in scope.",
    suppress: true,
  },
  {
    key: "behavior_observations_awaiting_finalization",
    label: "Behavior observations awaiting finalization",
    explanation: "Behavior observation drafts not yet finalized.",
    suppress: true,
  },
  {
    key: "active_intervention_plans",
    label: "Active intervention plans",
    explanation: "Intervention plans with status active. Not an effectiveness ranking.",
    suppress: true,
  },
  {
    key: "fidelity_observations",
    label: "Fidelity observations",
    explanation: "Finalized fidelity observation records in the selected date range.",
    suppress: true,
  },
  {
    key: "executive_function_plans",
    label: "Executive-function plans",
    explanation: "Active executive-function support plans in scope.",
    suppress: true,
  },
  {
    key: "classroom_schedule_changes",
    label: "Classroom schedule changes",
    explanation: "Schedule change records overlapping the selected date range.",
    suppress: true,
  },
  {
    key: "open_data_quality_warnings",
    label: "Open data-quality warnings",
    explanation:
      "Heuristic count of documentation gaps (goals without recent data + open follow-ups). Not a legal finding.",
    suppress: true,
  },
];

export type AdminMetricValue = {
  key: AdminMetricKey;
  label: string;
  explanation: string;
  raw: number | null;
  result: SuppressionResult;
};

export function presentMetrics(
  raw: Partial<Record<AdminMetricKey, number | null>>,
  minGroupSize: number,
): AdminMetricValue[] {
  return ADMIN_METRIC_DEFINITIONS.map((def) => {
    const value = raw[def.key] ?? null;
    const result = def.suppress ? suppressCount(value, minGroupSize) : {
      suppressed: false,
      value,
      display: value === null ? "No finalized record found" : String(value),
    };
    return {
      key: def.key,
      label: def.label,
      explanation: def.explanation,
      raw: value,
      result,
    };
  });
}
