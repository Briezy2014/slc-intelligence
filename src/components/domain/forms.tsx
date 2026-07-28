import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveClassroomAction } from "@/lib/actions/classrooms";
import { saveGoalAction, saveIepCycleAction, saveObjectiveAction } from "@/lib/actions/goals";
import { createInvitationAction } from "@/lib/actions/invitations";
import { updateMemberAction } from "@/lib/actions/members";
import { saveProgramAction } from "@/lib/actions/programs";
import { saveProgressSessionAction } from "@/lib/actions/progress";
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
  IepCycle,
  IepGoal,
  Program,
  RoleCode,
  School,
  Student,
  UserProfile,
} from "@/lib/supabase/types";

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

export function GoalForm({
  organizationId,
  studentId,
  cycles,
  goal,
}: {
  organizationId: string;
  studentId: string;
  cycles: IepCycle[];
  goal?: IepGoal | null;
}) {
  return (
    <form action={submitAction(saveGoalAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />
      <input type="hidden" name="studentId" value={studentId} />
      {goal ? <input type="hidden" name="goalId" value={goal.id} /> : null}
      <FormField id="iepCycleId" label="IEP cycle">
        <Select id="iepCycleId" name="iepCycleId" required defaultValue={goal?.iep_cycle_id ?? ""}>
          <option value="">Choose an IEP cycle</option>
          {cycles.filter((cycle) => cycle.student_id === studentId).map((cycle) => (
            <option key={cycle.id} value={cycle.id}>{cycle.label}</option>
          ))}
        </Select>
      </FormField>
      <FormField id="goalArea" label="Goal area">
        <Input id="goalArea" name="goalArea" required defaultValue={goal?.goal_area ?? ""} />
      </FormField>
      <FormField id="goalStatement" label="Goal statement">
        <Textarea id="goalStatement" name="goalStatement" required defaultValue={goal?.goal_statement ?? ""} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="measurementType" label="Measurement type">
          <Select id="measurementType" name="measurementType" defaultValue={goal?.measurement_type ?? "percentage"}>
            <option value="percentage">Percentage</option>
            <option value="frequency">Frequency</option>
            <option value="rate">Rate</option>
            <option value="duration">Duration</option>
            <option value="latency">Latency</option>
            <option value="rubric">Rubric</option>
            <option value="prompt_level">Prompt level</option>
            <option value="task_analysis">Task analysis</option>
            <option value="reading_fluency">Reading fluency</option>
            <option value="reading_accuracy">Reading accuracy</option>
            <option value="independence">Independence</option>
            <option value="custom_numeric">Custom numeric</option>
          </Select>
        </FormField>
        <FormField id="targetDirection" label="Target direction">
          <Select id="targetDirection" name="targetDirection" defaultValue={goal?.target_direction ?? "increase"}>
            <option value="increase">Increase</option>
            <option value="decrease">Decrease</option>
          </Select>
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="targetValue" label="Target value">
          <Input id="targetValue" name="targetValue" type="number" step="any" defaultValue={goal?.target_value ?? ""} />
        </FormField>
        <FormField id="startDate" label="Start date">
          <Input id="startDate" name="startDate" type="date" defaultValue={goal?.start_date ?? ""} />
        </FormField>
        <FormField id="targetDate" label="Target date">
          <Input id="targetDate" name="targetDate" type="date" defaultValue={goal?.target_date ?? ""} />
        </FormField>
      </div>
      <FormField id="unitOfMeasurement" label="Unit of measurement">
        <Input id="unitOfMeasurement" name="unitOfMeasurement" defaultValue={goal?.unit_of_measurement ?? ""} />
      </FormField>
      <FormField id="evaluationFrequency" label="Evaluation frequency">
        <Input id="evaluationFrequency" name="evaluationFrequency" defaultValue={goal?.evaluation_frequency ?? ""} />
      </FormField>
      <input type="hidden" name="status" value={goal?.status ?? "active"} />
      <Button type="submit">{goal ? "Save goal" : "Create goal"}</Button>
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

export function ProgressEntryForm({
  organizationId,
  students,
  goals,
}: {
  organizationId: string;
  students: Student[];
  goals: IepGoal[];
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={submitAction(saveProgressSessionAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />
      <FormField id="studentId" label="Student">
        <Select id="studentId" name="studentId" required>
          <option value="">Choose a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>{student.last_name}, {student.preferred_name || student.first_name}</option>
          ))}
        </Select>
      </FormField>
      <FormField id="goalId" label="Goal">
        <Select id="goalId" name="goalId" required>
          <option value="">Choose a goal</option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>{goal.goal_area}</option>
          ))}
        </Select>
      </FormField>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="sessionDate" label="Session date">
          <Input id="sessionDate" name="sessionDate" type="date" required defaultValue={today} />
        </FormField>
        <FormField id="measurementType" label="Measurement type">
          <Select id="measurementType" name="measurementType" defaultValue="percentage">
            <option value="percentage">Percentage</option>
            <option value="reading_accuracy">Reading accuracy</option>
            <option value="reading_fluency">Reading fluency</option>
            <option value="frequency">Frequency</option>
            <option value="rate">Rate</option>
            <option value="duration">Duration</option>
            <option value="latency">Latency</option>
            <option value="rubric">Rubric</option>
            <option value="prompt_level">Prompt level</option>
            <option value="task_analysis">Task analysis</option>
            <option value="independence">Independence</option>
            <option value="custom_numeric">Custom numeric</option>
          </Select>
        </FormField>
        <FormField id="status" label="Status">
          <Select id="status" name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="finalized">Finalized</option>
          </Select>
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <FormField id="correctCount" label="Correct count">
          <Input id="correctCount" name="correctCount" type="number" min="0" defaultValue="0" />
        </FormField>
        <FormField id="totalOpportunities" label="Total opportunities">
          <Input id="totalOpportunities" name="totalOpportunities" type="number" min="1" defaultValue="1" />
        </FormField>
        <FormField id="countValue" label="Count value">
          <Input id="countValue" name="countValue" type="number" min="0" defaultValue="0" />
        </FormField>
        <FormField id="observationDurationSeconds" label="Duration seconds">
          <Input id="observationDurationSeconds" name="observationDurationSeconds" type="number" min="1" defaultValue="60" />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <FormField id="wordsRead" label="Words read">
          <Input id="wordsRead" name="wordsRead" type="number" min="0" defaultValue="0" />
        </FormField>
        <FormField id="errorCount" label="Errors">
          <Input id="errorCount" name="errorCount" type="number" min="0" defaultValue="0" />
        </FormField>
        <FormField id="readingTimeSeconds" label="Reading seconds">
          <Input id="readingTimeSeconds" name="readingTimeSeconds" type="number" min="1" defaultValue="60" />
        </FormField>
        <FormField id="rateUnit" label="Rate unit">
          <Select id="rateUnit" name="rateUnit" defaultValue="per_minute">
            <option value="per_minute">Per minute</option>
            <option value="per_hour">Per hour</option>
          </Select>
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <FormField id="durationValue" label="Duration value">
          <Input id="durationValue" name="durationValue" type="number" min="0" defaultValue="0" />
        </FormField>
        <FormField id="latencyValue" label="Latency value">
          <Input id="latencyValue" name="latencyValue" type="number" min="0" defaultValue="0" />
        </FormField>
        <FormField id="rubricScore" label="Rubric score">
          <Input id="rubricScore" name="rubricScore" type="number" min="0" defaultValue="0" />
        </FormField>
        <FormField id="independenceValue" label="Independence value">
          <Input id="independenceValue" name="independenceValue" type="number" min="0" defaultValue="0" />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <FormField id="promptLevel" label="Prompt level">
          <Input id="promptLevel" name="promptLevel" defaultValue="unspecified" />
        </FormField>
        <FormField id="customNumericValue" label="Custom numeric value">
          <Input id="customNumericValue" name="customNumericValue" type="number" step="any" defaultValue="0" />
        </FormField>
        <FormField id="customUnit" label="Custom unit">
          <Input id="customUnit" name="customUnit" defaultValue="units" />
        </FormField>
        <FormField id="higherIsBetter" label="Direction">
          <Select id="higherIsBetter" name="higherIsBetter" defaultValue="true">
            <option value="true">Higher is better</option>
            <option value="false">Lower is better</option>
          </Select>
        </FormField>
      </div>
      <input type="hidden" name="durationUnit" value="minutes" />
      <input type="hidden" name="latencyUnit" value="seconds" />
      <input type="hidden" name="taskIndependentSteps" value="0" />
      <input type="hidden" name="taskPromptedSteps" value="0" />
      <input type="hidden" name="taskIncorrectSteps" value="0" />
      <input type="hidden" name="taskNotAttemptedSteps" value="0" />
      <FormField id="setting" label="Setting">
        <Input id="setting" name="setting" />
      </FormField>
      <FormField id="activity" label="Activity">
        <Input id="activity" name="activity" />
      </FormField>
      <FormField id="notes" label="Notes">
        <Textarea id="notes" name="notes" />
      </FormField>
      <Button type="submit">Save progress session</Button>
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
