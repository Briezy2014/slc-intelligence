"use server";

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
import { schoolSchema } from "@/lib/validation/organization";

const schoolMutationSchema = schoolSchema.extend({
  schoolId: z.string().uuid().optional(),
});

export async function saveSchoolAction(formData: FormData): Promise<ActionState> {
  const parsed = schoolMutationSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);

  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "school.manage");
  if (!("supabase" in context)) return context;

  try {
    const payload = {
      organization_id: context.organizationId,
      name: values.name,
      school_code: values.schoolCode ?? null,
      school_type: values.schoolType,
      status: values.status,
    };
    const result = values.schoolId
      ? await context.supabase
          .from("schools")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.schoolId)
          .select("id")
          .single()
      : await context.supabase.from("schools").insert(payload).select("id").single();

    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.schoolId ? "school.update" : "school.create",
      resourceType: "school",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/schools", `/schools/${result.data.id}`],
    });

    return { status: "success", message: "School saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
