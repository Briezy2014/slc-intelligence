"use client";

import Link from "next/link";
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
        Adds one practice student (next free code such as S1, S2, …) with an active practice IEP
        cycle. For the full classroom (Williams SLC room 95 + S1–S7 + schedule), use{" "}
        <Link href="/classroom-operations/daily" className="font-semibold underline">
          Daily Command Center → Create Williams SLC room 95 + students S1–S7
        </Link>
        .
      </CardDescription>
      <form action={submitAction(createDemoStudentAction)} className="mt-4">
        <input type="hidden" name="organizationId" value={organizationId} />
        <Button type="submit">Create demo student</Button>
      </form>
    </Card>
  );
}
