"use server";

import {
  auditAndRevalidate,
  emptyToUndefined,
  formDataToObject,
  GENERIC_ACTION_MESSAGE,
  getActionContext,
  type ActionState,
  UNAUTHORIZED_ACTION_MESSAGE,
  validationError,
} from "@/lib/actions/shared";
import {
  createRawSignToken,
  hashCommunicationContent,
  hashSignToken,
} from "@/lib/communications/esign";
import { CANONICAL_PRODUCTION_URL } from "@/lib/constants/product";
import { translateCommunicationDraft } from "@/lib/ai/translate";
import { familyVisibleCommunicationExport } from "@/lib/data/communications";
import { isServerSupabaseConfigured } from "@/lib/env";
import { requireActiveMembership } from "@/lib/org/context";
import {
  communicationAcknowledgementSchema,
  communicationLogSchema,
  communicationTemplateSchema,
  contactSchema,
  createCommunicationSignLinkSchema,
  publicCommunicationSignSchema,
  translateCommunicationSchema,
} from "@/lib/validation/communications";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

async function canCommunication(
  context: Awaited<ReturnType<typeof getActionContext>>,
  rpc: "can_manage_contact" | "can_enter_communication" | "can_finalize_communication",
  studentId: string,
) {
  if (!("supabase" in context)) return false;
  const { data, error } = await context.supabase.rpc(rpc, {
    p_org_id: context.organizationId,
    p_student_id: studentId,
  });
  return !error && Boolean(data);
}

