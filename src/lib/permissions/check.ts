import type { SupabaseClient } from "@supabase/supabase-js";
import { ROLE_PERMISSIONS } from "@/lib/permissions/matrix";
import type { Database, PermissionCode, RoleCode } from "@/lib/supabase/types";

type ServerSupabaseClient = SupabaseClient<Database>;

export async function hasPermission(
  supabase: ServerSupabaseClient,
  organizationId: string,
  permission: PermissionCode,
): Promise<boolean> {
  const rpcResult = await supabase.rpc("has_org_permission", {
    p_org_id: organizationId,
    p_permission: permission,
  });

  if (!rpcResult.error) {
    return Boolean(rpcResult.data);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: membership, error: membershipError } = await supabase
    .from("organization_memberships")
    .select("role_code")
    .eq("organization_id", organizationId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (membershipError || !membership) {
    return false;
  }

  const rolePermissions = ROLE_PERMISSIONS[membership.role_code as RoleCode] ?? [];
  return rolePermissions.includes(permission);
}

export async function canAccessStudent(
  supabase: ServerSupabaseClient,
  organizationId: string,
  studentId: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("can_read_student", {
    p_org_id: organizationId,
    p_student_id: studentId,
  });

  if (!error) {
    return Boolean(data);
  }

  return hasPermission(supabase, organizationId, "student.read");
}

export async function canEditStudent(
  supabase: ServerSupabaseClient,
  organizationId: string,
  studentId: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("can_edit_student", {
    p_org_id: organizationId,
    p_student_id: studentId,
  });

  if (!error) {
    return Boolean(data);
  }

  return hasPermission(supabase, organizationId, "student.edit");
}

export async function canManageGoal(
  supabase: ServerSupabaseClient,
  organizationId: string,
  studentId: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("can_manage_goal", {
    p_org_id: organizationId,
    p_student_id: studentId,
  });

  if (!error) {
    return Boolean(data);
  }

  return hasPermission(supabase, organizationId, "goal.manage");
}

export async function canEnterProgress(
  supabase: ServerSupabaseClient,
  organizationId: string,
  studentId: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("can_enter_progress", {
    p_org_id: organizationId,
    p_student_id: studentId,
  });

  if (!error) {
    return Boolean(data);
  }

  return hasPermission(supabase, organizationId, "progress.enter");
}
