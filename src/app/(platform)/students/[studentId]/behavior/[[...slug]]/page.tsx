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
        description="Log what you saw. Common classroom behaviors are set up for you."
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
                href: `/students/${studentId}/behavior/observations/new`,
                label: "Log observation",
                description: "Record what happened today.",
              },
              {
                href: `/students/${studentId}/behavior/definitions`,
                label: "Behaviors",
                description: "Review or add the behaviors you track.",
              },
              {
                href: `/students/${studentId}/behavior/observations`,
                label: "History",
                description: "See recent saved observations.",
              },
              {
                href: `/students/${studentId}/behavior/analytics`,
                label: "Summary",
                description: "Simple totals for team review.",
              },
            ]}
          />
          {section === "definitions" ? (
            <Card>
              <CardTitle>Behaviors</CardTitle>
              <CardDescription>Choose a starter, edit if needed, then save.</CardDescription>
              <div className="mt-4">
                <BehaviorDefinitionForm data={state.data} studentId={studentId} />
              </div>
            </Card>
          ) : section === "observations" && slug[1] === "new" ? (
            <Card>
              <CardTitle>Log observation</CardTitle>
              <CardDescription>Pick the behavior, then record what you saw.</CardDescription>
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
