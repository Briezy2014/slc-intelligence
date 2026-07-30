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
        Adds a fictional test student (grade 3) with an active IEP cycle so you can try goals,
        progressions, Behavior Detective, and IEP/ETR docs immediately.
      </CardDescription>
      <form action={submitAction(createDemoStudentAction)} className="mt-4">
        <input type="hidden" name="organizationId" value={organizationId} />
        <Button type="submit">Create demo student</Button>
      </form>
    </Card>
  );
}
