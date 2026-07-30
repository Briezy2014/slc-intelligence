import type { SupabaseClient, User } from "@supabase/supabase-js";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireActiveMembership, type MembershipWithOrganization } from "@/lib/org/context";
import { hasPermission } from "@/lib/permissions/check";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database, PermissionCode } from "@/lib/supabase/types";

export type DataState<T> = {
  configured: boolean;
  data: T;
  error?: string;
};

export type OrgDataContext = {
  supabase: SupabaseClient<Database>;
  user: User;
  membership: MembershipWithOrganization;
  organizationId: string;
  organizationName: string;
};

export const EMPTY_CONFIG_MESSAGE =
  "Supabase is not configured for this environment. Configure Supabase to load protected data.";
export const GENERIC_DATA_ERROR = "We could not load that information. Try again later.";
export const UNAUTHORIZED_MESSAGE = "You are not authorized to complete that request.";

export function emptyDataState<T>(data: T): DataState<T> {
  return { configured: false, data };
}

export function safeDataError<T>(data: T, message = GENERIC_DATA_ERROR): DataState<T> {
  return { configured: true, data, error: message };
}

export async function getOrgDataContext(
  organizationId?: string | null,
): Promise<OrgDataContext | null> {
  if (!isServerSupabaseConfigured()) {
    return null;
  }

  const { user, membership, organization } = await requireActiveMembership(organizationId);
  return {
    supabase: await createServerSupabaseClient(),
    user,
    membership,
    organizationId: membership.organization_id,
    organizationName: organization?.name ?? "Selected organization",
  };
}

export async function getPermissionFlags(
  context: OrgDataContext,
  permissions: PermissionCode[],
): Promise<Record<PermissionCode, boolean>> {
  const entries = await Promise.all(
    permissions.map(async (permission) => [
      permission,
      await hasPermission(context.supabase, context.organizationId, permission),
    ]),
  );

  return Object.fromEntries(entries) as Record<PermissionCode, boolean>;
}

export function normalizeMaybeSingle<T>(data: T | null): T | null {
  return data ?? null;
}
