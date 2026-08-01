"use client";

import { useMemo, useState, useTransition } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TableShell } from "@/components/data-display/table-shell";
import { SignaturePad } from "@/components/domain/signature-pad";
import {
  createCommunicationSignLinkAction,
  recordCommunicationAcknowledgementAction,
} from "@/lib/actions/communications";
import { ESIGN_RECEIPT_DISCLAIMER } from "@/lib/communications/esign";
import type { CommunicationsData } from "@/lib/data/communications";

export function CommunicationEsignPanel({ data }: { data: CommunicationsData }) {
  const familyLogs = useMemo(
    () => data.communications.filter((log) => log.visibility === "family_visible"),
    [data.communications],
  );
  const [selectedId, setSelectedId] = useState(familyLogs[0]?.id ?? "");
  const [signerName, setSignerName] = useState("");
  const [typedSignature, setTypedSignature] = useState("");
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [method, setMethod] = useState<"drawn" | "typed" | "staff_attested">("drawn");
  const [message, setMessage] = useState<string | null>(null);
  const [signUrl, setSignUrl] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selected = familyLogs.find((log) => log.id === selectedId) ?? null;
  const acksForSelected = (data.acknowledgements ?? []).filter(
    (ack) => ack.communication_log_id === selectedId,
  );

  if (!data.permissions.canEnterCommunication) {
    return (
      <Alert title="Permission needed" tone="warning">
        Recording parent e-signatures requires communication entry permission.
      </Alert>
    );
  }

  if (familyLogs.length === 0) {
    return (
      <Alert title="No family messages to sign yet" tone="info">
        Save a Family visible note first (behavior letter, progress note, or other parent message).
        Then you can create a parent “I have read this” signature link here.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Alert title="Parent read + receipt acknowledgment" tone="info">
        {ESIGN_RECEIPT_DISCLAIMER} Parents open the link, check <strong>I have read this</strong>,
        type their name, and send — staff get a notification. Drawn signature is optional.
      </Alert>

      <Card>
        <CardTitle>Trap communication + parent signature</CardTitle>
        <CardDescription>
          Select a family-visible communication, create a sign link, or capture the signature now.
        </CardDescription>
        <div className="mt-4 space-y-3">
          <FormField id="esignCommunicationId" label="Family-visible communication">
            <Select
              id="esignCommunicationId"
              value={selectedId}
              onChange={(event) => {
                setSelectedId(event.target.value);
                setSignUrl(null);
                setMessage(null);
              }}
            >
              {familyLogs.map((log) => (
                <option key={log.id} value={log.id}>
                  {log.subject} · {log.esign_status || "none"} ·{" "}
                  {new Date(log.occurred_at).toLocaleDateString()}
                </option>
              ))}
            </Select>
          </FormField>

          {selected ? (
            <div className="border-border rounded-[var(--radius-md)] border p-3 text-sm whitespace-pre-wrap">
              <p className="font-semibold">{selected.subject}</p>
              <p className="text-muted mt-2">{selected.summary}</p>
              <p className="text-muted mt-2">
                E-sign status: {selected.esign_status || "none"}
                {selected.acknowledgement_requested ? " · signature requested" : ""}
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={pending || !selected}
              onClick={() => {
                if (!selected || !data.organizationId) return;
                startTransition(async () => {
                  const formData = new FormData();
                  formData.set("organizationId", data.organizationId ?? "");
                  formData.set("communicationLogId", selected.id);
                  formData.set("studentId", selected.student_id);
                  const result = await createCommunicationSignLinkAction(formData);
                  setMessage(result.message ?? null);
                  setSignUrl(result.signUrl ?? null);
                });
              }}
            >
              {pending ? "Working…" : "Create parent sign link"}
            </Button>
          </div>

          {signUrl ? (
            <Alert title="Parent sign link ready" tone="info">
              <p className="break-all">{signUrl}</p>
              <p className="mt-2">
                Copy this link into email/text or print a QR/letter so the parent can acknowledge
                receipt with a signature. Link expires in 14 days.
              </p>
            </Alert>
          ) : null}
        </div>
      </Card>

      <Card>
        <CardTitle>Capture signature now</CardTitle>
        <CardDescription>
          Use when a parent/guardian is present (conference, pickup, phone-attested with typed
          name).
        </CardDescription>
        <form
          className="mt-4 space-y-3"
          action={(formData) => {
            startTransition(async () => {
              if (signatureImage) formData.set("signatureImageData", signatureImage);
              const result = await recordCommunicationAcknowledgementAction(formData);
              setMessage(result.message ?? null);
            });
          }}
        >
          <input type="hidden" name="organizationId" value={data.organizationId ?? ""} />
          <input type="hidden" name="communicationLogId" value={selectedId} />
          <input type="hidden" name="studentId" value={selected?.student_id ?? ""} />
          <FormField id="signerDisplayName" label="Parent / guardian name">
            <Input
              id="signerDisplayName"
              name="signerDisplayName"
              required
              value={signerName}
              onChange={(event) => setSignerName(event.target.value)}
            />
          </FormField>
          <FormField id="typedSignature" label="Typed signature (full legal name)">
            <Input
              id="typedSignature"
              name="typedSignature"
              required
              value={typedSignature}
              onChange={(event) => setTypedSignature(event.target.value)}
              placeholder="Type full name to acknowledge receipt"
            />
          </FormField>
          <FormField id="ackMethod" label="Signature method">
            <Select
              id="ackMethod"
              name="method"
              value={method}
              onChange={(event) =>
                setMethod(event.target.value as "drawn" | "typed" | "staff_attested")
              }
            >
              <option value="drawn">Drawn signature</option>
              <option value="typed">Typed acknowledgment</option>
              <option value="staff_attested">Staff attested (in person / phone)</option>
            </Select>
          </FormField>
          {method === "drawn" ? (
            <FormField id="drawnSignature" label="Draw signature">
              <SignaturePad onChange={setSignatureImage} disabled={pending} />
            </FormField>
          ) : null}
          <FormField id="ackNotes" label="Notes (optional)">
            <Textarea id="ackNotes" name="notes" placeholder="In-person conference, etc." />
          </FormField>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="receiptConfirmed" value="true" required className="mt-1" />
            <span>
              I acknowledge that the signer confirms receipt of this communication (not IEP
              consent).
            </span>
          </label>
          <Button type="submit" disabled={pending || !selectedId}>
            {pending ? "Saving…" : "Save e-signature acknowledgment"}
          </Button>
        </form>
      </Card>

      {message ? (
        <Alert title="E-sign update" tone="info">
          {message}
        </Alert>
      ) : null}

      <TableShell
        caption="Recorded acknowledgments"
        headers={["Communication", "Signer", "Method", "Signed"]}
        rows={(data.acknowledgements ?? []).map((ack) => {
          const log = data.communications.find((entry) => entry.id === ack.communication_log_id);
          return [
            log?.subject ?? ack.communication_log_id,
            ack.signer_display_name,
            ack.method,
            new Date(ack.signed_at).toLocaleString(),
          ];
        })}
      />

      {acksForSelected.length > 0 && acksForSelected[0]?.signature_image_data ? (
        <Card>
          <CardTitle>Latest drawn signature</CardTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={acksForSelected[0].signature_image_data}
            alt={`Signature of ${acksForSelected[0].signer_display_name}`}
            className="border-border mt-3 max-h-40 rounded-[var(--radius-md)] border bg-white"
          />
        </Card>
      ) : null}
    </div>
  );
}
