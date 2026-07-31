"use client";

import { createDemoStudentAction } from "@/lib/actions/students";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

function submitAction(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
}

export function DemoStudentCard({ organizationId }: { organizationId: string }) {
  return (
    <Card>
      <CardTitle>Create demo student</CardTitle>
      <CardDescription>
        Adds one fictional coded practice student with an active practice IEP cycle so you can try
        goals, progressions, and Behavior Detective. For a full district-modeling classroom (S1 + S2
        + sample schedule), use{" "}
        <a href="/classroom-operations/daily" className="font-semibold underline">
          Daily Command Center → Set up demo classroom
        </a>
        . Do not replace this with real student names or real IEP/ETR uploads during the pilot.
      </CardDescription>
      <form action={submitAction(createDemoStudentAction)} className="mt-4">
        <input type="hidden" name="organizationId" value={organizationId} />
        <Button type="submit">Create demo student</Button>
      </form>
    </Card>
  );
}
