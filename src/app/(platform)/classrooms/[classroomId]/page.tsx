import type { Metadata } from "next";
import Link from "next/link";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { TableShell } from "@/components/data-display/table-shell";
import { getClassroom } from "@/lib/data/classrooms";

export const metadata: Metadata = { title: "Classroom detail" };

export default async function ClassroomDetailPage({
  params,
}: {
  params: Promise<{ classroomId: string }>;
}) {
  const { classroomId } = await params;
  const state = await getClassroom(classroomId);
  const classroom = state.data.classroom;
  const school = state.data.schools.find((entry) => entry.id === classroom?.school_id);
  const program = state.data.programs.find((entry) => entry.id === classroom?.program_id);

  return (
    <main id="main-content">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/classrooms", label: "Classrooms" },
          { label: "Classroom detail" },
        ]}
      />
      <PageHeader
        title={classroom?.name ?? "Classroom detail"}
        description="Classroom metadata and scope."
        actions={
          classroom && state.data.canManage ? (
            <Link
              href={`/classrooms/${classroom.id}/edit`}
              className="bg-accent text-accent-foreground rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold"
            >
              Edit classroom
            </Link>
          ) : null
        }
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : classroom ? (
        <div className="space-y-6">
          <Card>
            <CardTitle>{classroom.name}</CardTitle>
            <CardDescription>{classroom.description ?? "No description provided."}</CardDescription>
          </Card>
          <TableShell
            caption="Classroom metadata"
            headers={["Field", "Value"]}
            rows={[
              ["School", school?.name ?? "Unknown school"],
              ["Program", program?.name ?? "Not assigned"],
              ["Academic year", classroom.academic_year ?? "Not set"],
              ["Status", classroom.status],
            ]}
          />
        </div>
      ) : (
        <SafeErrorState message="Classroom not found or unavailable to your role." />
      )}
    </main>
  );
}
