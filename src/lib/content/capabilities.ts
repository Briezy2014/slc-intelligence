import {
  INSTRUCTIONAL_CAPABILITIES,
  INSTRUCTIONAL_POSITIONING,
} from "@/lib/instructional-intelligence/matrix";

export const ACTIVE_CAPABILITIES = [
  {
    title: "Daily data collection",
    body: "Rapid classroom entry for prompts, independence, accuracy, participation, and daily notes.",
  },
  {
    title: "Goal tracking",
    body: "IEP goals, objectives, and learning progressions with measurable classroom targets.",
  },
  {
    title: "Behavior Detective",
    body: "Structured ABC observations, definitions, and behavior support documentation.",
  },
  {
    title: "AI lesson planning",
    body: "Educator-reviewable lesson and instructional support drafts aligned to classroom focus areas.",
  },
  {
    title: "Progress monitoring",
    body: "Transparent progress analytics and reporting workflows for instructional decision support.",
  },
  {
    title: "Student profiles",
    body: "Organization-scoped student records with goals, behavior, services, and classroom context.",
  },
  {
    title: "AI draft IEP goals",
    body: "Assistive drafting for measurable goal language—always requiring educator/IEP team review.",
  },
  {
    title: "Accommodation tracker",
    body: "Classroom and testing accommodation libraries, assignments, and implementation logs.",
  },
  {
    title: "Parent communication log",
    body: "Family-visible and internal communication records for home-school collaboration.",
  },
  {
    title: "Ohio-aligned blank IEP / ETR / progress drafts",
    body: "Structured Ohio-oriented blank templates for educator drafting—not official ODE legal PDFs.",
  },
  {
    title: "Signature workflows",
    body: "Receipt acknowledgment / e-signature pathways for family communications (receipt only).",
  },
  {
    title: "Parent share packets",
    body: "Prepare family-visible communication and progress packets for authorized home sharing.",
  },
  {
    title: "Deadline / timeline tracker",
    body: "Classroom reminders for IEP review windows, follow-ups, meetings, and reporting periods.",
  },
  {
    title: "Instructional intelligence toolkit",
    body: "Present levels drafts, goal–need matching, measurability flags, consistency checks, meeting prep, and para-friendly supports.",
  },
] as const;

export const BENEFIT_POINTS = [
  {
    title: "Time savings",
    body: "Enter classroom information once and reuse it across goals, progress, behavior, and family updates.",
  },
  {
    title: "Better documentation",
    body: "Structured special education records that are clearer, more consistent, and easier to review.",
  },
  {
    title: "More consistent progress monitoring",
    body: "Routine data collection and transparent monitoring support stronger instructional follow-through.",
  },
  {
    title: "AI assistance",
    body: "Draft lesson ideas, goal language, and family communications—always educator-reviewed before use.",
  },
  {
    title: "Parent communication",
    body: "Keep home-school communication organized, family-visible when appropriate, and acknowledgment-ready.",
  },
  {
    title: "Compliance reminders",
    body: "Timeline reminders for reviews, meetings, and reporting windows—not automated legal determinations.",
  },
  {
    title: "Instructional usefulness",
    body: INSTRUCTIONAL_POSITIONING,
  },
] as const;

export const FUTURE_GATED_CAPABILITIES = [
  {
    title: "SIS integration",
    body: "Student information system sync for roster and identity alignment.",
  },
  {
    title: "EMIS support",
    body: "Ohio EMIS-oriented data packaging assistance for authorized district workflows.",
  },
  {
    title: "Section 504 caseload module",
    body: "Dedicated 504 planning and documentation workflows beyond current draft scaffolds.",
  },
  {
    title: "Compliance reports",
    body: "District compliance report packages generated under approved governance controls.",
  },
  {
    title: "OCR reporting packages",
    body: "Expanded OCR-assisted document packages for authorized reporting use cases.",
  },
  {
    title: "State reporting",
    body: "State reporting exports configured only after district and legal approval.",
  },
] as const;

export { INSTRUCTIONAL_CAPABILITIES, INSTRUCTIONAL_POSITIONING };

export const CAPABILITY_GUARDRAIL =
  "SLC Intelligence supports special education classroom operations and documentation. It does not replace the IEP team, make eligibility/placement decisions, or claim FERPA/IDEA certification. Identifiable student use and advanced district integrations remain inactive until district and legal counsel approve.";
