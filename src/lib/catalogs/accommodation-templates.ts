import type { AccommodationTemplate } from "@/lib/catalogs/types";

function item(
  id: string,
  name: string,
  accommodationArea: string,
  description: string,
  defaultImplementationNotes: string,
): AccommodationTemplate {
  return { id, name, accommodationArea, description, defaultImplementationNotes };
}

const presentation = [
  ["Read-aloud of directions", "Adult or text-to-speech reads directions before independent work."],
  ["Chunked directions", "Directions are broken into numbered steps on the student copy."],
  ["Highlighted key words", "Key action words are highlighted before the student begins."],
  ["Enlarged print materials", "Student materials are provided in enlarged print."],
  ["Visual supports on worksheet", "Icons or color cues mark each section of the task."],
  ["Audio version of text", "Student accesses an audio version while following along in print."],
  [
    "Simplified language directions",
    "Directions are rewritten in concise, student-friendly language.",
  ],
  ["Preview of vocabulary", "Critical vocabulary is previewed before a reading or lesson."],
];

const response = [
  ["Scribe for written responses", "Adult records student responses for designated tasks."],
  ["Speech-to-text", "Student dictates responses using approved speech-to-text tools."],
  ["Oral response option", "Student may respond orally when writing is not the measured skill."],
  ["Word processor for writing", "Student completes written products on a word processor."],
  ["Answer on test booklet", "Student marks answers directly in the test booklet."],
  [
    "Graphic organizer for writing",
    "Student plans responses with a graphic organizer before drafting.",
  ],
  [
    "Reduced written output",
    "Student completes a reduced number of written items that still measure the skill.",
  ],
  [
    "Calculator for calculation",
    "Student uses a calculator when calculation fluency is not the target skill.",
  ],
];

const timing = [
  ["Extended time", "Student receives extended time for designated assignments and assessments."],
  ["Multiple sessions", "Longer tasks are completed across multiple shorter sessions."],
  ["Frequent breaks", "Student accesses scheduled or requested breaks during lengthy tasks."],
  ["Flexible scheduling", "Assessments are scheduled at the student's optimal instructional time."],
  ["Reduced-length sessions", "Work periods are shortened with clear restart points."],
];

const setting = [
  ["Small-group setting", "Student completes designated work in a small-group environment."],
  [
    "Preferential seating",
    "Student is seated to reduce distractions and increase access to instruction.",
  ],
  ["Separate quiet space", "Student may complete assessments in a quiet separate location."],
  [
    "Proximity to instruction",
    "Student is positioned near the point of instruction for redirection.",
  ],
  ["Reduced visual clutter workspace", "Student workspace is cleared of nonessential materials."],
];

const scheduling = [
  ["Visual schedule", "Student follows a visual schedule for transitions and daily routines."],
  [
    "Advance notice of changes",
    "Student receives advance notice before schedule or routine changes.",
  ],
  ["First-then board", "Student uses a first-then board for nonpreferred to preferred sequences."],
  ["Transition warnings", "Student receives countdown warnings before transitions."],
  [
    "Check-in before independent work",
    "Adult checks understanding before independent work begins.",
  ],
];

const behavioral = [
  ["Break card", "Student may request a break with a break card according to the plan."],
  ["Calm-down tools", "Student accesses approved calm-down tools when dysregulated."],
  ["Clear behavior expectations posted", "Expectations are posted and reviewed before activities."],
  ["Positive reinforcement plan", "Student earns agreed reinforcement for target behaviors."],
  ["Self-monitoring sheet", "Student rates on-task behavior with adult review."],
];

function expand(prefix: string, area: string, rows: string[][]): AccommodationTemplate[] {
  return rows.map(([name, description], index) =>
    item(
      `${prefix}-${index + 1}`,
      name,
      area,
      description,
      `Document when used, who provides it, and any student-specific variations. Do not treat this accommodation as a grading modification unless the IEP team has authorized a modification.`,
    ),
  );
}

export const ACCOMMODATION_TEMPLATES: AccommodationTemplate[] = [
  ...expand("presentation", "Presentation", presentation),
  ...expand("response", "Response", response),
  ...expand("timing", "Timing / scheduling", timing),
  ...expand("setting", "Setting", setting),
  ...expand("routine", "Routine supports", scheduling),
  ...expand("behavior", "Behavioral access", behavioral),
  item(
    "custom-accommodation",
    "Custom accommodation (team-defined)",
    "Custom",
    "Use when the IEP team defines an accommodation not listed in the starter library.",
    "Describe the exact conditions, materials, staff actions, and how implementation will be monitored.",
  ),
];

export function getAccommodationTemplate(id: string): AccommodationTemplate | undefined {
  return ACCOMMODATION_TEMPLATES.find((template) => template.id === id);
}
