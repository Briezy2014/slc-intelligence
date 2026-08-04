export type StudentHubLink = {
  href: string;
  label: string;
  description: string;
};

/** Per-student links into every day-to-day data area. */
export function studentDataHubLinks(studentId: string): StudentHubLink[] {
  const base = `/students/${studentId}`;
  return [
    {
      href: `${base}/overview`,
      label: "Profile & hub",
      description: "Student ID, grade, optional DOB/address, classroom & team.",
    },
    {
      href: `${base}/behavior`,
      label: "Behavior",
      description: "Observations, definitions, and behavior notes.",
    },
    {
      href: `${base}/progress`,
      label: "Progress",
      description: "Goal progress sessions and rapid entry.",
    },
    {
      href: `${base}/goals`,
      label: "Goals & IEP",
      description: "IEP goals, cycles, and goal work.",
    },
    {
      href: `${base}/family-communication`,
      label: "Family communication",
      description: "Contacts, templates, and home messages.",
    },
    {
      href: `${base}/services`,
      label: "Services / providers",
      description: "OT, PT, APE, speech, and delivery logs.",
    },
    {
      href: `${base}/accommodations`,
      label: "Accommodations",
      description: "Assigned supports and what was used.",
    },
    {
      href: `${base}/interventions`,
      label: "Interventions",
      description: "What we tried, dosage, and fidelity.",
    },
    {
      href: `${base}/executive-function`,
      label: "Executive function",
      description: "EF observations, checklists, and plans.",
    },
    {
      href: `${base}/meetings`,
      label: "Meetings",
      description: "Meeting notes and acknowledgements.",
    },
    {
      href: `${base}/reports`,
      label: "Progress reports",
      description: "Draft and finalize progress reports.",
    },
    {
      href: `${base}/analytics`,
      label: "Analytics",
      description: "Student-level charts and summaries.",
    },
  ];
}
