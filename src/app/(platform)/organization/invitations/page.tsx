import type { Metadata } from "next";
import { InvitationForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { TableShell } from "@/components/data-display/table-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { listMembers } from "@/lib/data/members";
import { ROLE_LABELS } from "@/lib/permissions/matrix";

export const metadata: Metadata = { title: "Organization invitations" };

export default async function OrganizationInvitationsPage() {
  const state = await listMembers();

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Organization invitations" }]} />
      <PageHeader title="Organization invitations" description="Pending and historical organization invitations." />
      {!state.configured ? <ConfigurationState /> : state.error ? <SafeErrorState message={state.error} /> : (
        <div className="space-y-6">
          <TableShell
            caption="Invitations"
            headers={["Email", "Role", "Status", "Expires"]}
            rows={state.data.invitations.map((invitation) => [
              invitation.email,
              ROLE_LABELS[invitation.role_code],
              invitation.status,
              new Date(invitation.expires_at).toLocaleString(),
            ])}
          />
          {state.data.canManage && state.data.organizationId ? (
            <Card>
              <CardTitle>Record invitation</CardTitle>
              <CardDescription>No password or service-role secret is stored by this workflow.</CardDescription>
              <div className="mt-4"><InvitationForm organizationId={state.data.organizationId} /></div>
            </Card>
          ) : null}
        </div>
      )}
    </main>
  );
}
