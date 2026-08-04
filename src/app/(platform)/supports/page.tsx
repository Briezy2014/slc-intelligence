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
          Tap one card. Libraries fill automatically — pick from dropdowns instead of starting
          blank. Most intervention specialists use Accommodations and Interventions daily.
        </Alert>
        <HubLinkGrid
          links={[
            {
              href: "/accommodations",
              label: "Accommodations",
              description: "Assign a support, then log if it was used today.",
            },
            {
              href: "/interventions",
              label: "Interventions",
              description: "What we tried — plan, log use, export the saved record.",
            },
            {
              href: "/services",
              label: "Services",
              description: "OT, PT, Speech, APE — student, provider, goals, and session notes.",
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
