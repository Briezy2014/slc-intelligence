"use client";

import { useState, useTransition } from "react";
import { FormField } from "@/components/forms/form-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createInvitationAction } from "@/lib/actions/invitations";
import { ROLE_LABELS } from "@/lib/permissions/matrix";
import type { RoleCode } from "@/lib/supabase/types";

const INVITE_ROLES: RoleCode[] = [
  "special_education_teacher",
  "intervention_specialist",
  "paraprofessional",
  "related_service_provider",
  "case_manager",
  "school_psychologist",
  "building_admin",
  "program_admin",
  "district_sped_admin",
  "organization_admin",
  "read_only_reviewer",
];

export function StaffInviteForm({ organizationId }: { organizationId: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ tone: "info" | "warning"; text: string } | null>(null);

  return (
    <form
      className="space-y-3"
      action={(formData) => {
        setMessage(null);
        startTransition(async () => {
          const result = await createInvitationAction(formData);
          if (result.status === "success") {
            setMessage({
              tone: "info",
              text:
                result.message ??
                "Invitation recorded. Share the staff invite code so they can request access.",
            });
          } else {
            setMessage({
              tone: "warning",
              text: result.message ?? "Could not record that invitation.",
            });
          }
        });
      }}
    >
      <input type="hidden" name="organizationId" value={organizationId} />
      <FormField id="staff-invite-email" label="Staff email">
        <Input
          id="staff-invite-email"
          name="email"
          type="email"
          required
          placeholder="colleague@school.org"
        />
      </FormField>
      <FormField id="staff-invite-role" label="Role">
        <Select
          id="staff-invite-role"
          name="roleCode"
          defaultValue="special_education_teacher"
        >
          {INVITE_ROLES.map((code) => (
            <option key={code} value={code}>
              {ROLE_LABELS[code]}
            </option>
          ))}
        </Select>
      </FormField>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Add staff invitation"}
      </Button>
      {message ? (
        <Alert title={message.tone === "info" ? "Invitation saved" : "Could not invite"} tone={message.tone}>
          {message.text}
        </Alert>
      ) : null}
    </form>
  );
}
