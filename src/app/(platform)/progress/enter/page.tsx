import type { Metadata } from "next";
import { ProgressEntryForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { listProgress } from "@/lib/data/progress";

export const metadata: Metadata = { title: "Rapid progress entry" };

export default async function ProgressEntryPage() {
  const state = await listProgress();

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Rapid progress entry" }]} />
      <PageHeader title="Rapid progress entry" description="Enter draft or finalized progress-monitoring sessions." />
      {!state.configured ? <ConfigurationState /> : state.error || !state.data.organizationId ? (
        <SafeErrorState message={state.error ?? "Progress entry is unavailable."} />
      ) : state.data.canEnter ? (
        <div className="space-y-6">
          <Card>
            <CardTitle>Progress session</CardTitle>
            <CardDescription>Choose the measurement type and complete the fields relevant to that type.</CardDescription>
            <div className="mt-4"><ProgressEntryForm organizationId={state.data.organizationId} students={state.data.students} goals={state.data.goals} /></div>
          </Card>
        </div>
      ) : <SafeErrorState message="You are not authorized to enter progress data." />}
    </main>
  );
}
