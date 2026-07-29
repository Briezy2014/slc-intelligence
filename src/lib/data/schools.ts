import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  normalizeMaybeSingle,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type { PermissionCode, School } from "@/lib/supabase/types";

export type SchoolsData = {
  organizationId: string | null;
  organizationName: string | null;
  rows: School[];
  canManage: boolean;
};

const emptySchools: SchoolsData = {
  organizationId: null,
  organizationName: null,
  rows: [],
  canManage: false,
};

export async function listSchools(): Promise<DataState<SchoolsData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptySchools);

  try {
    const permissions = await getPermissionFlags(context, ["school.manage"]);
    const { data, error } = await context.supabase
      .from("schools")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("name");

    if (error) return safeDataError(emptySchools);

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        rows: data ?? [],
        canManage: permissions["school.manage"],
      },
    };
  } catch {
    return safeDataError(emptySchools);
  }
}

export type SchoolDetailData = SchoolsData & {
  school: School | null;
};

export async function getSchool(schoolId: string): Promise<DataState<SchoolDetailData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState({ ...emptySchools, school: null });

  try {
    const { data, error } = await context.supabase
      .from("schools")
      .select("*")
      .eq("organization_id", context.organizationId)
      .eq("id", schoolId)
      .maybeSingle();
    const permissions = await getPermissionFlags(context, ["school.manage" as PermissionCode]);

    if (error) return safeDataError({ ...emptySchools, school: null });

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        rows: data ? [data] : [],
        school: normalizeMaybeSingle(data),
        canManage: permissions["school.manage"],
      },
    };
  } catch {
    return safeDataError({ ...emptySchools, school: null });
  }
}
