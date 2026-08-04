import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { ModuleLinkGrid } from "@/components/navigation/module-link-grid";
import { ServicesWorkspace, type ServicesView } from "@/components/domain/services-workspace";
import { listServices } from "@/lib/data/services";

export const metadata: Metadata = { title: "Services" };

function viewFromSlug(slug: string[]): ServicesView {
  if (slug[0] === "definitions") return "definitions";
  if (slug[0] === "logs") return "logs";
  if (slug[0] === "reviews") return "reviews";
  if (slug[0] === "assign") return "assign";
  return "dashboard";
}

export default async function ServicesPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const view = viewFromSlug(slug);
  const state = await listServices({
    servicePlanId:
      slug[0] && !["definitions", "logs", "reviews", "exports", "assign"].includes(slug[0])
        ? slug[0]
        : undefined,
  });
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Services" }]} />
      <PageHeader
        title="Services"
        description="Related services like OT, PT, Speech, and Adapted PE — who gets what, who provides it, goals, notes, and session logs."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <ModuleLinkGrid
            links={[
              {
                href: "/services",
                label: "Overview",
                description: "See assigned related services and providers.",
              },
              {
                href: "/services/assign",
                label: "Assign service",
                description: "Student + OT/PT/Speech/APE + provider + goals.",
              },
              {
                href: "/services/logs",
                label: "Log session",
                description: "Record delivery and session notes.",
              },
              {
                href: "/services/reviews",
                label: "Reviews",
                description: "Capture progress reviews and next steps.",
              },
              {
                href: "/services/definitions",
                label: "Service types",
                description: "Optional — add a custom related-service type.",
              },
            ]}
          />
          <ServicesWorkspace data={state.data} view={view} />
        </div>
      )}
    </main>
  );
}
