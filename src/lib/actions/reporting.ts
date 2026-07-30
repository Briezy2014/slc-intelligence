"use server";

import {
  auditAndRevalidate,
  emptyToUndefined,
  formDataToObject,
  GENERIC_ACTION_MESSAGE,
  getActionContext,
  type ActionState,
  UNAUTHORIZED_ACTION_MESSAGE,
  validationError,
} from "@/lib/actions/shared";
import type { Json, ProgressReport } from "@/lib/supabase/types";
import {
  evidenceLinkSchema,
  reportCreateSchema,
  reportExportSchema,
  reportingPeriodSchema,
  reportSectionSchema,
  reportStatusSchema,
} from "@/lib/validation/reporting";

async function reportById(context: Awaited<ReturnType<typeof getActionContext>>, reportId: string) {
  if (!("supabase" in context)) return null;
  const { data, error } = await context.supabase
    .from("progress_reports")
    .select("*")
    .eq("organization_id", context.organizationId)
    .eq("id", reportId)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

async function canDraftReport(
  context: Awaited<ReturnType<typeof getActionContext>>,
  studentId: string,
) {
  if (!("supabase" in context)) return false;
  const { data, error } = await context.supabase.rpc("can_draft_report", {
    p_org_id: context.organizationId,
    p_student_id: studentId,
  });
  return !error && Boolean(data);
}

async function canFinalizeReport(
  context: Awaited<ReturnType<typeof getActionContext>>,
  studentId: string,
) {
  if (!("supabase" in context)) return false;
  const { data, error } = await context.supabase.rpc("can_finalize_report", {
    p_org_id: context.organizationId,
    p_student_id: studentId,
  });
  return !error && Boolean(data);
}

export async function saveReportingPeriodAction(formData: FormData): Promise<ActionState> {
  const parsed = reportingPeriodSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "report.period.manage");
  if (!("supabase" in context)) return context;

  try {
    const payload = {
      organization_id: context.organizationId,
      name: values.name,
      academic_year: values.academicYear,
      start_date: values.startDate,
      end_date: values.endDate,
      due_date: values.dueDate || null,
      school_id: values.schoolId || null,
      program_id: values.programId || null,
      status: values.status,
      created_by: context.user.id,
    };
    const result = values.periodId
      ? await context.supabase
          .from("reporting_periods")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.periodId)
          .select("id")
          .single()
      : await context.supabase.from("reporting_periods").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.periodId ? "reporting_period.update" : "reporting_period.create",
      resourceType: "reporting_period",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/reports", "/reports/periods"],
    });
    return { status: "success", message: "Reporting period saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function createProgressReportAction(formData: FormData): Promise<ActionState> {
  const parsed = reportCreateSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    if (!(await canDraftReport(context, values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const { data: cycle, error: cycleError } = await context.supabase
      .from("iep_cycles")
      .select("*")
      .eq("organization_id", context.organizationId)
      .eq("student_id", values.studentId)
      .eq("id", values.iepCycleId)
      .maybeSingle();
    const { data: period, error: periodError } = await context.supabase
      .from("reporting_periods")
      .select("*")
      .eq("organization_id", context.organizationId)
      .eq("id", values.reportingPeriodId)
      .maybeSingle();
    if (cycleError || periodError || !cycle || !period) {
      return { status: "error", message: GENERIC_ACTION_MESSAGE };
    }

    const { data: report, error } = await context.supabase
      .from("progress_reports")
      .insert({
        organization_id: context.organizationId,
        student_id: values.studentId,
        iep_cycle_id: values.iepCycleId,
        reporting_period_id: values.reportingPeriodId,
        status: "draft",
        prepared_by: context.user.id,
      })
      .select("*")
      .single();
    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    const { data: goals } = await context.supabase
      .from("iep_goals")
      .select("*")
      .eq("organization_id", context.organizationId)
      .eq("student_id", values.studentId)
      .eq("iep_cycle_id", values.iepCycleId)
      .eq("status", "active");
    if (goals?.length) {
      await context.supabase.from("progress_report_goal_sections").insert(
        goals.map((goal) => ({
          report_id: report.id,
          goal_id: goal.id,
          goal_statement_snapshot: goal.goal_statement,
          baseline_snapshot: {},
          target_snapshot: {
            target_value: goal.target_value,
            target_direction: goal.target_direction,
          } as Json,
          period_start: period.start_date,
          period_end: period.end_date,
          data_sufficiency_status: "not_reviewed",
        })),
      );
    }

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "progress_report.create",
      resourceType: "progress_report",
      resourceId: report.id,
      newState: { status: report.status, student_id: report.student_id },
      paths: ["/reports", `/reports/${report.id}`, `/students/${values.studentId}/reports`],
    });
    return { status: "success", message: "Progress report created." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveReportSectionAction(formData: FormData): Promise<ActionState> {
  const parsed = reportSectionSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const report = await reportById(context, values.reportId);
    if (!report || report.student_id !== values.studentId) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const allowed =
      (["not_started", "draft", "changes_requested"].includes(report.status) &&
        (await canDraftReport(context, report.student_id))) ||
      (["approved", "finalized", "corrected"].includes(report.status) &&
        (await canFinalizeReport(context, report.student_id)));
    if (!allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };

    const payload = {
      current_performance_summary: values.currentPerformanceSummary ?? null,
      trend_summary: values.trendSummary ?? null,
      prompt_summary: values.promptSummary ?? null,
      generalization_summary: values.generalizationSummary ?? null,
      maintenance_summary: values.maintenanceSummary ?? null,
      intervention_phase_summary: values.interventionPhaseSummary ?? null,
      data_sufficiency_status: values.dataSufficiencyStatus,
      data_sufficiency_notes: values.dataSufficiencyNotes ?? null,
      educator_narrative: values.educatorNarrative ?? null,
      progress_descriptor: values.progressDescriptor || null,
      descriptor_source: "educator_modified" as const,
    };
    const { error } = await context.supabase
      .from("progress_report_goal_sections")
      .update(payload)
      .eq("id", values.sectionId)
      .eq("report_id", values.reportId);
    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "progress_report_section.update",
      resourceType: "progress_report_goal_section",
      resourceId: values.sectionId,
      newState: payload,
      paths: [`/reports/${values.reportId}`, `/reports/${values.reportId}/review`],
    });
    return { status: "success", message: "Report section saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

async function updateReportStatus(
  formData: FormData,
  toStatus: ProgressReport["status"],
  required: "draft" | "finalize",
  actionType: string,
): Promise<ActionState> {
  const parsed = reportStatusSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const report = await reportById(context, values.reportId);
    if (!report) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    const allowed =
      required === "draft"
        ? await canDraftReport(context, report.student_id)
        : await canFinalizeReport(context, report.student_id);
    if (!allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };

    const update =
      toStatus === "finalized"
        ? {
            status: toStatus,
            finalized_at: new Date().toISOString(),
            finalized_by: context.user.id,
          }
        : toStatus === "corrected"
          ? { status: toStatus, corrected_at: new Date().toISOString() }
          : { status: toStatus };
    const { error } = await context.supabase
      .from("progress_reports")
      .update(update)
      .eq("organization_id", context.organizationId)
      .eq("id", report.id);
    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await context.supabase.from("progress_report_status_history").insert({
      report_id: report.id,
      from_status: report.status,
      to_status: toStatus,
      changed_by: context.user.id,
      note: values.note ?? null,
    });

    if (toStatus === "finalized" || toStatus === "corrected") {
      const { data: sections } = await context.supabase
        .from("progress_report_goal_sections")
        .select("*")
        .eq("report_id", report.id);
      await context.supabase.from("progress_report_versions").insert({
        report_id: report.id,
        version_number: report.version_number + (toStatus === "corrected" ? 1 : 0),
        snapshot: { report, sections: sections ?? [] } as Json,
        created_by: context.user.id,
        reason: values.note ?? actionType,
      });
    }

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType,
      resourceType: "progress_report",
      resourceId: report.id,
      previousState: { status: report.status },
      newState: { status: toStatus },
      paths: [
        "/reports",
        `/reports/${report.id}`,
        `/reports/${report.id}/history`,
        `/students/${report.student_id}/reports`,
      ],
    });
    return { status: "success", message: "Progress report updated." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function submitReportForReviewAction(formData: FormData): Promise<ActionState> {
  return updateReportStatus(
    formData,
    "ready_for_review",
    "draft",
    "progress_report.submit_for_review",
  );
}

export async function finalizeReportAction(formData: FormData): Promise<ActionState> {
  return updateReportStatus(formData, "finalized", "finalize", "progress_report.finalize");
}

export async function correctReportAction(formData: FormData): Promise<ActionState> {
  return updateReportStatus(formData, "corrected", "finalize", "progress_report.correct");
}

export async function addEvidenceLinkAction(formData: FormData): Promise<ActionState> {
  const parsed = evidenceLinkSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const report = await reportById(context, values.reportId);
    if (!report || !(await canDraftReport(context, report.student_id))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      section_id: values.sectionId,
      evidence_type: values.evidenceType,
      evidence_id: values.evidenceId || null,
      label: values.label,
      date_range_start: values.dateRangeStart || null,
      date_range_end: values.dateRangeEnd || null,
      metadata: {},
    };
    const { error } = await context.supabase.from("progress_report_evidence_links").insert(payload);
    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "progress_report_evidence.create",
      resourceType: "progress_report_evidence_link",
      newState: payload,
      paths: [`/reports/${values.reportId}`],
    });
    return { status: "success", message: "Evidence linked." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function recordReportExportAction(formData: FormData): Promise<ActionState> {
  const parsed = reportExportSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "report.export");
  if (!("supabase" in context)) return context;

  try {
    const report = await reportById(context, values.reportId);
    if (!report) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    const { error } = await context.supabase.from("report_exports").insert({
      report_id: report.id,
      organization_id: context.organizationId,
      exported_by: context.user.id,
      export_format: values.exportFormat,
      version_number: report.version_number,
    });
    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "progress_report.export",
      resourceType: "report_export",
      resourceId: report.id,
      newState: { export_format: values.exportFormat },
      paths: [`/reports/${report.id}/history`, `/reports/${report.id}/print`],
    });
    return { status: "success", message: "Report export recorded." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
