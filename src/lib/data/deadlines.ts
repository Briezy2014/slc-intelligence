import {
  emptyDataState,
  getOrgDataContext,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";

export type DeadlineItem = {
  id: string;
  kind: "iep_review" | "communication_followup" | "meeting" | "reporting_period";
  title: string;
  dueDate: string | null;
  studentLabel: string | null;
  status: string;
  href: string;
};

export type DeadlinesData = {
  organizationId: string | null;
  items: DeadlineItem[];
};

const empty: DeadlinesData = { organizationId: null, items: [] };

function studentLabel(student: {
  first_name: string;
  last_name: string;
  preferred_name: string | null;
}) {
  return `${student.last_name}, ${student.preferred_name || student.first_name}`;
}

export async function listDeadlineTracker(): Promise<DataState<DeadlinesData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(empty);

  try {
    const [studentsResult, cyclesResult, followupsResult, meetingsResult, periodsResult] =
      await Promise.all([
        context.supabase
          .from("students")
          .select("id, first_name, last_name, preferred_name")
          .eq("organization_id", context.organizationId),
        context.supabase
          .from("iep_cycles")
          .select("id, student_id, label, review_date, end_date, status")
          .eq("organization_id", context.organizationId)
          .order("review_date", { ascending: true }),
        context.supabase
          .from("communication_followups")
          .select("id, student_id, due_date, status, description, communication_log_id")
          .eq("organization_id", context.organizationId)
          .eq("status", "open")
          .order("due_date", { ascending: true }),
        context.supabase
          .from("meetings")
          .select("id, student_id, title, scheduled_start, status")
          .eq("organization_id", context.organizationId)
          .order("scheduled_start", { ascending: true }),
        context.supabase
          .from("reporting_periods")
          .select("id, name, due_date, status")
          .eq("organization_id", context.organizationId)
          .order("due_date", { ascending: true }),
      ]);

    if (
      studentsResult.error ||
      cyclesResult.error ||
      followupsResult.error ||
      meetingsResult.error
    ) {
      return safeDataError(empty);
    }

    // Reporting periods are optional; ignore if unavailable in the tenant.

    const students = new Map(
      (studentsResult.data ?? []).map((student) => [student.id, studentLabel(student)]),
    );
    const items: DeadlineItem[] = [];

    for (const cycle of cyclesResult.data ?? []) {
      items.push({
        id: `iep-${cycle.id}`,
        kind: "iep_review",
        title: `IEP review · ${cycle.label}`,
        dueDate: cycle.review_date || cycle.end_date,
        studentLabel: students.get(cycle.student_id) ?? null,
        status: cycle.status,
        href: `/students/${cycle.student_id}/iep`,
      });
    }

    for (const followup of followupsResult.data ?? []) {
      items.push({
        id: `followup-${followup.id}`,
        kind: "communication_followup",
        title: followup.description.slice(0, 120),
        dueDate: followup.due_date,
        studentLabel: students.get(followup.student_id) ?? null,
        status: followup.status,
        href: `/students/${followup.student_id}/family-communication/communications`,
      });
    }

    for (const meeting of meetingsResult.data ?? []) {
      items.push({
        id: `meeting-${meeting.id}`,
        kind: "meeting",
        title: meeting.title,
        dueDate: meeting.scheduled_start,
        studentLabel: students.get(meeting.student_id) ?? null,
        status: meeting.status,
        href: `/students/${meeting.student_id}/meetings`,
      });
    }

    if (!periodsResult.error) {
      for (const period of periodsResult.data ?? []) {
        items.push({
          id: `period-${period.id}`,
          kind: "reporting_period",
          title: `Reporting period · ${period.name}`,
          dueDate: period.due_date,
          studentLabel: null,
          status: period.status,
          href: "/reports",
        });
      }
    }

    items.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        items,
      },
    };
  } catch {
    return safeDataError(empty);
  }
}
