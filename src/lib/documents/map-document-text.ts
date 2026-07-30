import { getEducationDocumentTemplate } from "@/lib/catalogs/education-document-templates";
import type { EducationDocumentType } from "@/lib/supabase/types";

function extractFieldFromText(text: string, labels: string[]): string {
  const lower = text.toLowerCase();
  for (const label of labels) {
    const idx = lower.indexOf(label.toLowerCase());
    if (idx < 0) continue;
    const slice = text.slice(idx + label.length).replace(/^[\s:.\-–—]+/, "");
    const paragraph = slice.split(/\n{2,}/)[0]?.trim() ?? "";
    const line = paragraph.split(/\n+/)[0]?.trim() ?? "";
    const value = paragraph.length > line.length && paragraph.length < 1200 ? paragraph : line;
    if (value.length > 3) return value.slice(0, 1200);
  }
  return "";
}

/**
 * Deterministic local mapping from extracted IEP/ETR text into draft template fields.
 * Used by upload OCR and local AI assist.
 */
export function mapDocumentTextToFields(
  documentType: EducationDocumentType,
  sourceText: string,
): Record<string, string> {
  const template = getEducationDocumentTemplate(documentType);
  const fields: Record<string, string> = {};

  for (const section of template.sections) {
    for (const field of section.fields) {
      const extracted = extractFieldFromText(sourceText, [field.label, field.key]);
      if (extracted) fields[field.key] = extracted;
    }
  }

  if (!fields.strengths) {
    fields.strengths = extractFieldFromText(sourceText, ["strengths", "student strengths"]);
  }
  if (!fields.needs) {
    fields.needs = extractFieldFromText(sourceText, ["needs", "areas of need", "present levels"]);
  }
  if (!fields.goalSummary) {
    fields.goalSummary = extractFieldFromText(sourceText, [
      "annual goals",
      "measurable annual goals",
      "goals",
    ]);
  }
  if (!fields.howDisabilityAffects) {
    fields.howDisabilityAffects = extractFieldFromText(sourceText, [
      "how the disability affects",
      "effect of the disability",
      "impact on involvement",
    ]);
  }
  if (!fields.speciallyDesignedInstruction) {
    fields.speciallyDesignedInstruction = extractFieldFromText(sourceText, [
      "specially designed instruction",
      "special education services",
    ]);
  }
  if (!fields.relatedServices) {
    fields.relatedServices = extractFieldFromText(sourceText, ["related services"]);
  }
  if (!fields.accommodations) {
    fields.accommodations = extractFieldFromText(sourceText, [
      "accommodations",
      "accommodations and modifications",
    ]);
  }

  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value.length > 0));
}
