import type { Metadata } from "next";
import { EducationDocumentsWorkspace } from "@/components/domain/education-documents-workspace";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { listEducationDocuments } from "@/lib/data/education-documents";
import { getStudent } from "@/lib/data/students";

export const metadata: Metadata = { title: "Student ETR" };

export default async function StudentEtrPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const [studentState, documentsState] = await Promise.all([
    getStudent(studentId),
    listEducationDocuments({ studentId, documentType: "etr" }),
  ]);

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: "ETR" },
        ]}
      />
      <PageHeader
        title="Student ETR workspace"
        description="Evaluation Team Report drafts, dropdown sections, and upload tracking for team review."
      />
      {!studentState.configured || !documentsState.configured ? (
        <ConfigurationState />
      ) : studentState.error || documentsState.error ? (
        <SafeErrorState message={studentState.error ?? documentsState.error} />
      ) : !studentState.data.student ? (
        <SafeErrorState message="Student not found or unavailable to your role." />
      ) : (
        <EducationDocumentsWorkspace
          data={documentsState.data}
          initialTab="etr"
          lockedStudentId={studentId}
        />
      )}
    </main>
  );
}
