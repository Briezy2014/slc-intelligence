/** Starter related-service types for OT / PT / Speech / APE and similar. */

export type ServiceTemplate = {
  id: string;
  name: string;
  serviceArea: string;
  description: string;
  defaultDeliveryType: "push_in" | "pull_out" | "consultation" | "individual" | "group" | "other";
  exampleGoals: string[];
};

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    id: "ot",
    name: "Occupational Therapy (OT)",
    serviceArea: "OT",
    description: "Fine motor, sensory regulation, and school-based occupational therapy supports.",
    defaultDeliveryType: "pull_out",
    exampleGoals: [
      "Improve grasp and writing endurance for classroom tasks",
      "Use sensory strategies to stay regulated during instruction",
    ],
  },
  {
    id: "pt",
    name: "Physical Therapy (PT)",
    serviceArea: "PT",
    description: "Gross motor, mobility, and school-based physical therapy supports.",
    defaultDeliveryType: "pull_out",
    exampleGoals: [
      "Navigate school environments safely with less adult support",
      "Improve balance and strength for playground and PE access",
    ],
  },
  {
    id: "speech",
    name: "Speech-Language Therapy",
    serviceArea: "Speech",
    description: "Articulation, language, social communication, and AAC supports.",
    defaultDeliveryType: "pull_out",
    exampleGoals: [
      "Increase intelligible speech in classroom conversations",
      "Use expected language to request help and materials",
    ],
  },
  {
    id: "ape",
    name: "Adapted Physical Education (APE)",
    serviceArea: "APE",
    description: "Adapted PE and motor participation supports in physical education settings.",
    defaultDeliveryType: "push_in",
    exampleGoals: [
      "Participate in PE routines with modified equipment",
      "Follow motor directions with visual and peer supports",
    ],
  },
  {
    id: "counseling",
    name: "Counseling / Social Work",
    serviceArea: "Counseling",
    description: "School counseling or social-work supports for coping, regulation, and access.",
    defaultDeliveryType: "individual",
    exampleGoals: [
      "Use a calm-down routine when frustrated",
      "Identify feelings and ask for help with adult support",
    ],
  },
  {
    id: "vision",
    name: "Vision services",
    serviceArea: "Vision",
    description: "Vision supports for access to print, materials, and classroom environments.",
    defaultDeliveryType: "consultation",
    exampleGoals: ["Access classroom materials with preferred visual accommodations"],
  },
  {
    id: "hearing",
    name: "Hearing / Audiology services",
    serviceArea: "Hearing",
    description: "Hearing supports for access to instruction and communication.",
    defaultDeliveryType: "consultation",
    exampleGoals: ["Access instruction with hearing technology and preferential seating"],
  },
  {
    id: "om",
    name: "Orientation & Mobility",
    serviceArea: "O&M",
    description: "Safe travel and orientation supports in school environments.",
    defaultDeliveryType: "individual",
    exampleGoals: ["Travel familiar school routes with decreasing prompts"],
  },
  {
    id: "nursing",
    name: "School nursing",
    serviceArea: "Nursing",
    description: "Health and nursing supports needed for school access.",
    defaultDeliveryType: "other",
    exampleGoals: ["Follow health care plan supports during the school day"],
  },
  {
    id: "other",
    name: "Other related service",
    serviceArea: "Other",
    description: "Other related service as defined by the IEP team.",
    defaultDeliveryType: "other",
    exampleGoals: ["Participate in the related service as written in the IEP"],
  },
];

export function getServiceTemplate(id: string): ServiceTemplate | null {
  return SERVICE_TEMPLATES.find((item) => item.id === id) ?? null;
}
