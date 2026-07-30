import type { Metadata } from "next";
import { IepCycleForm } from "@/components/domain/forms";
import { EducationDocumentsWorkspace } from "@/components/domain/education-documents-workspace";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { TableShell } from "@/components/data-display/table-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { listEducationDocuments } from "@/lib/data/education-documents";
import { listGoals } from "@/lib/data/goals";
import { getStudent } from "@/lib/data/students";

export const metadata: Metadata = { title: "Student IEP" };

export default async function StudentIepPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const [studentState, goalsState, documentsState] = await Promise.all([
    getStudent(studentId),
    listGoals(studentId),
    listEducationDocuments({ studentId, documentType: "iep" }),
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
        description="IEP cycles plus blank/pre-populated IEP document drafts and uploads for team review."
      />
      {!studentState.configured || !goalsState.configured || !documentsState.configured ? (
        <ConfigurationState />
      ) : studentState.error || goalsState.error || documentsState.error ? (
        <SafeErrorState message={studentState.error ?? goalsState.error ?? documentsState.error} />
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
              <CardDescription>Use authorized student records only.</CardDescription>
              <div className="mt-4">
                <IepCycleForm
                  organizationId={goalsState.data.organizationId}
                  studentId={studentId}
                />
              </div>
            </Card>
          ) : null}
          {documentsState.data.permissions.canRead ? (
            <EducationDocumentsWorkspace
              data={documentsState.data}
              initialTab="iep"
              lockedStudentId={studentId}
            />
          ) : null}
        </div>
      ) : (
        <SafeErrorState message="Student not found or unavailable to your role." />
      )}
    </main>
  );
}
