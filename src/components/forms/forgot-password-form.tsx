"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { requestPasswordReset, type AuthActionState } from "@/lib/auth/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Requesting..." : "Request reset link"}
    </Button>
  );
}

export function ForgotPasswordForm({
  configurationNeeded = false,
}: {
  configurationNeeded?: boolean;
}) {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);
  const liveRegionId = useId();
  const emailError = state.fieldErrors?.email;

  return (
    <form className="mt-6 space-y-4" action={formAction} noValidate aria-describedby={liveRegionId}>
      {configurationNeeded ? (
        <Alert title="Configuration needed" tone="warning">
          Supabase authentication is not configured in this environment. Password reset email
          delivery is unavailable until configuration is added.
        </Alert>
      ) : null}
      <div>
        <Label htmlFor="recovery-email">Work email</Label>
        <Input
          id="recovery-email"
          name="email"
          type="email"
          autoComplete="username"
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "recovery-email-error" : "recovery-help"}
          required
        />
        <p id="recovery-help" className="text-muted mt-1 text-sm">
          For privacy, reset requests use the same message whether or not an account exists.
        </p>
        {emailError ? (
          <p
            id="recovery-email-error"
            role="alert"
            className="text-danger mt-1 text-sm font-medium"
          >
            {emailError}
          </p>
        ) : null}
      </div>
      <div id={liveRegionId} aria-live="polite">
        {state.message ? (
          <Alert
            title={state.status === "success" ? "Check your email" : "Unable to request reset"}
            tone={state.status === "success" ? "success" : "danger"}
          >
            {state.message}
          </Alert>
        ) : null}
      </div>
      <SubmitButton />
    </form>
  );
}
