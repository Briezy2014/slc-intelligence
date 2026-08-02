import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import {
  ClassroomOperationsWorkspace,
  type ClassroomOpsSection,
} from "@/components/domain/application-modules";
import { HubLinkGrid } from "@/components/navigation/hub-link-grid";
import { Alert } from "@/components/ui/alert";
import { listClassroomOperations } from "@/lib/data/classroom-operations";

export const metadata: Metadata = { title: "Classroom" };

function resolveSection(slug?: string[]): ClassroomOpsSection {
  const key = slug?.[0];
  if (key === "daily") return "daily";
  if (key === "schedules") return "schedules";
  if (key === "notes") return "notes";
  if (key === "routines") return "routines";
  if (key === "announcements") return "announcements";
  return "overview";
}

function sectionTitle(section: ClassroomOpsSection): string {
  switch (section) {
    case "daily":
      return "Today in class";
    case "schedules":
      return "Schedules";
    case "notes":
      return "Daily notes";
    case "routines":
      return "Routines";
    case "announcements":
      return "Announcements";
    default:
      return "Classroom";
  }
}

export default async function ClassroomOperationsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const section = resolveSection(slug);
  const state = await listClassroomOperations();
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Classroom" }]} />
      <PageHeader
        title={sectionTitle(section)}
        description="Answer a couple of dropdowns, then save. Schedules, notes, and routines start from ready-made choices."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <Alert title="Pick what you want to do" tone="info">
            Tap a card below. Each form uses dropdown libraries — you only fill what is unique
            today.
          </Alert>
          <HubLinkGrid
            links={[
              {
                href: "/classroom-operations/daily",
                label: "Today in class",
                description: "See today’s schedule, add a note, check routines.",
              },
              {
                href: "/classroom-operations/schedules",
                label: "Schedules",
                description: "Pick a schedule template and time-block library.",
              },
              {
                href: "/classroom-operations/notes",
                label: "Daily notes",
                description: "Choose a student + note template, then save.",
              },
              {
                href: "/classroom-operations/routines",
                label: "Routines",
                description: "Arrival, transition, and dismissal routines from a list.",
              },
              {
                href: "/classroom-operations/announcements",
                label: "Announcements",
                description: "Post a short staff classroom notice.",
              },
            ]}
          />
          <ClassroomOperationsWorkspace data={state.data} section={section} />
        </div>
      )}
    </main>
  );
}
