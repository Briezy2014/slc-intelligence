"use client";

import { useMemo, useState } from "react";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveGoalAction } from "@/lib/actions/goals";
import { GOAL_TEMPLATES, getGoalTemplate, type MeasurementTypeCode } from "@/lib/catalogs";
import type { IepCycle, IepGoal } from "@/lib/supabase/types";

function submitAction(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
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
  const [templateId, setTemplateId] = useState("");
  const [goalArea, setGoalArea] = useState(goal?.goal_area ?? "");
  const [goalStatement, setGoalStatement] = useState(goal?.goal_statement ?? "");
  const [measurementType, setMeasurementType] = useState<MeasurementTypeCode>(
    (goal?.measurement_type as MeasurementTypeCode | undefined) ?? "percentage",
  );
  const [targetDirection, setTargetDirection] = useState<"increase" | "decrease">(
    goal?.target_direction ?? "increase",
  );
  const [targetValue, setTargetValue] = useState(goal?.target_value?.toString() ?? "");

  const grouped = useMemo(() => {
    return GOAL_TEMPLATES.reduce<Record<string, typeof GOAL_TEMPLATES>>((groups, template) => {
      groups[template.area] = groups[template.area] ?? [];
      groups[template.area].push(template);
      return groups;
    }, {});
  }, []);

  function applyTemplate(nextId: string) {
    setTemplateId(nextId);
    if (!nextId) return;
    const template = getGoalTemplate(nextId);
    if (!template) return;
    setGoalArea(template.area);
    setGoalStatement(template.statement);
    setMeasurementType(template.measurementType);
    setTargetDirection(template.targetDirection);
    setTargetValue(template.targetValue == null ? "" : String(template.targetValue));
  }

  return (
    <form action={submitAction(saveGoalAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />
      <input type="hidden" name="studentId" value={studentId} />
      {goal ? <input type="hidden" name="goalId" value={goal.id} /> : null}
      <FormField id="goalTemplateId" label="Starter goal template">
        <Select
          id="goalTemplateId"
          name="goalTemplateId"
          value={templateId}
          onChange={(event) => applyTemplate(event.target.value)}
        >
          <option value="">Custom goal (write your own)</option>
          {Object.entries(grouped).map(([area, templates]) => (
            <optgroup key={area} label={area}>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.statement.slice(0, 90)}
                  {template.statement.length > 90 ? "…" : ""}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </FormField>
      <p className="text-muted text-sm">
        {GOAL_TEMPLATES.length} starter goals are available. Pick one to prefill, then customize for the student.
      </p>
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
      <input type="hidden" name="status" value={goal?.status ?? "active"} />
      <Button type="submit">{goal ? "Save goal" : "Create goal"}</Button>
    </form>
  );
}
