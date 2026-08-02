import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { HubLinkGrid } from "@/components/navigation/hub-link-grid";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Supports" };

export default function SupportsHubPage() {
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Supports" }]} />
      <PageHeader
        title="Supports"
        description="One place for student supports. Pick a type, then assign or log what you used."
      />
      <div className="space-y-6">
        <Alert title="Start here" tone="info">
          Most teachers use Accommodations daily. Open one card below — libraries are pre-filled.
        </Alert>
        <HubLinkGrid
          links={[
            {
              href: "/accommodations",
              label: "Accommodations",
              description: "Classroom and testing supports for students.",
            },
            {
              href: "/interventions",
              label: "Interventions",
              description: "Intervention plans and fidelity notes.",
            },
            {
              href: "/services",
              label: "Services",
              description: "Related services and delivery logs.",
            },
            {
              href: "/executive-function",
              label: "Executive function",
              description: "Organization, planning, and self-management supports.",
            },
          ]}
        />
      </div>
    </main>
  );
}
