"use client";

import Link from "next/link";
import { useId, useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

function safeNextPath(value: string | null | undefined, fallback = "/command-center") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

function mapBrowserAuthError(error: { message?: string; status?: number } | null): string {
  const message = (error?.message ?? "").toLowerCase();
  const status = error?.status;

  if (status === 429 || message.includes("rate") || message.includes("too many")) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }
  if (
    message.includes("invalid login") ||
    message.includes("invalid credentials") ||
    message.includes("invalid email or password") ||
    status === 400
  ) {
    return "Invalid email or password. If you just created this user in Supabase, set the password again on the user page and retry.";
  }
  if (message.includes("email not confirmed")) {
    return "This email is not confirmed yet. Open the user in Supabase Auth and confirm the account.";
  }
  if (message.includes("no api key") || message.includes("invalid api key") || status === 401) {
    return "Authentication is misconfigured. In Vercel, re-enter NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_ANON_KEY with no spaces or line breaks, then redeploy.";
  }
  return "We could not complete that request. Check your information and try again.";
}

export function SignInForm({
  next = "/command-center",
  configurationNeeded = false,
}: {
  next?: string;
  configurationNeeded?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const liveRegionId = useId();
  const destination = safeNextPath(next, "/command-center");

  return (
    <form
      className="mt-6 space-y-4"
      noValidate
      aria-describedby={liveRegionId}
      onSubmit={(event) => {
        event.preventDefault();
        setEmailError(null);
        setPasswordError(null);
        setMessage(null);

        if (configurationNeeded) {
          setMessage("Supabase authentication is not configured in this environment.");
          return;
        }

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        if (!email || !email.includes("@")) {
          setEmailError("Enter a valid email address.");
          return;
        }
        if (!password) {
          setPasswordError("Password is required.");
          return;
        }

        startTransition(async () => {
          try {
            const supabase = createBrowserSupabaseClient();
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
              setMessage(mapBrowserAuthError(error));
              return;
            }
            // Full navigation ensures middleware sees the new auth cookies.
            window.location.assign(destination);
          } catch {
            setMessage("We could not complete that request. Check your information and try again.");
          }
        });
      }}
    >
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
        {message ? (
          <Alert title="Unable to sign in" tone="danger">
            {message}
          </Alert>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={pending || configurationNeeded}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-muted text-center text-sm">
        Need an account?{" "}
        <Link href="/request-access" className="text-accent font-semibold hover:underline">
          Request access
        </Link>
      </p>
    </form>
  );
}
