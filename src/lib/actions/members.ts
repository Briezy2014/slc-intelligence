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
import { membershipMutationSchema } from "@/lib/validation/members";

export async function updateMemberAction(formData: FormData): Promise<ActionState> {
  const parsed = membershipMutationSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);

  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "org.members.manage");
  if (!("supabase" in context)) return context;

  try {
    const payload = {
      organization_id: context.organizationId,
      user_id: values.userId,
      role_code: values.roleCode,
      status: values.status,
      start_date: values.startDate ?? new Date().toISOString().slice(0, 10),
      end_date: values.endDate ?? null,
    };
    const { data, error } = await context.supabase
      .from("organization_memberships")
      .upsert(payload, { onConflict: "organization_id,user_id" })
      .select("id")
      .single();

    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "member.upsert",
      resourceType: "organization_membership",
      resourceId: data.id,
      newState: payload,
      paths: ["/organization/members", "/staff"],
    });

    return { status: "success", message: "Member updated." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
