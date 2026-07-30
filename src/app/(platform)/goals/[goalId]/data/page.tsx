import type { Metadata } from "next";
import Link from "next/link";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { TableShell } from "@/components/data-display/table-shell";
import { getGoal } from "@/lib/data/goals";
import { listProgress } from "@/lib/data/progress";

export const metadata: Metadata = { title: "Goal data" };

export default async function GoalDataPage({ params }: { params: Promise<{ goalId: string }> }) {
  const { goalId } = await params;
  const [goalState, progressState] = await Promise.all([getGoal(goalId), listProgress({ goalId })]);
  const goal = goalState.data.goal;

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/goals", label: "Goals" },
          { label: "Goal data" },
        ]}
      />
      <PageHeader
        title="Goal data"
        description="Progress monitoring sessions for the selected goal."
        actions={
          progressState.configured && progressState.data.canEnter ? (
            <Link
              href="/progress/enter"
              className="bg-accent text-accent-foreground rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
            >
              Rapid entry
            </Link>
          ) : null
        }
      />
      {!goalState.configured || !progressState.configured ? (
        <ConfigurationState />
      ) : goalState.error || progressState.error ? (
        <SafeErrorState message={goalState.error ?? progressState.error} />
      ) : goal ? (
        <TableShell
          caption="Goal progress sessions"
          headers={["Date", "Student ID", "Measurement", "Value", "Status"]}
          rows={progressState.data.sessions.map((session) => [
            session.session_date,
            session.student_id,
            session.measurement_type.replaceAll("_", " "),
            session.value === null ? "No numeric value" : String(session.value),
            session.status,
          ])}
        />
      ) : (
        <SafeErrorState message="Goal not found or unavailable to your role." />
      )}
    </main>
  );
}
