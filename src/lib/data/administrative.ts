import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import {
  ADMIN_METRIC_DEFINITIONS,
  presentMetrics,
  type AdminMetricKey,
  type AdminMetricValue,
} from "@/lib/analytics/admin-metrics";
import { DEFAULT_MIN_GROUP_SIZE, suppressionNotice } from "@/lib/analytics/small-group-suppression";
import type {
  AdministrativeExportEvent,
  Classroom,
  OrganizationPrivacySettings,
  Program,
  School,
} from "@/lib/supabase/types";

export type AdminScopeFilters = {
  schoolId?: string | null;
  programId?: string | null;
  classroomId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export type AdministrativeIntelligenceData = {
  organizationId: string | null;
  organizationName: string | null;
  canRead: boolean;
  canExport: boolean;
  canReadAudit: boolean;
  minGroupSize: number;
  suppressionNotice: string;
  filters: AdminScopeFilters;
  schools: School[];
  programs: Program[];
  classrooms: Classroom[];
  metrics: AdminMetricValue[];
  chartSeries: Array<{ key: string; label: string; display: string; suppressed: boolean; value: number | null }>;
  drillDownLinks: Array<{ href: string; label: string; description: string }>;
  exportEvents: AdministrativeExportEvent[];
  privacy: OrganizationPrivacySettings | null;
  scopeLabel: string;
  limitations: string[];
};

const emptyAdmin: AdministrativeIntelligenceData = {
  organizationId: null,
  organizationName: null,
  canRead: false,
  canExport: false,
  canReadAudit: false,
  minGroupSize: DEFAULT_MIN_GROUP_SIZE,
  suppressionNotice: suppressionNotice(DEFAULT_MIN_GROUP_SIZE),
  filters: {},
  schools: [],
  programs: [],
  classrooms: [],
  metrics: presentMetrics({}, DEFAULT_MIN_GROUP_SIZE),
  chartSeries: [],
  drillDownLinks: [],
  exportEvents: [],
  privacy: null,
  scopeLabel: "Unauthorized",
  limitations: [],
};

function defaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 90);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

async function resolveScopedStudentIds(
  context: NonNullable<Awaited<ReturnType<typeof getOrgDataContext>>>,
  filters: AdminScopeFilters,
): Promise<Set<string> | null> {
  const needsScope = Boolean(filters.schoolId || filters.programId || filters.classroomId);
  if (!needsScope) return null;

  let ids: Set<string> | null = null;

  if (filters.schoolId) {
    const { data, error } = await context.supabase
      .from("student_enrollments")
      .select("student_id")
      .eq("organization_id", context.organizationId)
      .eq("school_id", filters.schoolId)
      .eq("status", "active");
    if (error) return new Set();
    ids = new Set((data ?? []).map((row) => row.student_id));
  }

  if (filters.programId) {
    const { data, error } = await context.supabase
      .from("student_program_assignments")
      .select("student_id")
      .eq("organization_id", context.organizationId)
      .eq("program_id", filters.programId)
      .eq("status", "active");
    if (error) return new Set();
    const programIds = new Set((data ?? []).map((row) => row.student_id));
    ids = ids ? new Set([...ids].filter((id) => programIds.has(id))) : programIds;
  }

  if (filters.classroomId) {
    const { data, error } = await context.supabase
      .from("student_classroom_assignments")
      .select("student_id")
      .eq("organization_id", context.organizationId)
      .eq("classroom_id", filters.classroomId)
      .eq("status", "active");
    if (error) return new Set();
    const classroomIds = new Set((data ?? []).map((row) => row.student_id));
    ids = ids ? new Set([...ids].filter((id) => classroomIds.has(id))) : classroomIds;
  }

  return ids ?? new Set();
}

function scopeLabel(filters: AdminScopeFilters, schools: School[], programs: Program[], classrooms: Classroom[]) {
  if (filters.classroomId) {
    const classroom = classrooms.find((row) => row.id === filters.classroomId);
    return classroom ? `Classroom: ${classroom.name}` : "Classroom scope";
  }
  if (filters.programId) {
    const program = programs.find((row) => row.id === filters.programId);
    return program ? `Program: ${program.name}` : "Program scope";
  }
  if (filters.schoolId) {
    const school = schools.find((row) => row.id === filters.schoolId);
    return school ? `School: ${school.name}` : "School scope";
  }
  return "Organization scope";
}

