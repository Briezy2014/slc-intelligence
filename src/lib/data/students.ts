import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  normalizeMaybeSingle,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import { canAccessStudent } from "@/lib/permissions/check";
import type {
  Classroom,
  IepGoal,
  Program,
  School,
  Student,
  StudentClassroomAssignment,
  StudentEnrollment,
  StudentProgramAssignment,
  StudentStaffAssignment,
} from "@/lib/supabase/types";

export type StudentListFilters = {
  search?: string;
  status?: "active" | "inactive" | "archived" | "all";
  page?: number;
  pageSize?: number;
};

export type StudentsData = {
  organizationId: string | null;
  organizationName: string | null;
  rows: Student[];
  count: number;
  page: number;
  pageSize: number;
  filters: Required<StudentListFilters>;
  canCreate: boolean;
  canEdit: boolean;
  canArchive: boolean;
};

const defaultFilters: Required<StudentListFilters> = {
  search: "",
  status: "active",
  page: 1,
  pageSize: 25,
};

const emptyStudents: StudentsData = {
  organizationId: null,
  organizationName: null,
  rows: [],
  count: 0,
  page: 1,
  pageSize: 25,
  filters: defaultFilters,
  canCreate: false,
  canEdit: false,
  canArchive: false,
};

export async function listStudents(
  filters: StudentListFilters = {},
): Promise<DataState<StudentsData>> {
  const context = await getOrgDataContext();
  if (!context)
    return emptyDataState({ ...emptyStudents, filters: { ...defaultFilters, ...filters } });

  const normalized: Required<StudentListFilters> = {
    search: filters.search?.trim() ?? "",
    status: filters.status ?? "active",
    page: Math.max(1, filters.page ?? 1),
    pageSize: Math.min(Math.max(1, filters.pageSize ?? 25), 100),
  };

  try {
    const permissions = await getPermissionFlags(context, [
      "student.create",
      "student.edit",
      "student.archive",
    ]);
    let query = context.supabase
      .from("students")
      .select("*", { count: "exact" })
      .eq("organization_id", context.organizationId)
      .order("last_name")
      .order("first_name");

    if (normalized.status !== "all") {
      query = query.eq("enrollment_status", normalized.status);
    }

    if (normalized.search) {
      const term = `%${normalized.search.replaceAll("%", "")}%`;
      query = query.or(
        `first_name.ilike.${term},last_name.ilike.${term},local_identifier.ilike.${term}`,
      );
    }

    const from = (normalized.page - 1) * normalized.pageSize;
    const to = from + normalized.pageSize - 1;
    const { data, error, count } = await query.range(from, to);

    if (error) return safeDataError({ ...emptyStudents, filters: normalized });

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        rows: data ?? [],
        count: count ?? 0,
        page: normalized.page,
        pageSize: normalized.pageSize,
        filters: normalized,
        canCreate: permissions["student.create"],
        canEdit: permissions["student.edit"],
        canArchive: permissions["student.archive"],
      },
    };
  } catch {
    return safeDataError({ ...emptyStudents, filters: normalized });
  }
}

export type StudentDetailData = {
  organizationId: string | null;
  organizationName: string | null;
  student: Student | null;
  enrollments: StudentEnrollment[];
  programAssignments: StudentProgramAssignment[];
  classroomAssignments: StudentClassroomAssignment[];
  staffAssignments: StudentStaffAssignment[];
  schools: School[];
  programs: Program[];
  classrooms: Classroom[];
  goals: IepGoal[];
  canEdit: boolean;
  canArchive: boolean;
};

const emptyStudentDetail: StudentDetailData = {
  organizationId: null,
  organizationName: null,
  student: null,
  enrollments: [],
  programAssignments: [],
  classroomAssignments: [],
  staffAssignments: [],
  schools: [],
  programs: [],
  classrooms: [],
  goals: [],
  canEdit: false,
  canArchive: false,
};

export async function getStudent(studentId: string): Promise<DataState<StudentDetailData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyStudentDetail);

  try {
    const canRead = await canAccessStudent(context.supabase, context.organizationId, studentId);
    if (!canRead)
      return safeDataError(emptyStudentDetail, "You are not authorized to view this student.");

    const [
      permissions,
      studentResult,
      enrollments,
      programAssignments,
      classroomAssignments,
      staffAssignments,
      schools,
      programs,
      classrooms,
      goals,
    ] = await Promise.all([
      getPermissionFlags(context, ["student.edit", "student.archive"]),
      context.supabase
        .from("students")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("id", studentId)
        .maybeSingle(),
      context.supabase
        .from("student_enrollments")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("student_id", studentId)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("student_program_assignments")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("student_id", studentId)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("student_classroom_assignments")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("student_id", studentId)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("student_staff_assignments")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("student_id", studentId)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("schools")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("name"),
      context.supabase
        .from("programs")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("name"),
      context.supabase
        .from("classrooms")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("name"),
      context.supabase
        .from("iep_goals")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("student_id", studentId)
        .order("created_at", { ascending: false }),
    ]);

    if (
      studentResult.error ||
      enrollments.error ||
      programAssignments.error ||
      classroomAssignments.error ||
      staffAssignments.error ||
      schools.error ||
      programs.error ||
      classrooms.error ||
      goals.error
    ) {
      return safeDataError(emptyStudentDetail);
    }

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        student: normalizeMaybeSingle(studentResult.data),
        enrollments: enrollments.data ?? [],
        programAssignments: programAssignments.data ?? [],
        classroomAssignments: classroomAssignments.data ?? [],
        staffAssignments: staffAssignments.data ?? [],
        schools: schools.data ?? [],
        programs: programs.data ?? [],
        classrooms: classrooms.data ?? [],
        goals: goals.data ?? [],
        canEdit: permissions["student.edit"],
        canArchive: permissions["student.archive"],
      },
    };
  } catch {
    return safeDataError(emptyStudentDetail);
  }
}
