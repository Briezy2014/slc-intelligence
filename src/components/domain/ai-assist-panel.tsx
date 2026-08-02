"use client";

import { useMemo, useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/form-field";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SpecificBehaviorSelect } from "@/components/domain/specific-behavior-select";
import { generateAiAssistSuggestionsAction } from "@/lib/actions/ai-assist";
import { getBehaviorDefinitionTemplate } from "@/lib/catalogs/behavior-templates";
import type { AiAssistDomain, AiSuggestion } from "@/lib/ai/types";

type AssistStudent = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  local_identifier?: string | null;
};

function displayStudentName(student: AssistStudent) {
  const display = student.preferred_name || student.first_name;
  return `${student.last_name}, ${display}${
    student.local_identifier ? ` (${student.local_identifier})` : ""
  }`;
}

export function AiAssistPanel({
  domain,
  title = "Draft assistant",
  description = "Generate a reviewable starting draft. Edit before sending or saving.",
  defaultFocusArea = "",
  students = [],
  studentId,
  onApply,
}: {
  domain: AiAssistDomain;
  title?: string;
  description?: string;
  defaultFocusArea?: string;
  /** When provided for family letters, shows a Student dropdown. */
  students?: AssistStudent[];
  /** Prefill / lock student when opened from a student page. */
  studentId?: string;
  onApply?: (suggestion: AiSuggestion) => void;
}) {
  const [behaviorTemplateId, setBehaviorTemplateId] = useState("");
  const [focusArea, setFocusArea] = useState(defaultFocusArea);
  const [selectedStudentId, setSelectedStudentId] = useState(studentId ?? "");
  const [studentContext, setStudentContext] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);

  const isCommunication = domain === "communication";
  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) ?? students[0],
    [students, selectedStudentId],
  );
  const studentFirstName = selectedStudent
    ? selectedStudent.preferred_name || selectedStudent.first_name
    : undefined;

  function selectBehavior(id: string) {
    setBehaviorTemplateId(id);
    const template = getBehaviorDefinitionTemplate(id);
    if (template) {
      setFocusArea(template.name);
    }
  }

  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      <div className="mt-4 space-y-3">
        {isCommunication && students.length > 0 ? (
          <FormField id={`${domain}-student`} label="1. Which student?">
            <Select
              id={`${domain}-student`}
              value={selectedStudentId || selectedStudent?.id || ""}
              onChange={(event) => setSelectedStudentId(event.target.value)}
              disabled={Boolean(studentId) && students.length === 1}
            >
              <option value="">Choose student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {displayStudentName(student)}
                </option>
              ))}
            </Select>
          </FormField>
        ) : null}
        {isCommunication ? (
          <SpecificBehaviorSelect
            id={`${domain}-specific-behavior`}
            label="2. Which behavior is this letter about?"
            value={behaviorTemplateId}
            onChange={selectBehavior}
            helperText="Pick from the list. The letter will use parent-friendly wording — not staff jargon."
          />
        ) : null}
        <FormField
          id={`${domain}-focus`}
          label={
            isCommunication ? "Focus area (auto-filled from behavior, or custom)" : "Focus area"
          }
        >
          <Input
            id={`${domain}-focus`}
            value={focusArea}
            onChange={(event) => {
              setFocusArea(event.target.value);
              if (isCommunication) setBehaviorTemplateId("");
            }}
            placeholder={
              isCommunication
                ? "Select a specific behavior above, or type a non-behavior focus"
                : "reading fluency, transitions, calm-down routine…"
            }
          />
        </FormField>
        {!isCommunication || students.length === 0 ? (
          <FormField id={`${domain}-context`} label="Student context (optional)">
            <Input
              id={`${domain}-context`}
              value={studentContext}
              onChange={(event) => setStudentContext(event.target.value)}
              placeholder="Grade, setting, or support need"
            />
          </FormField>
        ) : (
          <FormField id={`${domain}-context`} label="Extra classroom context (optional)">
            <Input
              id={`${domain}-context`}
              value={studentContext}
              onChange={(event) => setStudentContext(event.target.value)}
              placeholder="Setting, time of day, or what happened"
            />
          </FormField>
        )}
        <FormField id={`${domain}-notes`} label="Notes (optional)">
          <Textarea
            id={`${domain}-notes`}
            value={extraNotes}
            onChange={(event) => setExtraNotes(event.target.value)}
            placeholder="What should this draft emphasize?"
          />
        </FormField>
        <Button
          type="button"
          disabled={pending || (isCommunication && !focusArea.trim() && !behaviorTemplateId)}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await generateAiAssistSuggestionsAction({
                domain,
                focusArea,
                studentContext,
                extraNotes,
                behaviorTemplateId: behaviorTemplateId || undefined,
                studentFirstName: studentFirstName || undefined,
              });
              setSuggestions(result.suggestions);
              if (!result.enabled) {
                setError(result.message ?? "Draft assistant is unavailable.");
              }
            });
          }}
        >
          {pending ? "Generating…" : "Generate draft"}
        </Button>
      </div>

      {error ? (
        <div className="mt-3">
          <Alert title="Could not generate" tone="warning">
            {error}
          </Alert>
        </div>
      ) : null}

      {suggestions.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} className="border-border rounded-[var(--radius-md)] border p-3">
              <p className="font-semibold">{suggestion.title}</p>
              <p className="text-muted mt-1 text-sm">{suggestion.summary}</p>
              <pre className="text-foreground mt-2 rounded-[var(--radius-md)] bg-[rgb(18_6_45/0.45)] p-3 text-xs leading-relaxed whitespace-pre-wrap">
                {suggestion.draftText}
              </pre>
              <p className="text-muted mt-2 text-xs">{suggestion.rationale}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {onApply ? (
                  <Button type="button" variant="secondary" onClick={() => onApply(suggestion)}>
                    Apply suggestion to form
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(suggestion.draftText);
                    } catch {
                      // Clipboard may be unavailable; ignore quietly.
                    }
                  }}
                >
                  Copy draft
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
