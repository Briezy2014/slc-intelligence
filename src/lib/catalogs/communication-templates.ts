import type {
  CommunicationTemplateCatalogItem,
  CommunicationTemplateCategory,
} from "@/lib/catalogs/types";

function item(
  id: string,
  name: string,
  category: CommunicationTemplateCategory,
  subjectTemplate: string,
  bodyTemplate: string,
  method: CommunicationTemplateCatalogItem["method"] = "email",
  defaultVisibility: CommunicationTemplateCatalogItem["defaultVisibility"] = "family_visible",
): CommunicationTemplateCatalogItem {
  return { id, name, category, defaultVisibility, method, subjectTemplate, bodyTemplate };
}

export const COMMUNICATION_TEMPLATE_CATEGORIES: CommunicationTemplateCategory[] = [
  "Progress & celebration",
  "Meetings & IEP",
  "Behavior & safety",
  "Attendance & transportation",
  "Services & supports",
  "Home partnership",
  "Internal staff",
];

export const COMMUNICATION_TEMPLATES: CommunicationTemplateCatalogItem[] = [
  item(
    "progress-update",
    "Positive progress update",
    "Progress & celebration",
    "Update on {{studentFirstName}}'s progress",
    "Hello {{contactFirstName}},\n\nI wanted to share a brief update on {{studentFirstName}}. Recently, {{studentFirstName}} has shown progress in {{focusArea}}. We will continue practicing this skill at school and share the next update soon.\n\nPlease let me know if you have questions.\n\nThank you for your partnership,\n{{staffName}}",
  ),
  item(
    "celebration",
    "Celebration / strength note",
    "Progress & celebration",
    "Celebrating {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI wanted to celebrate {{studentFirstName}} today. A clear strength we noticed was {{focusArea}}. Please share this recognition at home.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "positive-week-summary",
    "Weekly positive summary",
    "Progress & celebration",
    "This week with {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nHere is a short weekly summary for {{studentFirstName}}. A highlight was {{focusArea}}. Thank you for your partnership.\n\n{{staffName}}",
    "text",
  ),
  item(
    "growth-mindset-note",
    "Effort and perseverance note",
    "Progress & celebration",
    "Recognizing {{studentFirstName}}'s effort",
    "Hello {{contactFirstName}},\n\nI wanted you to know that {{studentFirstName}} showed strong effort related to {{focusArea}}. We praised the process and will keep building on this success.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "goal-mastery-checkin",
    "Goal progress check-in",
    "Progress & celebration",
    "Goal progress for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nSharing a quick check-in on {{studentFirstName}}'s goal work related to {{focusArea}}. We are monitoring progress and adjusting instruction as needed. Please share any observations from home.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "midyear-update",
    "Mid-year IEP / goal update",
    "Progress & celebration",
    "Mid-year update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nHere is a mid-year update on {{studentFirstName}}'s goals related to {{focusArea}}. We will continue current supports and adjust instruction as needed. Please share your observations from home.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "progress-report-send",
    "Progress report send-home notice",
    "Progress & celebration",
    "Progress report for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}}'s progress report related to {{focusArea}} is ready to review. Please read the report and reply with questions. You may also acknowledge receipt using the parent read/sign link if provided.\n\nThank you,\n{{staffName}}",
    "letter",
  ),
  item(
    "gifted-service",
    "Gifted / enrichment update",
    "Progress & celebration",
    "Enrichment update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nSharing an update on {{studentFirstName}}'s enrichment-related work in {{focusArea}}. Please let us know questions or strengths you see at home.\n\nThank you,\n{{staffName}}",
  ),

  item(
    "iep-meeting-invite",
    "IEP meeting invitation summary",
    "Meetings & IEP",
    "IEP meeting information for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nThis message confirms our upcoming IEP-related meeting for {{studentFirstName}}. Please reply with questions or scheduling needs. We value your input and will review current progress, supports, and next steps together.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "iep-annual-review",
    "IEP annual review reminder",
    "Meetings & IEP",
    "Annual IEP review for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nWe are preparing for {{studentFirstName}}'s annual IEP review. Please share any input about {{focusArea}} and let us know your preferred meeting times. Your participation is important.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "etr-meeting",
    "ETR / evaluation meeting notice",
    "Meetings & IEP",
    "Evaluation team meeting for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nThis note confirms an evaluation team (ETR-related) meeting for {{studentFirstName}}. We will review assessment information and next steps. Please reply with questions or if you need an interpreter.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "reevaluation",
    "Reevaluation planning notice",
    "Meetings & IEP",
    "Reevaluation planning for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nWe are beginning reevaluation planning for {{studentFirstName}} related to {{focusArea}}. Please share concerns or questions so we can include your input.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "504-meeting",
    "Section 504 meeting notice",
    "Meetings & IEP",
    "Section 504 meeting for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nThis message is about a Section 504 meeting for {{studentFirstName}}. We will discuss supports related to {{focusArea}}. Please reply with availability or questions.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "parent-input-request",
    "Parent input / questionnaire request",
    "Meetings & IEP",
    "Parent input requested for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nWe would appreciate your input regarding {{studentFirstName}} and {{focusArea}}. Please reply with strengths, concerns, and what is working at home.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "conference-request",
    "Parent–teacher conference request",
    "Meetings & IEP",
    "Conference request for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI would like to schedule a conference about {{studentFirstName}} and {{focusArea}}. Please reply with times that work for you (in person, phone, or video).\n\nThank you,\n{{staffName}}",
  ),
  item(
    "discipline-conference",
    "Administrative conference invite",
    "Meetings & IEP",
    "Conference invite regarding {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nPlease join us for a conference regarding {{studentFirstName}} and {{focusArea}}. The purpose is to review what happened, hear your input, and plan supports. Reply with your availability.\n\nThank you,\n{{staffName}}",
    "letter",
  ),
  item(
    "iep-amendment-notice",
    "IEP amendment discussion notice",
    "Meetings & IEP",
    "IEP amendment discussion for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nWe would like to discuss a possible IEP amendment for {{studentFirstName}} related to {{focusArea}}. Please reply with questions and preferred meeting times so we can include your input.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "prior-written-notice-followup",
    "Prior written notice follow-up",
    "Meetings & IEP",
    "Follow-up regarding notice for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI am following up on a prior written notice related to {{studentFirstName}} and {{focusArea}}. Please reply if you have questions or would like to discuss next steps.\n\nThank you,\n{{staffName}}",
    "letter",
  ),
  item(
    "meeting-reminder",
    "Meeting reminder (24–48 hours)",
    "Meetings & IEP",
    "Reminder: meeting for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nThis is a friendly reminder about our upcoming meeting regarding {{studentFirstName}} and {{focusArea}}. Please reply if you need to reschedule or if you need an interpreter.\n\nThank you,\n{{staffName}}",
    "text",
  ),

  item(
    "behavior-support-update",
    "Behavior support plan update",
    "Behavior & safety",
    "Support plan update for {{studentFirstName}} · {{focusArea}}",
    "Hello {{contactFirstName}},\n\nI am writing to share an update about {{studentFirstName}} and our school support plan related to {{focusArea}}.\n\n{{behaviorDescription}}\n\nToday we practiced replacement skills and used classroom supports such as {{classroomSupports}}. Our goal is to help {{studentFirstName}} stay safe, regulated, and ready to learn.\n\n{{homePartnership}} Please reply if you would like to review the plan together.\n\nThank you for your partnership,\n{{staffName}}",
    "phone",
  ),
  item(
    "behavior-incident-notice",
    "Behavior incident notice (family)",
    "Behavior & safety",
    "Behavior incident notice for {{studentFirstName}} · {{focusArea}}",
    "Hello {{contactFirstName}},\n\nI am writing to inform you of a behavior concern at school involving {{studentFirstName}}. The concern relates to {{focusArea}}.\n\n{{behaviorDescription}}\n\nStaff followed the classroom safety plan, prioritized student and staff safety, and documented the incident so we can determine appropriate next supports. Supports currently in place include {{classroomSupports}}.\n\nPlease reply so we can discuss what occurred and how we can partner on next steps. {{homePartnership}}\n\nThank you for your partnership,\n{{staffName}}",
    "letter",
  ),
  item(
    "behavior-safety-followup",
    "Safety / crisis follow-up",
    "Behavior & safety",
    "Safety follow-up for {{studentFirstName}} · {{focusArea}}",
    "Hello {{contactFirstName}},\n\nI am following up after a safety-related situation involving {{studentFirstName}} related to {{focusArea}}.\n\n{{behaviorDescription}}\n\nStudent and staff safety remain our priority. We used planned supports ({{classroomSupports}}) and will continue teaching safer replacement skills. Please contact us so we can review supports and next steps together.\n\n{{homePartnership}}\n\nThank you,\n{{staffName}}",
    "phone",
  ),
  item(
    "behavior-boundary-notice",
    "Body boundary / safe touch follow-up",
    "Behavior & safety",
    "Important follow-up about {{studentFirstName}} · {{focusArea}}",
    "Hello {{contactFirstName}},\n\nWe need to partner with you about a body-boundary concern involving {{studentFirstName}} related to {{focusArea}}.\n\n{{behaviorDescription}}\n\nAt school we are teaching clear body-boundary expectations, increasing supervision as needed, and practicing safer replacement skills. Supports include {{classroomSupports}}.\n\nPlease reply so we can use consistent language and expectations at home and school. {{homePartnership}}\n\nThank you,\n{{staffName}}",
    "letter",
  ),
  item(
    "bus-behavior",
    "Bus / transportation behavior note",
    "Behavior & safety",
    "Transportation update for {{studentFirstName}} · {{focusArea}}",
    "Hello {{contactFirstName}},\n\nThis is an update about {{studentFirstName}}'s bus/transportation behavior. The concern relates to {{focusArea}}.\n\n{{behaviorDescription}}\n\nPlease review safe riding expectations with {{studentFirstName}}. At school and on transportation we are using supports such as {{classroomSupports}}. Reply if you have information that would help us support a safer ride.\n\n{{homePartnership}}\n\nThank you,\n{{staffName}}",
    "phone",
  ),
  item(
    "bullying-followup",
    "Bullying / peer conflict follow-up",
    "Behavior & safety",
    "Peer conflict follow-up for {{studentFirstName}} · {{focusArea}}",
    "Hello {{contactFirstName}},\n\nI am following up about a peer conflict concern involving {{studentFirstName}} related to {{focusArea}}.\n\n{{behaviorDescription}}\n\nWe are supporting safety and social skills at school with supports such as {{classroomSupports}}. Please share any home observations and reply so we can coordinate. {{homePartnership}}\n\nThank you,\n{{staffName}}",
  ),
  item(
    "behavior-daily-note",
    "Daily behavior check-in note",
    "Behavior & safety",
    "Daily check-in for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nSharing today's brief behavior check-in for {{studentFirstName}} related to {{focusArea}}.\n\n{{behaviorDescription}}\n\nSupports used today included {{classroomSupports}}. Please reply with questions or helpful home information.\n\nThank you,\n{{staffName}}",
    "text",
  ),
  item(
    "behavior-positive-day",
    "Positive behavior day note",
    "Behavior & safety",
    "Positive day for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI wanted you to know {{studentFirstName}} had a strong day related to {{focusArea}}. We reinforced expected skills and will keep practicing. Please celebrate this success at home.\n\nThank you,\n{{staffName}}",
    "text",
  ),
  item(
    "behavior-replacement-skill",
    "Replacement skill practice update",
    "Behavior & safety",
    "Skill practice update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nToday {{studentFirstName}} practiced a replacement skill related to {{focusArea}}.\n\n{{behaviorDescription}}\n\nClassroom supports included {{classroomSupports}}. {{homePartnership}}\n\nThank you,\n{{staffName}}",
  ),
  item(
    "behavior-home-consistency",
    "Home–school consistency request",
    "Behavior & safety",
    "Consistency request for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nTo support {{studentFirstName}} with {{focusArea}}, we are asking for consistent language and expectations between home and school.\n\n{{behaviorDescription}}\n\nSupports we are using include {{classroomSupports}}. {{homePartnership}}\n\nThank you,\n{{staffName}}",
  ),
  item(
    "behavior-office-referral-followup",
    "Office referral follow-up",
    "Behavior & safety",
    "Follow-up after office referral for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI am following up after an office referral involving {{studentFirstName}} related to {{focusArea}}.\n\n{{behaviorDescription}}\n\nWe reviewed safety, expectations, and next supports such as {{classroomSupports}}. Please reply so we can coordinate. {{homePartnership}}\n\nThank you,\n{{staffName}}",
    "phone",
  ),
  item(
    "behavior-reentry-plan",
    "Classroom re-entry support note",
    "Behavior & safety",
    "Re-entry support plan for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nSharing how we are supporting {{studentFirstName}}'s return to class after a difficult situation related to {{focusArea}}.\n\n{{behaviorDescription}}\n\nRe-entry supports include {{classroomSupports}}. Please contact us with questions. {{homePartnership}}\n\nThank you,\n{{staffName}}",
  ),
  item(
    "concern-followup",
    "General concern follow-up",
    "Behavior & safety",
    "Follow-up regarding {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI am following up about {{studentFirstName}} regarding {{focusArea}}. Our next step at school is to continue supports and monitor progress. Please reply with questions or information that would help us.\n\nThank you,\n{{staffName}}",
  ),

  item(
    "attendance-check",
    "Attendance / arrival check-in",
    "Attendance & transportation",
    "Checking in about {{studentFirstName}}'s attendance",
    "Hello {{contactFirstName}},\n\nI am checking in regarding {{studentFirstName}}'s recent attendance/arrival pattern. Please share any context we should know so we can support a successful school day.\n\nThank you,\n{{staffName}}",
    "phone",
  ),
  item(
    "tardy-pattern",
    "Tardy / late arrival pattern",
    "Attendance & transportation",
    "Late arrival check-in for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI am reaching out about {{studentFirstName}}'s recent late arrivals related to {{focusArea}}. Please let us know how we can help support a smoother morning routine.\n\nThank you,\n{{staffName}}",
    "text",
  ),
  item(
    "absence-wellness",
    "Absence wellness check",
    "Attendance & transportation",
    "Checking in after absences for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nI am checking in because {{studentFirstName}} has missed school recently. Please let us know how {{studentFirstName}} is doing and whether we can help with make-up work related to {{focusArea}}.\n\nThank you,\n{{staffName}}",
    "phone",
  ),
  item(
    "transportation-change",
    "Transportation change notice",
    "Attendance & transportation",
    "Transportation change for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nWe are communicating a transportation change for {{studentFirstName}} related to {{focusArea}}. Please confirm you received this notice and reply with questions.\n\nThank you,\n{{staffName}}",
    "letter",
  ),
  item(
    "early-dismissal-plan",
    "Early dismissal / pickup plan",
    "Attendance & transportation",
    "Pickup plan for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nPlease confirm the early dismissal/pickup plan for {{studentFirstName}} related to {{focusArea}}. Accurate pickup information helps us keep students safe.\n\nThank you,\n{{staffName}}",
    "text",
  ),
  item(
    "bus-delay-notice",
    "Bus delay / route notice",
    "Attendance & transportation",
    "Bus update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nSharing a transportation update that may affect {{studentFirstName}} related to {{focusArea}}. Please reply if you need additional details from the office or transportation team.\n\nThank you,\n{{staffName}}",
    "text",
  ),

  item(
    "service-delivery",
    "Related service session note",
    "Services & supports",
    "{{focusArea}} session note for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}} participated in a {{focusArea}} session. We practiced targeted skills and will continue this work in upcoming sessions. Please reach out with questions.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "service-missed",
    "Missed related service notice",
    "Services & supports",
    "Missed {{focusArea}} session for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}} missed a scheduled {{focusArea}} session. We will work to make up services as appropriate and keep you informed.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "accommodation-reminder",
    "Accommodation implementation note",
    "Services & supports",
    "Classroom support update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nSharing a brief note that {{studentFirstName}}'s classroom supports for {{focusArea}} were used as planned. Please contact me if you notice changes at home that we should consider.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "transition-support",
    "Transition support update",
    "Services & supports",
    "Transition support for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}} worked on transition routines today with visual/timer supports related to {{focusArea}}. Consistency between home and school will help. Let us know how we can partner.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "sensory-tools-home",
    "Sensory / regulation tools for home",
    "Services & supports",
    "Regulation ideas for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nHere are regulation/sensory strategies we use at school for {{studentFirstName}} around {{focusArea}}. You may try similar supports at home if helpful. Reply with what works for your family.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "el-support",
    "English learner / language support update",
    "Services & supports",
    "Language support update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nThis is an update on language supports for {{studentFirstName}} related to {{focusArea}}. Please tell us the best language for home communications.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "summer-esevices",
    "Extended school year / summer services info",
    "Services & supports",
    "Summer / ESY information for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nSharing information about summer/extended services considerations for {{studentFirstName}} related to {{focusArea}}. Please reply with questions or interest so we can guide next steps.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "ot-session-home",
    "OT session / home carryover",
    "Services & supports",
    "OT update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}} participated in occupational therapy work related to {{focusArea}}. A short home carryover idea is available if you would like one. Please reply with questions.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "speech-session-home",
    "Speech session / home practice",
    "Services & supports",
    "Speech update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}} practiced speech/language targets related to {{focusArea}}. Brief home practice can help if it fits your routine. Please reply with questions.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "pt-session-home",
    "PT session / home carryover",
    "Services & supports",
    "PT update for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}} participated in physical therapy work related to {{focusArea}}. Please contact us if you would like home carryover ideas.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "counseling-checkin",
    "Counseling / social-emotional check-in",
    "Services & supports",
    "Support check-in for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nSharing a brief school counseling/social-emotional support update for {{studentFirstName}} related to {{focusArea}}. Please reply if you would like to talk through strategies together.\n\nThank you,\n{{staffName}}",
  ),

  item(
    "missing-work",
    "Missing work reminder",
    "Home partnership",
    "Support needed for {{studentFirstName}}'s assignments",
    "Hello {{contactFirstName}},\n\nI am reaching out because {{studentFirstName}} has incomplete work in {{focusArea}}. Please encourage completion at home if possible, and reply if barriers are getting in the way so we can support together.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "homework-support",
    "Homework / home practice support",
    "Home partnership",
    "Home practice ideas for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nTo support {{studentFirstName}} with {{focusArea}}, here is a short home practice idea you can try for 5–10 minutes. Please reply with what works at home so we can stay consistent.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "permission-request",
    "Permission / reply requested",
    "Home partnership",
    "Reply requested for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nPlease reply regarding {{focusArea}} for {{studentFirstName}} so we can proceed with the next support step. Thank you for partnering with us.\n\n{{staffName}}",
    "text",
  ),
  item(
    "interpreter-available",
    "Interpreter / language support offer",
    "Home partnership",
    "Language support available for {{studentFirstName}}'s family",
    "Hello {{contactFirstName}},\n\nWe can arrange interpreter/language support for meetings and school communications about {{studentFirstName}}. Please reply with your preferred language and whether you need an interpreter for {{focusArea}}.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "emergency-contact-update",
    "Emergency contact update request",
    "Home partnership",
    "Please update contacts for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nPlease confirm or update emergency contact information for {{studentFirstName}}. Accurate contacts help us reach you quickly regarding {{focusArea}} or other school needs.\n\nThank you,\n{{staffName}}",
    "text",
  ),
  item(
    "medication-health",
    "Medication / health information reminder",
    "Home partnership",
    "Health information reminder for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nPlease share any updated health/medication information the school should know for {{studentFirstName}} related to {{focusArea}}. Contact the nurse/office as needed.\n\nThank you,\n{{staffName}}",
    "phone",
  ),
  item(
    "clothing-supplies",
    "Clothing / supplies request",
    "Home partnership",
    "Supplies needed for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\n{{studentFirstName}} needs support with {{focusArea}} (clothing, hygiene items, or school supplies). Please reply so we can problem-solve together respectfully.\n\nThank you,\n{{staffName}}",
    "text",
  ),
  item(
    "field-trip",
    "Field trip / community outing notice",
    "Home partnership",
    "Outing information for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nThis note shares information about an upcoming school outing for {{studentFirstName}} related to {{focusArea}}. Please reply with questions or permission needs.\n\nThank you,\n{{staffName}}",
    "letter",
  ),
  item(
    "technology-home",
    "Technology / device expectations",
    "Home partnership",
    "Device expectations for {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nSharing school technology expectations for {{studentFirstName}} related to {{focusArea}}. Consistency between home and school helps. Please reply with questions.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "read-and-acknowledge",
    "Please read and acknowledge receipt",
    "Home partnership",
    "Please read and acknowledge: {{studentFirstName}}",
    "Hello {{contactFirstName}},\n\nPlease read this school communication about {{studentFirstName}} regarding {{focusArea}}. When you have read it, open the parent link (if provided), confirm that you have received this message, type your name, and submit so school staff are notified.\n\nThank you,\n{{staffName}}",
    "letter",
  ),
  item(
    "school-event-invite",
    "School event / family night invite",
    "Home partnership",
    "Invitation for {{studentFirstName}}'s family",
    "Hello {{contactFirstName}},\n\nYou are invited to an upcoming school event related to {{focusArea}} for {{studentFirstName}}. Please reply if you plan to attend or if you need accessibility supports.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "volunteer-request",
    "Classroom volunteer / materials request",
    "Home partnership",
    "Partnership request for {{studentFirstName}}'s class",
    "Hello {{contactFirstName}},\n\nWe are inviting family partnership related to {{focusArea}} for {{studentFirstName}}'s class. Please reply if you are able to help or if another form of support works better for your family.\n\nThank you,\n{{staffName}}",
  ),
  item(
    "positive-phone-script",
    "Positive phone call script",
    "Home partnership",
    "Positive call notes for {{studentFirstName}}",
    "Phone script:\n\nHello {{contactFirstName}}, this is {{staffName}} calling with a positive update about {{studentFirstName}}. Today I wanted to share success related to {{focusArea}}. Please let me know a good time if you would like more details.\n\nThank you for your partnership.",
    "phone",
  ),
  item(
    "concern-phone-script",
    "Concern phone call script",
    "Home partnership",
    "Concern call notes for {{studentFirstName}}",
    "Phone script:\n\nHello {{contactFirstName}}, this is {{staffName}} calling about {{studentFirstName}} regarding {{focusArea}}. I wanted to share what we observed, how we supported {{studentFirstName}}, and invite your input. When is a good time to talk?\n\nThank you for partnering with us.",
    "phone",
  ),

  item(
    "internal-team-note",
    "Internal team coordination note",
    "Internal staff",
    "Internal coordination: {{studentFirstName}} / {{focusArea}}",
    "Internal note: Coordination needed for {{studentFirstName}} regarding {{focusArea}}. Summary for staff planning only. Confirm family-visible language before external sharing.",
    "other",
    "internal",
  ),
  item(
    "internal-behavior-debrief",
    "Internal behavior debrief",
    "Internal staff",
    "Internal debrief: {{studentFirstName}} / {{focusArea}}",
    "Internal staff debrief for {{studentFirstName}} regarding {{focusArea}}. Record antecedents, staff response, and next teaching steps. Do not send this wording home without rewriting in family-appropriate language.\n\n{{behaviorDescription}}\n\nSupports considered: {{classroomSupports}}.",
    "other",
    "internal",
  ),
  item(
    "internal-coverage-handoff",
    "Internal coverage / substitute handoff",
    "Internal staff",
    "Coverage handoff: {{studentFirstName}} / {{focusArea}}",
    "Internal coverage note for {{studentFirstName}} regarding {{focusArea}}. Include schedule, known triggers, successful supports, and who to contact. Not for family distribution.",
    "other",
    "internal",
  ),
  item(
    "internal-related-service-coord",
    "Internal related-service coordination",
    "Internal staff",
    "Service coordination: {{studentFirstName}} / {{focusArea}}",
    "Internal coordination note for related services for {{studentFirstName}} regarding {{focusArea}}. Confirm make-up plan, push-in/pull-out logistics, and family communication ownership before contacting home.",
    "other",
    "internal",
  ),
];

