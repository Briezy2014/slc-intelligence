import type { Metadata } from "next";
import { InvitationForm, MemberForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { TableShell } from "@/components/data-display/table-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { listMembers } from "@/lib/data/members";
import { ROLE_LABELS } from "@/lib/permissions/matrix";

export const metadata: Metadata = { title: "Organization members" };

export default async function OrganizationMembersPage() {
  const state = await listMembers();

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Organization members" }]} />
      <PageHeader title="Organization members" description="Manage organization memberships and roles." />
      {!state.configured ? <ConfigurationState /> : state.error ? <SafeErrorState message={state.error} /> : (
        <div className="space-y-6">
          <TableShell
            caption="Members"
            headers={["Name", "User ID", "Role", "Status"]}
            rows={state.data.rows.map((member) => [
              member.profile?.display_name ?? "Profile unavailable",
              member.user_id,
              ROLE_LABELS[member.role_code],
              member.status,
            ])}
          />
          {state.data.canManage && state.data.organizationId ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardTitle>Update member role</CardTitle>
                <CardDescription>Use only fictional development users in non-production environments.</CardDescription>
                <div className="mt-4"><MemberForm organizationId={state.data.organizationId} /></div>
              </Card>
              <Card>
                <CardTitle>Record invitation</CardTitle>
                <CardDescription>Invitation emails are not sent automatically by this action.</CardDescription>
                <div className="mt-4"><InvitationForm organizationId={state.data.organizationId} /></div>
              </Card>
            </div>
          ) : null}
        </div>
      )}
    </main>
  );
}
