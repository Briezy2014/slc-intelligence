import { AiAssistPanel } from "@/components/domain/ai-assist-panel";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/form-field";
import { EmptyState } from "@/components/feedback/empty-state";
import { TableShell } from "@/components/data-display/table-shell";
import { PermissionDeniedState } from "@/components/domain/page-states";
import {
  addEvidenceLinkAction,
  correctReportAction,
  createProgressReportAction,
  finalizeReportAction,
  recordReportExportAction,
  saveReportingPeriodAction,
  saveReportSectionAction,
  submitReportForReviewAction,
} from "@/lib/actions/reporting";
import { finalizeBehaviorObservationAction, saveFbaWorkspaceAction } from "@/lib/actions/behavior";
import {
  addInterventionComponentAction,
  saveDosageLogAction,
  saveFidelityObservationAction,
  saveInterventionLibraryItemAction,
  saveInterventionPlanAction,
  saveInterventionReviewAction,
} from "@/lib/actions/interventions";
import type { BehaviorData } from "@/lib/data/behavior";
import type { InterventionData } from "@/lib/data/interventions";
import type { ReportingData } from "@/lib/data/reporting";
import {
  componentFidelity,
  fidelityPercent,
  plannedVsDelivered,
} from "@/lib/analytics/intervention-calculations";
import { observationMethodLabel } from "@/lib/catalogs/behavior-templates";

function submitAction(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
}

function studentName(data: {
  first_name: string;
  last_name: string;
  preferred_name: string | null;
}) {
  return `${data.last_name}, ${data.preferred_name || data.first_name}`;
}

function statusBadge(status: string) {
  const tone =
    status === "active" || status === "finalized"
      ? "success"
      : status === "draft"
        ? "warning"
        : "neutral";
  return <Badge tone={tone}>{status.replaceAll("_", " ")}</Badge>;
}

export { PermissionDeniedState } from "@/components/domain/page-states";

export function DataReadinessPanel({
  title = "Data readiness",
  status,
  reason,
}: {
  title?: string;
  status: string;
  reason: string;
}) {
  return (
    <Alert title={title} tone={status === "sufficient" || status === "ok" ? "success" : "warning"}>
      {reason}
    </Alert>
  );
}

