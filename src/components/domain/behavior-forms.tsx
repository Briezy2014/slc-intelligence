"use client";

import { useMemo, useState } from "react";
import { FormField } from "@/components/forms/form-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  saveBehaviorDefinitionAction,
  saveBehaviorObservationAction,
} from "@/lib/actions/behavior";
import {
  BEHAVIOR_ACTIVITY_OPTIONS,
  BEHAVIOR_ANTECEDENT_OPTIONS,
  BEHAVIOR_CONSEQUENCE_OPTIONS,
  BEHAVIOR_DEFINITION_TEMPLATES,
  BEHAVIOR_SETTING_OPTIONS,
  BEHAVIOR_TRY_NEXT_SUGGESTIONS,
  getBehaviorDefinitionTemplate,
} from "@/lib/catalogs/behavior-templates";
import type { BehaviorData } from "@/lib/data/behavior";
import { PermissionDeniedState } from "@/components/domain/page-states";

function submitAction(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
}

function studentName(student: BehaviorData["students"][number]) {
  return `${student.last_name}, ${student.preferred_name || student.first_name}`;
}

export function BehaviorDefinitionForm({
  data,
  studentId,
}: {
  data: BehaviorData;
  studentId?: string;
}) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId ?? "");
  const [templateId, setTemplateId] = useState("");
  const [name, setName] = useState("");
  const [operationalDefinition, setOperationalDefinition] = useState("");
  const [examples, setExamples] = useState("");
  const [nonexamples, setNonexamples] = useState("");
  const [strategies, setStrategies] = useState<string[]>([]);

  if (!data.permissions.canDefine) {
    return (
      <PermissionDeniedState message="Behavior definition permission is required to create definitions." />
    );
  }

  function applyTemplate(id: string) {
    setTemplateId(id);
    const template = getBehaviorDefinitionTemplate(id);
    if (!template) return;
    setName(template.name);
    setOperationalDefinition(template.operationalDefinition);
    setExamples(template.examples.join("\n"));
    setNonexamples(template.nonexamples.join("\n"));
    setStrategies(template.suggestedStrategies);
  }

  return (
    <form action={submitAction(saveBehaviorDefinitionAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
      <Alert title="Suggested definitions" tone="info">
        Pick a starter definition from the dropdown, then customize for this student. Suggestions
        are educator supports, not diagnoses.
      </Alert>
      <FormField id="definitionTemplate" label="Suggested behavior definition">
        <Select
          id="definitionTemplate"
          value={templateId}
          onChange={(event) => applyTemplate(event.target.value)}
        >
          <option value="">Choose a starter definition</option>
          {BEHAVIOR_DEFINITION_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {template.category} · {template.name}
            </option>
          ))}
        </Select>
      </FormField>
      {strategies.length > 0 ? (
        <div className="border-border rounded-[var(--radius-md)] border p-3">
          <p className="text-sm font-semibold">What to try next</p>
          <ul className="text-muted mt-2 list-disc space-y-1 pl-5 text-sm">
            {strategies.map((strategy) => (
              <li key={strategy}>{strategy}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {!studentId ? (
        <FormField id="studentId" label="Student">
          <Select
            id="studentId"
            name="studentId"
            required
            value={selectedStudentId}
            onChange={(event) => setSelectedStudentId(event.target.value)}
          >
            <option value="">Choose student</option>
            {data.students.map((student) => (
              <option key={student.id} value={student.id}>
                {studentName(student)}
              </option>
            ))}
          </Select>
        </FormField>
      ) : (
        <input type="hidden" name="studentId" value={studentId} />
      )}
      <FormField id="name" label="Behavior name">
        <Input
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormField>
      <FormField id="operationalDefinition" label="Operational definition">
        <Textarea
          id="operationalDefinition"
          name="operationalDefinition"
          required
          value={operationalDefinition}
          onChange={(e) => setOperationalDefinition(e.target.value)}
        />
      </FormField>
      <FormField id="examples" label="Examples (one per line)">
        <Textarea
          id="examples"
          name="examples"
          value={examples}
          onChange={(e) => setExamples(e.target.value)}
        />
      </FormField>
      <FormField id="nonexamples" label="Nonexamples (one per line)">
        <Textarea
          id="nonexamples"
          name="nonexamples"
          value={nonexamples}
          onChange={(e) => setNonexamples(e.target.value)}
        />
      </FormField>
      <input type="hidden" name="status" value="active" />
      <Button type="submit">Save behavior definition</Button>
    </form>
  );
}

export function BehaviorObservationForm({
  data,
  studentId,
}: {
  data: BehaviorData;
  studentId?: string;
}) {
  const [selectedStudentId, setSelectedStudentId] = useState(studentId ?? "");
  const [method, setMethod] = useState<
    "abc" | "frequency" | "duration" | "latency" | "interval" | "intensity"
  >("abc");
  const [setting, setSetting] = useState("");
  const [activity, setActivity] = useState("");
  const [antecedent, setAntecedent] = useState("");
  const [observableBehavior, setObservableBehavior] = useState("");
  const [consequence, setConsequence] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const definitionsForStudent = useMemo(
    () =>
      data.definitions.filter(
        (definition) => !selectedStudentId || definition.student_id === selectedStudentId,
      ),
    [data.definitions, selectedStudentId],
  );

  if (!data.permissions.canObserve) {
    return (
      <PermissionDeniedState message="Observation permission is required to enter behavior data." />
    );
  }

  return (
    <form action={submitAction(saveBehaviorObservationAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
      <Alert title="Observation dropdowns" tone="info">
        Choose method, setting, activity, and ABC prompts from the lists. Only behavior definitions
        for the selected student appear below.
      </Alert>
      {!studentId ? (
        <FormField id="obsStudentId" label="Student">
          <Select
            id="obsStudentId"
            name="studentId"
            required
            value={selectedStudentId}
            onChange={(event) => setSelectedStudentId(event.target.value)}
          >
            <option value="">Choose student</option>
            {data.students.map((student) => (
              <option key={student.id} value={student.id}>
                {studentName(student)}
              </option>
            ))}
          </Select>
        </FormField>
      ) : (
        <input type="hidden" name="studentId" value={studentId} />
      )}
      <FormField id="behaviorDefinitionId" label="Behavior definition">
        <Select id="behaviorDefinitionId" name="behaviorDefinitionId" required>
          <option value="">
            {!selectedStudentId && !studentId
              ? "Choose a student first"
              : definitionsForStudent.length === 0
                ? "No definitions yet — create one above"
                : "Choose behavior"}
          </option>
          {definitionsForStudent.map((definition) => (
            <option key={definition.id} value={definition.id}>
              {definition.name}
            </option>
          ))}
        </Select>
      </FormField>
      <div className="grid gap-4 sm:grid-cols-4">
        <FormField id="measurementMethod" label="Observation method">
          <Select
            id="measurementMethod"
            name="measurementMethod"
            value={method}
            onChange={(event) =>
              setMethod(
                event.target.value as
                  "abc" | "frequency" | "duration" | "latency" | "interval" | "intensity",
              )
            }
          >
            <option value="abc">ABC</option>
            <option value="frequency">Frequency</option>
            <option value="duration">Duration</option>
            <option value="latency">Latency</option>
            <option value="interval">Interval</option>
            <option value="intensity">Intensity</option>
          </Select>
        </FormField>
        <FormField id="sessionDate" label="Date">
          <Input id="sessionDate" name="sessionDate" type="date" required defaultValue={today} />
        </FormField>
        <FormField id="sessionTime" label="Time">
          <Input id="sessionTime" name="sessionTime" type="time" />
        </FormField>
        <FormField id="status" label="Status">
          <Select id="status" name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="finalized">Finalized</option>
          </Select>
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="setting" label="Setting">
          <Select
            id="setting"
            name="setting"
            value={setting}
            onChange={(event) => setSetting(event.target.value)}
          >
            <option value="">Choose setting</option>
            {BEHAVIOR_SETTING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField id="activity" label="Activity">
          <Select
            id="activity"
            name="activity"
            value={activity}
            onChange={(event) => setActivity(event.target.value)}
          >
            <option value="">Choose activity</option>
            {BEHAVIOR_ACTIVITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      {method === "abc" ? (
        <div className="space-y-4">
          <FormField id="recordedAntecedent" label="Antecedent (A)">
            <Select
              id="recordedAntecedentSelect"
              value=""
              onChange={(event) => {
                if (event.target.value) setAntecedent(event.target.value);
              }}
            >
              <option value="">Insert suggested antecedent…</option>
              {BEHAVIOR_ANTECEDENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Textarea
              className="mt-2"
              id="recordedAntecedent"
              name="recordedAntecedent"
              required
              value={antecedent}
              onChange={(e) => setAntecedent(e.target.value)}
            />
          </FormField>
          <FormField id="observableBehavior" label="Observable behavior (B)">
            <Textarea
              id="observableBehavior"
              name="observableBehavior"
              required
              value={observableBehavior}
              onChange={(e) => setObservableBehavior(e.target.value)}
              placeholder="Describe only what you saw/heard"
            />
          </FormField>
          <FormField id="recordedConsequence" label="Consequence (C)">
            <Select
              id="recordedConsequenceSelect"
              value=""
              onChange={(event) => {
                if (event.target.value) setConsequence(event.target.value);
              }}
            >
              <option value="">Insert suggested consequence…</option>
              {BEHAVIOR_CONSEQUENCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Textarea
              className="mt-2"
              id="recordedConsequence"
              name="recordedConsequence"
              required
              value={consequence}
              onChange={(e) => setConsequence(e.target.value)}
            />
          </FormField>
          <input type="hidden" name="replacementObserved" value="false" />
        </div>
      ) : null}

      {method === "frequency" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="count" label="Count">
            <Input id="count" name="count" type="number" min="0" defaultValue="0" required />
          </FormField>
          <FormField id="observationDurationSeconds" label="Observation seconds">
            <Input
              id="observationDurationSeconds"
              name="observationDurationSeconds"
              type="number"
              min="1"
              defaultValue="300"
              required
            />
          </FormField>
        </div>
      ) : null}

      {method === "duration" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="totalDurationSeconds" label="Total duration seconds">
            <Input
              id="totalDurationSeconds"
              name="totalDurationSeconds"
              type="number"
              min="0"
              defaultValue="0"
              required
            />
          </FormField>
          <FormField id="episodeCount" label="Episodes">
            <Input
              id="episodeCount"
              name="episodeCount"
              type="number"
              min="0"
              defaultValue="1"
              required
            />
          </FormField>
        </div>
      ) : null}

      {method === "latency" ? (
        <div className="space-y-4">
          <FormField id="triggerDescription" label="Trigger description">
            <Textarea id="triggerDescription" name="triggerDescription" required />
          </FormField>
          <FormField id="latencySeconds" label="Latency seconds">
            <Input
              id="latencySeconds"
              name="latencySeconds"
              type="number"
              min="0"
              defaultValue="0"
              required
            />
          </FormField>
          <FormField id="responseDescription" label="Response description">
            <Textarea id="responseDescription" name="responseDescription" />
          </FormField>
        </div>
      ) : null}

      {method === "interval" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="recordingMethod" label="Recording method">
            <Select id="recordingMethod" name="recordingMethod" defaultValue="partial">
              <option value="partial">Partial</option>
              <option value="whole">Whole</option>
              <option value="momentary">Momentary</option>
            </Select>
          </FormField>
          <FormField id="intervalDurationSeconds" label="Interval seconds">
            <Input
              id="intervalDurationSeconds"
              name="intervalDurationSeconds"
              type="number"
              min="1"
              defaultValue="30"
              required
            />
          </FormField>
          <FormField id="intervalCount" label="Interval count">
            <Input
              id="intervalCount"
              name="intervalCount"
              type="number"
              min="1"
              defaultValue="10"
              required
            />
          </FormField>
          <FormField id="intervalsPositive" label="Intervals positive">
            <Input
              id="intervalsPositive"
              name="intervalsPositive"
              type="number"
              min="0"
              defaultValue="0"
              required
            />
          </FormField>
        </div>
      ) : null}

      {method === "intensity" ? (
        <FormField id="intensityLevelId" label="Intensity level">
          <Select id="intensityLevelId" name="intensityLevelId" required>
            <option value="">Choose intensity level</option>
            {data.intensityLevels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.label ?? level.id}
              </option>
            ))}
          </Select>
        </FormField>
      ) : null}

      <div className="border-border rounded-[var(--radius-md)] border p-3">
        <p className="text-sm font-semibold">Suggestions · what to try</p>
        <ul className="text-muted mt-2 list-disc space-y-1 pl-5 text-sm">
          {BEHAVIOR_TRY_NEXT_SUGGESTIONS.slice(0, 5).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <FormField id="notes" label="Notes">
        <Textarea id="notes" name="notes" />
      </FormField>
      <Button type="submit">Save observation</Button>
    </form>
  );
}

export function BehaviorQuickStart({ data }: { data: BehaviorData }) {
  const [studentId, setStudentId] = useState(data.students[0]?.id ?? "");

  if (data.students.length === 0) {
    return (
      <Alert title="Add a student to use Behavior Detective" tone="warning">
        Create a demo student from Students, then return here to define behaviors and log
        observations with dropdowns and try-next suggestions.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Focus student</CardTitle>
        <CardDescription>
          Pick one student so definition and observation dropdowns stay short and relevant.
        </CardDescription>
        <div className="mt-4">
          <Select
            aria-label="Focus student"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
          >
            {data.students.map((student) => (
              <option key={student.id} value={student.id}>
                {studentName(student)}
              </option>
            ))}
          </Select>
        </div>
      </Card>
      <Card>
        <CardTitle>1. Behavior definition</CardTitle>
        <CardDescription>Start from a suggested definition, then customize.</CardDescription>
        <div className="mt-4">
          <BehaviorDefinitionForm data={data} studentId={studentId} />
        </div>
      </Card>
      <Card>
        <CardTitle>2. Observation</CardTitle>
        <CardDescription>
          Method, setting, activity, and ABC prompts use dropdowns. Definitions are filtered to this
          student.
        </CardDescription>
        <div className="mt-4">
          <BehaviorObservationForm data={data} studentId={studentId} />
        </div>
      </Card>
    </div>
  );
}
