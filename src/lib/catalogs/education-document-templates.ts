import type { EducationDocumentType } from "@/lib/supabase/types";
import {
  OHIO_DOCUMENT_DISCLAIMER,
  OHIO_ETR_BLANK_TEMPLATE,
  OHIO_IEP_BLANK_TEMPLATE,
  OHIO_PROGRESS_REPORT_TEMPLATE,
} from "@/lib/catalogs/ohio-education-templates";

export type DocumentFieldDef = {
  key: string;
  label: string;
  kind: "text" | "textarea" | "select" | "date";
  options?: string[];
  prefillFrom?: "studentName" | "gradeLevel" | "schoolYear" | "localId";
};

export type EducationDocumentTemplate = {
  key: string;
  documentType: EducationDocumentType;
  title: string;
  description: string;
  sections: Array<{
    id: string;
    title: string;
    fields: DocumentFieldDef[];
  }>;
};

export const EDUCATION_DOCUMENT_DISCLAIMER =
  "Draft for educator/IEP team review only. This tool assists documentation; it does not independently create a legally controlling IEP, ETR, or progress report. District procedures and authorized signatures remain required.";

export { OHIO_DOCUMENT_DISCLAIMER };

export const IEP_BLANK_TEMPLATE: EducationDocumentTemplate = {
  key: "iep_blank_v1",
  documentType: "iep",
  title: "Blank IEP draft",
  description:
    "Structured IEP draft with dropdown-ready sections. Prefills student identity fields when available.",
  sections: [
    {
      id: "cover",
      title: "Student / meeting information",
      fields: [
        { key: "studentName", label: "Student name", kind: "text", prefillFrom: "studentName" },
        { key: "localId", label: "Student ID", kind: "text", prefillFrom: "localId" },
        {
          key: "gradeLevel",
          label: "Grade level",
          kind: "select",
          options: [
            "PreK",
            "K",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "Transition",
          ],
          prefillFrom: "gradeLevel",
        },
        { key: "schoolYear", label: "School year", kind: "text", prefillFrom: "schoolYear" },
        {
          key: "meetingType",
          label: "Meeting type",
          kind: "select",
          options: ["Initial", "Annual review", "Amendment", "Manifestation", "Other"],
        },
        { key: "meetingDate", label: "Meeting date", kind: "date" },
      ],
    },
    {
      id: "plaafp",
      title: "Present levels (PLAAFP)",
      fields: [
        { key: "strengths", label: "Strengths", kind: "textarea" },
        { key: "needs", label: "Needs", kind: "textarea" },
        { key: "parentInput", label: "Parent/guardian input", kind: "textarea" },
        {
          key: "howDisabilityAffects",
          label: "How disability affects involvement/progress",
          kind: "textarea",
        },
      ],
    },
    {
      id: "goals",
      title: "Goals / objectives summary",
      fields: [
        { key: "goalSummary", label: "Annual goals summary", kind: "textarea" },
        { key: "progressMonitoringPlan", label: "Progress monitoring plan", kind: "textarea" },
      ],
    },
    {
      id: "services",
      title: "Services / least restrictive environment",
      fields: [
        {
          key: "speciallyDesignedInstruction",
          label: "Specially designed instruction",
          kind: "textarea",
        },
        { key: "relatedServices", label: "Related services", kind: "textarea" },
        { key: "accommodations", label: "Accommodations / modifications", kind: "textarea" },
        { key: "placement", label: "Placement / LRE description", kind: "textarea" },
      ],
    },
  ],
};

export const ETR_BLANK_TEMPLATE: EducationDocumentTemplate = {
  key: "etr_blank_v1",
  documentType: "etr",
  title: "Blank ETR draft",
  description:
    "Evaluation Team Report style draft sections with dropdown fields for team planning.",
  sections: [
    {
      id: "referral",
      title: "Referral / background",
      fields: [
        { key: "studentName", label: "Student name", kind: "text", prefillFrom: "studentName" },
        {
          key: "gradeLevel",
          label: "Grade level",
          kind: "select",
          options: [
            "PreK",
            "K",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "Transition",
          ],
          prefillFrom: "gradeLevel",
        },
        { key: "referralReason", label: "Reason for referral", kind: "textarea" },
        {
          key: "evaluationType",
          label: "Evaluation type",
          kind: "select",
          options: ["Initial", "Reevaluation", "Other"],
        },
      ],
    },
    {
      id: "assessments",
      title: "Assessment summary",
      fields: [
        { key: "assessmentTools", label: "Assessment tools / data sources", kind: "textarea" },
        { key: "academicFindings", label: "Academic findings", kind: "textarea" },
        { key: "functionalFindings", label: "Functional / adaptive findings", kind: "textarea" },
        {
          key: "communicationFindings",
          label: "Communication findings (include ASL modality notes when applicable)",
          kind: "textarea",
        },
      ],
    },
    {
      id: "eligibility",
      title: "Team considerations",
      fields: [
        { key: "teamSummary", label: "Team summary of educational needs", kind: "textarea" },
        { key: "nextSteps", label: "Recommended next steps for team discussion", kind: "textarea" },
        {
          key: "eligibilityStatus",
          label: "Eligibility status (team decision only)",
          kind: "select",
          options: [
            "Not determined in this draft",
            "Team to convene",
            "Documented outside this draft",
          ],
        },
      ],
    },
  ],
};

