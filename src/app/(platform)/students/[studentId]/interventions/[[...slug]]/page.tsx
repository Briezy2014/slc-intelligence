import type { Metadata } from "next";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { ModuleLinkGrid } from "@/components/navigation/module-link-grid";
import {
  InterventionDashboard,
  InterventionEvidenceForms,
  InterventionPlanForm,
} from "@/components/domain/phase-modules";
import { listInterventions } from "@/lib/data/interventions";

export const metadata: Metadata = { title: "Student interventions" };

export default async function StudentInterventionsPage({
  params,
}: {
  params: Promise<{ studentId: string; slug?: string[] }>;
}) {
  const { studentId, slug = [] } = await params;
  const planId =
    slug[0] && !["fidelity", "dosage", "analytics", "reviews"].includes(slug[0])
      ? slug[0]
      : undefined;
  const state = await listInterventions({ studentId, planId });
  const section = slug[0] ?? "overview";

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: "Interventions" },
        ]}
      />
      <PageHeader
        title="Student interventions"
        description="Answer two dropdowns to start a plan, then log fidelity or dosage when you use it."
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
                href: `/students/${studentId}/interventions`,
                label: "Plans",
                description: "Start or review intervention plans.",
              },
              {
                href: `/students/${studentId}/interventions/fidelity`,
                label: "Fidelity",
                description: "Log whether the plan was followed.",
              },
              {
                href: `/students/${studentId}/interventions/dosage`,
                label: "Dosage",
                description: "Record sessions / minutes delivered.",
              },
              {
                href: `/students/${studentId}/interventions/reviews`,
                label: "Reviews",
                description: "Team review outcomes and next dates.",
              },
            ]}
          />
          {section === "overview" ? (
            <Card>
              <CardTitle>Start / update a plan</CardTitle>
              <CardDescription>
                1) Confirm student. 2) Pick a library intervention. Save as draft, then activate
                when ready.
              </CardDescription>
              <div className="mt-4">
                <InterventionPlanForm data={state.data} studentId={studentId} />
              </div>
            </Card>
          ) : null}
          {["fidelity", "dosage", "reviews"].includes(section) || planId ? (
            <>
              <Alert title="Log against an existing plan" tone="info">
                Use the forms below after a plan exists. If nothing appears, go back to Plans and
                save one first.
              </Alert>
              <InterventionEvidenceForms data={state.data} planId={planId} />
            </>
          ) : null}
          <InterventionDashboard
            data={state.data}
            focus={section === "overview" ? "plans" : "all"}
          />
        </div>
      )}
    </main>
  );
}
