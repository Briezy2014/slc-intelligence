import type { Metadata } from "next";
import { AssignmentForms, StudentForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { HubLinkGrid } from "@/components/navigation/hub-link-grid";
import { PageHeader } from "@/components/layout/page-header";
import { TableShell } from "@/components/data-display/table-shell";
import { Alert } from "@/components/ui/alert";
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
        description="Open a daily workflow below, or edit profile and assignments further down."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : student && state.data.organizationId ? (
        <div className="space-y-6">
          <Alert title="Daily work for this student" tone="info">
            Tap one card. Codes like {student.local_identifier || "S1"} keep names private in class.
          </Alert>
          <HubLinkGrid
            links={[
              {
                href: `/students/${student.id}/interventions`,
                label: "Interventions",
                description: "Start or update an intervention plan.",
              },
              {
                href: `/students/${student.id}/accommodations`,
                label: "Accommodations",
                description: "Assign supports and log what was used.",
              },
              {
                href: `/students/${student.id}/behavior`,
                label: "Behavior",
                description: "Log what you saw and family notes.",
              },
              {
                href: `/students/${student.id}/progress`,
                label: "Progress",
                description: "Enter goal progress data.",
              },
              {
                href: `/students/${student.id}/family-communication`,
                label: "Families",
                description: "Write a home note from templates.",
              },
              {
                href: `/students/${student.id}/executive-function`,
                label: "Executive function",
                description: "EF observations and plans.",
              },
              {
                href: `/students/${student.id}/services`,
                label: "Services",
                description: "Service plans and delivery logs.",
              },
              {
                href: `/students/${student.id}/goals`,
                label: "Goals & IEP",
                description: "Goals, IEP, and documents.",
              },
            ]}
          />
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
