import { isServerSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

type AuditEventInput = {
  organizationId?: string | null;
  actorUserId?: string | null;
  actionType: string;
  resourceType: string;
  resourceId?: string | null;
  success?: boolean;
  previousState?: Json | null;
  newState?: Json | null;
  requestContext?: Json;
};

function sanitizeJson(value: Json | undefined): Json | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  const sanitized: Record<string, Json> = {};
  for (const [key, entry] of Object.entries(value)) {
    const normalizedKey = key.toLowerCase();
    if (
      normalizedKey.includes("password") ||
      normalizedKey.includes("token") ||
      normalizedKey.includes("secret") ||
      normalizedKey.includes("key")
    ) {
      continue;
    }
    sanitized[key] = sanitizeJson(entry) ?? null;
  }

  return sanitized;
}

export async function writeAuditEvent(input: AuditEventInput): Promise<boolean> {
  if (!isServerSupabaseConfigured()) {
    return false;
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("audit_events").insert({
      organization_id: input.organizationId ?? null,
      actor_user_id: input.actorUserId ?? null,
      action_type: input.actionType,
      resource_type: input.resourceType,
      resource_id: input.resourceId ?? null,
      success: input.success ?? true,
      previous_state: sanitizeJson(input.previousState) ?? null,
      new_state: sanitizeJson(input.newState) ?? null,
      request_context: sanitizeJson(input.requestContext) ?? {},
    });

    return !error;
  } catch {
    return false;
  }
}
