"use server";

import { z } from "zod";
import {
  calculatePercentage,
  calculateRate,
  calculateReadingAccuracy,
  calculateWordsCorrectPerMinute,
} from "@/lib/analytics/calculations";
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
import { canEnterProgress } from "@/lib/permissions/check";
import type { Json, ProgressDataPoint } from "@/lib/supabase/types";
import { progressSessionSchema } from "@/lib/validation/progress";

export async function saveProgressSessionAction(formData: FormData): Promise<ActionState> {
  const parsed = progressSessionSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const allowed = await canEnterProgress(
      context.supabase,
      context.organizationId,
      values.studentId,
    );
    if (!allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };

    if (values.status === "finalized") {
      const { data: canFinalize, error: finalizeError } = await context.supabase.rpc(
        "can_finalize_progress",
        { p_org_id: context.organizationId, p_student_id: values.studentId },
      );
      if (finalizeError || !canFinalize) {
        return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
      }
    }

    const sessionPayload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      goal_id: values.goalId,
      objective_id: values.objectiveId || null,
      session_date: values.sessionDate,
      collector_user_id: values.collectorUserId || context.user.id,
      setting: values.setting ?? null,
      activity: values.activity ?? null,
      intervention_phase_id: values.interventionPhaseId || null,
      measurement_type: values.measurementType,
      status: values.status,
      notes: values.notes ?? null,
      finalized_at: values.status === "finalized" ? new Date().toISOString() : null,
      finalized_by: values.status === "finalized" ? context.user.id : null,
    };
    const sessionResult = await context.supabase
      .from("progress_monitoring_sessions")
      .insert(sessionPayload)
      .select("id")
      .single();

    if (sessionResult.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    const pointPayload = buildDataPointPayload(
      context.organizationId,
      sessionResult.data.id,
      values,
    );
    const pointResult = await context.supabase.from("progress_data_points").insert(pointPayload);
    if (pointResult.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "progress_session.create",
      resourceType: "progress_monitoring_session",
      resourceId: sessionResult.data.id,
      newState: {
        measurement_type: values.measurementType,
        status: values.status,
      },
      paths: [
        "/progress/enter",
        `/students/${values.studentId}/progress`,
        `/students/${values.studentId}/analytics`,
        `/goals/${values.goalId}/data`,
        `/goals/${values.goalId}/analytics`,
      ],
    });

    return { status: "success", message: "Progress session saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function finalizeProgressSessionAction(formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({
      organizationId: z.string().uuid(),
      sessionId: z.string().uuid(),
      studentId: z.string().uuid(),
      goalId: z.string().uuid(),
    })
    .safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const { data: canFinalize, error: finalizeError } = await context.supabase.rpc(
      "can_finalize_progress",
      { p_org_id: context.organizationId, p_student_id: values.studentId },
    );
    if (finalizeError || !canFinalize)
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };

    const { error } = await context.supabase
      .from("progress_monitoring_sessions")
      .update({
        status: "finalized",
        finalized_at: new Date().toISOString(),
        finalized_by: context.user.id,
      })
      .eq("organization_id", context.organizationId)
      .eq("id", values.sessionId);

    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "progress_session.finalize",
      resourceType: "progress_monitoring_session",
      resourceId: values.sessionId,
      newState: { status: "finalized" },
      paths: [
        "/progress/enter",
        `/students/${values.studentId}/progress`,
        `/students/${values.studentId}/analytics`,
        `/goals/${values.goalId}/data`,
        `/goals/${values.goalId}/analytics`,
      ],
    });
    return { status: "success", message: "Progress session finalized." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

function buildDataPointPayload(
  organizationId: string,
  sessionId: string,
  values: z.infer<typeof progressSessionSchema>,
): Partial<ProgressDataPoint> {
  const base = {
    organization_id: organizationId,
    session_id: sessionId,
    measurement_type: values.measurementType,
  };

  switch (values.measurementType) {
    case "percentage":
      return {
        ...base,
        correct_count: values.correctCount,
        total_opportunities: values.totalOpportunities,
        calculated_percentage: calculatePercentage(values.correctCount, values.totalOpportunities),
      };
    case "reading_accuracy":
      return {
        ...base,
        correct_count: values.correctCount,
        total_opportunities: values.totalOpportunities,
        accuracy_percentage: calculateReadingAccuracy(
          values.correctCount,
          values.totalOpportunities,
        ),
      };
    case "rate":
      return {
        ...base,
        count_value: values.countValue,
        observation_duration_seconds: values.observationDurationSeconds,
        rate_unit: values.rateUnit,
        calculated_rate: calculateRate(
          values.countValue,
          values.observationDurationSeconds,
          values.rateUnit === "per_hour" ? "per_hour" : "per_minute",
        ),
      };
    case "frequency":
      return {
        ...base,
        count_value: values.countValue,
        observation_duration_seconds: values.observationDurationSeconds ?? null,
      };
    case "duration":
      return { ...base, duration_value: values.durationValue, duration_unit: values.durationUnit };
    case "latency":
      return { ...base, latency_value: values.latencyValue, latency_unit: values.latencyUnit };
    case "rubric":
      return {
        ...base,
        rubric_score: values.rubricScore,
        rubric_max: values.rubricMax ?? null,
        rubric_level: values.rubricLevel ?? null,
      };
    case "prompt_level":
      return {
        ...base,
        prompt_level: values.promptLevel,
        prompt_hierarchy_position: values.promptHierarchyPosition ?? null,
        independence_value: values.independenceValue ?? null,
      };
    case "task_analysis":
      return {
        ...base,
        task_independent_steps: values.taskIndependentSteps,
        task_prompted_steps: values.taskPromptedSteps,
        task_incorrect_steps: values.taskIncorrectSteps,
        task_not_attempted_steps: values.taskNotAttemptedSteps,
        step_responses: (values.stepResponses ?? []) as Json,
      };
    case "reading_fluency":
      return {
        ...base,
        words_read: values.wordsRead,
        error_count: values.errorCount,
        reading_time_seconds: values.readingTimeSeconds,
        words_correct_per_minute: calculateWordsCorrectPerMinute(
          values.wordsRead,
          values.errorCount,
          values.readingTimeSeconds,
        ),
      };
    case "independence":
      return {
        ...base,
        independence_value: values.independenceValue,
        prompt_level: values.promptLevel ?? null,
      };
    case "custom_numeric":
      return {
        ...base,
        custom_numeric_value: values.customNumericValue,
        custom_unit: values.customUnit,
        higher_is_better: values.higherIsBetter,
      };
  }
}
