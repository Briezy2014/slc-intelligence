export const APP_NAME = "SLC Intelligence";
export const APP_TAGLINE = "The Intelligence Platform for Specialized Learning Classrooms";
export const PRODUCTION_DOMAIN = "slcintelligence.com";
export const CANONICAL_PRODUCTION_URL = "https://slcintelligence.com";

/** Top public nav links. Sign in is the blue header button only (not duplicated here). */
export const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/support", label: "Support" },
  { href: "/request-access", label: "Request access" },
] as const;

export type PlatformNavItem = {
  href: string;
  label: string;
};

/** Grouped navigation — daily classroom work first, setup/admin last. */
export const PLATFORM_NAV_GROUPS: Array<{
  label: string;
  items: PlatformNavItem[];
}> = [
  {
    label: "Daily use",
    items: [
      { href: "/command-center", label: "Command Center" },
      { href: "/students", label: "Students" },
      { href: "/classroom-operations", label: "Classroom Operations" },
      { href: "/progress/enter", label: "Rapid Progress" },
      { href: "/goals", label: "Goals" },
      { href: "/behavior-detective", label: "Behavior Detective" },
      { href: "/instructional-intelligence", label: "Instructional Intelligence" },
      { href: "/worksheet-generator", label: "Worksheet Generator" },
      { href: "/family-communication", label: "Family Communication" },
    ],
  },
  {
    label: "Instruction & materials",
    items: [
      { href: "/instructional-packets", label: "Instructional Packets" },
      { href: "/ai-assist", label: "AI Assist" },
      { href: "/para-supports", label: "Para Supports" },
      { href: "/interventions", label: "Interventions" },
      { href: "/accommodations", label: "Accommodations" },
      { href: "/services", label: "Services" },
      { href: "/executive-function", label: "Executive Function" },
    ],
  },
  {
    label: "Documents & family",
    items: [
      { href: "/education-documents", label: "IEP / ETR Docs" },
      { href: "/meetings", label: "Meetings" },
      { href: "/parent-share", label: "Messages for families" },
      { href: "/deadlines", label: "Deadline Tracker" },
      { href: "/reports", label: "Reports" },
    ],
  },
  {
    label: "Setup & admin",
    items: [
      { href: "/schools", label: "Schools" },
      { href: "/programs", label: "Programs" },
      { href: "/classrooms", label: "Classrooms" },
      { href: "/staff", label: "Staff" },
      { href: "/administrative-intelligence", label: "Administrative Intelligence" },
      { href: "/capability-roadmap", label: "Capability Roadmap" },
      { href: "/billing", label: "Billing" },
      { href: "/organization/settings", label: "Organization" },
    ],
  },
];

/** Flat list derived from groups (sitemap / legacy consumers). */
export const PLATFORM_NAV = PLATFORM_NAV_GROUPS.flatMap((group) => group.items);
