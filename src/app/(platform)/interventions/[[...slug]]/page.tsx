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
import { listInterventions } from "@/lib/data/interventions";

export const metadata: Metadata = { title: "Interventions" };

type InterventionsView = "dashboard" | "library" | "new-library";

function viewFromSlug(slug: string[]): InterventionsView {
  if (slug[0] === "library" && slug[1] === "new") return "new-library";
  if (slug[0] === "library") return "library";
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
        description="Pick a library intervention, assign it to a student, then log fidelity when you use it."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <Alert title="Two steps for most days" tone="info">
            1) Open <strong>Start a plan</strong> and answer the two dropdowns. 2) Open the student
            later to log fidelity/dosage. Library items fill in automatically for your organization.
          </Alert>
          <ModuleLinkGrid
            links={[
              {
                href: "/interventions",
                label: "Start a plan",
                description: "Question 1: student. Question 2: library intervention.",
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
              <CardTitle>Start an intervention plan</CardTitle>
              <CardDescription>
                Answer two questions from the dropdowns, then save. You can open the student record
                afterward for fidelity notes.
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
