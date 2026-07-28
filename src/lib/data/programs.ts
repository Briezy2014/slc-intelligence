import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  normalizeMaybeSingle,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type { Program, School } from "@/lib/supabase/types";

export type ProgramsData = {
  organizationId: string | null;
  organizationName: string | null;
  rows: Program[];
  schools: School[];
  canManage: boolean;
};

const emptyPrograms: ProgramsData = {
  organizationId: null,
  organizationName: null,
  rows: [],
  schools: [],
  canManage: false,
};

export async function listPrograms(): Promise<DataState<ProgramsData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyPrograms);

  try {
    const [permissions, programsResult, schoolsResult] = await Promise.all([
      getPermissionFlags(context, ["program.manage"]),
      context.supabase
        .from("programs")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("name"),
      context.supabase
        .from("schools")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("name"),
    ]);

    if (programsResult.error || schoolsResult.error) return safeDataError(emptyPrograms);

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        rows: programsResult.data ?? [],
        schools: schoolsResult.data ?? [],
        canManage: permissions["program.manage"],
      },
    };
  } catch {
    return safeDataError(emptyPrograms);
  }
}

export type ProgramDetailData = ProgramsData & {
  program: Program | null;
};

export async function getProgram(programId: string): Promise<DataState<ProgramDetailData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState({ ...emptyPrograms, program: null });

  try {
    const [permissions, programResult, schoolsResult] = await Promise.all([
      getPermissionFlags(context, ["program.manage"]),
      context.supabase
        .from("programs")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("id", programId)
        .maybeSingle(),
      context.supabase
        .from("schools")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("name"),
    ]);

    if (programResult.error || schoolsResult.error) {
      return safeDataError({ ...emptyPrograms, program: null });
    }

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        rows: programResult.data ? [programResult.data] : [],
        schools: schoolsResult.data ?? [],
        program: normalizeMaybeSingle(programResult.data),
        canManage: permissions["program.manage"],
      },
    };
  } catch {
    return safeDataError({ ...emptyPrograms, program: null });
  }
}
