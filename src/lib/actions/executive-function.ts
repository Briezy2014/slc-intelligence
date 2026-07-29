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
import {
  checklistResponseSchema,
  executiveFunctionObservationSchema,
  executiveFunctionPlanSchema,
} from "@/lib/validation/executive-function";

async function canEf(
  context: Awaited<ReturnType<typeof getActionContext>>,
  rpc: "can_manage_ef_plan" | "can_observe_ef" | "can_respond_checklist",
  studentId: string,
) {
  if (!("supabase" in context)) return false;
  const { data, error } = await context.supabase.rpc(rpc, {
    p_org_id: context.organizationId,
    p_student_id: studentId,
  });
  return !error && Boolean(data);
}

export async function saveExecutiveFunctionPlanAction(formData: FormData): Promise<ActionState> {
  const parsed = executiveFunctionPlanSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  try {
    if (!(await canEf(context, "can_manage_ef_plan", values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      skill_area_id: values.skillAreaId || null,
      title: values.title,
      description: values.description ?? null,
      status: values.status,
      start_date: values.startDate || null,
      end_date: values.endDate || null,
      created_by: context.user.id,
    };
    const result = values.planId
      ? await context.supabase
          .from("student_executive_function_plans")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.planId)
          .select("id")
          .single()
      : await context.supabase.from("student_executive_function_plans").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.planId ? "ef_plan.update" : "ef_plan.create",
      resourceType: "student_executive_function_plan",
      resourceId: result.data.id,
      newState: { ...payload, no_mastery_claim: true },
      paths: ["/executive-function", `/students/${values.studentId}/executive-function`],
    });
    return { status: "success", message: "Executive function plan saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveExecutiveFunctionObservationAction(formData: FormData): Promise<ActionState> {
  const parsed = executiveFunctionObservationSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  try {
    if (!(await canEf(context, "can_observe_ef", values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      ef_plan_id: values.planId,
      support_id: values.supportId || null,
      student_id: values.studentId,
      observation_date: values.observationDate,
      observer_user_id: context.user.id,
      prompt_level: values.promptLevel,
      observation_note: values.observationNote ?? null,
      status: values.status,
      finalized_at: values.status === "finalized" ? new Date().toISOString() : null,
      finalized_by: values.status === "finalized" ? context.user.id : null,
    };
    const result = await context.supabase.from("executive_function_observations").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "ef_observation.create",
      resourceType: "executive_function_observation",
      resourceId: result.data.id,
      newState: { prompt_level: values.promptLevel, no_mastery_claim: true },
      paths: ["/executive-function", `/students/${values.studentId}/executive-function`],
    });
    return { status: "success", message: "Executive function observation saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveChecklistResponseAction(formData: FormData): Promise<ActionState> {
  const parsed = checklistResponseSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  try {
    if (!(await canEf(context, "can_respond_checklist", values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      checklist_id: values.checklistId,
      checklist_item_id: values.checklistItemId,
      student_id: values.studentId,
      response_date: values.responseDate,
      response: values.response,
      note: values.note ?? null,
      responded_by: context.user.id,
    };
    const result = await context.supabase.from("student_checklist_responses").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "checklist_response.create",
      resourceType: "student_checklist_response",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/executive-function", `/students/${values.studentId}/executive-function/checklists`],
    });
    return { status: "success", message: "Checklist response saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
