import type { InterventionTemplate } from "@/lib/catalogs/types";

function item(
  id: string,
  name: string,
  category: string,
  description: string,
  evidenceLevel: InterventionTemplate["evidenceLevel"] = "promising",
): InterventionTemplate {
  return { id, name, category, description, evidenceLevel };
}

const literacyNames = [
  "Explicit phonics drill",
  "Decodable text fluency practice",
  "Repeated reading protocol",
  "Word study sorts",
  "Phoneme segmentation practice",
  "Blending board routines",
  "High-frequency word incremental rehearsal",
  "Partner reading with error correction",
  "Comprehension strategy bookmarks",
  "Graphic organizer retell",
  "Main idea sentence frames",
  "Close reading annotation routine",
];

const mathNames = [
  "Concrete-representational-abstract sequence",
  "Number talk warm-ups",
  "Fact fluency incremental rehearsal",
  "Schema-based word problem instruction",
  "Place value bundling routine",
  "Manipulative-supported computation",
  "Error analysis conferences",
  "Math vocabulary card practice",
  "Fluency sprint with corrective feedback",
  "Visual model fraction comparison",
];

const behaviorNames = [
  "Check-in / check-out",
  "Differential reinforcement of alternative behavior",
  "Function-based replacement skill teaching",
  "Precorrection before transitions",
  "Self-monitoring checklist",
  "Break card protocol",
  "Behavior momentum start sequence",
  "Token economy with clear criteria",
  "Calm-down corner coaching",
  "Peer-mediated social practice",
  "Restorative conversation script",
  "Opportunity delays with waiting visuals",
];

const communicationNames = [
  "Requesting routine with AAC",
  "Scripted conversation practice",
  "Choice board communication trials",
  "Expanding utterance modeling",
  "Social narrative rehearsal",
  "Video modeling for greetings",
  "Role-play with feedback",
  "Visual schedule language prompts",
];

const executiveNames = [
  "Task initiation countdown",
  "Work system with finished box",
  "Planner check routine",
  "Two-minute start commitment",
  "Materials readiness checklist",
  "Time Timer work intervals",
  "End-of-period pack-up protocol",
  "Priority list with adult coaching",
];

function expand(
  prefix: string,
  category: string,
  names: string[],
  descriptionFor: (name: string) => string,
  evidenceLevel: InterventionTemplate["evidenceLevel"] = "promising",
): InterventionTemplate[] {
  return names.map((name, index) =>
    item(`${prefix}-${index + 1}`, name, category, descriptionFor(name), evidenceLevel),
  );
}

export const INTERVENTION_TEMPLATES: InterventionTemplate[] = [
  ...expand(
    "literacy",
    "Literacy",
    literacyNames,
    (name) =>
      `${name}: structured, brief instructional trials with modeling, guided practice, corrective feedback, and progress probes.`,
    "evidence_based",
  ),
  ...expand(
    "math",
    "Mathematics",
    mathNames,
    (name) =>
      `${name}: targeted math intervention with explicit modeling, scaffolded practice, and frequent checks for understanding.`,
    "evidence_based",
  ),
  ...expand(
    "behavior",
    "Behavior support",
    behaviorNames,
    (name) =>
      `${name}: teach and reinforce a replacement skill aligned to the hypothesized function of behavior, with fidelity checks.`,
  ),
  ...expand(
    "communication",
    "Communication",
    communicationNames,
    (name) =>
      `${name}: distributed practice opportunities across settings with prompting hierarchy and data on independent use.`,
  ),
  ...expand(
    "ef",
    "Executive function",
    executiveNames,
    (name) =>
      `${name}: environmental and instructional supports that increase initiation, organization, and task completion.`,
  ),
  item(
    "custom-intervention",
    "Custom intervention (team-defined)",
    "Custom",
    "Use this starter when the team designs a local practice intervention with clear procedures, dosage, and progress measures.",
    "local_practice",
  ),
];

export function getInterventionTemplate(id: string): InterventionTemplate | undefined {
  return INTERVENTION_TEMPLATES.find((template) => template.id === id);
}
