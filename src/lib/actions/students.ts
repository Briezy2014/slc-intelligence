"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  auditAndRevalidate,
  emptyToUndefined,
  formDataToObject,
  GENERIC_ACTION_MESSAGE,
  getActionContext,
  type ActionState,
  UNAUTHORIZED_ACTION_MESSAGE,
  VALIDATION_ACTION_MESSAGE,
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
      const allowed = await canEditStudent(
        context.supabase,
        context.organizationId,
        values.studentId,
      );
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
      date_of_birth: values.dateOfBirth ?? null,
      address_line1: values.addressLine1 ?? null,
      address_line2: values.addressLine2 ?? null,
      city: values.city ?? null,
      state: values.state ?? null,
      postal_code: values.postalCode ?? null,
      has_iep: values.hasIep === "true",
      has_section_504: values.hasSection504 === "true",
      has_gifted: values.hasGifted === "true",
      has_english_learner: values.hasEnglishLearner === "true",
      home_language: values.homeLanguage ?? null,
      support_plan_notes: values.supportPlanNotes ?? null,
      updated_by: context.user.id,
    };
    const result = values.studentId
      ? await context.supabase
          .from("students")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.studentId)
          .select("id, grade_level, updated_at")
          .single()
      : await context.supabase
          .from("students")
          .insert({ ...payload, created_by: context.user.id })
          .select("id, grade_level, updated_at")
          .single();

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

    const gradeLabel = payload.grade_level ? ` · grade ${payload.grade_level}` : "";
    return {
      status: "success",
      message: values.studentId ? `Student saved${gradeLabel}.` : `Student created${gradeLabel}.`,
    };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function createDemoStudentAction(formData: FormData): Promise<ActionState> {
  const organizationId = String(formData.get("organizationId") ?? "");
  if (!z.string().uuid().safeParse(organizationId).success) {
    return { status: "error", message: VALIDATION_ACTION_MESSAGE };
  }

  const context = await getActionContext(organizationId, "student.create");
  if (!("supabase" in context)) return context;

  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const today = new Date().toISOString().slice(0, 10);
  const cycleEnd = new Date();
  cycleEnd.setFullYear(cycleEnd.getFullYear() + 1);

  try {
    const existing = await context.supabase
      .from("students")
      .select("local_identifier")
      .eq("organization_id", context.organizationId);
    const used = new Set(
      (existing.data ?? []).map((student) => student.local_identifier.toUpperCase()),
    );
    let code = "S1";
    for (let index = 1; index <= 99; index += 1) {
      const candidate = `S${index}`;
      if (!used.has(candidate)) {
        code = candidate;
        break;
      }
    }

    const studentResult = await context.supabase
      .from("students")
      .insert({
        organization_id: context.organizationId,
        first_name: code,
        last_name: "Student",
        preferred_name: code,
        local_identifier: code,
        grade_level: "3",
        enrollment_status: "active",
        start_date: today,
        end_date: null,
        has_iep: true,
        created_by: context.user.id,
        updated_by: context.user.id,
      })
      .select("id")
      .single();

    if (studentResult.error || !studentResult.data) {
      return { status: "error", message: GENERIC_ACTION_MESSAGE };
    }

    const studentId = studentResult.data.id;
    await context.supabase.from("iep_cycles").insert({
      organization_id: context.organizationId,
      student_id: studentId,
      label: `${code} practice IEP cycle ${stamp}`,
      start_date: today,
      end_date: cycleEnd.toISOString().slice(0, 10),
      review_date: null,
      status: "active",
      created_by: context.user.id,
      updated_by: context.user.id,
    });

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "student.create_demo",
      resourceType: "student",
      resourceId: studentId,
      newState: { local_identifier: code, grade_level: "3" },
      paths: [
        "/students",
        `/students/${studentId}`,
        `/students/${studentId}/overview`,
        `/students/${studentId}/goals`,
        `/students/${studentId}/behavior`,
        "/goals",
        "/behavior-detective",
        "/education-documents",
        "/classroom-operations",
        "/classroom-operations/daily",
        "/classroom-operations/notes",
      ],
    });

    redirect(`/students/${studentId}/goals`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
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
      paths: [
        "/students",
        `/students/${values.studentId}`,
        `/students/${values.studentId}/overview`,
      ],
    });

    return {
      status: "success",
      message: values.intent === "archive" ? "Student archived." : "Student restored.",
    };
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
  const parsed = studentProgramAssignmentSchema.safeParse(
    emptyToUndefined(formDataToObject(formData)),
  );
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

export async function saveStudentClassroomAssignmentAction(
  formData: FormData,
): Promise<ActionState> {
  const parsed = studentClassroomAssignmentSchema.safeParse(
    emptyToUndefined(formDataToObject(formData)),
  );
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
  const parsed = studentStaffAssignmentSchema.safeParse(
    emptyToUndefined(formDataToObject(formData)),
  );
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
