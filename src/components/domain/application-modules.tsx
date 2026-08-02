import Link from "next/link";
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
  saveAccommodationImplementationLogAction,
  saveAccommodationLibraryItemAction,
  saveStudentAccommodationAction,
} from "@/lib/actions/accommodations";
import { recordFamilyCommunicationExportAction } from "@/lib/actions/communications";
import { ContactAndCommunicationForms } from "@/components/domain/communication-workspace-forms";
import { CommunicationEsignPanel } from "@/components/domain/communication-esign-panel";
import { StaffNotificationsPanel } from "@/components/domain/staff-notifications-panel";
import { communicationLanguageLabel } from "@/lib/catalogs/communication-languages";
import { AiAssistPanel } from "@/components/domain/ai-assist-panel";
import {
  saveMeetingAction,
  addMeetingParticipantAction,
  recordMeetingAcknowledgementAction,
} from "@/lib/actions/meetings";
import {
  addServiceComponentAction,
  saveServiceDefinitionAction,
  saveServiceDeliveryLogAction,
  saveServicePlanAction,
} from "@/lib/actions/services";
import {
  saveChecklistResponseAction,
  saveExecutiveFunctionObservationAction,
  saveExecutiveFunctionPlanAction,
} from "@/lib/actions/executive-function";
import {
  independencePercent,
  promptDistribution,
} from "@/lib/analytics/executive-function-calculations";
import {
  describeDocumentationGap,
  durationMinutesFromStartEnd,
  summarizePlannedVsRecordedMinutes,
} from "@/lib/analytics/service-calculations";
import type { AccommodationsData } from "@/lib/data/accommodations";
import type { CommunicationsData } from "@/lib/data/communications";
import type { ExecutiveFunctionData } from "@/lib/data/executive-function";
import type { MeetingsData } from "@/lib/data/meetings";
import type { ServicesData } from "@/lib/data/services";

export { ClassroomOperationsWorkspace } from "@/components/domain/classroom-operations-workspace";
export type { ClassroomOpsSection } from "@/components/domain/classroom-operations-workspace";

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

export function PermissionNote({
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

export function ModuleLinkGrid({
  links,
}: {
  links: Array<{ href: string; label: string; description: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="border-border bg-background-elevated hover:border-highlight/50 rounded-[var(--radius-lg)] border p-4 transition-colors"
        >
          <p className="font-semibold">{link.label}</p>
          <p className="text-muted mt-1 text-sm">{link.description}</p>
        </Link>
      ))}
    </div>
  );
}

