"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { FormField } from "@/components/forms/form-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  saveStudentClassroomAssignmentAction,
  saveStudentStaffAssignmentAction,
} from "@/lib/actions/students";
import type {
  Classroom,
  StudentClassroomAssignment,
  StudentStaffAssignment,
  UserProfile,
} from "@/lib/supabase/types";

const STAFF_ROLE_LABELS: Record<string, string> = {
  case_manager: "Case manager",
  intervention_specialist: "Intervention specialist",
  related_service_provider: "Related service provider",
  paraprofessional: "Paraprofessional",
  teacher: "Teacher",
  other: "Other",
};

export function StudentPlacementCard({
  organizationId,
  studentId,
  classrooms,
  staff,
  classroomAssignments,
  staffAssignments,
}: {
  organizationId: string;
  studentId: string;
  classrooms: Classroom[];
  staff: UserProfile[];
  classroomAssignments: StudentClassroomAssignment[];
  staffAssignments: StudentStaffAssignment[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ tone: "success" | "danger"; text: string } | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const classroomName = (id: string) =>
    classrooms.find((classroom) => classroom.id === id)?.name ?? "Classroom";
  const staffName = (id: string) =>
    staff.find((profile) => profile.id === id)?.display_name ?? "Staff member";

  const activeClassrooms = classroomAssignments.filter((row) => row.status === "active");
  const activeStaff = staffAssignments.filter((row) => row.status === "active");

  function runAction(
    action: (formData: FormData) => Promise<{ status: string; message?: string }>,
    formData: FormData,
    successText: string,
  ) {
    setMessage(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result.status === "success") {
        setMessage({ tone: "success", text: result.message ?? successText });
        router.refresh();
      } else {
        setMessage({
          tone: "danger",
          text: result.message ?? "Could not save. Try again.",
        });
      }
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold">Current classroom & team</h3>
        <p className="text-muted mt-1 text-sm">
          Who works with this student day to day. Names shown below — not database IDs.
        </p>
        {activeClassrooms.length === 0 && activeStaff.length === 0 ? (
          <p className="text-muted mt-3 text-sm">No classroom or staff assigned yet.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {activeClassrooms.map((row) => (
              <li key={row.id}>
                <span className="font-medium">Classroom:</span> {classroomName(row.classroom_id)}
              </li>
            ))}
            {activeStaff.map((row) => (
              <li key={row.id}>
                <span className="font-medium">
                  {STAFF_ROLE_LABELS[row.assignment_role] ?? row.assignment_role}:
                </span>{" "}
                {staffName(row.user_id)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            runAction(
              saveStudentClassroomAssignmentAction,
              new FormData(event.currentTarget),
              "Classroom saved.",
            );
          }}
        >
          <input type="hidden" name="organizationId" value={organizationId} />
          <input type="hidden" name="studentId" value={studentId} />
          <input type="hidden" name="status" value="active" />
          <input type="hidden" name="startDate" value={today} />
          <FormField id="classroomId" label="Assign classroom">
            <Select id="classroomId" name="classroomId" required>
              <option value="">Choose classroom</option>
              {classrooms.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
            </Select>
          </FormField>
          <Button type="submit" disabled={pending || classrooms.length === 0}>
            Save classroom
          </Button>
        </form>

        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            runAction(
              saveStudentStaffAssignmentAction,
              new FormData(event.currentTarget),
              "Staff assignment saved.",
            );
          }}
        >
          <input type="hidden" name="organizationId" value={organizationId} />
          <input type="hidden" name="studentId" value={studentId} />
          <input type="hidden" name="status" value="active" />
          <input type="hidden" name="startDate" value={today} />
          <FormField id="userId" label="Assign staff">
            <Select id="userId" name="userId" required>
              <option value="">Choose staff</option>
              {staff.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.display_name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField id="assignmentRole" label="Role">
            <Select id="assignmentRole" name="assignmentRole" defaultValue="case_manager">
              {Object.entries(STAFF_ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </FormField>
          <Button type="submit" disabled={pending || staff.length === 0}>
            Save staff
          </Button>
        </form>
      </div>

      {message ? (
        <Alert title={message.tone === "success" ? "Saved" : "Could not save"} tone={message.tone}>
          {message.text}
        </Alert>
      ) : null}
    </div>
  );
}
