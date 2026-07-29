import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireUser, safeRedirectPath } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { Organization, OrganizationMembership } from "@/lib/supabase/types";

export const SELECTED_ORGANIZATION_COOKIE = "slc_org_id";

export type MembershipWithOrganization = OrganizationMembership & {
  organization: Pick<Organization, "id" | "name" | "slug" | "status"> | null;
};

export async function getSelectedOrganizationId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SELECTED_ORGANIZATION_COOKIE)?.value ?? null;
}

export async function listMembershipsForUser(userId: string): Promise<MembershipWithOrganization[]> {
  if (!isServerSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data: memberships, error } = await supabase
    .from("organization_memberships")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error || !memberships?.length) {
    return [];
  }

  const organizationIds = memberships.map((membership) => membership.organization_id);
  const { data: organizations } = await supabase
    .from("organizations")
    .select("id,name,slug,status")
    .in("id", organizationIds);

  return memberships.map((membership) => ({
    ...membership,
    organization:
      organizations?.find((organization) => organization.id === membership.organization_id) ?? null,
  }));
}

export async function requireActiveMembership(organizationId?: string | null) {
  const user = await requireUser("/command-center");
  const memberships = await listMembershipsForUser(user.id);
  const activeMemberships = memberships.filter(
    (membership) =>
      membership.status === "active" &&
      membership.organization?.status === "active" &&
      (!membership.end_date || membership.end_date >= new Date().toISOString().slice(0, 10)),
  );

  if (activeMemberships.length === 0) {
    redirect("/membership-pending");
  }

  const selectedOrganizationId = organizationId ?? (await getSelectedOrganizationId());
  const membership =
    activeMemberships.find((entry) => entry.organization_id === selectedOrganizationId) ??
    (activeMemberships.length === 1 ? activeMemberships[0] : null);

  if (!membership) {
    redirect("/select-organization");
  }

  return {
    user,
    membership,
    memberships: activeMemberships,
    organization: membership.organization,
  };
}

async function setOrganizationCookieForUser(formData: FormData, returnState: boolean) {
  const user = await requireUser("/select-organization");
  const organizationId = String(formData.get("organizationId") ?? "");
  const next = safeRedirectPath(String(formData.get("next") ?? ""), "/command-center");
  const memberships = await listMembershipsForUser(user.id);
  const membership = memberships.find(
    (entry) =>
      entry.organization_id === organizationId &&
      entry.status === "active" &&
      entry.organization?.status === "active",
  );

  if (!membership) {
    if (!returnState) {
      redirect("/select-organization?error=invalid-membership");
    }

    return {
      status: "error" as const,
      message: "Choose an active organization you belong to.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(SELECTED_ORGANIZATION_COOKIE, organizationId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(next);
}

export async function setSelectedOrganizationId(_previousState: unknown, formData: FormData) {
  "use server";

  return setOrganizationCookieForUser(formData, true);
}

export async function setSelectedOrganizationIdAction(formData: FormData): Promise<void> {
  "use server";

  await setOrganizationCookieForUser(formData, false);
}
