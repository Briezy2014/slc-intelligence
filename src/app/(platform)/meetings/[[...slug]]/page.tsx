import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { MeetingsWorkspace, type MeetingsView } from "@/components/domain/application-modules";
import { ModuleLinkGrid } from "@/components/navigation/module-link-grid";
import { listMeetings } from "@/lib/data/meetings";

export const metadata: Metadata = { title: "Meetings" };

function viewFromSlug(slug: string[]): MeetingsView {
  if (slug[0] === "action-items") return "action-items";
  if (slug[0] === "types") return "types";
  return "dashboard";
}

export default async function MeetingsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const view = viewFromSlug(slug);
  const state = await listMeetings({
    meetingId:
      slug[0] && !["calendar", "types", "action-items"].includes(slug[0]) ? slug[0] : undefined,
  });
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Meetings" }]} />
      <PageHeader
        title="Meeting Center"
        description="Schedule meetings, track acknowledgements, and review follow-ups."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <ModuleLinkGrid
            links={[
              {
                href: "/meetings",
                label: "Schedule",
                description: "Create and review meetings.",
              },
              {
                href: "/meetings/action-items",
                label: "Follow-ups",
                description: "Action items and acknowledgements.",
              },
              {
                href: "/meetings/types",
                label: "Types",
                description: "Meeting type labels available when scheduling.",
              },
            ]}
          />
          <MeetingsWorkspace data={state.data} view={view} />
        </div>
      )}
    </main>
  );
}
