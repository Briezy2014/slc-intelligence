"use client";

import { useMemo, useState } from "react";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { AiAssistPanel } from "@/components/domain/ai-assist-panel";
import { saveGoalAction } from "@/lib/actions/goals";
import {
  GRADE_LEVELS,
  PROGRESSION_SUBJECTS,
  PROGRESSION_SUBJECT_LABELS,
  getProgression,
  listProgressionsForGrade,
  suggestNextAfterMastery,
  type GradeLevel,
  type MeasurementTypeCode,
  type ProgressionSubject,
} from "@/lib/catalogs";
import type { IepCycle, IepGoal } from "@/lib/supabase/types";

function submitAction(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
}

function normalizeGrade(value: string | null | undefined): GradeLevel | "" {
  if (!value) return "";
  const match = GRADE_LEVELS.find((grade) => grade.toLowerCase() === value.trim().toLowerCase());
  return match ?? "";
}

export function GoalForm({
  organizationId,
  studentId,
  cycles,
  goal,
  defaultGradeLevel,
}: {
  organizationId: string;
  studentId: string;
  cycles: IepCycle[];
  goal?: IepGoal | null;
  defaultGradeLevel?: string | null;
}) {
  const [gradeLevel, setGradeLevel] = useState<GradeLevel | "">(normalizeGrade(defaultGradeLevel));
  const [subject, setSubject] = useState<ProgressionSubject | "">("");
  const [progressionId, setProgressionId] = useState("");
  const [goalArea, setGoalArea] = useState(goal?.goal_area ?? "");
  const [goalStatement, setGoalStatement] = useState(goal?.goal_statement ?? "");
  const [measurementType, setMeasurementType] = useState<MeasurementTypeCode>(
    (goal?.measurement_type as MeasurementTypeCode | undefined) ?? "percentage",
  );
  const [targetDirection, setTargetDirection] = useState<"increase" | "decrease">(
    goal?.target_direction ?? "increase",
  );
  const [targetValue, setTargetValue] = useState(goal?.target_value?.toString() ?? "");
  const [status, setStatus] = useState<"active" | "inactive" | "archived" | "mastered_review">(
    goal?.status ?? "active",
  );

  const gradeGoals = useMemo(
    () => (gradeLevel ? listProgressionsForGrade(gradeLevel, subject || undefined) : []),
    [gradeLevel, subject],
  );

  const nextProgressions = useMemo(
    () =>
      suggestNextAfterMastery({
        gradeLevel,
        subject,
        currentProgressionId: progressionId || undefined,
      }),
    [gradeLevel, subject, progressionId],
  );

  function applyProgression(id: string) {
    setProgressionId(id);
    const progression = getProgression(id);
    if (!progression) return;
    setGradeLevel(progression.gradeLevel);
    setSubject(progression.subject);
    setGoalArea(progression.goalArea);
    setGoalStatement(progression.goalStatement);
    setMeasurementType(progression.measurementType);
    setTargetDirection(progression.targetDirection);
    setTargetValue(progression.targetValue == null ? "" : String(progression.targetValue));
  }

  return (
    <div className="space-y-6">
      <AiAssistPanel
        domain="goal"
        title="AI Assist · Goal drafting"
        description="Suggest measurable goal language. Review and customize before saving."
        onApply={(suggestion) => {
          setProgressionId("");
          setGoalArea(suggestion.fields?.goalArea ?? suggestion.title);
          setGoalStatement(suggestion.fields?.goalStatement ?? suggestion.draftText);
          if (suggestion.fields?.measurementType) {
            setMeasurementType(suggestion.fields.measurementType as MeasurementTypeCode);
          }
          if (suggestion.fields?.targetDirection === "increase" || suggestion.fields?.targetDirection === "decrease") {
            setTargetDirection(suggestion.fields.targetDirection);
          }
          if (suggestion.fields?.targetValue != null) {
            setTargetValue(suggestion.fields.targetValue);
          }
        }}
      />
      <form action={submitAction(saveGoalAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />
      <input type="hidden" name="studentId" value={studentId} />
      {goal ? <input type="hidden" name="goalId" value={goal.id} /> : null}

      <Alert title="Learning progressions" tone="info">
        Choose a grade level and course subject to load progression goals (including functional math and ASL
        communication). After mastery, generate the next progression step.
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="gradeLevel" label="Grade level">
          <Select
            id="gradeLevel"
            value={gradeLevel}
            onChange={(event) => {
              setGradeLevel((event.target.value || "") as GradeLevel | "");
              setProgressionId("");
            }}
          >
            <option value="">Choose grade level</option>
            {GRADE_LEVELS.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField id="subject" label="Course subject">
          <Select
            id="subject"
            value={subject}
            onChange={(event) => {
              setSubject((event.target.value || "") as ProgressionSubject | "");
              setProgressionId("");
            }}
          >
            <option value="">All subjects for grade</option>
            {PROGRESSION_SUBJECTS.map((code) => (
              <option key={code} value={code}>
                {PROGRESSION_SUBJECT_LABELS[code]}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField id="progressionId" label="Learning progression goal">
        <Select
          id="progressionId"
          value={progressionId}
          onChange={(event) => applyProgression(event.target.value)}
          disabled={!gradeLevel}
        >
          <option value="">
            {!gradeLevel
              ? "Choose a grade level first"
              : gradeGoals.length === 0
                ? "No progressions for this filter"
                : "Choose a progression goal"}
          </option>
          {gradeGoals.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.title}
            </option>
          ))}
        </Select>
      </FormField>
      <p className="text-muted text-sm">
        {gradeLevel
          ? `${gradeGoals.length} progression goals available for grade ${gradeLevel}${subject ? ` · ${PROGRESSION_SUBJECT_LABELS[subject]}` : ""}.`
          : "Select a grade level to generate the goal set."}
      </p>

      {status === "mastered_review" || progressionId ? (
        <div className="border-border space-y-3 rounded-[var(--radius-md)] border p-3">
          <p className="text-sm font-semibold">Next learning progression after mastery</p>
          {nextProgressions.length === 0 ? (
            <p className="text-muted text-sm">No next step mapped yet for this selection.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {nextProgressions.map((entry) => (
                <Button key={entry.id} type="button" variant="secondary" onClick={() => applyProgression(entry.id)}>
                  Use next: {entry.title}
                </Button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <FormField id="iepCycleId" label="IEP cycle">
        <Select id="iepCycleId" name="iepCycleId" required defaultValue={goal?.iep_cycle_id ?? ""}>
          <option value="">Choose an IEP cycle</option>
          {cycles
            .filter((cycle) => cycle.student_id === studentId)
            .map((cycle) => (
              <option key={cycle.id} value={cycle.id}>
                {cycle.label}
              </option>
            ))}
        </Select>
      </FormField>
      <FormField id="goalArea" label="Goal area">
        <Input id="goalArea" name="goalArea" required value={goalArea} onChange={(event) => setGoalArea(event.target.value)} />
      </FormField>
      <FormField id="goalStatement" label="Goal statement">
        <Textarea
          id="goalStatement"
          name="goalStatement"
          required
          value={goalStatement}
          onChange={(event) => setGoalStatement(event.target.value)}
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="measurementType" label="Measurement type">
          <Select
            id="measurementType"
            name="measurementType"
            value={measurementType}
            onChange={(event) => setMeasurementType(event.target.value as MeasurementTypeCode)}
          >
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
          <Select
            id="targetDirection"
            name="targetDirection"
            value={targetDirection}
            onChange={(event) => setTargetDirection(event.target.value as "increase" | "decrease")}
          >
            <option value="increase">Increase</option>
            <option value="decrease">Decrease</option>
          </Select>
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="targetValue" label="Target value">
          <Input
            id="targetValue"
            name="targetValue"
            type="number"
            step="any"
            value={targetValue}
            onChange={(event) => setTargetValue(event.target.value)}
          />
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
      <FormField id="status" label="Goal status">
        <Select
          id="status"
          name="status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as "active" | "inactive" | "archived" | "mastered_review")
          }
        >
          <option value="active">Active</option>
          <option value="mastered_review">Mastered · ready for next progression</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </Select>
      </FormField>
      <Button type="submit">{goal ? "Save goal" : "Create goal"}</Button>
    </form>
    </div>
  );
}
