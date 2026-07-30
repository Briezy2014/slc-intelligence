import type { Metadata } from "next";
import { BrainCircuit } from "lucide-react";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { BehaviorDashboard, BehaviorQuickStart } from "@/components/domain/phase-modules";
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
        description="Define observable behaviors, log observations with dropdowns, and review try-next suggestions. Not an automated diagnosis."
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
                  Pick one focus student, load a suggested definition, then log ABC or other
                  observations. Summaries organize educator-reviewed evidence only.
                </CardDescription>
              </div>
            </div>
          </Card>
          <BehaviorQuickStart data={state.data} />
          <BehaviorDashboard data={state.data} />
        </div>
      )}
    </main>
  );
}
