"use client";

import { useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms/form-field";
import { Textarea } from "@/components/ui/textarea";
import { runParaSupportsExplainerAction } from "@/lib/actions/instructional-intelligence";

export function ParaSupportsExplainerPanel() {
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card>
      <CardTitle>Explain approved supports in plain language</CardTitle>
      <CardDescription>
        Paste accommodations or supports from the plan. Get a do / don’t view for classroom use.
      </CardDescription>
      <form
        className="mt-4 space-y-3"
        action={(formData) => {
          setError(null);
          startTransition(async () => {
            const result = await runParaSupportsExplainerAction({
              supportsText: String(formData.get("supportsText") ?? ""),
            });
            if (!result.ok) {
              setError(result.message ?? "Could not explain supports.");
              setDraft(null);
              return;
            }
            setDraft(result.draftText);
          });
        }}
      >
        <FormField id="para-supports-text" label="Approved supports">
          <Textarea
            id="para-supports-text"
            name="supportsText"
            required
            placeholder={"Extended time\nPreferential seating\nVisual first-then board\nBreak card"}
          />
        </FormField>
        <Button type="submit" disabled={pending}>
          {pending ? "Working…" : "Make para-friendly"}
        </Button>
      </form>
      {error ? (
        <div className="mt-4">
          <Alert title="Could not run" tone="warning">
            {error}
          </Alert>
        </div>
      ) : null}
      {draft ? (
        <div className="mt-4">
          <Alert title="Para-friendly supports" tone="info">
            <pre className="text-sm whitespace-pre-wrap">{draft}</pre>
          </Alert>
        </div>
      ) : null}
    </Card>
  );
}
