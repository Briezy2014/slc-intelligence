export type InstructionalCapabilityStatus =
  | "available_now"
  | "assistive_draft"
  | "workflow_ready"
  | "gated_until_approval";

export type InstructionalToolId =
  | "present-levels"
  | "goal-need-match"
  | "measurable-goal"
  | "consistency-check"
  | "parent-friendly"
  | "instructional-plan"
  | "para-supports"
  | "meeting-prep";

export type InstructionalCapability = {
  id: string;
  title: string;
  body: string;
  status: InstructionalCapabilityStatus;
  /** In-page tool id, or external route. */
  href: string;
  toolId?: InstructionalToolId;
  howTo: string;
};

/** Instructional differentiators vs compliance-document-only systems. */
export const INSTRUCTIONAL_CAPABILITIES: InstructionalCapability[] = [
  {
    id: "present-levels",
    title: "Draft present levels from district-approved evidence",
    body: "Paste classroom/evaluation evidence to draft a present-levels structure. Educators review and finalize — the tool does not invent scores.",
    status: "assistive_draft",
    href: "/instructional-intelligence?tool=present-levels",
    toolId: "present-levels",
    howTo:
      "1) Open Tools → Present levels. 2) Enter a focus area. 3) Paste evidence notes. 4) Click Draft present levels. 5) Review before using in an IEP draft.",
  },
  {
    id: "goal-need-match",
    title: "Match goals directly to documented needs",
    body: "Compare documented needs to goal ideas and surface coverage gaps for IEP team review.",
    status: "assistive_draft",
    href: "/instructional-intelligence?tool=goal-need-match",
    toolId: "goal-need-match",
    howTo:
      "1) Open Tools → Goal–need match. 2) Paste one need per line. 3) Optionally paste current goal ideas. 4) Run Match. 5) Use gaps as team discussion points — not automatic goal creation.",
  },
  {
    id: "measurable-goal",
    title: "Flag goals that are not measurable",
    body: "Heuristic checks for vague phrases, missing conditions, and missing criteria before team finalization.",
    status: "available_now",
    href: "/instructional-intelligence?tool=measurable-goal",
    toolId: "measurable-goal",
    howTo:
      "1) Open Tools → Measurable goal check. 2) Paste a goal statement. 3) Run Check. 4) Fix vague language, conditions, and criteria before the IEP meeting.",
  },
  {
    id: "consistency-check",
    title: "Detect inconsistencies across ETR, IEP, and progress reports",
    body: "Paste excerpts to flag possible uncovered needs or missing progress mentions. Drafting aid only — not a legal compliance determination.",
    status: "assistive_draft",
    href: "/instructional-intelligence?tool=consistency-check",
    toolId: "consistency-check",
    howTo:
      "1) Open Tools → Consistency check. 2) Paste short ETR, IEP, and progress excerpts. 3) Run the check. 4) Review flags with the team.",
  },
  {
    id: "parent-friendly",
    title: "Translate technical language into parent-friendly summaries",
    body: "Rewrite IEP/ETR/progress jargon into plain language for family updates, with educator review before sending.",
    status: "assistive_draft",
    href: "/instructional-intelligence?tool=parent-friendly",
    toolId: "parent-friendly",
    howTo:
      "1) Open Tools → Parent-friendly summary. 2) Paste technical text. 3) Generate. 4) Review, then move into Family Communication if sending home.",
  },
  {
    id: "instructional-plan",
    title: "Create instructional plans from IEP goals",
    body: "Turn a goal into an I do / We do / You do plan with data collection and para notes.",
    status: "available_now",
    href: "/instructional-intelligence?tool=instructional-plan",
    toolId: "instructional-plan",
    howTo:
      "1) Open Tools → Instructional plan. 2) Paste an IEP goal. 3) Add setting. 4) Generate I do / We do / You do plan. 5) Share para notes with staff after review.",
  },
  {
    id: "packets",
    title: "Generate differentiated instructional packets",
    body: "Build activity packets from grade, support needs, reading level, IEP goals, and interests.",
    status: "available_now",
    href: "/instructional-packets",
    howTo:
      "Open Instructional Packets from the nav (or here). Enter a learner profile, choose difficulty and length, generate, then review before printing.",
  },
  {
    id: "para-supports",
    title: "Help paraprofessionals understand approved supports",
    body: "Rewrite accommodations/supports into plain do/don’t language for classroom staff.",
    status: "available_now",
    href: "/instructional-intelligence?tool=para-supports",
    toolId: "para-supports",
    howTo:
      "1) Open Tools → Para supports. 2) Paste approved accommodations (one per line). 3) Generate do/don’t language. 4) Optional: also use the dedicated Para Supports page.",
  },
  {
    id: "interventions",
    title: "Track intervention fidelity and progress",
    body: "Fidelity checklists, dosage, phase comparison, and progress monitoring analytics are live.",
    status: "available_now",
    href: "/interventions",
    howTo:
      "Open Interventions to log fidelity/dosage, and Rapid Progress / Goals for monitoring.",
  },
  {
    id: "meeting-prep",
    title: "Generate meeting preparation summaries",
    body: "Organize strengths, needs, progress, and family questions into a meeting prep draft.",
    status: "assistive_draft",
    href: "/instructional-intelligence?tool=meeting-prep",
    toolId: "meeting-prep",
    howTo:
      "1) Open Tools → Meeting prep. 2) Fill strengths, needs, progress, family questions. 3) Generate. 4) Bring the draft into Meetings after review.",
  },
  {
    id: "overdue-data",
    title: "Identify overdue data collection",
    body: "Command Center and Administrative Intelligence flag goals without recent finalized data as workflow gaps.",
    status: "workflow_ready",
    href: "/command-center",
    howTo:
      "Open Command Center for overdue/missing data signals. Use Deadline Tracker and Administrative Intelligence for deeper workflow views.",
  },
  {
    id: "admin-dashboards",
    title: "Produce compliance dashboards for administrators",
    body: "Administrative Intelligence provides documentation/readiness dashboards. Packaged legal compliance report suites stay gated until district/legal approval.",
    status: "gated_until_approval",
    href: "/administrative-intelligence",
    howTo:
      "Open Administrative Intelligence for readiness views. Full compliance packaging is listed as not activated on the homepage.",
  },
  {
    id: "coordinated-programs",
    title: "Support special education, EL, 504, and MTSS in one coordinated environment",
    body: "Special education is primary; 504/EL/Gifted scaffolds and MTSS coordination keep multi-program work in one place.",
    status: "workflow_ready",
    href: "/education-documents",
    howTo:
      "Use IEP / ETR Docs for special education and related draft templates; use Interventions for MTSS-tier work.",
  },
  {
    id: "reduce-writing",
    title: "Reduce repetitive writing while retaining human decision-making",
    body: "AI Assist and catalogs draft language; educators always review. The platform does not auto-finalize goals, placement, or eligibility.",
    status: "available_now",
    href: "/ai-assist",
    howTo:
      "Open AI Assist for catalog/model drafts across domains. Always edit before saving or sending. Humans keep decision authority.",
  },
] as const;

