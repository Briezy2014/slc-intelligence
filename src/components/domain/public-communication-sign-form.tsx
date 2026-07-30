"use client";

import { useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SignaturePad } from "@/components/domain/signature-pad";
import { submitPublicCommunicationSignAction } from "@/lib/actions/communications";
import { ESIGN_RECEIPT_DISCLAIMER } from "@/lib/communications/esign";

export function PublicCommunicationSignForm({
  token,
  subject,
  summary,
  organizationName,
  alreadySigned,
}: {
  token: string;
  subject: string;
  summary: string;
  organizationName: string;
  alreadySigned: boolean;
}) {
  const [method, setMethod] = useState<"drawn" | "typed">("drawn");
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(alreadySigned);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <Alert title="Acknowledgment recorded" tone="info">
        Thank you. Receipt of this communication has been recorded
        {alreadySigned && !message ? " previously" : ""}.
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Alert title="Receipt acknowledgment only" tone="info">
        {ESIGN_RECEIPT_DISCLAIMER}
      </Alert>
      <div className="border-border rounded-[var(--radius-lg)] border p-4">
        <p className="text-muted text-sm">{organizationName}</p>
        <h2 className="mt-1 text-xl font-semibold">{subject}</h2>
        <p className="mt-3 whitespace-pre-wrap">{summary}</p>
      </div>
      <form
        className="space-y-3"
        action={(formData) => {
          startTransition(async () => {
            if (signatureImage) formData.set("signatureImageData", signatureImage);
            const result = await submitPublicCommunicationSignAction(formData);
            setMessage(result.message ?? null);
            if (result.status === "success") setDone(true);
          });
        }}
      >
        <input type="hidden" name="token" value={token} />
        <FormField id="signerDisplayName" label="Your name">
          <Input id="signerDisplayName" name="signerDisplayName" required />
        </FormField>
        <FormField id="typedSignature" label="Type your full name as signature">
          <Input id="typedSignature" name="typedSignature" required />
        </FormField>
        <FormField id="signerEmail" label="Email (optional)">
          <Input id="signerEmail" name="signerEmail" type="email" />
        </FormField>
        <FormField id="method" label="Signature style">
          <Select
            id="method"
            name="method"
            value={method}
            onChange={(event) => setMethod(event.target.value as "drawn" | "typed")}
          >
            <option value="drawn">Draw signature</option>
            <option value="typed">Typed name only</option>
          </Select>
        </FormField>
        {method === "drawn" ? (
          <FormField id="drawn" label="Draw your signature">
            <SignaturePad onChange={setSignatureImage} disabled={pending} />
          </FormField>
        ) : null}
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="receiptConfirmed" value="true" required className="mt-1" />
          <span>I acknowledge that I received this communication.</span>
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Sign and acknowledge receipt"}
        </Button>
      </form>
      {message ? (
        <Alert title="Signing status" tone="info">
          {message}
        </Alert>
      ) : null}
    </div>
  );
}
