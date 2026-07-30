import type { Metadata } from "next";
import { GoalProgressChart } from "@/components/domain/analytics-panels";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { getGoal } from "@/lib/data/goals";
import { listProgress, toObservationPoints } from "@/lib/data/progress";

export const metadata: Metadata = { title: "Goal analytics" };

export default async function GoalAnalyticsPage({
  params,
}: {
  params: Promise<{ goalId: string }>;
}) {
  const { goalId } = await params;
  const [goalState, progressState] = await Promise.all([getGoal(goalId), listProgress({ goalId })]);
  const goal = goalState.data.goal;
  const points =
    progressState.configured && !progressState.error
      ? toObservationPoints(progressState.data.sessions)
      : [];

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/goals", label: "Goals" },
          { label: "Goal analytics" },
        ]}
      />
      <PageHeader
        title="Goal analytics"
        description="Accessible trend and descriptive summaries for the selected goal."
      />
      {!goalState.configured || !progressState.configured ? (
        <ConfigurationState />
      ) : goalState.error || progressState.error ? (
        <SafeErrorState message={goalState.error ?? progressState.error} />
      ) : goal ? (
        <GoalProgressChart
          title={`${goal.goal_area} progress`}
          points={points}
          higherIsBetter={goal.target_direction === "increase"}
        />
      ) : (
        <SafeErrorState message="Goal not found or unavailable to your role." />
      )}
    </main>
  );
}
