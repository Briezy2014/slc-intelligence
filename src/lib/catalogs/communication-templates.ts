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
    "celebration",
    "Celebration / strength note",
    "Celebrating {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI wanted to celebrate {{studentFirstName}} today. A clear strength was {{focusArea}}. Please share this recognition at home.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "missing-work",
    "Missing work reminder",
    "Support needed for {{studentFirstName}}'s assignments",
    "Hello {{contactFirstName}},\n\nI am reaching out because {{studentFirstName}} has incomplete work in {{focusArea}}. Please encourage completion at home if possible, and reply if barriers are getting in the way so we can support together.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "homework-support",
    "Homework / home practice support",
    "Home practice ideas for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nTo support {{studentFirstName}} with {{focusArea}}, here is a short home practice idea you can try for 5–10 minutes. Please reply with what works at home so we can stay consistent.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "iep-meeting-invite",
    "IEP meeting invitation summary",
    "IEP meeting information for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nThis message confirms our upcoming IEP-related meeting for {{studentFirstName}}. Please reply with questions or scheduling needs. We value your input and will review current progress, supports, and next steps together.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "iep-annual-review",
    "IEP annual review reminder",
    "Annual IEP review for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nWe are preparing for {{studentFirstName}}'s annual IEP review. Please share any input about {{focusArea}} and let us know your preferred meeting times. Your participation is important.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "etr-meeting",
    "ETR / evaluation meeting notice",
    "Evaluation team meeting for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nThis note confirms an evaluation team (ETR-related) meeting for {{studentFirstName}}. We will review assessment information and next steps. Please reply with questions or if you need an interpreter.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "reevaluation",
    "Reevaluation planning notice",
    "Reevaluation planning for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nWe are beginning reevaluation planning for {{studentFirstName}} related to {{focusArea}}. Please share concerns or questions so we can include your input.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "504-meeting",
    "Section 504 meeting notice",
    "Section 504 meeting for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nThis message is about a Section 504 meeting for {{studentFirstName}}. We will discuss supports related to {{focusArea}}. Please reply with availability or questions.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "parent-input-request",
    "Parent input / questionnaire request",
    "Parent input requested for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nWe would appreciate your input regarding {{studentFirstName}} and {{focusArea}}. Please reply with strengths, concerns, and what is working at home.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "permission-request",
    "Permission / reply requested",
    "Reply requested for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nPlease reply regarding {{focusArea}} for {{studentFirstName}} so we can proceed with the next support step. Thank you for partnering with us.\n\n{{staffName}}",
    "text",
  ),
  item(
    "behavior-support-update",
    "Behavior support update",
    "Support plan update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI wanted to update you on {{studentFirstName}}'s support plan. Today we practiced {{focusArea}} and used agreed classroom supports. Please let us know what is working at home so we can stay consistent.\n\nThank you,\n{{staffName}}",
    "phone",
  ),
  item(
    "behavior-incident-notice",
    "Behavior incident notice (family)",
    "Behavior incident notice for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI am writing to inform you about a behavior incident involving {{studentFirstName}} related to {{focusArea}}. Staff followed the classroom/safety plan, and we are documenting what happened so we can support better next steps. Please reply so we can discuss supports together.\n\nThank you,\n{{staffName}}",
    "letter",
  ),
  item(
    "behavior-safety-followup",
    "Safety / crisis follow-up",
    "Safety follow-up for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI am following up after a safety-related situation involving {{studentFirstName}} connected to {{focusArea}}. Student and staff safety remain our priority. Please contact us so we can review supports and next steps.\n\nThank you,\n{{staffName}}",
    "phone",
  ),
  item(
    "behavior-boundary-notice",
    "Body boundary / safe touch follow-up",
    "Important follow-up about {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nWe need to discuss a body-boundary / safe-touch concern involving {{studentFirstName}} related to {{focusArea}}. We are teaching clear expectations and supervision supports at school. Please reply so we can partner on consistent language at home and school.\n\nThank you,\n{{staffName}}",
    "letter",
  ),
  item(
    "bus-behavior",
    "Bus / transportation behavior note",
    "Transportation update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nThis is an update about {{studentFirstName}}'s bus/transportation behavior related to {{focusArea}}. Please talk with {{studentFirstName}} about safe riding expectations. Reply if you have information that would help.\n\nThank you,\n{{staffName}}",
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
    "tardy-pattern",
    "Tardy / late arrival pattern",
    "Late arrival check-in for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI am reaching out about {{studentFirstName}}'s recent late arrivals related to {{focusArea}}. Please let us know how we can help support a smoother morning routine.\n\nThank you,\n{{staffName}}",
    "text",
  ),
  item(
    "service-delivery",
    "Related service session note",
    "{{focusArea}} session note for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}} participated in a {{focusArea}} session. We practiced targeted skills and will continue this work in upcoming sessions. Please reach out with questions.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "service-missed",
    "Missed related service notice",
    "Missed {{focusArea}} session for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}} missed a scheduled {{focusArea}} session. We will work to make up services as appropriate and keep you informed.\n\nThank you,\n{{staffName}}",
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
    "concern-followup",
    "Concern follow-up (family visible)",
    "Follow-up regarding {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI am following up about {{studentFirstName}} regarding {{focusArea}}. Our next step at school is to continue supports and monitor progress. Please reply with questions or information that would help us.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "conference-request",
    "Parent–teacher conference request",
    "Conference request for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI would like to schedule a conference about {{studentFirstName}} and {{focusArea}}. Please reply with times that work for you (in person, phone, or video).\n\nThank you,\n{{staffName}}",
    "email",
  ),
  item(
    "discipline-conference",
    "Discipline / administrative conference invite",
    "Conference invite regarding {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nPlease join us for a conference regarding {{studentFirstName}} and {{focusArea}}. The purpose is to review what happened, hear your input, and plan supports. Reply with your availability.\n\nThank you,\n{{staffName}}",
    "letter",
  ),
  item(
    "progress-report-send",
    "Progress report send-home notice",
    "Progress report for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}}'s progress report related to {{focusArea}} is ready to review. Please read the report and reply with questions. You may also acknowledge receipt using the parent read/sign link if provided.\n\nThank you,\n{{staffName}}",
    "letter",
  ),
  item(
    "midyear-update",
    "Mid-year IEP / goal update",
    "Mid-year update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nHere is a mid-year update on {{studentFirstName}}'s goals related to {{focusArea}}. We will continue current supports and adjust instruction as needed. Please share your observations from home.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "interpreter-available",
    "Interpreter / language support offer",
    "Language support available for {{studentFirstName}}'s family",
    "Hello {{contactFirstName}},\n\nWe can arrange interpreter/language support for meetings and school communications about {{studentFirstName}}. Please reply with your preferred language and whether you need an interpreter for {{focusArea}}.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "emergency-contact-update",
    "Emergency contact update request",
    "Please update contacts for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nPlease confirm or update emergency contact information for {{studentFirstName}}. Accurate contacts help us reach you quickly regarding {{focusArea}} or other school needs.\n\nThank you,\n{{staffName}}",
    "text",
  ),
  item(
    "medication-health",
    "Medication / health information reminder",
    "Health information reminder for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nPlease share any updated health/medication information the school should know for {{studentFirstName}} related to {{focusArea}}. Contact the nurse/office as needed.\n\nThank you,\n{{staffName}}",
    "phone",
  ),
  item(
    "clothing-supplies",
    "Clothing / supplies request",
    "Supplies needed for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}} needs support with {{focusArea}} (clothing, hygiene items, or school supplies). Please reply so we can problem-solve together respectfully.\n\nThank you,\n{{staffName}}",
    "text",
  ),
  item(
    "field-trip",
    "Field trip / community outing notice",
    "Outing information for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nThis note shares information about an upcoming school outing for {{studentFirstName}} related to {{focusArea}}. Please reply with questions or permission needs.\n\nThank you,\n{{staffName}}",
    "letter",
  ),
  item(
    "transportation-change",
    "Transportation change notice",
    "Transportation change for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nWe are communicating a transportation change for {{studentFirstName}} related to {{focusArea}}. Please confirm you received this notice and reply with questions.\n\nThank you,\n{{staffName}}",
    "letter",
  ),
  item(
    "bullying-followup",
    "Bullying / peer conflict follow-up",
    "Peer conflict follow-up for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI am following up about a peer conflict/bullying concern involving {{studentFirstName}} related to {{focusArea}}. We are supporting safety and skills at school. Please share any home observations and reply so we can coordinate.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "technology-home",
    "Technology / device expectations",
    "Device expectations for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nSharing school technology expectations for {{studentFirstName}} related to {{focusArea}}. Consistency between home and school helps. Please reply with questions.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "sensory-tools-home",
    "Sensory / regulation tools for home",
    "Regulation ideas for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nHere are regulation/sensory strategies we use at school for {{studentFirstName}} around {{focusArea}}. You may try similar supports at home if helpful. Reply with what works for your family.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "gifted-service",
    "Gifted / enrichment update",
    "Enrichment update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nSharing an update on {{studentFirstName}}'s enrichment/gifted-related work in {{focusArea}}. Please let us know questions or strengths you see at home.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "el-support",
    "English learner / language support update",
    "Language support update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nThis is an update on language supports for {{studentFirstName}} related to {{focusArea}}. Please tell us the best language for home communications.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "summer-esevices",
    "Extended school year / summer services info",
    "Summer / ESY information for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nSharing information about summer/extended services considerations for {{studentFirstName}} related to {{focusArea}}. Please reply with questions or interest so we can guide next steps.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "positive-week-summary",
    "Weekly positive summary",
    "This week with {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nHere is a short weekly summary for {{studentFirstName}}. A highlight was {{focusArea}}. Thank you for your partnership.\n\n{{staffName}}",
    "text",
  ),
  item(
    "read-and-acknowledge",
    "Please read and acknowledge receipt",
    "Please read and acknowledge: {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nPlease read this school communication about {{studentFirstName}} regarding {{focusArea}}. When you have read it, open the parent link (if provided), check “I have read this,” type your name, and send so school staff are notified.\n\nThank you,\n{{staffName}}",
    "letter",
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
    "internal-behavior-debrief",
    "Internal behavior debrief",
    "Internal debrief: {{studentFirstName}} / {{focusArea}}",
    "Internal staff debrief for {{studentFirstName}} regarding {{focusArea}}. Record antecedents, staff response, and next teaching steps. Do not send this wording home without rewriting in family-appropriate language.",
    "other",
    "internal",
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
