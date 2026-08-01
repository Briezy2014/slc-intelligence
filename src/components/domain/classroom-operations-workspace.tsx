"use client";

import Link from "next/link";
import { useActionState, useMemo, useState, type ReactNode } from "react";
import { TableShell } from "@/components/data-display/table-shell";
import { FormField } from "@/components/forms/form-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  addClassroomScheduleBlockAction,
  saveClassroomAnnouncementAction,
  saveClassroomRoutineAction,
  saveClassroomScheduleAction,
  saveDailyStudentNoteAction,
} from "@/lib/actions/classroom-operations";
import { OWNER_CLASSROOM_NAME, ensurePilotDemoSetupAction } from "@/lib/actions/pilot-demo-setup";
import { scheduleBlockDurationMinutes } from "@/lib/analytics/executive-function-calculations";
import type { ClassroomOperationsData } from "@/lib/data/classroom-operations";

type SetupActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const initialSetupState: SetupActionState = { status: "idle" };

export type ClassroomOpsSection =
  "overview" | "daily" | "schedules" | "notes" | "routines" | "announcements";

function submitAction(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
}

function studentName(data: {
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  local_identifier?: string;
}) {
  const display = data.preferred_name || data.first_name;
  return `${data.last_name}, ${display}${data.local_identifier ? ` (${data.local_identifier})` : ""}`;
}

function dayLabel(dayOfWeek: number | null): string {
  if (dayOfWeek == null) return "All days";
  const labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return labels[dayOfWeek] ?? String(dayOfWeek);
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted mt-1 text-sm">{description}</p>
      </div>
      {children}
    </section>
  );
}

async function runPilotDemoSetup(
  _prev: SetupActionState,
  formData: FormData,
): Promise<SetupActionState> {
  return ensurePilotDemoSetupAction(formData);
}

