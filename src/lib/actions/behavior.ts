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
import { calculateIntervalPercentage, calculateRate } from "@/lib/analytics/behavior-calculations";
import type { Json } from "@/lib/supabase/types";
import {
  behaviorDefinitionSchema,
  behaviorObservationSchema,
  behaviorStatusSchema,
  fbaWorkspaceSchema,
} from "@/lib/validation/behavior";

async function behaviorSessionById(context: Awaited<ReturnType<typeof getActionContext>>, sessionId: string) {
  if (!("supabase" in context)) return null;
  const { data, error } = await context.supabase
    .from("behavior_observation_sessions")
    .select("*")
    .eq("organization_id", context.organizationId)
    .eq("id", sessionId)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

async function canBehavior(
  context: Awaited<ReturnType<typeof getActionContext>>,
  rpc: "can_define_behavior" | "can_observe_behavior" | "can_finalize_behavior" | "can_manage_fba",
  studentId: string,
) {
  if (!("supabase" in context)) return false;
  const { data, error } = await context.supabase.rpc(rpc, {
    p_org_id: context.organizationId,
    p_student_id: studentId,
  });
  return !error && Boolean(data);
}

function lines(value: string | undefined) {
  return (value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function saveBehaviorDefinitionAction(formData: FormData): Promise<ActionState> {
  const parsed = behaviorDefinitionSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const studentId = values.behaviorId
      ? (
          await context.supabase
            .from("behavior_definitions")
            .select("student_id")
            .eq("organization_id", context.organizationId)
            .eq("id", values.behaviorId)
            .maybeSingle()
        ).data?.student_id ?? values.studentId
      : values.studentId;
    if (!(await canBehavior(context, "can_define_behavior", studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }

    const payload = {
      organization_id: context.organizationId,
      student_id: studentId,
      name: values.name,
      operational_definition: values.operationalDefinition,
      measurement_notes: values.measurementNotes ?? null,
      status: values.status,
      created_by: context.user.id,
    };
    const result = values.behaviorId
      ? await context.supabase
          .from("behavior_definitions")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.behaviorId)
          .select("id")
          .single()
      : await context.supabase.from("behavior_definitions").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    if (values.behaviorId) {
      await context.supabase.from("behavior_definition_examples").delete().eq("behavior_definition_id", result.data.id);
      await context.supabase.from("behavior_definition_nonexamples").delete().eq("behavior_definition_id", result.data.id);
    }
    const exampleRows = lines(values.examples).map((example, index) => ({
      behavior_definition_id: result.data.id,
      example_text: example,
      sort_order: index + 1,
    }));
    const nonexampleRows = lines(values.nonexamples).map((nonexample, index) => ({
      behavior_definition_id: result.data.id,
      nonexample_text: nonexample,
      sort_order: index + 1,
    }));
    if (exampleRows.length) await context.supabase.from("behavior_definition_examples").insert(exampleRows);
    if (nonexampleRows.length) await context.supabase.from("behavior_definition_nonexamples").insert(nonexampleRows);

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.behaviorId ? "behavior_definition.update" : "behavior_definition.create",
      resourceType: "behavior_definition",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/behavior-detective", `/students/${studentId}/behavior`, `/students/${studentId}/behavior/definitions`],
    });
    return { status: "success", message: "Behavior definition saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveBehaviorObservationAction(formData: FormData): Promise<ActionState> {
  const parsed = behaviorObservationSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const canObserve = await canBehavior(context, "can_observe_behavior", values.studentId);
    const canFinalize = await canBehavior(context, "can_finalize_behavior", values.studentId);
    if (!canObserve || (values.status === "finalized" && !canFinalize)) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const sessionPayload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      behavior_definition_id: values.behaviorDefinitionId,
      measurement_method: values.measurementMethod,
      session_date: values.sessionDate,
      session_time: values.sessionTime || null,
      observer_user_id: context.user.id,
      setting: values.setting ?? null,
      activity: values.activity ?? null,
      people_present: values.peoplePresent ?? null,
      status: values.status,
      notes: values.notes ?? null,
      finalized_at: values.status === "finalized" ? new Date().toISOString() : null,
      finalized_by: values.status === "finalized" ? context.user.id : null,
      created_by: context.user.id,
    };
    const result = await context.supabase
      .from("behavior_observation_sessions")
      .insert(sessionPayload)
      .select("id")
      .single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    const sessionId = result.data.id;
    if (values.measurementMethod === "abc") {
      await context.supabase.from("abc_observations").insert({
        session_id: sessionId,
        recorded_antecedent: values.recordedAntecedent,
        observable_behavior: values.observableBehavior,
        recorded_consequence: values.recordedConsequence,
        duration_seconds: values.durationSeconds ?? null,
        replacement_observed: values.replacementObserved,
      });
    } else if (values.measurementMethod === "frequency") {
      await context.supabase.from("frequency_observations").insert({
        session_id: sessionId,
        count: values.count,
        observation_duration_seconds: values.observationDurationSeconds,
        calculated_rate_per_minute: calculateRate(values.count, values.observationDurationSeconds),
      });
    } else if (values.measurementMethod === "duration") {
      await context.supabase.from("duration_observations").insert({
        session_id: sessionId,
        total_duration_seconds: values.totalDurationSeconds,
        episode_count: values.episodeCount,
        average_episode_seconds:
          values.episodeCount > 0 ? Number((values.totalDurationSeconds / values.episodeCount).toFixed(4)) : null,
      });
    } else if (values.measurementMethod === "latency") {
      await context.supabase.from("latency_observations").insert({
        session_id: sessionId,
        trigger_description: values.triggerDescription,
        latency_seconds: values.latencySeconds,
        response_description: values.responseDescription ?? null,
      });
    } else if (values.measurementMethod === "interval") {
      await context.supabase.from("interval_observations").insert({
        session_id: sessionId,
        recording_method: values.recordingMethod,
        interval_duration_seconds: values.intervalDurationSeconds,
        interval_count: values.intervalCount,
        intervals_positive: values.intervalsPositive,
        percentage_of_intervals: calculateIntervalPercentage(values.intervalsPositive, values.intervalCount),
        interval_results: [],
      });
    } else {
      await context.supabase.from("intensity_ratings").insert({
        session_id: sessionId,
        intensity_level_id: values.intensityLevelId,
      });
    }

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "behavior_observation.create",
      resourceType: "behavior_observation_session",
      resourceId: sessionId,
      newState: { measurement_method: values.measurementMethod, status: values.status },
      paths: [
        "/behavior-detective",
        `/students/${values.studentId}/behavior/observations`,
        `/students/${values.studentId}/behavior/analytics`,
      ],
    });
    return { status: "success", message: "Behavior observation saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

async function updateBehaviorStatus(
  formData: FormData,
  toStatus: "finalized" | "corrected",
  actionType: string,
): Promise<ActionState> {
  const parsed = behaviorStatusSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const session = await behaviorSessionById(context, values.sessionId);
    if (!session || !(await canBehavior(context, "can_finalize_behavior", session.student_id))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    if (toStatus === "corrected") {
      await context.supabase.from("behavior_observation_corrections").insert({
        session_id: session.id,
        previous_snapshot: session as unknown as Json,
        corrected_by: context.user.id,
        reason: values.note ?? "Correction entered by authorized educator.",
      });
    }
    const { error } = await context.supabase
      .from("behavior_observation_sessions")
      .update({
        status: toStatus,
        finalized_at: toStatus === "finalized" ? new Date().toISOString() : session.finalized_at,
        finalized_by: toStatus === "finalized" ? context.user.id : session.finalized_by,
      })
      .eq("organization_id", context.organizationId)
      .eq("id", session.id);
    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await context.supabase.from("behavior_entry_status_history").insert({
      session_id: session.id,
      from_status: session.status,
      to_status: toStatus,
      changed_by: context.user.id,
      note: values.note ?? null,
    });
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType,
      resourceType: "behavior_observation_session",
      resourceId: session.id,
      previousState: { status: session.status },
      newState: { status: toStatus },
      paths: [`/students/${session.student_id}/behavior/observations`, `/students/${session.student_id}/behavior/analytics`],
    });
    return { status: "success", message: "Behavior observation updated." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function finalizeBehaviorObservationAction(formData: FormData): Promise<ActionState> {
  return updateBehaviorStatus(formData, "finalized", "behavior_observation.finalize");
}

export async function correctBehaviorObservationAction(formData: FormData): Promise<ActionState> {
  return updateBehaviorStatus(formData, "corrected", "behavior_observation.correct");
}

export async function saveFbaWorkspaceAction(formData: FormData): Promise<ActionState> {
  const parsed = fbaWorkspaceSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    if (!(await canBehavior(context, "can_manage_fba", values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      behavior_definition_id: values.behaviorDefinitionId,
      date_range_start: values.dateRangeStart,
      date_range_end: values.dateRangeEnd,
      status: values.status,
      educator_hypothesis: values.educatorHypothesis ?? null,
      team_notes: values.teamNotes ?? null,
      created_by: context.user.id,
    };
    const result = values.workspaceId
      ? await context.supabase
          .from("fba_evidence_workspaces")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.workspaceId)
          .select("id")
          .single()
      : await context.supabase.from("fba_evidence_workspaces").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.workspaceId ? "fba_workspace.update" : "fba_workspace.create",
      resourceType: "fba_evidence_workspace",
      resourceId: result.data.id,
      newState: payload,
      paths: [`/students/${values.studentId}/behavior/fba-support`, `/students/${values.studentId}/behavior/analytics`],
    });
    return { status: "success", message: "FBA workspace saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
