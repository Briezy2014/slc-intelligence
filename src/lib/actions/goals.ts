"use server";

import { z } from "zod";
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
import { canManageGoal } from "@/lib/permissions/check";
import { iepCycleSchema, iepGoalSchema, iepObjectiveSchema } from "@/lib/validation/goal";

const cycleMutationSchema = iepCycleSchema.extend({
  cycleId: z.string().uuid().optional(),
});

const goalMutationSchema = iepGoalSchema.extend({
  goalId: z.string().uuid().optional(),
});

export async function saveIepCycleAction(formData: FormData): Promise<ActionState> {
  const parsed = cycleMutationSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  const allowed = await canManageGoal(context.supabase, context.organizationId, values.studentId);
  if (!allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };

  try {
    const payload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      label: values.label,
      start_date: values.startDate,
      end_date: values.endDate ?? null,
      review_date: values.reviewDate ?? null,
      status: values.status,
      created_by: values.cycleId ? undefined : context.user.id,
      updated_by: context.user.id,
    };
    const result = values.cycleId
      ? await context.supabase
          .from("iep_cycles")
          .update({ ...payload, created_by: undefined })
          .eq("organization_id", context.organizationId)
          .eq("id", values.cycleId)
          .select("id")
          .single()
      : await context.supabase.from("iep_cycles").insert(payload).select("id").single();

    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.cycleId ? "iep_cycle.update" : "iep_cycle.create",
      resourceType: "iep_cycle",
      resourceId: result.data.id,
      paths: [`/students/${values.studentId}/iep`, `/students/${values.studentId}/goals`],
    });
    return { status: "success", message: "IEP cycle saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveGoalAction(formData: FormData): Promise<ActionState> {
  const parsed = goalMutationSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  const allowed = await canManageGoal(context.supabase, context.organizationId, values.studentId);
  if (!allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };

  try {
    const payload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      iep_cycle_id: values.iepCycleId,
      goal_area: values.goalArea,
      goal_statement: values.goalStatement,
      measurement_type: values.measurementType,
      unit_of_measurement: values.unitOfMeasurement ?? null,
      evaluation_frequency: values.evaluationFrequency ?? null,
      target_value: values.targetValue ?? null,
      target_direction: values.targetDirection,
      start_date: values.startDate ?? null,
      target_date: values.targetDate ?? null,
      status: values.status,
      responsible_user_id: values.responsibleUserId || null,
      created_by: values.goalId ? undefined : context.user.id,
      updated_by: context.user.id,
    };
    const result = values.goalId
      ? await context.supabase
          .from("iep_goals")
          .update({ ...payload, created_by: undefined })
          .eq("organization_id", context.organizationId)
          .eq("id", values.goalId)
          .select("id")
          .single()
      : await context.supabase.from("iep_goals").insert(payload).select("id").single();

    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.goalId ? "goal.update" : "goal.create",
      resourceType: "iep_goal",
      resourceId: result.data.id,
      newState: {
        measurement_type: payload.measurement_type,
        target_direction: payload.target_direction,
        status: payload.status,
      },
      paths: ["/goals", `/goals/${result.data.id}`, `/students/${values.studentId}/goals`],
    });
    return { status: "success", message: "Goal saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveObjectiveAction(formData: FormData): Promise<ActionState> {
  const parsed = iepObjectiveSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const { data: goal, error: goalError } = await context.supabase
      .from("iep_goals")
      .select("student_id")
      .eq("organization_id", context.organizationId)
      .eq("id", values.goalId)
      .single();
    if (goalError || !goal) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    const allowed = await canManageGoal(context.supabase, context.organizationId, goal.student_id);
    if (!allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };

    const { data, error } = await context.supabase
      .from("iep_objectives")
      .insert({
        organization_id: context.organizationId,
        goal_id: values.goalId,
        sequence_no: values.sequenceNo,
        objective_statement: values.objectiveStatement,
        target_value: values.targetValue ?? null,
        measurement_type: values.measurementType ?? null,
        status: values.status,
        start_date: values.startDate ?? null,
        target_date: values.targetDate ?? null,
      })
      .select("id")
      .single();
    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "objective.create",
      resourceType: "iep_objective",
      resourceId: data.id,
      paths: [`/goals/${values.goalId}`, `/students/${goal.student_id}/goals`],
    });
    return { status: "success", message: "Objective saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
