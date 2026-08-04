"use client";

import { useMemo, useState } from "react";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveServicePlanAction } from "@/lib/actions/services";
import { SERVICE_TEMPLATES } from "@/lib/catalogs/service-templates";
import type { ServiceDefinition, Student } from "@/lib/supabase/types";

function studentName(student: Student) {
  return `${student.last_name}, ${student.preferred_name || student.first_name}${
    student.local_identifier ? ` (${student.local_identifier})` : ""
  }`;
}

export type ServiceProviderOption = {
  userId: string;
  label: string;
};

function submitAction(action: (formData: FormData) => Promise<unknown>) {
  return action as unknown as (formData: FormData) => void;
}

function templateForDefinition(definition: ServiceDefinition | undefined) {
  if (!definition) return null;
  return (
    SERVICE_TEMPLATES.find(
      (item) =>
        item.serviceArea.toLowerCase() === definition.service_area.toLowerCase() ||
        item.name.toLowerCase() === definition.name.toLowerCase(),
    ) ?? null
  );
}

export function AssignStudentServiceForm({
  organizationId,
  students,
  definitions,
  providers,
  defaultStudentId = "",
  canActivate = false,
}: {
  organizationId: string;
  students: Student[];
  definitions: ServiceDefinition[];
  providers: ServiceProviderOption[];
  defaultStudentId?: string;
  canActivate?: boolean;
}) {
  const [studentId, setStudentId] = useState(defaultStudentId);
  const [definitionId, setDefinitionId] = useState("");
  const [providerUserId, setProviderUserId] = useState("");

  const definition = useMemo(
    () => definitions.find((item) => item.id === definitionId),
    [definitionId, definitions],
  );
  const template = templateForDefinition(definition);
  const title = definition?.name ?? "Related service";
  const providerLabel = providers.find((item) => item.userId === providerUserId)?.label ?? "";
  const exampleGoals = template?.exampleGoals.join("\n") ?? "";

  return (
    <Card>
      <CardTitle>Assign a related service</CardTitle>
      <CardDescription>
        Pick the student, service type (OT / PT / Speech / APE…), and provider. Add goals and notes
        from that provider for this student.
      </CardDescription>
      <form action={submitAction(saveServicePlanAction)} className="mt-4 space-y-3">
        <input type="hidden" name="organizationId" value={organizationId} />
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="status" value={canActivate ? "active" : "draft"} />
        {providers.length ? (
          <input type="hidden" name="providerName" value={providerLabel} />
        ) : null}

        <FormField id="assignServiceStudent" label="Student">
          <Select
            id="assignServiceStudent"
            name="studentId"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            required
          >
            <option value="">Choose student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {studentName(student)}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          id="assignServiceDefinition"
          label="Service type"
          description="OT, PT, Speech, Adapted PE, and other related services."
        >
          <Select
            id="assignServiceDefinition"
            name="serviceDefinitionId"
            value={definitionId}
            onChange={(event) => setDefinitionId(event.target.value)}
            required
          >
            <option value="">Choose service</option>
            {definitions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          id="assignServiceProvider"
          label="Service provider"
          description="Who delivers this service for the student."
        >
          <Select
            id="assignServiceProvider"
            name="providerUserId"
            value={providerUserId}
            onChange={(event) => setProviderUserId(event.target.value)}
          >
            <option value="">Choose staff provider (optional)</option>
            {providers.map((provider) => (
              <option key={provider.userId} value={provider.userId}>
                {provider.label}
              </option>
            ))}
          </Select>
        </FormField>

        {!providers.length ? (
          <FormField id="assignProviderNameFallback" label="Provider name">
            <Input
              id="assignProviderNameFallback"
              name="providerName"
              placeholder="e.g. Ms. Rivera, OT"
            />
          </FormField>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <FormField id="assignServiceMinutes" label="Minutes per session">
            <Input
              id="assignServiceMinutes"
              name="serviceMinutes"
              type="number"
              min="1"
              placeholder="30"
            />
          </FormField>
          <FormField id="assignServiceFrequency" label="Frequency">
            <Input
              id="assignServiceFrequency"
              name="frequency"
              placeholder="2x / week"
            />
          </FormField>
        </div>

        <FormField id="assignDeliveryType" label="How is it delivered?">
          <Select
            id="assignDeliveryType"
            name="deliveryType"
            defaultValue={definition?.default_delivery_type ?? "pull_out"}
            key={definition?.default_delivery_type ?? "pull_out"}
          >
            <option value="pull_out">Pull-out</option>
            <option value="push_in">Push-in</option>
            <option value="individual">Individual</option>
            <option value="group">Group</option>
            <option value="consultation">Consultation</option>
            <option value="other">Other</option>
          </Select>
        </FormField>

        <FormField
          id="assignProviderGoals"
          label="Provider goals for this student"
          description="What the OT/PT/Speech/APE provider is working on."
        >
          <Textarea
            id="assignProviderGoals"
            name="providerGoals"
            key={`goals-${definitionId}`}
            defaultValue={exampleGoals}
            rows={4}
            placeholder="e.g. Improve grasp for writing tasks"
          />
        </FormField>

        <FormField id="assignServiceNotes" label="Notes">
          <Textarea
            id="assignServiceNotes"
            name="notes"
            rows={3}
            placeholder="Schedule notes, location, or team reminders"
          />
        </FormField>

        <Button type="submit" disabled={!students.length || !definitions.length}>
          Save student service
        </Button>
      </form>
    </Card>
  );
}
