import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type { OrganizationAccessRequest } from "@/lib/supabase/types";

export type AccessRequestsData = {
  organizationId: string | null;
  organizationName: string | null;
  organizationSlug: string | null;
  rows: OrganizationAccessRequest[];
  pendingCount: number;
  canManage: boolean;
};

const emptyAccessRequests: AccessRequestsData = {
  organizationId: null,
  organizationName: null,
  organizationSlug: null,
  rows: [],
  pendingCount: 0,
  canManage: false,
};

export async function listAccessRequests(): Promise<DataState<AccessRequestsData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyAccessRequests);

  try {
    const permissions = await getPermissionFlags(context, ["org.members.manage"]);
    const [{ data: organization }, requestsResult] = await Promise.all([
      context.supabase
        .from("organizations")
        .select("id,name,slug")
        .eq("id", context.organizationId)
        .maybeSingle(),
      context.supabase
        .from("organization_access_requests")
        .select("*")
        .eq("organization_id", context.organizationId)
        .order("created_at", { ascending: false }),
    ]);

    if (requestsResult.error) return safeDataError(emptyAccessRequests);

    const rows = (requestsResult.data ?? []) as OrganizationAccessRequest[];
    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: organization?.name ?? context.organizationName,
        organizationSlug: organization?.slug ?? null,
        rows,
        pendingCount: rows.filter((row) => row.status === "pending").length,
        canManage: permissions["org.members.manage"],
      },
    };
  } catch {
    return safeDataError(emptyAccessRequests);
  }
}
