export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Timestamp = string;
type DateString = string;
type Uuid = string;
type Nullable<T> = T | null;

type RowDefinition<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type OrganizationStatus = "active" | "inactive";
export type RecordStatus = "active" | "inactive" | "archived";
export type MembershipStatus = "active" | "inactive" | "pending";
export type GoalStatus = "active" | "inactive" | "archived" | "mastered_review";
export type ProgressStatus = "draft" | "finalized" | "corrected" | "archived";
export type TargetDirection = "increase" | "decrease";
export type MeasurementType =
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

export type RoleCode =
  | "platform_admin"
  | "organization_admin"
  | "district_sped_admin"
  | "building_admin"
  | "program_admin"
  | "intervention_specialist"
  | "special_education_teacher"
  | "related_service_provider"
  | "school_psychologist"
  | "case_manager"
  | "paraprofessional"
  | "read_only_reviewer";

export type PermissionCode =
  | "org.manage"
  | "org.members.manage"
  | "org.audit.read"
  | "school.manage"
  | "program.manage"
  | "classroom.manage"
  | "staff.assign"
  | "student.create"
  | "student.edit"
  | "student.archive"
  | "student.read"
  | "iep.manage"
  | "goal.manage"
  | "goal.read"
  | "progress.enter"
  | "progress.finalize"
  | "progress.read"
  | "analytics.read"
  | "report.period.manage"
  | "report.draft"
  | "report.review"
  | "report.finalize"
  | "report.read"
  | "report.export"
  | "behavior.define"
  | "behavior.observe"
  | "behavior.finalize"
  | "behavior.read"
  | "behavior.configure"
  | "fba.manage"
  | "fba.read"
  | "intervention.library.manage"
  | "intervention.plan.manage"
  | "intervention.plan.activate"
  | "intervention.fidelity.enter"
  | "intervention.fidelity.finalize"
  | "intervention.dosage.enter"
  | "intervention.review"
  | "intervention.read"
  | "accommodation.library.manage"
  | "accommodation.manage"
  | "accommodation.implement"
  | "accommodation.read"
  | "service.definition.manage"
  | "service.plan.manage"
  | "service.plan.activate"
  | "service.log.enter"
  | "service.log.finalize"
  | "service.read"
  | "service.export"
  | "contact.manage"
  | "contact.read"
  | "communication.enter"
  | "communication.finalize"
  | "communication.read"
  | "communication.template.manage"
  | "communication.internal.read"
  | "meeting.manage"
  | "meeting.finalize"
  | "meeting.read"
  | "meeting.type.manage"
  | "classroom.schedule.manage"
  | "classroom.operations.read"
  | "routine.manage"
  | "task_analysis.manage"
  | "ef.plan.manage"
  | "ef.observe"
  | "ef.read"
  | "checklist.manage"
  | "checklist.respond"
  | "staff.duty.assign"
  | "daily_note.enter"
  | "daily_note.finalize"
  | "daily_note.read"
  | "reinforcement.manage"
  | "announcement.manage"
  | "admin.intelligence.read"
  | "admin.export"
  | "admin.audit.read"
  | "education_document.manage"
  | "education_document.read";

