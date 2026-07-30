"use client";

import { useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/form-field";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { generateAiAssistSuggestionsAction } from "@/lib/actions/ai-assist";
import type { AiAssistDomain, AiSuggestion } from "@/lib/ai/types";

export function AiAssistPanel({
  domain,
  title = "Draft assistant",
  description = "Generate a reviewable starting draft. Edit before sending or saving.",
  defaultFocusArea = "",
  onApply,
}: {
  domain: AiAssistDomain;
  title?: string;
  description?: string;
  defaultFocusArea?: string;
  onApply?: (suggestion: AiSuggestion) => void;
}) {
  const [focusArea, setFocusArea] = useState(defaultFocusArea);
  const [studentContext, setStudentContext] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [modeLabel, setModeLabel] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);

  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      <div className="mt-4 space-y-3">
        <FormField id={`${domain}-focus`} label="Focus area">
          <Input
            id={`${domain}-focus`}
            value={focusArea}
            onChange={(event) => setFocusArea(event.target.value)}
            placeholder="reading fluency, transitions, calm-down routine…"
          />
        </FormField>
        <FormField id={`${domain}-context`} label="Student context (optional)">
          <Input
            id={`${domain}-context`}
            value={studentContext}
            onChange={(event) => setStudentContext(event.target.value)}
            placeholder="Grade, setting, or support need"
          />
        </FormField>
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
          disabled={pending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await generateAiAssistSuggestionsAction({
                domain,
                focusArea,
                studentContext,
                extraNotes,
              });
              setDisclaimer(result.disclaimer);
              setModeLabel(
                result.mode === "model_assist"
                  ? "Model-assisted draft"
                  : result.mode === "local_intelligence"
                    ? "Catalog-assisted draft"
                    : null,
              );
              setSuggestions(result.suggestions);
              if (!result.enabled) {
                setError(result.message ?? "Draft assistant is unavailable.");
              } else if (result.message) {
                setError(result.message);
              }
            });
          }}
        >
          {pending ? "Generating…" : "Generate draft"}
        </Button>
      </div>

      {disclaimer ? (
        <div className="mt-4">
          <Alert title="Educator review required" tone="info">
            {disclaimer}
            {modeLabel ? ` Mode: ${modeLabel}.` : ""}
          </Alert>
        </div>
      ) : null}

      {error ? (
        <div className="mt-3">
          <Alert title="AI Assist note" tone="warning">
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
