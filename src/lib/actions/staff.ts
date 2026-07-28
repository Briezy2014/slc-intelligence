"use server";

import {
  auditAndRevalidate,
  emptyToUndefined,
  formDataToObject,
  GENERIC_ACTION_MESSAGE,
  getActionContext,
  type ActionState,
  validationError,
} from "@/lib/actions/shared";
import { staffAssignmentSchema } from "@/lib/validation/organization";

const assignmentTargetSchema = staffAssignmentSchema.refine(
  (values) => Boolean(values.schoolId || values.programId || values.classroomId),
  { message: "Choose a school, program, or classroom assignment target." },
);

export async function saveStaffAssignmentAction(formData: FormData): Promise<ActionState> {
  const parsed = assignmentTargetSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);

  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "staff.assign");
  if (!("supabase" in context)) return context;

  try {
    const basePayload = {
      organization_id: context.organizationId,
      user_id: values.userId,
      assignment_type: values.roleCode,
      status: values.status,
      start_date: values.startDate ?? new Date().toISOString().slice(0, 10),
      end_date: values.endDate ?? null,
    };

    const result = values.schoolId
      ? await context.supabase
          .from("school_staff_assignments")
          .insert({ ...basePayload, school_id: values.schoolId })
          .select("id")
          .single()
      : values.programId
        ? await context.supabase
            .from("program_staff_assignments")
            .insert({ ...basePayload, program_id: values.programId })
            .select("id")
            .single()
        : await context.supabase
            .from("classroom_staff_assignments")
            .insert({ ...basePayload, classroom_id: values.classroomId as string })
            .select("id")
            .single();

    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "staff_assignment.create",
      resourceType: "staff_assignment",
      resourceId: result.data.id,
      newState: basePayload,
      paths: ["/staff", `/staff/${values.userId}`],
    });

    return { status: "success", message: "Staff assignment saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
