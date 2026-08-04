import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import {
  ExecutiveFunctionWorkspace,
  type ExecutiveFunctionView,
} from "@/components/domain/application-modules";
import { ModuleLinkGrid } from "@/components/navigation/module-link-grid";
import { listExecutiveFunction } from "@/lib/data/executive-function";

export const metadata: Metadata = { title: "Student executive function" };

function viewFromSlug(slug: string[]): ExecutiveFunctionView {
  if (slug[0] === "checklists") return "checklists";
  if (slug[0] === "schedules") return "schedules";
  if (slug[0] === "observations" || slug[0] === "tasks") return "observations";
  return "dashboard";
}

export default async function StudentExecutiveFunctionPage({
  params,
}: {
  params: Promise<{ studentId: string; slug?: string[] }>;
}) {
  const { studentId, slug = [] } = await params;
  const view = viewFromSlug(slug);
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
        description="This student’s EF plans, observations, and checklists."
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
                description: "EF support plans for this student.",
              },
              {
                href: `/students/${studentId}/executive-function/observations`,
                label: "Observations",
                description: "Log prompt level / independence.",
              },
              {
                href: `/students/${studentId}/executive-function/checklists`,
                label: "Checklists",
                description: "Checklist responses.",
              },
              {
                href: `/students/${studentId}/executive-function/schedules`,
                label: "Schedules",
                description: "Optional schedule blocks.",
              },
            ]}
          />
          <ExecutiveFunctionWorkspace data={state.data} studentId={studentId} view={view} />
        </div>
      )}
    </main>
  );
}
