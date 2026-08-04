"use client";

import { useMemo, useState } from "react";
import { SectionExportBar } from "@/components/domain/section-export-bar";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { TableShell } from "@/components/data-display/table-shell";
import type { InterventionData } from "@/lib/data/interventions";

function studentName(student: InterventionData["students"][number]) {
  return `${student.last_name}, ${student.preferred_name || student.first_name}`;
}

export function InterventionTriedExport({
  data,
  studentId,
}: {
  data: InterventionData;
  studentId?: string;
}) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const plans = useMemo(
    () =>
      data.plans.filter((plan) => !studentId || plan.student_id === studentId),
    [data.plans, studentId],
  );

  const triedRows = useMemo(() => {
    const rows: Array<{
      date: string;
      student: string;
      intervention: string;
      kind: string;
      detail: string;
      notes: string;
    }> = [];

    for (const log of data.dosageLogs) {
      const plan = plans.find((entry) => entry.id === log.plan_id);
      if (!plan) continue;
      if (fromDate && log.log_date < fromDate) continue;
      if (toDate && log.log_date > toDate) continue;
      const student = data.students.find((entry) => entry.id === plan.student_id);
      rows.push({
        date: log.log_date,
        student: student ? studentName(student) : "Student",
        intervention: plan.title,
        kind: "Dosage / what we delivered",
        detail: `${log.sessions_delivered ?? 0} session(s), ${log.duration_minutes ?? 0} min`,
        notes: log.notes ?? "",
      });
    }

    for (const observation of data.fidelityObservations) {
      const plan = plans.find((entry) => entry.id === observation.plan_id);
      if (!plan) continue;
      if (fromDate && observation.observation_date < fromDate) continue;
      if (toDate && observation.observation_date > toDate) continue;
      const student = data.students.find((entry) => entry.id === plan.student_id);
      rows.push({
        date: observation.observation_date,
        student: student ? studentName(student) : "Student",
        intervention: plan.title,
        kind: "Fidelity / did we follow it",
        detail: observation.status.replaceAll("_", " "),
        notes: observation.notes ?? "",
      });
    }

    for (const review of data.reviews) {
      const plan = plans.find((entry) => entry.id === review.plan_id);
      if (!plan) continue;
      if (fromDate && review.review_date < fromDate) continue;
      if (toDate && review.review_date > toDate) continue;
      const student = data.students.find((entry) => entry.id === plan.student_id);
      rows.push({
        date: review.review_date,
        student: student ? studentName(student) : "Student",
        intervention: plan.title,
        kind: "Review / what we decided",
        detail: review.outcome.replaceAll("_", " "),
        notes: review.summary,
      });
    }

    return rows.sort((a, b) => b.date.localeCompare(a.date));
  }, [
    data.dosageLogs,
    data.fidelityObservations,
    data.reviews,
    data.students,
    fromDate,
    plans,
    toDate,
  ]);

  const planRows = plans.map((plan) => {
    const student = data.students.find((entry) => entry.id === plan.student_id);
    const library = data.libraryItems.find((item) => item.id === plan.library_item_id);
    return [
      plan.start_date ?? plan.created_at?.slice(0, 10) ?? "",
      student ? studentName(student) : "Student",
      plan.title,
      library?.name ?? "Custom",
      plan.status.replaceAll("_", " "),
      plan.description ?? "",
    ];
  });

  return (
    <Card>
      <CardTitle>What we tried · saved record</CardTitle>
      <CardDescription>
        Everything logged here is saved: plans you started, dosage (sessions/minutes), fidelity
        checks, and reviews. Export the full trail for your team.
      </CardDescription>
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField id="triedFrom" label="From date">
            <Input
              id="triedFrom"
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </FormField>
          <FormField id="triedTo" label="To date">
            <Input
              id="triedTo"
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
            />
          </FormField>
        </div>

        <TableShell
          caption="What we tried (logs)"
          headers={["Date", "Student", "Intervention", "Type", "Detail", "Notes"]}
          emptyMessage="Nothing logged yet. Start a plan, then record dosage/fidelity/reviews."
          rows={triedRows.map((row) => [
            row.date,
            row.student,
            row.intervention,
            row.kind,
            row.detail,
            row.notes,
          ])}
        />

        <SectionExportBar
          title="What we tried · intervention logs"
          filename={`interventions-tried${studentId ? `-${studentId.slice(0, 8)}` : ""}`}
          headers={["Date", "Student", "Intervention", "Type", "Detail", "Notes"]}
          rows={triedRows.map((row) => [
            row.date,
            row.student,
            row.intervention,
            row.kind,
            row.detail,
            row.notes,
          ])}
          emptyMessage="No logs in this date range yet."
        />

        <TableShell
          caption="Intervention plans on file"
          headers={["Started", "Student", "Plan", "Library item", "Status", "Notes"]}
          emptyMessage="No plans yet."
          rows={planRows}
        />

        <SectionExportBar
          title="Intervention plans"
          filename={`intervention-plans${studentId ? `-${studentId.slice(0, 8)}` : ""}`}
          headers={["Started", "Student", "Plan", "Library item", "Status", "Notes"]}
          rows={planRows}
          emptyMessage="No plans to export yet."
        />
      </div>
    </Card>
  );
}
