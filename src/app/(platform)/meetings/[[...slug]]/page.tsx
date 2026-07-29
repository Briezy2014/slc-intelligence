import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { MeetingsWorkspace, ModuleLinkGrid } from "@/components/domain/application-modules";
import { listMeetings } from "@/lib/data/meetings";

export const metadata: Metadata = { title: "Meetings" };

export default async function MeetingsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const state = await listMeetings({ meetingId: slug[0] && !["calendar", "types", "action-items"].includes(slug[0]) ? slug[0] : undefined });
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Meetings" }]} />
      <PageHeader title="Meeting Center" description="Meetings, participants, notes, action items, and descriptive acknowledgements." />
      {!state.configured ? <ConfigurationState /> : state.error ? <SafeErrorState message={state.error} /> : (
        <div className="space-y-6">
          <ModuleLinkGrid links={[
            { href: "/meetings", label: "Dashboard", description: "Review scheduled and draft meetings." },
            { href: "/meetings/action-items", label: "Action items", description: "Track meeting follow-ups." },
            { href: "/meetings/types", label: "Types", description: "Manage meeting types when authorized." },
          ]} />
          <MeetingsWorkspace data={state.data} />
        </div>
      )}
    </main>
  );
}
