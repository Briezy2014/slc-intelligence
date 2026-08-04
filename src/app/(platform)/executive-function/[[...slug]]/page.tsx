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

export const metadata: Metadata = { title: "Executive function" };

function viewFromSlug(slug: string[]): ExecutiveFunctionView {
  if (slug[0] === "checklists") return "checklists";
  if (slug[0] === "schedules") return "schedules";
  if (slug[0] === "observations" || slug[0] === "tasks") return "observations";
  return "dashboard";
}

export default async function ExecutiveFunctionPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const view = viewFromSlug(slug);
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
        description="Organization, planning, and self-management supports — plans first, then quick observations."
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
                label: "Plans",
                description: "Create EF support plans from skill areas.",
              },
              {
                href: "/executive-function/observations",
                label: "Observations",
                description: "Log prompt level / independence.",
              },
              {
                href: "/executive-function/checklists",
                label: "Checklists",
                description: "Yes / partial / no responses.",
              },
              {
                href: "/executive-function/schedules",
                label: "Schedules",
                description: "Optional schedule blocks.",
              },
            ]}
          />
          <ExecutiveFunctionWorkspace data={state.data} view={view} />
        </div>
      )}
    </main>
  );
}