export type Organization = {
  id: Uuid;
  name: string;
  slug: string;
  status: OrganizationStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type OrganizationSubscriptionStatus =
  | "inactive"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

export type OrganizationSubscription = {
  id: Uuid;
  organization_id: Uuid;
  stripe_customer_id: Nullable<string>;
  stripe_subscription_id: Nullable<string>;
  stripe_price_id: Nullable<string>;
  status: OrganizationSubscriptionStatus;
  current_period_start: Nullable<Timestamp>;
  current_period_end: Nullable<Timestamp>;
  cancel_at_period_end: boolean;
  canceled_at: Nullable<Timestamp>;
  latest_invoice_id: Nullable<string>;
  raw_status: Nullable<string>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type OrganizationPrivacySettings = {
  organization_id: Uuid;
  small_group_threshold: number;
  updated_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type AdministrativeExportEvent = {
  id: Uuid;
  organization_id: Uuid;
  exported_by: Nullable<Uuid>;
  export_type: string;
  filters: Json;
  scope_summary: string;
  created_at: Timestamp;
};

export type OrganizationMembership = {
  id: Uuid;
  organization_id: Uuid;
  user_id: Uuid;
  role_code: RoleCode;
  status: MembershipStatus;
  start_date: DateString;
  end_date: Nullable<DateString>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type UserProfile = {
  id: Uuid;
  display_name: string;
  preferred_name: Nullable<string>;
  status: "active" | "inactive";
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type School = {
  id: Uuid;
  organization_id: Uuid;
  name: string;
  school_code: Nullable<string>;
  school_type: "public" | "private" | "charter" | "other";
  status: RecordStatus;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type Program = {
  id: Uuid;
  organization_id: Uuid;
  school_id: Nullable<Uuid>;
  name: string;
  description: Nullable<string>;
  program_type: "specialized_learning" | "related_services" | "inclusion" | "other";
  status: RecordStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type Classroom = {
  id: Uuid;
  organization_id: Uuid;
  school_id: Uuid;
  program_id: Nullable<Uuid>;
  name: string;
  description: Nullable<string>;
  academic_year: Nullable<string>;
  status: RecordStatus;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type Student = {
  id: Uuid;
  organization_id: Uuid;
  first_name: string;
  last_name: string;
  preferred_name: Nullable<string>;
  local_identifier: string;
  grade_level: Nullable<string>;
  enrollment_status: RecordStatus;
  start_date: Nullable<DateString>;
  end_date: Nullable<DateString>;
  has_iep: boolean;
  has_section_504: boolean;
  has_gifted: boolean;
  has_english_learner: boolean;
  home_language: Nullable<string>;
  support_plan_notes: Nullable<string>;
  created_by: Nullable<Uuid>;
  updated_by: Nullable<Uuid>;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type IepCycle = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  label: string;
  start_date: DateString;
  end_date: Nullable<DateString>;
  review_date: Nullable<DateString>;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  updated_by: Nullable<Uuid>;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type IepGoal = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  iep_cycle_id: Uuid;
  goal_area: string;
  goal_statement: string;
  measurement_type: MeasurementType;
  unit_of_measurement: Nullable<string>;
  evaluation_frequency: Nullable<string>;
  target_value: Nullable<number>;
  target_direction: TargetDirection;
  start_date: Nullable<DateString>;
  target_date: Nullable<DateString>;
  status: GoalStatus;
  responsible_user_id: Nullable<Uuid>;
  created_by: Nullable<Uuid>;
  updated_by: Nullable<Uuid>;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ProgressMonitoringSession = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  goal_id: Uuid;
  objective_id: Nullable<Uuid>;
  session_date: DateString;
  collector_user_id: Nullable<Uuid>;
  setting: Nullable<string>;
  activity: Nullable<string>;
  intervention_phase_id: Nullable<Uuid>;
  measurement_type: MeasurementType;
  status: ProgressStatus;
  notes: Nullable<string>;
  finalized_at: Nullable<Timestamp>;
  finalized_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type AuditEvent = {
  id: Uuid;
  organization_id: Nullable<Uuid>;
  actor_user_id: Nullable<Uuid>;
  action_type: string;
  resource_type: string;
  resource_id: Nullable<Uuid>;
  success: boolean;
  previous_state: Nullable<Json>;
  new_state: Nullable<Json>;
  request_context: Json;
  created_at: Timestamp;
};

export type OrganizationInvitation = {
  id: Uuid;
  organization_id: Uuid;
  email: string;
  role_code: RoleCode;
  token_hash: string;
  status: "pending" | "accepted" | "cancelled" | "expired";
  invited_by: Nullable<Uuid>;
  expires_at: Timestamp;
  accepted_by: Nullable<Uuid>;
  accepted_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type AccessRequestStatus = "pending" | "approved" | "denied" | "cancelled";

export type OrganizationAccessRequest = {
  id: Uuid;
  organization_id: Uuid;
  requester_user_id: Nullable<Uuid>;
  email: string;
  full_name: string;
  requested_role_codes: RoleCode[];
  message: Nullable<string>;
  status: AccessRequestStatus;
  granted_role_code: Nullable<RoleCode>;
  reviewed_by: Nullable<Uuid>;
  reviewed_at: Nullable<Timestamp>;
  review_note: Nullable<string>;
  resulting_membership_id: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type EducationDocumentType =
  "iep" | "etr" | "progress_report" | "section_504" | "gifted" | "el";
export type EducationDocumentStatus = "draft" | "in_review" | "finalized" | "archived";

export type DistrictFormTemplate = {
  id: Uuid;
  organization_id: Uuid;
  document_type: EducationDocumentType | "other";
  name: string;
  description: Nullable<string>;
  file_name: Nullable<string>;
  content_type: Nullable<string>;
  byte_size: Nullable<number>;
  storage_path: Nullable<string>;
  extracted_text: Nullable<string>;
  is_blank_master: boolean;
  active: boolean;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type EducationDocument = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  document_type: EducationDocumentType;
  title: string;
  status: EducationDocumentStatus;
  school_year: Nullable<string>;
  grade_level: Nullable<string>;
  template_key: Nullable<string>;
  fields: Json;
  section_notes: Json;
  legal_disclaimer: string;
  created_by: Nullable<Uuid>;
  updated_by: Nullable<Uuid>;
  finalized_at: Nullable<Timestamp>;
  finalized_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type EducationDocumentUpload = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  education_document_id: Nullable<Uuid>;
  document_type: EducationDocumentType | "other";
  file_name: string;
  content_type: Nullable<string>;
  byte_size: Nullable<number>;
  storage_path: Nullable<string>;
  notes: Nullable<string>;
  uploaded_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type SchoolStaffAssignment = {
  id: Uuid;
  organization_id: Uuid;
  school_id: Uuid;
  user_id: Uuid;
  assignment_type: string;
  status: "active" | "inactive";
  start_date: DateString;
  end_date: Nullable<DateString>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ProgramStaffAssignment = {
  id: Uuid;
  organization_id: Uuid;
  program_id: Uuid;
  user_id: Uuid;
  assignment_type: string;
  status: "active" | "inactive";
  start_date: DateString;
  end_date: Nullable<DateString>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ClassroomStaffAssignment = {
  id: Uuid;
  organization_id: Uuid;
  classroom_id: Uuid;
  user_id: Uuid;
  assignment_type: string;
  status: "active" | "inactive";
  start_date: DateString;
  end_date: Nullable<DateString>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentEnrollment = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  school_id: Uuid;
  status: "active" | "inactive";
  start_date: DateString;
  end_date: Nullable<DateString>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentProgramAssignment = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  program_id: Uuid;
  status: "active" | "inactive";
  start_date: DateString;
  end_date: Nullable<DateString>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentClassroomAssignment = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  classroom_id: Uuid;
  status: "active" | "inactive";
  start_date: DateString;
  end_date: Nullable<DateString>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentStaffAssignment = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  user_id: Uuid;
  assignment_role:
    | "case_manager"
    | "intervention_specialist"
    | "related_service_provider"
    | "paraprofessional"
    | "teacher"
    | "other";
  status: "active" | "inactive";
  start_date: DateString;
  end_date: Nullable<DateString>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentStatusHistory = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  previous_status: Nullable<string>;
  new_status: string;
  changed_by: Nullable<Uuid>;
  note: Nullable<string>;
  created_at: Timestamp;
};

export type IepObjective = {
  id: Uuid;
  organization_id: Uuid;
  goal_id: Uuid;
  sequence_no: number;
  objective_statement: string;
  target_value: Nullable<number>;
  measurement_type: Nullable<MeasurementType>;
  status: RecordStatus;
  start_date: Nullable<DateString>;
  target_date: Nullable<DateString>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type GoalBaseline = {
  id: Uuid;
  organization_id: Uuid;
  goal_id: Uuid;
  baseline_date: DateString;
  measurement_type: MeasurementType;
  numeric_value: Nullable<number>;
  unit: Nullable<string>;
  correct_count: Nullable<number>;
  total_opportunities: Nullable<number>;
  prompt_level: Nullable<string>;
  setting: Nullable<string>;
  conditions: Nullable<string>;
  notes: Nullable<string>;
  entered_by: Nullable<Uuid>;
  source_description: Nullable<string>;
  created_at: Timestamp;
};

export type GoalStatusHistory = {
  id: Uuid;
  organization_id: Uuid;
  goal_id: Uuid;
  previous_status: Nullable<string>;
  new_status: string;
  changed_by: Nullable<Uuid>;
  note: Nullable<string>;
  created_at: Timestamp;
};

export type PromptLevelDefinition = {
  id: Uuid;
  organization_id: Uuid;
  code: string;
  label: string;
  hierarchy_position: number;
  independence_value: Nullable<number>;
};

export type InterventionPhase = {
  id: Uuid;
  organization_id: Uuid;
  goal_id: Uuid;
  label: string;
  phase_type: "baseline" | "intervention" | "maintenance" | "generalization" | "other";
  start_date: DateString;
  end_date: Nullable<DateString>;
  notes: Nullable<string>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ProgressDataPoint = {
  id: Uuid;
  organization_id: Uuid;
  session_id: Uuid;
  measurement_type: MeasurementType;
  correct_count: Nullable<number>;
  total_opportunities: Nullable<number>;
  calculated_percentage: Nullable<number>;
  count_value: Nullable<number>;
  observation_duration_seconds: Nullable<number>;
  calculated_rate: Nullable<number>;
  rate_unit: Nullable<string>;
  duration_value: Nullable<number>;
  duration_unit: Nullable<string>;
  latency_value: Nullable<number>;
  latency_unit: Nullable<string>;
  rubric_score: Nullable<number>;
  rubric_max: Nullable<number>;
  rubric_level: Nullable<string>;
  prompt_level: Nullable<string>;
  prompt_hierarchy_position: Nullable<number>;
  independence_value: Nullable<number>;
  words_read: Nullable<number>;
  error_count: Nullable<number>;
  reading_time_seconds: Nullable<number>;
  words_correct_per_minute: Nullable<number>;
  accuracy_percentage: Nullable<number>;
  task_independent_steps: Nullable<number>;
  task_prompted_steps: Nullable<number>;
  task_incorrect_steps: Nullable<number>;
  task_not_attempted_steps: Nullable<number>;
  custom_numeric_value: Nullable<number>;
  custom_unit: Nullable<string>;
  higher_is_better: Nullable<boolean>;
  step_responses: Nullable<Json>;
  context: Json;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ProgressEntryStatusHistory = {
  id: Uuid;
  organization_id: Uuid;
  session_id: Uuid;
  previous_status: Nullable<string>;
  new_status: string;
  changed_by: Nullable<Uuid>;
  note: Nullable<string>;
  previous_snapshot: Nullable<Json>;
  created_at: Timestamp;
};

export type ProgressReportStatus =
  | "not_started"
  | "draft"
  | "ready_for_review"
  | "changes_requested"
  | "approved"
  | "finalized"
  | "corrected"
  | "archived";
export type BehaviorObservationStatus = "draft" | "finalized" | "corrected" | "archived";
export type BehaviorMeasurementMethod =
  "abc" | "frequency" | "duration" | "latency" | "interval" | "intensity";
export type InterventionPlanStatus =
  | "draft"
  | "ready_for_review"
  | "active"
  | "paused"
  | "revised"
  | "completed"
  | "discontinued"
  | "archived";

export type ProgressDescriptorOption = {
  code: string;
  label: string;
  description: string;
  sort_order: number;
};

export type ReportingPeriod = {
  id: Uuid;
  organization_id: Uuid;
  name: string;
  academic_year: string;
  start_date: DateString;
  end_date: DateString;
  due_date: Nullable<DateString>;
  school_id: Nullable<Uuid>;
  program_id: Nullable<Uuid>;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ProgressReport = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  iep_cycle_id: Uuid;
  reporting_period_id: Uuid;
  status: ProgressReportStatus;
  prepared_by: Nullable<Uuid>;
  assigned_reviewer_id: Nullable<Uuid>;
  submitted_at: Nullable<Timestamp>;
  finalized_at: Nullable<Timestamp>;
  finalized_by: Nullable<Uuid>;
  corrected_at: Nullable<Timestamp>;
  archived_at: Nullable<Timestamp>;
  version_number: number;
  parent_report_id: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ProgressReportGoalSection = {
  id: Uuid;
  report_id: Uuid;
  goal_id: Uuid;
  goal_statement_snapshot: string;
  baseline_snapshot: Json;
  target_snapshot: Json;
  period_start: DateString;
  period_end: DateString;
  observation_count: number;
  current_performance_summary: Nullable<string>;
  trend_summary: Nullable<string>;
  prompt_summary: Nullable<string>;
  generalization_summary: Nullable<string>;
  maintenance_summary: Nullable<string>;
  intervention_phase_summary: Nullable<string>;
  data_sufficiency_status: "not_reviewed" | "sufficient" | "limited" | "insufficient";
  data_sufficiency_notes: Nullable<string>;
  educator_narrative: Nullable<string>;
  progress_descriptor: Nullable<string>;
  descriptor_source: "system_suggested" | "educator_selected" | "educator_modified" | "finalized";
  system_summary_draft: Nullable<string>;
  system_summary_label: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ProgressReportEvidenceLink = {
  id: Uuid;
  section_id: Uuid;
  evidence_type: "session" | "data_point" | "baseline" | "intervention_phase" | "analytics_range";
  evidence_id: Nullable<Uuid>;
  label: string;
  date_range_start: Nullable<DateString>;
  date_range_end: Nullable<DateString>;
  metadata: Json;
  created_at: Timestamp;
};

export type ProgressReportStatusHistory = {
  id: Uuid;
  report_id: Uuid;
  from_status: Nullable<ProgressReportStatus>;
  to_status: ProgressReportStatus;
  changed_by: Nullable<Uuid>;
  note: Nullable<string>;
  created_at: Timestamp;
};

export type ProgressReportVersion = {
  id: Uuid;
  report_id: Uuid;
  version_number: number;
  snapshot: Json;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  reason: Nullable<string>;
};

export type ReportExport = {
  id: Uuid;
  report_id: Uuid;
  organization_id: Uuid;
  exported_by: Nullable<Uuid>;
  export_format: "print" | "pdf";
  version_number: number;
  created_at: Timestamp;
};

export type BehaviorDefinition = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  name: string;
  operational_definition: string;
  measurement_notes: Nullable<string>;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type BehaviorDefinitionExample = {
  id: Uuid;
  behavior_definition_id: Uuid;
  example_text: string;
  sort_order: number;
  created_at: Timestamp;
};

export type BehaviorDefinitionNonexample = {
  id: Uuid;
  behavior_definition_id: Uuid;
  nonexample_text: string;
  sort_order: number;
  created_at: Timestamp;
};

export type ReplacementBehaviorDefinition = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  behavior_definition_id: Nullable<Uuid>;
  name: string;
  replacement_statement: string;
  teaching_notes: Nullable<string>;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type IntensityScaleDefinition = {
  id: Uuid;
  organization_id: Uuid;
  behavior_id: Nullable<Uuid>;
  name: string;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type IntensityScaleLevel = {
  id: Uuid;
  scale_id: Uuid;
  level_number: number;
  label: string;
  observable_anchor: string;
  created_at: Timestamp;
};

export type BehaviorObservationSession = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  behavior_definition_id: Uuid;
  measurement_method: BehaviorMeasurementMethod;
  session_date: DateString;
  session_time: Nullable<string>;
  observer_user_id: Nullable<Uuid>;
  setting: Nullable<string>;
  activity: Nullable<string>;
  people_present: Nullable<string>;
  status: BehaviorObservationStatus;
  notes: Nullable<string>;
  finalized_at: Nullable<Timestamp>;
  finalized_by: Nullable<Uuid>;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type AbcObservation = {
  id: Uuid;
  session_id: Uuid;
  recorded_antecedent: string;
  observable_behavior: string;
  recorded_consequence: string;
  duration_seconds: Nullable<number>;
  intensity_level_id: Nullable<Uuid>;
  replacement_observed: boolean;
  notes: Nullable<string>;
  created_at: Timestamp;
};

export type FrequencyObservation = {
  id: Uuid;
  session_id: Uuid;
  count: number;
  observation_duration_seconds: number;
  calculated_rate_per_minute: Nullable<number>;
  created_at: Timestamp;
};

export type DurationObservation = {
  id: Uuid;
  session_id: Uuid;
  total_duration_seconds: number;
  episode_count: number;
  average_episode_seconds: Nullable<number>;
  created_at: Timestamp;
};

export type LatencyObservation = {
  id: Uuid;
  session_id: Uuid;
  trigger_description: string;
  latency_seconds: number;
  response_description: Nullable<string>;
  created_at: Timestamp;
};

export type IntervalObservation = {
  id: Uuid;
  session_id: Uuid;
  recording_method: "whole" | "partial" | "momentary";
  interval_duration_seconds: number;
  interval_count: number;
  intervals_positive: number;
  percentage_of_intervals: Nullable<number>;
  interval_results: Json;
  created_at: Timestamp;
};

export type IntensityRating = {
  id: Uuid;
  session_id: Uuid;
  intensity_level_id: Uuid;
  created_at: Timestamp;
};

export type BehaviorEntryStatusHistory = {
  id: Uuid;
  session_id: Uuid;
  from_status: Nullable<BehaviorObservationStatus>;
  to_status: BehaviorObservationStatus;
  changed_by: Nullable<Uuid>;
  note: Nullable<string>;
  created_at: Timestamp;
};

export type BehaviorObservationCorrection = {
  id: Uuid;
  session_id: Uuid;
  previous_snapshot: Json;
  corrected_by: Uuid;
  corrected_at: Timestamp;
  reason: string;
};

export type AbcCategoryOption = {
  id: Uuid;
  organization_id: Uuid;
  category_type: "antecedent" | "consequence";
  code: string;
  label: string;
  active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type AbcObservationCategoryAssignment = {
  id: Uuid;
  abc_observation_id: Uuid;
  session_id: Uuid;
  category_type: "antecedent" | "consequence";
  category_code: string;
  source: "suggested" | "confirmed";
  confirmed_by: Nullable<Uuid>;
  created_at: Timestamp;
};

export type OrganizationTimeBlock = {
  id: Uuid;
  organization_id: Uuid;
  code: string;
  label: string;
  start_time: string;
  end_time: string;
  sort_order: number;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type FbaEvidenceWorkspace = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  behavior_definition_id: Uuid;
  date_range_start: DateString;
  date_range_end: DateString;
  status: "draft" | "in_review" | "archived";
  educator_hypothesis: Nullable<string>;
  hypothesis_confirmed: boolean;
  hypothesis_confirmed_by: Nullable<Uuid>;
  hypothesis_confirmed_at: Nullable<Timestamp>;
  team_notes: Nullable<string>;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type FbaEvidenceLink = {
  id: Uuid;
  workspace_id: Uuid;
  evidence_type:
    | "behavior_session"
    | "abc_observation"
    | "frequency_observation"
    | "duration_observation"
    | "latency_observation"
    | "interval_observation"
    | "intensity_rating"
    | "analytics_range";
  evidence_id: Nullable<Uuid>;
  label: string;
  created_at: Timestamp;
};

export type FbaWorkspaceStatusHistory = {
  id: Uuid;
  workspace_id: Uuid;
  from_status: Nullable<"draft" | "in_review" | "archived">;
  to_status: "draft" | "in_review" | "archived";
  changed_by: Nullable<Uuid>;
  note: Nullable<string>;
  created_at: Timestamp;
};

export type InterventionLibraryItem = {
  id: Uuid;
  organization_id: Uuid;
  name: string;
  category: Nullable<string>;
  description: string;
  evidence_level: "evidence_based" | "promising" | "emerging" | "local_practice" | "other";
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type InterventionPlan = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  library_item_id: Nullable<Uuid>;
  title: string;
  description: Nullable<string>;
  status: InterventionPlanStatus;
  start_date: Nullable<DateString>;
  end_date: Nullable<DateString>;
  created_by: Nullable<Uuid>;
  owner_user_id: Nullable<Uuid>;
  activated_at: Nullable<Timestamp>;
  activated_by: Nullable<Uuid>;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type InterventionPlanVersion = {
  id: Uuid;
  plan_id: Uuid;
  version_number: number;
  snapshot: Json;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  reason: Nullable<string>;
};

export type InterventionComponent = {
  id: Uuid;
  plan_id: Uuid;
  label: string;
  description: string;
  implementation_notes: Nullable<string>;
  sort_order: number;
  active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type InterventionTargetBehavior = {
  id: Uuid;
  plan_id: Uuid;
  behavior_definition_id: Nullable<Uuid>;
  target_description: string;
  created_at: Timestamp;
};

export type InterventionReplacementBehavior = {
  id: Uuid;
  plan_id: Uuid;
  replacement_behavior_definition_id: Nullable<Uuid>;
  replacement_description: string;
  created_at: Timestamp;
};

export type InterventionStaffAssignment = {
  id: Uuid;
  plan_id: Uuid;
  user_id: Uuid;
  responsibility_type: string;
  role_description: Nullable<string>;
  status: "active" | "inactive";
  start_date: DateString;
  end_date: Nullable<DateString>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type InterventionSchedule = {
  id: Uuid;
  plan_id: Uuid;
  schedule_label: string;
  frequency: Nullable<string>;
  days_of_week: Json;
  start_time: Nullable<string>;
  end_time: Nullable<string>;
  setting: Nullable<string>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type FidelityChecklist = {
  id: Uuid;
  plan_id: Uuid;
  title: string;
  description: Nullable<string>;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type FidelityChecklistItem = {
  id: Uuid;
  checklist_id: Uuid;
  item_text: string;
  sort_order: number;
  required: boolean;
  created_at: Timestamp;
};

export type FidelityObservation = {
  id: Uuid;
  plan_id: Uuid;
  checklist_id: Uuid;
  observation_date: DateString;
  observer_user_id: Nullable<Uuid>;
  status: BehaviorObservationStatus;
  notes: Nullable<string>;
  finalized_at: Nullable<Timestamp>;
  finalized_by: Nullable<Uuid>;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type FidelityItemResponse = {
  id: Uuid;
  observation_id: Uuid;
  checklist_item_id: Uuid;
  response: "yes" | "partial" | "no" | "not_observed";
  notes: Nullable<string>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type InterventionDosageLog = {
  id: Uuid;
  plan_id: Uuid;
  log_date: DateString;
  delivered_by: Nullable<Uuid>;
  duration_minutes: Nullable<number>;
  sessions_delivered: number;
  setting: Nullable<string>;
  notes: Nullable<string>;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type InterventionReviewRecord = {
  id: Uuid;
  plan_id: Uuid;
  review_date: DateString;
  reviewer_user_id: Nullable<Uuid>;
  summary: string;
  outcome: "continue" | "revise" | "pause" | "complete" | "discontinue";
  next_review_date: Nullable<DateString>;
  created_at: Timestamp;
};

export type InterventionOutcomeLink = {
  id: Uuid;
  plan_id: Uuid;
  evidence_type:
    "goal" | "progress_session" | "behavior_session" | "fba_workspace" | "report_section";
  evidence_id: Nullable<Uuid>;
  label: string;
  created_at: Timestamp;
};

export type InterventionStatusHistory = {
  id: Uuid;
  plan_id: Uuid;
  from_status: Nullable<InterventionPlanStatus>;
  to_status: InterventionPlanStatus;
  changed_by: Nullable<Uuid>;
  note: Nullable<string>;
  created_at: Timestamp;
};

export type InterventionPlanPhase = {
  id: Uuid;
  plan_id: Uuid;
  label: string;
  start_date: DateString;
  end_date: Nullable<DateString>;
  phase_type: "baseline" | "implementation" | "maintenance" | "generalization" | "fade" | "other";
  notes: Nullable<string>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type AccommodationLibraryItem = {
  id: Uuid;
  organization_id: Uuid;
  name: string;
  accommodation_area: Nullable<string>;
  description: string;
  default_implementation_notes: Nullable<string>;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentAccommodation = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  iep_cycle_id: Nullable<Uuid>;
  library_item_id: Nullable<Uuid>;
  title: string;
  accommodation_area: Nullable<string>;
  description: string;
  implementation_notes: Nullable<string>;
  accommodation_snapshot: Json;
  status: "draft" | "active" | "under_review" | "revised" | "ended" | "archived";
  start_date: Nullable<DateString>;
  end_date: Nullable<DateString>;
  created_by: Nullable<Uuid>;
  updated_by: Nullable<Uuid>;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type AccommodationImplementationLog = {
  id: Uuid;
  organization_id: Uuid;
  student_accommodation_id: Uuid;
  student_id: Uuid;
  log_date: DateString;
  implemented_by: Nullable<Uuid>;
  setting: Nullable<string>;
  implementation_status:
    | "implemented"
    | "partially_implemented"
    | "not_implemented"
    | "not_applicable"
    | "student_declined";
  status: BehaviorObservationStatus;
  notes: Nullable<string>;
  finalized_at: Nullable<Timestamp>;
  finalized_by: Nullable<Uuid>;
  corrected_from_log_id: Nullable<Uuid>;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type AccommodationReviewRecord = {
  id: Uuid;
  organization_id: Uuid;
  student_accommodation_id: Uuid;
  student_id: Uuid;
  review_date: DateString;
  reviewed_by: Nullable<Uuid>;
  review_summary: string;
  recommendation: Nullable<string>;
  next_review_date: Nullable<DateString>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ServiceDefinition = {
  id: Uuid;
  organization_id: Uuid;
  name: string;
  service_area: string;
  description: Nullable<string>;
  default_delivery_type: Nullable<ServiceDeliveryType>;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ServiceDeliveryType =
  "push_in" | "pull_out" | "consultation" | "individual" | "group" | "other";
export type ServicePlanStatus =
  "draft" | "active" | "under_review" | "revised" | "ended" | "archived";
export type ServiceDeliveryStatus =
  | "delivered"
  | "partially_delivered"
  | "rescheduled"
  | "canceled"
  | "student_absent"
  | "provider_absent"
  | "school_closed"
  | "family_canceled"
  | "student_unavailable"
  | "other";

export type StudentServicePlan = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  iep_cycle_id: Nullable<Uuid>;
  service_definition_id: Nullable<Uuid>;
  title: string;
  description: Nullable<string>;
  service_snapshot: Json;
  status: ServicePlanStatus;
  start_date: Nullable<DateString>;
  end_date: Nullable<DateString>;
  created_by: Nullable<Uuid>;
  activated_at: Nullable<Timestamp>;
  activated_by: Nullable<Uuid>;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ServicePlanComponent = {
  id: Uuid;
  organization_id: Uuid;
  service_plan_id: Uuid;
  component_name: string;
  service_minutes: Nullable<number>;
  frequency: Nullable<string>;
  setting: Nullable<string>;
  delivery_type: Nullable<ServiceDeliveryType>;
  notes: Nullable<string>;
  sort_order: number;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ServiceSchedule = {
  id: Uuid;
  organization_id: Uuid;
  service_plan_id: Uuid;
  service_component_id: Nullable<Uuid>;
  day_of_week: Nullable<number>;
  start_time: Nullable<string>;
  planned_duration_minutes: Nullable<number>;
  recurrence_note: Nullable<string>;
  location: Nullable<string>;
  status: RecordStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ServiceDeliveryLog = {
  id: Uuid;
  organization_id: Uuid;
  service_plan_id: Uuid;
  service_component_id: Nullable<Uuid>;
  primary_student_id: Uuid;
  provider_user_id: Nullable<Uuid>;
  service_date: DateString;
  start_time: Nullable<string>;
  end_time: Nullable<string>;
  calculated_duration_minutes: Nullable<number>;
  delivery_type: ServiceDeliveryType;
  service_status: ServiceDeliveryStatus;
  record_status: BehaviorObservationStatus;
  cancellation_reason_id: Nullable<Uuid>;
  notes: Nullable<string>;
  finalized_at: Nullable<Timestamp>;
  finalized_by: Nullable<Uuid>;
  corrected_from_log_id: Nullable<Uuid>;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ServiceDeliveryParticipant = {
  id: Uuid;
  organization_id: Uuid;
  delivery_log_id: Uuid;
  student_id: Uuid;
  participation_note: Nullable<string>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ServiceReviewRecord = {
  id: Uuid;
  organization_id: Uuid;
  service_plan_id: Uuid;
  student_id: Uuid;
  review_date: DateString;
  reviewed_by: Nullable<Uuid>;
  review_summary: string;
  recommendation: Nullable<string>;
  next_review_date: Nullable<DateString>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ServiceExport = {
  id: Uuid;
  organization_id: Uuid;
  service_plan_id: Nullable<Uuid>;
  student_id: Nullable<Uuid>;
  exported_by: Nullable<Uuid>;
  export_format: "csv" | "pdf" | "json" | "print" | "other";
  date_range_start: Nullable<DateString>;
  date_range_end: Nullable<DateString>;
  storage_path: Nullable<string>;
  metadata: Json;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentContact = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  first_name: string;
  last_name: string;
  relationship: string;
  contact_type: "family" | "guardian" | "caregiver" | "agency" | "other";
  email: Nullable<string>;
  phone_primary: Nullable<string>;
  phone_secondary: Nullable<string>;
  sensitive_notes: Nullable<string>;
  is_primary: boolean;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  archived_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ContactPreference = {
  id: Uuid;
  organization_id: Uuid;
  contact_id: Uuid;
  student_id: Uuid;
  preferred_method: Nullable<
    "phone" | "email" | "text" | "letter" | "in_person" | "portal" | "other"
  >;
  preferred_language: Nullable<string>;
  interpreter_needed: boolean;
  best_times: Nullable<string>;
  notes: Nullable<string>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type CommunicationVisibility = "family_visible" | "internal" | "restricted_admin";
export type CommunicationEsignStatus = "none" | "pending" | "signed" | "clarification_requested";

export type CommunicationLog = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  contact_id: Nullable<Uuid>;
  category_id: Nullable<Uuid>;
  occurred_at: Timestamp;
  method: "phone" | "email" | "text" | "letter" | "in_person" | "portal" | "video" | "other";
  direction: "outbound" | "inbound" | "two_way" | "internal";
  visibility: CommunicationVisibility;
  subject: string;
  summary: string;
  language_code: string;
  source_language_code: string;
  source_summary: Nullable<string>;
  acknowledgement_requested: boolean;
  esign_status: CommunicationEsignStatus;
  signed_content_hash: Nullable<string>;
  followup_needed: boolean;
  status: BehaviorObservationStatus;
  finalized_at: Nullable<Timestamp>;
  finalized_by: Nullable<Uuid>;
  corrected_from_log_id: Nullable<Uuid>;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type CommunicationAcknowledgement = {
  id: Uuid;
  organization_id: Uuid;
  communication_log_id: Uuid;
  student_id: Uuid;
  signer_display_name: string;
  signer_email: Nullable<string>;
  method: "typed" | "drawn" | "staff_attested";
  status: "acknowledged" | "reviewed" | "requested_clarification";
  typed_signature: Nullable<string>;
  signature_image_data: Nullable<string>;
  content_hash: string;
  user_agent: Nullable<string>;
  notes: Nullable<string>;
  signed_at: Timestamp;
  recorded_by: Nullable<Uuid>;
  sign_link_id: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type CommunicationSignLink = {
  id: Uuid;
  organization_id: Uuid;
  communication_log_id: Uuid;
  student_id: Uuid;
  token_hash: string;
  expires_at: Timestamp;
  revoked_at: Nullable<Timestamp>;
  first_opened_at: Nullable<Timestamp>;
  last_opened_at: Nullable<Timestamp>;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StaffNotificationKind =
  "communication_parent_read" | "communication_parent_signed" | "general";

export type StaffNotification = {
  id: Uuid;
  organization_id: Uuid;
  recipient_user_id: Nullable<Uuid>;
  kind: StaffNotificationKind;
  title: string;
  body: string;
  communication_log_id: Nullable<Uuid>;
  student_id: Nullable<Uuid>;
  acknowledgement_id: Nullable<Uuid>;
  read_at: Nullable<Timestamp>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type CommunicationCategory = {
  id: Uuid;
  organization_id: Uuid;
  name: string;
  description: Nullable<string>;
  active: boolean;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type CommunicationParticipant = {
  id: Uuid;
  organization_id: Uuid;
  communication_log_id: Uuid;
  participant_kind: "staff" | "contact" | "external" | "student";
  user_id: Nullable<Uuid>;
  contact_id: Nullable<Uuid>;
  student_id: Nullable<Uuid>;
  external_name: Nullable<string>;
  external_role: Nullable<string>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type CommunicationFollowup = {
  id: Uuid;
  organization_id: Uuid;
  communication_log_id: Uuid;
  student_id: Uuid;
  assigned_to: Nullable<Uuid>;
  due_date: Nullable<DateString>;
  status: "open" | "completed" | "canceled" | "archived";
  description: string;
  completed_at: Nullable<Timestamp>;
  completed_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type CommunicationTemplate = {
  id: Uuid;
  organization_id: Uuid;
  name: string;
  default_visibility: CommunicationVisibility;
  method: Nullable<CommunicationLog["method"]>;
  subject_template: Nullable<string>;
  body_template: string;
  active: boolean;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type MeetingType = {
  id: Uuid;
  organization_id: Uuid;
  name: string;
  description: Nullable<string>;
  active: boolean;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type Meeting = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  meeting_type_id: Nullable<Uuid>;
  title: string;
  scheduled_start: Nullable<Timestamp>;
  scheduled_end: Nullable<Timestamp>;
  location: Nullable<string>;
  virtual_link_note: Nullable<string>;
  status: "draft" | "scheduled" | "held" | "finalized" | "canceled" | "archived";
  created_by: Nullable<Uuid>;
  finalized_at: Nullable<Timestamp>;
  finalized_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type MeetingParticipant = CommunicationParticipant & {
  meeting_id: Uuid;
  invitation_status: "not_sent" | "sent" | "accepted" | "declined" | "tentative" | "not_required";
  attendance_status: "unknown" | "present" | "absent" | "excused" | "partial" | "not_required";
};

export type MeetingAgendaItem = {
  id: Uuid;
  organization_id: Uuid;
  meeting_id: Uuid;
  title: string;
  description: Nullable<string>;
  sort_order: number;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type MeetingNote = {
  id: Uuid;
  organization_id: Uuid;
  meeting_id: Uuid;
  note_kind:
    | "discussion"
    | "data_reviewed"
    | "family_input"
    | "student_input"
    | "staff_input"
    | "decision"
    | "follow_up"
    | "unresolved"
    | "internal_prep";
  note_text: string;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type MeetingActionItem = {
  id: Uuid;
  organization_id: Uuid;
  meeting_id: Uuid;
  assigned_to: Nullable<Uuid>;
  description: string;
  due_date: Nullable<DateString>;
  status: "open" | "completed" | "canceled" | "archived";
  completed_at: Nullable<Timestamp>;
  completed_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type MeetingAcknowledgement = {
  id: Uuid;
  organization_id: Uuid;
  meeting_id: Uuid;
  contact_id: Nullable<Uuid>;
  acknowledged_by_name: Nullable<string>;
  status:
    | "received"
    | "reviewed"
    | "acknowledged"
    | "declined"
    | "requested_clarification"
    | "no_response"
    | "other";
  note: Nullable<string>;
  recorded_by: Nullable<Uuid>;
  recorded_at: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ClassroomSchedule = {
  id: Uuid;
  organization_id: Uuid;
  classroom_id: Uuid;
  name: string;
  academic_year: Nullable<string>;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ClassroomScheduleException = {
  id: Uuid;
  organization_id: Uuid;
  schedule_id: Uuid;
  classroom_id: Uuid;
  exception_date: DateString;
  reason: string;
  replacement_note: Nullable<string>;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ClassroomScheduleBlock = {
  id: Uuid;
  organization_id: Uuid;
  schedule_id: Uuid;
  classroom_id: Uuid;
  day_of_week: Nullable<number>;
  start_time: string;
  end_time: string;
  label: string;
  block_type: Nullable<string>;
  location: Nullable<string>;
  sort_order: number;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentSchedule = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  classroom_id: Nullable<Uuid>;
  name: string;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentScheduleBlock = {
  id: Uuid;
  organization_id: Uuid;
  student_schedule_id: Uuid;
  student_id: Uuid;
  day_of_week: Nullable<number>;
  start_time: string;
  end_time: string;
  label: string;
  support_note: Nullable<string>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ClassroomRoutine = {
  id: Uuid;
  organization_id: Uuid;
  classroom_id: Uuid;
  name: string;
  description: Nullable<string>;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type TaskAnalysis = {
  id: Uuid;
  organization_id: Uuid;
  classroom_id: Nullable<Uuid>;
  name: string;
  description: Nullable<string>;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentTaskAssignment = {
  id: Uuid;
  organization_id: Uuid;
  task_analysis_id: Uuid;
  student_id: Uuid;
  status: RecordStatus;
  start_date: DateString;
  end_date: Nullable<DateString>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type TaskCompletionLog = {
  id: Uuid;
  organization_id: Uuid;
  task_assignment_id: Uuid;
  student_id: Uuid;
  log_date: DateString;
  completion_status: "independent" | "prompted" | "partial" | "not_completed" | "not_applicable";
  prompt_level: Nullable<PromptLevel>;
  note: Nullable<string>;
  recorded_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type PromptLevel =
  | "independent"
  | "visual"
  | "gestural"
  | "verbal"
  | "modeled"
  | "partial_physical"
  | "full_physical"
  | "not_observed"
  | "not_applicable";

export type ExecutiveFunctionSkillArea = {
  id: Uuid;
  organization_id: Uuid;
  name: string;
  description: Nullable<string>;
  active: boolean;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentExecutiveFunctionPlan = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  skill_area_id: Nullable<Uuid>;
  title: string;
  description: Nullable<string>;
  status: ServicePlanStatus;
  start_date: Nullable<DateString>;
  end_date: Nullable<DateString>;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ExecutiveFunctionSupport = {
  id: Uuid;
  organization_id: Uuid;
  ef_plan_id: Uuid;
  support_name: string;
  support_description: string;
  prompt_hierarchy: Nullable<string>;
  status: RecordStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ExecutiveFunctionObservation = {
  id: Uuid;
  organization_id: Uuid;
  ef_plan_id: Uuid;
  support_id: Nullable<Uuid>;
  student_id: Uuid;
  observation_date: DateString;
  observer_user_id: Nullable<Uuid>;
  prompt_level: PromptLevel;
  observation_note: Nullable<string>;
  status: BehaviorObservationStatus;
  finalized_at: Nullable<Timestamp>;
  finalized_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentChecklist = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  title: string;
  description: Nullable<string>;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentChecklistItem = {
  id: Uuid;
  organization_id: Uuid;
  checklist_id: Uuid;
  student_id: Uuid;
  item_text: string;
  sort_order: number;
  active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type StudentChecklistResponse = {
  id: Uuid;
  organization_id: Uuid;
  checklist_id: Uuid;
  checklist_item_id: Uuid;
  student_id: Uuid;
  response_date: DateString;
  response: "yes" | "partial" | "no" | "not_observed" | "not_applicable";
  note: Nullable<string>;
  responded_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type DailyStudentNote = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Uuid;
  note_date: DateString;
  note_text: string;
  status: BehaviorObservationStatus;
  entered_by: Nullable<Uuid>;
  finalized_at: Nullable<Timestamp>;
  finalized_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ClassroomAnnouncement = {
  id: Uuid;
  organization_id: Uuid;
  classroom_id: Uuid;
  title: string;
  body: string;
  contains_student_pii: boolean;
  audience: "staff" | "family" | "student" | "all";
  publish_at: Nullable<Timestamp>;
  expires_at: Nullable<Timestamp>;
  status: "draft" | "published" | "archived";
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type ReinforcementSystem = {
  id: Uuid;
  organization_id: Uuid;
  student_id: Nullable<Uuid>;
  classroom_id: Nullable<Uuid>;
  name: string;
  description: Nullable<string>;
  status: RecordStatus;
  created_by: Nullable<Uuid>;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type Database = {
  public: {
    Tables: {
      organizations: RowDefinition<Organization, Partial<Organization>, Partial<Organization>>;
      organization_subscriptions: RowDefinition<
        OrganizationSubscription,
        Partial<OrganizationSubscription>,
        Partial<OrganizationSubscription>
      >;
      organization_memberships: RowDefinition<
        OrganizationMembership,
        Partial<OrganizationMembership>,
        Partial<OrganizationMembership>
      >;
      user_profiles: RowDefinition<UserProfile, Partial<UserProfile>, Partial<UserProfile>>;
      organization_invitations: RowDefinition<
        OrganizationInvitation,
        Partial<OrganizationInvitation>,
        Partial<OrganizationInvitation>
      >;
      organization_access_requests: RowDefinition<
        OrganizationAccessRequest,
        Partial<OrganizationAccessRequest>,
        Partial<OrganizationAccessRequest>
      >;
      education_documents: RowDefinition<
        EducationDocument,
        Partial<EducationDocument>,
        Partial<EducationDocument>
      >;
      education_document_uploads: RowDefinition<
        EducationDocumentUpload,
        Partial<EducationDocumentUpload>,
        Partial<EducationDocumentUpload>
      >;
      district_form_templates: RowDefinition<
        DistrictFormTemplate,
        Partial<DistrictFormTemplate>,
        Partial<DistrictFormTemplate>
      >;
      schools: RowDefinition<School, Partial<School>, Partial<School>>;
      programs: RowDefinition<Program, Partial<Program>, Partial<Program>>;
      classrooms: RowDefinition<Classroom, Partial<Classroom>, Partial<Classroom>>;
      school_staff_assignments: RowDefinition<
        SchoolStaffAssignment,
        Partial<SchoolStaffAssignment>,
        Partial<SchoolStaffAssignment>
      >;
      program_staff_assignments: RowDefinition<
        ProgramStaffAssignment,
        Partial<ProgramStaffAssignment>,
        Partial<ProgramStaffAssignment>
      >;
      classroom_staff_assignments: RowDefinition<
        ClassroomStaffAssignment,
        Partial<ClassroomStaffAssignment>,
        Partial<ClassroomStaffAssignment>
      >;
      students: RowDefinition<Student, Partial<Student>, Partial<Student>>;
      student_enrollments: RowDefinition<
        StudentEnrollment,
        Partial<StudentEnrollment>,
        Partial<StudentEnrollment>
      >;
      student_program_assignments: RowDefinition<
        StudentProgramAssignment,
        Partial<StudentProgramAssignment>,
        Partial<StudentProgramAssignment>
      >;
      student_classroom_assignments: RowDefinition<
        StudentClassroomAssignment,
        Partial<StudentClassroomAssignment>,
        Partial<StudentClassroomAssignment>
      >;
      student_staff_assignments: RowDefinition<
        StudentStaffAssignment,
        Partial<StudentStaffAssignment>,
        Partial<StudentStaffAssignment>
      >;
      student_status_history: RowDefinition<
        StudentStatusHistory,
        Partial<StudentStatusHistory>,
        never
      >;
      iep_cycles: RowDefinition<IepCycle, Partial<IepCycle>, Partial<IepCycle>>;
      iep_goals: RowDefinition<IepGoal, Partial<IepGoal>, Partial<IepGoal>>;
      iep_objectives: RowDefinition<IepObjective, Partial<IepObjective>, Partial<IepObjective>>;
      goal_baselines: RowDefinition<GoalBaseline, Partial<GoalBaseline>, Partial<GoalBaseline>>;
      goal_status_history: RowDefinition<GoalStatusHistory, Partial<GoalStatusHistory>, never>;
      prompt_level_definitions: RowDefinition<
        PromptLevelDefinition,
        Partial<PromptLevelDefinition>,
        Partial<PromptLevelDefinition>
      >;
      intervention_phases: RowDefinition<
        InterventionPhase,
        Partial<InterventionPhase>,
        Partial<InterventionPhase>
      >;
      progress_monitoring_sessions: RowDefinition<
        ProgressMonitoringSession,
        Partial<ProgressMonitoringSession>,
        Partial<ProgressMonitoringSession>
      >;
      progress_data_points: RowDefinition<
        ProgressDataPoint,
        Partial<ProgressDataPoint>,
        Partial<ProgressDataPoint>
      >;
      progress_entry_status_history: RowDefinition<
        ProgressEntryStatusHistory,
        Partial<ProgressEntryStatusHistory>,
        never
      >;
      progress_descriptor_options: RowDefinition<
        ProgressDescriptorOption,
        Partial<ProgressDescriptorOption>,
        Partial<ProgressDescriptorOption>
      >;
      reporting_periods: RowDefinition<
        ReportingPeriod,
        Partial<ReportingPeriod>,
        Partial<ReportingPeriod>
      >;
      progress_reports: RowDefinition<
        ProgressReport,
        Partial<ProgressReport>,
        Partial<ProgressReport>
      >;
      progress_report_goal_sections: RowDefinition<
        ProgressReportGoalSection,
        Partial<ProgressReportGoalSection>,
        Partial<ProgressReportGoalSection>
      >;
      progress_report_evidence_links: RowDefinition<
        ProgressReportEvidenceLink,
        Partial<ProgressReportEvidenceLink>,
        Partial<ProgressReportEvidenceLink>
      >;
      progress_report_status_history: RowDefinition<
        ProgressReportStatusHistory,
        Partial<ProgressReportStatusHistory>,
        never
      >;
      progress_report_versions: RowDefinition<
        ProgressReportVersion,
        Partial<ProgressReportVersion>,
        never
      >;
      report_exports: RowDefinition<ReportExport, Partial<ReportExport>, never>;
      behavior_definitions: RowDefinition<
        BehaviorDefinition,
        Partial<BehaviorDefinition>,
        Partial<BehaviorDefinition>
      >;
      behavior_definition_examples: RowDefinition<
        BehaviorDefinitionExample,
        Partial<BehaviorDefinitionExample>,
        Partial<BehaviorDefinitionExample>
      >;
      behavior_definition_nonexamples: RowDefinition<
        BehaviorDefinitionNonexample,
        Partial<BehaviorDefinitionNonexample>,
        Partial<BehaviorDefinitionNonexample>
      >;
      replacement_behavior_definitions: RowDefinition<
        ReplacementBehaviorDefinition,
        Partial<ReplacementBehaviorDefinition>,
        Partial<ReplacementBehaviorDefinition>
      >;
      intensity_scale_definitions: RowDefinition<
        IntensityScaleDefinition,
        Partial<IntensityScaleDefinition>,
        Partial<IntensityScaleDefinition>
      >;
      intensity_scale_levels: RowDefinition<
        IntensityScaleLevel,
        Partial<IntensityScaleLevel>,
        Partial<IntensityScaleLevel>
      >;
      behavior_observation_sessions: RowDefinition<
        BehaviorObservationSession,
        Partial<BehaviorObservationSession>,
        Partial<BehaviorObservationSession>
      >;
      abc_observations: RowDefinition<
        AbcObservation,
        Partial<AbcObservation>,
        Partial<AbcObservation>
      >;
      frequency_observations: RowDefinition<
        FrequencyObservation,
        Partial<FrequencyObservation>,
        Partial<FrequencyObservation>
      >;
      duration_observations: RowDefinition<
        DurationObservation,
        Partial<DurationObservation>,
        Partial<DurationObservation>
      >;
      latency_observations: RowDefinition<
        LatencyObservation,
        Partial<LatencyObservation>,
        Partial<LatencyObservation>
      >;
      interval_observations: RowDefinition<
        IntervalObservation,
        Partial<IntervalObservation>,
        Partial<IntervalObservation>
      >;
      intensity_ratings: RowDefinition<
        IntensityRating,
        Partial<IntensityRating>,
        Partial<IntensityRating>
      >;
      behavior_entry_status_history: RowDefinition<
        BehaviorEntryStatusHistory,
        Partial<BehaviorEntryStatusHistory>,
        never
      >;
      behavior_observation_corrections: RowDefinition<
        BehaviorObservationCorrection,
        Partial<BehaviorObservationCorrection>,
        never
      >;
      abc_category_options: RowDefinition<
        AbcCategoryOption,
        Partial<AbcCategoryOption>,
        Partial<AbcCategoryOption>
      >;
      abc_observation_category_assignments: RowDefinition<
        AbcObservationCategoryAssignment,
        Partial<AbcObservationCategoryAssignment>,
        Partial<AbcObservationCategoryAssignment>
      >;
      organization_time_blocks: RowDefinition<
        OrganizationTimeBlock,
        Partial<OrganizationTimeBlock>,
        Partial<OrganizationTimeBlock>
      >;
      fba_evidence_workspaces: RowDefinition<
        FbaEvidenceWorkspace,
        Partial<FbaEvidenceWorkspace>,
        Partial<FbaEvidenceWorkspace>
      >;
      fba_evidence_links: RowDefinition<
        FbaEvidenceLink,
        Partial<FbaEvidenceLink>,
        Partial<FbaEvidenceLink>
      >;
      fba_workspace_status_history: RowDefinition<
        FbaWorkspaceStatusHistory,
        Partial<FbaWorkspaceStatusHistory>,
        never
      >;
      intervention_library_items: RowDefinition<
        InterventionLibraryItem,
        Partial<InterventionLibraryItem>,
        Partial<InterventionLibraryItem>
      >;
      intervention_plans: RowDefinition<
        InterventionPlan,
        Partial<InterventionPlan>,
        Partial<InterventionPlan>
      >;
      intervention_plan_versions: RowDefinition<
        InterventionPlanVersion,
        Partial<InterventionPlanVersion>,
        never
      >;
      intervention_components: RowDefinition<
        InterventionComponent,
        Partial<InterventionComponent>,
        Partial<InterventionComponent>
      >;
      intervention_target_behaviors: RowDefinition<
        InterventionTargetBehavior,
        Partial<InterventionTargetBehavior>,
        Partial<InterventionTargetBehavior>
      >;
      intervention_replacement_behaviors: RowDefinition<
        InterventionReplacementBehavior,
        Partial<InterventionReplacementBehavior>,
        Partial<InterventionReplacementBehavior>
      >;
      intervention_staff_assignments: RowDefinition<
        InterventionStaffAssignment,
        Partial<InterventionStaffAssignment>,
        Partial<InterventionStaffAssignment>
      >;
      intervention_schedules: RowDefinition<
        InterventionSchedule,
        Partial<InterventionSchedule>,
        Partial<InterventionSchedule>
      >;
      fidelity_checklists: RowDefinition<
        FidelityChecklist,
        Partial<FidelityChecklist>,
        Partial<FidelityChecklist>
      >;
      fidelity_checklist_items: RowDefinition<
        FidelityChecklistItem,
        Partial<FidelityChecklistItem>,
        Partial<FidelityChecklistItem>
      >;
      fidelity_observations: RowDefinition<
        FidelityObservation,
        Partial<FidelityObservation>,
        Partial<FidelityObservation>
      >;
      fidelity_item_responses: RowDefinition<
        FidelityItemResponse,
        Partial<FidelityItemResponse>,
        Partial<FidelityItemResponse>
      >;
      intervention_dosage_logs: RowDefinition<
        InterventionDosageLog,
        Partial<InterventionDosageLog>,
        Partial<InterventionDosageLog>
      >;
      intervention_review_records: RowDefinition<
        InterventionReviewRecord,
        Partial<InterventionReviewRecord>,
        never
      >;
      intervention_outcome_links: RowDefinition<
        InterventionOutcomeLink,
        Partial<InterventionOutcomeLink>,
        Partial<InterventionOutcomeLink>
      >;
      intervention_status_history: RowDefinition<
        InterventionStatusHistory,
        Partial<InterventionStatusHistory>,
        never
      >;
      intervention_plan_phases: RowDefinition<
        InterventionPlanPhase,
        Partial<InterventionPlanPhase>,
        Partial<InterventionPlanPhase>
      >;
      accommodation_library_items: RowDefinition<
        AccommodationLibraryItem,
        Partial<AccommodationLibraryItem>,
        Partial<AccommodationLibraryItem>
      >;
      student_accommodations: RowDefinition<
        StudentAccommodation,
        Partial<StudentAccommodation>,
        Partial<StudentAccommodation>
      >;
      accommodation_implementation_logs: RowDefinition<
        AccommodationImplementationLog,
        Partial<AccommodationImplementationLog>,
        Partial<AccommodationImplementationLog>
      >;
      accommodation_review_records: RowDefinition<
        AccommodationReviewRecord,
        Partial<AccommodationReviewRecord>,
        Partial<AccommodationReviewRecord>
      >;
      service_definitions: RowDefinition<
        ServiceDefinition,
        Partial<ServiceDefinition>,
        Partial<ServiceDefinition>
      >;
      student_service_plans: RowDefinition<
        StudentServicePlan,
        Partial<StudentServicePlan>,
        Partial<StudentServicePlan>
      >;
      service_plan_components: RowDefinition<
        ServicePlanComponent,
        Partial<ServicePlanComponent>,
        Partial<ServicePlanComponent>
      >;
      service_schedules: RowDefinition<
        ServiceSchedule,
        Partial<ServiceSchedule>,
        Partial<ServiceSchedule>
      >;
      service_delivery_logs: RowDefinition<
        ServiceDeliveryLog,
        Partial<ServiceDeliveryLog>,
        Partial<ServiceDeliveryLog>
      >;
      service_delivery_participants: RowDefinition<
        ServiceDeliveryParticipant,
        Partial<ServiceDeliveryParticipant>,
        Partial<ServiceDeliveryParticipant>
      >;
      service_review_records: RowDefinition<
        ServiceReviewRecord,
        Partial<ServiceReviewRecord>,
        Partial<ServiceReviewRecord>
      >;
      service_exports: RowDefinition<ServiceExport, Partial<ServiceExport>, Partial<ServiceExport>>;
      student_contacts: RowDefinition<
        StudentContact,
        Partial<StudentContact>,
        Partial<StudentContact>
      >;
      contact_preferences: RowDefinition<
        ContactPreference,
        Partial<ContactPreference>,
        Partial<ContactPreference>
      >;
      communication_categories: RowDefinition<
        CommunicationCategory,
        Partial<CommunicationCategory>,
        Partial<CommunicationCategory>
      >;
      communication_logs: RowDefinition<
        CommunicationLog,
        Partial<CommunicationLog>,
        Partial<CommunicationLog>
      >;
      communication_acknowledgements: RowDefinition<
        CommunicationAcknowledgement,
        Partial<CommunicationAcknowledgement>,
        Partial<CommunicationAcknowledgement>
      >;
      communication_sign_links: RowDefinition<
        CommunicationSignLink,
        Partial<CommunicationSignLink>,
        Partial<CommunicationSignLink>
      >;
      staff_notifications: RowDefinition<
        StaffNotification,
        Partial<StaffNotification>,
        Partial<StaffNotification>
      >;
      communication_participants: RowDefinition<
        CommunicationParticipant,
        Partial<CommunicationParticipant>,
        Partial<CommunicationParticipant>
      >;
      communication_followups: RowDefinition<
        CommunicationFollowup,
        Partial<CommunicationFollowup>,
        Partial<CommunicationFollowup>
      >;
      communication_templates: RowDefinition<
        CommunicationTemplate,
        Partial<CommunicationTemplate>,
        Partial<CommunicationTemplate>
      >;
      meeting_types: RowDefinition<MeetingType, Partial<MeetingType>, Partial<MeetingType>>;
      meetings: RowDefinition<Meeting, Partial<Meeting>, Partial<Meeting>>;
      meeting_participants: RowDefinition<
        MeetingParticipant,
        Partial<MeetingParticipant>,
        Partial<MeetingParticipant>
      >;
      meeting_agenda_items: RowDefinition<
        MeetingAgendaItem,
        Partial<MeetingAgendaItem>,
        Partial<MeetingAgendaItem>
      >;
      meeting_notes: RowDefinition<MeetingNote, Partial<MeetingNote>, Partial<MeetingNote>>;
      meeting_action_items: RowDefinition<
        MeetingActionItem,
        Partial<MeetingActionItem>,
        Partial<MeetingActionItem>
      >;
      meeting_acknowledgements: RowDefinition<
        MeetingAcknowledgement,
        Partial<MeetingAcknowledgement>,
        Partial<MeetingAcknowledgement>
      >;
      classroom_schedules: RowDefinition<
        ClassroomSchedule,
        Partial<ClassroomSchedule>,
        Partial<ClassroomSchedule>
      >;
      classroom_schedule_blocks: RowDefinition<
        ClassroomScheduleBlock,
        Partial<ClassroomScheduleBlock>,
        Partial<ClassroomScheduleBlock>
      >;
      student_schedules: RowDefinition<
        StudentSchedule,
        Partial<StudentSchedule>,
        Partial<StudentSchedule>
      >;
      student_schedule_blocks: RowDefinition<
        StudentScheduleBlock,
        Partial<StudentScheduleBlock>,
        Partial<StudentScheduleBlock>
      >;
      classroom_routines: RowDefinition<
        ClassroomRoutine,
        Partial<ClassroomRoutine>,
        Partial<ClassroomRoutine>
      >;
      task_analyses: RowDefinition<TaskAnalysis, Partial<TaskAnalysis>, Partial<TaskAnalysis>>;
      student_task_assignments: RowDefinition<
        StudentTaskAssignment,
        Partial<StudentTaskAssignment>,
        Partial<StudentTaskAssignment>
      >;
      task_completion_logs: RowDefinition<
        TaskCompletionLog,
        Partial<TaskCompletionLog>,
        Partial<TaskCompletionLog>
      >;
      executive_function_skill_areas: RowDefinition<
        ExecutiveFunctionSkillArea,
        Partial<ExecutiveFunctionSkillArea>,
        Partial<ExecutiveFunctionSkillArea>
      >;
      student_executive_function_plans: RowDefinition<
        StudentExecutiveFunctionPlan,
        Partial<StudentExecutiveFunctionPlan>,
        Partial<StudentExecutiveFunctionPlan>
      >;
      executive_function_supports: RowDefinition<
        ExecutiveFunctionSupport,
        Partial<ExecutiveFunctionSupport>,
        Partial<ExecutiveFunctionSupport>
      >;
      executive_function_observations: RowDefinition<
        ExecutiveFunctionObservation,
        Partial<ExecutiveFunctionObservation>,
        Partial<ExecutiveFunctionObservation>
      >;
      student_checklists: RowDefinition<
        StudentChecklist,
        Partial<StudentChecklist>,
        Partial<StudentChecklist>
      >;
      student_checklist_items: RowDefinition<
        StudentChecklistItem,
        Partial<StudentChecklistItem>,
        Partial<StudentChecklistItem>
      >;
      student_checklist_responses: RowDefinition<
        StudentChecklistResponse,
        Partial<StudentChecklistResponse>,
        Partial<StudentChecklistResponse>
      >;
      daily_student_notes: RowDefinition<
        DailyStudentNote,
        Partial<DailyStudentNote>,
        Partial<DailyStudentNote>
      >;
      classroom_announcements: RowDefinition<
        ClassroomAnnouncement,
        Partial<ClassroomAnnouncement>,
        Partial<ClassroomAnnouncement>
      >;
      reinforcement_systems: RowDefinition<
        ReinforcementSystem,
        Partial<ReinforcementSystem>,
        Partial<ReinforcementSystem>
      >;
      audit_events: RowDefinition<
        AuditEvent,
        Omit<Partial<AuditEvent>, "id" | "created_at">,
        never
      >;
      organization_privacy_settings: RowDefinition<
        OrganizationPrivacySettings,
        Partial<OrganizationPrivacySettings>,
        Partial<OrganizationPrivacySettings>
      >;
      administrative_export_events: RowDefinition<
        AdministrativeExportEvent,
        Omit<Partial<AdministrativeExportEvent>, "id" | "created_at">,
        never
      >;
      classroom_schedule_exceptions: RowDefinition<
        ClassroomScheduleException,
        Partial<ClassroomScheduleException>,
        Partial<ClassroomScheduleException>
      >;
      role_permissions: RowDefinition<
        { role_code: RoleCode; permission_code: PermissionCode },
        { role_code: RoleCode; permission_code: PermissionCode },
        never
      >;
    };
    Views: Record<string, never>;
    Functions: {
      is_org_member: {
        Args: { p_org_id: Uuid };
        Returns: boolean;
      };
      has_org_permission: {
        Args: { p_org_id: Uuid; p_permission: PermissionCode | string };
        Returns: boolean;
      };
      can_read_admin_intelligence: {
        Args: { p_org_id: Uuid };
        Returns: boolean;
      };
      can_export_admin_intelligence: {
        Args: { p_org_id: Uuid };
        Returns: boolean;
      };
      member_role: {
        Args: { p_org_id: Uuid };
        Returns: RoleCode | null;
      };
      can_read_student: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_edit_student: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_manage_goal: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_enter_progress: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_finalize_progress: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_read_report: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_draft_report: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_finalize_report: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_review_report: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_read_behavior: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_define_behavior: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_observe_behavior: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_finalize_behavior: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_read_fba: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_manage_fba: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_read_intervention: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_manage_intervention_plan: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_activate_intervention: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_enter_fidelity: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_finalize_fidelity: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_read_accommodation: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_manage_accommodation: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_implement_accommodation: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_read_service: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_manage_service_plan: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_activate_service_plan: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_enter_service_log: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_finalize_service_log: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_read_contact: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_manage_contact: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_read_communication: {
        Args: { p_org_id: Uuid; p_student_id: Uuid; p_visibility: string };
        Returns: boolean;
      };
      can_enter_communication: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_finalize_communication: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      get_communication_sign_packet: {
        Args: { p_token: string };
        Returns: Array<{
          link_id: Uuid;
          communication_log_id: Uuid;
          organization_name: string;
          subject: string;
          summary: string;
          method: string;
          occurred_at: Timestamp;
          esign_status: string;
          expires_at: Timestamp;
          already_signed: boolean;
        }>;
      };
      submit_communication_sign_packet: {
        Args: {
          p_token: string;
          p_signer_display_name: string;
          p_typed_signature: string;
          p_signature_image_data?: string | null;
          p_signer_email?: string | null;
          p_method?: string | null;
          p_user_agent?: string | null;
          p_notes?: string | null;
        };
        Returns: Uuid;
      };
      notify_staff_parent_communication_ack: {
        Args: {
          p_organization_id: Uuid;
          p_communication_log_id: Uuid;
          p_student_id: Uuid;
          p_acknowledgement_id: Uuid;
          p_signer_display_name: string;
          p_method: string;
        };
        Returns: undefined;
      };
      can_read_meeting: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_manage_meeting: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_finalize_meeting: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_read_classroom_ops: {
        Args: { p_org_id: Uuid; p_classroom_id: Uuid };
        Returns: boolean;
      };
      can_manage_classroom_schedule: {
        Args: { p_org_id: Uuid; p_classroom_id: Uuid };
        Returns: boolean;
      };
      can_read_ef: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_manage_ef_plan: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_observe_ef: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_manage_checklist: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_respond_checklist: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_read_daily_note: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_enter_daily_note: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      can_finalize_daily_note: {
        Args: { p_org_id: Uuid; p_student_id: Uuid };
        Returns: boolean;
      };
      resolve_organization_id_by_slug: {
        Args: { p_slug: string };
        Returns: Uuid;
      };
      submit_organization_access_request: {
        Args: {
          p_org_slug: string;
          p_full_name: string;
          p_email: string;
          p_requested_role_codes: string[];
          p_message?: string | null;
        };
        Returns: Uuid;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
