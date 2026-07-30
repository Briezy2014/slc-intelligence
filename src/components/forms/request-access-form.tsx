"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ROLE_LABELS } from "@/lib/permissions/matrix";
import { REQUESTABLE_ROLE_CODES } from "@/lib/validation/access-requests";
import type { RoleCode } from "@/lib/supabase/types";

function mapSignupError(error: { message?: string; status?: number } | null): string {
  const message = (error?.message ?? "").toLowerCase();
  if (message.includes("already registered") || message.includes("already been registered")) {
    return "An account with this email already exists. Sign in, then ask your administrator if your access request is still pending.";
  }
  if (message.includes("password")) {
    return "Choose a stronger password (at least 8 characters).";
  }
  if (message.includes("rate") || message.includes("too many")) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }
  if (message.includes("organization not found")) {
    return "That invite code was not found. Check the code with your administrator.";
  }
  if (message.includes("pending request already exists")) {
    return "You already have a pending request. An administrator still needs to approve it.";
  }
  if (message.includes("already have active access")) {
    return "You already have access. Sign in instead.";
  }
  return "We could not complete that request. Check your information and try again.";
}

export function RequestAccessForm({
  defaultOrganizationSlug = "",
}: {
  defaultOrganizationSlug?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<RoleCode[]>(["special_education_teacher"]);

  const roleOptions = useMemo(
    () =>
      REQUESTABLE_ROLE_CODES.map((code) => ({
        code,
        label: ROLE_LABELS[code],
      })),
    [],
  );

  function toggleRole(code: RoleCode) {
    setSelectedRoles((current) =>
      current.includes(code) ? current.filter((role) => role !== code) : [...current, code],
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(null);
        const formData = new FormData(event.currentTarget);
        const fullName = String(formData.get("fullName") ?? "").trim();
        const email = String(formData.get("email") ?? "")
          .trim()
          .toLowerCase();
        const password = String(formData.get("password") ?? "");
        const confirmPassword = String(formData.get("confirmPassword") ?? "");
        const organizationSlug = String(formData.get("organizationSlug") ?? "")
          .trim()
          .toLowerCase();
        const note = String(formData.get("message") ?? "").trim();

        if (selectedRoles.length === 0) {
          setMessage("Select at least one role checkbox.");
          return;
        }
        if (password !== confirmPassword) {
          setMessage("Passwords must match.");
          return;
        }
        if (password.length < 8) {
          setMessage("Password must be at least 8 characters.");
          return;
        }

        startTransition(async () => {
          try {
            const supabase = createBrowserSupabaseClient();
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: { full_name: fullName },
              },
            });

            if (signUpError) {
              setMessage(mapSignupError(signUpError));
              return;
            }

            const userId = signUpData.user?.id;
            if (!userId) {
              setMessage(
                "Check your email to confirm the account, then sign in. If confirmation is disabled, try again.",
              );
              return;
            }

            // Ensure profile exists for membership FK / request linkage.
            const { error: profileError } = await supabase.from("user_profiles").upsert({
              id: userId,
              display_name: fullName,
              preferred_name: fullName.split(" ")[0] ?? fullName,
              status: "active",
            });

            if (profileError) {
              setMessage(
                "Account was created, but profile setup failed. Sign in and contact your administrator.",
              );
              return;
            }

            const { error: requestError } = await supabase.rpc(
              "submit_organization_access_request",
              {
                p_org_slug: organizationSlug,
                p_full_name: fullName,
                p_email: email,
                p_requested_role_codes: selectedRoles,
                p_message: note || null,
              },
            );

            if (requestError) {
              setMessage(mapSignupError(requestError));
              return;
            }

            router.push("/membership-pending?requested=1");
            router.refresh();
          } catch {
            setMessage("We could not complete that request. Check your information and try again.");
          }
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" required autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Work email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="organizationSlug">Staff invite code</Label>
        <Input
          id="organizationSlug"
          name="organizationSlug"
          required
          defaultValue={defaultOrganizationSlug}
          placeholder="Ask your administrator"
          autoComplete="organization"
        />
        <p className="text-muted text-xs">
          Use the invite code your administrator shares with new staff.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="text-accent absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Requested role(s)</legend>
        <p className="text-muted text-xs">
          Check the roles that describe your work. Your administrator chooses the final approved
          role.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {roleOptions.map((role) => {
            const checked = selectedRoles.includes(role.code);
            return (
              <label
                key={role.code}
                className="border-border flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border bg-[rgb(18_6_45/0.45)] px-3 py-3 text-sm"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={checked}
                  onChange={() => toggleRole(role.code)}
                />
                <span>{role.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="message">Note to administrator (optional)</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="School, classroom, or supervisor context"
        />
      </div>

      {message ? (
        <Alert title="Unable to submit request" tone="danger">
          {message}
        </Alert>
      ) : null}

      <Alert title="Approval required" tone="info">
        Creating an account does not grant access immediately. An organization administrator must
        approve your request.
      </Alert>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Submitting…" : "Create account and request access"}
      </Button>

      <p className="text-muted text-center text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-accent font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
