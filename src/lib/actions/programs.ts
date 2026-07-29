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
import { programSchema } from "@/lib/validation/organization";

const programMutationSchema = programSchema.extend({
  programId: z.string().uuid().optional(),
});

export async function saveProgramAction(formData: FormData): Promise<ActionState> {
  const parsed = programMutationSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);

  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "program.manage");
  if (!("supabase" in context)) return context;

  try {
    const payload = {
      organization_id: context.organizationId,
      school_id: values.schoolId || null,
      name: values.name,
      description: values.description ?? null,
      program_type: values.programType,
      status: values.status,
    };
    const result = values.programId
      ? await context.supabase
          .from("programs")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.programId)
          .select("id")
          .single()
      : await context.supabase.from("programs").insert(payload).select("id").single();

    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.programId ? "program.update" : "program.create",
      resourceType: "program",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/programs", `/programs/${result.data.id}`],
    });

    return { status: "success", message: "Program saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
