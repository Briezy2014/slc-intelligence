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
import { meetingAcknowledgementSchema, meetingNoteSchema, meetingParticipantSchema, meetingSchema } from "@/lib/validation/meetings";

async function canMeeting(
  context: Awaited<ReturnType<typeof getActionContext>>,
  rpc: "can_manage_meeting" | "can_finalize_meeting" | "can_read_meeting",
  studentId: string,
) {
  if (!("supabase" in context)) return false;
  const { data, error } = await context.supabase.rpc(rpc, {
    p_org_id: context.organizationId,
    p_student_id: studentId,
  });
  return !error && Boolean(data);
}

export async function saveMeetingAction(formData: FormData): Promise<ActionState> {
  const parsed = meetingSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  try {
    const requiredRpc = values.status === "finalized" ? "can_finalize_meeting" : "can_manage_meeting";
    if (!(await canMeeting(context, requiredRpc, values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      student_id: values.studentId,
      meeting_type_id: values.meetingTypeId || null,
      title: values.title,
      scheduled_start: values.scheduledStart || null,
      scheduled_end: values.scheduledEnd || null,
      location: values.location ?? null,
      virtual_link_note: values.virtualLinkNote ?? null,
      status: values.status,
      created_by: context.user.id,
      finalized_at: values.status === "finalized" ? new Date().toISOString() : null,
      finalized_by: values.status === "finalized" ? context.user.id : null,
    };
    const result = values.meetingId
      ? await context.supabase
          .from("meetings")
          .update(payload)
          .eq("organization_id", context.organizationId)
          .eq("id", values.meetingId)
          .select("id")
          .single()
      : await context.supabase.from("meetings").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: values.meetingId ? "meeting.update" : "meeting.create",
      resourceType: "meeting",
      resourceId: result.data.id,
      newState: payload,
      paths: ["/meetings", `/students/${values.studentId}/meetings`, `/meetings/${result.data.id}`],
    });
    return { status: "success", message: "Meeting saved." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function addMeetingParticipantAction(formData: FormData): Promise<ActionState> {
  const parsed = meetingParticipantSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  try {
    if (!(await canMeeting(context, "can_manage_meeting", values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      meeting_id: values.meetingId,
      participant_kind: values.participantKind,
      user_id: values.participantKind === "staff" ? values.userId || null : null,
      contact_id: values.participantKind === "contact" ? values.contactId || null : null,
      student_id: values.participantKind === "student" ? values.participantStudentId || values.studentId : null,
      external_name: values.participantKind === "external" ? values.externalName ?? null : null,
      external_role: values.participantKind === "external" ? values.externalRole ?? null : null,
      invitation_status: values.participantKind === "external" ? "not_required" as const : "not_sent" as const,
      attendance_status: "unknown" as const,
    };
    const result = await context.supabase.from("meeting_participants").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "meeting_participant.create",
      resourceType: "meeting_participant",
      resourceId: result.data.id,
      newState: {
        participant_kind: values.participantKind,
        external_participant_does_not_create_auth_user: values.participantKind === "external",
      },
      paths: ["/meetings", `/students/${values.studentId}/meetings`, `/meetings/${values.meetingId}`],
    });
    return { status: "success", message: "Meeting participant added." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function addMeetingNoteAction(formData: FormData): Promise<ActionState> {
  const parsed = meetingNoteSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId);
  if (!("supabase" in context)) return context;
  try {
    if (!(await canMeeting(context, "can_manage_meeting", values.studentId))) {
      return { status: "error", message: UNAUTHORIZED_ACTION_MESSAGE };
    }
    const payload = {
      organization_id: context.organizationId,
      meeting_id: values.meetingId,
      note_kind: values.noteKind,
      note_text: values.noteText,
      created_by: context.user.id,
    };
    const result = await context.supabase.from("meeting_notes").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "meeting_note.create",
      resourceType: "meeting_note",
      resourceId: result.data.id,
      newState: { note_kind: values.noteKind },
      paths: ["/meetings", `/students/${values.studentId}/meetings`, `/meetings/${values.meetingId}`],
    });
    return { status: "success", message: "Meeting note added." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}

export async function recordMeetingAcknowledgementAction(formData: FormData): Promise<ActionState> {
  const parsed = meetingAcknowledgementSchema.safeParse(emptyToUndefined(formDataToObject(formData)));
  if (!parsed.success) return validationError(parsed.error);
  const values = parsed.data;
  const context = await getActionContext(values.organizationId, "meeting.manage");
  if (!("supabase" in context)) return context;
  try {
    const payload = {
      organization_id: context.organizationId,
      meeting_id: values.meetingId,
      contact_id: values.contactId || null,
      acknowledged_by_name: values.acknowledgedByName ?? null,
      status: values.status,
      note: values.note ?? null,
      recorded_by: context.user.id,
    };
    const result = await context.supabase.from("meeting_acknowledgements").insert(payload).select("id").single();
    if (result.error) return { status: "error", message: GENERIC_ACTION_MESSAGE };
    await auditAndRevalidate({
      organizationId: context.organizationId,
      actorUserId: context.user.id,
      actionType: "meeting_acknowledgement.create",
      resourceType: "meeting_acknowledgement",
      resourceId: result.data.id,
      newState: { status: values.status, acknowledgement_is_not_consent: true },
      paths: ["/meetings", `/meetings/${values.meetingId}`],
    });
    return { status: "success", message: "Meeting acknowledgement recorded." };
  } catch {
    return { status: "error", message: GENERIC_ACTION_MESSAGE };
  }
}
