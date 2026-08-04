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
import { InterventionTriedExport } from "@/components/domain/intervention-tried-export";
import { listInterventions } from "@/lib/data/interventions";

export const metadata: Metadata = { title: "Student interventions" };

export default async function StudentInterventionsPage({
  params,
}: {
  params: Promise<{ studentId: string; slug?: string[] }>;
}) {
  const { studentId, slug = [] } = await params;
  const planId =
    slug[0] && !["fidelity", "dosage", "analytics", "reviews", "tried", "export"].includes(slug[0])
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
        description="What we tried for this student — start a strategy, log when you used it, and export the saved record."
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
                description: "Start or review what we’re trying.",
              },
              {
                href: `/students/${studentId}/interventions/dosage`,
                label: "Log use",
                description: "Sessions / minutes when you tried it.",
              },
              {
                href: `/students/${studentId}/interventions/fidelity`,
                label: "Fidelity",
                description: "Did we follow the plan as written?",
              },
              {
                href: `/students/${studentId}/interventions/reviews`,
                label: "Reviews",
                description: "Team outcome and next steps.",
              },
              {
                href: `/students/${studentId}/interventions/tried`,
                label: "What we tried / export",
                description: "Full saved trail — CSV, PDF, email.",
              },
            ]}
          />
          {section === "overview" ? (
            <Card>
              <CardTitle>Start what we’re trying</CardTitle>
              <CardDescription>
                1) Confirm student. 2) Pick the intervention. Save so dosage and reviews attach to
                it.
              </CardDescription>
              <div className="mt-4">
                <InterventionPlanForm data={state.data} studentId={studentId} />
              </div>
            </Card>
          ) : null}
          {section === "tried" || section === "export" ? (
            <InterventionTriedExport data={state.data} studentId={studentId} />
          ) : null}
          {["fidelity", "dosage", "reviews"].includes(section) || planId ? (
            <>
              <Alert title="Log against a saved plan" tone="info">
                These forms save to the student’s intervention record. Export everything from What
                we tried.
              </Alert>
              <InterventionEvidenceForms
                data={state.data}
                planId={planId}
                focus={
                  section === "fidelity" || section === "dosage" || section === "reviews"
                    ? section
                    : "all"
                }
              />
            </>
          ) : null}
          {section !== "tried" && section !== "export" ? (
            <InterventionDashboard
              data={state.data}
              focus={section === "overview" ? "plans" : "all"}
            />
          ) : null}
        </div>
      )}
    </main>
  );
}
