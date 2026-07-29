import type { Metadata } from "next";
import { GoalForm } from "@/components/domain/forms";
import { GoalList } from "@/components/domain/lists";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { listGoals } from "@/lib/data/goals";
import { getStudent } from "@/lib/data/students";

export const metadata: Metadata = { title: "Student goals" };

export default async function StudentGoalsPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const [studentState, goalsState] = await Promise.all([getStudent(studentId), listGoals(studentId)]);

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/students", label: "Students" }, { label: "Goals" }]} />
      <PageHeader title="Student goals" description="IEP goals for the selected authorized student." />
      {!studentState.configured || !goalsState.configured ? <ConfigurationState /> : studentState.error || goalsState.error ? (
        <SafeErrorState message={studentState.error ?? goalsState.error} />
      ) : studentState.data.student && goalsState.data.organizationId ? (
        <div className="space-y-6">
          <GoalList goals={goalsState.data.rows} students={goalsState.data.students} />
          {goalsState.data.canManage ? (
            <Card>
              <CardTitle>Create goal</CardTitle>
              <CardDescription>Create goals only for authorized fictional/development records.</CardDescription>
              <div className="mt-4"><GoalForm organizationId={goalsState.data.organizationId} studentId={studentId} cycles={goalsState.data.cycles} /></div>
            </Card>
          ) : null}
        </div>
      ) : <SafeErrorState message="Student not found or unavailable to your role." />}
    </main>
  );
}
