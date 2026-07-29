import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type {
  ClassroomStaffAssignment,
  OrganizationMembership,
  ProgramStaffAssignment,
  SchoolStaffAssignment,
  StudentStaffAssignment,
  UserProfile,
} from "@/lib/supabase/types";

export type StaffRow = OrganizationMembership & {
  profile: UserProfile | null;
};

export type StaffAssignments = {
  schools: SchoolStaffAssignment[];
  programs: ProgramStaffAssignment[];
  classrooms: ClassroomStaffAssignment[];
  students: StudentStaffAssignment[];
};

export type StaffData = {
  organizationId: string | null;
  organizationName: string | null;
  rows: StaffRow[];
  assignments: StaffAssignments;
  canAssign: boolean;
};

const emptyAssignments: StaffAssignments = {
  schools: [],
  programs: [],
  classrooms: [],
  students: [],
};

const emptyStaff: StaffData = {
  organizationId: null,
  organizationName: null,
  rows: [],
  assignments: emptyAssignments,
  canAssign: false,
};

export async function listStaff(): Promise<DataState<StaffData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyStaff);

  try {
    const [permissions, membershipsResult] = await Promise.all([
      getPermissionFlags(context, ["staff.assign"]),
      context.supabase
        .from("organization_memberships")
        .select("*")
        .eq("organization_id", context.organizationId)
        .neq("status", "inactive")
        .order("created_at", { ascending: false }),
    ]);

    if (membershipsResult.error) return safeDataError(emptyStaff);

    const memberships = membershipsResult.data ?? [];
    const { data: profiles, error: profileError } = memberships.length
      ? await context.supabase
          .from("user_profiles")
          .select("*")
          .in(
            "id",
            memberships.map((membership) => membership.user_id),
          )
      : { data: [] as UserProfile[], error: null };

    if (profileError) return safeDataError(emptyStaff);

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        rows: memberships.map((membership) => ({
          ...membership,
          profile: profiles?.find((profile) => profile.id === membership.user_id) ?? null,
        })),
        assignments: emptyAssignments,
        canAssign: permissions["staff.assign"],
      },
    };
  } catch {
    return safeDataError(emptyStaff);
  }
}

export type StaffDetailData = StaffData & {
  staff: StaffRow | null;
};

export async function getStaffMember(staffId: string): Promise<DataState<StaffDetailData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState({ ...emptyStaff, staff: null });

  try {
    const [
      permissions,
      membershipResult,
      profileResult,
      schoolAssignments,
      programAssignments,
      classroomAssignments,
      studentAssignments,
    ] = await Promise.all([
      getPermissionFlags(context, ["staff.assign"]),
      context.supabase
        .from("organization_memberships")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("user_id", staffId)
        .maybeSingle(),
      context.supabase.from("user_profiles").select("*").eq("id", staffId).maybeSingle(),
      context.supabase
        .from("school_staff_assignments")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("user_id", staffId)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("program_staff_assignments")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("user_id", staffId)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("classroom_staff_assignments")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("user_id", staffId)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("student_staff_assignments")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("user_id", staffId)
        .order("created_at", { ascending: false }),
    ]);

    if (
      membershipResult.error ||
      profileResult.error ||
      schoolAssignments.error ||
      programAssignments.error ||
      classroomAssignments.error ||
      studentAssignments.error
    ) {
      return safeDataError({ ...emptyStaff, staff: null });
    }

    const staff = membershipResult.data
      ? { ...membershipResult.data, profile: profileResult.data ?? null }
      : null;

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        rows: staff ? [staff] : [],
        staff,
        assignments: {
          schools: schoolAssignments.data ?? [],
          programs: programAssignments.data ?? [],
          classrooms: classroomAssignments.data ?? [],
          students: studentAssignments.data ?? [],
        },
        canAssign: permissions["staff.assign"],
      },
    };
  } catch {
    return safeDataError({ ...emptyStaff, staff: null });
  }
}
