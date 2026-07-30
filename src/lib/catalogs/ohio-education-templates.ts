import type { EducationDocumentTemplate } from "@/lib/catalogs/education-document-templates";

/**
 * Ohio-aligned structured blank drafts for educator/IEP team use.
 * These are NOT official Ohio Department of Education fillable legal forms.
 * Districts remain responsible for using controlling state/district documents and signatures.
 */

export const OHIO_DOCUMENT_DISCLAIMER =
  "Ohio-aligned structured draft for educator/IEP team review only. This is not the official ODE fillable IEP/ETR/progress form and is not a legally controlling record. Use district-approved official forms and authorized signatures for final documentation.";

export const OHIO_IEP_BLANK_TEMPLATE: EducationDocumentTemplate = {
  key: "ohio_iep_aligned_blank_v1",
  documentType: "iep",
  title: "Ohio-aligned blank IEP draft",
  description:
    "Structured sections commonly used in Ohio IEP documentation workflows for classroom drafting and team review.",
  sections: [
    {
      id: "child-info",
      title: "Child / student information",
      fields: [
        { key: "studentName", label: "Student name", kind: "text", prefillFrom: "studentName" },
        {
          key: "localId",
          label: "Student ID / local identifier",
          kind: "text",
          prefillFrom: "localId",
        },
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
        { key: "districtBuilding", label: "District / building", kind: "text" },
        {
          key: "meetingType",
          label: "IEP meeting type",
          kind: "select",
          options: [
            "Initial",
            "Annual review",
            "Review/revision",
            "Amendment",
            "Manifestation",
            "Other",
          ],
        },
        { key: "meetingDate", label: "Meeting date", kind: "date" },
      ],
    },
    {
      id: "future-planning",
      title: "Future planning / parent concerns",
      fields: [
        {
          key: "parentConcerns",
          label: "Parent/guardian concerns for enhancing education",
          kind: "textarea",
        },
        {
          key: "studentStrengthsInterests",
          label: "Student strengths / interests",
          kind: "textarea",
        },
        { key: "futurePlanning", label: "Future planning discussion notes", kind: "textarea" },
      ],
    },
    {
      id: "plaafp",
      title: "Present levels of academic achievement and functional performance",
      fields: [
        { key: "academicPresentLevels", label: "Academic present levels", kind: "textarea" },
        {
          key: "functionalPresentLevels",
          label: "Functional / behavioral present levels",
          kind: "textarea",
        },
        {
          key: "howDisabilityAffects",
          label: "How disability affects involvement and progress",
          kind: "textarea",
        },
        { key: "baselineData", label: "Baseline data / recent progress summary", kind: "textarea" },
      ],
    },
    {
      id: "goals",
      title: "Measurable annual goals",
      fields: [
        { key: "goalSummary", label: "Annual goals summary", kind: "textarea" },
        { key: "objectivesBenchmarks", label: "Objectives / benchmarks", kind: "textarea" },
        {
          key: "progressMonitoringPlan",
          label: "Method / schedule for measuring progress",
          kind: "textarea",
        },
        {
          key: "progressReportingMethod",
          label: "Progress reporting to parents",
          kind: "select",
          options: [
            "Quarterly",
            "Trimester",
            "Concurrent with report cards",
            "Other district schedule",
          ],
        },
      ],
    },
    {
      id: "services",
      title: "Specially designed instruction / related services / supports",
      fields: [
        {
          key: "speciallyDesignedInstruction",
          label: "Specially designed instruction",
          kind: "textarea",
        },
        { key: "relatedServices", label: "Related services", kind: "textarea" },
        { key: "accommodations", label: "Accommodations / modifications", kind: "textarea" },
        {
          key: "supportsForSchoolPersonnel",
          label: "Supports for school personnel",
          kind: "textarea",
        },
      ],
    },
    {
      id: "lre-assessment",
      title: "LRE / statewide assessment",
      fields: [
        {
          key: "lreExplanation",
          label: "Least restrictive environment explanation",
          kind: "textarea",
        },
        { key: "placementDescription", label: "Placement / setting description", kind: "textarea" },
        {
          key: "statewideAssessment",
          label: "Statewide assessment participation",
          kind: "select",
          options: [
            "Standard assessment with accommodations",
            "Alternate assessment (as determined by IEP team)",
            "To be determined by IEP team",
            "Documented on official district form",
          ],
        },
        { key: "assessmentAccommodations", label: "Assessment accommodations", kind: "textarea" },
      ],
    },
    {
      id: "transition",
      title: "Secondary transition (as applicable)",
      fields: [
        { key: "transitionAssessments", label: "Transition assessment summary", kind: "textarea" },
        { key: "postsecondaryGoals", label: "Postsecondary goals", kind: "textarea" },
        { key: "transitionServices", label: "Transition services / activities", kind: "textarea" },
      ],
    },
  ],
};

