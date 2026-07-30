import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveClassroomAction } from "@/lib/actions/classrooms";
import { saveIepCycleAction, saveObjectiveAction } from "@/lib/actions/goals";
import { createInvitationAction } from "@/lib/actions/invitations";
import { updateMemberAction } from "@/lib/actions/members";
import { saveProgramAction } from "@/lib/actions/programs";
import { saveSchoolAction } from "@/lib/actions/schools";
import {
  saveStudentClassroomAssignmentAction,
  saveStudentEnrollmentAction,
  saveStudentProgramAssignmentAction,
  saveStudentStaffAssignmentAction,
  saveStudentAction,
} from "@/lib/actions/students";
import { ROLE_LABELS } from "@/lib/permissions/matrix";
import type {
  Classroom,
  Program,
  RoleCode,
  School,
  Student,
  UserProfile,
} from "@/lib/supabase/types";

export { GoalForm } from "@/components/domain/goal-form";
export { ProgressEntryForm } from "@/components/domain/progress-entry-form";

function submitAction(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
}

function StatusOptions() {
  return (
    <>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="archived">Archived</option>
    </>
  );
}

export function SchoolForm({ organizationId, school }: { organizationId: string; school?: School | null }) {
  return (
    <form action={submitAction(saveSchoolAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />
      {school ? <input type="hidden" name="schoolId" value={school.id} /> : null}
      <FormField id="name" label="School name">
        <Input id="name" name="name" required defaultValue={school?.name ?? ""} />
      </FormField>
      <FormField id="schoolCode" label="School code" description="Optional local code.">
        <Input id="schoolCode" name="schoolCode" defaultValue={school?.school_code ?? ""} />
      </FormField>
      <FormField id="schoolType" label="School type">
        <Select id="schoolType" name="schoolType" defaultValue={school?.school_type ?? "public"}>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="charter">Charter</option>
          <option value="other">Other</option>
        </Select>
      </FormField>
      <FormField id="status" label="Status">
        <Select id="status" name="status" defaultValue={school?.status ?? "active"}>
          <StatusOptions />
        </Select>
      </FormField>
      <Button type="submit">{school ? "Save school" : "Create school"}</Button>
    </form>
  );
}

export function ProgramForm({
  organizationId,
  program,
  schools,
}: {
  organizationId: string;
  program?: Program | null;
  schools: School[];
}) {
  return (
    <form action={submitAction(saveProgramAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />
      {program ? <input type="hidden" name="programId" value={program.id} /> : null}
      <FormField id="name" label="Program name">
        <Input id="name" name="name" required defaultValue={program?.name ?? ""} />
      </FormField>
      <FormField id="schoolId" label="School" description="Optional for organization-wide programs.">
        <Select id="schoolId" name="schoolId" defaultValue={program?.school_id ?? ""}>
          <option value="">Organization-wide</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>{school.name}</option>
          ))}
        </Select>
      </FormField>
      <FormField id="programType" label="Program type">
        <Select id="programType" name="programType" defaultValue={program?.program_type ?? "specialized_learning"}>
          <option value="specialized_learning">Specialized learning</option>
          <option value="related_services">Related services</option>
          <option value="inclusion">Inclusion</option>
          <option value="other">Other</option>
        </Select>
      </FormField>
      <FormField id="description" label="Description">
        <Textarea id="description" name="description" defaultValue={program?.description ?? ""} />
      </FormField>
      <FormField id="status" label="Status">
        <Select id="status" name="status" defaultValue={program?.status ?? "active"}>
          <StatusOptions />
        </Select>
      </FormField>
      <Button type="submit">{program ? "Save program" : "Create program"}</Button>
    </form>
  );
}

export function ClassroomForm({
  organizationId,
  classroom,
  schools,
  programs,
}: {
  organizationId: string;
  classroom?: Classroom | null;
  schools: School[];
  programs: Program[];
}) {
  return (
    <form action={submitAction(saveClassroomAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />
      {classroom ? <input type="hidden" name="classroomId" value={classroom.id} /> : null}
      <FormField id="name" label="Classroom name">
        <Input id="name" name="name" required defaultValue={classroom?.name ?? ""} />
      </FormField>
      <FormField id="schoolId" label="School">
        <Select id="schoolId" name="schoolId" required defaultValue={classroom?.school_id ?? ""}>
          <option value="">Choose a school</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>{school.name}</option>
          ))}
        </Select>
      </FormField>
      <FormField id="programId" label="Program">
        <Select id="programId" name="programId" defaultValue={classroom?.program_id ?? ""}>
          <option value="">No program</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>{program.name}</option>
          ))}
        </Select>
      </FormField>
      <FormField id="academicYear" label="Academic year">
        <Input id="academicYear" name="academicYear" defaultValue={classroom?.academic_year ?? ""} />
      </FormField>
      <FormField id="description" label="Description">
        <Textarea id="description" name="description" defaultValue={classroom?.description ?? ""} />
      </FormField>
      <FormField id="status" label="Status">
        <Select id="status" name="status" defaultValue={classroom?.status ?? "active"}>
          <StatusOptions />
        </Select>
      </FormField>
      <Button type="submit">{classroom ? "Save classroom" : "Create classroom"}</Button>
    </form>
  );
}

