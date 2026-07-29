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
import { hasPermission } from "@/lib/permissions/check";
import {
  dosageLogSchema,
  fidelityObservationSchema,
  interventionComponentSchema,
  interventionLibrarySchema,
  interventionPlanSchema,
  interventionReviewSchema,
} from "@/lib/validation/interventions";

async function planById(context: Awaited<ReturnType<typeof getActionContext>>, planId: string) {
  if (!("supabase" in context)) return null;
  const { data, error } = await context.supabase
    .from("intervention_plans")
    .select("*")
    .eq("organization_id", context.organizationId)
    .eq("id", planId)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

async function canIntervention(
  context: Awaited<ReturnType<typeof getActionContext>>,
  rpc:
    | "can_manage_intervention_plan"
    | "can_activate_intervention"
    | "can_enter_fidelity"
    | "can_finalize_fidelity"
    | "can_read_intervention",
  studentId: string,
) {
  if (!("supabase" in context)) return false;
  const { data, error } = await context.supabase.rpc(rpc, {
    p_org_id: context.organizationId,
    p_student_id: studentId,
  });
  return !error && Boolean(data);
}

export async function saveInterventionLibraryItemAction(formData: FormData): Promise<ActionState> {
  const parsed = interventionLibrarySchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "intervention.library.manage");
  if (!("supabase" in context)) return context;

  try {
    const payload = {
      organization_id: context.organizationId,
      name: values.name,
      category: values.category ?? null,
      description: values.description,
      evidence_level: values.evidenceLevel,
      status: values.status,
      created_by: context.user.id,
    };
    const result = values.libraryItemId
      ? await context.supabase
          .from("intervention_library_items")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.libraryItemId)
          .select("id")
          .single()
      : await context.supabase.from("intervention_library_items").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.libraryItemId ? "intervention_library.update" : "intervention_library.create",
      resourceType: "intervention_library_item",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/interventions", "/interventions/library", `/interventions/library/${result.data.id}`],
    });
    return { status: "success", message: "Intervention library item saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveInterventionPlanAction(formData: FormData): Promise<ActionState> {
  const parsed = interventionPlanSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const existing = values.planId ? await planById(context, values.planId) : null;
    const studentId = existing?.student_id ?? values.studentId;
    const needsActivation = ["active", "paused", "completed", "discontinued", "archived"].includes(values.status);
    const allowed = needsActivation
      ? await canIntervention(context, "can_activate_intervention", studentId)
      : await canIntervention(context, "can_manage_intervention_plan", studentId);
    if (!allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };

    const payload = {
      organization_id: context.organizationId,
      student_id: studentId,
      library_item_id: values.libraryItemId || null,
      title: values.title,
      description: values.description ?? null,
      status: values.status,
      start_date: values.startDate || null,
      end_date: values.endDate || null,
      created_by: context.user.id,
      owner_user_id: context.user.id,
      activated_at: needsActivation ? new Date().toISOString() : existing?.activated_at ?? null,
      activated_by: needsActivation ? context.user.id : existing?.activated_by ?? null,
    };
    const result = existing
      ? await context.supabase
          .from("intervention_plans")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", existing.id)
          .select("id")
          .single()
      : await context.supabase.from("intervention_plans").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await context.supabase.from("intervention_status_history").insert({
      plan_id: result.data.id,
      from_status: existing?.status ?? null,
      to_status: values.status,
      changed_by: context.user.id,
    });
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: existing ? "intervention_plan.update" : "intervention_plan.create",
      resourceType: "intervention_plan",
      resourceId: result.data.id,
      previousState: existing ? { status: existing.status } : null,
      newState: payload,
      paths: ["/interventions", `/students/${studentId}/interventions`, `/students/${studentId}/interventions/${result.data.id}`],
    });
    return { status: "success", message: "Intervention plan saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function addInterventionComponentAction(formData: FormData): Promise<ActionState> {
  const parsed = interventionComponentSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const plan = await planById(context, values.planId);
    if (!plan || !(await canIntervention(context, "can_manage_intervention_plan", plan.student_id))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const { error } = await context.supabase.from("intervention_components").insert({
      plan_id: plan.id,
      label: values.label,
      description: values.description,
      implementation_notes: values.implementationNotes ?? null,
      sort_order: values.sortOrder,
    });
    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "intervention_component.create",
      resourceType: "intervention_component",
      resourceId: plan.id,
      newState: { label: values.label },
      paths: [`/students/${plan.student_id}/interventions/${plan.id}`],
    });
    return { status: "success", message: "Intervention component added." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveFidelityObservationAction(formData: FormData): Promise<ActionState> {
  const parsed = fidelityObservationSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const plan = await planById(context, values.planId);
    if (!plan) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    const allowed =
      values.status === "finalized"
        ? await canIntervention(context, "can_finalize_fidelity", plan.student_id)
        : await canIntervention(context, "can_enter_fidelity", plan.student_id);
    if (!allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    const { error } = await context.supabase.from("fidelity_observations").insert({
      plan_id: plan.id,
      checklist_id: values.checklistId,
      observation_date: values.observationDate,
      observer_user_id: context.user.id,
      status: values.status,
      notes: values.notes ?? null,
      finalized_at: values.status === "finalized" ? new Date().toISOString() : null,
      finalized_by: values.status === "finalized" ? context.user.id : null,
      created_by: context.user.id,
    });
    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "intervention_fidelity.create",
      resourceType: "fidelity_observation",
      resourceId: plan.id,
      newState: { status: values.status },
      paths: [`/students/${plan.student_id}/interventions/fidelity`, `/students/${plan.student_id}/interventions/analytics`],
    });
    return { status: "success", message: "Fidelity observation saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveDosageLogAction(formData: FormData): Promise<ActionState> {
  const parsed = dosageLogSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const plan = await planById(context, values.planId);
    const allowed = await hasPermission(context.supabase, context.organizationId, "intervention.dosage.enter");
    if (!plan || !allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    const { error } = await context.supabase.from("intervention_dosage_logs").insert({
      plan_id: plan.id,
      log_date: values.logDate,
      delivered_by: context.user.id,
      duration_minutes: values.durationMinutes ?? null,
      sessions_delivered: values.sessionsDelivered,
      setting: values.setting ?? null,
      notes: values.notes ?? null,
      created_by: context.user.id,
    });
    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "intervention_dosage.create",
      resourceType: "intervention_dosage_log",
      resourceId: plan.id,
      newState: { log_date: values.logDate, sessions_delivered: values.sessionsDelivered },
      paths: [`/students/${plan.student_id}/interventions/dosage`, `/students/${plan.student_id}/interventions/analytics`],
    });
    return { status: "success", message: "Dosage log saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveInterventionReviewAction(formData: FormData): Promise<ActionState> {
  const parsed = interventionReviewSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const plan = await planById(context, values.planId);
    const allowed = await hasPermission(context.supabase, context.organizationId, "intervention.review");
    if (!plan || !allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    const { error } = await context.supabase.from("intervention_review_records").insert({
      plan_id: plan.id,
      review_date: values.reviewDate,
      reviewer_user_id: context.user.id,
      summary: values.summary,
      outcome: values.outcome,
      next_review_date: values.nextReviewDate || null,
    });
    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "intervention_review.create",
      resourceType: "intervention_review_record",
      resourceId: plan.id,
      newState: { outcome: values.outcome },
      paths: [`/students/${plan.student_id}/interventions/reviews`, `/students/${plan.student_id}/interventions/${plan.id}`],
    });
    return { status: "success", message: "Intervention review saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
