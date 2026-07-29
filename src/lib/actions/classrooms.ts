"use server";

import { z } from "zod";
import {
  auditAndRevalidate,
  emptyToUndefined,
  formDataToObject,
  GENERIC_ACTION_MESSAGE,
  getActionContext,
  type ActionState,
  validationError,
} from "@/lib/actions/shared";
import { classroomSchema } from "@/lib/validation/organization";

const classroomMutationSchema = classroomSchema.extend({
  classroomId: z.string().uuid().optional(),
});

export async function saveClassroomAction(formData: FormData): Promise<ActionState> {
  const parsed = classroomMutationSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);

  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "classroom.manage");
  if (!("supabase" in context)) return context;

  try {
    const payload = {
      organization_id: context.organizationId,
      school_id: values.schoolId,
      program_id: values.programId || null,
      name: values.name,
      description: values.description ?? null,
      academic_year: values.academicYear ?? null,
      status: values.status,
    };
    const result = values.classroomId
      ? await context.supabase
          .from("classrooms")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.classroomId)
          .select("id")
          .single()
      : await context.supabase.from("classrooms").insert(payload).select("id").single();

    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.classroomId ? "classroom.update" : "classroom.create",
      resourceType: "classroom",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/classrooms", `/classrooms/${result.data.id}`],
    });

    return { status: "success", message: "Classroom saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