export function ClassroomOperationsWorkspace({
  data,
  classroomId,
  section = "overview",
}: {
  data: ClassroomOperationsData;
  classroomId?: string;
  section?: ClassroomOpsSection;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const visibleClassrooms = classroomId
    ? data.classrooms.filter((classroom) => classroom.id === classroomId)
    : data.classrooms;
  const defaultClassroomId = classroomId ?? visibleClassrooms[0]?.id ?? "";
  const [selectedScheduleId, setSelectedScheduleId] = useState(data.schedules[0]?.id ?? "");
  const [setupState, setupAction, setupPending] = useActionState(
    runPilotDemoSetup,
    initialSetupState,
  );

  const selectedSchedule = useMemo(
    () =>
      data.schedules.find((schedule) => schedule.id === selectedScheduleId) ?? data.schedules[0],
    [data.schedules, selectedScheduleId],
  );

  const show =
    section === "overview"
      ? {
          setup: true,
          schedules: true,
          blocks: true,
          notes: true,
          routines: true,
          announcements: true,
        }
      : {
          setup: section === "daily",
          schedules: section === "daily" || section === "schedules",
          blocks: section === "daily" || section === "schedules",
          notes: section === "daily" || section === "notes",
          routines: section === "daily" || section === "routines",
          announcements: section === "daily" || section === "announcements",
        };

  const hasWilliamsClassroom = data.classrooms.some(
    (classroom) => classroom.name === OWNER_CLASSROOM_NAME,
  );
  const codedStudentCount = data.students.filter((student) =>
    /^S[1-7]$/i.test(student.local_identifier || student.first_name),
  ).length;
  const needsSetup =
    !hasWilliamsClassroom ||
    codedStudentCount < 7 ||
    data.schedules.length === 0 ||
    data.scheduleBlocks.length === 0;

  return (
    <div className="space-y-8">
      <Alert
        title={section === "daily" ? "Daily Command Center" : "Classroom operations"}
        tone="info"
      >
        Start with <strong>{OWNER_CLASSROOM_NAME}</strong> and coded students <strong>S1–S7</strong>
        . Then add schedules, blocks, notes, routines, and announcements. Never enter real student
        or family PII during the pilot.
      </Alert>

      {show.setup ? (
        <Card>
          <CardTitle>Stand up {OWNER_CLASSROOM_NAME}</CardTitle>
          <CardDescription>
            One click creates <strong>Williams School</strong>, classroom{" "}
            <strong>{OWNER_CLASSROOM_NAME}</strong>, coded students <strong>S1–S7</strong>, a
            weekday schedule with time blocks, an arrival routine, and a staff announcement. Safe to
            run again — it only fills what is missing.
          </CardDescription>
          {data.organizationId ? (
            <form className="mt-4 space-y-3" action={setupAction}>
              <input type="hidden" name="organizationId" value={data.organizationId} />
              <Button type="submit" disabled={setupPending}>
                {setupPending
                  ? "Setting up…"
                  : needsSetup
                    ? `Create ${OWNER_CLASSROOM_NAME} + students S1–S7`
                    : "Refresh classroom setup"}
              </Button>
              {setupState.message ? (
                <Alert
                  title={setupState.status === "error" ? "Setup could not finish" : "Setup status"}
                  tone={setupState.status === "error" ? "warning" : "info"}
                >
                  {setupState.message}
                </Alert>
              ) : null}
            </form>
          ) : null}
          {!needsSetup ? (
            <p className="text-muted mt-3 text-sm">
              Ready: {OWNER_CLASSROOM_NAME} · {codedStudentCount} coded students (S1–S7) ·{" "}
              {data.schedules.length} schedule(s) · {data.scheduleBlocks.length} block(s).
            </p>
          ) : (
            <p className="text-muted mt-3 text-sm">
              Classroom dropdown stays empty until a classroom exists. Use the button above to
              create {OWNER_CLASSROOM_NAME} and connect students/schedules.
            </p>
          )}
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardTitle>{data.schedules.length}</CardTitle>
          <CardDescription>Schedules</CardDescription>
        </Card>
        <Card>
          <CardTitle>{data.scheduleBlocks.length}</CardTitle>
          <CardDescription>Schedule blocks</CardDescription>
        </Card>
        <Card>
          <CardTitle>{data.students.length}</CardTitle>
          <CardDescription>Students</CardDescription>
        </Card>
        <Card>
          <CardTitle>{data.dailyNotes.length}</CardTitle>
          <CardDescription>Daily notes</CardDescription>
        </Card>
      </div>

      {show.schedules ? (
        <Section
          id="schedules"
          title="1. Classroom schedule"
          description="Name the daily/weekly schedule for a classroom. You need this before adding time blocks."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardTitle>Create / save schedule</CardTitle>
              {data.permissions.canManageSchedules ? (
                visibleClassrooms.length === 0 ? (
                  <div className="mt-4 space-y-3">
                    <Alert title="No classroom in the dropdown yet" tone="warning">
                      There is nothing to choose until a classroom exists. Create{" "}
                      <strong>{OWNER_CLASSROOM_NAME}</strong> with the setup button above (adds
                      S1–S7 too), or add a classroom under{" "}
                      <Link href="/classrooms/new" className="font-semibold underline">
                        Classrooms → New
                      </Link>
                      .
                    </Alert>
                    {data.organizationId ? (
                      <form action={setupAction}>
                        <input type="hidden" name="organizationId" value={data.organizationId} />
                        <Button type="submit" disabled={setupPending}>
                          {setupPending
                            ? "Creating…"
                            : `Create ${OWNER_CLASSROOM_NAME} + S1–S7 now`}
                        </Button>
                      </form>
                    ) : null}
                  </div>
                ) : (
                  <form
                    action={submitAction(saveClassroomScheduleAction)}
                    className="mt-4 space-y-3"
                  >
                    <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
                    <input type="hidden" name="status" value="active" />
                    <FormField id="opsClassroomId" label="Classroom">
                      <Select
                        id="opsClassroomId"
                        name="classroomId"
                        defaultValue={defaultClassroomId}
                        required
                      >
                        <option value="">Choose classroom</option>
                        {visibleClassrooms.map((classroom) => (
                          <option key={classroom.id} value={classroom.id}>
                            {classroom.name}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                    <FormField id="scheduleName" label="Schedule name">
                      <Input
                        id="scheduleName"
                        name="name"
                        required
                        placeholder="e.g. Monday–Friday schedule"
                      />
                    </FormField>
                    <FormField id="academicYear" label="Academic year (optional)">
                      <Input id="academicYear" name="academicYear" placeholder="2025-2026" />
                    </FormField>
                    <Button type="submit">Save schedule</Button>
                  </form>
                )
              ) : (
                <div className="mt-4">
                  <Alert title="Permission needed" tone="warning">
                    Schedule management requires an authorized role.
                  </Alert>
                </div>
              )}
            </Card>

            <Card>
              <CardTitle>Saved schedules</CardTitle>
              <CardDescription>Pick a schedule when adding blocks below.</CardDescription>
              <TableShell
                className="mt-4"
                caption="Schedules"
                headers={["Name", "Classroom", "Status"]}
                emptyMessage="No schedules yet. Create one on the left."
                rows={data.schedules.map((schedule) => {
                  const classroom = data.classrooms.find(
                    (entry) => entry.id === schedule.classroom_id,
                  );
                  return [schedule.name, classroom?.name ?? "Classroom", schedule.status];
                })}
              />
            </Card>
          </div>
        </Section>
      ) : null}

      {show.blocks ? (
        <Section
          id="blocks"
          title="2. Schedule blocks"
          description="Add labeled time blocks (arrival, literacy, lunch, dismissal, etc.) to a saved schedule."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardTitle>Add schedule block</CardTitle>
              {data.permissions.canManageSchedules ? (
                data.schedules.length === 0 ? (
                  <div className="mt-4">
                    <Alert title="Save a schedule first" tone="warning">
                      Create a classroom schedule in section 1, then come back here to add time
                      blocks. Or create <strong>{OWNER_CLASSROOM_NAME}</strong> with the setup
                      button above to load a sample weekday.
                    </Alert>
                  </div>
                ) : (
                  <form
                    action={submitAction(addClassroomScheduleBlockAction)}
                    className="mt-4 space-y-3"
                  >
                    <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
                    <FormField id="blockScheduleId" label="Schedule">
                      <Select
                        id="blockScheduleId"
                        name="scheduleId"
                        required
                        value={selectedSchedule?.id ?? ""}
                        onChange={(event) => setSelectedScheduleId(event.target.value)}
                      >
                        {data.schedules.map((schedule) => (
                          <option key={schedule.id} value={schedule.id}>
                            {schedule.name}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                    <input
                      type="hidden"
                      name="classroomId"
                      value={selectedSchedule?.classroom_id ?? ""}
                    />
                    <FormField id="blockLabel" label="Block label">
                      <Input
                        id="blockLabel"
                        name="label"
                        required
                        placeholder="e.g. Literacy block"
                      />
                    </FormField>
                    <FormField id="blockDay" label="Day of week">
                      <Select id="blockDay" name="dayOfWeek" defaultValue="">
                        <option value="">All days</option>
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                        <option value="0">Sunday</option>
                      </Select>
                    </FormField>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField id="blockStart" label="Start">
                        <Input id="blockStart" name="startTime" type="time" required />
                      </FormField>
                      <FormField id="blockEnd" label="End">
                        <Input id="blockEnd" name="endTime" type="time" required />
                      </FormField>
                    </div>
                    <FormField id="blockType" label="Block type (optional)">
                      <Select id="blockType" name="blockType" defaultValue="instruction">
                        <option value="arrival">Arrival</option>
                        <option value="instruction">Instruction</option>
                        <option value="related_service">Related service</option>
                        <option value="transition">Transition</option>
                        <option value="lunch">Lunch</option>
                        <option value="recess">Recess / movement</option>
                        <option value="dismissal">Dismissal</option>
                        <option value="other">Other</option>
                      </Select>
                    </FormField>
                    <FormField id="blockLocation" label="Location (optional)">
                      <Input id="blockLocation" name="location" placeholder="Room / area" />
                    </FormField>
                    <Button type="submit" variant="secondary">
                      Add block
                    </Button>
                  </form>
                )
              ) : (
                <div className="mt-4">
                  <Alert title="Permission needed" tone="warning">
                    Schedule block management requires an authorized role.
                  </Alert>
                </div>
              )}
            </Card>
            <TableShell
              caption="Schedule blocks"
              headers={["Label", "Day", "Time", "Minutes"]}
              emptyMessage="No blocks yet. Add one on the left after you have a schedule."
              rows={data.scheduleBlocks.map((block) => [
                block.label,
                dayLabel(block.day_of_week),
                `${block.start_time}–${block.end_time}`,
                String(scheduleBlockDurationMinutes(block.start_time, block.end_time) ?? "—"),
              ])}
            />
          </div>
        </Section>
      ) : null}

      {show.notes ? (
        <Section
          id="notes"
          title="3. Daily student notes"
          description="Log a coded student note for the day. Choose the student — do not use real names in the pilot."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardTitle>Add daily note</CardTitle>
              {!data.permissions.canEnterDailyNotes ? (
                <div className="mt-4">
                  <Alert title="Permission needed" tone="warning">
                    Daily note entry is limited to authorized roles.
                  </Alert>
                </div>
              ) : data.students.length === 0 ? (
                <div className="mt-4 space-y-3">
                  <Alert title="Add students first" tone="warning">
                    There are no students yet. Create <strong>{OWNER_CLASSROOM_NAME}</strong> to add
                    coded students <strong>S1–S7</strong>, or add coded students under{" "}
                    <Link href="/students/new" className="font-semibold underline">
                      Students
                    </Link>
                    .
                  </Alert>
                  {data.organizationId ? (
                    <form action={setupAction}>
                      <input type="hidden" name="organizationId" value={data.organizationId} />
                      <Button type="submit" disabled={setupPending}>
                        {setupPending ? "Creating…" : "Create Williams SLC room 95 + S1–S7"}
                      </Button>
                    </form>
                  ) : null}
                </div>
              ) : (
                <form action={submitAction(saveDailyStudentNoteAction)} className="mt-4 space-y-3">
                  <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
                  <FormField id="noteStudentId" label="Student">
                    <Select id="noteStudentId" name="studentId" required defaultValue="">
                      <option value="">Choose student</option>
                      {data.students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {studentName(student)}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  <FormField id="noteDate" label="Date">
                    <Input
                      id="noteDate"
                      name="noteDate"
                      type="date"
                      defaultValue={today}
                      required
                    />
                  </FormField>
                  <FormField id="noteText" label="Note">
                    <Textarea
                      id="noteText"
                      name="noteText"
                      required
                      placeholder="e.g. S1 completed arrival routine with one visual prompt."
                    />
                  </FormField>
                  <FormField id="noteStatus" label="Status">
                    <Select id="noteStatus" name="status" defaultValue="draft">
                      <option value="draft">Draft</option>
                      {data.permissions.canFinalizeDailyNotes ? (
                        <option value="finalized">Finalized</option>
                      ) : null}
                    </Select>
                  </FormField>
                  <Button type="submit">Save daily note</Button>
                </form>
              )}
            </Card>
            <TableShell
              caption="Daily notes"
              headers={["Student", "Date", "Status"]}
              emptyMessage="No daily notes yet."
              rows={data.dailyNotes.map((note) => {
                const student = data.students.find((entry) => entry.id === note.student_id);
                return [
                  student ? studentName(student) : "Authorized student",
                  note.note_date,
                  note.status,
                ];
              })}
            />
          </div>
        </Section>
      ) : null}

      {show.routines ? (
        <Section
          id="routines"
          title="4. Classroom routines"
          description="Save classroom routines you want staff to follow (arrival, transitions, dismissal)."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardTitle>Add routine</CardTitle>
              {data.permissions.canManageRoutines ? (
                visibleClassrooms.length === 0 ? (
                  <div className="mt-4 space-y-3">
                    <Alert title="Create a classroom first" tone="warning">
                      Routines attach to classrooms. Create <strong>{OWNER_CLASSROOM_NAME}</strong>{" "}
                      first.
                    </Alert>
                    {data.organizationId ? (
                      <form action={setupAction}>
                        <input type="hidden" name="organizationId" value={data.organizationId} />
                        <Button type="submit" disabled={setupPending}>
                          {setupPending ? "Creating…" : `Create ${OWNER_CLASSROOM_NAME}`}
                        </Button>
                      </form>
                    ) : null}
                  </div>
                ) : (
                  <form
                    action={submitAction(saveClassroomRoutineAction)}
                    className="mt-4 space-y-3"
                  >
                    <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
                    <input type="hidden" name="status" value="active" />
                    <FormField id="routineClassroomId" label="Classroom">
                      <Select
                        id="routineClassroomId"
                        name="classroomId"
                        defaultValue={defaultClassroomId}
                        required
                      >
                        {visibleClassrooms.map((classroom) => (
                          <option key={classroom.id} value={classroom.id}>
                            {classroom.name}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                    <FormField id="routineName" label="Routine name">
                      <Input
                        id="routineName"
                        name="name"
                        required
                        placeholder="e.g. Arrival routine"
                      />
                    </FormField>
                    <FormField id="routineDescription" label="Description">
                      <Textarea
                        id="routineDescription"
                        name="description"
                        placeholder="Steps staff should follow…"
                      />
                    </FormField>
                    <Button type="submit" variant="secondary">
                      Save routine
                    </Button>
                  </form>
                )
              ) : (
                <div className="mt-4">
                  <Alert title="Permission needed" tone="warning">
                    Routine management requires an authorized role.
                  </Alert>
                </div>
              )}
            </Card>
            <TableShell
              caption="Routines"
              headers={["Name", "Classroom", "Status"]}
              emptyMessage="No routines yet."
              rows={data.routines.map((routine) => {
                const classroom = data.classrooms.find(
                  (entry) => entry.id === routine.classroom_id,
                );
                return [routine.name, classroom?.name ?? "Classroom", routine.status];
              })}
            />
          </div>
        </Section>
      ) : null}

      {show.announcements ? (
        <Section
          id="announcements"
          title="5. Classroom announcements"
          description="Staff-facing classroom notices only — never include student PII."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardTitle>Add announcement</CardTitle>
              {data.permissions.canManageAnnouncements ? (
                visibleClassrooms.length === 0 ? (
                  <div className="mt-4 space-y-3">
                    <Alert title="Create a classroom first" tone="warning">
                      Announcements attach to classrooms. Create{" "}
                      <strong>{OWNER_CLASSROOM_NAME}</strong> first.
                    </Alert>
                    {data.organizationId ? (
                      <form action={setupAction}>
                        <input type="hidden" name="organizationId" value={data.organizationId} />
                        <Button type="submit" disabled={setupPending}>
                          {setupPending ? "Creating…" : `Create ${OWNER_CLASSROOM_NAME}`}
                        </Button>
                      </form>
                    ) : null}
                  </div>
                ) : (
                  <form
                    action={submitAction(saveClassroomAnnouncementAction)}
                    className="mt-4 space-y-3"
                  >
                    <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
                    <input type="hidden" name="containsStudentPii" value="false" />
                    <FormField id="announcementClassroomId" label="Classroom">
                      <Select
                        id="announcementClassroomId"
                        name="classroomId"
                        defaultValue={defaultClassroomId}
                        required
                      >
                        {visibleClassrooms.map((classroom) => (
                          <option key={classroom.id} value={classroom.id}>
                            {classroom.name}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                    <FormField id="announcementTitle" label="Title">
                      <Input id="announcementTitle" name="title" required />
                    </FormField>
                    <FormField id="announcementBody" label="Body">
                      <Textarea id="announcementBody" name="body" required />
                    </FormField>
                    <FormField id="announcementAudience" label="Audience">
                      <Select id="announcementAudience" name="audience" defaultValue="staff">
                        <option value="staff">Staff</option>
                        <option value="family">Family</option>
                        <option value="all">All</option>
                      </Select>
                    </FormField>
                    <FormField id="announcementStatus" label="Status">
                      <Select id="announcementStatus" name="status" defaultValue="draft">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </Select>
                    </FormField>
                    <Button type="submit" variant="secondary">
                      Save announcement
                    </Button>
                  </form>
                )
              ) : (
                <div className="mt-4">
                  <Alert title="Permission needed" tone="warning">
                    Announcement management requires an authorized role.
                  </Alert>
                </div>
              )}
            </Card>
            <TableShell
              caption="Announcements"
              headers={["Title", "Audience", "Status"]}
              emptyMessage="No announcements yet."
              rows={data.announcements.map((announcement) => [
                announcement.title,
                announcement.audience,
                announcement.status,
              ])}
            />
          </div>
        </Section>
      ) : null}
    </div>
  );
}
