export type InstructionalCapabilityStatus =
  | "available_now"
  | "assistive_draft"
  | "workflow_ready"
  | "gated_until_approval";

export type InstructionalCapability = {
  title: string;
  body: string;
  status: InstructionalCapabilityStatus;
  where: string;
};

/** Instructional differentiators vs compliance-document-only systems. */
export const INSTRUCTIONAL_CAPABILITIES: InstructionalCapability[] = [
  {
    title: "Draft present levels from district-approved evidence",
    body: "Paste classroom/evaluation evidence to draft a present-levels structure. Educators review and finalize — the tool does not invent scores.",
    status: "assistive_draft",
    where: "/instructional-intelligence · Present levels",
  },
  {
    title: "Match goals directly to documented needs",
    body: "Compare documented needs to goal ideas and surface coverage gaps for IEP team review.",
    status: "assistive_draft",
    where: "/instructional-intelligence · Goal–need match",
  },
  {
    title: "Flag goals that are not measurable",
    body: "Heuristic checks for vague phrases, missing conditions, and missing criteria before team finalization.",
    status: "available_now",
    where: "/instructional-intelligence · Measurable goal check",
  },
  {
    title: "Detect inconsistencies across ETR, IEP, and progress reports",
    body: "Paste excerpts to flag possible uncovered needs or missing progress mentions. Drafting aid only — not a legal compliance determination.",
    status: "assistive_draft",
    where: "/instructional-intelligence · Consistency check",
  },
  {
    title: "Translate technical language into parent-friendly summaries",
    body: "Rewrite IEP/ETR/progress jargon into plain language for family updates, with educator review before sending.",
    status: "assistive_draft",
    where: "/instructional-intelligence · Parent-friendly summary · Family Communication",
  },
  {
    title: "Create instructional plans from IEP goals",
    body: "Turn a goal into an I do / We do / You do plan with data collection and para notes.",
    status: "available_now",
    where: "/instructional-intelligence · Instructional plan · AI Assist lesson planning",
  },
  {
    title: "Help paraprofessionals understand approved supports",
    body: "Rewrite accommodations/supports into plain do/don’t language for classroom staff.",
    status: "available_now",
    where: "/para-supports · Instructional intelligence",
  },
  {
    title: "Track intervention fidelity and progress",
    body: "Fidelity checklists, dosage, phase comparison, and progress monitoring analytics are live.",
    status: "available_now",
    where: "/interventions · /progress/enter · goal analytics",
  },
  {
    title: "Generate meeting preparation summaries",
    body: "Organize strengths, needs, progress, and family questions into a meeting prep draft.",
    status: "assistive_draft",
    where: "/instructional-intelligence · Meeting prep · /meetings",
  },
  {
    title: "Identify overdue data collection",
    body: "Command Center and Administrative Intelligence flag goals without recent finalized data as workflow gaps.",
    status: "workflow_ready",
    where: "/command-center · /administrative-intelligence/data-quality · /deadlines",
  },
  {
    title: "Produce compliance dashboards for administrators",
    body: "Administrative Intelligence provides documentation/readiness dashboards. Packaged legal compliance report suites stay gated until district/legal approval.",
    status: "gated_until_approval",
    where: "/administrative-intelligence · Capability roadmap (compliance reports)",
  },
  {
    title: "Support special education, EL, 504, and MTSS in one coordinated environment",
    body: "Special education is primary; 504/EL/Gifted scaffolds and an MTSS coordination view keep multi-program work in one place. Expanded 504/MTSS packaging can deepen over time.",
    status: "workflow_ready",
    where: "/instructional-intelligence · Coordinated programs · Education documents",
  },
  {
    title: "Reduce repetitive writing while retaining human decision-making",
    body: "AI Assist and catalogs draft language; educators always review. The platform does not auto-finalize goals, placement, or eligibility.",
    status: "available_now",
    where: "/ai-assist · templates across modules",
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
