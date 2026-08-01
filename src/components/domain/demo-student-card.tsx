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
        Adds one fictional coded practice student (next free code such as S1, S2, …) with an active
        practice IEP cycle. For the full owner classroom (Williams SLC room 95 + S1–S7 + schedule),
        use{" "}
        <a href="/classroom-operations/daily" className="font-semibold underline">
          Daily Command Center → Create Williams SLC room 95 + students S1–S7
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
