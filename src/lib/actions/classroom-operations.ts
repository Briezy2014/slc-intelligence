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
  classroomAnnouncementSchema,
  classroomRoutineSchema,
  classroomScheduleBlockSchema,
  classroomScheduleSchema,
  dailyStudentNoteSchema,
} from "@/lib/validation/classroom-operations";

async function canClassroomOps(
  context: Awaited<ReturnType<typeof getActionContext>>,
  rpc: "can_manage_classroom_schedule" | "can_read_classroom_ops",
  classroomId: string,
) {
  if (!("supabase" in context)) return false;
  const { data, error } = await context.supabase.rpc(rpc, {
    p_org_id: context.organizationId,
    p_classroom_id: classroomId,
  });
  return !error && Boolean(data);
}

async function canDailyNote(
  context: Awaited<ReturnType<typeof getActionContext>>,
  rpc: "can_enter_daily_note" | "can_finalize_daily_note",
  studentId: string,
) {
  if (!("supabase" in context)) return false;
  const { data, error } = await context.supabase.rpc(rpc, {
    p_org_id: context.organizationId,
    p_student_id: studentId,
  });
  return !error && Boolean(data);
}

export async function saveClassroomScheduleAction(formData: FormData): Promise<ActionState> {
  const parsed = classroomScheduleSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  try {
    if (!(await canClassroomOps(context, "can_manage_classroom_schedule", values.classroomId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      classroom_id: values.classroomId,
      name: values.name,
      academic_year: values.academicYear ?? null,
      status: values.status,
      created_by: context.user.id,
    };
    const result = values.scheduleId
      ? await context.supabase
          .from("classroom_schedules")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.scheduleId)
          .select("id")
          .single()
      : await context.supabase.from("classroom_schedules").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.scheduleId ? "classroom_schedule.update" : "classroom_schedule.create",
      resourceType: "classroom_schedule",
      resourceId: result.data.id,
      newState: payload,
      paths: [
        "/classroom-operations",
        "/classroom-operations/daily",
        "/classroom-operations/schedules",
        `/classrooms/${values.classroomId}/schedule`,
      ],
    });
    return { status: "success", message: "Classroom schedule saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function addClassroomScheduleBlockAction(formData: FormData): Promise<ActionState> {
  const parsed = classroomScheduleBlockSchema.safeParse(
    emptyToUndefined(formDataToObject(formData)),
  );
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  try {
    if (!(await canClassroomOps(context, "can_manage_classroom_schedule", values.classroomId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      schedule_id: values.scheduleId,
      classroom_id: values.classroomId,
      day_of_week: values.dayOfWeek ?? null,
      start_time: values.startTime,
      end_time: values.endTime,
      label: values.label,
      block_type: values.blockType ?? null,
      location: values.location ?? null,
      sort_order: values.sortOrder,
    };
    const result = await context.supabase
      .from("classroom_schedule_blocks")
      .insert(payload)
      .select("id")
      .single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "classroom_schedule_block.create",
      resourceType: "classroom_schedule_block",
      resourceId: result.data.id,
      newState: payload,
      paths: [
        "/classroom-operations",
        "/classroom-operations/daily",
        "/classroom-operations/schedules",
        `/classrooms/${values.classroomId}/schedule`,
      ],
    });
    return { status: "success", message: "Schedule block added." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveDailyStudentNoteAction(formData: FormData): Promise<ActionState> {
  const parsed = dailyStudentNoteSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  try {
    const requiredRpc =
      values.status === "finalized" ? "can_finalize_daily_note" : "can_enter_daily_note";
    if (!(await canDailyNote(context, requiredRpc, values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      note_date: values.noteDate,
      note_text: values.noteText,
      status: values.status,
      entered_by: context.user.id,
      finalized_at: values.status === "finalized" ? new Date().toISOString() : null,
      finalized_by: values.status === "finalized" ? context.user.id : null,
    };
    const result = await context.supabase
      .from("daily_student_notes")
      .insert(payload)
      .select("id")
      .single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "daily_student_note.create",
      resourceType: "daily_student_note",
      resourceId: result.data.id,
      newState: { ...payload, note_text: "[student-scoped-note]" },
      paths: [
        "/classroom-operations",
        "/classroom-operations/daily",
        "/classroom-operations/notes",
        `/students/${values.studentId}/classroom-operations`,
      ],
    });
    return { status: "success", message: "Daily student note saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveClassroomRoutineAction(formData: FormData): Promise<ActionState> {
  const parsed = classroomRoutineSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "routine.manage");
  if (!("supabase" in context)) return context;
  try {
    if (!(await canClassroomOps(context, "can_read_classroom_ops", values.classroomId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      classroom_id: values.classroomId,
      name: values.name,
      description: values.description?.trim() ? values.description.trim() : null,
      status: values.status,
      created_by: context.user.id,
    };
    const result = await context.supabase
      .from("classroom_routines")
      .insert(payload)
      .select("id")
      .single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "classroom_routine.create",
      resourceType: "classroom_routine",
      resourceId: result.data.id,
      newState: payload,
      paths: [
        "/classroom-operations",
        "/classroom-operations/daily",
        "/classroom-operations/routines",
        `/classrooms/${values.classroomId}/schedule`,
      ],
    });
    return { status: "success", message: "Classroom routine saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveClassroomAnnouncementAction(formData: FormData): Promise<ActionState> {
  const parsed = classroomAnnouncementSchema.safeParse(
    emptyToUndefined(formDataToObject(formData)),
  );
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "announcement.manage");
  if (!("supabase" in context)) return context;
  try {
    if (!(await canClassroomOps(context, "can_read_classroom_ops", values.classroomId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      classroom_id: values.classroomId,
      title: values.title,
      body: values.body,
      contains_student_pii: false,
      audience: values.audience,
      publish_at: values.publishAt || null,
      expires_at: values.expiresAt || null,
      status: values.status,
      created_by: context.user.id,
    };
    const result = await context.supabase
      .from("classroom_announcements")
      .insert(payload)
      .select("id")
      .single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "classroom_announcement.create",
      resourceType: "classroom_announcement",
      resourceId: result.data.id,
      newState: payload,
      paths: [
        "/classroom-operations",
        "/classroom-operations/daily",
        "/classroom-operations/announcements",
        `/classrooms/${values.classroomId}/schedule`,
      ],
    });
    return { status: "success", message: "Classroom announcement saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
