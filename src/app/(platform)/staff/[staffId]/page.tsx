import type { Metadata } from "next";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { TableShell } from "@/components/data-display/table-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getStaffMember } from "@/lib/data/staff";
import { ROLE_LABELS } from "@/lib/permissions/matrix";

export const metadata: Metadata = { title: "Staff detail" };

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ staffId: string }>;
}) {
  const { staffId } = await params;
  const state = await getStaffMember(staffId);
  const staff = state.data.staff;

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/staff", label: "Staff" },
          { label: "Staff detail" },
        ]}
      />
      <PageHeader
        title={staff?.profile?.display_name ?? "Staff detail"}
        description="Staff role and assignment scope."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : staff ? (
        <div className="space-y-6">
          <Card>
            <CardTitle>{staff.profile?.display_name ?? staff.user_id}</CardTitle>
            <CardDescription>
              {ROLE_LABELS[staff.role_code]} - {staff.status}
            </CardDescription>
          </Card>
          <TableShell
            caption="School assignments"
            headers={["School ID", "Type", "Status", "Start"]}
            rows={state.data.assignments.schools.map((row) => [
              row.school_id,
              row.assignment_type,
              row.status,
              row.start_date,
            ])}
          />
          <TableShell
            caption="Program assignments"
            headers={["Program ID", "Type", "Status", "Start"]}
            rows={state.data.assignments.programs.map((row) => [
              row.program_id,
              row.assignment_type,
              row.status,
              row.start_date,
            ])}
          />
          <TableShell
            caption="Classroom assignments"
            headers={["Classroom ID", "Type", "Status", "Start"]}
            rows={state.data.assignments.classrooms.map((row) => [
              row.classroom_id,
              row.assignment_type,
              row.status,
              row.start_date,
            ])}
          />
          <TableShell
            caption="Student assignments"
            headers={["Student ID", "Role", "Status", "Start"]}
            rows={state.data.assignments.students.map((row) => [
              row.student_id,
              row.assignment_role,
              row.status,
              row.start_date,
            ])}
          />
        </div>
      ) : (
        <SafeErrorState message="Staff member not found or unavailable to your role." />
      )}
    </main>
  );
}
