export type MeasurementTypeCode =
  | "percentage"
  | "frequency"
  | "rate"
  | "duration"
  | "latency"
  | "rubric"
  | "prompt_level"
  | "task_analysis"
  | "reading_fluency"
  | "reading_accuracy"
  | "independence"
  | "custom_numeric";

export type GoalTemplate = {
  id: string;
  area: string;
  statement: string;
  measurementType: MeasurementTypeCode;
  targetDirection: "increase" | "decrease";
  targetValue: number | null;
  tags: string[];
};

export type InterventionTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  evidenceLevel: "evidence_based" | "promising" | "emerging" | "local_practice" | "other";
};

export type AccommodationTemplate = {
  id: string;
  name: string;
  accommodationArea: string;
  description: string;
  defaultImplementationNotes: string;
};

export type EfSkillTemplate = {
  id: string;
  name: string;
  description: string;
};

export type CommunicationTemplateCategory =
  | "Progress & celebration"
  | "Meetings & IEP"
  | "Behavior & safety"
  | "Attendance & transportation"
  | "Services & supports"
  | "Home partnership"
  | "Internal staff";

export type CommunicationTemplateCatalogItem = {
  id: string;
  name: string;
  category: CommunicationTemplateCategory;
  defaultVisibility: "family_visible" | "internal" | "restricted_admin";
  method: "phone" | "email" | "text" | "letter" | "in_person" | "portal" | "video" | "other";
  subjectTemplate: string;
  bodyTemplate: string;
};
