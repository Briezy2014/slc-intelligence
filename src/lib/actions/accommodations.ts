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
  accommodationImplementationLogSchema,
  accommodationLibrarySchema,
  accommodationReviewSchema,
  studentAccommodationSchema,
} from "@/lib/validation/accommodations";

async function canAccommodation(
  context: Awaited<ReturnType<typeof getActionContext>>,
  rpc: "can_manage_accommodation" | "can_implement_accommodation",
  studentId: string,
) {
  if (!("supabase" in context)) return false;
  const { data, error } = await context.supabase.rpc(rpc, {
    p_org_id: context.organizationId,
    p_student_id: studentId,
  });
  return !error && Boolean(data);
}

export async function saveAccommodationLibraryItemAction(formData: FormData): Promise<ActionState> {
  const parsed = accommodationLibrarySchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "accommodation.library.manage");
  if (!("supabase" in context)) return context;

  try {
    const payload = {
      organization_id: context.organizationId,
      name: values.name,
      accommodation_area: values.accommodationArea ?? null,
      description: values.description,
      default_implementation_notes: values.defaultImplementationNotes ?? null,
      status: values.status,
      created_by: context.user.id,
    };
    const result = values.libraryItemId
      ? await context.supabase
          .from("accommodation_library_items")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.libraryItemId)
          .select("id")
          .single()
      : await context.supabase.from("accommodation_library_items").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.libraryItemId ? "accommodation_library.update" : "accommodation_library.create",
      resourceType: "accommodation_library_item",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/accommodations", "/accommodations/library", `/accommodations/library/${result.data.id}`],
    });
    return { status: "success", message: "Accommodation library item saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveStudentAccommodationAction(formData: FormData): Promise<ActionState> {
  const parsed = studentAccommodationSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    if (!(await canAccommodation(context, "can_manage_accommodation", values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }

    const payload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      iep_cycle_id: values.iepCycleId || null,
      library_item_id: values.libraryItemId || null,
      title: values.title,
      accommodation_area: values.accommodationArea ?? null,
      description: values.description,
      implementation_notes: values.implementationNotes ?? null,
      accommodation_snapshot: {
        title: values.title,
        accommodation_area: values.accommodationArea ?? null,
        status: values.status,
      },
      status: values.status,
      start_date: values.startDate || null,
      end_date: values.endDate || null,
      created_by: context.user.id,
      updated_by: context.user.id,
    };
    const result = values.accommodationId
      ? await context.supabase
          .from("student_accommodations")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.accommodationId)
          .select("id")
          .single()
      : await context.supabase.from("student_accommodations").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.accommodationId ? "student_accommodation.update" : "student_accommodation.create",
      resourceType: "student_accommodation",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/accommodations", `/students/${values.studentId}/accommodations`, `/students/${values.studentId}/accommodations/${result.data.id}`],
    });
    return { status: "success", message: "Student accommodation saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveAccommodationImplementationLogAction(formData: FormData): Promise<ActionState> {
  const parsed = accommodationImplementationLogSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    if (!(await canAccommodation(context, "can_implement_accommodation", values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }

    const payload = {
      organization_id: context.organizationId,
      student_accommodation_id: values.accommodationId,
      student_id: values.studentId,
      log_date: values.logDate,
      implemented_by: context.user.id,
      setting: values.setting ?? null,
      implementation_status: values.implementationStatus,
      status: values.status,
      notes: values.notes ?? null,
      finalized_at: values.status === "finalized" ? new Date().toISOString() : null,
      finalized_by: values.status === "finalized" ? context.user.id : null,
      created_by: context.user.id,
    };
    const result = await context.supabase.from("accommodation_implementation_logs").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "accommodation_implementation.create",
      resourceType: "accommodation_implementation_log",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/accommodations", `/students/${values.studentId}/accommodations`],
    });
    return { status: "success", message: "Accommodation implementation log saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveAccommodationReviewAction(formData: FormData): Promise<ActionState> {
  const parsed = accommodationReviewSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    if (!(await canAccommodation(context, "can_manage_accommodation", values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      student_accommodation_id: values.accommodationId,
      student_id: values.studentId,
      review_date: values.reviewDate,
      reviewed_by: context.user.id,
      review_summary: values.reviewSummary,
      recommendation: values.recommendation ?? null,
      next_review_date: values.nextReviewDate || null,
    };
    const result = await context.supabase.from("accommodation_review_records").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "accommodation_review.create",
      resourceType: "accommodation_review_record",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/accommodations", `/students/${values.studentId}/accommodations`],
    });
    return { status: "success", message: "Accommodation review saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
