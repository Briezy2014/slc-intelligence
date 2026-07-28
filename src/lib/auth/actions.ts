"use server";

import { redirect } from "next/navigation";
import { isServerSupabaseConfigured, getPublicEnv } from "@/lib/env";
import {
  configurationNeededMessage,
  mapAuthError,
  passwordResetRequestMessage,
} from "@/lib/auth/errors";
import { getUser, safeRedirectPath } from "@/lib/auth/session";
import { writeAuditEvent } from "@/lib/audit/log";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  inviteSchema,
  resetPasswordSchema,
  signInSchema,
} from "@/lib/validation/auth";

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string | undefined>;
};

const DEFAULT_AUTH_STATE: AuthActionState = { status: "idle" };

function fieldErrorsFrom(error: { flatten: () => { fieldErrors: Record<string, string[]> } }) {
  const fieldErrors = error.flatten().fieldErrors;
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, messages]) => [key, messages[0]]),
  );
}

function passwordResetRedirectUrl() {
  const appUrl = getPublicEnv().NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return undefined;
  }

  return `${appUrl.replace(/\/$/, "")}/auth/callback?next=/reset-password`;
}

export async function signInWithPassword(
  _previousState: AuthActionState = DEFAULT_AUTH_STATE,
  formData: FormData,
): Promise<AuthActionState> {
  void _previousState;

  if (!isServerSupabaseConfigured()) {
    return { status: "error", message: configurationNeededMessage() };
  }

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    await writeAuditEvent({
      actionType: "auth.sign_in",
      resourceType: "auth.session",
      success: false,
      requestContext: { email_domain: parsed.data.email.split("@")[1] ?? null },
    });
    return { status: "error", message: mapAuthError(error) };
  }

  await writeAuditEvent({
    actorUserId: data.user?.id ?? null,
    actionType: "auth.sign_in",
    resourceType: "auth.session",
    success: true,
  });

  redirect(safeRedirectPath(parsed.data.next, "/command-center"));
}

export async function signOut(): Promise<void> {
  if (!isServerSupabaseConfigured()) {
    redirect("/sign-in?message=configuration-needed");
  }

  const user = await getUser();
  const supabase = await createClient();
  await supabase.auth.signOut();
  await writeAuditEvent({
    actorUserId: user?.id ?? null,
    actionType: "auth.sign_out",
    resourceType: "auth.session",
    success: true,
  });

  redirect("/sign-in");
}

export async function requestPasswordReset(
  _previousState: AuthActionState = DEFAULT_AUTH_STATE,
  formData: FormData,
): Promise<AuthActionState> {
  void _previousState;

  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  if (!isServerSupabaseConfigured()) {
    return { status: "error", message: configurationNeededMessage() };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: passwordResetRedirectUrl(),
  });

  await writeAuditEvent({
    actionType: "auth.password_reset_requested",
    resourceType: "auth.user",
    success: !error,
    requestContext: { email_domain: parsed.data.email.split("@")[1] ?? null },
  });

  if (error) {
    return { status: "error", message: mapAuthError(error) };
  }

  return { status: "success", message: passwordResetRequestMessage() };
}

export async function updatePassword(
  _previousState: AuthActionState = DEFAULT_AUTH_STATE,
  formData: FormData,
): Promise<AuthActionState> {
  void _previousState;

  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  if (!isServerSupabaseConfigured()) {
    return { status: "error", message: configurationNeededMessage() };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  await writeAuditEvent({
    actorUserId: data.user?.id ?? null,
    actionType: "auth.password_updated",
    resourceType: "auth.user",
    success: !error,
  });

  if (error) {
    return { status: "error", message: mapAuthError(error) };
  }

  redirect("/command-center");
}

export async function acceptInvitationPlaceholder(
  _previousState: AuthActionState = DEFAULT_AUTH_STATE,
  formData: FormData,
): Promise<AuthActionState> {
  void _previousState;

  const parsed = inviteSchema.safeParse({
    email: formData.get("email"),
    organizationId: formData.get("organizationId"),
    roleCode: formData.get("roleCode"),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  await writeAuditEvent({
    organizationId: parsed.data.organizationId,
    actionType: "organization.invitation_placeholder",
    resourceType: "organization_invitation",
    success: true,
    requestContext: {
      email_domain: parsed.data.email.split("@")[1] ?? null,
      role_code: parsed.data.roleCode,
    },
  });

  return {
    status: "success",
    message:
      "Invitation acceptance will be completed in a later workflow. No account was created.",
  };
}
