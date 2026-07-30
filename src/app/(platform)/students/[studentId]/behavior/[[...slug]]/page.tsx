import type { Metadata } from "next";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import {
  BehaviorDashboard,
  BehaviorDefinitionForm,
  BehaviorObservationForm,
  FbaWorkspaceForm,
  ModuleLinkGrid,
} from "@/components/domain/phase-modules";
import { listBehavior } from "@/lib/data/behavior";

export const metadata: Metadata = { title: "Student behavior" };

export default async function StudentBehaviorPage({
  params,
}: {
  params: Promise<{ studentId: string; slug?: string[] }>;
}) {
  const { studentId, slug = [] } = await params;
  const state = await listBehavior({
    studentId,
    behaviorId: slug[1] && slug[0] === "definitions" ? slug[1] : undefined,
  });
  const section = slug[0] ?? "overview";

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: "Behavior" },
        ]}
      />
      <PageHeader
        title="Student behavior"
        description="Behavior Detective tools for the selected student."
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
                href: `/students/${studentId}/behavior/definitions`,
                label: "Definitions",
                description: "Create and review observable behavior definitions.",
              },
              {
                href: `/students/${studentId}/behavior/observations`,
                label: "Observations",
                description:
                  "Enter ABC, frequency, duration, latency, interval, or intensity data.",
              },
              {
                href: `/students/${studentId}/behavior/observations/new`,
                label: "New observation",
                description: "Record a new draft or finalized behavior observation.",
              },
              {
                href: `/students/${studentId}/behavior/analytics`,
                label: "Analytics",
                description: "View sufficiency, grouping, trend, and context summaries.",
              },
              {
                href: `/students/${studentId}/behavior/fba-support`,
                label: "FBA support",
                description: "Organize evidence and team-authored hypotheses.",
              },
            ]}
          />
          {section === "definitions" ? (
            <Card>
              <CardTitle>Behavior definition</CardTitle>
              <CardDescription>
                Use observable, measurable language and examples/nonexamples.
              </CardDescription>
              <div className="mt-4">
                <BehaviorDefinitionForm data={state.data} studentId={studentId} />
              </div>
            </Card>
          ) : section === "observations" && slug[1] === "new" ? (
            <Card>
              <CardTitle>New behavior observation</CardTitle>
              <CardDescription>
                Draft entries can be finalized by authorized educators.
              </CardDescription>
              <div className="mt-4">
                <BehaviorObservationForm data={state.data} studentId={studentId} />
              </div>
            </Card>
          ) : section === "fba-support" ? (
            <FbaWorkspaceForm data={state.data} studentId={studentId} />
          ) : (
            <BehaviorDashboard data={state.data} studentId={studentId} />
          )}
        </div>
      )}
    </main>
  );
}
