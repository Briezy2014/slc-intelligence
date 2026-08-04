"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/forms/form-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  ensureCommonBehaviorDefinitionsAction,
  saveBehaviorFrequencyBatchAction,
} from "@/lib/actions/behavior";
import {
  BEHAVIOR_DEFINITION_TEMPLATES,
  BEHAVIOR_SETTING_OPTIONS,
  BEHAVIOR_TRY_NEXT_SUGGESTIONS,
} from "@/lib/catalogs/behavior-templates";
import type { BehaviorData } from "@/lib/data/behavior";

function studentName(student: BehaviorData["students"][number]) {
  return `${student.last_name}, ${student.preferred_name || student.first_name}`;
}

function categoryForDefinitionName(name: string): string {
  const match = BEHAVIOR_DEFINITION_TEMPLATES.find(
    (template) => template.name.toLowerCase() === name.toLowerCase(),
  );
  return match?.category ?? "Other";
}

function strategiesForDefinition(name: string): string[] {
  const match = BEHAVIOR_DEFINITION_TEMPLATES.find(
    (template) => template.name.toLowerCase() === name.toLowerCase(),
  );
  return match?.suggestedStrategies ?? [];
}

export function BehaviorDailyCountBoard({
  data,
  studentId: lockedStudentId,
}: {
  data: BehaviorData;
  studentId?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [studentId, setStudentId] = useState(lockedStudentId ?? data.students[0]?.id ?? "");
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [setting, setSetting] = useState("Classroom · whole group");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const autoSetupTriedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!lockedStudentId) return;
    setStudentId(lockedStudentId);
    autoSetupTriedFor.current = null;
    setCounts({});
  }, [lockedStudentId]);

  const definitions = useMemo(
    () =>
      data.definitions.filter(
        (definition) => definition.student_id === studentId && definition.status !== "archived",
      ),
    [data.definitions, studentId],
  );

  const grouped = useMemo(() => {
    const groups = new Map<string, typeof definitions>();
    for (const definition of definitions) {
      const category = categoryForDefinitionName(definition.name);
      const list = groups.get(category) ?? [];
      list.push(definition);
      groups.set(category, list);
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [definitions]);

  useEffect(() => {
    if (!studentId || !data.organizationId || !data.permissions.canDefine) return;
    if (autoSetupTriedFor.current === studentId) return;
    autoSetupTriedFor.current = studentId;
    startTransition(async () => {
      const result = await ensureCommonBehaviorDefinitionsAction({
        organizationId: data.organizationId!,
        studentId,
      });
      if ((result.createdCount ?? 0) > 0) {
        setMessage(result.message ?? "Common behaviors added.");
        setStatus("success");
        router.refresh();
      }
    });
  }, [studentId, data.organizationId, data.permissions.canDefine, router]);

  const activeCounts = useMemo(
    () =>
      definitions
        .map((definition) => ({
          definition,
          count: counts[definition.id] ?? 0,
        }))
        .filter((entry) => entry.count > 0),
    [counts, definitions],
  );

  const tipStrategies = useMemo(() => {
    const fromCounts = activeCounts.flatMap((entry) =>
      strategiesForDefinition(entry.definition.name).map((strategy) => ({
        behavior: entry.definition.name,
        strategy,
      })),
    );
    if (fromCounts.length) return fromCounts.slice(0, 6);
    return BEHAVIOR_TRY_NEXT_SUGGESTIONS.slice(0, 5).map((strategy) => ({
      behavior: "General",
      strategy,
    }));
  }, [activeCounts]);

  function adjust(id: string, delta: number) {
    setCounts((current) => {
      const next = Math.max(0, (current[id] ?? 0) + delta);
      return { ...current, [id]: next };
    });
  }

  function saveBoard() {
    if (!data.organizationId || !studentId) return;
    startTransition(async () => {
      setMessage(null);
      const result = await saveBehaviorFrequencyBatchAction({
        organizationId: data.organizationId!,
        studentId,
        sessionDate,
        setting,
        observationDurationSeconds: 300,
        counts: definitions.map((definition) => ({
          behaviorDefinitionId: definition.id,
          count: counts[definition.id] ?? 0,
        })),
      });
      setStatus(result.status === "success" ? "success" : "error");
      setMessage(result.message ?? null);
      if (result.status === "success") {
        setCounts({});
        router.refresh();
      }
    });
  }

  if (!data.permissions.canObserve) {
    return (
      <Alert title="Permission needed" tone="warning">
        You need permission to log behavior counts.
      </Alert>
    );
  }

  return (
    <Card>
      <CardTitle>Quick daily count</CardTitle>
      <CardDescription>
        Pick the student. Tap + / − for each behavior you see today (hitting 5, throwing 3, leaving
        the room 4). Save once at the bottom.
      </CardDescription>

      <div className="mt-4 space-y-4">
        {!lockedStudentId ? (
          <FormField id="dailyCountStudent" label="Student">
            <Select
              id="dailyCountStudent"
              value={studentId}
              onChange={(event) => {
                setStudentId(event.target.value);
                setCounts({});
                setMessage(null);
                autoSetupTriedFor.current = null;
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
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <FormField id="dailyCountDate" label="Date">
            <Input
              id="dailyCountDate"
              type="date"
              value={sessionDate}
              onChange={(event) => setSessionDate(event.target.value)}
              required
            />
          </FormField>
          <FormField id="dailyCountSetting" label="Where?">
            <Select
              id="dailyCountSetting"
              value={setting}
              onChange={(event) => setSetting(event.target.value)}
            >
              {BEHAVIOR_SETTING_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        {!studentId ? (
          <Alert title="Choose a student" tone="info">
            Select a student to load common classroom behaviors with + / − counters.
          </Alert>
        ) : pending && definitions.length === 0 ? (
          <Alert title="Setting up behaviors…" tone="info">
            Adding the common classroom list (hitting, throwing, eloping, cussing, and more).
          </Alert>
        ) : definitions.length === 0 ? (
          <Alert title="No behaviors yet" tone="warning">
            Tap “Refresh common behaviors” below, or add starters under the detailed log.
          </Alert>
        ) : (
          <div className="space-y-4">
            {grouped.map(([category, items]) => (
              <div key={category} className="space-y-2">
                <p className="text-muted text-xs font-semibold tracking-wide uppercase">
                  {category}
                </p>
                <ul className="divide-border border-border divide-y rounded-[var(--radius-md)] border">
                  {items.map((definition) => {
                    const value = counts[definition.id] ?? 0;
                    return (
                      <li
                        key={definition.id}
                        className="flex flex-wrap items-center justify-between gap-3 px-3 py-3"
                      >
                        <span className="text-foreground min-w-0 flex-1 font-medium">
                          {definition.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            aria-label={`Decrease ${definition.name}`}
                            onClick={() => adjust(definition.id, -1)}
                          >
                            −
                          </Button>
                          <span
                            className="min-w-10 text-center text-lg font-semibold tabular-nums"
                            aria-live="polite"
                          >
                            {value}
                          </span>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            aria-label={`Increase ${definition.name}`}
                            onClick={() => adjust(definition.id, 1)}
                          >
                            +
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-label={`Add five to ${definition.name}`}
                            onClick={() => adjust(definition.id, 5)}
                          >
                            +5
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeCounts.length ? (
          <Alert title="Today’s running totals" tone="info">
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {activeCounts.map((entry) => (
                <li key={entry.definition.id}>
                  {entry.definition.name}: <strong>{entry.count}</strong>
                </li>
              ))}
            </ul>
          </Alert>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={saveBoard}
            disabled={pending || !studentId || activeCounts.length === 0}
          >
            {pending ? "Saving…" : "Save today’s counts"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={pending || !studentId || !data.organizationId || !data.permissions.canDefine}
            onClick={() => {
              if (!studentId || !data.organizationId) return;
              autoSetupTriedFor.current = null;
              startTransition(async () => {
                const result = await ensureCommonBehaviorDefinitionsAction({
                  organizationId: data.organizationId!,
                  studentId,
                });
                setStatus(result.status === "success" ? "success" : "error");
                setMessage(result.message ?? null);
                router.refresh();
              });
            }}
          >
            Refresh common behaviors
          </Button>
        </div>

        {message ? (
          <Alert title={status === "error" ? "Could not save" : "Saved"} tone={status === "error" ? "warning" : "info"}>
            {message}
          </Alert>
        ) : null}

        <Alert title="Ideas to try next (how to support / reduce the behavior)" tone="info">
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {tipStrategies.map((item) => (
              <li key={`${item.behavior}-${item.strategy}`}>
                {item.behavior !== "General" ? (
                  <span className="font-semibold">{item.behavior}: </span>
                ) : null}
                {item.strategy}
              </li>
            ))}
          </ul>
        </Alert>
      </div>
    </Card>
  );
}
