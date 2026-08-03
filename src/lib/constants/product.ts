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
  /** Nested links shown when this item (or a child) is active. */
  children?: PlatformNavItem[];
};

/**
 * Condensed teacher-first navigation.
 * Features stay available via hubs/children — not 29 peer sidebar tabs.
 */
export const PLATFORM_NAV_GROUPS: Array<{
  label: string;
  items: PlatformNavItem[];
}> = [
  {
    label: "Today",
    items: [
      { href: "/command-center", label: "Home" },
      { href: "/students", label: "Students" },
      { href: "/classroom-operations", label: "Classroom" },
      { href: "/progress/enter", label: "Progress entry" },
      { href: "/behavior-detective", label: "Behavior" },
      { href: "/family-communication", label: "Families" },
    ],
  },
  {
    label: "Plan",
    items: [
      {
        href: "/supports",
        label: "Supports",
        children: [
          { href: "/accommodations", label: "Accommodations" },
          { href: "/interventions", label: "Interventions" },
          { href: "/services", label: "Services" },
          { href: "/executive-function", label: "Executive function" },
        ],
      },
      {
        href: "/instructional-intelligence",
        label: "Instruction",
        children: [
          { href: "/instructional-packets", label: "Packets" },
          { href: "/worksheet-generator", label: "Worksheets" },
          { href: "/para-supports", label: "Para help" },
          { href: "/ai-assist", label: "AI Assist" },
        ],
      },
      {
        href: "/education-documents",
        label: "IEP & docs",
        children: [
          { href: "/goals", label: "Goals" },
          { href: "/meetings", label: "Meetings" },
          { href: "/deadlines", label: "Deadlines" },
          { href: "/reports", label: "Reports" },
          { href: "/parent-share", label: "Ready for families" },
        ],
      },
    ],
  },
  {
    label: "Setup",
    items: [
      {
        href: "/admin",
        label: "Admin",
        children: [
          { href: "/staff", label: "Staff" },
          { href: "/schools", label: "Schools" },
          { href: "/classrooms", label: "Classrooms" },
          { href: "/programs", label: "Programs" },
          { href: "/organization/settings", label: "Organization" },
          { href: "/billing", label: "Billing" },
          { href: "/administrative-intelligence", label: "Admin intel" },
        ],
      },
    ],
  },
];

function flattenNavItems(items: PlatformNavItem[]): PlatformNavItem[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenNavItems(item.children) : [])]);
}

/** Flat list derived from groups (sitemap / legacy consumers). */
export const PLATFORM_NAV = PLATFORM_NAV_GROUPS.flatMap((group) => flattenNavItems(group.items));
