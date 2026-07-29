"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/forms/form-field";
import { EmptyState } from "@/components/feedback/empty-state";
import { TableShell } from "@/components/data-display/table-shell";
import { ModuleLinkGrid } from "@/components/domain/application-modules";
import { exportAdministrativeSummaryAction } from "@/lib/actions/administrative";
import type { AdministrativeIntelligenceData } from "@/lib/data/administrative";

function metricGroups(view: string) {
  const all = "all";
  const map: Record<string, string[]> = {
    [all]: [],
    organization: [],
    schools: ["active_students", "active_staff", "active_classrooms", "active_iep_cycles", "active_goals"],
    programs: ["active_students", "active_goals", "active_intervention_plans", "active_service_plans"],
    classrooms: ["active_students", "active_goals", "classroom_schedule_changes", "executive_function_plans"],
    caseloads: ["active_students", "active_goals", "goals_with_recent_finalized_data", "goals_without_recent_finalized_data"],
    reporting: [
      "draft_progress_reports",
      "reports_ready_for_review",
      "reports_requiring_changes",
      "finalized_reports",
    ],
    services: ["active_service_plans", "finalized_service_records"],
    accommodations: ["active_accommodations", "accommodation_records_awaiting_finalization"],
    behavior: ["active_behavior_definitions", "behavior_observations_awaiting_finalization"],
    interventions: ["active_intervention_plans", "fidelity_observations"],
    meetings: ["upcoming_meetings", "open_meeting_action_items", "open_family_follow_ups"],
    "data-quality": [
      "goals_without_recent_finalized_data",
      "open_data_quality_warnings",
      "accommodation_records_awaiting_finalization",
      "behavior_observations_awaiting_finalization",
    ],
    audit: [],
  };
  return map[view] ?? [];
}

