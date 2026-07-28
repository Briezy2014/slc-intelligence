"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithPassword, type AuthActionState } from "@/lib/auth/actions";

const initialState: AuthActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}

export function SignInForm({
  next = "/command-center",
  configurationNeeded = false,
}: {
  next?: string;
  configurationNeeded?: boolean;
}) {
  const [state, formAction] = useActionState(signInWithPassword, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const liveRegionId = useId();
  const emailError = state.fieldErrors?.email;
  const passwordError = state.fieldErrors?.password;

  return (
    <form className="mt-6 space-y-4" action={formAction} noValidate aria-describedby={liveRegionId}>
      <input type="hidden" name="next" value={next} />
      {configurationNeeded ? (
        <Alert title="Configuration needed" tone="warning">
          Supabase authentication is not configured in this environment. Add the Supabase URL and
          anon key to enable sign-in.
        </Alert>
      ) : null}
      <div>
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "email-error" : undefined}
          required
        />
        {emailError ? (
          <p id="email-error" role="alert" className="text-danger mt-1 text-sm font-medium">
            {emailError}
          </p>
        ) : null}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="flex gap-2">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? "password-error" : undefined}
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
        {passwordError ? (
          <p id="password-error" role="alert" className="text-danger mt-1 text-sm font-medium">
            {passwordError}
          </p>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <Link href="/forgot-password" className="text-accent font-semibold hover:underline">
          Forgot password?
        </Link>
      </div>
      <div id={liveRegionId} aria-live="polite">
        {state.message ? (
          <Alert title={state.status === "success" ? "Request complete" : "Unable to sign in"} tone={state.status === "success" ? "success" : "danger"}>
            {state.message}
          </Alert>
        ) : null}
      </div>
      <SubmitButton />
    </form>
  );
}
