import type { Metadata } from "next";
import { GoalForm, IepCycleForm } from "@/components/domain/forms";
import { GoalList } from "@/components/domain/lists";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { listGoals } from "@/lib/data/goals";
import { getStudent } from "@/lib/data/students";

export const metadata: Metadata = { title: "Student goals" };

export default async function StudentGoalsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const [studentState, goalsState] = await Promise.all([
    getStudent(studentId),
    listGoals(studentId),
  ]);

  const cyclesForStudent =
    goalsState.configured && !goalsState.error
      ? goalsState.data.cycles.filter((cycle) => cycle.student_id === studentId)
      : [];

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: "Goals" },
        ]}
      />
      <PageHeader
        title="Student goals"
        description="Choose grade + subject to load recommended learning progressions, then save goals for this student."
      />
      {!studentState.configured || !goalsState.configured ? (
        <ConfigurationState />
      ) : studentState.error || goalsState.error ? (
        <SafeErrorState message={studentState.error ?? goalsState.error} />
      ) : studentState.data.student && goalsState.data.organizationId ? (
        <div className="space-y-6">
          <GoalList goals={goalsState.data.rows} students={goalsState.data.students} />
          {goalsState.data.canManage && cyclesForStudent.length === 0 ? (
            <Card>
              <CardTitle>Create an IEP cycle first</CardTitle>
              <CardDescription>
                Goals attach to an IEP cycle. Create one below, then pick a progression goal.
              </CardDescription>
              <div className="mt-4">
                <IepCycleForm
                  organizationId={goalsState.data.organizationId}
                  studentId={studentId}
                />
              </div>
            </Card>
          ) : null}
          {goalsState.data.canManage ? (
            <Card>
              <CardTitle>Create goal from learning progressions</CardTitle>
              <CardDescription>
                Grade and subject dropdowns load recommended progression goals across ELA, math,
                functional math, ASL, science, social studies, executive function, communication,
                and life skills.
              </CardDescription>
              {cyclesForStudent.length === 0 ? (
                <div className="mt-4">
                  <Alert title="IEP cycle required" tone="warning">
                    Create an IEP cycle above before saving a goal.
                  </Alert>
                </div>
              ) : (
                <div className="mt-4">
                  <GoalForm
                    organizationId={goalsState.data.organizationId}
                    studentId={studentId}
                    cycles={goalsState.data.cycles}
                    defaultGradeLevel={studentState.data.student.grade_level}
                  />
                </div>
              )}
            </Card>
          ) : null}
        </div>
      ) : (
        <SafeErrorState message="Student not found or unavailable to your role." />
      )}
    </main>
  );
}
