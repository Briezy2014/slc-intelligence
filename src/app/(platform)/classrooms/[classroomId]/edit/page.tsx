import type { Metadata } from "next";
import { ClassroomForm } from "@/components/domain/forms";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { getClassroom } from "@/lib/data/classrooms";

export const metadata: Metadata = { title: "Edit classroom" };

export default async function EditClassroomPage({ params }: { params: Promise<{ classroomId: string }> }) {
  const { classroomId } = await params;
  const state = await getClassroom(classroomId);
  const classroom = state.data.classroom;

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/classrooms", label: "Classrooms" }, { label: "Edit" }]} />
      <PageHeader title="Edit classroom" description="Update classroom details." />
      {!state.configured ? <ConfigurationState /> : state.error || !classroom || !state.data.organizationId || !state.data.canManage ? (
        <SafeErrorState message={state.error ?? "Classroom not found or you are not authorized to edit it."} />
      ) : (
        <Card><ClassroomForm organizationId={state.data.organizationId} classroom={classroom} schools={state.data.schools} programs={state.data.programs} /></Card>
      )}
    </main>
  );
}
