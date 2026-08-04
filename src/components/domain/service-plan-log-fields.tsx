"use client";

import { useMemo, useState } from "react";
import { FormField } from "@/components/forms/form-field";
import { Select } from "@/components/ui/select";
import type { ServiceDefinition, Student, StudentServicePlan } from "@/lib/supabase/types";

function studentName(student: Student) {
  return `${student.last_name}, ${student.preferred_name || student.first_name}`;
}

export function ServicePlanLogFields({
  plans,
  students,
  definitions,
  defaultPlanId,
}: {
  plans: StudentServicePlan[];
  students: Student[];
  definitions: ServiceDefinition[];
  defaultPlanId: string;
}) {
  const [planId, setPlanId] = useState(defaultPlanId);
  const selected = useMemo(() => plans.find((plan) => plan.id === planId) ?? plans[0], [planId, plans]);
  const studentId = selected?.student_id ?? "";

  return (
    <>
      <FormField id="logServicePlanId" label="Student service">
        <Select
          id="logServicePlanId"
          name="servicePlanId"
          value={selected?.id ?? ""}
          onChange={(event) => setPlanId(event.target.value)}
          required
        >
          {plans.map((plan) => {
            const student = students.find((entry) => entry.id === plan.student_id);
            const definition = definitions.find((entry) => entry.id === plan.service_definition_id);
            return (
              <option key={plan.id} value={plan.id}>
                {(student ? studentName(student) : "Student") +
                  " · " +
                  (definition?.name ?? plan.title)}
              </option>
            );
          })}
        </Select>
      </FormField>
      <input type="hidden" name="primaryStudentId" value={studentId} />
    </>
  );
}
