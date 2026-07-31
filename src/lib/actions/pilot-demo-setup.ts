"use server";

import { z } from "zod";
import {
  auditAndRevalidate,
  GENERIC_ACTION_MESSAGE,
  getActionContext,
  type ActionState,
  UNAUTHORIZED_ACTION_MESSAGE,
  VALIDATION_ACTION_MESSAGE,
} from "@/lib/actions/shared";
import { hasPermission } from "@/lib/permissions/check";

const DEMO_SCHOOL_NAME = "Pilot Demo School";
const DEMO_CLASSROOM_NAME = "Pilot Demo Classroom";
const DEMO_SCHEDULE_NAME = "Sample weekday schedule";
const DEMO_STUDENTS = [
  { code: "S1", grade: "3" },
  { code: "S2", grade: "4" },
] as const;

const SAMPLE_BLOCKS = [
  { label: "Arrival / morning meeting", start: "08:15", end: "08:35", sort: 1, type: "arrival" },
  { label: "Literacy block", start: "08:35", end: "09:35", sort: 2, type: "instruction" },
  {
    label: "Related services / centers",
    start: "09:35",
    end: "10:20",
    sort: 3,
    type: "related_service",
  },
  { label: "Math block", start: "10:20", end: "11:20", sort: 4, type: "instruction" },
  { label: "Lunch", start: "11:20", end: "11:50", sort: 5, type: "lunch" },
  { label: "Recess / movement", start: "11:50", end: "12:15", sort: 6, type: "recess" },
  {
    label: "Social skills / EF practice",
    start: "12:15",
    end: "12:45",
    sort: 7,
    type: "instruction",
  },
  { label: "Dismissal", start: "14:30", end: "14:45", sort: 8, type: "dismissal" },
] as const;

/**
 * Creates a modeling-ready classroom for district demos:
 * school, classroom, coded students S1/S2, sample schedule blocks, and a routine.
 * Safe to run more than once — only fills missing pieces.
 */
