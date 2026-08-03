import type { Metadata } from "next";
import { ProgressEntryForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { listProgress } from "@/lib/data/progress";

export const metadata: Metadata = { title: "Progress entry" };

export default async function ProgressEntryPage() {
  const state = await listProgress();

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Progress entry" }]} />
      <PageHeader
        title="Progress entry"
        description="Record goal progress for a student: pick the student, pick the goal, enter today’s score, save."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error || !state.data.organizationId ? (
        <SafeErrorState message={state.error ?? "Progress entry is unavailable."} />
      ) : state.data.canEnter ? (
        <div className="space-y-6">
          <Alert title="Simple path" tone="info">
            1) Student → 2) Goal → 3) Enter the measurement for today → Save. Create goals under the
            student first if the goal dropdown is empty.
          </Alert>
          <Card>
            <CardTitle>Enter today’s progress</CardTitle>
            <CardDescription>
              Only the fields for the selected measurement type are shown — no unused boxes.
            </CardDescription>
            <div className="mt-4">
              <ProgressEntryForm
                organizationId={state.data.organizationId}
                students={state.data.students}
                goals={state.data.goals}
              />
            </div>
          </Card>
        </div>
      ) : (
        <SafeErrorState message="You are not authorized to enter progress data." />
      )}
    </main>
  );
}
