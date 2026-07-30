import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { ConfigurationState } from "@/components/domain/page-states";
import { Alert } from "@/components/ui/alert";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireUser } from "@/lib/auth/session";

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

  await requireUser("/membership-pending");
  const params = await searchParams;
  const requested =
    (Array.isArray(params?.requested) ? params?.requested[0] : params?.requested) === "1";

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Membership pending" }]} />
      <PageHeader
        title="Membership pending"
        description="Your account is authenticated, but no active organization membership is available yet."
      />
      {requested ? (
        <div className="mb-6">
          <Alert title="Access request submitted" tone="success">
            An organization administrator has been notified in their Access requests queue. You will
            be able to use the platform after they approve your request.
          </Alert>
        </div>
      ) : null}
      <EmptyState
        title="Waiting for organization approval"
        description="If you just requested access, keep this page or sign back in later. Once approved, open Command Center."
      />
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
