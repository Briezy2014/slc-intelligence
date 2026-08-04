import type { Metadata } from "next";
import { StudentForm, StudentPlacementCard } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { HubLinkGrid } from "@/components/navigation/hub-link-grid";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { updateStudentArchiveStatusAction } from "@/lib/actions/students";
import { getStudent } from "@/lib/data/students";
import { listStaff } from "@/lib/data/staff";
import { studentDataHubLinks } from "@/lib/navigation/student-data-hub";

export const metadata: Metadata = { title: "Student hub" };

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

  const studentLabel = student
    ? `${student.last_name}, ${student.preferred_name || student.first_name}`
    : "Student";

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/students", label: "Students" },
          { label: studentLabel },
        ]}
      />
      <PageHeader
        title={studentLabel}
        description="One place for this student’s profile and every data area — behavior, progress, families, services, and more."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : student && state.data.organizationId ? (
        <div className="space-y-6">
          <Alert title="Student data hub" tone="info">
            Student ID <strong>{student.local_identifier || "—"}</strong>
            {student.grade_level ? (
              <>
                {" "}
                · Grade <strong>{student.grade_level}</strong>
              </>
            ) : null}
            {" · "}
            Status <strong>{student.enrollment_status}</strong>. Tap a card below to open that
            student’s records.
          </Alert>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Open student data</h2>
            <p className="text-muted text-sm">
              Links into behavior, progress reports, family communication, service providers, and
              the rest of this student’s file.
            </p>
            <HubLinkGrid
              links={studentDataHubLinks(student.id).filter(
                (link) => !link.href.endsWith("/overview"),
              )}
            />
          </section>

          <Card>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Student ID {student.local_identifier}
              {student.grade_level ? ` · Grade ${student.grade_level}` : ""}
              {" · "}
              Status {student.enrollment_status}. Date of birth and address can stay blank for
              de-identified practice students.
            </CardDescription>
            {state.data.canEdit ? (
              <div className="mt-4">
                <StudentForm organizationId={state.data.organizationId} student={student} />
              </div>
            ) : (
              <p className="text-muted mt-4 text-sm">You can view this profile but not edit it.</p>
            )}
          </Card>

          {state.data.canEdit ? (
            <Card>
              <CardTitle>Classroom & team</CardTitle>
              <CardDescription>
                Assign the classroom and staff who work with this student. This replaces the old
                program / school / class ID tables.
              </CardDescription>
              <div className="mt-4">
                <StudentPlacementCard
                  organizationId={state.data.organizationId}
                  studentId={student.id}
                  classrooms={state.data.classrooms}
                  staff={staffProfiles}
                  classroomAssignments={state.data.classroomAssignments}
                  staffAssignments={state.data.staffAssignments}
                />
              </div>
            </Card>
          ) : null}

          {state.data.canArchive ? (
            <Card>
              <CardTitle>
                {student.enrollment_status === "archived" ? "Restore student" : "Archive student"}
              </CardTitle>
              <CardDescription>
                {student.enrollment_status === "archived"
                  ? "Restore brings this student back into active workflows. History stays intact."
                  : "Archive hides this student from active workflows without deleting history."}
              </CardDescription>
              <form
                action={actionFor(updateStudentArchiveStatusAction)}
                className="mt-4 flex gap-3"
              >
                <input type="hidden" name="organizationId" value={state.data.organizationId} />
                <input type="hidden" name="studentId" value={student.id} />
                {student.enrollment_status === "archived" ? (
                  <button
                    name="intent"
                    value="restore"
                    className="bg-accent text-accent-foreground rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
                    type="submit"
                  >
                    Restore student
                  </button>
                ) : (
                  <button
                    name="intent"
                    value="archive"
                    className="bg-danger text-danger-foreground rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
                    type="submit"
                  >
                    Archive student
                  </button>
                )}
              </form>
            </Card>
          ) : null}
        </div>
      ) : (
        <SafeErrorState message="Student not found or unavailable to your role." />
      )}
    </main>
  );
}
