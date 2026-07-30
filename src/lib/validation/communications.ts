import { z } from "zod";

const optionalUuid = z.string().uuid().optional().or(z.literal(""));

export const contactSchema = z.object({
  organizationId: z.string().uuid(),
  contactId: optionalUuid,
  studentId: z.string().uuid(),
  firstName: z.string().trim().min(1, "First name is required.").max(120),
  lastName: z.string().trim().min(1, "Last name is required.").max(120),
  relationship: z.string().trim().min(1, "Relationship is required.").max(120),
  contactType: z.enum(["family", "guardian", "caregiver", "agency", "other"]).default("family"),
  email: z.string().trim().email().optional().or(z.literal("")),
  phonePrimary: z.string().trim().max(40).optional(),
  phoneSecondary: z.string().trim().max(40).optional(),
  sensitiveNotes: z.string().trim().max(2000).optional(),
  isPrimary: z.coerce.boolean().default(false),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
});

export const communicationLogSchema = z.object({
  organizationId: z.string().uuid(),
  communicationId: optionalUuid,
  studentId: z.string().uuid(),
  contactId: optionalUuid,
  categoryId: optionalUuid,
  occurredAt: z.string().datetime().optional().or(z.literal("")),
  method: z.enum(["phone", "email", "text", "letter", "in_person", "portal", "video", "other"]),
  direction: z.enum(["outbound", "inbound", "two_way", "internal"]),
  visibility: z.enum(["family_visible", "internal", "restricted_admin"]).default("family_visible"),
  subject: z.string().trim().min(1, "Subject is required.").max(180),
  summary: z.string().trim().min(1, "Summary is required.").max(4000),
  acknowledgementRequested: z.preprocess(
    (value) => value === true || value === "true" || value === "on",
    z.boolean(),
  ),
  followupNeeded: z.coerce.boolean().default(false),
  followupDescription: z.string().trim().max(2000).optional(),
  followupDueDate: z.string().date().optional().or(z.literal("")),
  status: z.enum(["draft", "finalized", "corrected", "archived"]).default("draft"),
});

export const communicationAcknowledgementSchema = z.object({
  organizationId: z.string().uuid(),
  communicationLogId: z.string().uuid(),
  studentId: z.string().uuid(),
  signerDisplayName: z.string().trim().min(1, "Signer name is required.").max(180),
  signerEmail: z.string().trim().email().optional().or(z.literal("")),
  method: z.enum(["typed", "drawn", "staff_attested"]).default("drawn"),
  status: z.enum(["acknowledged", "reviewed", "requested_clarification"]).default("acknowledged"),
  typedSignature: z.string().trim().min(1, "Typed signature is required.").max(180),
  signatureImageData: z.string().trim().max(600000).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  receiptConfirmed: z.preprocess(
    (value) => value === true || value === "true" || value === "on",
    z.boolean(),
  ),
});

export const createCommunicationSignLinkSchema = z.object({
  organizationId: z.string().uuid(),
  communicationLogId: z.string().uuid(),
  studentId: z.string().uuid(),
  expiresInDays: z.coerce.number().int().min(1).max(60).default(14),
});

export const publicCommunicationSignSchema = z.object({
  token: z.string().trim().min(20).max(200),
  signerDisplayName: z.string().trim().min(1, "Your name is required.").max(180),
  typedSignature: z.string().trim().min(1, "Typed signature is required.").max(180),
  signerEmail: z.string().trim().email().optional().or(z.literal("")),
  method: z.enum(["typed", "drawn"]).default("drawn"),
  signatureImageData: z.string().trim().max(600000).optional().or(z.literal("")),
  receiptConfirmed: z.preprocess(
    (value) => value === true || value === "true" || value === "on",
    z.boolean(),
  ),
});

export const communicationTemplateSchema = z.object({
  organizationId: z.string().uuid(),
  templateId: optionalUuid,
  name: z.string().trim().min(1, "Template name is required.").max(180),
  defaultVisibility: z
    .enum(["family_visible", "internal", "restricted_admin"])
    .default("family_visible"),
  method: z
    .enum(["phone", "email", "text", "letter", "in_person", "portal", "video", "other"])
    .optional()
    .or(z.literal("")),
  subjectTemplate: z.string().trim().max(180).optional(),
  bodyTemplate: z.string().trim().min(1, "Template body is required.").max(4000),
  active: z.coerce.boolean().default(true),
});
