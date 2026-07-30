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
  serviceComponentSchema,
  serviceDefinitionSchema,
  serviceDeliveryLogSchema,
  servicePlanSchema,
  serviceReviewSchema,
} from "@/lib/validation/services";

async function canService(
  context: Awaited<ReturnType<typeof getActionContext>>,
  rpc:
    | "can_manage_service_plan"
    | "can_activate_service_plan"
    | "can_enter_service_log"
    | "can_finalize_service_log"
    | "can_read_service",
  studentId: string,
) {
  if (!("supabase" in context)) return false;
  const { data, error } = await context.supabase.rpc(rpc, {
    p_org_id: context.organizationId,
    p_student_id: studentId,
  });
  return !error && Boolean(data);
}

function parseParticipantIds(raw: string | undefined, primaryStudentId: string) {
  return Array.from(
    new Set(
      [primaryStudentId, ...(raw ?? "").split(/[,\s]+/)]
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

export async function saveServiceDefinitionAction(formData: FormData): Promise<ActionState> {
  const parsed = serviceDefinitionSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "service.definition.manage");
  if (!("supabase" in context)) return context;

  try {
    const payload = {
      organization_id: context.organizationId,
      name: values.name,
      service_area: values.serviceArea,
      description: values.description ?? null,
      default_delivery_type: values.defaultDeliveryType || null,
      status: values.status,
      created_by: context.user.id,
    };
    const result = values.serviceDefinitionId
      ? await context.supabase
          .from("service_definitions")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.serviceDefinitionId)
          .select("id")
          .single()
      : await context.supabase.from("service_definitions").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.serviceDefinitionId
        ? "service_definition.update"
        : "service_definition.create",
      resourceType: "service_definition",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/services", "/services/definitions"],
    });
    return { status: "success", message: "Service definition saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveServicePlanAction(formData: FormData): Promise<ActionState> {
  const parsed = servicePlanSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const needsActivation = ["active", "ended", "archived"].includes(values.status);
    const allowed = needsActivation
      ? await canService(context, "can_activate_service_plan", values.studentId)
      : await canService(context, "can_manage_service_plan", values.studentId);
    if (!allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };

    const payload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      iep_cycle_id: values.iepCycleId || null,
      service_definition_id: values.serviceDefinitionId || null,
      title: values.title,
      description: values.description ?? null,
      service_snapshot: { title: values.title, status: values.status },
      status: values.status,
      start_date: values.startDate || null,
      end_date: values.endDate || null,
      created_by: context.user.id,
      activated_at: needsActivation ? new Date().toISOString() : null,
      activated_by: needsActivation ? context.user.id : null,
    };
    const result = values.servicePlanId
      ? await context.supabase
          .from("student_service_plans")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.servicePlanId)
          .select("id")
          .single()
      : await context.supabase.from("student_service_plans").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.servicePlanId ? "service_plan.update" : "service_plan.create",
      resourceType: "student_service_plan",
      resourceId: result.data.id,
      newState: payload,
      paths: [
        "/services",
        `/students/${values.studentId}/services`,
        `/students/${values.studentId}/services/${result.data.id}`,
      ],
    });
    return { status: "success", message: "Service plan saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function addServiceComponentAction(formData: FormData): Promise<ActionState> {
  const parsed = serviceComponentSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const plan = (
      await context.supabase
        .from("student_service_plans")
        .select("id,student_id")
        .eq("organization_id", context.organizationId)
        .eq("id", values.servicePlanId)
        .maybeSingle()
    ).data;
    if (!plan || !(await canService(context, "can_manage_service_plan", plan.student_id))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      service_plan_id: plan.id,
      component_name: values.componentName,
      service_minutes: values.serviceMinutes ?? null,
      frequency: values.frequency ?? null,
      setting: values.setting ?? null,
      delivery_type: values.deliveryType || null,
      notes: values.notes ?? null,
      sort_order: values.sortOrder,
    };
    const result = await context.supabase
      .from("service_plan_components")
      .insert(payload)
      .select("id")
      .single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "service_component.create",
      resourceType: "service_plan_component",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/services", `/students/${plan.student_id}/services/${plan.id}`],
    });
    return { status: "success", message: "Service component added." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveServiceDeliveryLogAction(formData: FormData): Promise<ActionState> {
  const parsed = serviceDeliveryLogSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    const requiredRpc =
      values.recordStatus === "finalized" ? "can_finalize_service_log" : "can_enter_service_log";
    const participantIds = parseParticipantIds(
      values.participantStudentIds,
      values.primaryStudentId,
    );
    const participantChecks = await Promise.all(
      participantIds.map((studentId) => canService(context, requiredRpc, studentId)),
    );
    if (participantChecks.some((allowed) => !allowed)) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }

    const payload = {
      organization_id: context.organizationId,
      service_plan_id: values.servicePlanId,
      service_component_id: values.serviceComponentId || null,
      primary_student_id: values.primaryStudentId,
      provider_user_id: context.user.id,
      service_date: values.serviceDate,
      start_time: values.startTime || null,
      end_time: values.endTime || null,
      delivery_type: values.deliveryType,
      service_status: values.serviceStatus,
      record_status: values.recordStatus,
      notes: values.notes ?? null,
      finalized_at: values.recordStatus === "finalized" ? new Date().toISOString() : null,
      finalized_by: values.recordStatus === "finalized" ? context.user.id : null,
      created_by: context.user.id,
    };
    const result = await context.supabase
      .from("service_delivery_logs")
      .insert(payload)
      .select("id")
      .single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    const participantRows = participantIds.map((studentId) => ({
      organization_id: context.organizationId,
      delivery_log_id: result.data.id,
      student_id: studentId,
    }));
    if (participantRows.length) {
      const participantResult = await context.supabase
        .from("service_delivery_participants")
        .insert(participantRows);
      if (participantResult.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    }

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "service_delivery_log.create",
      resourceType: "service_delivery_log",
      resourceId: result.data.id,
      newState: { ...payload, participant_student_ids: participantIds },
      paths: ["/services", `/students/${values.primaryStudentId}/services`],
    });
    return { status: "success", message: "Service delivery log saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveServiceReviewAction(formData: FormData): Promise<ActionState> {
  const parsed = serviceReviewSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  try {
    if (!(await canService(context, "can_manage_service_plan", values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      service_plan_id: values.servicePlanId,
      student_id: values.studentId,
      review_date: values.reviewDate,
      reviewed_by: context.user.id,
      review_summary: values.reviewSummary,
      recommendation: values.recommendation ?? null,
      next_review_date: values.nextReviewDate || null,
    };
    const result = await context.supabase
      .from("service_review_records")
      .insert(payload)
      .select("id")
      .single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "service_review.create",
      resourceType: "service_review_record",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/services", `/students/${values.studentId}/services`],
    });
    return { status: "success", message: "Service review saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
