export const PILOT_DEIDENTIFIED_USE_TITLE = "Pilot de-identified use rules";

export const PILOT_DEIDENTIFIED_USE_SUMMARY =
  "For now we are only using SLC Intelligence with coded / de-identified practice data. Do not enter student names or other information that could identify a student. Use classroom codes such as S1, S2, S3, and keep any code-to-name key outside this system.";

export const PILOT_CAN_USE_FOR = [
  "Practice collecting classroom data",
  "Behavior tracking using student codes (example: S1, S2, S3)",
  "Goal and objective practice",
  "Data collection on prompts, independence, accuracy, and participation",
  "ABC behavior observations using student codes",
  "Daily notes using non-identifying information",
  "Task analysis and skill progression",
  "AI lesson ideas and instructional supports (coded or sample context only)",
  "Classroom planning",
  "Visual schedules and activity planning",
  "Practicing reports using sample or coded data",
  "Practicing structured draft forms with fictional / sample content only",
] as const;

export const PILOT_CANNOT_ENTER = [
  "Student names or initials",
  "Birthdates",
  "Real student ID / SIS numbers (use classroom codes like S1 instead)",
  "Real IEPs or Evaluation Team Reports (ETRs), including uploads or scans of those documents",
  "Medical information tied to a real student",
  "Parent/guardian names or contact information",
  "Addresses",
  "Photos of students",
  "Any document containing personally identifiable student information (PII)",
  "Free-text details that would let someone outside the classroom identify the student",
  "Real family communication content that names a student or family member",
] as const;

export const PILOT_AFTER_APPROVAL =
  "Once the district has reviewed SLC Intelligence and, if appropriate, approves its use, we will follow whatever procedures are required before using any identifiable student information. Until then, we keep everything coded / de-identified and use the platform as a classroom productivity and planning tool.";
