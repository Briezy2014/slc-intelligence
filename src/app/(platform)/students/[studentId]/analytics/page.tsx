import type { Metadata } from "next";
import { GoalProgressChart } from "@/components/domain/analytics-panels";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { toObservationPoints, listProgress } from "@/lib/data/progress";
import { getStudent } from "@/lib/data/students";

export const metadata: Metadata = { title: "Student analytics" };

export default async function StudentAnalyticsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const [studentState, progressState] = await Promise.all([
    getStudent(studentId),
    listProgress({ studentId }),
  ]);
  const points =
    progressState.configured && !progressState.error
      ? toObservationPoints(progressState.data.sessions)
      : [];

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: "Analytics" },
        ]}
      />
      <PageHeader
        title="Student analytics"
        description="Tables-first summaries for authorized progress data."
      />
      {!studentState.configured || !progressState.configured ? (
        <ConfigurationState />
      ) : studentState.error || progressState.error ? (
        <SafeErrorState message={studentState.error ?? progressState.error} />
      ) : studentState.data.student ? (
        <GoalProgressChart title="Student progress summary" points={points} higherIsBetter />
      ) : (
        <SafeErrorState message="Student not found or unavailable to your role." />
      )}
    </main>
  );
}
