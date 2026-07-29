import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Account deletion",
  description: "How to request account deletion for SLC Intelligence.",
};

export default function AccountDeletionPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Account deletion" }]} />
      <PageHeader
        title="Account deletion"
        description="Request removal of an SLC Intelligence user account through an authorized process."
      />
      <div className="text-muted space-y-4">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Sign in if you still have access and confirm your organization memberships.</li>
          <li>Contact your organization administrator to deactivate memberships first when appropriate.</li>
          <li>
            Contact the product owner through the support channel and request account deletion. Include only your
            account email and organization name — no student records.
          </li>
          <li>
            After verification, administrators can deactivate memberships and archive assignments. Authentication
            identity removal follows the configured Supabase Auth process.
          </li>
        </ol>
        <p>
          Deactivated memberships are rejected by authorization helpers. Archived assignments do not grant
          continued student access.
        </p>
      </div>
    </main>
  );
}
