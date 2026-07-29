import { CANONICAL_PRODUCTION_URL } from "@/lib/constants/product";

/**
 * Production-safe operational logging.
 * Never include student narrative, family content, tokens, or secrets.
 */
export type SafeLogContext = {
  area: string;
  event: string;
  organizationId?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  success?: boolean;
  code?: string | null;
};

function sanitizeMessage(message: string) {
  return message
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[redacted-jwt]")
    .replace(/service[_-]?role[^\s]*/gi, "[redacted-service-role]")
    .slice(0, 500);
}

export function logOperationalEvent(context: SafeLogContext, detail?: string) {
  const payload = {
    ts: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "unknown",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || CANONICAL_PRODUCTION_URL,
    ...context,
    detail: detail ? sanitizeMessage(detail) : undefined,
  };
  if (context.success === false) {
    console.error("[slc-ops]", JSON.stringify(payload));
    return;
  }
  console.info("[slc-ops]", JSON.stringify(payload));
}

export function logClientSafeError(message: string) {
  console.error("[slc-client]", sanitizeMessage(message));
}
