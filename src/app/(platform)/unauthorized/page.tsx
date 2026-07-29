import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/feedback/empty-state";

export const metadata: Metadata = {
  title: "Unauthorized",
};

export default function UnauthorizedPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Unauthorized" }]} />
      <PageHeader
        title="Unauthorized"
        description="Your current membership does not include permission for this workflow."
      />
      <EmptyState
        title="Access unavailable"
        description="If you believe you should have access, contact an organization administrator to review your role and assignments."
      />
      <p className="mt-6">
        <Link href="/command-center" className="text-accent text-sm font-semibold hover:underline">
          Return to Command Center
        </Link>
      </p>
    </main>
  );
}
