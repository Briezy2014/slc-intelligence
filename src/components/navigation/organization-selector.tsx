import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/lib/auth/session";
import {
  getSelectedOrganizationId,
  listMembershipsForUser,
  setSelectedOrganizationIdAction,
} from "@/lib/org/context";
import { ROLE_LABELS } from "@/lib/permissions/matrix";
import { isServerSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function OrganizationSelector() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const [memberships, selectedOrganizationId, profile] = await Promise.all([
    listMembershipsForUser(user.id),
    getSelectedOrganizationId(),
    isServerSupabaseConfigured()
      ? (await createClient())
          .from("user_profiles")
          .select("display_name,preferred_name")
          .eq("id", user.id)
          .maybeSingle()
          .then((result) => result.data)
      : Promise.resolve(null),
  ]);
  const activeMemberships = memberships.filter(
    (membership) => membership.status === "active" && membership.organization?.status === "active",
  );

  if (activeMemberships.length === 0) {
    return (
      <div className="border-border bg-surface-subtle rounded-[var(--radius-md)] border px-3 py-2">
        <p className="text-muted text-xs font-semibold tracking-wide uppercase">Organization</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-foreground text-sm font-medium">No active membership</span>
          <Badge tone="warning">Pending</Badge>
        </div>
      </div>
    );
  }

  const selected =
    activeMemberships.find((membership) => membership.organization_id === selectedOrganizationId) ??
    activeMemberships[0];
  const hasName = Boolean(profile?.display_name?.trim() || profile?.preferred_name?.trim());
  const personName =
    profile?.display_name?.trim() || profile?.preferred_name?.trim() || "Add your name";

  return (
    <form action={setSelectedOrganizationIdAction} className="flex items-end gap-2">
      <input type="hidden" name="next" value="/command-center" />
      <div>
        <label
          htmlFor="organizationId"
          className="text-muted block text-xs font-semibold tracking-wide uppercase"
        >
          Organization
        </label>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Select
            id="organizationId"
            name="organizationId"
            defaultValue={selected.organization_id}
            aria-label="Selected organization"
            className="min-w-48"
          >
            {activeMemberships.map((membership) => (
              <option key={membership.organization_id} value={membership.organization_id}>
                {membership.organization?.name ?? "Unnamed organization"}
              </option>
            ))}
          </Select>
          {hasName ? (
            <Badge tone="info">{personName}</Badge>
          ) : (
            <Link
              href="/staff"
              className="text-highlight text-sm font-semibold underline underline-offset-2"
            >
              {personName}
            </Link>
          )}
          <Badge tone="neutral">{ROLE_LABELS[selected.role_code]}</Badge>
        </div>
      </div>
      {activeMemberships.length > 1 ? (
        <Button type="submit" variant="secondary" size="sm">
          Switch
        </Button>
      ) : null}
    </form>
  );
}
