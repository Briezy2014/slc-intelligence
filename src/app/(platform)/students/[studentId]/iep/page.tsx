import type { Metadata } from "next";
import { IepCycleForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { TableShell } from "@/components/data-display/table-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { listGoals } from "@/lib/data/goals";
import { getStudent } from "@/lib/data/students";

export const metadata: Metadata = { title: "Student IEP" };

export default async function StudentIepPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const [studentState, goalsState] = await Promise.all([
    getStudent(studentId),
    listGoals(studentId),
  ]);

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: "IEP" },
        ]}
      />
      <PageHeader
        title="Student IEP"
        description="IEP cycles for the selected authorized student."
      />
      {!studentState.configured || !goalsState.configured ? (
        <ConfigurationState />
      ) : studentState.error || goalsState.error ? (
        <SafeErrorState message={studentState.error ?? goalsState.error} />
      ) : studentState.data.student && goalsState.data.organizationId ? (
        <div className="space-y-6">
          <TableShell
            caption="IEP cycles"
            headers={["Label", "Start", "End", "Review", "Status"]}
            rows={goalsState.data.cycles
              .filter((cycle) => cycle.student_id === studentId)
              .map((cycle) => [
                cycle.label,
                cycle.start_date,
                cycle.end_date ?? "",
                cycle.review_date ?? "",
                cycle.status,
              ])}
          />
          {goalsState.data.canManage ? (
            <Card>
              <CardTitle>Create IEP cycle</CardTitle>
              <CardDescription>Use fictional/development data only.</CardDescription>
              <div className="mt-4">
                <IepCycleForm
                  organizationId={goalsState.data.organizationId}
                  studentId={studentId}
                />
              </div>
            </Card>
          ) : null}
        </div>
      ) : (
        <SafeErrorState message="Student not found or unavailable to your role." />
      )}
    </main>
  );
}
