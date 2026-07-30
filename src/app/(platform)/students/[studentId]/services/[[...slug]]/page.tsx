import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { ModuleLinkGrid, ServicesWorkspace } from "@/components/domain/application-modules";
import { listServices } from "@/lib/data/services";

export const metadata: Metadata = { title: "Student services" };

export default async function StudentServicesPage({
  params,
}: {
  params: Promise<{ studentId: string; slug?: string[] }>;
}) {
  const { studentId, slug = [] } = await params;
  const state = await listServices({
    studentId,
    servicePlanId:
      slug[0] && !["logs", "reviews", "exports"].includes(slug[0]) ? slug[0] : undefined,
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
        description="Student-scoped service plans, delivery logs, and reviews."
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
                label: "Plans",
                description: "Review and create service plans.",
              },
              {
                href: `/students/${studentId}/services/logs`,
                label: "Logs",
                description: "Record service delivery.",
              },
              {
                href: `/students/${studentId}/services/reviews`,
                label: "Reviews",
                description: "Review implementation descriptively.",
              },
            ]}
          />
          <ServicesWorkspace data={state.data} studentId={studentId} />
        </div>
      )}
    </main>
  );
}
