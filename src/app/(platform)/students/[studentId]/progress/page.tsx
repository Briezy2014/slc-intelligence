import type { Metadata } from "next";
import Link from "next/link";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { TableShell } from "@/components/data-display/table-shell";
import { listProgress } from "@/lib/data/progress";
import { getStudent } from "@/lib/data/students";

export const metadata: Metadata = { title: "Student progress" };

export default async function StudentProgressPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const [studentState, progressState] = await Promise.all([
    getStudent(studentId),
    listProgress({ studentId }),
  ]);

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: "Progress" },
        ]}
      />
      <PageHeader
        title="Student progress"
        description="Progress sessions for the selected authorized student."
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
      {!studentState.configured || !progressState.configured ? (
        <ConfigurationState />
      ) : studentState.error || progressState.error ? (
        <SafeErrorState message={studentState.error ?? progressState.error} />
      ) : studentState.data.student ? (
        <TableShell
          caption="Progress sessions"
          headers={["Date", "Goal ID", "Measurement", "Value", "Status"]}
          rows={progressState.data.sessions.map((session) => [
            session.session_date,
            session.goal_id,
            session.measurement_type.replaceAll("_", " "),
            session.value === null ? "No numeric value" : String(session.value),
            session.status,
          ])}
        />
      ) : (
        <SafeErrorState message="Student not found or unavailable to your role." />
      )}
    </main>
  );
}
