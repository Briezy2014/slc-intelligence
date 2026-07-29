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
import { canEditStudent } from "@/lib/permissions/check";
import {
  studentClassroomAssignmentSchema,
  studentEnrollmentSchema,
  studentProgramAssignmentSchema,
  studentSchema,
  studentStaffAssignmentSchema,
} from "@/lib/validation/student";

const studentMutationSchema = studentSchema.extend({
  studentId: z.string().uuid().optional(),
});

export async function saveStudentAction(formData: FormData): Promise<ActionState> {
  const parsed = studentMutationSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);

  const values = parsed.data;
  const context = await getActionContext(
    values.organizationId,
    values.studentId ? undefined : "student.create",
  );
  if (!("supabase" in context)) return context;

  try {
    if (values.studentId) {
      const allowed = await canEditStudent(context.supabase, context.organizationId, values.studentId);
      if (!allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }

    const payload = {
      organization_id: context.organizationId,
      first_name: values.firstName,
      last_name: values.lastName,
      preferred_name: values.preferredName ?? null,
      local_identifier: values.localIdentifier,
      grade_level: values.gradeLevel ?? null,
      enrollment_status: values.enrollmentStatus,
      start_date: values.startDate ?? null,
      end_date: values.endDate ?? null,
      created_by: values.studentId ? undefined : context.user.id,
      updated_by: context.user.id,
    };
    const result = values.studentId
      ? await context.supabase
          .from("students")
          .update({ ...payload, created_by: undefined })
          .eq("organization_id", context.organizationId)
          .eq("id", values.studentId)
          .select("id")
          .single()
      : await context.supabase.from("students").insert(payload).select("id").single();

    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.studentId ? "student.update" : "student.create",
      resourceType: "student",
      resourceId: result.data.id,
      newState: {
        enrollment_status: payload.enrollment_status,
        grade_level: payload.grade_level,
      },
      paths: ["/students", `/students/${result.data.id}`, `/students/${result.data.id}/overview`],
    });

    return { status: "success", message: "Student saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function updateStudentArchiveStatusAction(formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({
      organizationId: z.string().uuid(),
      studentId: z.string().uuid(),
      intent: z.enum(["archive", "restore"]),
      note: z.string().trim().max(500).optional(),
    })
    .safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);

  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "student.archive");
  if (!("supabase" in context)) return context;

  try {
    const nextStatus = values.intent === "archive" ? "archived" : "active";
    const { data: previous } = await context.supabase
      .from("students")
      .select("enrollment_status")
      .eq("organization_id", context.organizationId)
      .eq("id", values.studentId)
      .maybeSingle();
    const { error } = await context.supabase
      .from("students")
      .update({
        enrollment_status: nextStatus,
        archived_at: values.intent === "archive" ? new Date().toISOString() : null,
        updated_by: context.user.id,
      })
      .eq("organization_id", context.organizationId)
      .eq("id", values.studentId);

    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await context.supabase.from("student_status_history").insert({
      organization_id: context.organizationId,
      student_id: values.studentId,
      previous_status: previous?.enrollment_status ?? null,
      new_status: nextStatus,
      changed_by: context.user.id,
      note: values.note ?? null,
    });

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: `student.${values.intent}`,
      resourceType: "student",
      resourceId: values.studentId,
      newState: { enrollment_status: nextStatus },
      paths: ["/students", `/students/${values.studentId}`, `/students/${values.studentId}/overview`],
    });

    return { status: "success", message: values.intent === "archive" ? "Student archived." : "Student restored." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveStudentEnrollmentAction(formData: FormData): Promise<ActionState> {
  const parsed = studentEnrollmentSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  const allowed = await canEditStudent(context.supabase, context.organizationId, values.studentId);
  if (!allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };

  const { data, error } = await context.supabase
    .from("student_enrollments")
    .insert({
      organization_id: context.organizationId,
      student_id: values.studentId,
      school_id: values.schoolId,
      status: values.status,
      start_date: values.startDate,
      end_date: values.endDate ?? null,
    })
    .select("id")
    .single();
  if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
  await auditAndRevalidate({
    organizationId: context.organizationId,
    actorUserId: context.user.id,
    actionType: "student_enrollment.create",
    resourceType: "student_enrollment",
    resourceId: data.id,
    paths: [`/students/${values.studentId}`, `/students/${values.studentId}/overview`],
  });
  return { status: "success", message: "Enrollment saved." };
}

export async function saveStudentProgramAssignmentAction(formData: FormData): Promise<ActionState> {
  const parsed = studentProgramAssignmentSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  const allowed = await canEditStudent(context.supabase, context.organizationId, values.studentId);
  if (!allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };

  const { data, error } = await context.supabase
    .from("student_program_assignments")
    .insert({
      organization_id: context.organizationId,
      student_id: values.studentId,
      program_id: values.programId,
      status: values.status,
      start_date: values.startDate,
      end_date: values.endDate ?? null,
    })
    .select("id")
    .single();
  if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
  await auditAndRevalidate({
    organizationId: context.organizationId,
    actorUserId: context.user.id,
    actionType: "student_program_assignment.create",
    resourceType: "student_program_assignment",
    resourceId: data.id,
    paths: [`/students/${values.studentId}`, `/students/${values.studentId}/overview`],
  });
  return { status: "success", message: "Program assignment saved." };
}

export async function saveStudentClassroomAssignmentAction(formData: FormData): Promise<ActionState> {
  const parsed = studentClassroomAssignmentSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  const allowed = await canEditStudent(context.supabase, context.organizationId, values.studentId);
  if (!allowed) return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };

  const { data, error } = await context.supabase
    .from("student_classroom_assignments")
    .insert({
      organization_id: context.organizationId,
      student_id: values.studentId,
      classroom_id: values.classroomId,
      status: values.status,
      start_date: values.startDate,
      end_date: values.endDate ?? null,
    })
    .select("id")
    .single();
  if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
  await auditAndRevalidate({
    organizationId: context.organizationId,
    actorUserId: context.user.id,
    actionType: "student_classroom_assignment.create",
    resourceType: "student_classroom_assignment",
    resourceId: data.id,
    paths: [`/students/${values.studentId}`, `/students/${values.studentId}/overview`],
  });
  return { status: "success", message: "Classroom assignment saved." };
}

export async function saveStudentStaffAssignmentAction(formData: FormData): Promise<ActionState> {
  const parsed = studentStaffAssignmentSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "staff.assign");
  if (!("supabase" in context)) return context;

  const { data, error } = await context.supabase
    .from("student_staff_assignments")
    .insert({
      organization_id: context.organizationId,
      student_id: values.studentId,
      user_id: values.userId,
      assignment_role: values.assignmentRole,
      status: values.status,
      start_date: values.startDate,
      end_date: values.endDate ?? null,
    })
    .select("id")
    .single();
  if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
  await auditAndRevalidate({
    organizationId: context.organizationId,
    actorUserId: context.user.id,
    actionType: "student_staff_assignment.create",
    resourceType: "student_staff_assignment",
    resourceId: data.id,
    paths: [`/students/${values.studentId}`, `/students/${values.studentId}/overview`],
  });
  return { status: "success", message: "Staff assignment saved." };
}
