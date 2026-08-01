"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/forms/form-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createBehaviorFromTemplateAction,
  ensureCommonBehaviorDefinitionsAction,
  saveBehaviorDefinitionAction,
  saveBehaviorObservationAction,
} from "@/lib/actions/behavior";
import {
  BEHAVIOR_ACTIVITY_OPTIONS,
  BEHAVIOR_ANTECEDENT_OPTIONS,
  BEHAVIOR_CONSEQUENCE_OPTIONS,
  BEHAVIOR_DEFINITION_TEMPLATES,
  BEHAVIOR_SETTING_OPTIONS,
  OBSERVATION_METHOD_OPTIONS,
  getBehaviorDefinitionTemplate,
  type ObservationMethodCode,
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

  if (!data.permissions.canDefine) {
    return (
      <PermissionDeniedState message="You need permission to save behavior definitions." />
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
  }

  return (
    <form action={submitAction(saveBehaviorDefinitionAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
      <FormField
        id="definitionTemplate"
        label="Choose a starter behavior"
        description="This fills in the wording for you. Edit anything before saving."
      >
        <Select
          id="definitionTemplate"
          value={templateId}
          onChange={(event) => applyTemplate(event.target.value)}
        >
          <option value="">Choose a starter…</option>
          {BEHAVIOR_DEFINITION_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </Select>
      </FormField>
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
          placeholder="Example: Task refusal"
        />
      </FormField>
      <FormField
        id="operationalDefinition"
        label="What does it look like?"
        description="Describe only what you can see or hear."
      >
        <Textarea
          id="operationalDefinition"
          name="operationalDefinition"
          required
          value={operationalDefinition}
          onChange={(e) => setOperationalDefinition(e.target.value)}
        />
      </FormField>
      <details className="border-border rounded-[var(--radius-md)] border p-3">
        <summary className="cursor-pointer text-sm font-semibold">Examples (optional)</summary>
        <div className="mt-3 space-y-3">
          <FormField id="examples" label="Examples (one per line)">
            <Textarea
              id="examples"
              name="examples"
              value={examples}
              onChange={(e) => setExamples(e.target.value)}
            />
          </FormField>
          <FormField id="nonexamples" label="Not examples (one per line)">
            <Textarea
              id="nonexamples"
              name="nonexamples"
              value={nonexamples}
              onChange={(e) => setNonexamples(e.target.value)}
            />
          </FormField>
        </div>
      </details>
      <input type="hidden" name="status" value="active" />
      <Button type="submit">Save behavior</Button>
    </form>
  );
}

export function BehaviorObservationForm({
  data,
  studentId,
  initialBehaviorDefinitionId,
}: {
  data: BehaviorData;
  studentId?: string;
  initialBehaviorDefinitionId?: string;
}) {
  const router = useRouter();
  const [pendingSetup, startSetup] = useTransition();
  const [selectedStudentId, setSelectedStudentId] = useState(studentId ?? "");
  const [behaviorDefinitionId, setBehaviorDefinitionId] = useState(
    initialBehaviorDefinitionId ?? "",
  );

  useEffect(() => {
    if (studentId) setSelectedStudentId(studentId);
  }, [studentId]);
  const [method, setMethod] = useState<ObservationMethodCode>("abc");
  const [showAdvancedMethods, setShowAdvancedMethods] = useState(false);
  const [setting, setSetting] = useState("");
  const [activity, setActivity] = useState("");
  const [antecedent, setAntecedent] = useState("");
  const [observableBehavior, setObservableBehavior] = useState("");
  const [consequence, setConsequence] = useState("");
  const [watchMinutes, setWatchMinutes] = useState("5");
  const [durationMinutes, setDurationMinutes] = useState("1");
  const [setupMessage, setSetupMessage] = useState<string | null>(null);
  const autoSetupTriedFor = useRef<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const definitionsForStudent = useMemo(
    () =>
      data.definitions.filter(
        (definition) => !selectedStudentId || definition.student_id === selectedStudentId,
      ),
    [data.definitions, selectedStudentId],
  );

  const primaryMethods = OBSERVATION_METHOD_OPTIONS.filter((option) => option.primary);
  const advancedMethods = OBSERVATION_METHOD_OPTIONS.filter((option) => !option.primary);
  const methodHelp =
    OBSERVATION_METHOD_OPTIONS.find((option) => option.value === method)?.help ?? "";

  useEffect(() => {
    if (!selectedStudentId || !data.organizationId || !data.permissions.canDefine) return;
    if (definitionsForStudent.length > 0) return;
    if (autoSetupTriedFor.current === selectedStudentId) return;
    autoSetupTriedFor.current = selectedStudentId;

    startSetup(async () => {
      setSetupMessage("Setting up common classroom behaviors…");
      const result = await ensureCommonBehaviorDefinitionsAction({
        organizationId: data.organizationId!,
        studentId: selectedStudentId,
      });
      setSetupMessage(result.message ?? null);
      router.refresh();
    });
  }, [
    selectedStudentId,
    data.organizationId,
    data.permissions.canDefine,
    definitionsForStudent.length,
    router,
  ]);

  useEffect(() => {
    if (
      behaviorDefinitionId &&
      definitionsForStudent.some((definition) => definition.id === behaviorDefinitionId)
    ) {
      return;
    }
    setBehaviorDefinitionId(definitionsForStudent[0]?.id ?? "");
  }, [definitionsForStudent, behaviorDefinitionId]);

  if (!data.permissions.canObserve) {
    return <PermissionDeniedState message="You need permission to log observations." />;
  }

  const observationSeconds = Math.max(1, Math.round(Number(watchMinutes || "0") * 60));
  const totalDurationSeconds = Math.max(0, Math.round(Number(durationMinutes || "0") * 60));

  return (
    <form action={submitAction(saveBehaviorObservationAction)} className="space-y-4">
      <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
      {!studentId ? (
        <FormField id="obsStudentId" label="Student">
          <Select
            id="obsStudentId"
            name="studentId"
            required
            value={selectedStudentId}
            onChange={(event) => {
              setSelectedStudentId(event.target.value);
              setBehaviorDefinitionId("");
              setSetupMessage(null);
            }}
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

      <FormField
        id="behaviorDefinitionId"
        label="Which behavior?"
        description="Pick from this student’s saved list. Common classroom behaviors are added automatically."
      >
        <Select
          id="behaviorDefinitionId"
          name="behaviorDefinitionId"
          required
          value={behaviorDefinitionId}
          onChange={(event) => setBehaviorDefinitionId(event.target.value)}
          disabled={pendingSetup || (!selectedStudentId && !studentId)}
        >
          <option value="">
            {!selectedStudentId && !studentId
              ? "Choose a student first"
              : pendingSetup
                ? "Setting up behaviors…"
                : definitionsForStudent.length === 0
                  ? "No behaviors yet — set up common ones below"
                  : "Choose behavior"}
          </option>
          {definitionsForStudent.map((definition) => (
            <option key={definition.id} value={definition.id}>
              {definition.name}
            </option>
          ))}
        </Select>
      </FormField>

      {selectedStudentId || studentId ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={pendingSetup || !data.organizationId}
            onClick={() => {
              const sid = studentId || selectedStudentId;
              if (!sid || !data.organizationId) return;
              startSetup(async () => {
                setSetupMessage(null);
                const result = await ensureCommonBehaviorDefinitionsAction({
                  organizationId: data.organizationId!,
                  studentId: sid,
                });
                setSetupMessage(result.message ?? null);
                router.refresh();
              });
            }}
          >
            {pendingSetup ? "Setting up…" : "Set up common classroom behaviors"}
          </Button>
          <Select
            aria-label="Add another starter behavior"
            value=""
            disabled={pendingSetup || !data.organizationId}
            onChange={(event) => {
              const templateId = event.target.value;
              const sid = studentId || selectedStudentId;
              if (!templateId || !sid || !data.organizationId) return;
              startSetup(async () => {
                setSetupMessage(null);
                const result = await createBehaviorFromTemplateAction({
                  organizationId: data.organizationId!,
                  studentId: sid,
                  templateId,
                });
                setSetupMessage(result.message ?? null);
                if (result.behaviorDefinitionId) {
                  setBehaviorDefinitionId(result.behaviorDefinitionId);
                }
                router.refresh();
              });
            }}
          >
            <option value="">Add another starter…</option>
            {BEHAVIOR_DEFINITION_TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </Select>
        </div>
      ) : null}
      {setupMessage ? (
        <Alert title="Behaviors ready" tone="info">
          {setupMessage}
        </Alert>
      ) : null}

      <FormField
        id="measurementMethod"
        label="What are you recording today?"
        description={methodHelp}
      >
        <Select
          id="measurementMethod"
          name="measurementMethod"
          value={method}
          onChange={(event) => setMethod(event.target.value as ObservationMethodCode)}
        >
          {primaryMethods.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {showAdvancedMethods
            ? advancedMethods.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : null}
        </Select>
      </FormField>
      {!showAdvancedMethods ? (
        <button
          type="button"
          className="text-highlight text-sm font-semibold underline"
          onClick={() => setShowAdvancedMethods(true)}
        >
          Show advanced options
        </button>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="sessionDate" label="Date">
          <Input id="sessionDate" name="sessionDate" type="date" required defaultValue={today} />
        </FormField>
        <FormField id="sessionTime" label="Time (optional)">
          <Input id="sessionTime" name="sessionTime" type="time" />
        </FormField>
        <FormField id="status" label="Save as">
          <Select id="status" name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="finalized">Final</option>
          </Select>
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="setting" label="Where?">
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
        <FormField id="activity" label="What was happening?">
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
          <FormField
            id="recordedAntecedent"
            label="Before (what happened first)"
            description="Pick a suggestion or type your own."
          >
            <Select
              id="recordedAntecedentSelect"
              value=""
              onChange={(event) => {
                if (event.target.value) setAntecedent(event.target.value);
              }}
            >
              <option value="">Choose a suggestion…</option>
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
          <FormField id="observableBehavior" label="During (what you saw or heard)">
            <Textarea
              id="observableBehavior"
              name="observableBehavior"
              required
              value={observableBehavior}
              onChange={(e) => setObservableBehavior(e.target.value)}
              placeholder="Describe only what you saw or heard"
            />
          </FormField>
          <FormField id="recordedConsequence" label="After (what happened next)">
            <Select
              id="recordedConsequenceSelect"
              value=""
              onChange={(event) => {
                if (event.target.value) setConsequence(event.target.value);
              }}
            >
              <option value="">Choose a suggestion…</option>
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
          <FormField id="count" label="How many times?">
            <Input id="count" name="count" type="number" min="0" defaultValue="0" required />
          </FormField>
          <FormField id="watchMinutes" label="How long did you watch? (minutes)">
            <Input
              id="watchMinutes"
              type="number"
              min="1"
              step="1"
              value={watchMinutes}
              onChange={(event) => setWatchMinutes(event.target.value)}
              required
            />
          </FormField>
          <input type="hidden" name="observationDurationSeconds" value={observationSeconds} />
        </div>
      ) : null}

      {method === "duration" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="durationMinutes" label="How long did it last? (minutes)">
            <Input
              id="durationMinutes"
              type="number"
              min="0"
              step="0.5"
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
              required
            />
          </FormField>
          <FormField id="episodeCount" label="How many separate times?">
            <Input
              id="episodeCount"
              name="episodeCount"
              type="number"
              min="0"
              defaultValue="1"
              required
            />
          </FormField>
          <input type="hidden" name="totalDurationSeconds" value={totalDurationSeconds} />
        </div>
      ) : null}

      {method === "latency" ? (
        <div className="space-y-4">
          <FormField id="triggerDescription" label="What direction or cue was given?">
            <Textarea id="triggerDescription" name="triggerDescription" required />
          </FormField>
          <FormField id="latencySeconds" label="Seconds until the response">
            <Input
              id="latencySeconds"
              name="latencySeconds"
              type="number"
              min="0"
              defaultValue="0"
              required
            />
          </FormField>
          <FormField id="responseDescription" label="What did the student do?">
            <Textarea id="responseDescription" name="responseDescription" />
          </FormField>
        </div>
      ) : null}

      {method === "interval" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="recordingMethod" label="Interval style">
            <Select id="recordingMethod" name="recordingMethod" defaultValue="partial">
              <option value="partial">Partial (any time in the interval)</option>
              <option value="whole">Whole (the whole interval)</option>
              <option value="momentary">Momentary (at the beep)</option>
            </Select>
          </FormField>
          <FormField id="intervalDurationSeconds" label="Interval length (seconds)">
            <Input
              id="intervalDurationSeconds"
              name="intervalDurationSeconds"
              type="number"
              min="1"
              defaultValue="30"
              required
            />
          </FormField>
          <FormField id="intervalCount" label="Number of intervals">
            <Input
              id="intervalCount"
              name="intervalCount"
              type="number"
              min="1"
              defaultValue="10"
              required
            />
          </FormField>
          <FormField id="intervalsPositive" label="Intervals where it happened">
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

      <FormField id="notes" label="Notes (optional)">
        <Textarea id="notes" name="notes" />
      </FormField>
      <Button type="submit" disabled={!behaviorDefinitionId || pendingSetup}>
        Save observation
      </Button>
    </form>
  );
}

export function BehaviorQuickStart({ data }: { data: BehaviorData }) {
  const [studentId, setStudentId] = useState(data.students[0]?.id ?? "");
  const [showAddBehavior, setShowAddBehavior] = useState(false);

  if (data.students.length === 0) {
    return (
      <Alert title="Add a student first" tone="warning">
        Create a coded demo student under Students, then come back to log behavior.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>Log what happened</CardTitle>
        <CardDescription>
          Choose the student, pick the behavior, then record what you saw. Common behaviors are
          created for you automatically.
        </CardDescription>
        <div className="mt-4 space-y-4">
          <FormField id="focusStudent" label="Student">
            <Select
              id="focusStudent"
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
          </FormField>
          <BehaviorObservationForm data={data} studentId={studentId} />
        </div>
      </Card>

      <details
        className="border-border rounded-[var(--radius-lg)] border p-4"
        open={showAddBehavior}
        onToggle={(event) => setShowAddBehavior((event.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer text-sm font-semibold">
          Need a custom behavior? Add or edit wording
        </summary>
        <div className="mt-4">
          <BehaviorDefinitionForm data={data} studentId={studentId} />
        </div>
      </details>
    </div>
  );
}
