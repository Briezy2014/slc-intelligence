import type { CommunicationTemplateCatalogItem } from "@/lib/catalogs/types";

function item(
  id: string,
  name: string,
  subjectTemplate: string,
  bodyTemplate: string,
  method: CommunicationTemplateCatalogItem["method"] = "email",
  defaultVisibility: CommunicationTemplateCatalogItem["defaultVisibility"] = "family_visible",
): CommunicationTemplateCatalogItem {
  return { id, name, defaultVisibility, method, subjectTemplate, bodyTemplate };
}

export const COMMUNICATION_TEMPLATES: CommunicationTemplateCatalogItem[] = [
  item(
    "progress-update",
    "Positive progress update",
    "Update on {{studentFirstName}}'s progress",
    "Hello {{contactFirstName}},\n\nI wanted to share a quick update on {{studentFirstName}}. Recently, {{studentFirstName}} has shown progress in {{focusArea}}. We will continue practicing this skill and share the next update soon.\n\nPlease let me know if you have questions.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "missing-work",
    "Missing work reminder",
    "Support needed for {{studentFirstName}}'s assignments",
    "Hello {{contactFirstName}},\n\nI am reaching out because {{studentFirstName}} has incomplete work in {{focusArea}}. Please encourage completion at home if possible, and reply if barriers are getting in the way so we can support together.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "iep-meeting-invite",
    "IEP meeting invitation summary",
    "IEP meeting information for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nThis message confirms our upcoming IEP-related meeting for {{studentFirstName}}. Please reply with questions or scheduling needs. We value your input and will review current progress, supports, and next steps together.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "behavior-support-update",
    "Behavior support update",
    "Support plan update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI wanted to update you on {{studentFirstName}}'s support plan. Today we practiced {{focusArea}} and used agreed classroom supports. Please let us know what is working at home so we can stay consistent.\n\nThank you,\n{{staffName}}",
    "phone",
  ),
  item(
    "attendance-check",
    "Attendance / arrival check-in",
    "Checking in about {{studentFirstName}}'s attendance",
    "Hello {{contactFirstName}},\n\nI am checking in regarding {{studentFirstName}}'s recent attendance/arrival pattern. Please share any context we should know so we can support a successful school day.\n\nThank you,\n{{staffName}}",
    "phone",
  ),
  item(
    "service-delivery",
    "Related service session note",
    "{{focusArea}} session note for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}} participated in a {{focusArea}} session. We practiced targeted skills and will continue this work in upcoming sessions. Please reach out with questions.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "accommodation-reminder",
    "Accommodation implementation note",
    "Classroom support update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nSharing a brief note that {{studentFirstName}}'s classroom supports for {{focusArea}} were used as planned. Please contact me if you notice changes at home that we should consider.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "transition-support",
    "Transition support update",
    "Transition support for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}} worked on transition routines today with visual/timer supports related to {{focusArea}}. Consistency between home and school will help. Let us know how we can partner.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "celebration",
    "Celebration / strength note",
    "Celebrating {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI wanted to celebrate {{studentFirstName}} today. A clear strength was {{focusArea}}. Please share this recognition at home.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "concern-followup",
    "Concern follow-up (family visible)",
    "Follow-up regarding {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI am following up about {{studentFirstName}} regarding {{focusArea}}. Our next step at school is to continue supports and monitor progress. Please reply with questions or information that would help us.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "internal-team-note",
    "Internal team coordination note",
    "Internal coordination: {{studentFirstName}} / {{focusArea}}",
    "Internal note: Coordination needed for {{studentFirstName}} regarding {{focusArea}}. Summary for staff planning only. Confirm family-visible language before external sharing.",
    "other",
    "internal",
  ),
  item(
    "permission-request",
    "Permission / reply requested",
    "Reply requested for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nPlease reply regarding {{focusArea}} for {{studentFirstName}} so we can proceed with the next support step. Thank you for partnering with us.\n\n{{staffName}}",
    "text",
  ),
];

export type CommunicationDraftContext = {
  studentFirstName?: string;
  contactFirstName?: string;
  staffName?: string;
  focusArea?: string;
};

export function applyCommunicationTemplate(
  template: CommunicationTemplateCatalogItem,
  context: CommunicationDraftContext,
): {
  subject: string;
  summary: string;
  visibility: CommunicationTemplateCatalogItem["defaultVisibility"];
  method: CommunicationTemplateCatalogItem["method"];
} {
  const replace = (value: string) =>
    value
      .replaceAll("{{studentFirstName}}", context.studentFirstName?.trim() || "your student")
      .replaceAll("{{contactFirstName}}", context.contactFirstName?.trim() || "there")
      .replaceAll("{{staffName}}", context.staffName?.trim() || "SLC Intelligence team")
      .replaceAll("{{focusArea}}", context.focusArea?.trim() || "the current instructional focus");

  return {
    subject: replace(template.subjectTemplate),
    summary: replace(template.bodyTemplate),
    visibility: template.defaultVisibility,
    method: template.method,
  };
}

export function getCommunicationTemplate(id: string): CommunicationTemplateCatalogItem | undefined {
  return COMMUNICATION_TEMPLATES.find((template) => template.id === id);
}
