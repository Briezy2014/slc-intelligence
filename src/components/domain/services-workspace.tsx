import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/form-field";
import { EmptyState } from "@/components/feedback/empty-state";
import { TableShell } from "@/components/data-display/table-shell";
import {
  AssignStudentServiceForm,
  type ServiceProviderOption,
} from "@/components/domain/assign-student-service-form";
import { ServicePlanLogFields } from "@/components/domain/service-plan-log-fields";
import {
  saveServiceDefinitionAction,
  saveServiceDeliveryLogAction,
  saveServiceReviewAction,
} from "@/lib/actions/services";
import {
  describeDocumentationGap,
  durationMinutesFromStartEnd,
  summarizePlannedVsRecordedMinutes,
} from "@/lib/analytics/service-calculations";
import type { ServicesData } from "@/lib/data/services";
import type { StudentServicePlan } from "@/lib/supabase/types";

export type ServicesView = "dashboard" | "assign" | "logs" | "reviews" | "definitions";

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

function PermissionNote({
  children = "Your current role can view this area but cannot complete this action.",
}: {
  children?: string;
}) {
  return (
    <Alert title="Permission needed" tone="warning">
      {children}
    </Alert>
  );
}

type ServicePlanSnapshot = {
  providerUserId?: string | null;
  providerName?: string | null;
  providerGoals?: string | null;
  notes?: string | null;
  serviceArea?: string | null;
  definitionName?: string | null;
  frequency?: string | null;
  serviceMinutes?: number | null;
  deliveryType?: string | null;
};

function readSnapshot(plan: StudentServicePlan): ServicePlanSnapshot {
  const snap = plan.service_snapshot;
  if (!snap || typeof snap !== "object" || Array.isArray(snap)) return {};
  return snap as ServicePlanSnapshot;
}