export type CommunicationDraftContext = {
  studentFirstName?: string;
  contactFirstName?: string;
  staffName?: string;
  focusArea?: string;
  behaviorDescription?: string;
  classroomSupports?: string;
  homePartnership?: string;
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
      .replaceAll("{{contactFirstName}}", context.contactFirstName?.trim() || "family")
      .replaceAll("{{staffName}}", context.staffName?.trim() || "SLC Intelligence team")
      .replaceAll("{{focusArea}}", context.focusArea?.trim() || "the current support focus")
      .replaceAll(
        "{{behaviorDescription}}",
        context.behaviorDescription?.trim() ||
          "We are teaching expected skills, practicing replacement behaviors, and using agreed classroom supports.",
      )
      .replaceAll(
        "{{classroomSupports}}",
        context.classroomSupports?.trim() ||
          "planned prompts, visual supports, practice of replacement skills, and adult check-ins",
      )
      .replaceAll(
        "{{homePartnership}}",
        context.homePartnership?.trim() ||
          "Please share what is working at home so we can stay consistent with language, expectations, and supports.",
      );

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

export function groupCommunicationTemplatesByCategory(): Array<{
  category: CommunicationTemplateCategory;
  templates: CommunicationTemplateCatalogItem[];
}> {
  return COMMUNICATION_TEMPLATE_CATEGORIES.map((category) => ({
    category,
    templates: COMMUNICATION_TEMPLATES.filter((template) => template.category === category),
  })).filter((group) => group.templates.length > 0);
}
