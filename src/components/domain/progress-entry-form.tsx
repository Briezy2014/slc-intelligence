"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { saveProgressSessionAction } from "@/lib/actions/progress";
import type { IepGoal, Student } from "@/lib/supabase/types";

function submitAction(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
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
  const [studentId, setStudentId] = useState("");
  const [goalId, setGoalId] = useState("");

  const studentGoals = useMemo(
    () => (studentId ? goals.filter((goal) => goal.student_id === studentId) : []),
    [goals, studentId],
  );

  const selectedGoal = studentGoals.find((goal) => goal.id === goalId);

  return (
    <div className="space-y-4">
      {students.length === 0 ? (
        <Alert title="Create a student first" tone="warning">
          Rapid Progress pulls from your student roster. Go to{" "}
          <Link href="/students/new" className="font-semibold underline">
            Students → New student
          </Link>
          , then create an IEP cycle and goal before entering progress.
        </Alert>
      ) : null}
      {students.length > 0 && goals.length === 0 ? (
        <Alert title="No goals yet" tone="warning">
          Goals are created per student (not on this page). Open a student → Goals, pick a starter
          template or write a custom goal, then return here.
        </Alert>
      ) : null}
      <form action={submitAction(saveProgressSessionAction)} className="space-y-4">
        <input type="hidden" name="organizationId" value={organizationId} />
        <FormField id="studentId" label="Student">
          <Select
            id="studentId"
            name="studentId"
            required
            value={studentId}
            onChange={(event) => {
              setStudentId(event.target.value);
              setGoalId("");
            }}
          >
            <option value="">Choose a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.last_name}, {student.preferred_name || student.first_name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField id="goalId" label="Goal">
          <Select
            id="goalId"
            name="goalId"
            required
            value={goalId}
            onChange={(event) => setGoalId(event.target.value)}
            disabled={!studentId}
          >
            <option value="">
              {!studentId
                ? "Choose a student first"
                : studentGoals.length === 0
                  ? "No goals for this student yet"
                  : "Choose a goal"}
            </option>
            {studentGoals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.goal_area}: {goal.goal_statement.slice(0, 80)}
                {goal.goal_statement.length > 80 ? "…" : ""}
              </option>
            ))}
          </Select>
        </FormField>
        {selectedGoal ? (
          <p className="text-muted text-sm">Selected measurement type suggestion: {selectedGoal.measurement_type}</p>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField id="sessionDate" label="Session date">
            <Input id="sessionDate" name="sessionDate" type="date" required defaultValue={today} />
          </FormField>
          <FormField id="measurementType" label="Measurement type">
            <Select
              id="measurementType"
              name="measurementType"
              defaultValue={selectedGoal?.measurement_type ?? "percentage"}
              key={selectedGoal?.id ?? "measurement-default"}
            >
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
        <Button type="submit" disabled={students.length === 0 || studentGoals.length === 0}>
          Save progress session
        </Button>
      </form>
    </div>
  );
}
