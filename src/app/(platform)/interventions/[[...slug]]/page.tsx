import type { Metadata } from "next";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import {
  InterventionDashboard,
  InterventionLibraryForm,
  ModuleLinkGrid,
} from "@/components/domain/phase-modules";
import { listInterventions } from "@/lib/data/interventions";

export const metadata: Metadata = { title: "Interventions" };

export default async function InterventionsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const state = await listInterventions({
    libraryItemId: slug[0] === "library" && slug[1] && slug[1] !== "new" ? slug[1] : undefined,
  });
  const isLibraryNew = slug[0] === "library" && slug[1] === "new";

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Interventions" }]} />
      <PageHeader
        title="Intervention Intelligence"
        description="Intervention library, plans, fidelity, dosage, reviews, and observed outcome links."
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
                href: "/interventions/library",
                label: "Library",
                description: "Review intervention library items.",
              },
              {
                href: "/interventions/library/new",
                label: "New library item",
                description: "Create an intervention library item.",
              },
              {
                href: "/interventions",
                label: "Plan dashboard",
                description: "View student intervention plans and implementation evidence.",
              },
            ]}
          />
          {isLibraryNew ? (
            <Card>
              <CardTitle>New intervention library item</CardTitle>
              <CardDescription>
                Describe local practices without implying automated recommendations.
              </CardDescription>
              <div className="mt-4">
                <InterventionLibraryForm data={state.data} />
              </div>
            </Card>
          ) : null}
          <InterventionDashboard data={state.data} />
        </div>
      )}
    </main>
  );
}
