import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy notice for SLC Intelligence.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Privacy" }]} />
      <PageHeader
        title="Privacy"
        description="This notice describes privacy-conscious design practices. It is not a certification claim."
      />
      <div className="text-muted space-y-4">
        <p>
          SLC Intelligence is designed to support privacy-conscious educational workflows using
          role-based access, tenant isolation, and auditability.
        </p>
        <p>
          Protected student, family, behavior, service, meeting, and narrative content must remain
          inside authorized organization scopes. Development, demonstration, and the current
          classroom pilot use coded or fictional data only. See the{" "}
          <a className="text-highlight underline-offset-4 hover:underline" href="/pilot-use">
            pilot use rules
          </a>
          .
        </p>
        <p>
          Aggregate Administrative Intelligence values may be suppressed below a configured
          group-size threshold. That threshold is a product privacy control, not a legal standard.
        </p>
        <p>
          No FERPA, IDEA, Section 504, HIPAA, or WCAG certification claim is made by this page or
          the product.
        </p>
        <p>
          A counsel review package (draft privacy notice, data-processing terms, FERPA coded-ID
          questions, and proposed electronic acknowledgment for family communications) is prepared
          for attorney review. Until counsel approves replacement language, this page remains a
          design notice only—not a final district privacy policy.
        </p>
        <p>
          Family-visible communications can collect an electronic receipt acknowledgment / e-signature
          (typed or drawn). That feature records receipt of a message only and is not IEP/IDEA
          consent. Counsel should still confirm legal effect for district use.
        </p>
        <p>
          For account deletion instructions, see{" "}
          <a className="text-highlight underline-offset-4 hover:underline" href="/account-deletion">
            account deletion
          </a>
          .
        </p>
      </div>
    </main>
  );
}
