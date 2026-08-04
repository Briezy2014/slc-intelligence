import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ModuleLinkGrid } from "@/components/navigation/module-link-grid";
import {
  InterventionDashboard,
  InterventionLibraryForm,
  InterventionPlanForm,
} from "@/components/domain/phase-modules";
import { InterventionTriedExport } from "@/components/domain/intervention-tried-export";
import { listInterventions } from "@/lib/data/interventions";

export const metadata: Metadata = { title: "Interventions" };

type InterventionsView = "dashboard" | "library" | "new-library" | "tried";

function viewFromSlug(slug: string[]): InterventionsView {
  if (slug[0] === "library" && slug[1] === "new") return "new-library";
  if (slug[0] === "library") return "library";
  if (slug[0] === "tried" || slug[0] === "export") return "tried";
  return "dashboard";
}

export default async function InterventionsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const view = viewFromSlug(slug);
  const state = await listInterventions({
    libraryItemId: slug[0] === "library" && slug[1] && slug[1] !== "new" ? slug[1] : undefined,
  });

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Interventions" }]} />
      <PageHeader
        title="Interventions"
        description="Track what you tried with a student — the strategy, when you used it, and how it went. Everything you log is saved and exportable."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <Alert title="Clear purpose" tone="info">
            Interventions = <strong>what we tried</strong>. 1) Start a plan from the library. 2) Log
            dosage (sessions/minutes) when you use it. 3) Export the saved record for your team.
          </Alert>
          <ModuleLinkGrid
            links={[
              {
                href: "/interventions",
                label: "Start what we’re trying",
                description: "Student + library intervention → save the plan.",
              },
              {
                href: "/interventions/tried",
                label: "What we tried / export",
                description: "Saved logs and plans — CSV, PDF, or email.",
              },
              {
                href: "/interventions/library",
                label: "Library",
                description: `Browse ${state.data.libraryItems.length} ready interventions.`,
              },
              {
                href: "/interventions/library/new",
                label: "Add custom item",
                description: "Only if your practice is not already in the library.",
              },
            ]}
          />

          {view === "dashboard" ? (
            <Card>
              <CardTitle>Start what we’re trying</CardTitle>
              <CardDescription>
                Pick the student and the intervention from the library. Save it so you can log use
                and export later.
              </CardDescription>
              {state.data.students.length === 0 ? (
                <div className="mt-4">
                  <Alert title="Add a student first" tone="warning">
                    Open{" "}
                    <Link href="/students" className="font-semibold underline">
                      Students
                    </Link>{" "}
                    and create one (codes like S1 work), then come back.
                  </Alert>
                </div>
              ) : (
                <div className="mt-4">
                  <InterventionPlanForm data={state.data} />
                </div>
              )}
            </Card>
          ) : null}

          {view === "tried" ? <InterventionTriedExport data={state.data} /> : null}

          {view === "new-library" ? (
            <Card>
              <CardTitle>Add custom library item</CardTitle>
              <CardDescription>
                Use this only for a local practice not already listed. Starter interventions are
                already available under Library.
              </CardDescription>
              <div className="mt-4">
                <InterventionLibraryForm data={state.data} />
              </div>
            </Card>
          ) : null}

          {view === "library" || view === "dashboard" ? (
            <InterventionDashboard
              data={state.data}
              focus={view === "library" ? "library" : "all"}
            />
          ) : null}
        </div>
      )}
    </main>
  );
}
