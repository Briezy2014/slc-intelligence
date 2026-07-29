import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use placeholder for SLC Intelligence.",
};

export default function TermsPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Terms" }]} />
      <PageHeader
        title="Terms of use"
        description="This page is a production placeholder and is not final legal counsel."
      />
      <div className="text-muted space-y-4">
        <p>
          SLC Intelligence is an educational workflow platform for Specialized Learning Classrooms. Authorized
          users must follow their organization’s data-handling rules.
        </p>
        <p>
          The platform does not provide legal advice and does not make automated legal, placement, eligibility,
          disciplinary, or diagnostic decisions.
        </p>
        <p>
          Final terms of use should be reviewed by the product owner’s legal counsel before broad customer
          onboarding.
        </p>
      </div>
    </main>
  );
}
