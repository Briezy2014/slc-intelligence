import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { ModuleLinkGrid } from "@/components/navigation/module-link-grid";
import {
  ServicesWorkspace,
  type ServicesView,
} from "@/components/domain/services-workspace";
import { listServices } from "@/lib/data/services";

export const metadata: Metadata = { title: "Student services" };

function viewFromSlug(slug: string[]): ServicesView {
  if (slug[0] === "logs") return "logs";
  if (slug[0] === "reviews") return "reviews";
  if (slug[0] === "assign") return "assign";
  return "dashboard";
}

export default async function StudentServicesPage({
  params,
}: {
  params: Promise<{ studentId: string; slug?: string[] }>;
}) {
  const { studentId, slug = [] } = await params;
  const view = viewFromSlug(slug);
  const state = await listServices({
    studentId,
    servicePlanId:
      slug[0] && !["logs", "reviews", "exports", "assign"].includes(slug[0]) ? slug[0] : undefined,
  });
  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: "Services" },
        ]}
      />
      <PageHeader
        title="Student services"
        description="This student’s related services (OT, PT, Speech, APE…), providers, goals, and session notes."
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
                href: `/students/${studentId}/services`,
                label: "Overview",
                description: "Services and providers for this student.",
              },
              {
                href: `/students/${studentId}/services/assign`,
                label: "Assign service",
                description: "Add OT/PT/Speech/APE and provider goals.",
              },
              {
                href: `/students/${studentId}/services/logs`,
                label: "Log session",
                description: "Record delivery and session notes.",
              },
              {
                href: `/students/${studentId}/services/reviews`,
                label: "Reviews",
                description: "Review progress and next steps.",
              },
            ]}
          />
          <ServicesWorkspace data={state.data} studentId={studentId} view={view} />
        </div>
      )}
    </main>
  );
}
