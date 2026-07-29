import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type {
  Meeting,
  MeetingAcknowledgement,
  MeetingActionItem,
  MeetingAgendaItem,
  MeetingNote,
  MeetingParticipant,
  MeetingType,
  Student,
  StudentContact,
} from "@/lib/supabase/types";

export type MeetingsData = {
  organizationId: string | null;
  organizationName: string | null;
  students: Student[];
  contacts: StudentContact[];
  meetingTypes: MeetingType[];
  meetings: Meeting[];
  participants: MeetingParticipant[];
  agendaItems: MeetingAgendaItem[];
  notes: MeetingNote[];
  actionItems: MeetingActionItem[];
  acknowledgements: MeetingAcknowledgement[];
  permissions: {
    canManage: boolean;
    canFinalize: boolean;
    canRead: boolean;
    canManageTypes: boolean;
  };
};

const emptyMeetingsData: MeetingsData = {
  organizationId: null,
  organizationName: null,
  students: [],
  contacts: [],
  meetingTypes: [],
  meetings: [],
  participants: [],
  agendaItems: [],
  notes: [],
  actionItems: [],
  acknowledgements: [],
  permissions: {
    canManage: false,
    canFinalize: false,
    canRead: false,
    canManageTypes: false,
  },
};

export async function listMeetings(options: { studentId?: string; meetingId?: string } = {}): Promise<DataState<MeetingsData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyMeetingsData);

  try {
    const permissions = await getPermissionFlags(context, [
      "meeting.manage",
      "meeting.finalize",
      "meeting.read",
      "meeting.type.manage",
    ]);

    let meetingsQuery = context.supabase
      .from("meetings")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("scheduled_start", { ascending: false });
    let contactsQuery = context.supabase
      .from("student_contacts")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("last_name");
    if (options.studentId) {
      meetingsQuery = meetingsQuery.eq("student_id", options.studentId);
      contactsQuery = contactsQuery.eq("student_id", options.studentId);
    }
    if (options.meetingId) meetingsQuery = meetingsQuery.eq("id", options.meetingId);

    const [studentsResult, contactsResult, typesResult, meetingsResult] = await Promise.all([
      context.supabase.from("students").select("*").eq("organization_id", context.organizationId).order("last_name"),
      contactsQuery,
      context.supabase.from("meeting_types").select("*").eq("organization_id", context.organizationId).order("name"),
      meetingsQuery,
    ]);

    if (studentsResult.error || contactsResult.error || typesResult.error || meetingsResult.error) {
      return safeDataError(emptyMeetingsData);
    }

    const meetingIds = (meetingsResult.data ?? []).map((meeting) => meeting.id);
    const [participantsResult, agendaResult, notesResult, actionsResult, acknowledgementResult] = meetingIds.length
      ? await Promise.all([
          context.supabase.from("meeting_participants").select("*").in("meeting_id", meetingIds),
          context.supabase.from("meeting_agenda_items").select("*").in("meeting_id", meetingIds).order("sort_order"),
          context.supabase.from("meeting_notes").select("*").in("meeting_id", meetingIds).order("created_at", { ascending: false }),
          context.supabase.from("meeting_action_items").select("*").in("meeting_id", meetingIds).order("due_date"),
          context.supabase.from("meeting_acknowledgements").select("*").in("meeting_id", meetingIds),
        ])
      : [
          { data: [] as MeetingParticipant[], error: null },
          { data: [] as MeetingAgendaItem[], error: null },
          { data: [] as MeetingNote[], error: null },
          { data: [] as MeetingActionItem[], error: null },
          { data: [] as MeetingAcknowledgement[], error: null },
        ];

    if (
      participantsResult.error ||
      agendaResult.error ||
      notesResult.error ||
      actionsResult.error ||
      acknowledgementResult.error
    ) {
      return safeDataError(emptyMeetingsData);
    }

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        students: studentsResult.data ?? [],
        contacts: contactsResult.data ?? [],
        meetingTypes: typesResult.data ?? [],
        meetings: meetingsResult.data ?? [],
        participants: participantsResult.data ?? [],
        agendaItems: agendaResult.data ?? [],
        notes: notesResult.data ?? [],
        actionItems: actionsResult.data ?? [],
        acknowledgements: acknowledgementResult.data ?? [],
        permissions: {
          canManage: permissions["meeting.manage"],
          canFinalize: permissions["meeting.finalize"],
          canRead: permissions["meeting.read"],
          canManageTypes: permissions["meeting.type.manage"],
        },
      },
    };
  } catch {
    return safeDataError(emptyMeetingsData);
  }
}