export const PROGRESS_REPORT_TEMPLATE: EducationDocumentTemplate = {
  key: "progress_report_packet_v1",
  documentType: "progress_report",
  title: "Progress report packet draft",
  description:
    "Structured progress report language for team review. Not a final legal determination.",
  sections: [
    {
      id: "header",
      title: "Report header",
      fields: [
        { key: "studentName", label: "Student name", kind: "text", prefillFrom: "studentName" },
        {
          key: "gradeLevel",
          label: "Grade level",
          kind: "select",
          options: [
            "PreK",
            "K",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "Transition",
          ],
          prefillFrom: "gradeLevel",
        },
        { key: "reportingPeriod", label: "Reporting period", kind: "text" },
        { key: "reportDate", label: "Report date", kind: "date" },
      ],
    },
    {
      id: "progress",
      title: "Progress narrative",
      fields: [
        { key: "goalProgressSummary", label: "Goal progress summary", kind: "textarea" },
        { key: "supportsUsed", label: "Supports / interventions used", kind: "textarea" },
        {
          key: "nextInstructionalFocus",
          label: "Next instructional focus / learning progression",
          kind: "textarea",
        },
        {
          key: "overallDescriptor",
          label: "Overall descriptor",
          kind: "select",
          options: [
            "Exceeding",
            "Met",
            "Progressing",
            "Limited progress",
            "Not introduced",
            "Insufficient data",
          ],
        },
      ],
    },
  ],
};

export const SECTION_504_BLANK_TEMPLATE: EducationDocumentTemplate = {
  key: "section_504_blank_v1",
  documentType: "section_504",
  title: "Section 504 plan draft",
  description:
    "Assistive 504 draft sections for team review. Not a controlling district 504 record.",
  sections: [
    {
      id: "cover",
      title: "Student / plan information",
      fields: [
        { key: "studentName", label: "Student name", kind: "text", prefillFrom: "studentName" },
        { key: "localId", label: "Student ID", kind: "text", prefillFrom: "localId" },
        {
          key: "gradeLevel",
          label: "Grade level",
          kind: "select",
          options: [
            "PreK",
            "K",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "Transition",
          ],
          prefillFrom: "gradeLevel",
        },
        { key: "meetingDate", label: "Meeting / review date", kind: "date" },
      ],
    },
    {
      id: "impairment",
      title: "Impairment / major life activities",
      fields: [
        { key: "impairmentSummary", label: "Impairment summary (team language)", kind: "textarea" },
        { key: "majorLifeActivities", label: "Major life activities affected", kind: "textarea" },
        { key: "supportingData", label: "Supporting data / sources", kind: "textarea" },
      ],
    },
    {
      id: "accommodations",
      title: "Accommodations / services",
      fields: [
        { key: "accommodations", label: "Accommodations", kind: "textarea" },
        { key: "relatedAidsServices", label: "Related aids / services", kind: "textarea" },
        { key: "implementationNotes", label: "Implementation notes", kind: "textarea" },
      ],
    },
  ],
};

export const GIFTED_BLANK_TEMPLATE: EducationDocumentTemplate = {
  key: "gifted_blank_v1",
  documentType: "gifted",
  title: "Gifted services draft",
  description: "Draft gifted identification/services notes for team review.",
  sections: [
    {
      id: "cover",
      title: "Student information",
      fields: [
        { key: "studentName", label: "Student name", kind: "text", prefillFrom: "studentName" },
        {
          key: "gradeLevel",
          label: "Grade level",
          kind: "select",
          options: [
            "PreK",
            "K",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "Transition",
          ],
          prefillFrom: "gradeLevel",
        },
        {
          key: "identificationArea",
          label: "Identification area",
          kind: "select",
          options: [
            "Superior cognitive",
            "Specific academic",
            "Creative thinking",
            "Visual/performing arts",
            "Other / district-defined",
          ],
        },
      ],
    },
    {
      id: "services",
      title: "Services / goals",
      fields: [
        { key: "strengths", label: "Strengths / gifted characteristics", kind: "textarea" },
        { key: "serviceSummary", label: "Service / acceleration summary", kind: "textarea" },
        { key: "goalSummary", label: "Goals / outcomes", kind: "textarea" },
        { key: "progressMonitoringPlan", label: "Progress monitoring plan", kind: "textarea" },
      ],
    },
  ],
};

