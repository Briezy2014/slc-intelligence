"use server";

import { z } from "zod";
import {
  emptyToUndefined,
  formDataToObject,
  GENERIC_ACTION_MESSAGE,
  type ActionState,
  VALIDATION_ACTION_MESSAGE,
  validationError,
} from "@/lib/actions/shared";
import { requireUser } from "@/lib/auth/session";
import { isServerSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(120, "Name is too long."),
  preferredName: z.string().trim().max(80).optional(),
});

export async function updateOwnProfileAction(formData: FormData): Promise<ActionState> {
  if (!isServerSupabaseConfigured()) {
    return { status: "error", message: "Supabase is not configured." };
  }

  const parsed = profileSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);

  const user = await requireUser("/staff");
  const supabase = await createClient();
  const displayName = parsed.data.displayName;
  const preferredName =
    parsed.data.preferredName?.trim() || displayName.split(/\s+/)[0] || displayName;

  try {
    const { error } = await supabase.from("user_profiles").upsert({
      id: user.id,
      display_name: displayName,
      preferred_name: preferredName,
      status: "active",
    });

    if (error) {
      return { status: "error", message: GENERIC_ACTION_MESSAGE };
    }

    revalidatePath("/staff");
    revalidatePath("/account");
    revalidatePath("/command-center");
    revalidatePath("/organization/members");

    return { status: "success", message: `Display name saved as ${displayName}.` };
  } catch {
    return { status: "error", message: VALIDATION_ACTION_MESSAGE };
  }
}
