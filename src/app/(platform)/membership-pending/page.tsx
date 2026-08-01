import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { ConfigurationState } from "@/components/domain/page-states";
import { RestoreOwnerMembershipButton } from "@/components/domain/restore-owner-membership-button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireUser } from "@/lib/auth/session";
import { listMembershipsForUser } from "@/lib/org/context";
import { ROLE_LABELS } from "@/lib/permissions/matrix";

export const metadata: Metadata = {
  title: "Membership pending",
};

export default async function MembershipPendingPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!isServerSupabaseConfigured()) {
    return (
      <main id="main-content">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Membership pending" }]} />
        <PageHeader title="Membership pending" />
        <ConfigurationState />
      </main>
    );
  }

  const user = await requireUser("/membership-pending");
  const memberships = await listMembershipsForUser(user.id);
  const today = new Date().toISOString().slice(0, 10);
  const activeMemberships = memberships.filter(
    (membership) =>
      membership.status === "active" &&
      membership.organization?.status === "active" &&
      (!membership.end_date || membership.end_date >= today),
  );

  // Owners / active members should never stay on this page.
  if (activeMemberships.length === 1) {
    redirect("/command-center");
  }
  if (activeMemberships.length > 1) {
    redirect("/select-organization");
  }

  const params = await searchParams;
  const requested =
    (Array.isArray(params?.requested) ? params?.requested[0] : params?.requested) === "1";
  const hasAdminMembership = memberships.some(
    (membership) => membership.role_code === "organization_admin",
  );
  const stuckAdmin = memberships.some(
    (membership) => membership.role_code === "organization_admin" && membership.status !== "active",
  );

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Membership pending" }]} />
      <PageHeader
        title={hasAdminMembership ? "Owner access needs repair" : "Membership pending"}
        description={
          hasAdminMembership
            ? "You are signed in, but this account does not currently have an active organization membership. Owner / organization admin accounts should not wait for approval."
            : "Your account is authenticated, but no active organization membership is available yet."
        }
      />

      {requested ? (
        <div className="mb-6">
          <Alert title="Access request submitted" tone="success">
            An organization administrator has been notified in their Access requests queue. You will
            be able to use the platform after they approve your request.
          </Alert>
        </div>
      ) : null}

      {hasAdminMembership || memberships.length === 0 ? (
        <div className="mb-6 space-y-4">
          <Alert title="This is not an approval wait for the owner" tone="warning">
            The “Waiting for organization approval” screen is meant for staff who requested access.
            If this is the founding owner account, restore admin access below (after the SQL
            migration is applied in Supabase).
          </Alert>
          <Card>
            <CardTitle>Restore owner / admin access</CardTitle>
            <CardDescription>
              Reactivates your organization_admin membership, or claims the sole organization when
              it has no active admin (common after an auth user recreate).
            </CardDescription>
            <div className="mt-4">
              <RestoreOwnerMembershipButton />
            </div>
          </Card>
        </div>
      ) : null}

      {memberships.length > 0 ? (
        <Card className="mb-6">
          <CardTitle>Memberships on this account</CardTitle>
          <CardDescription>
            If status is not active, Command Center will keep sending you here until it is repaired.
          </CardDescription>
          <ul className="mt-4 space-y-3">
            {memberships.map((membership) => (
              <li
                key={membership.id}
                className="border-border rounded-[var(--radius-md)] border p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {membership.organization?.name ?? "Organization (name unavailable)"}
                    </p>
                    <p className="text-muted">{ROLE_LABELS[membership.role_code]}</p>
                  </div>
                  <Badge tone={membership.status === "active" ? "success" : "warning"}>
                    {membership.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
          {stuckAdmin ? (
            <p className="text-muted mt-3 text-sm">
              Your organization admin membership exists but is not active — use Restore above.
            </p>
          ) : null}
        </Card>
      ) : (
        <EmptyState
          title="Waiting for organization approval"
          description="If you just requested staff access, keep this page or sign back in later. Once approved, open Command Center. If you are the owner, use Restore owner / admin access above."
        />
      )}

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link href="/account" className="text-accent font-semibold hover:underline">
          View account
        </Link>
        <Link href="/request-access" className="text-accent font-semibold hover:underline">
          Submit or review request access form
        </Link>
        <Link href="/command-center" className="text-accent font-semibold hover:underline">
          Try Command Center
        </Link>
      </div>
    </main>
  );
}
