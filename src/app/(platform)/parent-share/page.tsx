import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { ConfigurationState, SafeErrorState } from "@/components/domain/page-states";
import { Alert } from "@/components/ui/alert";
import { TableShell } from "@/components/data-display/table-shell";
import { listCommunications } from "@/lib/data/communications";

export const metadata: Metadata = { title: "Messages for families" };

function studentLabel(
  students: Array<{
    id: string;
    first_name: string;
    last_name: string;
    preferred_name: string | null;
  }>,
  studentId: string,
) {
  const student = students.find((entry) => entry.id === studentId);
  if (!student) return "Student";
  return `${student.last_name}, ${student.preferred_name || student.first_name}`;
}

export default async function ParentSharePage() {
  const state = await listCommunications();
  const familyReady =
    state.configured && !state.error ? state.data.familyVisibleCommunications : [];
  const students = state.configured && !state.error ? state.data.students : [];

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Messages for families" }]} />
      <PageHeader
        title="Messages for families"
        description="This is your checklist of school-to-home notes that are okay for parents to see. You write them in Family Communication — they show up here after you save."
      />
      {!state.configured ? (
        <ConfigurationState />
      ) : state.error ? (
        <SafeErrorState message={state.error} />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/family-communication/communications"
              className="bg-accent text-accent-foreground hover:bg-accent-secondary inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold shadow-[0_8px_24px_rgb(139_61_255/0.28)]"
            >
              Write a family message
            </Link>
            <Link
              href="/family-communication"
              className="bg-background-elevated text-foreground border-border hover:border-highlight/40 hover:bg-surface-subtle inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border px-4 py-2 text-sm font-semibold"
            >
              Open Family Communication
            </Link>
          </div>

          <Alert title="How this works" tone="info">
            <ol className="mt-1 list-decimal space-y-1 pl-5">
              <li>Open Family Communication and choose a student.</li>
              <li>Pick a template (or write a note) and keep Visibility set to Family visible.</li>
              <li>Save. The note appears in the list below.</li>
              <li>
                If you need a parent “I read this” signature, stay in Family Communication and use
                the signature section.
              </li>
            </ol>
          </Alert>

          <TableShell
            caption="Ready to send home"
            headers={["Student", "Subject", "How sent", "Status", "When"]}
            emptyMessage="Nothing ready for families yet. Tap Write a family message above — this page stays empty until you save a Family visible note in Family Communication."
            rows={familyReady.map((log) => [
              studentLabel(students, log.student_id),
              log.subject,
              log.method.replaceAll("_", " "),
              log.status.replaceAll("_", " "),
              new Date(log.occurred_at).toLocaleString(),
            ])}
          />
        </div>
      )}
    </main>
  );
}
