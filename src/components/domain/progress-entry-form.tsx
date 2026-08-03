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

function studentLabel(student: Student) {
  return `${student.last_name}, ${student.preferred_name || student.first_name}${
    student.local_identifier ? ` (${student.local_identifier})` : ""
  }`;
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
  const [measurementType, setMeasurementType] = useState("percentage");

  const studentGoals = useMemo(
    () => (studentId ? goals.filter((goal) => goal.student_id === studentId) : []),
    [goals, studentId],
  );

  const selectedGoal = studentGoals.find((goal) => goal.id === goalId);

  return (
    <div className="space-y-4">
      <Alert title="What this page is for" tone="info">
        Enter today’s progress numbers for a student goal (correct/total, fluency, etc.). This is
        not a checklist generator — pick <strong>student → goal</strong>, enter the score, save. Use
        student Goals first if none exist yet.
      </Alert>

      {students.length === 0 ? (
        <Alert title="Create a student first" tone="warning">
          Go to{" "}
          <Link href="/students/new" className="font-semibold underline">
            Students → New student
          </Link>
          , then create an IEP cycle and goal before entering progress.
        </Alert>
      ) : null}

      {students.length > 0 && goals.length === 0 ? (
        <Alert title="No goals yet" tone="warning">
          Goals are created on the student record. Open{" "}
          <Link href="/students" className="font-semibold underline">
            Students
          </Link>{" "}
          → pick a student → Goals → choose a starter template, then return here.
        </Alert>
      ) : null}

      {studentId && studentGoals.length === 0 ? (
        <Alert title="This student has no goals yet" tone="warning">
          Open{" "}
          <Link href={`/students/${studentId}/goals`} className="font-semibold underline">
            this student’s Goals
          </Link>{" "}
          to add one, then come back.
        </Alert>
      ) : null}

      <form action={submitAction(saveProgressSessionAction)} className="space-y-4">
        <input type="hidden" name="organizationId" value={organizationId} />
        <FormField id="studentId" label="1. Which student?">
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
                {studentLabel(student)}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField id="goalId" label="2. Which goal?">
          <Select
            id="goalId"
            name="goalId"
            required
            value={goalId}
            onChange={(event) => {
              const nextGoalId = event.target.value;
              setGoalId(nextGoalId);
              const goal = studentGoals.find((entry) => entry.id === nextGoalId);
              if (goal?.measurement_type) setMeasurementType(goal.measurement_type);
            }}
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
          <Alert title="Selected goal" tone="neutral">
            {selectedGoal.goal_statement}
          </Alert>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField id="sessionDate" label="Session date">
            <Input id="sessionDate" name="sessionDate" type="date" required defaultValue={today} />
          </FormField>
          <FormField id="measurementType" label="Measurement type">
            <Select
              id="measurementType"
              name="measurementType"
              value={measurementType}
              onChange={(event) => setMeasurementType(event.target.value)}
            >
              <option value="percentage">Percentage (correct / opportunities)</option>
              <option value="reading_accuracy">Reading accuracy</option>
              <option value="reading_fluency">Reading fluency</option>
              <option value="frequency">Frequency (count)</option>
              <option value="rate">Rate</option>
              <option value="duration">Duration</option>
              <option value="latency">Latency</option>
              <option value="rubric">Rubric</option>
              <option value="prompt_level">Prompt level</option>
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

        {measurementType === "percentage" ||
        measurementType === "reading_accuracy" ||
        measurementType === "independence" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="correctCount" label="Correct / independent count">
              <Input id="correctCount" name="correctCount" type="number" min="0" defaultValue="0" />
            </FormField>
            <FormField id="totalOpportunities" label="Total opportunities">
              <Input
                id="totalOpportunities"
                name="totalOpportunities"
                type="number"
                min="1"
                defaultValue="10"
              />
            </FormField>
          </div>
        ) : null}

        {measurementType === "frequency" || measurementType === "rate" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="countValue" label="Count">
              <Input id="countValue" name="countValue" type="number" min="0" defaultValue="0" />
            </FormField>
            <FormField id="observationDurationSeconds" label="Watch time (seconds)">
              <Input
                id="observationDurationSeconds"
                name="observationDurationSeconds"
                type="number"
                min="1"
                defaultValue="60"
              />
            </FormField>
            {measurementType === "rate" ? (
              <FormField id="rateUnit" label="Rate unit">
                <Select id="rateUnit" name="rateUnit" defaultValue="per_minute">
                  <option value="per_minute">Per minute</option>
                  <option value="per_hour">Per hour</option>
                </Select>
              </FormField>
            ) : (
              <input type="hidden" name="rateUnit" value="per_minute" />
            )}
          </div>
        ) : (
          <>
            <input type="hidden" name="countValue" value="0" />
            <input type="hidden" name="observationDurationSeconds" value="60" />
            <input type="hidden" name="rateUnit" value="per_minute" />
          </>
        )}

        {measurementType === "reading_fluency" || measurementType === "reading_accuracy" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id="wordsRead" label="Words read">
              <Input id="wordsRead" name="wordsRead" type="number" min="0" defaultValue="0" />
            </FormField>
            <FormField id="errorCount" label="Errors">
              <Input id="errorCount" name="errorCount" type="number" min="0" defaultValue="0" />
            </FormField>
            <FormField id="readingTimeSeconds" label="Reading seconds">
              <Input
                id="readingTimeSeconds"
                name="readingTimeSeconds"
                type="number"
                min="1"
                defaultValue="60"
              />
            </FormField>
          </div>
        ) : (
          <>
            <input type="hidden" name="wordsRead" value="0" />
            <input type="hidden" name="errorCount" value="0" />
            <input type="hidden" name="readingTimeSeconds" value="60" />
          </>
        )}

        {measurementType === "duration" ? (
          <FormField id="durationValue" label="Duration (minutes)">
            <Input id="durationValue" name="durationValue" type="number" min="0" defaultValue="0" />
          </FormField>
        ) : (
          <input type="hidden" name="durationValue" value="0" />
        )}

        {measurementType === "latency" ? (
          <FormField id="latencyValue" label="Latency (seconds)">
            <Input id="latencyValue" name="latencyValue" type="number" min="0" defaultValue="0" />
          </FormField>
        ) : (
          <input type="hidden" name="latencyValue" value="0" />
        )}

        {measurementType === "rubric" ? (
          <FormField id="rubricScore" label="Rubric score">
            <Input id="rubricScore" name="rubricScore" type="number" min="0" defaultValue="0" />
          </FormField>
        ) : (
          <input type="hidden" name="rubricScore" value="0" />
        )}

        {measurementType === "prompt_level" ? (
          <FormField id="promptLevel" label="Prompt level">
            <Input id="promptLevel" name="promptLevel" defaultValue="independent" />
          </FormField>
        ) : (
          <input type="hidden" name="promptLevel" value="unspecified" />
        )}

        {measurementType === "custom_numeric" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="customNumericValue" label="Value">
              <Input
                id="customNumericValue"
                name="customNumericValue"
                type="number"
                step="any"
                defaultValue="0"
              />
            </FormField>
            <FormField id="customUnit" label="Unit">
              <Input id="customUnit" name="customUnit" defaultValue="units" />
            </FormField>
          </div>
        ) : (
          <>
            <input type="hidden" name="customNumericValue" value="0" />
            <input type="hidden" name="customUnit" value="units" />
          </>
        )}

        {measurementType === "independence" ? (
          <FormField id="independenceValue" label="Independence value (optional override)">
            <Input
              id="independenceValue"
              name="independenceValue"
              type="number"
              min="0"
              defaultValue="0"
            />
          </FormField>
        ) : (
          <input type="hidden" name="independenceValue" value="0" />
        )}

        {!(
          measurementType === "percentage" ||
          measurementType === "reading_accuracy" ||
          measurementType === "independence"
        ) ? (
          <>
            <input type="hidden" name="correctCount" value="0" />
            <input type="hidden" name="totalOpportunities" value="1" />
          </>
        ) : null}

        <input type="hidden" name="higherIsBetter" value="true" />
        <input type="hidden" name="durationUnit" value="minutes" />
        <input type="hidden" name="latencyUnit" value="seconds" />
        <input type="hidden" name="taskIndependentSteps" value="0" />
        <input type="hidden" name="taskPromptedSteps" value="0" />
        <input type="hidden" name="taskIncorrectSteps" value="0" />
        <input type="hidden" name="taskNotAttemptedSteps" value="0" />

        <FormField id="setting" label="Setting (optional)">
          <Input id="setting" name="setting" placeholder="Classroom / small group" />
        </FormField>
        <FormField id="activity" label="Activity (optional)">
          <Input id="activity" name="activity" placeholder="What the student was doing" />
        </FormField>
        <FormField id="notes" label="Notes (optional)">
          <Textarea id="notes" name="notes" placeholder="Anything the team should know" />
        </FormField>
        <Button type="submit" disabled={students.length === 0 || studentGoals.length === 0}>
          Save progress session
        </Button>
      </form>
    </div>
  );
}
