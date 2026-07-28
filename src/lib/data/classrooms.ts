import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  normalizeMaybeSingle,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type { Classroom, Program, School } from "@/lib/supabase/types";

export type ClassroomsData = {
  organizationId: string | null;
  organizationName: string | null;
  rows: Classroom[];
  schools: School[];
  programs: Program[];
  canManage: boolean;
};

const emptyClassrooms: ClassroomsData = {
  organizationId: null,
  organizationName: null,
  rows: [],
  schools: [],
  programs: [],
  canManage: false,
};

export async function listClassrooms(): Promise<DataState<ClassroomsData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyClassrooms);

  try {
    const [permissions, classroomsResult, schoolsResult, programsResult] = await Promise.all([
      getPermissionFlags(context, ["classroom.manage"]),
      context.supabase
        .from("classrooms")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("name"),
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
    ]);

    if (classroomsResult.error || schoolsResult.error || programsResult.error) {
      return safeDataError(emptyClassrooms);
    }

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        rows: classroomsResult.data ?? [],
        schools: schoolsResult.data ?? [],
        programs: programsResult.data ?? [],
        canManage: permissions["classroom.manage"],
      },
    };
  } catch {
    return safeDataError(emptyClassrooms);
  }
}

export type ClassroomDetailData = ClassroomsData & {
  classroom: Classroom | null;
};

export async function getClassroom(classroomId: string): Promise<DataState<ClassroomDetailData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState({ ...emptyClassrooms, classroom: null });

  try {
    const [permissions, classroomResult, schoolsResult, programsResult] = await Promise.all([
      getPermissionFlags(context, ["classroom.manage"]),
      context.supabase
        .from("classrooms")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("id", classroomId)
        .maybeSingle(),
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
    ]);

    if (classroomResult.error || schoolsResult.error || programsResult.error) {
      return safeDataError({ ...emptyClassrooms, classroom: null });
    }

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        rows: classroomResult.data ? [classroomResult.data] : [],
        schools: schoolsResult.data ?? [],
        programs: programsResult.data ?? [],
        classroom: normalizeMaybeSingle(classroomResult.data),
        canManage: permissions["classroom.manage"],
      },
    };
  } catch {
    return safeDataError({ ...emptyClassrooms, classroom: null });
  }
}
