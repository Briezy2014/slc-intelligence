"use server";

import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import {
  auditAndRevalidate,
  emptyToUndefined,
  formDataToObject,
  GENERIC_ACTION_MESSAGE,
  getActionContext,
  type ActionState,
  validationError,
} from "@/lib/actions/shared";
import { invitationSchema } from "@/lib/validation/members";

const invitationMutationSchema = invitationSchema.extend({
  invitationId: z.string().uuid().optional(),
  status: z.enum(["pending", "accepted", "cancelled", "expired"]).optional(),
});

export async function createInvitationAction(formData: FormData): Promise<ActionState> {
  const parsed = invitationMutationSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);

  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "org.members.manage");
  if (!("supabase" in context)) return context;

  try {
    const tokenHash = createHash("sha256").update(randomUUID()).digest("hex");
    const expiresAt =
      values.expiresAt ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
    const payload = {
      organization_id: context.organizationId,
      email: values.email.toLowerCase(),
      role_code: values.roleCode,
      token_hash: tokenHash,
      status: "pending" as const,
      invited_by: context.user.id,
      expires_at: expiresAt,
    };
    const { data, error } = await context.supabase
      .from("organization_invitations")
      .insert(payload)
      .select("id")
      .single();

    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "invitation.create",
      resourceType: "organization_invitation",
      resourceId: data.id,
      newState: {
        email: payload.email,
        role_code: payload.role_code,
        status: payload.status,
        expires_at: payload.expires_at,
      },
      paths: ["/organization/invitations", "/organization/members", "/staff", "/organization/settings"],
    });

    return {
      status: "success",
      message:
        "Invitation recorded. Share your staff invite code and send them to Request access (/request-access). Approve them under Access requests.",
    };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function updateInvitationStatusAction(formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({
      organizationId: z.string().uuid(),
      invitationId: z.string().uuid(),
      status: z.enum(["cancelled", "expired"]),
    })
    .safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);

  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "org.members.manage");
  if (!("supabase" in context)) return context;

  try {
    const { error } = await context.supabase
      .from("organization_invitations")
      .update({ status: values.status })
      .eq("organization_id", context.organizationId)
      .eq("id", values.invitationId);

    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "invitation.status_update",
      resourceType: "organization_invitation",
      resourceId: values.invitationId,
      newState: { status: values.status },
      paths: ["/organization/invitations", "/organization/members", "/staff", "/organization/settings"],
    });

    return { status: "success", message: "Invitation updated." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