export const OHIO_ETR_BLANK_TEMPLATE: EducationDocumentTemplate = {
  key: "ohio_etr_aligned_blank_v1",
  documentType: "etr",
  title: "Ohio-aligned blank ETR draft",
  description:
    "Structured Evaluation Team Report style sections for Ohio evaluation planning and team drafting.",
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
        {
          key: "evaluationType",
          label: "Evaluation type",
          kind: "select",
          options: ["Initial evaluation", "Reevaluation", "Other"],
        },
        {
          key: "referralReason",
          label: "Reason for referral / suspected disability concern",
          kind: "textarea",
        },
        {
          key: "interventionsTried",
          label: "Interventions / supports already tried",
          kind: "textarea",
        },
      ],
    },
    {
      id: "planning",
      title: "Planning information",
      fields: [
        { key: "parentInput", label: "Parent/guardian input", kind: "textarea" },
        { key: "existingDataSummary", label: "Summary of existing data", kind: "textarea" },
        { key: "assessmentPlan", label: "Additional assessments planned", kind: "textarea" },
      ],
    },
    {
      id: "assessment-results",
      title: "Assessment results summary",
      fields: [
        { key: "assessmentTools", label: "Assessment tools / data sources", kind: "textarea" },
        { key: "academicFindings", label: "Academic findings", kind: "textarea" },
        {
          key: "functionalFindings",
          label: "Functional / adaptive / behavior findings",
          kind: "textarea",
        },
        { key: "communicationFindings", label: "Communication findings", kind: "textarea" },
        { key: "teamSummary", label: "Team summary of educational needs", kind: "textarea" },
      ],
    },
    {
      id: "eligibility",
      title: "Team determination notes (draft only)",
      fields: [
        {
          key: "eligibilityStatus",
          label: "Eligibility status (team decision only)",
          kind: "select",
          options: [
            "Not determined in this draft",
            "Team to convene",
            "Documented on official ETR outside this draft",
          ],
        },
        { key: "nextSteps", label: "Recommended next steps for team discussion", kind: "textarea" },
      ],
    },
  ],
};

export const OHIO_PROGRESS_REPORT_TEMPLATE: EducationDocumentTemplate = {
  key: "ohio_progress_report_aligned_v1",
  documentType: "progress_report",
  title: "Ohio-aligned progress report draft",
  description:
    "Structured progress-report language for periodic reporting to families and IEP teams in Ohio classrooms.",
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
        { key: "caseManager", label: "Intervention specialist / case manager", kind: "text" },
      ],
    },
    {
      id: "progress",
      title: "Goal progress",
      fields: [
        { key: "goalProgressSummary", label: "Goal progress summary", kind: "textarea" },
        {
          key: "supportsUsed",
          label: "Supports / specially designed instruction used",
          kind: "textarea",
        },
        {
          key: "overallDescriptor",
          label: "Overall progress descriptor",
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
        { key: "nextInstructionalFocus", label: "Next instructional focus", kind: "textarea" },
        { key: "familyNextSteps", label: "Family collaboration / next steps", kind: "textarea" },
      ],
    },
  ],
};
