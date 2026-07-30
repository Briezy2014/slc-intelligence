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
      <CardTitle>Starter content libraries</CardTitle>
      <CardDescription>
        Load pre-populated interventions ({counts.interventions}), accommodations (
        {counts.accommodations}), executive function skills ({counts.executiveFunctionSkills}), and
        communication templates ({counts.communicationTemplates}). Goal starter templates (
        {counts.goals}) are always available when creating a student goal.
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
        <Button type="submit" disabled={pending}>
          {pending ? "Loading starter libraries…" : "Load starter libraries"}
        </Button>
      </form>
      {message ? (
        <div className="mt-3">
          <Alert
            title={status === "success" ? "Starter libraries updated" : "Unable to load libraries"}
            tone={status === "success" ? "success" : "danger"}
          >
            {message}
          </Alert>
        </div>
      ) : null}
      <ol className="text-muted mt-4 list-decimal space-y-1 pl-5 text-sm">
        <li>Load starter libraries here.</li>
        <li>Create a student under Students.</li>
        <li>Create an IEP cycle, then pick a starter goal template on the student Goals page.</li>
        <li>
          Use Rapid Progress, Interventions, Accommodations, Family Communication, and Executive
          Function dropdowns.
        </li>
      </ol>
    </Card>
  );
}
