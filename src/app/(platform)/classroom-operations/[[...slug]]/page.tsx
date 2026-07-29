import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { ClassroomOperationsWorkspace, ModuleLinkGrid } from "@/components/domain/application-modules";
import { listClassroomOperations } from "@/lib/data/classroom-operations";

export const metadata: Metadata = { title: "Classroom operations" };

export default async function ClassroomOperationsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const daily = slug[0] === "daily";
  const state = await listClassroomOperations();
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Classroom Operations" }]} />
      <PageHeader title={daily ? "Daily Command Center" : "Classroom Operations"} description="Role-aware schedules, routines, daily notes, announcements, and classroom supports." />
      {!state.configured ? <ConfigurationState /> : state.error ? <SafeErrorState message={state.error} /> : (
        <div className="space-y-6">
          <ModuleLinkGrid links={[
            { href: "/classroom-operations", label: "Operations", description: "Review classroom operations." },
            { href: "/classroom-operations/daily", label: "Daily Command Center", description: "Daily role-aware sections." },
            { href: "/classroom-operations/schedules", label: "Schedules", description: "Classroom schedule blocks." },
          ]} />
          <ClassroomOperationsWorkspace data={state.data} daily={daily} />
        </div>
      )}
    </main>
  );
}
