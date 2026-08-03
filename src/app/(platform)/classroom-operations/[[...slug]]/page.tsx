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

const CLASSROOM_LINKS = [
  {
    href: "/classroom-operations/daily",
    label: "Today in class",
    description: "Two quick picks: see today’s schedule and add a student note.",
  },
  {
    href: "/classroom-operations/schedules",
    label: "Schedules",
    description: "Question 1: schedule template. Question 2: time-block library.",
  },
  {
    href: "/classroom-operations/notes",
    label: "Daily notes",
    description: "Question 1: which student. Question 2: note from the library.",
  },
  {
    href: "/classroom-operations/routines",
    label: "Routines",
    description: "Question 1: which routine. Question 2: keep or edit the steps.",
  },
  {
    href: "/classroom-operations/announcements",
    label: "Announcements",
    description: "Question 1: notice template. Question 2: who should see it.",
  },
] as const;

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

function activeHrefFor(section: ClassroomOpsSection): string | undefined {
  switch (section) {
    case "daily":
      return "/classroom-operations/daily";
    case "schedules":
      return "/classroom-operations/schedules";
    case "notes":
      return "/classroom-operations/notes";
    case "routines":
      return "/classroom-operations/routines";
    case "announcements":
      return "/classroom-operations/announcements";
    default:
      return undefined;
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
  const activeHref = activeHrefFor(section);

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Classroom" }]} />
      <PageHeader
        title={sectionTitle(section)}
        description="Day-of classroom tools: schedules, notes, routines, announcements. Tap a card, answer two dropdowns, save, then export CSV/PDF if needed."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <Alert title="Everything below is tappable" tone="info">
            Choose what you want to do. Each path opens a short form with ready-made library
            dropdowns — pick answers, then save.
          </Alert>
          <HubLinkGrid links={[...CLASSROOM_LINKS]} activeHref={activeHref} />
          <ClassroomOperationsWorkspace data={state.data} section={section} />
        </div>
      )}
    </main>
  );
}
