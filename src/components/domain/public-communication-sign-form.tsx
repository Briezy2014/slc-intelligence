"use client";

import { useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
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
  const [name, setName] = useState("");
  const [showDrawn, setShowDrawn] = useState(false);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(alreadySigned);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <Alert title="Acknowledgment recorded" tone="info">
        Thank you. School staff have been notified that you read this communication
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
            formData.set("signerDisplayName", name);
            formData.set("typedSignature", name);
            formData.set("method", showDrawn && signatureImage ? "drawn" : "typed");
            if (signatureImage) formData.set("signatureImageData", signatureImage);
            const result = await submitPublicCommunicationSignAction(formData);
            setMessage(result.message ?? null);
            if (result.status === "success") setDone(true);
          });
        }}
      >
        <input type="hidden" name="token" value={token} />
        <label className="border-border flex items-start gap-3 rounded-[var(--radius-md)] border p-3 text-sm">
          <input
            type="checkbox"
            name="receiptConfirmed"
            value="true"
            required
            className="mt-1"
          />
          <span>
            <strong>I have read this</strong> school communication and acknowledge receipt.
          </span>
        </label>
        <FormField id="signerDisplayName" label="Type your name">
          <Input
            id="signerDisplayNameVisible"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Parent / guardian full name"
            autoComplete="name"
          />
        </FormField>
        <FormField id="signerEmail" label="Email (optional)">
          <Input id="signerEmail" name="signerEmail" type="email" />
        </FormField>
        <div className="space-y-2">
          <button
            type="button"
            className="text-sm underline"
            onClick={() => setShowDrawn((value) => !value)}
          >
            {showDrawn ? "Hide optional drawn signature" : "Optional: add a drawn signature"}
          </button>
          {showDrawn ? (
            <FormField id="drawn" label="Draw your signature (optional)">
              <SignaturePad onChange={setSignatureImage} disabled={pending} />
            </FormField>
          ) : null}
        </div>
        <Button type="submit" disabled={pending || !name.trim()}>
          {pending ? "Sending…" : "Send acknowledgment to school"}
        </Button>
      </form>
      {message ? (
        <Alert title="Status" tone="info">
          {message}
        </Alert>
      ) : null}
    </div>
  );
}