export function ServicesWorkspace({
  data,
  studentId,
  view = "dashboard",
}: {
  data: ServicesData;
  studentId?: string;
  view?: ServicesView;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const visibleStudents = studentId
    ? data.students.filter((student) => student.id === studentId)
    : data.students;
  const providers: ServiceProviderOption[] = data.providers;
  const activeDefinitions = data.definitions.filter((item) => item.status === "active");
  const firstPlan = data.plans[0];
  const firstComponent = data.components.find(
    (component) => component.service_plan_id === firstPlan?.id,
  );
  const totals = summarizePlannedVsRecordedMinutes({
    plannedMinutes: data.schedules.reduce<number | null>(
      (sum, schedule) =>
        schedule.planned_duration_minutes == null
          ? sum
          : (sum ?? 0) + schedule.planned_duration_minutes,
      null,
    ),
    recordedMinutes: data.deliveryLogs.reduce<number | null>((sum, log) => {
      const minutes =
        log.calculated_duration_minutes ??
        durationMinutesFromStartEnd(log.start_time, log.end_time);
      return minutes == null ? sum : (sum ?? 0) + minutes;
    }, null),
  });

  const showDashboard = view === "dashboard" || view === "assign";
  const showAssign = view === "dashboard" || view === "assign";
  const showLogs = view === "dashboard" || view === "logs";
  const showReviews = view === "reviews";
  const showDefinitions = view === "definitions";

  return (
    <div className="space-y-6">
      {showDashboard ? (
        <>
          <Alert title="Related services (OT, PT, Speech, APE, and more)" tone="info">
            Use this area to record which related services each student receives, who the provider
            is, provider goals, session notes, and delivery logs. Planned vs recorded minutes are
            descriptive helpers — not compliance certifications.
          </Alert>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardTitle>{data.plans.length}</CardTitle>
              <CardDescription>Student services on file</CardDescription>
            </Card>
            <Card>
              <CardTitle>{totals.recordedMinutes ?? "—"}</CardTitle>
              <CardDescription>Recorded minutes</CardDescription>
            </Card>
            <Card>
              <CardTitle>{activeDefinitions.length}</CardTitle>
              <CardDescription>Service types available</CardDescription>
            </Card>
          </div>
        </>
      ) : null}

      {showAssign ? (
        data.permissions.canManagePlans ? (
          activeDefinitions.length ? (
            <AssignStudentServiceForm
              organizationId={data.organizationId ?? ""}
              students={visibleStudents}
              definitions={activeDefinitions}
              providers={providers}
              defaultStudentId={studentId ?? ""}
              canActivate={data.permissions.canActivatePlans}
            />
          ) : (
            <EmptyState
              title="Service types are still loading"
              description="Refresh the page once — OT, PT, Speech, APE, and other related services should appear in the dropdown. Admins can also add custom types under Definitions."
            />
          )
        ) : (
          <PermissionNote />
        )
      ) : null}

      {showAssign || showDashboard ? (
        data.plans.length ? (
          <TableShell
            caption="Student services"
            headers={[
              "Student",
              "Service",
              "Provider",
              "Goals",
              "Status",
              "Documentation",
            ]}
            emptyMessage="No related services assigned yet."
            rows={data.plans.map((plan) => {
              const student = data.students.find((entry) => entry.id === plan.student_id);
              const definition = data.definitions.find(
                (entry) => entry.id === plan.service_definition_id,
              );
              const snap = readSnapshot(plan);
              const log = data.deliveryLogs.find((entry) => entry.service_plan_id === plan.id);
              const goals = (snap.providerGoals || plan.description || "").trim();
              return [
                student ? studentName(student) : "Authorized student",
                definition?.name ?? plan.title,
                snap.providerName || "Not set",
                goals
                  ? goals.length > 80
                    ? `${goals.slice(0, 80)}…`
                    : goals
                  : "—",
                plan.status.replaceAll("_", " "),
                describeDocumentationGap({
                  recordedMinutes: log?.calculated_duration_minutes ?? null,
                }),
              ];
            })}
          />
        ) : showDashboard ? (
          <EmptyState
            title="No related services yet"
            description="Assign OT, PT, Speech, Adapted PE, or another related service above."
          />
        ) : null
      ) : null}

      {showLogs ? (
        <Card>
          <CardTitle>Log a service session</CardTitle>
          <CardDescription>
            Record that OT/PT/Speech/APE (or another related service) happened — date, minutes, and
            session notes.
          </CardDescription>
          {data.permissions.canEnterLogs && firstPlan ? (
            <form action={submitAction(saveServiceDeliveryLogAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <ServicePlanLogFields
                plans={data.plans}
                students={data.students}
                definitions={data.definitions}
                defaultPlanId={firstPlan.id}
              />
              <input
                type="hidden"
                name="serviceComponentId"
                value={firstComponent?.id ?? ""}
              />
              <FormField id="logProviderUserId" label="Provider who delivered">
                <Select id="logProviderUserId" name="providerUserId" defaultValue="">
                  <option value="">Me (signed-in user)</option>
                  {providers.map((provider) => (
                    <option key={provider.userId} value={provider.userId}>
                      {provider.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="serviceDate" label="Date">
                <Input
                  id="serviceDate"
                  name="serviceDate"
                  type="date"
                  defaultValue={today}
                  required
                />
              </FormField>
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField id="startTime" label="Start">
                  <Input id="startTime" name="startTime" type="time" />
                </FormField>
                <FormField id="endTime" label="End">
                  <Input id="endTime" name="endTime" type="time" />
                </FormField>
              </div>
              <FormField id="logDeliveryType" label="Delivery type">
                <Select id="logDeliveryType" name="deliveryType" defaultValue="pull_out">
                  <option value="pull_out">Pull-out</option>
                  <option value="push_in">Push-in</option>
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="consultation">Consultation</option>
                  <option value="other">Other</option>
                </Select>
              </FormField>
              <FormField id="logServiceStatus" label="Session status">
                <Select id="logServiceStatus" name="serviceStatus" defaultValue="delivered">
                  <option value="delivered">Delivered</option>
                  <option value="partially_delivered">Partially delivered</option>
                  <option value="student_absent">Student absent</option>
                  <option value="provider_absent">Provider absent</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="canceled">Canceled</option>
                  <option value="other">Other</option>
                </Select>
              </FormField>
              <FormField id="logNotes" label="Session notes">
                <Textarea
                  id="logNotes"
                  name="notes"
                  rows={3}
                  placeholder="What happened today / progress on provider goals"
                />
              </FormField>
              <input type="hidden" name="recordStatus" value="draft" />
              <Button type="submit" variant="secondary">
                Save session log
              </Button>
            </form>
          ) : !firstPlan ? (
            <p className="text-muted mt-4 text-sm">
              Assign a related service first, then come back to log sessions.
            </p>
          ) : (
            <PermissionNote />
          )}
        </Card>
      ) : null}

      {showLogs && data.deliveryLogs.length ? (
        <TableShell
          caption="Recent session logs"
          headers={["Date", "Student", "Service", "Status", "Notes"]}
          rows={data.deliveryLogs.slice(0, 25).map((log) => {
            const student = data.students.find((entry) => entry.id === log.primary_student_id);
            const plan = data.plans.find((entry) => entry.id === log.service_plan_id);
            const definition = data.definitions.find(
              (entry) => entry.id === plan?.service_definition_id,
            );
            return [
              log.service_date,
              student ? studentName(student) : "Authorized student",
              definition?.name ?? plan?.title ?? "Service",
              log.service_status.replaceAll("_", " "),
              log.notes
                ? log.notes.length > 60
                  ? `${log.notes.slice(0, 60)}…`
                  : log.notes
                : "—",
            ];
          })}
        />
      ) : null}

      {showReviews ? (
        <Card>
          <CardTitle>Service review</CardTitle>
          <CardDescription>
            Capture a short team review of related-service progress and next steps.
          </CardDescription>
          {data.permissions.canManagePlans && firstPlan ? (
            <form action={submitAction(saveServiceReviewAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <FormField id="reviewServicePlanId" label="Student service">
                <Select
                  id="reviewServicePlanId"
                  name="servicePlanId"
                  defaultValue={firstPlan.id}
                  required
                >
                  {data.plans.map((plan) => {
                    const student = data.students.find((entry) => entry.id === plan.student_id);
                    return (
                      <option key={plan.id} value={plan.id}>
                        {(student ? studentName(student) : "Student") + " · " + plan.title}
                      </option>
                    );
                  })}
                </Select>
              </FormField>
              <FormField id="reviewStudentId" label="Student">
                <Select
                  id="reviewStudentId"
                  name="studentId"
                  defaultValue={firstPlan.student_id}
                  required
                >
                  {visibleStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {studentName(student)}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="reviewDate" label="Review date">
                <Input id="reviewDate" name="reviewDate" type="date" defaultValue={today} required />
              </FormField>
              <FormField id="reviewSummary" label="Summary">
                <Textarea id="reviewSummary" name="reviewSummary" rows={4} required />
              </FormField>
              <FormField id="reviewRecommendation" label="Recommendation">
                <Textarea id="reviewRecommendation" name="recommendation" rows={2} />
              </FormField>
              <FormField id="nextReviewDate" label="Next review date">
                <Input id="nextReviewDate" name="nextReviewDate" type="date" />
              </FormField>
              <Button type="submit" variant="secondary">
                Save review
              </Button>
            </form>
          ) : !firstPlan ? (
            <p className="text-muted mt-4 text-sm">Assign a related service before adding a review.</p>
          ) : (
            <PermissionNote />
          )}
          {data.reviews.length ? (
            <div className="mt-6">
              <TableShell
                caption="Reviews"
                headers={["Date", "Student", "Summary"]}
                rows={data.reviews.map((review) => {
                  const student = data.students.find((entry) => entry.id === review.student_id);
                  return [
                    review.review_date,
                    student ? studentName(student) : "Authorized student",
                    review.review_summary.length > 80
                      ? `${review.review_summary.slice(0, 80)}…`
                      : review.review_summary,
                  ];
                })}
              />
            </div>
          ) : null}
        </Card>
      ) : null}

      {showDefinitions ? (
        <Card>
          <CardTitle>Service types (definitions)</CardTitle>
          <CardDescription>
            Optional admin area. OT, PT, Speech, APE, and common related services load automatically.
            Add a custom type only if something is missing.
          </CardDescription>
          {data.permissions.canManageDefinitions ? (
            <form action={submitAction(saveServiceDefinitionAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <FormField id="serviceName" label="Name">
                <Input id="serviceName" name="name" required placeholder="e.g. Music therapy" />
              </FormField>
              <FormField id="serviceArea" label="Short label / area">
                <Input id="serviceArea" name="serviceArea" required placeholder="e.g. Music" />
              </FormField>
              <FormField id="serviceDescription" label="Description">
                <Textarea id="serviceDescription" name="description" rows={2} />
              </FormField>
              <FormField id="defaultDeliveryType" label="Default delivery type">
                <Select id="defaultDeliveryType" name="defaultDeliveryType" defaultValue="pull_out">
                  <option value="pull_out">Pull-out</option>
                  <option value="push_in">Push-in</option>
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="consultation">Consultation</option>
                  <option value="other">Other</option>
                </Select>
              </FormField>
              <input type="hidden" name="status" value="active" />
              <Button type="submit">Save custom service type</Button>
            </form>
          ) : (
            <PermissionNote />
          )}
          {data.definitions.length ? (
            <div className="mt-6">
              <TableShell
                caption="Available service types"
                headers={["Name", "Area", "Default delivery", "Status"]}
                rows={data.definitions.map((definition) => [
                  definition.name,
                  definition.service_area,
                  (definition.default_delivery_type ?? "—").replaceAll("_", " "),
                  definition.status,
                ])}
              />
            </div>
          ) : null}
        </Card>
      ) : null}

      {showDashboard ? (
        <Alert title="Planned vs recorded minutes" tone="info">
          {totals.disclaimer}
        </Alert>
      ) : null}
    </div>
  );
}
