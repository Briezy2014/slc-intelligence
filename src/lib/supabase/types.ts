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
  | "analytics.read";

export type Organization = {
  id: Uuid;
  name: string;
  slug: string;
  status: OrganizationStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
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

export type Database = {
  public: {
    Tables: {
      organizations: RowDefinition<Organization, Partial<Organization>, Partial<Organization>>;
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
      audit_events: RowDefinition<
        AuditEvent,
        Omit<Partial<AuditEvent>, "id" | "created_at">,
        never
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
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
