"use client";

import { useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { restoreOwnerMembershipAction } from "@/lib/actions/membership-recovery";

export function RestoreOwnerMembershipButton() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <Button
        type="button"
        disabled={pending}
        onClick={() => {
          setMessage(null);
          startTransition(async () => {
            const result = await restoreOwnerMembershipAction();
            if (result.message) setMessage(result.message);
          });
        }}
      >
        {pending ? "Restoring access…" : "Restore my owner / admin access"}
      </Button>
      {message ? (
        <Alert title="Could not restore access" tone="warning">
          {message}
        </Alert>
      ) : null}
    </div>
  );
}