export const EL_BLANK_TEMPLATE: EducationDocumentTemplate = {
  key: "el_blank_v1",
  documentType: "el",
  title: "English learner (EL) support draft",
  description: "EL language support planning draft for educator/team review.",
  sections: [
    {
      id: "cover",
      title: "Student / language information",
      fields: [
        { key: "studentName", label: "Student name", kind: "text", prefillFrom: "studentName" },
        {
          key: "gradeLevel",
          label: "Grade level",
          kind: "select",
          options: [
            "PreK",
            "K",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "Transition",
          ],
          prefillFrom: "gradeLevel",
        },
        { key: "homeLanguage", label: "Home / primary language", kind: "text" },
        {
          key: "proficiencyLevel",
          label: "Language proficiency level (district scale)",
          kind: "select",
          options: [
            "Entering",
            "Emerging",
            "Developing",
            "Expanding",
            "Bridging",
            "Reaching",
            "Not assessed",
          ],
        },
      ],
    },
    {
      id: "supports",
      title: "Instructional supports",
      fields: [
        { key: "languageGoals", label: "Language goals", kind: "textarea" },
        { key: "accommodations", label: "Classroom / assessment supports", kind: "textarea" },
        {
          key: "familyCommunicationPlan",
          label: "Family communication language plan",
          kind: "textarea",
        },
        { key: "progressMonitoringPlan", label: "Progress monitoring plan", kind: "textarea" },
      ],
    },
  ],
};

export type EducationTemplatePack = "ohio_aligned" | "generic";

export function listEducationDocumentTemplates(
  documentType: EducationDocumentType,
): EducationDocumentTemplate[] {
  if (documentType === "etr") return [OHIO_ETR_BLANK_TEMPLATE, ETR_BLANK_TEMPLATE];
  if (documentType === "progress_report")
    return [OHIO_PROGRESS_REPORT_TEMPLATE, PROGRESS_REPORT_TEMPLATE];
  if (documentType === "section_504") return [SECTION_504_BLANK_TEMPLATE];
  if (documentType === "gifted") return [GIFTED_BLANK_TEMPLATE];
  if (documentType === "el") return [EL_BLANK_TEMPLATE];
  return [OHIO_IEP_BLANK_TEMPLATE, IEP_BLANK_TEMPLATE];
}

export function getEducationDocumentTemplate(
  documentType: EducationDocumentType,
  pack: EducationTemplatePack = "ohio_aligned",
): EducationDocumentTemplate {
  const templates = listEducationDocumentTemplates(documentType);
  if (documentType === "section_504" || documentType === "gifted" || documentType === "el") {
    return templates[0]!;
  }
  if (pack === "generic") {
    return templates.find((template) => !template.key.startsWith("ohio_")) ?? templates[0]!;
  }
  return templates.find((template) => template.key.startsWith("ohio_")) ?? templates[0]!;
}

export function getEducationDocumentTemplateByKey(
  key: string,
  documentType: EducationDocumentType,
): EducationDocumentTemplate {
  return (
    listEducationDocumentTemplates(documentType).find((template) => template.key === key) ??
    getEducationDocumentTemplate(documentType)
  );
}

export function buildPrefillFields(args: {
  template: EducationDocumentTemplate;
  studentName?: string;
  gradeLevel?: string | null;
  localId?: string | null;
  schoolYear?: string;
}): Record<string, string> {
  const values: Record<string, string> = {};
  for (const section of args.template.sections) {
    for (const field of section.fields) {
      if (field.prefillFrom === "studentName" && args.studentName)
        values[field.key] = args.studentName;
      if (field.prefillFrom === "gradeLevel" && args.gradeLevel)
        values[field.key] = args.gradeLevel;
      if (field.prefillFrom === "localId" && args.localId) values[field.key] = args.localId;
      if (field.prefillFrom === "schoolYear")
        values[field.key] =
          args.schoolYear ?? `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
    }
  }
  return values;
}
