import { createHash, randomBytes } from "crypto";

export function hashCommunicationContent(subject: string, summary: string): string {
  return createHash("sha256").update(`${subject}\n${summary}`, "utf8").digest("hex");
}

export function hashSignToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function createRawSignToken(): string {
  return randomBytes(32).toString("base64url");
}

export const ESIGN_RECEIPT_DISCLAIMER =
  "This electronic acknowledgment confirms receipt of the communication only. It is not parental consent for IEP eligibility, placement, or other IDEA decisions.";
