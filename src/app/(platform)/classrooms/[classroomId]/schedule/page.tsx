import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { ClassroomOperationsWorkspace } from "@/components/domain/application-modules";
import { listClassroomOperations } from "@/lib/data/classroom-operations";

export const metadata: Metadata = { title: "Classroom schedule" };

export default async function ClassroomSchedulePage({ params }: { params: Promise<{ classroomId: string }> }) {
  const { classroomId } = await params;
  const state = await listClassroomOperations({ classroomId });
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/classrooms", label: "Classrooms" }, { label: "Schedule" }]} />
      <PageHeader title="Classroom schedule" description="Classroom schedule blocks and daily operations for the selected classroom." />
      {!state.configured ? <ConfigurationState /> : state.error ? <SafeErrorState message={state.error} /> : <ClassroomOperationsWorkspace data={state.data} classroomId={classroomId} />}
    </main>
  );
}
