import type { Metadata } from "next";
import Link from "next/link";
import { GoalForm, ObjectiveForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { TableShell } from "@/components/data-display/table-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getGoal } from "@/lib/data/goals";

export const metadata: Metadata = { title: "Goal detail" };

export default async function GoalDetailPage({ params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;
  const state = await getGoal(goalId);
  const goal = state.data.goal;

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/goals", label: "Goals" }, { label: "Goal detail" }]} />
      <PageHeader
        title={goal?.goal_area ?? "Goal detail"}
        description="Goal statement, objectives, and related progress entry links."
        actions={goal ? (
          <div className="flex gap-2">
            <Link href={`/goals/${goal.id}/data`} className="bg-background-elevated border-border rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold">Data</Link>
            <Link href={`/goals/${goal.id}/analytics`} className="bg-background-elevated border-border rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold">Analytics</Link>
          </div>
        ) : null}
      />
      {!state.configured ? <ConfigurationState /> : state.error ? <SafeErrorState message={state.error} /> : goal && state.data.organizationId ? (
        <div className="space-y-6">
          <Card>
            <CardTitle>{goal.goal_area}</CardTitle>
            <CardDescription>{goal.goal_statement}</CardDescription>
          </Card>
          <TableShell caption="Objectives" headers={["Sequence", "Statement", "Status"]} rows={state.data.objectives.map((objective) => [String(objective.sequence_no), objective.objective_statement, objective.status])} />
          <TableShell caption="Baselines" headers={["Date", "Type", "Value", "Notes"]} rows={state.data.baselines.map((baseline) => [baseline.baseline_date, baseline.measurement_type, baseline.numeric_value === null ? "Not set" : String(baseline.numeric_value), baseline.notes ?? ""])} />
          {state.data.canManageThisGoal ? (
            <>
              <Card><GoalForm organizationId={state.data.organizationId} studentId={goal.student_id} cycles={state.data.cycles} goal={goal} /></Card>
              <Card><ObjectiveForm organizationId={state.data.organizationId} goalId={goal.id} /></Card>
            </>
          ) : null}
        </div>
      ) : <SafeErrorState message="Goal not found or unavailable to your role." />}
    </main>
  );
}
