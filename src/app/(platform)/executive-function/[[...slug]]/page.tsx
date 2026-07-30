import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import {
  ExecutiveFunctionWorkspace,
  ModuleLinkGrid,
} from "@/components/domain/application-modules";
import { listExecutiveFunction } from "@/lib/data/executive-function";

export const metadata: Metadata = { title: "Executive function" };

export default async function ExecutiveFunctionPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const state = await listExecutiveFunction({
    planId:
      slug[0] && !["checklists", "observations", "schedules", "tasks"].includes(slug[0])
        ? slug[0]
        : undefined,
  });
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Executive Function" }]} />
      <PageHeader
        title="Executive Function"
        description="Plans, supports, checklists, schedules, task analyses, and descriptive observations."
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
                href: "/executive-function",
                label: "Dashboard",
                description: "Review EF supports and observations.",
              },
              {
                href: "/executive-function/checklists",
                label: "Checklists",
                description: "Student checklist responses.",
              },
              {
                href: "/executive-function/schedules",
                label: "Schedules",
                description: "Student schedule blocks and overlaps.",
              },
            ]}
          />
          <ExecutiveFunctionWorkspace data={state.data} />
        </div>
      )}
    </main>
  );
}
