import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type {
  IepCycle,
  IepGoal,
  ProgressDescriptorOption,
  ProgressReport,
  ProgressReportEvidenceLink,
  ProgressReportGoalSection,
  ProgressReportStatusHistory,
  ProgressReportVersion,
  ReportExport,
  ReportingPeriod,
  Student,
} from "@/lib/supabase/types";

export type ReportingData = {
  organizationId: string | null;
  organizationName: string | null;
  periods: ReportingPeriod[];
  reports: ProgressReport[];
  sections: ProgressReportGoalSection[];
  evidence: ProgressReportEvidenceLink[];
  history: ProgressReportStatusHistory[];
  versions: ProgressReportVersion[];
  exports: ReportExport[];
  students: Student[];
  goals: IepGoal[];
  cycles: IepCycle[];
  descriptors: ProgressDescriptorOption[];
  permissions: {
    canManagePeriods: boolean;
    canDraft: boolean;
    canReview: boolean;
    canFinalize: boolean;
    canExport: boolean;
    canRead: boolean;
  };
};

const emptyReportingData: ReportingData = {
  organizationId: null,
  organizationName: null,
  periods: [],
  reports: [],
  sections: [],
  evidence: [],
  history: [],
  versions: [],
  exports: [],
  students: [],
  goals: [],
  cycles: [],
  descriptors: [],
  permissions: {
    canManagePeriods: false,
    canDraft: false,
    canReview: false,
    canFinalize: false,
    canExport: false,
    canRead: false,
  },
};

export async function listReporting(
  options: { studentId?: string; reportId?: string } = {},
): Promise<DataState<ReportingData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyReportingData);

  try {
    const permissions = await getPermissionFlags(context, [
      "report.period.manage",
      "report.draft",
      "report.review",
      "report.finalize",
      "report.export",
      "report.read",
    ]);
    let reportsQuery = context.supabase
      .from("progress_reports")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("updated_at", { ascending: false });

    if (options.studentId) reportsQuery = reportsQuery.eq("student_id", options.studentId);
    if (options.reportId) reportsQuery = reportsQuery.eq("id", options.reportId);

    const [
      periodsResult,
      reportsResult,
      studentsResult,
      goalsResult,
      cyclesResult,
      descriptorsResult,
    ] = await Promise.all([
      context.supabase
        .from("reporting_periods")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("start_date", { ascending: false }),
      reportsQuery,
      context.supabase
        .from("students")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("last_name"),
      context.supabase
        .from("iep_goals")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("goal_area"),
      context.supabase
        .from("iep_cycles")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("start_date", { ascending: false }),
      context.supabase.from("progress_descriptor_options").select("*").order("sort_order"),
    ]);

    if (
      periodsResult.error ||
      reportsResult.error ||
      studentsResult.error ||
      goalsResult.error ||
      cyclesResult.error ||
      descriptorsResult.error
    ) {
      return safeDataError(emptyReportingData);
    }

    const reports = reportsResult.data ?? [];
    const reportIds = reports.map((report) => report.id);
    const [sectionsResult, historyResult, versionsResult, exportsResult] = reportIds.length
      ? await Promise.all([
          context.supabase
            .from("progress_report_goal_sections")
            .select("*")
            .in("report_id", reportIds),
          context.supabase
            .from("progress_report_status_history")
            .select("*")
            .in("report_id", reportIds)
            .order("created_at", { ascending: false }),
          context.supabase
            .from("progress_report_versions")
            .select("*")
            .in("report_id", reportIds)
            .order("created_at", { ascending: false }),
          context.supabase
            .from("report_exports")
            .select("*")
            .eq("organization_id", context.organizationId)
            .in("report_id", reportIds)
            .order("created_at", { ascending: false }),
        ])
      : [
          { data: [] as ProgressReportGoalSection[], error: null },
          { data: [] as ProgressReportStatusHistory[], error: null },
          { data: [] as ProgressReportVersion[], error: null },
          { data: [] as ReportExport[], error: null },
        ];

    if (
      sectionsResult.error ||
      historyResult.error ||
      versionsResult.error ||
      exportsResult.error
    ) {
      return safeDataError(emptyReportingData);
    }

    const sections = sectionsResult.data ?? [];
    const sectionIds = sections.map((section) => section.id);
    const evidenceResult = sectionIds.length
      ? await context.supabase
          .from("progress_report_evidence_links")
          .select("*")
          .in("section_id", sectionIds)
      : { data: [] as ProgressReportEvidenceLink[], error: null };

    if (evidenceResult.error) return safeDataError(emptyReportingData);

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        periods: periodsResult.data ?? [],
        reports,
        sections,
        evidence: evidenceResult.data ?? [],
        history: historyResult.data ?? [],
        versions: versionsResult.data ?? [],
        exports: exportsResult.data ?? [],
        students: studentsResult.data ?? [],
        goals: goalsResult.data ?? [],
        cycles: cyclesResult.data ?? [],
        descriptors: descriptorsResult.data ?? [],
        permissions: {
          canManagePeriods: permissions["report.period.manage"],
          canDraft: permissions["report.draft"],
          canReview: permissions["report.review"],
          canFinalize: permissions["report.finalize"],
          canExport: permissions["report.export"],
          canRead: permissions["report.read"],
        },
      },
    };
  } catch {
    return safeDataError(emptyReportingData);
  }
}

export async function getReport(
  reportId: string,
): Promise<DataState<ReportingData & { report: ProgressReport | null }>> {
  const reporting = await listReporting({ reportId });
  return {
    ...reporting,
    data: {
      ...reporting.data,
      report: reporting.data.reports.find((report) => report.id === reportId) ?? null,
    },
  };
}
