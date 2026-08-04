import type { Metadata } from "next";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { BehaviorDashboard, BehaviorQuickStart } from "@/components/domain/phase-modules";
import { listBehavior } from "@/lib/data/behavior";

export const metadata: Metadata = { title: "Behavior Detective" };

export default async function BehaviorDetectivePage() {
  const state = await listBehavior();
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Behavior Detective" }]} />
      <PageHeader
        title="Behavior Detective"
        description="Quick-count hitting, throwing, eloping, cussing, and more with + / −. Add before/during/after details when needed, then export for your team."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-8">
          <BehaviorQuickStart data={state.data} />
          <BehaviorDashboard data={state.data} />
        </div>
      )}
    </main>
  );
}
