import type { Metadata } from "next";
import Link from "next/link";
import { ConfigurationState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { listAccessRequests } from "@/lib/data/access-requests";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireActiveMembership } from "@/lib/org/context";
import { ROLE_LABELS } from "@/lib/permissions/matrix";

export const metadata: Metadata = { title: "Organization settings" };

export default async function OrganizationSettingsPage() {
  if (!isServerSupabaseConfigured()) {
    return (
      <main id="main-content">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Organization settings" }]} />
        <PageHeader title="Organization settings" description="Selected tenant context." />
        <ConfigurationState />
      </main>
    );
  }

  const { organization, membership } = await requireActiveMembership();
  const accessState = await listAccessRequests();
  const pendingCount = accessState.data.pendingCount;

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Organization settings" }]} />
      <PageHeader title="Organization settings" description="Selected tenant context and your active role." />
      <div className="space-y-6">
        <Card>
          <CardTitle>{organization?.name ?? "Selected organization"}</CardTitle>
          <CardDescription>
            Organization code (slug): <span className="font-semibold">{organization?.slug ?? "not available"}</span>.
            Your role: {ROLE_LABELS[membership.role_code]}.
          </CardDescription>
        </Card>
        {accessState.data.canManage ? (
          <Card>
            <CardTitle>Access requests</CardTitle>
            <CardDescription>
              Educators can create an account at Request access, select role checkboxes, and wait for your approval.
            </CardDescription>
            {pendingCount > 0 ? (
              <div className="mt-3">
                <Alert title={`${pendingCount} pending approval${pendingCount === 1 ? "" : "s"}`} tone="warning">
                  Open the access request queue to approve or deny.
                </Alert>
              </div>
            ) : (
              <p className="text-muted mt-3 text-sm">No pending requests right now.</p>
            )}
            <div className="mt-4">
              <Link
                href="/organization/access-requests"
                className="bg-accent text-accent-foreground inline-flex rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
              >
                Review access requests
              </Link>
            </div>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
