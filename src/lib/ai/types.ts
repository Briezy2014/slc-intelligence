export type AiAssistDomain =
  | "communication"
  | "accommodation"
  | "intervention"
  | "goal"
  | "executive_function"
  | "progress"
  | "education_document"
  | "behavior";

export type AiSuggestion = {
  id: string;
  domain: AiAssistDomain;
  title: string;
  summary: string;
  draftText: string;
  fields?: Record<string, string>;
  rationale: string;
  source: "local_intelligence" | "model_assist";
  requiresReview: true;
};

export type AiSuggestInput = {
  domain: AiAssistDomain;
  focusArea?: string;
  studentContext?: string;
  extraNotes?: string;
};

export type AiSuggestResult = {
  enabled: boolean;
  mode: "disabled" | "local_intelligence" | "model_assist";
  disclaimer: string;
  suggestions: AiSuggestion[];
  message?: string;
};
