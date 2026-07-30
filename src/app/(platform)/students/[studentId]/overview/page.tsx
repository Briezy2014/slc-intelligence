import type { Metadata } from "next";
import Link from "next/link";
import { AssignmentForms, StudentForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { TableShell } from "@/components/data-display/table-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { updateStudentArchiveStatusAction } from "@/lib/actions/students";
import { getStudent } from "@/lib/data/students";
import { listStaff } from "@/lib/data/staff";

export const metadata: Metadata = { title: "Student overview" };

function actionFor(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
}

export default async function StudentOverviewPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const [state, staffState] = await Promise.all([getStudent(studentId), listStaff()]);
  const student = state.data.student;
  const staffProfiles =
    staffState.configured && !staffState.error
      ? staffState.data.rows.flatMap((row) => (row.profile ? [row.profile] : []))
      : [];

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: "Student overview" },
        ]}
      />
      <PageHeader
        title={
          student
            ? `${student.last_name}, ${student.preferred_name || student.first_name}`
            : "Student overview"
        }
        description="Student profile, enrollments, assignments, and access-controlled workflow links."
        actions={
          student ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/students/${student.id}/iep`}
                className="bg-background-elevated border-border rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold"
              >
                IEP
              </Link>
              <Link
                href={`/students/${student.id}/etr`}
                className="bg-background-elevated border-border rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold"
              >
                ETR
              </Link>
              <Link
                href={`/students/${student.id}/goals`}
                className="bg-background-elevated border-border rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold"
              >
                Goals
              </Link>
              <Link
                href={`/students/${student.id}/progress`}
                className="bg-background-elevated border-border rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold"
              >
                Progress
              </Link>
              <Link
                href={`/students/${student.id}/analytics`}
                className="bg-background-elevated border-border rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold"
              >
                Analytics
              </Link>
              <Link
                href={`/students/${student.id}/reports`}
                className="bg-background-elevated border-border rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold"
              >
                Reports
              </Link>
              <Link
                href={`/students/${student.id}/behavior`}
                className="bg-background-elevated border-border rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold"
              >
                Behavior
              </Link>
              <Link
                href={`/students/${student.id}/interventions`}
                className="bg-background-elevated border-border rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold"
              >
                Interventions
              </Link>
            </div>
          ) : null
        }
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : student && state.data.organizationId ? (
        <div className="space-y-6">
          <Card>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Local identifier {student.local_identifier}; status {student.enrollment_status}.
            </CardDescription>
          </Card>
          {state.data.canEdit ? (
            <Card>
              <StudentForm organizationId={state.data.organizationId} student={student} />
            </Card>
          ) : null}
          {state.data.canArchive ? (
            <Card>
              <CardTitle>Archive and restore</CardTitle>
              <CardDescription>
                Archive hides a student from active workflows without deleting history.
              </CardDescription>
              <form
                action={actionFor(updateStudentArchiveStatusAction)}
                className="mt-4 flex gap-3"
              >
                <input type="hidden" name="organizationId" value={state.data.organizationId} />
                <input type="hidden" name="studentId" value={student.id} />
                <button
                  name="intent"
                  value="archive"
                  className="bg-danger text-danger-foreground rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
                  type="submit"
                >
                  Archive
                </button>
                <button
                  name="intent"
                  value="restore"
                  className="bg-background-elevated border-border rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold"
                  type="submit"
                >
                  Restore
                </button>
              </form>
            </Card>
          ) : null}
          <TableShell
            caption="School enrollments"
            headers={["School ID", "Status", "Start", "End"]}
            rows={state.data.enrollments.map((row) => [
              row.school_id,
              row.status,
              row.start_date,
              row.end_date ?? "",
            ])}
          />
          <TableShell
            caption="Program assignments"
            headers={["Program ID", "Status", "Start", "End"]}
            rows={state.data.programAssignments.map((row) => [
              row.program_id,
              row.status,
              row.start_date,
              row.end_date ?? "",
            ])}
          />
          <TableShell
            caption="Classroom assignments"
            headers={["Classroom ID", "Status", "Start", "End"]}
            rows={state.data.classroomAssignments.map((row) => [
              row.classroom_id,
              row.status,
              row.start_date,
              row.end_date ?? "",
            ])}
          />
          <TableShell
            caption="Staff assignments"
            headers={["User ID", "Role", "Status", "Start"]}
            rows={state.data.staffAssignments.map((row) => [
              row.user_id,
              row.assignment_role,
              row.status,
              row.start_date,
            ])}
          />
          {state.data.canEdit ? (
            <Card>
              <CardTitle>Assignments management</CardTitle>
              <CardDescription>
                Add active school, program, classroom, or staff assignments.
              </CardDescription>
              <div className="mt-4">
                <AssignmentForms
                  organizationId={state.data.organizationId}
                  studentId={student.id}
                  schools={state.data.schools}
                  programs={state.data.programs}
                  classrooms={state.data.classrooms}
                  staff={staffProfiles}
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
