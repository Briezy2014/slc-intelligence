"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInShellSchema } from "@/lib/validation";

export function SignInFormShell() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const formErrorId = useId();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = signInShellSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      setMessage(null);
      return;
    }

    setErrors({});
    setMessage(
      "Authentication is not enabled in this phase. Supabase sign-in will be connected in Phase 3.",
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate aria-describedby={formErrorId}>
      <div>
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email ? (
          <p id="email-error" role="alert" className="text-danger mt-1 text-sm font-medium">
            {errors.email}
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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : "password-help"}
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            aria-pressed={showPassword}
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? "Hide password" : "Show password"}
          </Button>
        </div>
        <p id="password-help" className="text-muted mt-1 text-sm">
          Passwords are not submitted to any authentication service in Bundle 1.
        </p>
        {errors.password ? (
          <p id="password-error" role="alert" className="text-danger mt-1 text-sm font-medium">
            {errors.password}
          </p>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <Link href="/forgot-password" className="text-accent font-semibold hover:underline">
          Forgot password
        </Link>
      </div>
      <div id={formErrorId} aria-live="polite">
        {message ? (
          <Alert title="Authentication deferred" tone="info">
            {message}
          </Alert>
        ) : null}
      </div>
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
}
