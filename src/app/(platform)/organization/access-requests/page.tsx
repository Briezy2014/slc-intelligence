import type { Metadata } from "next";
import Link from "next/link";
import { AccessRequestReviewCards } from "@/components/domain/access-request-review";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { listAccessRequests } from "@/lib/data/access-requests";

export const metadata: Metadata = { title: "Access requests" };

export default async function AccessRequestsPage() {
  const state = await listAccessRequests();

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/organization/settings", label: "Organization" },
          { label: "Access requests" },
        ]}
      />
      <PageHeader
        title="Access requests"
        description="Approve or deny educator account requests. Pending requests are your in-app notification queue."
        actions={
          <Link
            href="/organization/settings"
            className="text-accent text-sm font-semibold hover:underline"
          >
            Organization settings
          </Link>
        }
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : !state.data.canManage ? (
        <SafeErrorState message="You are not authorized to review access requests." />
      ) : (
        <div className="space-y-6">
          {state.data.pendingCount > 0 ? (
            <Alert
              title={`${state.data.pendingCount} pending request${state.data.pendingCount === 1 ? "" : "s"}`}
              tone="warning"
            >
              Review each request below. Approving creates an active organization membership for
              that account.
            </Alert>
          ) : null}
          {state.data.organizationSlug ? (
            <Alert title="Staff invite code" tone="info">
              Share this code with new educators when they request access:{" "}
              <span className="font-semibold">{state.data.organizationSlug}</span>
            </Alert>
          ) : null}
          <AccessRequestReviewCards
            organizationId={state.data.organizationId ?? ""}
            requests={state.data.rows}
          />
        </div>
      )}
    </main>
  );
}
