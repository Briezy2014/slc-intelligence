import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import {
  ClassroomOperationsWorkspace,
  ModuleLinkGrid,
  type ClassroomOpsSection,
} from "@/components/domain/application-modules";
import { listClassroomOperations } from "@/lib/data/classroom-operations";

export const metadata: Metadata = { title: "Classroom operations" };

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
      return "Daily Command Center";
    case "schedules":
      return "Schedules";
    case "notes":
      return "Daily notes";
    case "routines":
      return "Routines";
    case "announcements":
      return "Announcements";
    default:
      return "Classroom Operations";
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
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Classroom Operations" }]} />
      <PageHeader
        title={sectionTitle(section)}
        description="Create schedules and time blocks, log daily notes for coded students, manage routines, and post staff announcements."
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
                href: "/classroom-operations",
                label: "Operations",
                description: "Full classroom operations workspace.",
              },
              {
                href: "/classroom-operations/daily",
                label: "Daily Command Center",
                description: "Today-focused schedules, notes, and routines.",
              },
              {
                href: "/classroom-operations/schedules",
                label: "Schedules",
                description: "Create schedules and add time blocks.",
              },
              {
                href: "/classroom-operations/notes",
                label: "Daily notes",
                description: "Enter and review coded student notes.",
              },
              {
                href: "/classroom-operations/routines",
                label: "Routines",
                description: "Arrival, transition, and dismissal routines.",
              },
              {
                href: "/classroom-operations/announcements",
                label: "Announcements",
                description: "Staff classroom notices (no student PII).",
              },
            ]}
          />
          <ClassroomOperationsWorkspace data={state.data} section={section} />
        </div>
      )}
    </main>
  );
}
