import {
  emptyDataState,
  getOrgDataContext,
  getPermissionFlags,
  safeDataError,
  type DataState,
} from "@/lib/data/shared";
import type {
  CommunicationCategory,
  CommunicationFollowup,
  CommunicationLog,
  CommunicationParticipant,
  CommunicationTemplate,
  ContactPreference,
  Student,
  StudentContact,
} from "@/lib/supabase/types";

export type CommunicationsData = {
  organizationId: string | null;
  organizationName: string | null;
  students: Student[];
  contacts: StudentContact[];
  preferences: ContactPreference[];
  categories: CommunicationCategory[];
  communications: CommunicationLog[];
  familyVisibleCommunications: CommunicationLog[];
  participants: CommunicationParticipant[];
  followups: CommunicationFollowup[];
  templates: CommunicationTemplate[];
  permissions: {
    canManageContacts: boolean;
    canReadContacts: boolean;
    canEnterCommunication: boolean;
    canFinalizeCommunication: boolean;
    canReadCommunication: boolean;
    canManageTemplates: boolean;
    canReadInternal: boolean;
  };
};

const emptyCommunicationsData: CommunicationsData = {
  organizationId: null,
  organizationName: null,
  students: [],
  contacts: [],
  preferences: [],
  categories: [],
  communications: [],
  familyVisibleCommunications: [],
  participants: [],
  followups: [],
  templates: [],
  permissions: {
    canManageContacts: false,
    canReadContacts: false,
    canEnterCommunication: false,
    canFinalizeCommunication: false,
    canReadCommunication: false,
    canManageTemplates: false,
    canReadInternal: false,
  },
};

export function familyVisibleCommunicationExport(logs: CommunicationLog[]) {
  return logs
    .filter((log) => log.visibility === "family_visible")
    .map(({ id, student_id, occurred_at, method, direction, subject, summary, status }) => ({
      id,
      student_id,
      occurred_at,
      method,
      direction,
      subject,
      summary,
      status,
    }));
}

export async function listCommunications(options: { studentId?: string; communicationId?: string } = {}): Promise<DataState<CommunicationsData>> {
  const context = await getOrgDataContext();
  if (!context) return emptyDataState(emptyCommunicationsData);

  try {
    const permissions = await getPermissionFlags(context, [
      "contact.manage",
      "contact.read",
      "communication.enter",
      "communication.finalize",
      "communication.read",
      "communication.template.manage",
      "communication.internal.read",
    ]);

    let contactsQuery = context.supabase
      .from("student_contacts")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("last_name");
    let communicationsQuery = context.supabase
      .from("communication_logs")
      .select("*")
      .eq("organization_id", context.organizationId)
      .order("occurred_at", { ascending: false });

    if (options.studentId) {
      contactsQuery = contactsQuery.eq("student_id", options.studentId);
      communicationsQuery = communicationsQuery.eq("student_id", options.studentId);
    }
    if (options.communicationId) communicationsQuery = communicationsQuery.eq("id", options.communicationId);

    const [studentsResult, contactsResult, categoriesResult, communicationsResult, templatesResult] = await Promise.all([
      context.supabase.from("students").select("*").eq("organization_id", context.organizationId).order("last_name"),
      contactsQuery,
      context.supabase.from("communication_categories").select("*").eq("organization_id", context.organizationId).order("name"),
      communicationsQuery,
      context.supabase.from("communication_templates").select("*").eq("organization_id", context.organizationId).order("name"),
    ]);

    if (
      studentsResult.error ||
      contactsResult.error ||
      categoriesResult.error ||
      communicationsResult.error ||
      templatesResult.error
    ) {
      return safeDataError(emptyCommunicationsData);
    }

    const contactIds = (contactsResult.data ?? []).map((contact) => contact.id);
    const communicationIds = (communicationsResult.data ?? []).map((communication) => communication.id);
    const [preferencesResult, participantsResult, followupsResult] = await Promise.all([
      contactIds.length
        ? context.supabase.from("contact_preferences").select("*").in("contact_id", contactIds)
        : { data: [] as ContactPreference[], error: null },
      communicationIds.length
        ? context.supabase.from("communication_participants").select("*").in("communication_log_id", communicationIds)
        : { data: [] as CommunicationParticipant[], error: null },
      communicationIds.length
        ? context.supabase.from("communication_followups").select("*").in("communication_log_id", communicationIds)
        : { data: [] as CommunicationFollowup[], error: null },
    ]);

    if (preferencesResult.error || participantsResult.error || followupsResult.error) {
      return safeDataError(emptyCommunicationsData);
    }

    const communications = communicationsResult.data ?? [];

    return {
      configured: true,
      data: {
        organizationId: context.organizationId,
        organizationName: context.organizationName,
        students: studentsResult.data ?? [],
        contacts: contactsResult.data ?? [],
        preferences: preferencesResult.data ?? [],
        categories: categoriesResult.data ?? [],
        communications,
        familyVisibleCommunications: communications.filter((communication) => communication.visibility === "family_visible"),
        participants: participantsResult.data ?? [],
        followups: followupsResult.data ?? [],
        templates: templatesResult.data ?? [],
        permissions: {
          canManageContacts: permissions["contact.manage"],
          canReadContacts: permissions["contact.read"],
          canEnterCommunication: permissions["communication.enter"],
          canFinalizeCommunication: permissions["communication.finalize"],
          canReadCommunication: permissions["communication.read"],
          canManageTemplates: permissions["communication.template.manage"],
          canReadInternal: permissions["communication.internal.read"],
        },
      },
    };
  } catch {
    return safeDataError(emptyCommunicationsData);
  }
}
