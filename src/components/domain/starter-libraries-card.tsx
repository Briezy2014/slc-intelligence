"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { importStarterLibrariesAction } from "@/lib/actions/starter-libraries";
import { getStarterCatalogCounts } from "@/lib/catalogs";

export function StarterLibrariesCard({ organizationId }: { organizationId: string }) {
  const counts = getStarterCatalogCounts();
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [pending, startTransition] = useTransition();

  return (
    <Card>
      <CardTitle>Content libraries</CardTitle>
      <CardDescription>
        Interventions ({counts.interventions}), accommodations ({counts.accommodations}), executive
        function skills ({counts.executiveFunctionSkills}), and communication templates (
        {counts.communicationTemplates}) load automatically for your organization. Goal templates (
        {counts.goals}) and learning progressions ({counts.learningProgressions}) are always
        available when creating goals. Use Refresh only if a dropdown still looks empty.
      </CardDescription>
      <form
        className="mt-4 space-y-3"
        action={(formData) => {
          startTransition(async () => {
            const result = await importStarterLibrariesAction(formData);
            setStatus(result.status === "success" ? "success" : "error");
            setMessage(result.message ?? null);
          });
        }}
      >
        <input type="hidden" name="organizationId" value={organizationId} />
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Refreshing libraries…" : "Refresh starter libraries"}
        </Button>
      </form>
      {message ? (
        <div className="mt-3">
          <Alert
            title={status === "success" ? "Libraries ready" : "Unable to refresh libraries"}
            tone={status === "success" ? "success" : "danger"}
          >
            {message}
          </Alert>
        </div>
      ) : null}
      <ol className="text-muted mt-4 list-decimal space-y-1 pl-5 text-sm">
        <li>Create a student under Students.</li>
        <li>Pick library items from Interventions, Accommodations, EF, or Family Communication.</li>
        <li>Save records based on your classroom input — libraries stay pre-filled.</li>
      </ol>
    </Card>
  );
}
