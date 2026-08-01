"use client";

import { useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  createBillingCheckoutSessionAction,
  createBillingPortalSessionAction,
} from "@/lib/actions/billing";

export function BillingActions({
  organizationId,
  hasCustomer,
  isActive,
}: {
  organizationId: string;
  hasCustomer: boolean;
  isActive: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={pending}
          onClick={() => {
            setMessage(null);
            startTransition(async () => {
              const formData = new FormData();
              formData.set("organizationId", organizationId);
              const result = await createBillingCheckoutSessionAction(formData);
              if (result.url) {
                window.location.href = result.url;
                return;
              }
              setMessage(result.message ?? "Could not start checkout.");
            });
          }}
        >
          {pending
            ? "Starting…"
            : isActive
              ? "Update payment method via checkout"
              : "Start monthly subscription"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={pending || !hasCustomer}
          onClick={() => {
            setMessage(null);
            startTransition(async () => {
              const formData = new FormData();
              formData.set("organizationId", organizationId);
              const result = await createBillingPortalSessionAction(formData);
              if (result.url) {
                window.location.href = result.url;
                return;
              }
              setMessage(result.message ?? "Could not open billing portal.");
            });
          }}
        >
          Manage billing
        </Button>
      </div>
      {message ? (
        <Alert title="Billing" tone="warning">
          {message}
        </Alert>
      ) : null}
    </div>
  );
}
