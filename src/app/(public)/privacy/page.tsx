import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { DevelopmentNotice } from "@/components/feedback/development-notice";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Privacy" }]} />
      <PageHeader
        title="Privacy (development stage)"
        description="This page is a development-stage notice. It is not final legal policy."
      />
      <div className="text-muted space-y-4">
        <p>The application is not yet approved for real student data.</p>
        <p>Development and demonstrations use fictional data only.</p>
        <p>Privacy policies will be finalized before production use.</p>
        <p>
          The platform is being designed around role-based access, tenant isolation, and
          auditability.
        </p>
        <p>
          No compliance certification claim is being made. Preferred language is that SLC
          Intelligence is designed to support privacy-conscious educational workflows.
        </p>
      </div>
      <div className="mt-8">
        <DevelopmentNotice title="Not final legal policy" />
      </div>
    </main>
  );
}