export function StudentForm({ organizationId, student }: { organizationId: string; student?: Student | null }) {
  return (
    <form action={submitAction(saveStudentAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />
      {student ? <input type="hidden" name="studentId" value={student.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="firstName" label="First name">
          <Input id="firstName" name="firstName" required defaultValue={student?.first_name ?? ""} />
        </FormField>
        <FormField id="lastName" label="Last name">
          <Input id="lastName" name="lastName" required defaultValue={student?.last_name ?? ""} />
        </FormField>
      </div>
      <FormField id="preferredName" label="Preferred name">
        <Input id="preferredName" name="preferredName" defaultValue={student?.preferred_name ?? ""} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="localIdentifier" label="Local identifier">
          <Input id="localIdentifier" name="localIdentifier" required defaultValue={student?.local_identifier ?? ""} />
        </FormField>
        <FormField id="gradeLevel" label="Grade level">
          <Input id="gradeLevel" name="gradeLevel" defaultValue={student?.grade_level ?? ""} />
        </FormField>
      </div>
      <FormField id="enrollmentStatus" label="Enrollment status">
        <Select id="enrollmentStatus" name="enrollmentStatus" defaultValue={student?.enrollment_status ?? "active"}>
          <StatusOptions />
        </Select>
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="startDate" label="Start date">
          <Input id="startDate" name="startDate" type="date" defaultValue={student?.start_date ?? ""} />
        </FormField>
        <FormField id="endDate" label="End date">
          <Input id="endDate" name="endDate" type="date" defaultValue={student?.end_date ?? ""} />
        </FormField>
      </div>
      <Button type="submit">{student ? "Save student" : "Create student"}</Button>
    </form>
  );
}

export function IepCycleForm({ organizationId, studentId }: { organizationId: string; studentId: string }) {
  return (
    <form action={submitAction(saveIepCycleAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />
      <input type="hidden" name="studentId" value={studentId} />
      <FormField id="label" label="IEP cycle label">
        <Input id="label" name="label" required placeholder="2026 annual IEP" />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="startDate" label="Start date">
          <Input id="startDate" name="startDate" type="date" required />
        </FormField>
        <FormField id="endDate" label="End date">
          <Input id="endDate" name="endDate" type="date" />
        </FormField>
        <FormField id="reviewDate" label="Review date">
          <Input id="reviewDate" name="reviewDate" type="date" />
        </FormField>
      </div>
      <input type="hidden" name="status" value="active" />
      <Button type="submit">Create IEP cycle</Button>
    </form>
  );
}

export function ObjectiveForm({ organizationId, goalId }: { organizationId: string; goalId: string }) {
  return (
    <form action={submitAction(saveObjectiveAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />
      <input type="hidden" name="goalId" value={goalId} />
      <FormField id="sequenceNo" label="Sequence number">
        <Input id="sequenceNo" name="sequenceNo" type="number" defaultValue="1" min="1" />
      </FormField>
      <FormField id="objectiveStatement" label="Objective statement">
        <Textarea id="objectiveStatement" name="objectiveStatement" required />
      </FormField>
      <input type="hidden" name="status" value="active" />
      <Button type="submit">Add objective</Button>
    </form>
  );
}

export function MemberForm({ organizationId }: { organizationId: string }) {
  return (
    <form action={submitAction(updateMemberAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />
      <FormField id="userId" label="User ID">
        <Input id="userId" name="userId" required />
      </FormField>
      <FormField id="roleCode" label="Role">
        <Select id="roleCode" name="roleCode">
          {Object.entries(ROLE_LABELS).map(([code, label]) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </Select>
      </FormField>
      <input type="hidden" name="status" value="active" />
      <Button type="submit">Update member</Button>
    </form>
  );
}

export function InvitationForm({ organizationId }: { organizationId: string }) {
  return (
    <form action={submitAction(createInvitationAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />
      <FormField id="email" label="Email">
        <Input id="email" name="email" type="email" required placeholder="fictional.user@example.test" />
      </FormField>
      <FormField id="roleCode" label="Role">
        <Select id="roleCode" name="roleCode">
          {Object.entries(ROLE_LABELS).map(([code, label]) => (
            <option key={code as RoleCode} value={code}>{label}</option>
          ))}
        </Select>
      </FormField>
      <Button type="submit">Record invitation</Button>
    </form>
  );
}

export function AssignmentForms({
  organizationId,
  studentId,
  schools,
  programs,
  classrooms,
  staff,
}: {
  organizationId: string;
  studentId: string;
  schools: School[];
  programs: Program[];
  classrooms: Classroom[];
  staff: UserProfile[];
}) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={submitAction(saveStudentEnrollmentAction)} className="space-y-3">
        <input type="hidden" name="organizationId" value={organizationId} />
        <input type="hidden" name="studentId" value={studentId} />
        <input type="hidden" name="status" value="active" />
        <input type="hidden" name="startDate" value={today} />
        <FormField id="schoolId" label="Add school enrollment">
          <Select id="schoolId" name="schoolId" required>
            <option value="">Choose school</option>
            {schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
          </Select>
        </FormField>
        <Button type="submit">Add enrollment</Button>
      </form>
      <form action={submitAction(saveStudentProgramAssignmentAction)} className="space-y-3">
        <input type="hidden" name="organizationId" value={organizationId} />
        <input type="hidden" name="studentId" value={studentId} />
        <input type="hidden" name="status" value="active" />
        <input type="hidden" name="startDate" value={today} />
        <FormField id="programId" label="Add program assignment">
          <Select id="programId" name="programId" required>
            <option value="">Choose program</option>
            {programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}
          </Select>
        </FormField>
        <Button type="submit">Add program</Button>
      </form>
      <form action={submitAction(saveStudentClassroomAssignmentAction)} className="space-y-3">
        <input type="hidden" name="organizationId" value={organizationId} />
        <input type="hidden" name="studentId" value={studentId} />
        <input type="hidden" name="status" value="active" />
        <input type="hidden" name="startDate" value={today} />
        <FormField id="classroomId" label="Add classroom assignment">
          <Select id="classroomId" name="classroomId" required>
            <option value="">Choose classroom</option>
            {classrooms.map((classroom) => <option key={classroom.id} value={classroom.id}>{classroom.name}</option>)}
          </Select>
        </FormField>
        <Button type="submit">Add classroom</Button>
      </form>
      <form action={submitAction(saveStudentStaffAssignmentAction)} className="space-y-3">
        <input type="hidden" name="organizationId" value={organizationId} />
        <input type="hidden" name="studentId" value={studentId} />
        <input type="hidden" name="status" value="active" />
        <input type="hidden" name="startDate" value={today} />
        <input type="hidden" name="assignmentRole" value="case_manager" />
        <FormField id="userId" label="Add staff assignment">
          <Select id="userId" name="userId" required>
            <option value="">Choose staff</option>
            {staff.map((profile) => <option key={profile.id} value={profile.id}>{profile.display_name}</option>)}
          </Select>
        </FormField>
        <Button type="submit">Add staff</Button>
      </form>
    </div>
  );
}
