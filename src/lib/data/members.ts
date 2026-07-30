import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type {
  OrganizationInvitation,
  OrganizationMembership,
  UserProfile,
} from "@/lib/supabase/types";

export type MemberRow = OrganizationMembership & {
  profile: UserProfile | null;
};

export type InvitationRow = Omit<OrganizationInvitation, "token_hash">;

export type MembersData = {
  organizationId: string | null;
  organizationName: string | null;
  rows: MemberRow[];
  invitations: InvitationRow[];
  canManage: boolean;
};

const emptyMembers: MembersData = {
  organizationId: null,
  organizationName: null,
  rows: [],
  invitations: [],
  canManage: false,
};

export async function listMembers(): Promise<DataState<MembersData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyMembers);

  try {
    const [permissions, membershipsResult, invitationsResult] = await Promise.all([
      getPermissionFlags(context, ["org.members.manage"]),
      context.supabase
        .from("organization_memberships")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("organization_invitations")
        .select(
          "id,organization_id,email,role_code,status,invited_by,expires_at,accepted_by,accepted_at,created_at,updated_at",
        )
        .eq("organization_id", context.organizationId)
        .order("created_at", { ascending: false }),
    ]);

    if (membershipsResult.error || invitationsResult.error) return safeDataError(emptyMembers);

    const memberships = membershipsResult.data ?? [];
    const userIds = memberships.map((membership) => membership.user_id);
    const { data: profiles, error: profileError } = userIds.length
      ? await context.supabase.from("user_profiles").select("*").in("id", userIds)
      : { data: [] as UserProfile[], error: null };

    if (profileError) return safeDataError(emptyMembers);

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        rows: memberships.map((membership) => ({
          ...membership,
          profile: profiles?.find((profile) => profile.id === membership.user_id) ?? null,
        })),
        invitations: (invitationsResult.data ?? []) as InvitationRow[],
        canManage: permissions["org.members.manage"],
      },
    };
  } catch {
    return safeDataError(emptyMembers);
  }
}
