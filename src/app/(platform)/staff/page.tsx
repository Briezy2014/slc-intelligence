import type { Metadata } from "next";
import Link from "next/link";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { CopyInviteCodeButton } from "@/components/domain/copy-invite-code-button";
import { ProfileNameForm } from "@/components/domain/profile-name-form";
import { StaffInviteForm } from "@/components/domain/staff-invite-form";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { TableShell } from "@/components/data-display/table-shell";
import { Alert } from "@/components/ui/alert";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth/session";
import { listAccessRequests } from "@/lib/data/access-requests";
import { listMembers } from "@/lib/data/members";
import { listStaff } from "@/lib/data/staff";
import { ROLE_LABELS } from "@/lib/permissions/matrix";

export const metadata: Metadata = {
  title: "Staff",
};

export default async function StaffPage() {
  const [state, accessState, membersState, user] = await Promise.all([
    listStaff(),
    listAccessRequests(),
    listMembers(),
    getUser(),
  ]);

  const currentMember = user
    ? (state.data.rows.find((member) => member.user_id === user.id) ?? null)
    : null;
  const nameLooksWrong =
    !currentMember?.profile?.display_name ||
    /product owner|organization administrator|platform administrator/i.test(
      currentMember.profile.display_name,
    );

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Staff" }]} />
      <PageHeader
        title="Staff"
        description="Your roster, your display name, and how to add educators with the staff invite code."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          {nameLooksWrong ? (
            <Alert title="Set your staff name" tone="warning">
              Staff should show your real name (for example Kara Williams), not a product/role label.
              Save your name in the card below.
            </Alert>
          ) : null}

          <Card>
            <CardTitle>My display name</CardTitle>
            <CardDescription>
              This is the name shown on the Staff list. Role stays separate (for example Organization
              administrator).
            </CardDescription>
            <div className="mt-4">
              <ProfileNameForm
                initialDisplayName={currentMember?.profile?.display_name ?? "Kara Williams"}
                initialPreferredName={currentMember?.profile?.preferred_name ?? "Kara"}
              />
            </div>
          </Card>

          {state.data.canManageMembers ? (
            <Card>
              <CardTitle>Add staff</CardTitle>
              <CardDescription>
                New educators use Request access with your invite code. You approve them here. You
                can also record an email invitation for your own tracking.
              </CardDescription>
              <div className="mt-4 space-y-4">
                {state.data.organizationSlug ? (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Staff invite code</p>
                    <CopyInviteCodeButton code={state.data.organizationSlug} />
                    <p className="text-muted text-sm">
                      1) Copy the code. 2) Share it with the educator. 3) They open{" "}
                      <Link href="/request-access" className="text-highlight underline">
                        Request access
                      </Link>
                      , create an account, and enter the code. 4) You approve them under Access
                      requests.
                    </p>
                  </div>
                ) : (
                  <Alert title="Invite code unavailable" tone="warning">
                    This organization does not have a slug/invite code yet. Open Organization
                    settings after the org record is complete.
                  </Alert>
                )}

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/organization/access-requests"
                    className="bg-accent text-accent-foreground inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
                  >
                    Review access requests
                    {accessState.data.pendingCount > 0
                      ? ` (${accessState.data.pendingCount} pending)`
                      : ""}
                  </Link>
                  <Link
                    href="/organization/invitations"
                    className="border-border bg-background-elevated inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold"
                  >
                    View invitation history
                  </Link>
                </div>

                {state.data.organizationId ? (
                  <div className="border-border border-t pt-4">
                    <p className="mb-3 text-sm font-semibold">Record an email invitation</p>
                    <StaffInviteForm organizationId={state.data.organizationId} />
                  </div>
                ) : null}

                {membersState.data.invitations.length > 0 ? (
                  <TableShell
                    caption="Recent invitations"
                    headers={["Email", "Role", "Status", "Expires"]}
                    rows={membersState.data.invitations.slice(0, 8).map((invitation) => [
                      invitation.email,
                      ROLE_LABELS[invitation.role_code],
                      invitation.status,
                      new Date(invitation.expires_at).toLocaleDateString(),
                    ])}
                  />
                ) : null}
              </div>
            </Card>
          ) : (
            <Alert title="Staff invites are managed by an organization administrator" tone="info">
              Ask your organization administrator for the staff invite code, then use Request access.
            </Alert>
          )}

          <TableShell
            caption="Staff members"
            headers={["Name", "Role", "Status", "Start date"]}
            emptyMessage="No active staff yet."
            rows={state.data.rows.map((member) => [
              member.profile?.display_name?.trim() || "Name not set — edit My display name above",
              ROLE_LABELS[member.role_code],
              member.status,
              member.start_date,
            ])}
          />

          <div className="text-sm">
            {state.data.rows.map((member) => (
              <Link
                key={member.user_id}
                href={`/staff/${member.user_id}`}
                className="text-accent mr-4 font-semibold hover:underline"
              >
                View {member.profile?.display_name ?? "staff member"}
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
