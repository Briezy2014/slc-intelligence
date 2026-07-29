import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { MeetingsWorkspace } from "@/components/domain/application-modules";
import { listMeetings } from "@/lib/data/meetings";

export const metadata: Metadata = { title: "Student meetings" };

export default async function StudentMeetingsPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  const state = await listMeetings({ studentId });
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/students", label: "Students" }, { label: "Meetings" }]} />
      <PageHeader title="Student meetings" description="Student-scoped meetings and acknowledgements." />
      {!state.configured ? <ConfigurationState /> : state.error ? <SafeErrorState message={state.error} /> : <MeetingsWorkspace data={state.data} studentId={studentId} />}
    </main>
  );
}