export const INSTRUCTIONAL_STATUS_LABEL: Record<InstructionalCapabilityStatus, string> = {
  available_now: "Available now",
  assistive_draft: "Assistive draft · human review",
  workflow_ready: "Workflow ready",
  gated_until_approval: "Gated until district/legal approval",
};

export const INSTRUCTIONAL_POSITIONING =
  "SLC Intelligence is built to be instructionally useful—not only a compliance document system. Drafts and flags support educators; humans retain decision-making authority.";

export const INSTRUCTIONAL_TOOLS: Array<{
  id: InstructionalToolId;
  title: string;
  shortLabel: string;
  description: string;
}> = [
  {
    id: "present-levels",
    title: "Draft present levels from evidence",
    shortLabel: "Present levels",
    description: "Paste evidence notes. Draft present-levels structure without inventing scores.",
  },
  {
    id: "goal-need-match",
    title: "Match goals to documented needs",
    shortLabel: "Goal–need match",
    description: "Find coverage gaps between needs and goal ideas.",
  },
  {
    id: "measurable-goal",
    title: "Flag goals that are not measurable",
    shortLabel: "Measurable goal check",
    description: "Check vague language, missing conditions, and missing criteria.",
  },
  {
    id: "consistency-check",
    title: "ETR · IEP · progress consistency check",
    shortLabel: "Consistency check",
    description: "Drafting aid only — not a legal compliance determination.",
  },
  {
    id: "parent-friendly",
    title: "Parent-friendly summary",
    shortLabel: "Parent-friendly",
    description: "Translate technical language for home communication.",
  },
  {
    id: "instructional-plan",
    title: "Instructional plan from IEP goal",
    shortLabel: "Instructional plan",
    description: "Build an I do / We do / You do plan with para notes.",
  },
  {
    id: "para-supports",
    title: "Para-friendly approved supports",
    shortLabel: "Para supports",
    description: "Plain-language do/don’t guidance from approved supports.",
  },
  {
    id: "meeting-prep",
    title: "Meeting preparation summary",
    shortLabel: "Meeting prep",
    description: "Organize strengths, needs, progress, and family questions.",
  },
];
