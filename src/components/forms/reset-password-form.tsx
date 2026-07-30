"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { updatePassword, type AuthActionState } from "@/lib/auth/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Updating..." : "Update password"}
    </Button>
  );
}

export function ResetPasswordForm({
  configurationNeeded = false,
}: {
  configurationNeeded?: boolean;
}) {
  const [state, formAction] = useActionState(updatePassword, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const liveRegionId = useId();
  const passwordError = state.fieldErrors?.password;
  const confirmPasswordError = state.fieldErrors?.confirmPassword;

  return (
    <form className="mt-6 space-y-4" action={formAction} noValidate aria-describedby={liveRegionId}>
      {configurationNeeded ? (
        <Alert title="Configuration needed" tone="warning">
          Supabase authentication is not configured in this environment. Password updates require a
          configured Supabase project.
        </Alert>
      ) : null}
      <div>
        <Label htmlFor="password">New password</Label>
        <div className="flex gap-2">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? "password-error" : "password-help"}
            className="flex-1"
            required
          />
          <Button
            type="button"
            variant="secondary"
            aria-pressed={showPassword}
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        </div>
        <p id="password-help" className="text-muted mt-1 text-sm">
          Use at least 8 characters.
        </p>
        {passwordError ? (
          <p id="password-error" role="alert" className="text-danger mt-1 text-sm font-medium">
            {passwordError}
          </p>
        ) : null}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          aria-invalid={Boolean(confirmPasswordError)}
          aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
          required
        />
        {confirmPasswordError ? (
          <p
            id="confirm-password-error"
            role="alert"
            className="text-danger mt-1 text-sm font-medium"
          >
            {confirmPasswordError}
          </p>
        ) : null}
      </div>
      <div id={liveRegionId} aria-live="polite">
        {state.message ? (
          <Alert
            title={state.status === "success" ? "Password updated" : "Unable to update password"}
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