export function AdministrativeIntelligenceWorkspace({
  data,
  view = "organization",
}: {
  data: AdministrativeIntelligenceData;
  view?: string;
}) {
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const visibleMetrics = useMemo(() => {
    const keys = metricGroups(view);
    if (!keys.length) return data.metrics;
    return data.metrics.filter((metric) => keys.includes(metric.key));
  }, [data.metrics, view]);

  if (!data.canRead) {
    return (
      <EmptyState
        title="Administrative Intelligence unavailable"
        description="Your current role does not include admin.intelligence.read for this organization."
      />
    );
  }

  const filterQuery = new URLSearchParams();
  if (data.filters.schoolId) filterQuery.set("schoolId", data.filters.schoolId);
  if (data.filters.programId) filterQuery.set("programId", data.filters.programId);
  if (data.filters.classroomId) filterQuery.set("classroomId", data.filters.classroomId);
  if (data.filters.startDate) filterQuery.set("startDate", data.filters.startDate);
  if (data.filters.endDate) filterQuery.set("endDate", data.filters.endDate);
  const qs = filterQuery.toString();

  return (
    <div className="space-y-6 print:space-y-4">
      <Alert title="Administrative principles" tone="neutral">
        These dashboards summarize recorded workflow documentation for authorized scopes only. They do not rank
        staff or students, determine legal compliance, or expand access beyond underlying module authorization.
      </Alert>

      <Card className="brand-glow print:border print:shadow-none">
        <CardTitle>Scope and filters</CardTitle>
        <CardDescription>
          {data.scopeLabel}. Date range {data.filters.startDate} to {data.filters.endDate}.
        </CardDescription>
        <form method="get" className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <FormField id="startDate" label="Start date">
            <Input id="startDate" name="startDate" type="date" defaultValue={data.filters.startDate ?? ""} />
          </FormField>
          <FormField id="endDate" label="End date">
            <Input id="endDate" name="endDate" type="date" defaultValue={data.filters.endDate ?? ""} />
          </FormField>
          <FormField id="schoolId" label="School">
            <Select id="schoolId" name="schoolId" defaultValue={data.filters.schoolId ?? ""}>
              <option value="">All authorized schools</option>
              {data.schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField id="programId" label="Program">
            <Select id="programId" name="programId" defaultValue={data.filters.programId ?? ""}>
              <option value="">All authorized programs</option>
              {data.programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField id="classroomId" label="Classroom">
            <Select id="classroomId" name="classroomId" defaultValue={data.filters.classroomId ?? ""}>
              <option value="">All authorized classrooms</option>
              {data.classrooms.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
            </Select>
          </FormField>
          <div className="sm:col-span-2 xl:col-span-5">
            <Button type="submit">Apply filters</Button>
          </div>
        </form>
      </Card>

      <Alert title="Small-group suppression" tone="warning">
        {data.suppressionNotice}
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 print:grid-cols-2">
        {visibleMetrics.map((metric) => (
          <Card key={metric.key} className="motion-safe-rise">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-muted text-xs font-semibold tracking-[0.12em] uppercase">{metric.label}</p>
                <CardTitle className="mt-2 text-2xl tabular-nums">{metric.result.display}</CardTitle>
                <CardDescription>{metric.explanation}</CardDescription>
              </div>
              <Badge tone={metric.result.suppressed ? "warning" : "neutral"}>
                {metric.result.suppressed ? "Suppressed" : "Count"}
              </Badge>
            </div>
            <details className="mt-3">
              <summary className="text-muted cursor-pointer text-sm font-medium">Explain calculation</summary>
              <p className="text-muted mt-2 text-sm">{metric.explanation}</p>
              <p className="text-muted mt-1 text-sm">
                Display value uses privacy suppression when required. Missing source records are shown as “No
                finalized record found,” not zero outcomes.
              </p>
            </details>
          </Card>
        ))}
      </div>

      <Card>
        <CardTitle>Accessible chart alternative</CardTitle>
        <CardDescription>Numeric alternative for the summary chart series.</CardDescription>
        <TableShell
          caption="Administrative metric chart alternative"
          headers={["Metric", "Display value", "Suppressed"]}
          rows={data.chartSeries.map((series) => [
            series.label,
            series.display,
            series.suppressed ? "Yes" : "No",
          ])}
        />
      </Card>

      {view === "audit" ? (
        data.canReadAudit ? (
          data.exportEvents.length ? (
            <TableShell
              caption="Administrative export events"
              headers={["When", "Type", "Scope", "Filters"]}
              rows={data.exportEvents.map((event) => [
                new Date(event.created_at).toLocaleString(),
                event.export_type,
                event.scope_summary,
                JSON.stringify(event.filters),
              ])}
            />
          ) : (
            <EmptyState title="No export events" description="No administrative exports are recorded yet." />
          )
        ) : (
          <Alert title="Audit permission required" tone="warning">
            admin.audit.read is required to view administrative export events.
          </Alert>
        )
      ) : null}

      <ModuleLinkGrid
        links={data.drillDownLinks.map((link) => ({
          ...link,
          href: link.href.includes("?") || !qs || !link.href.startsWith("/administrative-intelligence")
            ? link.href
            : `${link.href}?${qs}`,
        }))}
      />

      <Card>
        <CardTitle>Export controls</CardTitle>
        <CardDescription>
          Exports require current authorization, reuse the visible scope, apply suppression, and record an export
          event. Filenames avoid student identifiers.
        </CardDescription>
        {data.canExport ? (
          <form
            className="mt-4 space-y-3"
            action={(formData) => {
              startTransition(async () => {
                const result = await exportAdministrativeSummaryAction(formData);
                setExportMessage(result.message ?? null);
                setCsvPreview(result.csv ?? null);
                if (result.csv) {
                  const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const anchor = document.createElement("a");
                  anchor.href = url;
                  anchor.download = `slc-admin-summary-${new Date().toISOString().slice(0, 10)}.csv`;
                  anchor.click();
                  URL.revokeObjectURL(url);
                }
              });
            }}
          >
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <input type="hidden" name="schoolId" value={data.filters.schoolId ?? ""} />
            <input type="hidden" name="programId" value={data.filters.programId ?? ""} />
            <input type="hidden" name="classroomId" value={data.filters.classroomId ?? ""} />
            <input type="hidden" name="startDate" value={data.filters.startDate ?? ""} />
            <input type="hidden" name="endDate" value={data.filters.endDate ?? ""} />
            <Button type="submit" disabled={pending}>
              {pending ? "Generating export…" : "Export suppressed summary CSV"}
            </Button>
          </form>
        ) : (
          <Alert title="Export permission required" tone="warning">
            admin.export is required to export administrative summaries.
          </Alert>
        )}
        {exportMessage ? <p className="text-muted mt-3 text-sm">{exportMessage}</p> : null}
        {csvPreview ? (
          <pre className="border-border bg-surface-subtle mt-4 max-h-64 overflow-auto rounded-[var(--radius-md)] border p-3 text-xs">
            {csvPreview}
          </pre>
        ) : null}
      </Card>

      <Card className="print:block">
        <CardTitle>Limitations</CardTitle>
        <ul className="text-muted mt-3 list-disc space-y-1 pl-5 text-sm">
          {data.limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="text-muted mt-3 text-sm">
          Print this view for a print-friendly summary. Protected student narrative content is not included.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 print:hidden">
          <Button type="button" variant="secondary" onClick={() => window.print()}>
            Print-friendly view
          </Button>
          <Link href="/command-center" className="text-highlight text-sm font-medium underline-offset-4 hover:underline">
            Return to Command Center
          </Link>
        </div>
      </Card>
    </div>
  );
}