export async function ensurePilotDemoSetupAction(formData: FormData): Promise<ActionState> {
  const organizationId = String(formData.get("organizationId") ?? "");
  if (!z.string().uuid().safeParse(organizationId).success) {
    return { status: "error", message: VALIDATION_ACTION_MESSAGE };
  }

  const context = await getActionContext(organizationId, "student.create");
  if (!("supabase" in context)) return context;

  const [canSchool, canClassroom, canSchedule, canRoutine] = await Promise.all([
    hasPermission(context.supabase, context.organizationId, "school.manage"),
    hasPermission(context.supabase, context.organizationId, "classroom.manage"),
    hasPermission(context.supabase, context.organizationId, "classroom.schedule.manage"),
    hasPermission(context.supabase, context.organizationId, "routine.manage"),
  ]);
  if (!canSchool || !canClassroom || !canSchedule) {
    return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
  }

  const today = new Date().toISOString().slice(0, 10);
  const created: string[] = [];

  try {
    let schoolId: string | null = null;
    const schools = await context.supabase
      .from("schools")
      .select("id, name")
      .eq("organization_id", context.organizationId)
      .order("created_at", { ascending: true });
    if (schools.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    const existingSchool =
      schools.data?.find((school) => school.name === DEMO_SCHOOL_NAME) ?? schools.data?.[0];
    if (existingSchool) {
      schoolId = existingSchool.id;
    } else {
      const schoolInsert = await context.supabase
        .from("schools")
        .insert({
          organization_id: context.organizationId,
          name: DEMO_SCHOOL_NAME,
          school_type: "public",
          status: "active",
        })
        .select("id")
        .single();
      if (schoolInsert.error || !schoolInsert.data) {
        return { status: "error", message: GENERIC_ACTION_MESSAGE };
      }
      schoolId = schoolInsert.data.id;
      created.push("school");
    }

    let classroomId: string | null = null;
    const classrooms = await context.supabase
      .from("classrooms")
      .select("id, name")
      .eq("organization_id", context.organizationId)
      .order("created_at", { ascending: true });
    if (classrooms.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    const existingClassroom =
      classrooms.data?.find((classroom) => classroom.name === DEMO_CLASSROOM_NAME) ??
      classrooms.data?.[0];
    if (existingClassroom) {
      classroomId = existingClassroom.id;
    } else {
      const classroomInsert = await context.supabase
        .from("classrooms")
        .insert({
          organization_id: context.organizationId,
          school_id: schoolId,
          name: DEMO_CLASSROOM_NAME,
          description: "Coded demo classroom for district modeling (S1/S2).",
          academic_year: "2025-2026",
          status: "active",
        })
        .select("id")
        .single();
      if (classroomInsert.error || !classroomInsert.data) {
        return { status: "error", message: GENERIC_ACTION_MESSAGE };
      }
      classroomId = classroomInsert.data.id;
      created.push("classroom");
    }

    const existingStudents = await context.supabase
      .from("students")
      .select("id, local_identifier, first_name")
      .eq("organization_id", context.organizationId);
    if (existingStudents.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    const studentIds: string[] = [];
    for (const demo of DEMO_STUDENTS) {
      const found = existingStudents.data?.find(
        (student) =>
          student.local_identifier.toUpperCase() === demo.code ||
          student.first_name.toUpperCase() === demo.code,
      );
      if (found) {
        studentIds.push(found.id);
        continue;
      }

      const cycleEnd = new Date();
      cycleEnd.setFullYear(cycleEnd.getFullYear() + 1);
      const studentInsert = await context.supabase
        .from("students")
        .insert({
          organization_id: context.organizationId,
          first_name: demo.code,
          last_name: "Student",
          preferred_name: demo.code,
          local_identifier: demo.code,
          grade_level: demo.grade,
          enrollment_status: "active",
          start_date: today,
          end_date: null,
          has_iep: true,
          created_by: context.user.id,
          updated_by: context.user.id,
        })
        .select("id")
        .single();
      if (studentInsert.error || !studentInsert.data) {
        return { status: "error", message: GENERIC_ACTION_MESSAGE };
      }
      studentIds.push(studentInsert.data.id);
      created.push(`student ${demo.code}`);

      await context.supabase.from("iep_cycles").insert({
        organization_id: context.organizationId,
        student_id: studentInsert.data.id,
        label: `${demo.code} practice IEP cycle`,
        start_date: today,
        end_date: cycleEnd.toISOString().slice(0, 10),
        review_date: null,
        status: "active",
        created_by: context.user.id,
        updated_by: context.user.id,
      });

      await context.supabase.from("student_enrollments").insert({
        organization_id: context.organizationId,
        student_id: studentInsert.data.id,
        school_id: schoolId,
        status: "active",
        start_date: today,
        end_date: null,
      });

      await context.supabase.from("student_classroom_assignments").insert({
        organization_id: context.organizationId,
        student_id: studentInsert.data.id,
        classroom_id: classroomId,
        status: "active",
        start_date: today,
        end_date: null,
      });
    }

    // Ensure existing demo students are assigned to the classroom when possible.
    for (const studentId of studentIds) {
      const assignment = await context.supabase
        .from("student_classroom_assignments")
        .select("id")
        .eq("organization_id", context.organizationId)
        .eq("student_id", studentId)
        .eq("classroom_id", classroomId)
        .eq("status", "active")
        .maybeSingle();
      if (!assignment.data) {
        await context.supabase.from("student_classroom_assignments").insert({
          organization_id: context.organizationId,
          student_id: studentId,
          classroom_id: classroomId,
          status: "active",
          start_date: today,
          end_date: null,
        });
      }
    }

    let scheduleId: string | null = null;
    const schedules = await context.supabase
      .from("classroom_schedules")
      .select("id, name")
      .eq("organization_id", context.organizationId)
      .eq("classroom_id", classroomId)
      .order("created_at", { ascending: true });
    if (schedules.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    const existingSchedule =
      schedules.data?.find((schedule) => schedule.name === DEMO_SCHEDULE_NAME) ??
      schedules.data?.[0];
    if (existingSchedule) {
      scheduleId = existingSchedule.id;
    } else {
      const scheduleInsert = await context.supabase
        .from("classroom_schedules")
        .insert({
          organization_id: context.organizationId,
          classroom_id: classroomId,
          name: DEMO_SCHEDULE_NAME,
          academic_year: "2025-2026",
          status: "active",
          created_by: context.user.id,
        })
        .select("id")
        .single();
      if (scheduleInsert.error || !scheduleInsert.data) {
        return { status: "error", message: GENERIC_ACTION_MESSAGE };
      }
      scheduleId = scheduleInsert.data.id;
      created.push("schedule");
    }

    const blocks = await context.supabase
      .from("classroom_schedule_blocks")
      .select("id")
      .eq("schedule_id", scheduleId)
      .limit(1);
    if (blocks.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    if (!blocks.data?.length) {
      const blockRows = SAMPLE_BLOCKS.map((block) => ({
        organization_id: context.organizationId,
        schedule_id: scheduleId!,
        classroom_id: classroomId!,
        day_of_week: null as number | null,
        start_time: block.start,
        end_time: block.end,
        label: block.label,
        block_type: block.type,
        location: DEMO_CLASSROOM_NAME,
        sort_order: block.sort,
      }));
      const blockInsert = await context.supabase
        .from("classroom_schedule_blocks")
        .insert(blockRows);
      if (blockInsert.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
      created.push("schedule blocks");
    }

    if (canRoutine) {
      const routines = await context.supabase
        .from("classroom_routines")
        .select("id")
        .eq("organization_id", context.organizationId)
        .eq("classroom_id", classroomId)
        .limit(1);
      if (!routines.error && !routines.data?.length) {
        const routineInsert = await context.supabase
          .from("classroom_routines")
          .insert({
            organization_id: context.organizationId,
            classroom_id: classroomId,
            name: "Arrival routine",
            description:
              "Enter, hang backpack, check visual schedule, choose regulation tool if needed, join morning meeting.",
            status: "active",
            created_by: context.user.id,
          })
          .select("id")
          .single();
        if (!routineInsert.error && routineInsert.data) {
          created.push("routine");
        }
      }
    }

    const announcements = await context.supabase
      .from("classroom_announcements")
      .select("id")
      .eq("organization_id", context.organizationId)
      .eq("classroom_id", classroomId)
      .limit(1);
    if (!announcements.error && !announcements.data?.length) {
      await context.supabase.from("classroom_announcements").insert({
        organization_id: context.organizationId,
        classroom_id: classroomId,
        title: "Demo classroom ready for modeling",
        body: "This is a staff announcement for the pilot demo classroom. Use coded students S1 and S2 only — no real student or family PII.",
        contains_student_pii: false,
        audience: "staff",
        status: "published",
        created_by: context.user.id,
      });
      created.push("announcement");
    }

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "pilot_demo.setup",
      resourceType: "classroom",
      resourceId: classroomId,
      newState: { created },
      paths: [
        "/classroom-operations",
        "/classroom-operations/daily",
        "/classroom-operations/schedules",
        "/classroom-operations/notes",
        "/classroom-operations/routines",
        "/classroom-operations/announcements",
        "/students",
        "/classrooms",
        `/classrooms/${classroomId}/schedule`,
      ],
    });

    if (!created.length) {
      return {
        status: "success",
        message:
          "Demo classroom is already set up with coded students S1/S2, a sample schedule, and supports.",
      };
    }

    return {
      status: "success",
      message: `Demo setup complete: added ${created.join(", ")}. Use coded students S1 and S2 for modeling.`,
    };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