export function ReportingPeriodForm({ organizationId }: { organizationId: string }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <form action={submitAction(saveReportingPeriodAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="name" label="Period name">
          <Input id="name" name="name" required placeholder="Quarter 1" />
        </FormField>
        <FormField id="academicYear" label="Academic year">
          <Input id="academicYear" name="academicYear" required placeholder="2026-2027" />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="startDate" label="Start date">
          <Input id="startDate" name="startDate" type="date" required defaultValue={today} />
        </FormField>
        <FormField id="endDate" label="End date">
          <Input id="endDate" name="endDate" type="date" required defaultValue={today} />
        </FormField>
        <FormField id="dueDate" label="Due date">
          <Input id="dueDate" name="dueDate" type="date" />
        </FormField>
      </div>
      <input type="hidden" name="status" value="active" />
      <Button type="submit">Create reporting period</Button>
    </form>
  );
}

export function ReportCreateForm({ data }: { data: ReportingData }) {
  if (!data.permissions.canDraft)
    return (
      <PermissionDeniedState message="Draft report permission is required to create reports." />
    );
  return (
    <form action={submitAction(createProgressReportAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
      <FormField id="studentId" label="Student">
        <Select id="studentId" name="studentId" required>
          <option value="">Choose student</option>
          {data.students.map((student) => (
            <option key={student.id} value={student.id}>
              {studentName(student)}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField id="iepCycleId" label="IEP cycle">
        <Select id="iepCycleId" name="iepCycleId" required>
          <option value="">Choose cycle</option>
          {data.cycles.map((cycle) => (
            <option key={cycle.id} value={cycle.id}>
              {cycle.label}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField id="reportingPeriodId" label="Reporting period">
        <Select id="reportingPeriodId" name="reportingPeriodId" required>
          <option value="">Choose period</option>
          {data.periods.map((period) => (
            <option key={period.id} value={period.id}>
              {period.name} ({period.academic_year})
            </option>
          ))}
        </Select>
      </FormField>
      <Button type="submit">Create report draft</Button>
    </form>
  );
}

export function ReportingTables({ data }: { data: ReportingData }) {
  return (
    <div className="space-y-6">
      {data.periods.length ? (
        <TableShell
          caption="Reporting periods"
          headers={["Name", "Academic year", "Dates", "Status"]}
          rows={data.periods.map((period) => [
            period.name,
            period.academic_year,
            `${period.start_date} to ${period.end_date}`,
            period.status,
          ])}
        />
      ) : (
        <EmptyState
          title="No reporting periods"
          description="Create a period before drafting progress reports."
        />
      )}
      {data.reports.length ? (
        <TableShell
          caption="Progress reports"
          headers={["Report", "Student", "Period", "Status", "Updated"]}
          rows={data.reports.map((report) => {
            const student = data.students.find((entry) => entry.id === report.student_id);
            const period = data.periods.find((entry) => entry.id === report.reporting_period_id);
            return [
              `Report ${report.version_number} - ${report.id.slice(0, 8)}`,
              student ? studentName(student) : "Authorized student",
              period?.name ?? "Authorized period",
              report.status.replaceAll("_", " "),
              new Date(report.updated_at).toLocaleDateString(),
            ];
          })}
        />
      ) : (
        <EmptyState
          title="No progress reports"
          description="No authorized reports match the current scope."
        />
      )}
    </div>
  );
}

export function ReportDetail({ data, reportId }: { data: ReportingData; reportId: string }) {
  const report = data.reports.find((entry) => entry.id === reportId);
  if (!report)
    return (
      <EmptyState
        title="Report not found"
        description="The report was not found in your authorized scope."
      />
    );
  const sections = data.sections.filter((section) => section.report_id === report.id);
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Progress report</CardTitle>
            <CardDescription>
              Version {report.version_number}. System summaries are drafts requiring educator
              review.
            </CardDescription>
          </div>
          {statusBadge(report.status)}
        </div>
      </Card>
      <div className="flex flex-wrap gap-2">
        {data.permissions.canDraft ? (
          <form action={submitAction(submitReportForReviewAction)}>
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <input type="hidden" name="reportId" value={report.id} />
            <Button type="submit" variant="secondary">
              Submit for review
            </Button>
          </form>
        ) : null}
        {data.permissions.canFinalize ? (
          <>
            <form action={submitAction(finalizeReportAction)}>
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <input type="hidden" name="reportId" value={report.id} />
              <Button type="submit">Finalize</Button>
            </form>
            <form action={submitAction(correctReportAction)}>
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <input type="hidden" name="reportId" value={report.id} />
              <input type="hidden" name="note" value="Correction recorded from report detail." />
              <Button type="submit" variant="secondary">
                Record correction
              </Button>
            </form>
          </>
        ) : null}
        {data.permissions.canExport ? (
          <form action={submitAction(recordReportExportAction)}>
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <input type="hidden" name="reportId" value={report.id} />
            <input type="hidden" name="exportFormat" value="print" />
            <Button type="submit" variant="secondary">
              Record print export
            </Button>
          </form>
        ) : null}
      </div>
      {sections.map((section) => (
        <Card key={section.id}>
          <CardTitle>
            {data.goals.find((goal) => goal.id === section.goal_id)?.goal_area ?? "Goal section"}
          </CardTitle>
          <CardDescription>{section.system_summary_label}</CardDescription>
          <p className="text-muted mt-3 text-sm">
            {section.system_summary_draft ?? "No system draft has been generated for this section."}
          </p>
          <form action={submitAction(saveReportSectionAction)} className="mt-4 space-y-3">
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <input type="hidden" name="sectionId" value={section.id} />
            <input type="hidden" name="reportId" value={report.id} />
            <input type="hidden" name="studentId" value={report.student_id} />
            <FormField id={`educatorNarrative-${section.id}`} label="Educator-reviewed narrative">
              <Textarea
                id={`educatorNarrative-${section.id}`}
                name="educatorNarrative"
                defaultValue={section.educator_narrative ?? ""}
              />
            </FormField>
            <FormField id={`dataSufficiencyStatus-${section.id}`} label="Data sufficiency">
              <Select
                id={`dataSufficiencyStatus-${section.id}`}
                name="dataSufficiencyStatus"
                defaultValue={section.data_sufficiency_status}
              >
                <option value="not_reviewed">Not reviewed</option>
                <option value="sufficient">Sufficient</option>
                <option value="limited">Limited</option>
                <option value="insufficient">Insufficient</option>
              </Select>
            </FormField>
            <Button type="submit" variant="secondary">
              Save section
            </Button>
          </form>
          <EvidenceSection data={data} sectionId={section.id} reportId={report.id} />
        </Card>
      ))}
    </div>
  );
}

export function EvidenceSection({
  data,
  sectionId,
  reportId,
}: {
  data: ReportingData;
  sectionId: string;
  reportId: string;
}) {
  const evidence = data.evidence.filter((entry) => entry.section_id === sectionId);
  return (
    <div className="border-border mt-4 rounded-[var(--radius-lg)] border p-4">
      <h3 className="font-semibold">Evidence</h3>
      {evidence.length ? (
        <ul className="text-muted mt-2 list-disc space-y-1 pl-5 text-sm">
          {evidence.map((entry) => (
            <li key={entry.id}>
              {entry.label} ({entry.evidence_type.replaceAll("_", " ")})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted mt-2 text-sm">No evidence links have been added.</p>
      )}
      {data.permissions.canDraft ? (
        <form
          action={submitAction(addEvidenceLinkAction)}
          className="mt-4 grid gap-3 sm:grid-cols-[1fr_180px_auto]"
        >
          <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
          <input type="hidden" name="sectionId" value={sectionId} />
          <input type="hidden" name="reportId" value={reportId} />
          <Input aria-label="Evidence label" name="label" placeholder="Evidence label" required />
          <Select aria-label="Evidence type" name="evidenceType" defaultValue="analytics_range">
            <option value="session">Session</option>
            <option value="data_point">Data point</option>
            <option value="baseline">Baseline</option>
            <option value="intervention_phase">Intervention phase</option>
            <option value="analytics_range">Analytics range</option>
          </Select>
          <Button type="submit" variant="secondary">
            Add
          </Button>
        </form>
      ) : null}
    </div>
  );
}

export function ReportPrintView({ data, reportId }: { data: ReportingData; reportId: string }) {
  const report = data.reports.find((entry) => entry.id === reportId);
  if (!report)
    return (
      <EmptyState
        title="Report not found"
        description="The report was not found in your authorized scope."
      />
    );
  const sections = data.sections.filter((section) => section.report_id === report.id);
  return (
    <article className="print:bg-white print:text-black">
      <style>{`@media print {.no-print{display:none}.draft-watermark{display:block;position:fixed;inset:35% auto auto 20%;font-size:6rem;opacity:.12;transform:rotate(-24deg)}} @media screen {.draft-watermark{display:none}}`}</style>
      {report.status !== "finalized" ? (
        <div className="draft-watermark" aria-hidden="true">
          Draft
        </div>
      ) : null}
      <Card className="print:shadow-none">
        <CardTitle>Progress report print view</CardTitle>
        <CardDescription>Draft reports require educator review before sharing.</CardDescription>
      </Card>
      <div className="mt-6 space-y-4">
        {sections.map((section) => (
          <section key={section.id} className="break-inside-avoid">
            <h2 className="text-lg font-semibold">
              {data.goals.find((goal) => goal.id === section.goal_id)?.goal_area ?? "Goal"}
            </h2>
            <p className="mt-2 text-sm">
              {section.educator_narrative ||
                section.system_summary_draft ||
                "No narrative entered."}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}

export {
  BehaviorDefinitionForm,
  BehaviorObservationForm,
  BehaviorQuickStart,
} from "@/components/domain/behavior-forms";

export function BehaviorDashboard({ data, studentId }: { data: BehaviorData; studentId?: string }) {
  const filteredDefinitions = studentId
    ? data.definitions.filter((definition) => definition.student_id === studentId)
    : data.definitions;
  const filteredSessions = studentId
    ? data.sessions.filter((session) => session.student_id === studentId)
    : data.sessions;

  return (
    <div className="space-y-6">
      <TableShell
        caption="Saved behaviors"
        headers={["Behavior", "Student", "Status"]}
        emptyMessage="No saved behaviors yet."
        rows={filteredDefinitions.map((definition) => {
          const student = data.students.find((entry) => entry.id === definition.student_id);
          return [definition.name, student ? studentName(student) : "Student", definition.status];
        })}
      />
      <TableShell
        caption="Recent observations"
        headers={["Date", "What you recorded", "Where", "Activity", "Status"]}
        emptyMessage="No observations yet."
        rows={filteredSessions.map((session) => [
          session.session_date,
          observationMethodLabel(session.measurement_method),
          session.setting ?? "—",
          session.activity ?? "—",
          session.status,
        ])}
      />
      {data.permissions.canFinalize
        ? filteredSessions
            .filter((session) => session.status === "draft")
            .slice(0, 3)
            .map((session) => (
              <form
                key={session.id}
                action={submitAction(finalizeBehaviorObservationAction)}
                className="flex gap-2"
              >
                <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
                <input type="hidden" name="sessionId" value={session.id} />
                <input type="hidden" name="studentId" value={session.student_id} />
                <Button type="submit" variant="secondary" size="sm">
                  Mark {session.session_date} final
                </Button>
              </form>
            ))
        : null}
      <details className="border-border rounded-[var(--radius-lg)] border p-4">
        <summary className="cursor-pointer text-sm font-semibold">
          Team review notes (optional)
        </summary>
        <div className="mt-4">
          <FbaWorkspaceForm data={data} studentId={studentId} />
        </div>
      </details>
    </div>
  );
}

export function FbaWorkspaceForm({ data, studentId }: { data: BehaviorData; studentId?: string }) {
  if (!data.permissions.canManageFba) return null;
  const today = new Date().toISOString().slice(0, 10);
  return (
    <Card>
      <CardTitle>Team review notes</CardTitle>
      <CardDescription>
        Optional place to keep team notes. Your team still writes any hypothesis language.
      </CardDescription>
      <form action={submitAction(saveFbaWorkspaceAction)} className="mt-4 space-y-4">
        <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
        <FormField id="fbaStudentId" label="Student">
          <Select id="fbaStudentId" name="studentId" required defaultValue={studentId ?? ""}>
            <option value="">Choose student</option>
            {data.students.map((student) => (
              <option key={student.id} value={student.id}>
                {studentName(student)}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField id="behaviorDefinitionIdFba" label="Behavior definition">
          <Select id="behaviorDefinitionIdFba" name="behaviorDefinitionId" required>
            <option value="">Choose behavior</option>
            {data.definitions.map((definition) => (
              <option key={definition.id} value={definition.id}>
                {definition.name}
              </option>
            ))}
          </Select>
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="dateRangeStart" label="Start date">
            <Input
              id="dateRangeStart"
              name="dateRangeStart"
              type="date"
              required
              defaultValue={today}
            />
          </FormField>
          <FormField id="dateRangeEnd" label="End date">
            <Input
              id="dateRangeEnd"
              name="dateRangeEnd"
              type="date"
              required
              defaultValue={today}
            />
          </FormField>
        </div>
        <input type="hidden" name="status" value="draft" />
        <FormField id="educatorHypothesis" label="Educator/team hypothesis">
          <Textarea id="educatorHypothesis" name="educatorHypothesis" />
        </FormField>
        <Button type="submit">Save FBA workspace</Button>
      </form>
    </Card>
  );
}

export function InterventionLibraryForm({ data }: { data: InterventionData }) {
  if (!data.permissions.canManageLibrary)
    return <PermissionDeniedState message="Library manage permission is required." />;
  return (
    <form action={submitAction(saveInterventionLibraryItemAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
      <FormField id="name" label="Name">
        <Input id="name" name="name" required />
      </FormField>
      <FormField id="category" label="Category">
        <Input id="category" name="category" />
      </FormField>
      <FormField id="description" label="Description">
        <Textarea id="description" name="description" required />
      </FormField>
      <FormField id="evidenceLevel" label="Evidence level">
        <Select id="evidenceLevel" name="evidenceLevel" defaultValue="promising">
          <option value="evidence_based">Evidence based</option>
          <option value="promising">Promising</option>
          <option value="emerging">Emerging</option>
          <option value="local_practice">Local practice</option>
          <option value="other">Other</option>
        </Select>
      </FormField>
      <input type="hidden" name="status" value="active" />
      <Button type="submit">Save library item</Button>
    </form>
  );
}

export function InterventionPlanForm({
  data,
  studentId,
}: {
  data: InterventionData;
  studentId?: string;
}) {
  if (!data.permissions.canManagePlans)
    return <PermissionDeniedState message="Plan manage permission is required." />;
  return (
    <form action={submitAction(saveInterventionPlanAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
      <FormField id="studentId" label="1. Which student?">
        <Select id="studentId" name="studentId" required defaultValue={studentId ?? ""}>
          <option value="">Choose student</option>
          {data.students.map((student) => (
            <option key={student.id} value={student.id}>
              {studentName(student)}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField id="libraryItemId" label="2. Which intervention from the library?">
        <Select id="libraryItemId" name="libraryItemId">
          <option value="">Custom (type a title below)</option>
          {data.libraryItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField id="title" label="Plan title">
        <Input
          id="title"
          name="title"
          required
          placeholder="Can match the library name or be student-specific"
        />
      </FormField>
      <FormField id="description" label="Notes (optional)">
        <Textarea
          id="description"
          name="description"
          placeholder="What this looks like for this student"
        />
      </FormField>
      <input type="hidden" name="status" value="draft" />
      <Button type="submit">Save intervention plan</Button>
    </form>
  );
}

export function InterventionDashboard({
  data,
  focus = "all",
}: {
  data: InterventionData;
  focus?: "all" | "library" | "plans";
}) {
  const fidelity = fidelityPercent(
    data.fidelityResponses.map((response) => ({ response: response.response })),
  );
  const dosage = plannedVsDelivered(
    { plannedSessions: null, plannedMinutes: null },
    data.dosageLogs.map((log) => ({
      sessionsDelivered: log.sessions_delivered,
      durationMinutes: log.duration_minutes,
    })),
  );
  const showPlans = focus === "all" || focus === "plans";
  const showLibrary = focus === "all" || focus === "library";
  return (
    <div className="space-y-6">
      {showPlans ? (
        <>
          <DataReadinessPanel
            status={fidelity.sufficiency.status}
            reason={fidelity.sufficiency.reason}
          />
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardTitle>{data.plans.length}</CardTitle>
              <CardDescription>Intervention plans</CardDescription>
            </Card>
            <Card>
              <CardTitle>{fidelity.percent ?? "Not available"}%</CardTitle>
              <CardDescription>Scored fidelity</CardDescription>
            </Card>
            <Card>
              <CardTitle>{dosage.deliveredSessions}</CardTitle>
              <CardDescription>Delivered sessions logged</CardDescription>
            </Card>
          </div>
          <TableShell
            caption="Intervention plans"
            headers={["Plan", "Student", "Status", "Dates"]}
            emptyMessage="No plans yet. Use Start a plan above."
            rows={data.plans.map((plan) => {
              const student = data.students.find((entry) => entry.id === plan.student_id);
              return [
                plan.title,
                student ? studentName(student) : "Authorized student",
                plan.status,
                `${plan.start_date ?? "Not set"} to ${plan.end_date ?? "Not set"}`,
              ];
            })}
          />
        </>
      ) : null}
      {showLibrary ? (
        <TableShell
          caption="Intervention library"
          headers={["Name", "Category", "Evidence level", "Status"]}
          emptyMessage="Library is filling automatically. Refresh under Organization settings if this stays empty."
          rows={data.libraryItems.map((item) => [
            item.name,
            item.category ?? "Not set",
            item.evidence_level.replaceAll("_", " "),
            item.status,
          ])}
        />
      ) : null}
      {showPlans ? (
        <TableShell
          caption="Component fidelity"
          headers={["Component", "Percent", "Scored items"]}
          emptyMessage="Fidelity appears after you log it on a student intervention plan."
          rows={Object.entries(
            componentFidelity(
              data.fidelityResponses.map((response) => ({ response: response.response })),
            ),
          ).map(([component, result]) => [
            component,
            result.percent === null ? "Not available" : String(result.percent),
            String(result.scoredItems),
          ])}
        />
      ) : null}
      {focus === "all" ? (
        <AiAssistPanel
          domain="intervention"
          title="AI Assist · Interventions"
          description="Optional draft help for plan wording — you still choose what to save."
        />
      ) : null}
    </div>
  );
}

export function InterventionEvidenceForms({
  data,
  planId,
  focus = "all",
}: {
  data: InterventionData;
  planId?: string;
  focus?: "all" | "fidelity" | "dosage" | "reviews";
}) {
  const plan = planId ? data.plans.find((entry) => entry.id === planId) : data.plans[0];
  if (!plan)
    return (
      <EmptyState
        title="No intervention plan selected"
        description="Create a plan before adding fidelity, dosage, or review records."
      />
    );
  const today = new Date().toISOString().slice(0, 10);
  const showDosage = focus === "all" || focus === "dosage";
  const showFidelity = focus === "all" || focus === "fidelity";
  const showReviews = focus === "all" || focus === "reviews";
  const showComponent = focus === "all";
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {showComponent ? (
        <Card>
          <CardTitle>Component</CardTitle>
          <form action={submitAction(addInterventionComponentAction)} className="mt-4 space-y-3">
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <input type="hidden" name="planId" value={plan.id} />
            <FormField id="componentLabel" label="Label">
              <Input id="componentLabel" name="label" required />
            </FormField>
            <FormField id="componentDescription" label="Description">
              <Textarea id="componentDescription" name="description" required />
            </FormField>
            <input type="hidden" name="sortOrder" value="1" />
            <Button type="submit" variant="secondary">
              Add component
            </Button>
          </form>
        </Card>
      ) : null}
      {showDosage ? (
        <Card>
          <CardTitle>Dosage log</CardTitle>
          <form action={submitAction(saveDosageLogAction)} className="mt-4 space-y-3">
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <input type="hidden" name="planId" value={plan.id} />
            <input type="hidden" name="studentId" value={plan.student_id} />
            <FormField id="logDate" label="Date">
              <Input id="logDate" name="logDate" type="date" defaultValue={today} required />
            </FormField>
            <FormField id="sessionsDelivered" label="Sessions delivered">
              <Input
                id="sessionsDelivered"
                name="sessionsDelivered"
                type="number"
                min="0"
                defaultValue="1"
              />
            </FormField>
            <FormField id="durationMinutes" label="Minutes">
              <Input
                id="durationMinutes"
                name="durationMinutes"
                type="number"
                min="0"
                defaultValue="0"
              />
            </FormField>
            <Button type="submit" variant="secondary">
              Add dosage
            </Button>
          </form>
        </Card>
      ) : null}
      {showFidelity ? (
        <Card>
          <CardTitle>Fidelity observation</CardTitle>
          <form action={submitAction(saveFidelityObservationAction)} className="mt-4 space-y-3">
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <input type="hidden" name="planId" value={plan.id} />
            <input type="hidden" name="studentId" value={plan.student_id} />
            <FormField id="checklistId" label="Checklist">
              <Select id="checklistId" name="checklistId" required>
                <option value="">Choose checklist</option>
                {data.checklists
                  .filter((checklist) => checklist.plan_id === plan.id)
                  .map((checklist) => (
                    <option key={checklist.id} value={checklist.id}>
                      {checklist.title}
                    </option>
                  ))}
              </Select>
            </FormField>
            <FormField id="observationDate" label="Date">
              <Input
                id="observationDate"
                name="observationDate"
                type="date"
                defaultValue={today}
                required
              />
            </FormField>
            <input type="hidden" name="status" value="draft" />
            <Button type="submit" variant="secondary">
              Save fidelity
            </Button>
          </form>
        </Card>
      ) : null}
      {showReviews ? (
        <Card>
          <CardTitle>Review</CardTitle>
          <form action={submitAction(saveInterventionReviewAction)} className="mt-4 space-y-3">
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <input type="hidden" name="planId" value={plan.id} />
            <input type="hidden" name="studentId" value={plan.student_id} />
            <FormField id="reviewDate" label="Review date">
              <Input id="reviewDate" name="reviewDate" type="date" defaultValue={today} required />
            </FormField>
            <FormField id="summary" label="Summary">
              <Textarea id="summary" name="summary" required />
            </FormField>
            <FormField id="outcome" label="Outcome">
              <Select id="outcome" name="outcome" defaultValue="continue">
                <option value="continue">Continue</option>
                <option value="revise">Revise</option>
                <option value="pause">Pause</option>
                <option value="complete">Complete</option>
                <option value="discontinue">Discontinue</option>
              </Select>
            </FormField>
            <Button type="submit" variant="secondary">
              Save review
            </Button>
          </form>
        </Card>
      ) : null}
    </div>
  );
}

export { ModuleLinkGrid } from "@/components/navigation/module-link-grid";