export async function saveContactAction(formData: FormData): Promise<ActionState> {
  const parsed = contactSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  try {
    if (!(await canCommunication(context, "can_manage_contact", values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      first_name: values.firstName,
      last_name: values.lastName,
      relationship: values.relationship,
      contact_type: values.contactType,
      email: values.email || null,
      phone_primary: values.phonePrimary ?? null,
      phone_secondary: values.phoneSecondary ?? null,
      sensitive_notes: values.sensitiveNotes ?? null,
      is_primary: values.isPrimary,
      status: values.status,
      created_by: context.user.id,
    };
    const result = values.contactId
      ? await context.supabase
          .from("student_contacts")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.contactId)
          .select("id")
          .single()
      : await context.supabase.from("student_contacts").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.contactId ? "contact.update" : "contact.create",
      resourceType: "student_contact",
      resourceId: result.data.id,
      newState: payload,
      paths: [
        "/family-communication",
        `/students/${values.studentId}/family-communication/contacts`,
      ],
    });
    return { status: "success", message: "Contact saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveCommunicationLogAction(formData: FormData): Promise<ActionState> {
  const parsed = communicationLogSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  try {
    const requiredRpc =
      values.status === "finalized" ? "can_finalize_communication" : "can_enter_communication";
    if (!(await canCommunication(context, requiredRpc, values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const requestEsign =
      values.visibility === "family_visible" && Boolean(values.acknowledgementRequested);

    if (values.communicationId) {
      const existing = await context.supabase
        .from("communication_logs")
        .select("subject, summary, esign_status, signed_content_hash")
        .eq("organization_id", context.organizationId)
        .eq("id", values.communicationId)
        .maybeSingle();
      if (
        existing.data?.esign_status === "signed" &&
        existing.data.signed_content_hash &&
        hashCommunicationContent(values.subject, values.summary) !==
          existing.data.signed_content_hash
      ) {
        return {
          status: "error",
          message:
            "This communication already has a parent e-signature. Create a new communication instead of changing the signed text.",
        };
      }
    }

    const payload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      contact_id: values.contactId || null,
      category_id: values.categoryId || null,
      occurred_at: values.occurredAt || new Date().toISOString(),
      method: values.method,
      direction: values.direction,
      visibility: values.visibility,
      subject: values.subject,
      summary: values.summary,
      language_code: values.languageCode,
      source_language_code: values.sourceLanguageCode,
      source_summary: values.sourceSummary || null,
      acknowledgement_requested: requestEsign,
      esign_status: requestEsign ? ("pending" as const) : ("none" as const),
      followup_needed: values.followupNeeded,
      status: values.status,
      finalized_at: values.status === "finalized" ? new Date().toISOString() : null,
      finalized_by: values.status === "finalized" ? context.user.id : null,
      created_by: context.user.id,
    };
    const result = values.communicationId
      ? await context.supabase
          .from("communication_logs")
          .update({
            student_id: payload.student_id,
            contact_id: payload.contact_id,
            category_id: payload.category_id,
            occurred_at: payload.occurred_at,
            method: payload.method,
            direction: payload.direction,
            visibility: payload.visibility,
            subject: payload.subject,
            summary: payload.summary,
            language_code: payload.language_code,
            source_language_code: payload.source_language_code,
            source_summary: payload.source_summary,
            acknowledgement_requested: payload.acknowledgement_requested,
            followup_needed: payload.followup_needed,
            status: payload.status,
            finalized_at: payload.finalized_at,
            finalized_by: payload.finalized_by,
          })
          .eq("organization_id", context.organizationId)
          .eq("id", values.communicationId)
          .select("id")
          .single()
      : await context.supabase.from("communication_logs").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    if (values.followupNeeded && values.followupDescription) {
      await context.supabase.from("communication_followups").insert({
        organization_id: context.organizationId,
        communication_log_id: result.data.id,
        student_id: values.studentId,
        assigned_to: context.user.id,
        due_date: values.followupDueDate || null,
        description: values.followupDescription,
      });
    }

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.communicationId ? "communication.update" : "communication.create",
      resourceType: "communication_log",
      resourceId: result.data.id,
      newState: {
        ...payload,
        summary:
          values.visibility === "family_visible" ? values.summary : "[internal-or-restricted]",
      },
      paths: [
        "/family-communication",
        `/students/${values.studentId}/family-communication/communications`,
      ],
    });
    return { status: "success", message: "Communication log saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function saveCommunicationTemplateAction(formData: FormData): Promise<ActionState> {
  const parsed = communicationTemplateSchema.safeParse(
    emptyToUndefined(formDataToObject(formData)),
  );
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "communication.template.manage");
  if (!("supabase" in context)) return context;
  try {
    const payload = {
      organization_id: context.organizationId,
      name: values.name,
      default_visibility: values.defaultVisibility,
      method: values.method || null,
      subject_template: values.subjectTemplate ?? null,
      body_template: values.bodyTemplate,
      active: values.active,
      created_by: context.user.id,
    };
    const result = values.templateId
      ? await context.supabase
          .from("communication_templates")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.templateId)
          .select("id")
          .single()
      : await context.supabase
          .from("communication_templates")
          .insert(payload)
          .select("id")
          .single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.templateId
        ? "communication_template.update"
        : "communication_template.create",
      resourceType: "communication_template",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/family-communication", "/family-communication/templates"],
    });
    return { status: "success", message: "Communication template saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function recordFamilyCommunicationExportAction(
  formData: FormData,
): Promise<ActionState> {
  const organizationId = String(formData.get("organizationId") ?? "");
  const context = await getActionContext(organizationId, "communication.read");
  if (!("supabase" in context)) return context;
  const studentId = String(formData.get("studentId") ?? "");
  try {
    let query = context.supabase
      .from("communication_logs")
      .select("*")
      .eq("organization_id", context.organizationId);
    if (studentId) query = query.eq("student_id", studentId);
    const { data, error } = await query.eq("visibility", "family_visible");
    if (error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "communication.family_visible_export",
      resourceType: "communication_log",
      newState: { exported: familyVisibleCommunicationExport(data ?? []) },
      paths: ["/family-communication"],
    });
    return { status: "success", message: "Family-visible communication export recorded." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}


export async function translateCommunicationDraftAction(input: {
  subject: string;
  summary: string;
  targetLanguageCode: string;
}) {
  const parsed = translateCommunicationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      mode: "disabled" as const,
      subject: input.subject,
      summary: input.summary,
      languageCode: input.targetLanguageCode,
      message: "Check subject, summary, and language before translating.",
    };
  }

  if (isServerSupabaseConfigured()) {
    try {
      await requireActiveMembership();
    } catch {
      return {
        ok: false as const,
        mode: "disabled" as const,
        subject: parsed.data.subject,
        summary: parsed.data.summary,
        languageCode: parsed.data.targetLanguageCode,
        message: "Sign in with an active membership to translate drafts.",
      };
    }
  }

  return translateCommunicationDraft(parsed.data);
}

