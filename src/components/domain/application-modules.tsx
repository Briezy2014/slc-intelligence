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
import { saveCommunicationLogAction, saveContactAction, recordFamilyCommunicationExportAction } from "@/lib/actions/communications";
import { saveMeetingAction, addMeetingParticipantAction, recordMeetingAcknowledgementAction } from "@/lib/actions/meetings";
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
  addClassroomScheduleBlockAction,
  saveClassroomAnnouncementAction,
  saveClassroomScheduleAction,
  saveDailyStudentNoteAction,
} from "@/lib/actions/classroom-operations";
import {
  independencePercent,
  promptDistribution,
  scheduleBlockDurationMinutes,
} from "@/lib/analytics/executive-function-calculations";
import {
  describeDocumentationGap,
  durationMinutesFromStartEnd,
  summarizePlannedVsRecordedMinutes,
} from "@/lib/analytics/service-calculations";
import type { AccommodationsData } from "@/lib/data/accommodations";
import type { ClassroomOperationsData } from "@/lib/data/classroom-operations";
import type { CommunicationsData } from "@/lib/data/communications";
import type { ExecutiveFunctionData } from "@/lib/data/executive-function";
import type { MeetingsData } from "@/lib/data/meetings";
import type { ServicesData } from "@/lib/data/services";

function submitAction(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
}

function studentName(data: { first_name: string; last_name: string; preferred_name: string | null }) {
  return `${data.last_name}, ${data.preferred_name || data.first_name}`;
}

export function PermissionNote({ children = "Your current role can view this area but cannot complete this action." }: { children?: string }) {
  return <Alert title="Permission needed" tone="warning">{children}</Alert>;
}

export function ModuleLinkGrid({ links }: { links: Array<{ href: string; label: string; description: string }> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="border-border bg-background-elevated hover:border-highlight/50 rounded-[var(--radius-lg)] border p-4 transition-colors">
          <p className="font-semibold">{link.label}</p>
          <p className="text-muted mt-1 text-sm">{link.description}</p>
        </Link>
      ))}
    </div>
  );
}

