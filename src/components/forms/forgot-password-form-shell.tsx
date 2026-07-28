"use client";

import { useId, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordFormShell() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const liveRegionId = useId();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "Password reset is not connected yet. Email delivery and Supabase recovery will be enabled in a later authorized phase.",
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <Label htmlFor="recovery-email">Work email</Label>
        <Input
          id="recovery-email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby="recovery-help"
        />
        <p id="recovery-help" className="text-muted mt-1 text-sm">
          No email will be sent from this development shell.
        </p>
      </div>
      <div id={liveRegionId} aria-live="polite">
        {message ? (
          <Alert title="Reset unavailable" tone="info">
            {message}
          </Alert>
        ) : null}
      </div>
      <Button type="submit" className="w-full">
        Request reset link
      </Button>
    </form>
  );
}
