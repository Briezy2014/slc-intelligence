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
        Adds a fictional coded practice student (grade 3) with an active practice IEP cycle so you
        can try goals, progressions, and Behavior Detective. Do not replace this with real student
        names or real IEP/ETR uploads during the pilot.
      </CardDescription>
      <form action={submitAction(createDemoStudentAction)} className="mt-4">
        <input type="hidden" name="organizationId" value={organizationId} />
        <Button type="submit">Create demo student</Button>
      </form>
    </Card>
  );
}
