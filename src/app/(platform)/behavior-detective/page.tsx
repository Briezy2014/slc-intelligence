import type { Metadata } from "next";
import { BrainCircuit } from "lucide-react";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { BehaviorDashboard, ModuleLinkGrid } from "@/components/domain/phase-modules";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { listBehavior } from "@/lib/data/behavior";

export const metadata: Metadata = { title: "Behavior Detective" };

export default async function BehaviorDetectivePage() {
  const state = await listBehavior();
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Behavior Detective" }]} />
      <PageHeader
        title="Behavior Detective"
        description="Observable definitions, direct observations, ABC context, analytics readiness, and FBA evidence workspaces."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <Card className="brand-glow">
            <div className="flex items-start gap-3">
              <span className="bg-success-soft text-highlight rounded-[var(--radius-md)] p-2">
                <BrainCircuit className="size-5" aria-hidden="true" />
              </span>
              <div>
                <CardTitle>Behavior Detective workspace</CardTitle>
                <CardDescription>
                  No diagnostic or legal conclusions are generated. Summaries organize
                  educator-reviewed evidence.
                </CardDescription>
              </div>
            </div>
          </Card>
          <ModuleLinkGrid
            links={state.data.students.slice(0, 6).map((student) => ({
              href: `/students/${student.id}/behavior`,
              label: `${student.last_name}, ${student.preferred_name || student.first_name}`,
              description: "Open behavior definitions, observations, analytics, and FBA support.",
            }))}
          />
          <BehaviorDashboard data={state.data} />
        </div>
      )}
    </main>
  );
}
