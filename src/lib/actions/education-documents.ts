"use server";

import {
  auditAndRevalidate,
  emptyToUndefined,
  formDataToObject,
  GENERIC_ACTION_MESSAGE,
  getActionContext,
  type ActionState,
  validationError,
} from "@/lib/actions/shared";
import { EDUCATION_DOCUMENT_DISCLAIMER } from "@/lib/catalogs/education-document-templates";
import {
  districtFormTemplateSchema,
  educationDocumentSchema,
  educationDocumentUploadSchema,
} from "@/lib/validation/education-documents";

function parseFieldsJson(value: string | undefined): Record<string, string> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).map(([key, entry]) => [key, String(entry ?? "")]),
    );
  } catch {
    return {};
  }
}

export async function saveEducationDocumentAction(formData: FormData): Promise<ActionState> {
  const parsed = educationDocumentSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "education_document.manage");
  if (!("supabase" in context)) return context;

  try {
    const payload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      document_type: values.documentType,
      title: values.title,
      status: values.status,
      school_year: values.schoolYear || null,
      grade_level: values.gradeLevel || null,
      template_key: values.templateKey || null,
      fields: parseFieldsJson(values.fieldsJson),
      legal_disclaimer: EDUCATION_DOCUMENT_DISCLAIMER,
      updated_by: context.user.id,
      created_by: context.user.id,
    };

    const query = values.documentId
      ? context.supabase
          .from("education_documents")
          .update({
            title: payload.title,
            status: payload.status,
            school_year: payload.school_year,
            grade_level: payload.grade_level,
            template_key: payload.template_key,
            fields: payload.fields,
            legal_disclaimer: payload.legal_disclaimer,
            updated_by: context.user.id,
          })
          .eq("id", values.documentId)
          .eq("organization_id", context.organizationId)
          .select("id")
          .single()
      : context.supabase.from("education_documents").insert(payload).select("id").single();

    const { data, error } = await query;
    if (error || !data) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.documentId ? "education_document.update" : "education_document.create",
      resourceType: "education_document",
      resourceId: data.id,
      newState: payload,
      paths: [
        "/education-documents",
        `/students/${values.studentId}/iep`,
        `/students/${values.studentId}/etr`,
        `/students/${values.studentId}/reports`,
      ],
    });

    return { status: "success", message: "Document draft saved for educator review." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function recordEducationDocumentUploadAction(
  formData: FormData,
): Promise<ActionState> {
  const parsed = educationDocumentUploadSchema.safeParse(
    emptyToUndefined(formDataToObject(formData)),
  );
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "education_document.manage");
  if (!("supabase" in context)) return context;

  try {
    const file = formData.get("file");
    let storagePath: string | null = null;

    if (file instanceof File && file.size > 0) {
      const safeName = values.fileName.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const path = `${context.organizationId}/${values.studentId}/${Date.now()}-${safeName}`;
      const upload = await context.supabase.storage.from("education-documents").upload(path, file, {
        contentType: values.contentType || file.type || "application/octet-stream",
        upsert: false,
      });
      if (!upload.error) {
        storagePath = path;
      }
    }

    const extractionNote = values.extractionMethod
      ? `Extracted via ${values.extractionMethod.replaceAll("_", " ")}.`
      : "";
    const preview = values.extractedTextPreview
      ? ` Preview: ${values.extractedTextPreview.slice(0, 280)}`
      : "";

    const payload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      education_document_id: values.educationDocumentId || null,
      document_type: values.documentType,
      file_name: values.fileName,
      content_type: values.contentType || null,
      byte_size: values.byteSize ?? null,
      storage_path: storagePath,
      notes:
        values.notes ||
        `${extractionNote}${preview}`.trim() ||
        (storagePath
          ? "Upload stored and linked for team review."
          : "Upload recorded. Storage bucket optional; OCR/field fill still applied in workspace."),
      uploaded_by: context.user.id,
    };

    const { data, error } = await context.supabase
      .from("education_document_uploads")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "education_document.upload_recorded",
      resourceType: "education_document_upload",
      resourceId: data.id,
      newState: {
        ...payload,
        storage_connected: Boolean(storagePath),
      },
      paths: [
        "/education-documents",
        `/students/${values.studentId}/iep`,
        `/students/${values.studentId}/etr`,
      ],
    });

    return {
      status: "success",
      message: storagePath
        ? "Upload stored. Extracted text was used to populate draft fields for review."
        : "Upload recorded. Extracted text was used to populate draft fields for review.",
    };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function recordDistrictFormTemplateAction(formData: FormData): Promise<ActionState> {
  const parsed = districtFormTemplateSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "education_document.manage");
  if (!("supabase" in context)) return context;

  try {
    const file = formData.get("file");
    let storagePath: string | null = null;

    if (file instanceof File && file.size > 0) {
      const safeName = values.fileName.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const path = `${context.organizationId}/district-blanks/${values.documentType}/${Date.now()}-${safeName}`;
      const upload = await context.supabase.storage.from("education-documents").upload(path, file, {
        contentType: values.contentType || file.type || "application/octet-stream",
        upsert: false,
      });
      if (!upload.error) storagePath = path;
    }

    const payload = {
      organization_id: context.organizationId,
      document_type: values.documentType,
      name: values.name,
      description: values.description || null,
      file_name: values.fileName,
      content_type: values.contentType || null,
      byte_size: values.byteSize ?? null,
      storage_path: storagePath,
      extracted_text: values.extractedText || null,
      is_blank_master: true,
      active: true,
      created_by: context.user.id,
    };

    const { data, error } = await context.supabase
      .from("district_form_templates")
      .insert(payload)
      .select("id")
      .single();
    if (error || !data) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "district_form_template.create",
      resourceType: "district_form_template",
      resourceId: data.id,
      newState: {
        document_type: values.documentType,
        name: values.name,
        storage_connected: Boolean(storagePath),
      },
      paths: ["/education-documents"],
    });

    return {
      status: "success",
      message:
        "District blank template saved. Use Start blank with pre-populated fields or upload a completed form to fill a student draft.",
    };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
