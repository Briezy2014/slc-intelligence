import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { DevelopmentNotice } from "@/components/feedback/development-notice";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Membership pending",
};

export default async function MembershipPendingPage() {
  if (!isServerSupabaseConfigured()) {
    return (
      <main id="main-content">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Membership pending" }]} />
        <PageHeader title="Membership pending" />
        <DevelopmentNotice title="Configuration needed">
          Supabase configuration is required before memberships can be checked.
        </DevelopmentNotice>
      </main>
    );
  }

  await requireUser("/membership-pending");

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Membership pending" }]} />
      <PageHeader
        title="Membership pending"
        description="Your account is authenticated, but no active organization membership is available."
      />
      <EmptyState
        title="Waiting for organization access"
        description="Ask an organization administrator to activate your membership before using protected student workflows."
      />
      <div className="mt-6">
        <Link href="/account" className="text-accent text-sm font-semibold hover:underline">
          View account
        </Link>
      </div>
    </main>
  );
}
