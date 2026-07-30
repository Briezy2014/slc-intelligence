import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import {
  ExecutiveFunctionWorkspace,
  ModuleLinkGrid,
} from "@/components/domain/application-modules";
import { listExecutiveFunction } from "@/lib/data/executive-function";

export const metadata: Metadata = { title: "Student executive function" };

export default async function StudentExecutiveFunctionPage({
  params,
}: {
  params: Promise<{ studentId: string; slug?: string[] }>;
}) {
  const { studentId, slug = [] } = await params;
  const state = await listExecutiveFunction({
    studentId,
    planId:
      slug[0] && !["checklists", "observations", "schedules", "tasks"].includes(slug[0])
        ? slug[0]
        : undefined,
  });
  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: "Executive Function" },
        ]}
      />
      <PageHeader
        title="Student executive function"
        description="Student-scoped EF supports, checklists, schedule blocks, and observations."
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
                href: `/students/${studentId}/executive-function`,
                label: "Plans",
                description: "Review EF support plans.",
              },
              {
                href: `/students/${studentId}/executive-function/checklists`,
                label: "Checklists",
                description: "Checklist responses.",
              },
              {
                href: `/students/${studentId}/executive-function/schedules`,
                label: "Schedules",
                description: "Student schedule blocks.",
              },
            ]}
          />
          <ExecutiveFunctionWorkspace data={state.data} studentId={studentId} />
        </div>
      )}
    </main>
  );
}
