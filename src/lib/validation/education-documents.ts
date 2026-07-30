import { z } from "zod";

const educationDocumentTypeEnum = z.enum([
  "iep",
  "etr",
  "progress_report",
  "section_504",
  "gifted",
  "el",
]);

export const educationDocumentSchema = z.object({
  organizationId: z.string().uuid(),
  studentId: z.string().uuid(),
  documentId: z.string().uuid().optional().or(z.literal("")),
  documentType: educationDocumentTypeEnum,
  title: z.string().trim().min(2).max(200),
  status: z.enum(["draft", "in_review", "finalized", "archived"]).default("draft"),
  schoolYear: z.string().trim().max(40).optional().or(z.literal("")),
  gradeLevel: z.string().trim().max(40).optional().or(z.literal("")),
  templateKey: z.string().trim().max(80).optional().or(z.literal("")),
  fieldsJson: z.string().optional().or(z.literal("")),
});

export const educationDocumentUploadSchema = z.object({
  organizationId: z.string().uuid(),
  studentId: z.string().uuid(),
  documentType: z.enum([
    "iep",
    "etr",
    "progress_report",
    "section_504",
    "gifted",
    "el",
    "other",
  ]),
  educationDocumentId: z.string().uuid().optional().or(z.literal("")),
  fileName: z.string().trim().min(1).max(260),
  contentType: z.string().trim().max(120).optional().or(z.literal("")),
  byteSize: z.coerce.number().int().nonnegative().optional(),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  extractionMethod: z
    .enum(["pdf_text", "pdf_ocr", "image_ocr", "plain_text", "none"])
    .optional()
    .or(z.literal("")),
  extractedTextPreview: z.string().trim().max(4000).optional().or(z.literal("")),
});

export const districtFormTemplateSchema = z.object({
  organizationId: z.string().uuid(),
  documentType: z.enum([
    "iep",
    "etr",
    "progress_report",
    "section_504",
    "gifted",
    "el",
    "other",
  ]),
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  fileName: z.string().trim().min(1).max(260),
  contentType: z.string().trim().max(120).optional().or(z.literal("")),
  byteSize: z.coerce.number().int().nonnegative().optional(),
  extractedText: z.string().trim().max(50000).optional().or(z.literal("")),
});
