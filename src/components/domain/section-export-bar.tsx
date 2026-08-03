"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";
import {
  downloadCsv,
  openCoordinatorEmail,
  printHtmlDocument,
  rowsToCsv,
} from "@/lib/export/download-csv";

export function SectionExportBar({
  title,
  filename,
  headers,
  rows,
  emptyMessage = "Nothing to export yet. Save a record first.",
}: {
  title: string;
  filename: string;
  headers: string[];
  rows: Array<Array<string | number | null | undefined>>;
  emptyMessage?: string;
}) {
  const [email, setEmail] = useState("");
  const disabled = rows.length === 0;

  function exportCsv() {
    if (disabled) return;
    downloadCsv(filename, rowsToCsv(headers, rows));
  }

  function exportPdf() {
    if (disabled) return;
    const table = `<table><thead><tr>${headers
      .map((header) => `<th>${header}</th>`)
      .join("")}</tr></thead><tbody>${rows
      .map(
        (row) =>
          `<tr>${row.map((cell) => `<td>${cell == null ? "" : String(cell)}</td>`).join("")}</tr>`,
      )
      .join("")}</tbody></table>`;
    printHtmlDocument(title, table);
  }

  function emailCoordinator() {
    if (disabled) return;
    exportCsv();
    openCoordinatorEmail({
      to: email,
      subject: `${title} export`,
      body: [
        `Hi,`,
        ``,
        `Please find the ${title} export attached (CSV downloaded to this device — attach that file to this email).`,
        ``,
        `Rows included: ${rows.length}`,
        `Generated: ${new Date().toLocaleString()}`,
        ``,
        `Thank you.`,
      ].join("\n"),
    });
  }

  return (
    <div className="border-border bg-background-elevated space-y-3 rounded-[var(--radius-lg)] border p-4">
      <div>
        <p className="font-semibold">{title} · Export</p>
        <p className="text-muted mt-1 text-sm">
          Download spreadsheet (CSV), print/save PDF, or open email to your coordinator and attach
          the CSV.
        </p>
      </div>
      {disabled ? <p className="text-muted text-sm">{emptyMessage}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" disabled={disabled} onClick={exportCsv}>
          Export Excel/CSV
        </Button>
        <Button type="button" variant="secondary" disabled={disabled} onClick={exportPdf}>
          Print / Save PDF
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <FormField id={`${filename}-email`} label="Coordinator email (optional)">
          <Input
            id={`${filename}-email`}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="coordinator@school.org"
          />
        </FormField>
        <Button type="button" disabled={disabled} onClick={emailCoordinator}>
          Email export
        </Button>
      </div>
    </div>
  );
}
