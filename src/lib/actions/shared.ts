import { revalidatePath } from "next/cache";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { z } from "zod";
import { writeAuditEvent } from "@/lib/audit/log";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireActiveMembership } from "@/lib/org/context";
import { hasPermission } from "@/lib/permissions/check";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database, Json, PermissionCode } from "@/lib/supabase/types";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const initialActionState: ActionState = { status: "idle" };

export const CONFIGURATION_ACTION_MESSAGE =
  "Supabase is not configured for this environment. Configure Supabase before changing data.";
export const VALIDATION_ACTION_MESSAGE = "Check the form fields and try again.";
export const UNAUTHORIZED_ACTION_MESSAGE = "You are not authorized to complete that request.";
export const GENERIC_ACTION_MESSAGE = "We could not save those changes. Try again later.";

export type ActionContext = {
  supabase: SupabaseClient<Database>;
  user: User;
  organizationId: string;
};

export function formDataToObject(formData: FormData): Record<string, FormDataEntryValue> {
  return Object.fromEntries(formData.entries());
}

export function emptyToUndefined<T extends Record<string, unknown>>(values: T): T {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value === "" ? undefined : value]),
  ) as T;
}

export async function getActionContext(
  organizationId: string,
  permission?: PermissionCode,
): Promise<ActionContext | ActionState> {
  if (!isServerSupabaseConfigured()) {
    return { status: "error", message: CONFIGURATION_ACTION_MESSAGE };
  }

  const { user, membership } = await requireActiveMembership(organizationId);
  const supabase = await createServerSupabaseClient();
  const scopedOrganizationId = membership.organization_id;

  if (permission) {
    const allowed = await hasPermission(supabase, scopedOrganizationId, permission);
    if (!allowed) {
      await writeAuditEvent({
        organizationId: scopedOrganizationId,
        actorUserId: user.id,
        actionType: "authorization.denied",
        resourceType: permission,
        success: false,
      });
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
  }

  return { supabase, user, organizationId: scopedOrganizationId };
}

export function validationError(error: z.ZodError): ActionState {
  const firstIssue = error.issues[0]?.message;
  return { status: "error", message: firstIssue ?? VALIDATION_ACTION_MESSAGE };
}

export async function auditAndRevalidate(args: {
  organizationId: string;
  actorUserId: string;
  actionType: string;
  resourceType: string;
  resourceId?: string | null;
  newState?: Json | null;
  previousState?: Json | null;
  paths: string[];
}) {
  await writeAuditEvent({
    organizationId: args.organizationId,
    actorUserId: args.actorUserId,
    actionType: args.actionType,
    resourceType: args.resourceType,
    resourceId: args.resourceId,
    previousState: args.previousState ?? null,
    newState: args.newState ?? null,
  });
  args.paths.forEach((path) => revalidatePath(path));
}
