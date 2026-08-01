"use client";

import { useState, useTransition } from "react";
import { FormField } from "@/components/forms/form-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateOwnProfileAction } from "@/lib/actions/profile";

const OWNER_DISPLAY_NAME = "Kara Williams";

export function ProfileNameForm({
  initialDisplayName,
  initialPreferredName,
}: {
  initialDisplayName?: string | null;
  initialPreferredName?: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [displayName, setDisplayName] = useState(initialDisplayName ?? "");
  const [preferredName, setPreferredName] = useState(initialPreferredName ?? "");
  const [message, setMessage] = useState<{ tone: "info" | "warning"; text: string } | null>(null);

  return (
    <form
      className="space-y-3"
      action={(formData) => {
        setMessage(null);
        startTransition(async () => {
          const result = await updateOwnProfileAction(formData);
          if (result.status === "success") {
            setMessage({ tone: "info", text: result.message ?? "Saved." });
          } else {
            setMessage({
              tone: "warning",
              text: result.message ?? "Could not save your name.",
            });
          }
        });
      }}
    >
      <FormField id="displayName" label="Full name (shown on Staff)">
        <Input
          id="displayName"
          name="displayName"
          required
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder={OWNER_DISPLAY_NAME}
        />
      </FormField>
      <FormField id="preferredName" label="Preferred first name" description="Optional short name.">
        <Input
          id="preferredName"
          name="preferredName"
          value={preferredName}
          onChange={(event) => setPreferredName(event.target.value)}
          placeholder="Kara"
        />
      </FormField>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save my name"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() => {
            setDisplayName(OWNER_DISPLAY_NAME);
            setPreferredName("Kara");
          }}
        >
          Use Kara Williams
        </Button>
      </div>
      {message ? (
        <Alert title={message.tone === "info" ? "Saved" : "Could not save"} tone={message.tone}>
          {message.text}
        </Alert>
      ) : null}
    </form>
  );
}
