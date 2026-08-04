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
  BEHAVIOR_DURING_OPTIONS,
  BEHAVIOR_SETTING_OPTIONS,
  BEHAVIOR_TRY_NEXT_SUGGESTIONS,
  OBSERVATION_METHOD_OPTIONS,
  getBehaviorDefinitionTemplate,
  type ObservationMethodCode,
} from "@/lib/catalogs/behavior-templates";
import { AiAssistPanel } from "@/components/domain/ai-assist-panel";
import { BehaviorDailyCountBoard } from "@/components/domain/behavior-daily-count-board";
import { SectionExportBar } from "@/components/domain/section-export-bar";
import type { BehaviorData } from "@/lib/data/behavior";
import { PermissionDeniedState } from "@/components/domain/page-states";

function categoryForDefinitionName(name: string): string {
  const match = BEHAVIOR_DEFINITION_TEMPLATES.find(
    (template) => template.name.toLowerCase() === name.toLowerCase(),
  );
  return match?.category ?? "Other";
}

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
    return <PermissionDeniedState message="You need permission to save behavior definitions." />;
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
  const [method, setMethod] = useState<ObservationMethodCode>("frequency");
  const [showAdvancedMethods, setShowAdvancedMethods] = useState(false);
  const [setting, setSetting] = useState("");
  const [activity, setActivity] = useState("");
  const [antecedent, setAntecedent] = useState("");
  const [observableBehavior, setObservableBehavior] = useState("");
  const [consequence, setConsequence] = useState("");
  const [count, setCount] = useState(1);
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

  const definitionsByCategory = useMemo(() => {
    const groups = new Map<string, typeof definitionsForStudent>();
    for (const definition of definitionsForStudent) {
      const category = categoryForDefinitionName(definition.name);
      const list = groups.get(category) ?? [];
      list.push(definition);
      groups.set(category, list);
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [definitionsForStudent]);

  const selectedDefinition = definitionsForStudent.find(
    (definition) => definition.id === behaviorDefinitionId,
  );
  const selectedTemplate = selectedDefinition
    ? BEHAVIOR_DEFINITION_TEMPLATES.find(
        (template) => template.name.toLowerCase() === selectedDefinition.name.toLowerCase(),
      )
    : null;

  const primaryMethods = OBSERVATION_METHOD_OPTIONS.filter((option) => option.primary);
  const advancedMethods = OBSERVATION_METHOD_OPTIONS.filter((option) => !option.primary);
  const methodHelp =
    OBSERVATION_METHOD_OPTIONS.find((option) => option.value === method)?.help ?? "";

  useEffect(() => {
    if (!selectedStudentId || !data.organizationId || !data.permissions.canDefine) return;
    if (autoSetupTriedFor.current === selectedStudentId) return;
    autoSetupTriedFor.current = selectedStudentId;

    startSetup(async () => {
      const result = await ensureCommonBehaviorDefinitionsAction({
        organizationId: data.organizationId!,
        studentId: selectedStudentId,
      });
      if ((result.createdCount ?? 0) > 0) {
        setSetupMessage(result.message ?? null);
        router.refresh();
      }
    });
  }, [selectedStudentId, data.organizationId, data.permissions.canDefine, router]);

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
        description="Common ones load automatically: hitting, throwing, tearing up the room, eloping, cussing, grabbing, and more."
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
          {definitionsByCategory.map(([category, definitions]) => (
            <optgroup key={category} label={category}>
              {definitions.map((definition) => (
                <option key={definition.id} value={definition.id}>
                  {definition.name}
                </option>
              ))}
            </optgroup>
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
              autoSetupTriedFor.current = null;
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
            {pendingSetup ? "Setting up…" : "Refresh common behaviors"}
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
            <option value="">Add another from full library…</option>
            {BEHAVIOR_DEFINITION_TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.category} · {template.name}
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

      {showAdvancedMethods ? (
        <FormField id="measurementMethod" label="Advanced recording type" description={methodHelp}>
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
            {advancedMethods.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
      ) : (
        <input type="hidden" name="measurementMethod" value="frequency" />
      )}
      {!showAdvancedMethods ? (
        <button
          type="button"
          className="text-highlight text-sm font-semibold underline"
          onClick={() => setShowAdvancedMethods(true)}
        >
          Show advanced recording types
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

      {!showAdvancedMethods ||
      method === "frequency" ||
      method === "abc" ||
      method === "duration" ? (
        <div className="space-y-4">
          <FormField
            id="recordedAntecedent"
            label="Before (what happened first)"
            description="Choose from the dropdown."
          >
            <Select
              id="recordedAntecedent"
              name="recordedAntecedent"
              value={antecedent}
              onChange={(event) => setAntecedent(event.target.value)}
            >
              <option value="">Choose what happened before…</option>
              {BEHAVIOR_ANTECEDENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            id="observableBehavior"
            label="During (what you saw or heard)"
            description="Choose the observable behavior."
          >
            <Select
              id="observableBehavior"
              name="observableBehavior"
              value={observableBehavior}
              onChange={(event) => setObservableBehavior(event.target.value)}
            >
              <option value="">Choose what happened during…</option>
              {BEHAVIOR_DURING_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField
            id="recordedConsequence"
            label="After (what happened next)"
            description="Choose from the dropdown."
          >
            <Select
              id="recordedConsequence"
              name="recordedConsequence"
              value={consequence}
              onChange={(event) => setConsequence(event.target.value)}
            >
              <option value="">Choose what happened after…</option>
              {BEHAVIOR_CONSEQUENCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            id="count"
            label="How many times? (use + / −)"
            description="Example: eight hits → tap + until it shows 8. Use +5 for fast counting."
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                aria-label="Decrease count"
                onClick={() => setCount((current) => Math.max(0, current - 1))}
              >
                −
              </Button>
              <Input
                id="count"
                name="count"
                type="number"
                min="0"
                required
                className="w-24 text-center text-lg font-semibold"
                value={count}
                onChange={(event) => setCount(Math.max(0, Number(event.target.value) || 0))}
              />
              <Button
                type="button"
                variant="secondary"
                aria-label="Increase count"
                onClick={() => setCount((current) => current + 1)}
              >
                +
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCount((current) => current + 5)}
              >
                +5
              </Button>
            </div>
          </FormField>

          <FormField
            id="durationMinutes"
            label="How long did it last? (minutes)"
            description="Use + / − for episode length."
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                aria-label="Decrease minutes"
                onClick={() =>
                  setDurationMinutes((current) => String(Math.max(0, Number(current || "0") - 1)))
                }
              >
                −
              </Button>
              <Input
                id="durationMinutes"
                type="number"
                min="0"
                step="0.5"
                className="w-24 text-center text-lg font-semibold"
                value={durationMinutes}
                onChange={(event) => setDurationMinutes(event.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                aria-label="Increase minutes"
                onClick={() => setDurationMinutes((current) => String(Number(current || "0") + 1))}
              >
                +
              </Button>
            </div>
          </FormField>
          <input type="hidden" name="durationSeconds" value={totalDurationSeconds} />
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
          <input type="hidden" name="replacementObserved" value="false" />
        </div>
      ) : null}

      {showAdvancedMethods && method === "duration" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="episodeCount" label="How many separate episodes?">
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

      <Alert title="Ideas to try next (how to support / reduce the behavior)" tone="info">
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {(selectedTemplate?.suggestedStrategies?.length
            ? selectedTemplate.suggestedStrategies
            : BEHAVIOR_TRY_NEXT_SUGGESTIONS.slice(0, 5)
          ).map((strategy) => (
            <li key={strategy}>{strategy}</li>
          ))}
        </ul>
      </Alert>
    </form>
  );
}

export function BehaviorQuickStart({ data }: { data: BehaviorData }) {
  const [studentId, setStudentId] = useState(data.students[0]?.id ?? "");
  const [showAddBehavior, setShowAddBehavior] = useState(false);
  const [exportFrom, setExportFrom] = useState("");
  const [exportTo, setExportTo] = useState("");

  if (data.students.length === 0) {
    return (
      <Alert title="Add a student first" tone="warning">
        Create a coded demo student under Students, then come back to log behavior.
      </Alert>
    );
  }

  const sessionsForStudent = data.sessions.filter((session) => session.student_id === studentId);
  const filteredSessions = sessionsForStudent.filter((session) => {
    if (exportFrom && session.session_date < exportFrom) return false;
    if (exportTo && session.session_date > exportTo) return false;
    return true;
  });
  const frequencyBySession = new Map(
    data.frequency.map((entry) => [entry.session_id, entry.count] as const),
  );
  const selectedStudent = data.students.find((student) => student.id === studentId);

  return (
    <div className="space-y-6">
      <Alert title="What Behavior Detective is for" tone="info">
        Quick-count common behaviors with + / − (hitting, throwing, eloping, cussing, and more),
        optionally add before/during/after details, then export a date range for your team.
      </Alert>

      <Card>
        <CardTitle>Student</CardTitle>
        <CardDescription>Everything below uses this student.</CardDescription>
        <div className="mt-4">
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
        </div>
      </Card>

      <BehaviorDailyCountBoard data={data} studentId={studentId || undefined} />

      <AiAssistPanel
        domain="behavior"
        title="AI Assist · Ideas to try"
        description="After you pick a behavior focus, generate reviewable strategies and replacement ideas. Edit before using."
        students={data.students}
        studentId={studentId}
        defaultFocusArea=""
      />

      <Card>
        <CardTitle>Episode details (before / during / after)</CardTitle>
        <CardDescription>
          For one behavior: use dropdowns for before/during/after, count with + / −, note how long
          it lasted, then save. Tips appear at the bottom.
        </CardDescription>
        <div className="mt-4">
          <BehaviorObservationForm data={data} studentId={studentId} />
        </div>
      </Card>

      <Card>
        <CardTitle>Export a date range</CardTitle>
        <CardDescription>
          Choose dates, download CSV/Excel, print PDF, or open email to your coordinator (attach the
          CSV).
        </CardDescription>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <FormField id="exportFrom" label="From date">
            <Input
              id="exportFrom"
              type="date"
              value={exportFrom}
              onChange={(event) => setExportFrom(event.target.value)}
            />
          </FormField>
          <FormField id="exportTo" label="To date">
            <Input
              id="exportTo"
              type="date"
              value={exportTo}
              onChange={(event) => setExportTo(event.target.value)}
            />
          </FormField>
        </div>
        <div className="mt-4">
          <SectionExportBar
            title={`Behavior log · ${selectedStudent ? studentName(selectedStudent) : "Student"}`}
            filename={`behavior-${selectedStudent?.local_identifier || studentId || "student"}`}
            headers={["Date", "Method", "Count", "Setting", "Activity", "Status"]}
            rows={filteredSessions.map((session) => [
              session.session_date,
              session.measurement_method,
              frequencyBySession.get(session.id) ?? "",
              session.setting ?? "",
              session.activity ?? "",
              session.status,
            ])}
            emptyMessage="No observations in this range yet. Save a daily log first."
          />
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
