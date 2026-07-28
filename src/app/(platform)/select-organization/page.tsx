import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { DevelopmentNotice } from "@/components/feedback/development-notice";
import { EmptyState } from "@/components/feedback/empty-state";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireUser } from "@/lib/auth/session";
import {
  getSelectedOrganizationId,
  listMembershipsForUser,
  setSelectedOrganizationIdAction,
} from "@/lib/org/context";
import { ROLE_LABELS } from "@/lib/permissions/matrix";

export const metadata: Metadata = {
  title: "Select organization",
};

type SelectOrganizationPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SelectOrganizationPage({ searchParams }: SelectOrganizationPageProps) {
  const params = await searchParams;
  const next = Array.isArray(params?.next) ? params.next[0] : params?.next;

  if (!isServerSupabaseConfigured()) {
    return (
      <main id="main-content">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Select organization" }]} />
        <PageHeader
          title="Select organization"
          description="Supabase configuration is required before memberships can load."
        />
        <DevelopmentNotice title="Configuration needed">
          Add Supabase environment values to select an organization.
        </DevelopmentNotice>
      </main>
    );
  }

  const user = await requireUser("/select-organization");
  const [memberships, selectedOrganizationId] = await Promise.all([
    listMembershipsForUser(user.id),
    getSelectedOrganizationId(),
  ]);
  const activeMemberships = memberships.filter(
    (membership) => membership.status === "active" && membership.organization?.status === "active",
  );

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Select organization" }]} />
      <PageHeader
        title="Select organization"
        description="Choose the organization context for this session. Membership is re-verified server-side for every protected workflow."
      />
      {activeMemberships.length > 0 ? (
        <Card className="max-w-xl">
          <CardTitle>Organization context</CardTitle>
          <CardDescription>Select an active membership to continue.</CardDescription>
          <form action={setSelectedOrganizationIdAction} className="mt-6 space-y-4">
            <input type="hidden" name="next" value={next ?? "/command-center"} />
            <div>
              <label
                htmlFor="organizationId"
                className="text-foreground text-sm font-semibold"
              >
                Organization
              </label>
              <Select
                id="organizationId"
                name="organizationId"
                defaultValue={selectedOrganizationId ?? activeMemberships[0]?.organization_id}
                required
              >
                {activeMemberships.map((membership) => (
                  <option key={membership.organization_id} value={membership.organization_id}>
                    {membership.organization?.name ?? "Unnamed organization"} -{" "}
                    {ROLE_LABELS[membership.role_code]}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit">Continue</Button>
          </form>
        </Card>
      ) : (
        <EmptyState
          title="No active memberships"
          description="Your account exists, but no active organization membership is available yet."
        />
      )}
    </main>
  );
}