export function AccommodationsWorkspace({ data, studentId }: { data: AccommodationsData; studentId?: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const visibleStudents = studentId ? data.students.filter((student) => student.id === studentId) : data.students;
  const firstAccommodation = data.accommodations[0];
  return (
    <div className="space-y-6">
      <Alert title="Accommodation records are descriptive" tone="info">
        These records document planned and implemented supports. They do not determine legal compliance.
      </Alert>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Accommodation library</CardTitle>
          <CardDescription>Reusable support descriptions for authorized staff.</CardDescription>
          {data.permissions.canManageLibrary ? (
            <form action={submitAction(saveAccommodationLibraryItemAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <FormField id="accommodationLibraryName" label="Name"><Input id="accommodationLibraryName" name="name" required /></FormField>
              <FormField id="accommodationArea" label="Area"><Input id="accommodationArea" name="accommodationArea" /></FormField>
              <FormField id="accommodationDescription" label="Description"><Textarea id="accommodationDescription" name="description" required /></FormField>
              <Button type="submit">Save library item</Button>
            </form>
          ) : <PermissionNote />}
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
                  {visibleStudents.map((student) => <option key={student.id} value={student.id}>{studentName(student)}</option>)}
                </Select>
              </FormField>
              <FormField id="libraryItemId" label="Library item">
                <Select id="libraryItemId" name="libraryItemId">
                  <option value="">Custom accommodation</option>
                  {data.libraryItems.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </Select>
              </FormField>
              <FormField id="accommodationTitle" label="Title"><Input id="accommodationTitle" name="title" required /></FormField>
              <FormField id="studentAccommodationDescription" label="Description"><Textarea id="studentAccommodationDescription" name="description" required /></FormField>
              <input type="hidden" name="status" value="draft" />
              <Button type="submit">Save accommodation</Button>
            </form>
          ) : <PermissionNote />}
        </Card>
      </div>
      {firstAccommodation && data.permissions.canImplement ? (
        <Card>
          <CardTitle>Implementation log</CardTitle>
          <form action={submitAction(saveAccommodationImplementationLogAction)} className="mt-4 grid gap-3 md:grid-cols-2">
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <input type="hidden" name="accommodationId" value={firstAccommodation.id} />
            <input type="hidden" name="studentId" value={firstAccommodation.student_id} />
            <FormField id="logDate" label="Date"><Input id="logDate" name="logDate" type="date" defaultValue={today} required /></FormField>
            <FormField id="implementationStatus" label="Status">
              <Select id="implementationStatus" name="implementationStatus" defaultValue="implemented">
                <option value="implemented">Implemented</option>
                <option value="partially_implemented">Partially implemented</option>
                <option value="not_implemented">Not implemented</option>
                <option value="not_applicable">Not applicable</option>
                <option value="student_declined">Student declined</option>
              </Select>
            </FormField>
            <FormField id="setting" label="Setting"><Input id="setting" name="setting" /></FormField>
            <input type="hidden" name="status" value="draft" />
            <Button type="submit" variant="secondary">Record implementation</Button>
          </form>
        </Card>
      ) : null}
      {data.accommodations.length ? (
        <TableShell
          caption="Student accommodations"
          headers={["Title", "Student", "Status", "Dates"]}
          rows={data.accommodations.map((item) => {
            const student = data.students.find((entry) => entry.id === item.student_id);
            return [item.title, student ? studentName(student) : "Authorized student", item.status, `${item.start_date ?? "Not set"} to ${item.end_date ?? "Not set"}`];
          })}
        />
      ) : <EmptyState title="No accommodations" description="No authorized accommodations match this scope." />}
    </div>
  );
}

export function ServicesWorkspace({ data, studentId }: { data: ServicesData; studentId?: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const visibleStudents = studentId ? data.students.filter((student) => student.id === studentId) : data.students;
  const firstPlan = data.plans[0];
  const firstComponent = data.components.find((component) => component.service_plan_id === firstPlan?.id);
  const totals = summarizePlannedVsRecordedMinutes({
    plannedMinutes: data.schedules.reduce<number | null>((sum, schedule) => schedule.planned_duration_minutes == null ? sum : (sum ?? 0) + schedule.planned_duration_minutes, null),
    recordedMinutes: data.deliveryLogs.reduce<number | null>((sum, log) => {
      const minutes = log.calculated_duration_minutes ?? durationMinutesFromStartEnd(log.start_time, log.end_time);
      return minutes == null ? sum : (sum ?? 0) + minutes;
    }, null),
  });
  return (
    <div className="space-y-6">
      <Alert title="Planned vs recorded disclosure" tone="info">{totals.disclaimer}</Alert>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardTitle>{data.plans.length}</CardTitle><CardDescription>Service plans</CardDescription></Card>
        <Card><CardTitle>{totals.recordedMinutes ?? "Unavailable"}</CardTitle><CardDescription>Recorded minutes</CardDescription></Card>
        <Card><CardTitle>{totals.differenceMinutes ?? "Unavailable"}</CardTitle><CardDescription>{totals.label}</CardDescription></Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Service definition</CardTitle>
          {data.permissions.canManageDefinitions ? (
            <form action={submitAction(saveServiceDefinitionAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <FormField id="serviceName" label="Name"><Input id="serviceName" name="name" required /></FormField>
              <FormField id="serviceArea" label="Service area"><Input id="serviceArea" name="serviceArea" required /></FormField>
              <FormField id="defaultDeliveryType" label="Default delivery type"><Select id="defaultDeliveryType" name="defaultDeliveryType"><option value="group">Group</option><option value="individual">Individual</option><option value="consultation">Consultation</option></Select></FormField>
              <Button type="submit">Save definition</Button>
            </form>
          ) : <PermissionNote />}
        </Card>
        <Card>
          <CardTitle>Service plan</CardTitle>
          {data.permissions.canManagePlans ? (
            <form action={submitAction(saveServicePlanAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <FormField id="serviceStudentId" label="Student"><Select id="serviceStudentId" name="studentId" defaultValue={studentId ?? ""} required><option value="">Choose student</option>{visibleStudents.map((student) => <option key={student.id} value={student.id}>{studentName(student)}</option>)}</Select></FormField>
              <FormField id="serviceDefinitionId" label="Definition"><Select id="serviceDefinitionId" name="serviceDefinitionId"><option value="">Custom service</option>{data.definitions.map((definition) => <option key={definition.id} value={definition.id}>{definition.name}</option>)}</Select></FormField>
              <FormField id="serviceTitle" label="Title"><Input id="serviceTitle" name="title" required /></FormField>
              <input type="hidden" name="status" value="draft" />
              <Button type="submit">Save service plan</Button>
            </form>
          ) : <PermissionNote />}
        </Card>
      </div>
      {firstPlan ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardTitle>Service component</CardTitle>
            <form action={submitAction(addServiceComponentAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <input type="hidden" name="servicePlanId" value={firstPlan.id} />
              <FormField id="componentName" label="Component"><Input id="componentName" name="componentName" required /></FormField>
              <FormField id="serviceMinutes" label="Minutes"><Input id="serviceMinutes" name="serviceMinutes" type="number" min="1" /></FormField>
              <Button type="submit" variant="secondary">Add component</Button>
            </form>
          </Card>
          <Card>
            <CardTitle>Provider workspace log</CardTitle>
            <form action={submitAction(saveServiceDeliveryLogAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <input type="hidden" name="servicePlanId" value={firstPlan.id} />
              <input type="hidden" name="serviceComponentId" value={firstComponent?.id ?? ""} />
              <input type="hidden" name="primaryStudentId" value={firstPlan.student_id} />
              <FormField id="serviceDate" label="Date"><Input id="serviceDate" name="serviceDate" type="date" defaultValue={today} required /></FormField>
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField id="startTime" label="Start"><Input id="startTime" name="startTime" type="time" /></FormField>
                <FormField id="endTime" label="End"><Input id="endTime" name="endTime" type="time" /></FormField>
              </div>
              <FormField id="participantStudentIds" label="Group participant student IDs" description="Comma-separated; every participant must be authorized."><Input id="participantStudentIds" name="participantStudentIds" /></FormField>
              <input type="hidden" name="deliveryType" value="group" />
              <input type="hidden" name="serviceStatus" value="delivered" />
              <input type="hidden" name="recordStatus" value="draft" />
              <Button type="submit" variant="secondary">Save service log</Button>
            </form>
          </Card>
        </div>
      ) : null}
      <TableShell caption="Service plans" headers={["Plan", "Student", "Status", "Documentation"]} rows={data.plans.map((plan) => {
        const student = data.students.find((entry) => entry.id === plan.student_id);
        const log = data.deliveryLogs.find((entry) => entry.service_plan_id === plan.id);
        return [plan.title, student ? studentName(student) : "Authorized student", plan.status, describeDocumentationGap({ recordedMinutes: log?.calculated_duration_minutes ?? null })];
      })} />
    </div>
  );
}

export function CommunicationsWorkspace({ data, studentId }: { data: CommunicationsData; studentId?: string }) {
  const visibleStudents = studentId ? data.students.filter((student) => student.id === studentId) : data.students;
  return (
    <div className="space-y-6">
      <Alert title="Family-visible export guardrail" tone="info">Exports include family_visible communication summaries only; internal and restricted records stay separate.</Alert>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Contact</CardTitle>
          {data.permissions.canManageContacts ? (
            <form action={submitAction(saveContactAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <FormField id="contactStudentId" label="Student"><Select id="contactStudentId" name="studentId" defaultValue={studentId ?? ""} required><option value="">Choose student</option>{visibleStudents.map((student) => <option key={student.id} value={student.id}>{studentName(student)}</option>)}</Select></FormField>
              <div className="grid gap-3 sm:grid-cols-2"><FormField id="firstName" label="First name"><Input id="firstName" name="firstName" required /></FormField><FormField id="lastName" label="Last name"><Input id="lastName" name="lastName" required /></FormField></div>
              <FormField id="relationship" label="Relationship"><Input id="relationship" name="relationship" required /></FormField>
              <Button type="submit">Save contact</Button>
            </form>
          ) : <PermissionNote />}
        </Card>
        <Card>
          <CardTitle>Communication log</CardTitle>
          {data.permissions.canEnterCommunication ? (
            <form action={submitAction(saveCommunicationLogAction)} className="mt-4 space-y-3">
              <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
              <FormField id="communicationStudentId" label="Student"><Select id="communicationStudentId" name="studentId" defaultValue={studentId ?? ""} required><option value="">Choose student</option>{visibleStudents.map((student) => <option key={student.id} value={student.id}>{studentName(student)}</option>)}</Select></FormField>
              <FormField id="contactId" label="Contact"><Select id="contactId" name="contactId"><option value="">No contact selected</option>{data.contacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.last_name}, {contact.first_name}</option>)}</Select></FormField>
              <FormField id="visibility" label="Visibility"><Select id="visibility" name="visibility" defaultValue="family_visible"><option value="family_visible">Family visible</option><option value="internal">Internal</option><option value="restricted_admin">Restricted admin</option></Select></FormField>
              <input type="hidden" name="method" value="phone" /><input type="hidden" name="direction" value="outbound" /><input type="hidden" name="status" value="draft" />
              <FormField id="subject" label="Subject"><Input id="subject" name="subject" required /></FormField>
              <FormField id="summary" label="Summary"><Textarea id="summary" name="summary" required /></FormField>
              <Button type="submit">Save communication</Button>
            </form>
          ) : <PermissionNote />}
        </Card>
      </div>
      <form action={submitAction(recordFamilyCommunicationExportAction)}><input type="hidden" name="organizationId" value={data.organizationId ?? ""} /><input type="hidden" name="studentId" value={studentId ?? ""} /><Button type="submit" variant="secondary">Record family-visible export</Button></form>
      <TableShell caption="Communications" headers={["Subject", "Visibility", "Status", "Occurred"]} rows={data.communications.map((log) => [log.subject, log.visibility, log.status, new Date(log.occurred_at).toLocaleString()])} />
    </div>
  );
}

export function MeetingsWorkspace({ data, studentId }: { data: MeetingsData; studentId?: string }) {
  const visibleStudents = studentId ? data.students.filter((student) => student.id === studentId) : data.students;
  const firstMeeting = data.meetings[0];
  return (
    <div className="space-y-6">
      <Alert title="Acknowledgement is not consent" tone="info">Acknowledgement fields record receipt/review status only.</Alert>
      <Card>
        <CardTitle>Meeting</CardTitle>
        {data.permissions.canManage ? (
          <form action={submitAction(saveMeetingAction)} className="mt-4 space-y-3">
            <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
            <FormField id="meetingStudentId" label="Student"><Select id="meetingStudentId" name="studentId" defaultValue={studentId ?? ""} required><option value="">Choose student</option>{visibleStudents.map((student) => <option key={student.id} value={student.id}>{studentName(student)}</option>)}</Select></FormField>
            <FormField id="meetingTitle" label="Title"><Input id="meetingTitle" name="title" required /></FormField>
            <input type="hidden" name="status" value="draft" />
            <Button type="submit">Save meeting</Button>
          </form>
        ) : <PermissionNote />}
      </Card>
      {firstMeeting && data.permissions.canManage ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card><CardTitle>External participant</CardTitle><form action={submitAction(addMeetingParticipantAction)} className="mt-4 space-y-3"><input type="hidden" name="organizationId" value={data.organizationId ?? ""} /><input type="hidden" name="meetingId" value={firstMeeting.id} /><input type="hidden" name="studentId" value={firstMeeting.student_id} /><input type="hidden" name="participantKind" value="external" /><FormField id="externalName" label="External name"><Input id="externalName" name="externalName" required /></FormField><FormField id="externalRole" label="Role"><Input id="externalRole" name="externalRole" /></FormField><Button type="submit" variant="secondary">Add external participant</Button></form></Card>
          <Card><CardTitle>Acknowledgement</CardTitle><form action={submitAction(recordMeetingAcknowledgementAction)} className="mt-4 space-y-3"><input type="hidden" name="organizationId" value={data.organizationId ?? ""} /><input type="hidden" name="meetingId" value={firstMeeting.id} /><FormField id="ackStatus" label="Status"><Select id="ackStatus" name="status" defaultValue="acknowledged"><option value="acknowledged">Acknowledged</option><option value="reviewed">Reviewed</option><option value="requested_clarification">Requested clarification</option></Select></FormField><Button type="submit" variant="secondary">Record acknowledgement</Button></form></Card>
        </div>
      ) : null}
      <TableShell caption="Meetings" headers={["Title", "Student", "Status", "When"]} rows={data.meetings.map((meeting) => {
        const student = data.students.find((entry) => entry.id === meeting.student_id);
        return [meeting.title, student ? studentName(student) : "Authorized student", meeting.status, meeting.scheduled_start ? new Date(meeting.scheduled_start).toLocaleString() : "Not scheduled"];
      })} />
    </div>
  );
}

export function ExecutiveFunctionWorkspace({ data, studentId }: { data: ExecutiveFunctionData; studentId?: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const visibleStudents = studentId ? data.students.filter((student) => student.id === studentId) : data.students;
  const firstPlan = data.plans[0];
  const firstChecklistItem = data.checklistItems[0];
  const independence = independencePercent(data.observations.map((observation) => ({ promptLevel: observation.prompt_level })));
  const prompts = promptDistribution(data.observations.map((observation) => ({ promptLevel: observation.prompt_level })));
  return (
    <div className="space-y-6">
      <Alert title="Executive function observations are descriptive" tone="info">Percentages describe observed support use and do not claim mastery.</Alert>
      <div className="grid gap-4 md:grid-cols-3"><Card><CardTitle>{data.plans.length}</CardTitle><CardDescription>EF plans</CardDescription></Card><Card><CardTitle>{independence.percent ?? "Unavailable"}%</CardTitle><CardDescription>Observed independence</CardDescription></Card><Card><CardTitle>{prompts.verbal}</CardTitle><CardDescription>Verbal prompts observed</CardDescription></Card></div>
      <Card>
        <CardTitle>Executive function plan</CardTitle>
        {data.permissions.canManagePlans ? <form action={submitAction(saveExecutiveFunctionPlanAction)} className="mt-4 space-y-3"><input type="hidden" name="organizationId" value={data.organizationId ?? ""} /><FormField id="efStudentId" label="Student"><Select id="efStudentId" name="studentId" defaultValue={studentId ?? ""} required><option value="">Choose student</option>{visibleStudents.map((student) => <option key={student.id} value={student.id}>{studentName(student)}</option>)}</Select></FormField><FormField id="efTitle" label="Title"><Input id="efTitle" name="title" required /></FormField><input type="hidden" name="status" value="draft" /><Button type="submit">Save EF plan</Button></form> : <PermissionNote />}
      </Card>
      {firstPlan ? <div className="grid gap-6 lg:grid-cols-2"><Card><CardTitle>Observation</CardTitle><form action={submitAction(saveExecutiveFunctionObservationAction)} className="mt-4 space-y-3"><input type="hidden" name="organizationId" value={data.organizationId ?? ""} /><input type="hidden" name="planId" value={firstPlan.id} /><input type="hidden" name="studentId" value={firstPlan.student_id} /><FormField id="observationDate" label="Date"><Input id="observationDate" name="observationDate" type="date" defaultValue={today} required /></FormField><FormField id="promptLevel" label="Prompt level"><Select id="promptLevel" name="promptLevel" defaultValue="visual"><option value="independent">Independent</option><option value="visual">Visual</option><option value="verbal">Verbal</option><option value="modeled">Modeled</option><option value="not_observed">Not observed</option></Select></FormField><Button type="submit" variant="secondary">Save observation</Button></form></Card>{firstChecklistItem ? <Card><CardTitle>Checklist response</CardTitle><form action={submitAction(saveChecklistResponseAction)} className="mt-4 space-y-3"><input type="hidden" name="organizationId" value={data.organizationId ?? ""} /><input type="hidden" name="checklistId" value={firstChecklistItem.checklist_id} /><input type="hidden" name="checklistItemId" value={firstChecklistItem.id} /><input type="hidden" name="studentId" value={firstChecklistItem.student_id} /><FormField id="responseDate" label="Date"><Input id="responseDate" name="responseDate" type="date" defaultValue={today} required /></FormField><FormField id="response" label="Response"><Select id="response" name="response" defaultValue="yes"><option value="yes">Yes</option><option value="partial">Partial</option><option value="no">No</option><option value="not_observed">Not observed</option></Select></FormField><Button type="submit" variant="secondary">Save response</Button></form></Card> : null}</div> : null}
      <TableShell caption="Executive function plans" headers={["Plan", "Student", "Status"]} rows={data.plans.map((plan) => { const student = data.students.find((entry) => entry.id === plan.student_id); return [plan.title, student ? studentName(student) : "Authorized student", plan.status]; })} />
    </div>
  );
}

export function ClassroomOperationsWorkspace({ data, classroomId, daily = false }: { data: ClassroomOperationsData; classroomId?: string; daily?: boolean }) {
  const today = new Date().toISOString().slice(0, 10);
  const visibleClassrooms = classroomId ? data.classrooms.filter((classroom) => classroom.id === classroomId) : data.classrooms;
  const firstSchedule = data.schedules[0];
  const firstStudent = data.students[0];
  return (
    <div className="space-y-6">
      <Alert title={daily ? "Daily Command Center" : "Classroom operations"} tone="info">Role-aware views show authorized schedules, routines, notes, and announcements. Reinforcement records must not be used for punitive ranking.</Alert>
      <div className="grid gap-4 md:grid-cols-4"><Card><CardTitle>{data.schedules.length}</CardTitle><CardDescription>Schedules</CardDescription></Card><Card><CardTitle>{data.routines.length}</CardTitle><CardDescription>Routines</CardDescription></Card><Card><CardTitle>{data.dailyNotes.length}</CardTitle><CardDescription>Daily notes</CardDescription></Card><Card><CardTitle>{data.announcements.length}</CardTitle><CardDescription>Announcements</CardDescription></Card></div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardTitle>Schedule</CardTitle>{data.permissions.canManageSchedules ? <form action={submitAction(saveClassroomScheduleAction)} className="mt-4 space-y-3"><input type="hidden" name="organizationId" value={data.organizationId ?? ""} /><FormField id="opsClassroomId" label="Classroom"><Select id="opsClassroomId" name="classroomId" defaultValue={classroomId ?? ""} required><option value="">Choose classroom</option>{visibleClassrooms.map((classroom) => <option key={classroom.id} value={classroom.id}>{classroom.name}</option>)}</Select></FormField><FormField id="scheduleName" label="Name"><Input id="scheduleName" name="name" required /></FormField><Button type="submit">Save schedule</Button></form> : <PermissionNote />}</Card>
        <Card><CardTitle>Daily student note</CardTitle>{data.permissions.canEnterDailyNotes && firstStudent ? <form action={submitAction(saveDailyStudentNoteAction)} className="mt-4 space-y-3"><input type="hidden" name="organizationId" value={data.organizationId ?? ""} /><input type="hidden" name="studentId" value={firstStudent.id} /><FormField id="noteDate" label="Date"><Input id="noteDate" name="noteDate" type="date" defaultValue={today} required /></FormField><FormField id="noteText" label="Note"><Textarea id="noteText" name="noteText" required /></FormField><input type="hidden" name="status" value="draft" /><Button type="submit">Save daily note</Button></form> : <PermissionNote>Daily note entry is limited to authorized roles and student scopes.</PermissionNote>}</Card>
      </div>
      {firstSchedule ? <div className="grid gap-6 lg:grid-cols-2"><Card><CardTitle>Schedule block</CardTitle><form action={submitAction(addClassroomScheduleBlockAction)} className="mt-4 space-y-3"><input type="hidden" name="organizationId" value={data.organizationId ?? ""} /><input type="hidden" name="scheduleId" value={firstSchedule.id} /><input type="hidden" name="classroomId" value={firstSchedule.classroom_id} /><FormField id="blockLabel" label="Label"><Input id="blockLabel" name="label" required /></FormField><div className="grid gap-3 sm:grid-cols-2"><FormField id="blockStart" label="Start"><Input id="blockStart" name="startTime" type="time" required /></FormField><FormField id="blockEnd" label="End"><Input id="blockEnd" name="endTime" type="time" required /></FormField></div><Button type="submit" variant="secondary">Add block</Button></form></Card><Card><CardTitle>Announcement</CardTitle><form action={submitAction(saveClassroomAnnouncementAction)} className="mt-4 space-y-3"><input type="hidden" name="organizationId" value={data.organizationId ?? ""} /><input type="hidden" name="classroomId" value={firstSchedule.classroom_id} /><FormField id="announcementTitle" label="Title"><Input id="announcementTitle" name="title" required /></FormField><FormField id="announcementBody" label="Body"><Textarea id="announcementBody" name="body" required /></FormField><input type="hidden" name="containsStudentPii" value="false" /><input type="hidden" name="audience" value="staff" /><input type="hidden" name="status" value="draft" /><Button type="submit" variant="secondary">Save announcement</Button></form></Card></div> : null}
      <TableShell caption="Schedule blocks" headers={["Label", "Day", "Time", "Minutes"]} rows={data.scheduleBlocks.map((block) => [block.label, block.day_of_week == null ? "All" : String(block.day_of_week), `${block.start_time} to ${block.end_time}`, String(scheduleBlockDurationMinutes(block.start_time, block.end_time) ?? "Unavailable")])} />
      <TableShell caption="Daily notes" headers={["Student", "Date", "Status"]} rows={data.dailyNotes.map((note) => { const student = data.students.find((entry) => entry.id === note.student_id); return [student ? studentName(student) : "Authorized student", note.note_date, note.status]; })} />
    </div>
  );
}
