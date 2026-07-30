"use client";

import { useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/form-field";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { reviewAccessRequestAction } from "@/lib/actions/access-requests";
import { ROLE_LABELS, ROLE_CODES } from "@/lib/permissions/matrix";
import type { OrganizationAccessRequest, RoleCode } from "@/lib/supabase/types";

function roleLabel(code: string) {
  return ROLE_LABELS[code as RoleCode] ?? code.replaceAll("_", " ");
}

export function AccessRequestReviewCards({
  organizationId,
  requests,
}: {
  organizationId: string;
  requests: OrganizationAccessRequest[];
}) {
  const pending = requests.filter((request) => request.status === "pending");
  const history = requests.filter((request) => request.status !== "pending");

  if (requests.length === 0) {
    return (
      <Alert title="No access requests yet" tone="info">
        When educators create an account at Request access, they appear here for approval.
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Pending approval ({pending.length})</h2>
        {pending.length === 0 ? (
          <Alert title="Inbox clear" tone="success">
            There are no pending access requests right now.
          </Alert>
        ) : (
          pending.map((request) => (
            <AccessRequestCard key={request.id} organizationId={organizationId} request={request} />
          ))
        )}
      </section>
      {history.length ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Reviewed</h2>
          {history.map((request) => (
            <Card key={request.id}>
              <CardTitle>
                {request.full_name} · {request.status}
              </CardTitle>
              <CardDescription>
                {request.email}. Requested: {request.requested_role_codes.map(roleLabel).join(", ")}.
                {request.granted_role_code ? ` Granted: ${roleLabel(request.granted_role_code)}.` : ""}
              </CardDescription>
            </Card>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function AccessRequestCard({
  organizationId,
  request,
}: {
  organizationId: string;
  request: OrganizationAccessRequest;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"success" | "danger">("success");
  const [decision, setDecision] = useState<"approved" | "denied">("approved");
  const defaultRole = (request.requested_role_codes[0] ?? "special_education_teacher") as RoleCode;

  return (
    <Card>
      <CardTitle>{request.full_name}</CardTitle>
      <CardDescription>
        {request.email} · submitted {new Date(request.created_at).toLocaleString()}
      </CardDescription>
      <div className="mt-3 space-y-2 text-sm">
        <p>
          <span className="font-semibold">Requested roles:</span>{" "}
          {request.requested_role_codes.map(roleLabel).join(", ")}
        </p>
        {request.message ? (
          <p>
            <span className="font-semibold">Note:</span> {request.message}
          </p>
        ) : null}
      </div>
      <form
        className="mt-4 space-y-3"
        action={(formData) => {
          startTransition(async () => {
            const result = await reviewAccessRequestAction(formData);
            setTone(result.status === "success" ? "success" : "danger");
            setMessage(result.message ?? null);
          });
        }}
      >
        <input type="hidden" name="organizationId" value={organizationId} />
        <input type="hidden" name="requestId" value={request.id} />
        <input type="hidden" name="decision" value={decision} />
        <FormField id={`grantedRole-${request.id}`} label="Role to grant if approved">
          <Select
            id={`grantedRole-${request.id}`}
            name="grantedRoleCode"
            defaultValue={defaultRole}
          >
            {ROLE_CODES.filter((code) => code !== "platform_admin").map((code) => (
              <option key={code} value={code}>
                {ROLE_LABELS[code]}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField id={`reviewNote-${request.id}`} label="Review note (optional)">
          <Textarea id={`reviewNote-${request.id}`} name="reviewNote" />
        </FormField>
        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            disabled={pending}
            onClick={() => setDecision("approved")}
          >
            Approve
          </Button>
          <Button
            type="submit"
            variant="secondary"
            disabled={pending}
            onClick={() => setDecision("denied")}
          >
            Deny
          </Button>
        </div>
      </form>
      {message ? (
        <div className="mt-3">
          <Alert title={tone === "success" ? "Updated" : "Unable to update"} tone={tone}>
            {message}
          </Alert>
        </div>
      ) : null}
    </Card>
  );
}
