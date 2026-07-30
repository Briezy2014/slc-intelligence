import Link from "next/link";
import { EmptyState } from "@/components/feedback/empty-state";
import { Badge } from "@/components/ui/badge";
import type { Classroom, IepGoal, Program, School, Student } from "@/lib/supabase/types";

function StatusBadge({ status }: { status: string }) {
  const tone = status === "active" ? "success" : status === "archived" ? "warning" : "neutral";
  return <Badge tone={tone}>{status.replaceAll("_", " ")}</Badge>;
}

function LinkedTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="border-border overflow-x-auto rounded-[var(--radius-lg)] border">
      <table className="min-w-full border-collapse text-left text-sm">
        <caption className="border-border bg-surface-subtle text-foreground border-b px-4 py-3 text-left font-semibold">
          {caption}
        </caption>
        <thead className="bg-background-elevated">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="border-border border-b px-4 py-3 font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-background-elevated even:bg-surface-subtle/40">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border-border text-muted border-b px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SchoolList({ schools }: { schools: School[] }) {
  if (schools.length === 0) {
    return (
      <EmptyState
        title="No schools found"
        description="Create a school to organize programs, classrooms, and students."
      />
    );
  }

  return (
    <LinkedTable
      caption="Schools"
      headers={["Name", "Code", "Type", "Status", "Updated"]}
      rows={schools.map((school) => [
        <Link
          key={school.id}
          href={`/schools/${school.id}`}
          className="text-accent font-semibold hover:underline"
        >
          {school.name}
        </Link>,
        school.school_code ?? "Not set",
        school.school_type,
        <StatusBadge key={`${school.id}-status`} status={school.status} />,
        new Date(school.updated_at).toLocaleDateString(),
      ])}
    />
  );
}

export function ProgramList({ programs, schools }: { programs: Program[]; schools: School[] }) {
  if (programs.length === 0) {
    return (
      <EmptyState
        title="No programs found"
        description="Create programs to group specialized learning and service models."
      />
    );
  }

  return (
    <LinkedTable
      caption="Programs"
      headers={["Name", "School", "Type", "Status"]}
      rows={programs.map((program) => [
        <Link
          key={program.id}
          href={`/programs/${program.id}`}
          className="text-accent font-semibold hover:underline"
        >
          {program.name}
        </Link>,
        schools.find((school) => school.id === program.school_id)?.name ?? "Organization-wide",
        program.program_type.replaceAll("_", " "),
        <StatusBadge key={`${program.id}-status`} status={program.status} />,
      ])}
    />
  );
}

export function ClassroomList({
  classrooms,
  schools,
  programs,
}: {
  classrooms: Classroom[];
  schools: School[];
  programs: Program[];
}) {
  if (classrooms.length === 0) {
    return (
      <EmptyState
        title="No classrooms found"
        description="Create classrooms to scope staff and student assignments."
      />
    );
  }

  return (
    <LinkedTable
      caption="Classrooms"
      headers={["Name", "School", "Program", "Academic year", "Status"]}
      rows={classrooms.map((classroom) => [
        <Link
          key={classroom.id}
          href={`/classrooms/${classroom.id}`}
          className="text-accent font-semibold hover:underline"
        >
          {classroom.name}
        </Link>,
        schools.find((school) => school.id === classroom.school_id)?.name ?? "Unknown school",
        programs.find((program) => program.id === classroom.program_id)?.name ?? "Not assigned",
        classroom.academic_year ?? "Not set",
        <StatusBadge key={`${classroom.id}-status`} status={classroom.status} />,
      ])}
    />
  );
}

export function StudentList({ students }: { students: Student[] }) {
  if (students.length === 0) {
    return (
      <EmptyState
        title="No students found"
        description="No authorized student records match the current filters."
      />
    );
  }

  return (
    <LinkedTable
      caption="Students"
      headers={["Student", "Local ID", "Grade", "Status", "Start date"]}
      rows={students.map((student) => [
        <Link
          key={student.id}
          href={`/students/${student.id}`}
          className="text-accent font-semibold hover:underline"
        >
          {student.last_name}, {student.preferred_name || student.first_name}
        </Link>,
        student.local_identifier,
        student.grade_level ?? "Not set",
        <StatusBadge key={`${student.id}-status`} status={student.enrollment_status} />,
        student.start_date ?? "Not set",
      ])}
    />
  );
}

export function GoalList({
  goals,
  students,
  createHref,
}: {
  goals: IepGoal[];
  students: Student[];
  createHref?: string;
}) {
  if (goals.length === 0) {
    return (
      <EmptyState
        title="No goals yet"
        description="Open a student Goals page, choose grade + subject to load recommended learning progressions (ELA, math, functional math, ASL, and more), then save a goal. Or create a demo student to try it immediately."
        actionLabel={createHref ? "Go to students / create demo" : undefined}
        actionHref={createHref}
      />
    );
  }

  return (
    <LinkedTable
      caption="IEP goals"
      headers={["Goal", "Student", "Measurement", "Target", "Status"]}
      rows={goals.map((goal) => {
        const student = students.find((entry) => entry.id === goal.student_id);
        return [
          <Link
            key={goal.id}
            href={`/goals/${goal.id}`}
            className="text-accent font-semibold hover:underline"
          >
            {goal.goal_area}
          </Link>,
          student
            ? `${student.last_name}, ${student.preferred_name || student.first_name}`
            : "Authorized student",
          goal.measurement_type.replaceAll("_", " "),
          goal.target_value === null
            ? "Not set"
            : `${goal.target_value} (${goal.target_direction})`,
          <StatusBadge key={`${goal.id}-status`} status={goal.status} />,
        ];
      })}
    />
  );
}