export async function getAdministrativeIntelligence(
  filters: AdminScopeFilters = {},
): Promise<DataState<AdministrativeIntelligenceData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyAdmin);

  const dateDefaults = defaultDateRange();
  const startDate = filters.startDate || dateDefaults.startDate;
  const endDate = filters.endDate || dateDefaults.endDate;
  const normalizedFilters: AdminScopeFilters = {
    schoolId: filters.schoolId || null,
    programId: filters.programId || null,
    classroomId: filters.classroomId || null,
    startDate,
    endDate,
  };

  try {
    const permissions = await getPermissionFlags(context, [
      "admin.intelligence.read",
      "admin.export",
      "admin.audit.read",
    ]);

    if (!permissions["admin.intelligence.read"]) {
      return {
        configured: true,
        data: {
          ...emptyAdmin,
          organizationId: context.organizationId,
          organizationName: context.organizationName,
          canRead: false,
          limitations: ["Administrative Intelligence requires admin.intelligence.read."],
        },
      };
    }

    const studentIds = await resolveScopedStudentIds(context, normalizedFilters);

    const [
      privacyResult,
      schoolsResult,
      programsResult,
      classroomsResult,
      studentsResult,
      membershipsResult,
      cyclesResult,
      goalsResult,
      progressSessionsResult,
      reportsResult,
      accommodationsResult,
      accommodationLogsResult,
      servicePlansResult,
      serviceLogsResult,
      followupsResult,
      meetingsResult,
      actionItemsResult,
      behaviorDefinitionsResult,
      behaviorSessionsResult,
      interventionPlansResult,
      efPlansResult,
      scheduleExceptionsResult,
      exportEventsResult,
    ] = await Promise.all([
      context.supabase
        .from("organization_privacy_settings")
        .select("*")
        .eq("organization_id", context.organizationId)
        .maybeSingle(),
      context.supabase
        .from("schools")
        .select("*")
        .eq("organization_id", context.organizationId)
        .neq("status", "archived")
        .order("name"),
      context.supabase
        .from("programs")
        .select("*")
        .eq("organization_id", context.organizationId)
        .neq("status", "archived")
        .order("name"),
      context.supabase
        .from("classrooms")
        .select("*")
        .eq("organization_id", context.organizationId)
        .neq("status", "archived")
        .order("name"),
      context.supabase
        .from("students")
        .select("id,enrollment_status")
        .eq("organization_id", context.organizationId)
        .eq("enrollment_status", "active"),
      context.supabase
        .from("organization_memberships")
        .select("id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "active"),
      context.supabase
        .from("iep_cycles")
        .select("id,student_id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "active"),
      context.supabase
        .from("iep_goals")
        .select("id,student_id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "active"),
      context.supabase
        .from("progress_monitoring_sessions")
        .select("id,student_id,goal_id,status,session_date")
        .eq("organization_id", context.organizationId)
        .in("status", ["finalized", "corrected"])
        .gte("session_date", startDate)
        .lte("session_date", endDate),
      context.supabase
        .from("progress_reports")
        .select("id,student_id,status,finalized_at,updated_at")
        .eq("organization_id", context.organizationId),
      context.supabase
        .from("student_accommodations")
        .select("id,student_id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "active"),
      context.supabase
        .from("accommodation_implementation_logs")
        .select("id,student_id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "draft"),
      context.supabase
        .from("student_service_plans")
        .select("id,student_id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "active"),
      context.supabase
        .from("service_delivery_logs")
        .select("id,primary_student_id,record_status,service_date")
        .eq("organization_id", context.organizationId)
        .eq("record_status", "finalized")
        .gte("service_date", startDate)
        .lte("service_date", endDate),
      context.supabase
        .from("communication_followups")
        .select("id,student_id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "open"),
      context.supabase
        .from("meetings")
        .select("id,student_id,status,scheduled_start")
        .eq("organization_id", context.organizationId)
        .neq("status", "canceled")
        .gte("scheduled_start", new Date().toISOString()),
      context.supabase
        .from("meeting_action_items")
        .select("id,meeting_id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "open"),
      context.supabase
        .from("behavior_definitions")
        .select("id,student_id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "active"),
      context.supabase
        .from("behavior_observation_sessions")
        .select("id,student_id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "draft"),
      context.supabase
        .from("intervention_plans")
        .select("id,student_id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "active"),
      context.supabase
        .from("student_executive_function_plans")
        .select("id,student_id,status")
        .eq("organization_id", context.organizationId)
        .eq("status", "active"),
      context.supabase
        .from("classroom_schedule_exceptions")
        .select("id,classroom_id,exception_date")
        .eq("organization_id", context.organizationId)
        .gte("exception_date", startDate)
        .lte("exception_date", endDate),
      permissions["admin.audit.read"]
        ? context.supabase
            .from("administrative_export_events")
            .select("*")
            .eq("organization_id", context.organizationId)
            .order("created_at", { ascending: false })
            .limit(25)
        : Promise.resolve({ data: [] as AdministrativeExportEvent[], error: null }),
    ]);

    const queryErrors = [
      privacyResult.error,
      schoolsResult.error,
      programsResult.error,
      classroomsResult.error,
      studentsResult.error,
      membershipsResult.error,
      cyclesResult.error,
      goalsResult.error,
      progressSessionsResult.error,
      reportsResult.error,
      accommodationsResult.error,
      accommodationLogsResult.error,
      servicePlansResult.error,
      serviceLogsResult.error,
      followupsResult.error,
      meetingsResult.error,
      actionItemsResult.error,
      behaviorDefinitionsResult.error,
      behaviorSessionsResult.error,
      interventionPlansResult.error,
      efPlansResult.error,
      scheduleExceptionsResult.error,
      exportEventsResult.error,
    ].some(Boolean);

    if (queryErrors) {
      return safeDataError({
        ...emptyAdmin,
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        canRead: true,
        canExport: permissions["admin.export"],
        canReadAudit: permissions["admin.audit.read"],
      });
    }

    const allSchools = schoolsResult.data ?? [];
    const allPrograms = programsResult.data ?? [];
    const allClassrooms = classroomsResult.data ?? [];

    let scopedClassrooms = allClassrooms;
    if (normalizedFilters.schoolId) {
      scopedClassrooms = scopedClassrooms.filter((row) => row.school_id === normalizedFilters.schoolId);
    }
    if (normalizedFilters.programId) {
      scopedClassrooms = scopedClassrooms.filter((row) => row.program_id === normalizedFilters.programId);
    }
    if (normalizedFilters.classroomId) {
      scopedClassrooms = scopedClassrooms.filter((row) => row.id === normalizedFilters.classroomId);
    }

    const students = (studentsResult.data ?? []).filter((row) => !studentIds || studentIds.has(row.id));
    const studentIdList = new Set(students.map((row) => row.id));

    const goals = (goalsResult.data ?? []).filter((row) => studentIdList.has(row.student_id));
    const goalIdsWithRecentData = new Set(
      (progressSessionsResult.data ?? [])
        .filter((row) => studentIdList.has(row.student_id))
        .map((row) => row.goal_id),
    );
    const goalsWithRecent = goals.filter((goal) => goalIdsWithRecentData.has(goal.id)).length;
    const goalsWithoutRecent = goals.length - goalsWithRecent;

    const reports = (reportsResult.data ?? []).filter((row) => studentIdList.has(row.student_id));
    const openFollowUps = (followupsResult.data ?? []).filter((row) => studentIdList.has(row.student_id)).length;
    const openDataQualityWarnings = goalsWithoutRecent + openFollowUps;

    const interventionPlans = (interventionPlansResult.data ?? []).filter((row) =>
      studentIdList.has(row.student_id),
    );
    const planIds = interventionPlans.map((plan) => plan.id);
    let fidelityCount = 0;
    if (planIds.length) {
      const fidelityResult = await context.supabase
        .from("fidelity_observations")
        .select("id,plan_id,status,observation_date")
        .in("plan_id", planIds)
        .eq("status", "finalized")
        .gte("observation_date", startDate)
        .lte("observation_date", endDate);
      if (!fidelityResult.error) {
        fidelityCount = fidelityResult.data?.length ?? 0;
      }
    }

    const meetingIds = new Set(
      (meetingsResult.data ?? [])
        .filter((row) => studentIdList.has(row.student_id))
        .map((row) => row.id),
    );
    const openActionItems = (actionItemsResult.data ?? []).filter((row) => meetingIds.has(row.meeting_id)).length;

    const scheduleChanges = (scheduleExceptionsResult.data ?? []).filter((row) => {
      if (normalizedFilters.classroomId) return row.classroom_id === normalizedFilters.classroomId;
      return scopedClassrooms.some((classroom) => classroom.id === row.classroom_id);
    });

    const raw: Partial<Record<AdminMetricKey, number | null>> = {
      active_students: students.length,
      active_staff: (membershipsResult.data ?? []).length,
      active_classrooms: scopedClassrooms.length,
      active_iep_cycles: (cyclesResult.data ?? []).filter((row) => studentIdList.has(row.student_id)).length,
      active_goals: goals.length,
      goals_with_recent_finalized_data: goalsWithRecent,
      goals_without_recent_finalized_data: goalsWithoutRecent,
      draft_progress_reports: reports.filter((row) => row.status === "draft").length,
      reports_ready_for_review: reports.filter((row) => row.status === "ready_for_review").length,
      reports_requiring_changes: reports.filter((row) => row.status === "changes_requested").length,
      finalized_reports: reports.filter((row) => {
        if (row.status !== "finalized") return false;
        const stamp = row.finalized_at?.slice(0, 10);
        if (!stamp) return true;
        return stamp >= startDate && stamp <= endDate;
      }).length,
      active_accommodations: (accommodationsResult.data ?? []).filter((row) => studentIdList.has(row.student_id))
        .length,
      accommodation_records_awaiting_finalization: (accommodationLogsResult.data ?? []).filter((row) =>
        studentIdList.has(row.student_id),
      ).length,
      active_service_plans: (servicePlansResult.data ?? []).filter((row) => studentIdList.has(row.student_id)).length,
      finalized_service_records: (serviceLogsResult.data ?? []).filter((row) =>
        studentIdList.has(row.primary_student_id),
      ).length,
      open_family_follow_ups: openFollowUps,
      upcoming_meetings: (meetingsResult.data ?? []).filter((row) => studentIdList.has(row.student_id)).length,
      open_meeting_action_items: openActionItems,
      active_behavior_definitions: (behaviorDefinitionsResult.data ?? []).filter((row) =>
        studentIdList.has(row.student_id),
      ).length,
      behavior_observations_awaiting_finalization: (behaviorSessionsResult.data ?? []).filter((row) =>
        studentIdList.has(row.student_id),
      ).length,
      active_intervention_plans: interventionPlans.length,
      fidelity_observations: fidelityCount,
      executive_function_plans: (efPlansResult.data ?? []).filter((row) => studentIdList.has(row.student_id)).length,
      classroom_schedule_changes: scheduleChanges.length,
      open_data_quality_warnings: openDataQualityWarnings,
    };

    const minGroupSize = privacyResult.data?.small_group_threshold ?? DEFAULT_MIN_GROUP_SIZE;
    const metrics = presentMetrics(raw, minGroupSize);
    const chartKeys: AdminMetricKey[] = [
      "active_students",
      "active_goals",
      "goals_with_recent_finalized_data",
      "goals_without_recent_finalized_data",
      "draft_progress_reports",
      "finalized_reports",
      "active_accommodations",
      "finalized_service_records",
      "upcoming_meetings",
      "active_intervention_plans",
    ];
    const chartSeries = metrics
      .filter((metric) => chartKeys.includes(metric.key))
      .map((metric) => ({
        key: metric.key,
        label: metric.label,
        display: metric.result.display,
        suppressed: metric.result.suppressed,
        value: metric.result.value,
      }));

    const schoolLinks = allSchools.slice(0, 12).map((school) => ({
      href: `/administrative-intelligence/schools/${school.id}`,
      label: school.name,
      description: "Authorized school dashboard.",
    }));
    const programLinks = allPrograms.slice(0, 12).map((program) => ({
      href: `/administrative-intelligence/programs/${program.id}`,
      label: program.name,
      description: "Authorized program dashboard.",
    }));
    const classroomLinks = allClassrooms.slice(0, 12).map((classroom) => ({
      href: `/administrative-intelligence/classrooms/${classroom.id}`,
      label: classroom.name,
      description: "Authorized classroom dashboard.",
    }));

    const drillDownLinks = [
      {
        href: "/administrative-intelligence/organization",
        label: "Organization dashboard",
        description: "Authorized organization-wide workflow summaries.",
      },
      {
        href: "/administrative-intelligence/schools",
        label: "Schools",
        description: "Drill into authorized school scopes.",
      },
      {
        href: "/administrative-intelligence/programs",
        label: "Programs",
        description: "Drill into authorized program scopes.",
      },
      {
        href: "/administrative-intelligence/classrooms",
        label: "Classrooms",
        description: "Drill into authorized classroom scopes.",
      },
      {
        href: "/administrative-intelligence/caseloads",
        label: "Caseload dashboard",
        description: "Caseload-oriented documentation readiness.",
      },
      {
        href: "/administrative-intelligence/reporting",
        label: "Progress-report readiness",
        description: "Draft, review, and finalized report workflow counts.",
      },
      {
        href: "/administrative-intelligence/services",
        label: "Service documentation",
        description: "Active plans and finalized service records.",
      },
      {
        href: "/administrative-intelligence/accommodations",
        label: "Accommodation documentation",
        description: "Active accommodations and records awaiting finalization.",
      },
      {
        href: "/administrative-intelligence/behavior",
        label: "Behavior data",
        description: "Definitions and observations awaiting finalization.",
      },
      {
        href: "/administrative-intelligence/interventions",
        label: "Intervention and fidelity",
        description: "Active plans and finalized fidelity observations.",
      },
      {
        href: "/administrative-intelligence/meetings",
        label: "Meetings and action items",
        description: "Upcoming meetings and open action items.",
      },
      {
        href: "/administrative-intelligence/data-quality",
        label: "Data-quality dashboard",
        description: "Documentation gaps and review-needed counts.",
      },
      {
        href: "/administrative-intelligence/audit",
        label: "Audit activity",
        description: "Administrative export events in your authorized scope.",
      },
      ...schoolLinks,
      ...programLinks,
      ...classroomLinks,
      { href: "/reports", label: "Open Progress Reporting", description: "Review underlying progress reports." },
      { href: "/services", label: "Open Services", description: "Review underlying service records." },
      { href: "/meetings", label: "Open Meeting Center", description: "Review underlying meetings." },
      {
        href: "/behavior-detective",
        label: "Open Behavior Detective",
        description: "Review underlying behavior records.",
      },
      {
        href: "/interventions",
        label: "Open Intervention Intelligence",
        description: "Review underlying intervention records.",
      },
    ];

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        canRead: true,
        canExport: permissions["admin.export"],
        canReadAudit: permissions["admin.audit.read"],
        minGroupSize,
        suppressionNotice: suppressionNotice(minGroupSize),
        filters: normalizedFilters,
        schools: allSchools,
        programs: allPrograms,
        classrooms: allClassrooms,
        metrics,
        chartSeries,
        drillDownLinks,
        exportEvents: (exportEventsResult.data ?? []) as AdministrativeExportEvent[],
        privacy: privacyResult.data ?? null,
        scopeLabel: scopeLabel(normalizedFilters, allSchools, allPrograms, allClassrooms),
        limitations: [
          "Counts reflect documentation presence in authorized records only.",
          "Missing records are not treated as educational outcomes of zero.",
          "These summaries are not legal, placement, eligibility, or compliance determinations.",
          "Staff and students are not ranked.",
          `${ADMIN_METRIC_DEFINITIONS.length} metrics include explanation panels.`,
        ],
      },
    };
  } catch {
    return safeDataError(emptyAdmin);
  }
}

export function buildAdministrativeExportCsv(data: AdministrativeIntelligenceData): string {
  const lines = [
    `# SLC Intelligence administrative export`,
    `# Generated: ${new Date().toISOString()}`,
    `# Scope: ${data.scopeLabel}`,
    `# Date range: ${data.filters.startDate ?? ""} to ${data.filters.endDate ?? ""}`,
    `# Privacy: ${data.suppressionNotice}`,
    `# Notice: Demonstration or fictional data must be labeled when applicable.`,
    "metric_key,label,display_value,suppressed,explanation",
    ...data.metrics.map((metric) =>
      [
        metric.key,
        JSON.stringify(metric.label),
        JSON.stringify(metric.result.display),
        metric.result.suppressed ? "true" : "false",
        JSON.stringify(metric.explanation),
      ].join(","),
    ),
  ];
  return lines.join("\n");
}
