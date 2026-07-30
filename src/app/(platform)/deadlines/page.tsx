import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Alert } from "@/components/ui/alert";
import { TableShell } from "@/components/data-display/table-shell";
import { listDeadlineTracker } from "@/lib/data/deadlines";

export const metadata: Metadata = { title: "Deadline tracker" };

function kindLabel(kind: string) {
  switch (kind) {
    case "iep_review":
      return "IEP review window";
    case "communication_followup":
      return "Communication follow-up";
    case "meeting":
      return "Meeting";
    case "reporting_period":
      return "Reporting period";
    default:
      return kind;
  }
}

export default async function DeadlinesPage() {
  const state = await listDeadlineTracker();
  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Deadline tracker" }]} />
      <PageHeader
        title="Deadline / timeline tracker"
        description="Classroom reminders for IEP review windows, meetings, follow-ups, and reporting periods."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <Alert title="Reminders, not legal compliance determinations" tone="info">
            These timeline reminders help special education teams stay organized. They do not
            certify legal compliance or replace district due-process calendars.
          </Alert>
          <TableShell
            caption="Upcoming timelines"
            headers={["Type", "Item", "Student", "Due", "Status", "Path"]}
            rows={state.data.items.map((item) => [
              kindLabel(item.kind),
              item.title,
              item.studentLabel ?? "—",
              item.dueDate ? new Date(item.dueDate).toLocaleString() : "Not set",
              item.status,
              item.href,
            ])}
          />
        </div>
      )}
    </main>
  );
}