export async function recordCommunicationAcknowledgementAction(
  formData: FormData,
): Promise<ActionState> {
  const parsed = communicationAcknowledgementSchema.safeParse(
    emptyToUndefined(formDataToObject(formData)),
  );
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  if (!values.receiptConfirmed) {
    return { status: "error", message: "Confirm receipt acknowledgment before saving." };
  }
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    if (!(await canCommunication(context, "can_enter_communication", values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }

    const logResult = await context.supabase
      .from("communication_logs")
      .select("id, subject, summary, visibility")
      .eq("organization_id", context.organizationId)
      .eq("id", values.communicationLogId)
      .eq("student_id", values.studentId)
      .maybeSingle();
    if (logResult.error || !logResult.data) {
      return { status: "error", message: GENERIC_ACTION_MESSAGE };
    }
    if (logResult.data.visibility !== "family_visible") {
      return {
        status: "error",
        message: "E-signatures apply to family-visible communications only.",
      };
    }

    const contentHash = hashCommunicationContent(logResult.data.subject, logResult.data.summary);
    const requestHeaders = await headers();
    const payload = {
      organization_id: context.organizationId,
      communication_log_id: values.communicationLogId,
      student_id: values.studentId,
      signer_display_name: values.signerDisplayName,
      signer_email: values.signerEmail || null,
      method: values.method,
      status: values.status,
      typed_signature: values.typedSignature,
      signature_image_data: values.signatureImageData || null,
      content_hash: contentHash,
      user_agent: requestHeaders.get("user-agent")?.slice(0, 400) ?? null,
      notes: values.notes || null,
      recorded_by: context.user.id,
      signed_at: new Date().toISOString(),
    };

    const { data, error } = await context.supabase
      .from("communication_acknowledgements")
      .insert(payload)
      .select("id")
      .single();
    if (error || !data) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await context.supabase
      .from("communication_logs")
      .update({
        acknowledgement_requested: true,
        esign_status: values.status === "requested_clarification" ? "clarification_requested" : "signed",
        signed_content_hash: contentHash,
      })
      .eq("id", values.communicationLogId)
      .eq("organization_id", context.organizationId);

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "communication.esign_captured",
      resourceType: "communication_acknowledgement",
      resourceId: data.id,
      newState: {
        communication_log_id: values.communicationLogId,
        method: values.method,
        status: values.status,
        content_hash: contentHash,
      },
      paths: [
        "/family-communication",
        `/students/${values.studentId}/family-communication/communications`,
      ],
    });

    return {
      status: "success",
      message: "Parent/guardian e-signature acknowledgment saved (receipt only, not IEP consent).",
    };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function createCommunicationSignLinkAction(
  formData: FormData,
): Promise<ActionState & { signUrl?: string }> {
  const parsed = createCommunicationSignLinkSchema.safeParse(
    emptyToUndefined(formDataToObject(formData)),
  );
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;

  try {
    if (!(await canCommunication(context, "can_enter_communication", values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }

    const logResult = await context.supabase
      .from("communication_logs")
      .select("id, visibility")
      .eq("organization_id", context.organizationId)
      .eq("id", values.communicationLogId)
      .eq("student_id", values.studentId)
      .maybeSingle();
    if (logResult.error || !logResult.data) {
      return { status: "error", message: GENERIC_ACTION_MESSAGE };
    }
    if (logResult.data.visibility !== "family_visible") {
      return {
        status: "error",
        message: "Sign links are only for family-visible communications.",
      };
    }

    const rawToken = createRawSignToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + values.expiresInDays);

    const { data, error } = await context.supabase
      .from("communication_sign_links")
      .insert({
        organization_id: context.organizationId,
        communication_log_id: values.communicationLogId,
        student_id: values.studentId,
        token_hash: hashSignToken(rawToken),
        expires_at: expiresAt.toISOString(),
        created_by: context.user.id,
      })
      .select("id")
      .single();
    if (error || !data) return { status: "error", message: GENERIC_ACTION_MESSAGE };

    await context.supabase
      .from("communication_logs")
      .update({
        acknowledgement_requested: true,
        esign_status: "pending",
      })
      .eq("id", values.communicationLogId)
      .eq("organization_id", context.organizationId)
      .neq("esign_status", "signed");

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || CANONICAL_PRODUCTION_URL).replace(/\/$/, "");
    const signUrl = `${appUrl}/sign/communication/${rawToken}`;

    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "communication.esign_link_created",
      resourceType: "communication_sign_link",
      resourceId: data.id,
      newState: {
        communication_log_id: values.communicationLogId,
        expires_at: expiresAt.toISOString(),
      },
      paths: [
        "/family-communication",
        `/students/${values.studentId}/family-communication/communications`,
      ],
    });

    return {
      status: "success",
      message: "Parent sign link created. Copy and send it with the letter/home communication.",
      signUrl,
    };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function submitPublicCommunicationSignAction(
  formData: FormData,
): Promise<ActionState> {
  const parsed = publicCommunicationSignSchema.safeParse(
    emptyToUndefined(formDataToObject(formData)),
  );
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  if (!values.receiptConfirmed) {
    return { status: "error", message: "Confirm that you received this communication." };
  }
  if (!isServerSupabaseConfigured()) {
    return { status: "error", message: "Signing is unavailable in this environment." };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const requestHeaders = await headers();
    const { data, error } = await supabase.rpc("submit_communication_sign_packet", {
      p_token: values.token,
      p_signer_display_name: values.signerDisplayName,
      p_typed_signature: values.typedSignature,
      p_signature_image_data: values.signatureImageData || null,
      p_signer_email: values.signerEmail || null,
      p_method: values.method,
      p_user_agent: requestHeaders.get("user-agent")?.slice(0, 400) ?? null,
      p_notes: null,
    });
    if (error || !data) {
      return {
        status: "error",
        message: "Could not save your signature. The link may be expired or already invalid.",
      };
    }
    return {
      status: "success",
      message: "Thank you. Your receipt acknowledgment and signature were recorded.",
    };
  } catch {
    return { status: "error", message: "Could not save your signature. Try again later." };
  }
}
