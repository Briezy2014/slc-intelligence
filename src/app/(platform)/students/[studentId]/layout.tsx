import type { ReactNode } from "react";
import { StudentHubBar } from "@/components/navigation/student-hub-bar";
import { getStudent } from "@/lib/data/students";

export default async function StudentSectionLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const state = await getStudent(studentId);
  const student = state.data.student;
  const studentLabel = student
    ? `${student.local_identifier || "Student"} · ${student.last_name}, ${student.preferred_name || student.first_name}`
    : "Student";

  return (
    <>
      {student ? <StudentHubBar studentId={student.id} studentLabel={studentLabel} /> : null}
      {children}
    </>
  );
}
