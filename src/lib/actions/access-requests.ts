"use server";

import {
  auditAndRevalidate,
  emptyToUndefined,
  formDataToObject,
  GENERIC_ACTION_MESSAGE,
  getActionContext,
  type ActionState,
  validationError,
} from "@/lib/actions/shared";
import { reviewAccessRequestSchema } from "@/lib/validation/access-requests";
import type { RoleCode } from "@/lib/supabase/types";

export async function reviewAccessRequestAction(formData: FormData): Promise<ActionState> {
  const raw = emptyToUndefined(formDataToObject(formData));
  const parsed = reviewAccessRequestSchema.safeParse(raw);
  if (!parsed.success) return validationError(parsed.error);

  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "org.members.manage");
  if (!("supabase" in context)) return context;

  try {
    const { data: request, error: loadError } = await context.supabase
      .from("organization_access_requests")
      .select("*")
      .eq("organization_id", context.organizationId)
      .eq("id", values.requestId)
      .maybeSingle();

    if (loadError || !request) {
      return { status: "error", message: "Access request not found." };
    }

    if (request.status !== "pending") {
      return { status: "error", message: "This request was already reviewed." };
    }

    if (values.decision === "denied") {
      const { error } = await context.supabase
        .from("organization_access_requests")
        .update({
          status: "denied",
          reviewed_by: context.user.id,
          reviewed_at: new Date().toISOString(),
          review_note: values.reviewNote || null,
          granted_role_code: null,
        })
        .eq("id", request.id)
        .eq("organization_id", context.organizationId);

      if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

      await auditAndRevalidate({
        organizationId: context.organizationId,
        actorUserId: context.user.id,
        actionType: "access_request.denied",
        resourceType: "organization_access_request",
        resourceId: request.id,
        previousState: request,
        newState: { status: "denied" },
        paths: ["/organization/access-requests", "/organization/members", "/staff"],
      });

      return { status: "success", message: "Access request denied." };
    }

    const grantedRole =
      (values.grantedRoleCode as RoleCode | undefined) ??
      (request.requested_role_codes[0] as RoleCode | undefined);

    if (!grantedRole) {
      return { status: "error", message: "Choose a role to grant." };
    }

    if (!request.requester_user_id) {
      return {
        status: "error",
        message: "This request has no linked account yet. Ask the requester to finish creating their account, then approve again.",
      };
    }

    const membershipPayload = {
      organization_id: context.organizationId,
      user_id: request.requester_user_id,
      role_code: grantedRole,
      status: "active" as const,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: null,
    };

    const { data: membership, error: membershipError } = await context.supabase
      .from("organization_memberships")
      .upsert(membershipPayload, { onConflict: "organization_id,user_id" })
      .select("id")
      .single();

    if (membershipError || !membership) {
      return { status: "error", message: GENERIC_ACTION_MESSAGE };
    }

    const { error: updateError } = await context.supabase
      .from("organization_access_requests")
      .update({
        status: "approved",
        granted_role_code: grantedRole,
        reviewed_by: context.user.id,
        reviewed_at: new Date().toISOString(),
        review_note: values.reviewNote || null,
        resulting_membership_id: membership.id,
      })
      .eq("id", request.id)
      .eq("organization_id", context.organizationId);

    if (updateError) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "access_request.approved",
      resourceType: "organization_access_request",
      resourceId: request.id,
      previousState: request,
      newState: { status: "approved", granted_role_code: grantedRole, membership_id: membership.id },
      paths: ["/organization/access-requests", "/organization/members", "/staff", "/membership-pending"],
    });

    return {
      status: "success",
      message: `Approved. ${request.full_name} can now sign in with the ${grantedRole.replaceAll("_", " ")} role.`,
    };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
