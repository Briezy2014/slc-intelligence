import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { HubLinkGrid } from "@/components/navigation/hub-link-grid";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Admin" };

export default function AdminHubPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Admin" }]} />
      <PageHeader
        title="Admin & setup"
        description="Staff, schools, classrooms, and organization settings — not daily teaching tools."
      />
      <div className="space-y-6">
        <Alert title="Teachers: you may only need Staff" tone="info">
          Set your display name and invite others under Staff. Other links are for organization
          setup.
        </Alert>
        <HubLinkGrid
          links={[
            {
              href: "/staff",
              label: "Staff",
              description: "Your name, invite code, and team access.",
            },
            {
              href: "/schools",
              label: "Schools",
              description: "School records for this organization.",
            },
            {
              href: "/classrooms",
              label: "Classrooms",
              description: "Classroom scopes and assignments.",
            },
            {
              href: "/programs",
              label: "Programs",
              description: "Program groupings.",
            },
            {
              href: "/organization/settings",
              label: "Organization",
              description: "Org settings and libraries refresh.",
            },
            {
              href: "/billing",
              label: "Billing",
              description: "Subscription and payment.",
            },
            {
              href: "/administrative-intelligence",
              label: "Admin intel",
              description: "Organization readiness summaries.",
            },
          ]}
        />
      </div>
    </main>
  );
}