export function AccommodationsWorkspace({
  data,
  studentId,
}: {
  data: AccommodationsData;
  studentId?: string;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const visibleStudents = studentId
    ? data.students.filter((student) => student.id === studentId)
    : data.students;
  const firstAccommodation = data.accommodations[0];
  return (
    <div className="space-y-6">
      <Alert title="Accommodation records are descriptive" tone="info">
        These records document planned and implemented supports. They do not determine legal
        compliance.
      </Alert>
      <AiAssistPanel
        domain="accommodation"
        title="AI Assist · Accommodations"
        description="Suggest accommodation language and implementation notes for educator review."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Accommodation library</CardTitle>
          <CardDescription>Reusable support descriptions for authorized staff.</CardDescription>
          {data.permissions.canManageLibrary ? (
            <form
              action={submitAction(saveAccommodationLibraryItemAction)}
              className="mt-4 space-y-3"
            >
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <FormField id="accommodationLibraryName" label="Name">
                <Input id="accommodationLibraryName" name="name" required />
              </FormField>
              <FormField id="accommodationArea" label="Area">
                <Input id="accommodationArea" name="accommodationArea" />
              </FormField>
              <FormField id="accommodationDescription" label="Description">
                <Textarea id="accommodationDescription" name="description" required />
              </FormField>
              <Button type="submit">Save library item</Button>
            </form>
          ) : (
            <PermissionNote />
          )}
        </Card>
        <Card>
          <CardTitle>Student accommodation</CardTitle>
          <CardDescription>Create a student-scoped support record.</CardDescription>
          {data.permissions.canManageAccommodations ? (
            <form action={submitAction(saveStudentAccommodationAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <FormField id="studentId" label="Student">
                <Select id="studentId" name="studentId" defaultValue={studentId ?? ""} required>
                  <option value="">Choose student</option>
                  {visibleStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {studentName(student)}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="libraryItemId" label="Library item">
                <Select id="libraryItemId" name="libraryItemId">
                  <option value="">Custom accommodation</option>
                  {data.libraryItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="accommodationTitle" label="Title">
                <Input id="accommodationTitle" name="title" required />
              </FormField>
              <FormField id="studentAccommodationDescription" label="Description">
                <Textarea id="studentAccommodationDescription" name="description" required />
              </FormField>
              <input type="hidden" name="status" value="draft" />
              <Button type="submit">Save accommodation</Button>
            </form>
          ) : (
            <PermissionNote />
          )}
        </Card>
      </div>
      {firstAccommodation && data.permissions.canImplement ? (
        <Card>
          <CardTitle>Implementation log</CardTitle>
          <form
            action={submitAction(saveAccommodationImplementationLogAction)}
            className="mt-4 grid gap-3 md:grid-cols-2"
          >
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <input type="hidden" name="accommodationId" value={firstAccommodation.id} />
            <input type="hidden" name="studentId" value={firstAccommodation.student_id} />
            <FormField id="logDate" label="Date">
              <Input id="logDate" name="logDate" type="date" defaultValue={today} required />
            </FormField>
            <FormField id="implementationStatus" label="Status">
              <Select
                id="implementationStatus"
                name="implementationStatus"
                defaultValue="implemented"
              >
                <option value="implemented">Implemented</option>
                <option value="partially_implemented">Partially implemented</option>
                <option value="not_implemented">Not implemented</option>
                <option value="not_applicable">Not applicable</option>
                <option value="student_declined">Student declined</option>
              </Select>
            </FormField>
            <FormField id="setting" label="Setting">
              <Input id="setting" name="setting" />
            </FormField>
            <input type="hidden" name="status" value="draft" />
            <Button type="submit" variant="secondary">
              Record implementation
            </Button>
          </form>
        </Card>
      ) : null}
      {data.accommodations.length ? (
        <TableShell
          caption="Student accommodations"
          headers={["Title", "Student", "Status", "Dates"]}
          rows={data.accommodations.map((item) => {
            const student = data.students.find((entry) => entry.id === item.student_id);
            return [
              item.title,
              student ? studentName(student) : "Authorized student",
              item.status,
              `${item.start_date ?? "Not set"} to ${item.end_date ?? "Not set"}`,
            ];
          })}
        />
      ) : (
        <EmptyState
          title="No accommodations"
          description="No authorized accommodations match this scope."
        />
      )}
    </div>
  );
}

export function ServicesWorkspace({ data, studentId }: { data: ServicesData; studentId?: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const visibleStudents = studentId
    ? data.students.filter((student) => student.id === studentId)
    : data.students;
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
  return (
    <div className="space-y-6">
      <Alert title="Planned vs recorded disclosure" tone="info">
        {totals.disclaimer}
      </Alert>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardTitle>{data.plans.length}</CardTitle>
          <CardDescription>Service plans</CardDescription>
        </Card>
        <Card>
          <CardTitle>{totals.recordedMinutes ?? "Unavailable"}</CardTitle>
          <CardDescription>Recorded minutes</CardDescription>
        </Card>
        <Card>
          <CardTitle>{totals.differenceMinutes ?? "Unavailable"}</CardTitle>
          <CardDescription>{totals.label}</CardDescription>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Service definition</CardTitle>
          {data.permissions.canManageDefinitions ? (
            <form action={submitAction(saveServiceDefinitionAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <FormField id="serviceName" label="Name">
                <Input id="serviceName" name="name" required />
              </FormField>
              <FormField id="serviceArea" label="Service area">
                <Input id="serviceArea" name="serviceArea" required />
              </FormField>
              <FormField id="defaultDeliveryType" label="Default delivery type">
                <Select id="defaultDeliveryType" name="defaultDeliveryType">
                  <option value="group">Group</option>
                  <option value="individual">Individual</option>
                  <option value="consultation">Consultation</option>
                </Select>
              </FormField>
              <Button type="submit">Save definition</Button>
            </form>
          ) : (
            <PermissionNote />
          )}
        </Card>
        <Card>
          <CardTitle>Service plan</CardTitle>
          {data.permissions.canManagePlans ? (
            <form action={submitAction(saveServicePlanAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <FormField id="serviceStudentId" label="Student">
                <Select
                  id="serviceStudentId"
                  name="studentId"
                  defaultValue={studentId ?? ""}
                  required
                >
                  <option value="">Choose student</option>
                  {visibleStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {studentName(student)}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="serviceDefinitionId" label="Definition">
                <Select id="serviceDefinitionId" name="serviceDefinitionId">
                  <option value="">Custom service</option>
                  {data.definitions.map((definition) => (
                    <option key={definition.id} value={definition.id}>
                      {definition.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField id="serviceTitle" label="Title">
                <Input id="serviceTitle" name="title" required />
              </FormField>
              <input type="hidden" name="status" value="draft" />
              <Button type="submit">Save service plan</Button>
            </form>
          ) : (
            <PermissionNote />
          )}
        </Card>
      </div>
      {firstPlan ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardTitle>Service component</CardTitle>
            <form action={submitAction(addServiceComponentAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <input type="hidden" name="servicePlanId" value={firstPlan.id} />
              <FormField id="componentName" label="Component">
                <Input id="componentName" name="componentName" required />
              </FormField>
              <FormField id="serviceMinutes" label="Minutes">
                <Input id="serviceMinutes" name="serviceMinutes" type="number" min="1" />
              </FormField>
              <Button type="submit" variant="secondary">
                Add component
              </Button>
            </form>
          </Card>
          <Card>
            <CardTitle>Provider workspace log</CardTitle>
            <form action={submitAction(saveServiceDeliveryLogAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <input type="hidden" name="servicePlanId" value={firstPlan.id} />
              <input type="hidden" name="serviceComponentId" value={firstComponent?.id ?? ""} />
              <input type="hidden" name="primaryStudentId" value={firstPlan.student_id} />
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
              <FormField
                id="participantStudentIds"
                label="Group participant student IDs"
                description="Comma-separated; every participant must be authorized."
              >
                <Input id="participantStudentIds" name="participantStudentIds" />
              </FormField>
              <input type="hidden" name="deliveryType" value="group" />
              <input type="hidden" name="serviceStatus" value="delivered" />
              <input type="hidden" name="recordStatus" value="draft" />
              <Button type="submit" variant="secondary">
                Save service log
              </Button>
            </form>
          </Card>
        </div>
      ) : null}
      <TableShell
        caption="Service plans"
        headers={["Plan", "Student", "Status", "Documentation"]}
        rows={data.plans.map((plan) => {
          const student = data.students.find((entry) => entry.id === plan.student_id);
          const log = data.deliveryLogs.find((entry) => entry.service_plan_id === plan.id);
          return [
            plan.title,
            student ? studentName(student) : "Authorized student",
            plan.status,
            describeDocumentationGap({ recordedMinutes: log?.calculated_duration_minutes ?? null }),
          ];
        })}
      />
    </div>
  );
}

export function CommunicationsWorkspace({
  data,
  studentId,
}: {
  data: CommunicationsData;
  studentId?: string;
}) {
  return (
    <div className="space-y-6">
      <Alert title="Family notes vs staff-only notes" tone="info">
        When you save a note, set Visibility to Family visible if parents may see it. Internal notes
        stay staff-only. After saving a family note, it also appears under Messages for families.
        Use Parent e-signature below when you need an “I have read this” receipt.
      </Alert>
      <StaffNotificationsPanel
        organizationId={data.organizationId}
        notifications={data.staffNotifications ?? []}
      />
      <ContactAndCommunicationForms
        organizationId={data.organizationId ?? ""}
        students={data.students}
        contacts={data.contacts}
        canManageContacts={data.permissions.canManageContacts}
        canEnterCommunication={data.permissions.canEnterCommunication}
        studentId={studentId}
      />
      <CommunicationEsignPanel data={data} />
      <form action={submitAction(recordFamilyCommunicationExportAction)}>
        <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
        <input type="hidden" name="studentId" value={studentId ?? ""} />
        <Button type="submit" variant="secondary">
          Record family-visible export
        </Button>
      </form>
      <TableShell
        caption="Your saved messages"
        headers={["Subject", "Language", "Visibility", "E-sign", "Status", "Occurred"]}
        emptyMessage="No messages saved yet. Use Write a message / Template & language above, keep Visibility on Family visible if parents may see it, then save."
        rows={data.communications.map((log) => [
          log.subject,
          communicationLanguageLabel(log.language_code || "en"),
          log.visibility.replaceAll("_", " "),
          log.esign_status || "none",
          log.status.replaceAll("_", " "),
          new Date(log.occurred_at).toLocaleString(),
        ])}
      />
    </div>
  );
}

export function MeetingsWorkspace({ data, studentId }: { data: MeetingsData; studentId?: string }) {
  const visibleStudents = studentId
    ? data.students.filter((student) => student.id === studentId)
    : data.students;
  const firstMeeting = data.meetings[0];
  return (
    <div className="space-y-6">
      <Alert title="Acknowledgement is not consent" tone="info">
        Acknowledgement fields record receipt/review status only.
      </Alert>
      <Card>
        <CardTitle>Meeting</CardTitle>
        {data.permissions.canManage ? (
          <form action={submitAction(saveMeetingAction)} className="mt-4 space-y-3">
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <FormField id="meetingStudentId" label="Student">
              <Select
                id="meetingStudentId"
                name="studentId"
                defaultValue={studentId ?? ""}
                required
              >
                <option value="">Choose student</option>
                {visibleStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {studentName(student)}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField id="meetingTitle" label="Title">
              <Input id="meetingTitle" name="title" required />
            </FormField>
            <input type="hidden" name="status" value="draft" />
            <Button type="submit">Save meeting</Button>
          </form>
        ) : (
          <PermissionNote />
        )}
      </Card>
      {firstMeeting && data.permissions.canManage ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardTitle>External participant</CardTitle>
            <form action={submitAction(addMeetingParticipantAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <input type="hidden" name="meetingId" value={firstMeeting.id} />
              <input type="hidden" name="studentId" value={firstMeeting.student_id} />
              <input type="hidden" name="participantKind" value="external" />
              <FormField id="externalName" label="External name">
                <Input id="externalName" name="externalName" required />
              </FormField>
              <FormField id="externalRole" label="Role">
                <Input id="externalRole" name="externalRole" />
              </FormField>
              <Button type="submit" variant="secondary">
                Add external participant
              </Button>
            </form>
          </Card>
          <Card>
            <CardTitle>Acknowledgement</CardTitle>
            <form
              action={submitAction(recordMeetingAcknowledgementAction)}
              className="mt-4 space-y-3"
            >
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <input type="hidden" name="meetingId" value={firstMeeting.id} />
              <FormField id="ackStatus" label="Status">
                <Select id="ackStatus" name="status" defaultValue="acknowledged">
                  <option value="acknowledged">Acknowledged</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="requested_clarification">Requested clarification</option>
                </Select>
              </FormField>
              <Button type="submit" variant="secondary">
                Record acknowledgement
              </Button>
            </form>
          </Card>
        </div>
      ) : null}
      <TableShell
        caption="Meetings"
        headers={["Title", "Student", "Status", "When"]}
        rows={data.meetings.map((meeting) => {
          const student = data.students.find((entry) => entry.id === meeting.student_id);
          return [
            meeting.title,
            student ? studentName(student) : "Authorized student",
            meeting.status,
            meeting.scheduled_start
              ? new Date(meeting.scheduled_start).toLocaleString()
              : "Not scheduled",
          ];
        })}
      />
    </div>
  );
}

export function ExecutiveFunctionWorkspace({
  data,
  studentId,
}: {
  data: ExecutiveFunctionData;
  studentId?: string;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const visibleStudents = studentId
    ? data.students.filter((student) => student.id === studentId)
    : data.students;
  const firstPlan = data.plans[0];
  const firstChecklistItem = data.checklistItems[0];
  const independence = independencePercent(
    data.observations.map((observation) => ({ promptLevel: observation.prompt_level })),
  );
  const prompts = promptDistribution(
    data.observations.map((observation) => ({ promptLevel: observation.prompt_level })),
  );
  return (
    <div className="space-y-6">
      <Alert title="Executive function observations are descriptive" tone="info">
        Percentages describe observed support use and do not claim mastery.
      </Alert>
      <AiAssistPanel
        domain="executive_function"
        title="AI Assist · Executive function"
        description="Suggest EF skill focuses and plan titles based on the need you describe."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardTitle>{data.plans.length}</CardTitle>
          <CardDescription>EF plans</CardDescription>
        </Card>
        <Card>
          <CardTitle>{independence.percent ?? "Unavailable"}%</CardTitle>
          <CardDescription>Observed independence</CardDescription>
        </Card>
        <Card>
          <CardTitle>{prompts.verbal}</CardTitle>
          <CardDescription>Verbal prompts observed</CardDescription>
        </Card>
      </div>
      <Card>
        <CardTitle>Executive function plan</CardTitle>
        {data.permissions.canManagePlans ? (
          <form action={submitAction(saveExecutiveFunctionPlanAction)} className="mt-4 space-y-3">
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <FormField id="efStudentId" label="Student">
              <Select id="efStudentId" name="studentId" defaultValue={studentId ?? ""} required>
                <option value="">Choose student</option>
                {visibleStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {studentName(student)}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField id="efSkillAreaId" label="Skill area">
              <Select id="efSkillAreaId" name="skillAreaId" defaultValue="">
                <option value="">Choose skill area (optional)</option>
                {data.skillAreas.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField id="efTitle" label="Title">
              <Input id="efTitle" name="title" required />
            </FormField>
            <input type="hidden" name="status" value="draft" />
            <Button type="submit">Save EF plan</Button>
          </form>
        ) : (
          <PermissionNote />
        )}
      </Card>
      {firstPlan ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardTitle>Observation</CardTitle>
            <form
              action={submitAction(saveExecutiveFunctionObservationAction)}
              className="mt-4 space-y-3"
            >
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <input type="hidden" name="planId" value={firstPlan.id} />
              <input type="hidden" name="studentId" value={firstPlan.student_id} />
              <FormField id="observationDate" label="Date">
                <Input
                  id="observationDate"
                  name="observationDate"
                  type="date"
                  defaultValue={today}
                  required
                />
              </FormField>
              <FormField id="promptLevel" label="Prompt level">
                <Select id="promptLevel" name="promptLevel" defaultValue="visual">
                  <option value="independent">Independent</option>
                  <option value="visual">Visual</option>
                  <option value="verbal">Verbal</option>
                  <option value="modeled">Modeled</option>
                  <option value="not_observed">Not observed</option>
                </Select>
              </FormField>
              <Button type="submit" variant="secondary">
                Save observation
              </Button>
            </form>
          </Card>
          {firstChecklistItem ? (
            <Card>
              <CardTitle>Checklist response</CardTitle>
              <form action={submitAction(saveChecklistResponseAction)} className="mt-4 space-y-3">
                <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
                <input type="hidden" name="checklistId" value={firstChecklistItem.checklist_id} />
                <input type="hidden" name="checklistItemId" value={firstChecklistItem.id} />
                <input type="hidden" name="studentId" value={firstChecklistItem.student_id} />
                <FormField id="responseDate" label="Date">
                  <Input
                    id="responseDate"
                    name="responseDate"
                    type="date"
                    defaultValue={today}
                    required
                  />
                </FormField>
                <FormField id="response" label="Response">
                  <Select id="response" name="response" defaultValue="yes">
                    <option value="yes">Yes</option>
                    <option value="partial">Partial</option>
                    <option value="no">No</option>
                    <option value="not_observed">Not observed</option>
                  </Select>
                </FormField>
                <Button type="submit" variant="secondary">
                  Save response
                </Button>
              </form>
            </Card>
          ) : null}
        </div>
      ) : null}
      <TableShell
        caption="Executive function plans"
        headers={["Plan", "Student", "Status"]}
        rows={data.plans.map((plan) => {
          const student = data.students.find((entry) => entry.id === plan.student_id);
          return [plan.title, student ? studentName(student) : "Authorized student", plan.status];
        })}
      />
    </div>
  );
}
