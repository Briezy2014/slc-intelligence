-- 202607290007_executive_function_and_classroom_ops.sql
-- Phase 15 database layer: executive function supports and classroom operations.

INSERT INTO public.app_permissions (code, label, description) VALUES
  ('classroom.schedule.manage', 'Manage classroom schedules', 'Create and edit classroom and student schedules'),
  ('classroom.operations.read', 'Read classroom operations', 'View authorized classroom operations records'),
  ('routine.manage', 'Manage routines', 'Create and edit classroom routines'),
  ('task_analysis.manage', 'Manage task analyses', 'Create and edit task analyses and assignments'),
  ('ef.plan.manage', 'Manage executive function plans', 'Create and edit student executive function plans'),
  ('ef.observe', 'Observe executive function supports', 'Record executive function observations'),
  ('ef.read', 'Read executive function supports', 'View authorized executive function supports'),
  ('checklist.manage', 'Manage checklists', 'Create and edit student checklists'),
  ('checklist.respond', 'Respond to checklists', 'Record checklist responses'),
  ('staff.duty.assign', 'Assign staff duties', 'Assign staff duties and support coverage'),
  ('daily_note.enter', 'Enter daily notes', 'Create and edit draft daily student notes'),
  ('daily_note.finalize', 'Finalize daily notes', 'Finalize and correct daily student notes'),
  ('daily_note.read', 'Read daily notes', 'View authorized daily student notes'),
  ('reinforcement.manage', 'Manage reinforcement systems', 'Create and edit reinforcement systems and records'),
  ('announcement.manage', 'Manage announcements', 'Create and edit classroom announcements')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code)
SELECT 'organization_admin', code
FROM public.app_permissions
WHERE code IN (
  'classroom.schedule.manage',
  'classroom.operations.read',
  'routine.manage',
  'task_analysis.manage',
  'ef.plan.manage',
  'ef.observe',
  'ef.read',
  'checklist.manage',
  'checklist.respond',
  'staff.duty.assign',
  'daily_note.enter',
  'daily_note.finalize',
  'daily_note.read',
  'reinforcement.manage',
  'announcement.manage'
)
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code) VALUES
  ('district_sped_admin', 'classroom.schedule.manage'),
  ('district_sped_admin', 'classroom.operations.read'),
  ('district_sped_admin', 'routine.manage'),
  ('district_sped_admin', 'task_analysis.manage'),
  ('district_sped_admin', 'ef.plan.manage'),
  ('district_sped_admin', 'ef.observe'),
  ('district_sped_admin', 'ef.read'),
  ('district_sped_admin', 'checklist.manage'),
  ('district_sped_admin', 'checklist.respond'),
  ('district_sped_admin', 'staff.duty.assign'),
  ('district_sped_admin', 'daily_note.enter'),
  ('district_sped_admin', 'daily_note.finalize'),
  ('district_sped_admin', 'daily_note.read'),
  ('district_sped_admin', 'reinforcement.manage'),
  ('district_sped_admin', 'announcement.manage'),
  ('building_admin', 'classroom.schedule.manage'),
  ('building_admin', 'classroom.operations.read'),
  ('building_admin', 'routine.manage'),
  ('building_admin', 'task_analysis.manage'),
  ('building_admin', 'ef.read'),
  ('building_admin', 'checklist.manage'),
  ('building_admin', 'staff.duty.assign'),
  ('building_admin', 'daily_note.read'),
  ('building_admin', 'announcement.manage'),
  ('program_admin', 'classroom.schedule.manage'),
  ('program_admin', 'classroom.operations.read'),
  ('program_admin', 'routine.manage'),
  ('program_admin', 'task_analysis.manage'),
  ('program_admin', 'ef.plan.manage'),
  ('program_admin', 'ef.observe'),
  ('program_admin', 'ef.read'),
  ('program_admin', 'checklist.manage'),
  ('program_admin', 'checklist.respond'),
  ('program_admin', 'staff.duty.assign'),
  ('program_admin', 'daily_note.enter'),
  ('program_admin', 'daily_note.finalize'),
  ('program_admin', 'daily_note.read'),
  ('program_admin', 'reinforcement.manage'),
  ('program_admin', 'announcement.manage'),
  ('intervention_specialist', 'classroom.operations.read'),
  ('intervention_specialist', 'routine.manage'),
  ('intervention_specialist', 'task_analysis.manage'),
  ('intervention_specialist', 'ef.plan.manage'),
  ('intervention_specialist', 'ef.observe'),
  ('intervention_specialist', 'ef.read'),
  ('intervention_specialist', 'checklist.manage'),
  ('intervention_specialist', 'checklist.respond'),
  ('intervention_specialist', 'daily_note.enter'),
  ('intervention_specialist', 'daily_note.finalize'),
  ('intervention_specialist', 'daily_note.read'),
  ('intervention_specialist', 'reinforcement.manage'),
  ('case_manager', 'classroom.operations.read'),
  ('case_manager', 'routine.manage'),
  ('case_manager', 'task_analysis.manage'),
  ('case_manager', 'ef.plan.manage'),
  ('case_manager', 'ef.observe'),
  ('case_manager', 'ef.read'),
  ('case_manager', 'checklist.manage'),
  ('case_manager', 'checklist.respond'),
  ('case_manager', 'daily_note.enter'),
  ('case_manager', 'daily_note.finalize'),
  ('case_manager', 'daily_note.read'),
  ('case_manager', 'reinforcement.manage'),
  ('special_education_teacher', 'classroom.operations.read'),
  ('special_education_teacher', 'routine.manage'),
  ('special_education_teacher', 'task_analysis.manage'),
  ('special_education_teacher', 'ef.observe'),
  ('special_education_teacher', 'ef.read'),
  ('special_education_teacher', 'checklist.manage'),
  ('special_education_teacher', 'checklist.respond'),
  ('special_education_teacher', 'daily_note.enter'),
  ('special_education_teacher', 'daily_note.read'),
  ('special_education_teacher', 'reinforcement.manage'),
  ('special_education_teacher', 'announcement.manage'),
  ('related_service_provider', 'ef.observe'),
  ('related_service_provider', 'ef.read'),
  ('related_service_provider', 'checklist.respond'),
  ('related_service_provider', 'daily_note.enter'),
  ('related_service_provider', 'daily_note.read'),
  ('paraprofessional', 'classroom.operations.read'),
  ('paraprofessional', 'ef.observe'),
  ('paraprofessional', 'ef.read'),
  ('paraprofessional', 'checklist.respond'),
  ('paraprofessional', 'daily_note.enter'),
  ('paraprofessional', 'daily_note.read'),
  ('read_only_reviewer', 'classroom.operations.read'),
  ('read_only_reviewer', 'ef.read'),
  ('read_only_reviewer', 'daily_note.read')
ON CONFLICT DO NOTHING;

CREATE TABLE public.classroom_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  name text NOT NULL,
  academic_year text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.classroom_schedule_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  schedule_id uuid NOT NULL REFERENCES public.classroom_schedules(id) ON DELETE CASCADE,
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  day_of_week integer CHECK (day_of_week IS NULL OR day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  label text NOT NULL,
  block_type text,
  location text,
  sort_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

CREATE TABLE public.classroom_schedule_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  schedule_id uuid NOT NULL REFERENCES public.classroom_schedules(id) ON DELETE CASCADE,
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  exception_date date NOT NULL,
  reason text NOT NULL,
  replacement_note text,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.student_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  classroom_id uuid REFERENCES public.classrooms(id) ON DELETE SET NULL,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.student_schedule_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_schedule_id uuid NOT NULL REFERENCES public.student_schedules(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  day_of_week integer CHECK (day_of_week IS NULL OR day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  label text NOT NULL,
  support_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

CREATE TABLE public.classroom_routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.routine_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  routine_id uuid NOT NULL REFERENCES public.classroom_routines(id) ON DELETE CASCADE,
  step_text text NOT NULL,
  prompt_note text,
  sort_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (routine_id, sort_order)
);

CREATE TABLE public.routine_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  routine_id uuid NOT NULL REFERENCES public.classroom_routines(id) ON DELETE CASCADE,
  classroom_id uuid REFERENCES public.classrooms(id) ON DELETE CASCADE,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (classroom_id IS NOT NULL OR student_id IS NOT NULL)
);

CREATE TABLE public.routine_implementation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  routine_id uuid NOT NULL REFERENCES public.classroom_routines(id) ON DELETE CASCADE,
  classroom_id uuid REFERENCES public.classrooms(id) ON DELETE SET NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  implementation_status text NOT NULL DEFAULT 'observed' CHECK (implementation_status IN ('observed', 'partial', 'not_observed', 'not_applicable')),
  note text,
  recorded_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.task_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  classroom_id uuid REFERENCES public.classrooms(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.task_analysis_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  task_analysis_id uuid NOT NULL REFERENCES public.task_analyses(id) ON DELETE CASCADE,
  step_text text NOT NULL,
  prompt_note text,
  sort_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (task_analysis_id, sort_order)
);

CREATE TABLE public.student_task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  task_analysis_id uuid NOT NULL REFERENCES public.task_analyses(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE public.task_completion_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  task_assignment_id uuid NOT NULL REFERENCES public.student_task_assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  completion_status text NOT NULL CHECK (completion_status IN ('independent', 'prompted', 'partial', 'not_completed', 'not_applicable')),
  prompt_level text CHECK (
    prompt_level IS NULL OR prompt_level IN ('independent', 'visual', 'gestural', 'verbal', 'modeled', 'partial_physical', 'full_physical', 'not_observed', 'not_applicable')
  ),
  note text,
  recorded_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.executive_function_skill_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

CREATE TABLE public.student_executive_function_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  skill_area_id uuid REFERENCES public.executive_function_skill_areas(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'under_review', 'revised', 'ended', 'archived')),
  start_date date,
  end_date date,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE TABLE public.executive_function_supports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  ef_plan_id uuid NOT NULL REFERENCES public.student_executive_function_plans(id) ON DELETE CASCADE,
  support_name text NOT NULL,
  support_description text NOT NULL,
  prompt_hierarchy text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.executive_function_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  ef_plan_id uuid NOT NULL REFERENCES public.student_executive_function_plans(id) ON DELETE CASCADE,
  support_id uuid REFERENCES public.executive_function_supports(id) ON DELETE SET NULL,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  observation_date date NOT NULL DEFAULT CURRENT_DATE,
  observer_user_id uuid REFERENCES public.user_profiles(id),
  prompt_level text NOT NULL CHECK (
    prompt_level IN ('independent', 'visual', 'gestural', 'verbal', 'modeled', 'partial_physical', 'full_physical', 'not_observed', 'not_applicable')
  ),
  observation_note text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'corrected', 'archived')),
  finalized_at timestamptz,
  finalized_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ef_observation_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  observation_id uuid NOT NULL REFERENCES public.executive_function_observations(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  changed_by uuid REFERENCES public.user_profiles(id),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.student_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.student_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  checklist_id uuid NOT NULL REFERENCES public.student_checklists(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  item_text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (checklist_id, sort_order)
);

CREATE TABLE public.student_checklist_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  checklist_id uuid NOT NULL REFERENCES public.student_checklists(id) ON DELETE CASCADE,
  checklist_item_id uuid NOT NULL REFERENCES public.student_checklist_items(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  response_date date NOT NULL DEFAULT CURRENT_DATE,
  response text NOT NULL CHECK (response IN ('yes', 'partial', 'no', 'not_observed', 'not_applicable')),
  note text,
  responded_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (checklist_item_id, response_date, responded_by)
);

CREATE TABLE public.transition_supports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  from_activity text NOT NULL,
  to_activity text NOT NULL,
  support_description text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.classroom_duty_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  duty_name text NOT NULL,
  duty_date date,
  start_time time,
  end_time time,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time IS NULL OR start_time IS NULL OR end_time >= start_time)
);

CREATE TABLE public.student_support_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  support_role text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE public.staff_duty_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  school_id uuid REFERENCES public.schools(id) ON DELETE SET NULL,
  classroom_id uuid REFERENCES public.classrooms(id) ON DELETE SET NULL,
  duty_name text NOT NULL,
  duty_date date,
  start_time time,
  end_time time,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time IS NULL OR start_time IS NULL OR end_time >= start_time)
);

CREATE TABLE public.daily_student_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  note_date date NOT NULL DEFAULT CURRENT_DATE,
  note_text text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'corrected', 'archived')),
  entered_by uuid REFERENCES public.user_profiles(id),
  finalized_at timestamptz,
  finalized_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.classroom_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  contains_student_pii boolean NOT NULL DEFAULT false CHECK (contains_student_pii = false),
  audience text NOT NULL DEFAULT 'staff' CHECK (audience IN ('staff', 'family', 'student', 'all')),
  publish_at timestamptz,
  expires_at timestamptz,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expires_at IS NULL OR publish_at IS NULL OR expires_at >= publish_at)
);

CREATE TABLE public.reinforcement_systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  classroom_id uuid REFERENCES public.classrooms(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (student_id IS NOT NULL OR classroom_id IS NOT NULL)
);

CREATE TABLE public.reinforcement_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  reinforcement_system_id uuid NOT NULL REFERENCES public.reinforcement_systems(id) ON DELETE CASCADE,
  option_label text NOT NULL,
  description text,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.reinforcement_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  reinforcement_system_id uuid NOT NULL REFERENCES public.reinforcement_systems(id) ON DELETE CASCADE,
  reinforcement_option_id uuid REFERENCES public.reinforcement_options(id) ON DELETE SET NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  record_date date NOT NULL DEFAULT CURRENT_DATE,
  count integer NOT NULL DEFAULT 1 CHECK (count >= 0),
  note text,
  recorded_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.choice_boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  classroom_id uuid REFERENCES public.classrooms(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (student_id IS NOT NULL OR classroom_id IS NOT NULL)
);

CREATE TABLE public.choice_board_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  choice_board_id uuid NOT NULL REFERENCES public.choice_boards(id) ON DELETE CASCADE,
  label text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.reinforcement_systems IS
  'Reinforcement records must not be used for punitive ranking or deprivation of basic needs.';
COMMENT ON TABLE public.executive_function_observations IS
  'Executive function observations are descriptive support records and do not claim mastery.';
COMMENT ON TABLE public.classroom_announcements IS
  'Announcement body content must not store student PII; use student-scoped records for student-specific information.';
COMMENT ON COLUMN public.classroom_announcements.contains_student_pii IS
  'Must remain false; this check is a schema safeguard for announcement content review.';

CREATE INDEX classroom_schedules_classroom_idx ON public.classroom_schedules(classroom_id);
CREATE INDEX classroom_schedule_blocks_schedule_idx ON public.classroom_schedule_blocks(schedule_id);
CREATE INDEX classroom_schedule_exceptions_schedule_idx ON public.classroom_schedule_exceptions(schedule_id);
CREATE INDEX student_schedules_student_idx ON public.student_schedules(student_id);
CREATE INDEX student_schedule_blocks_schedule_idx ON public.student_schedule_blocks(student_schedule_id);
CREATE INDEX classroom_routines_classroom_idx ON public.classroom_routines(classroom_id);
CREATE INDEX routine_steps_routine_idx ON public.routine_steps(routine_id);
CREATE INDEX routine_assignments_routine_idx ON public.routine_assignments(routine_id);
CREATE INDEX routine_assignments_student_idx ON public.routine_assignments(student_id);
CREATE INDEX routine_logs_routine_idx ON public.routine_implementation_logs(routine_id);
CREATE INDEX routine_logs_student_idx ON public.routine_implementation_logs(student_id);
CREATE INDEX task_analyses_org_idx ON public.task_analyses(organization_id);
CREATE INDEX task_analysis_steps_task_idx ON public.task_analysis_steps(task_analysis_id);
CREATE INDEX student_task_assignments_student_idx ON public.student_task_assignments(student_id);
CREATE INDEX task_completion_logs_assignment_idx ON public.task_completion_logs(task_assignment_id);
CREATE INDEX task_completion_logs_student_idx ON public.task_completion_logs(student_id);
CREATE INDEX ef_skill_areas_org_idx ON public.executive_function_skill_areas(organization_id);
CREATE INDEX ef_plans_student_idx ON public.student_executive_function_plans(student_id);
CREATE INDEX ef_supports_plan_idx ON public.executive_function_supports(ef_plan_id);
CREATE INDEX ef_observations_plan_idx ON public.executive_function_observations(ef_plan_id);
CREATE INDEX ef_observations_student_date_idx ON public.executive_function_observations(student_id, observation_date);
CREATE INDEX ef_observation_history_observation_idx ON public.ef_observation_status_history(observation_id);
CREATE INDEX student_checklists_student_idx ON public.student_checklists(student_id);
CREATE INDEX student_checklist_items_checklist_idx ON public.student_checklist_items(checklist_id);
CREATE INDEX student_checklist_responses_checklist_idx ON public.student_checklist_responses(checklist_id);
CREATE INDEX student_checklist_responses_student_idx ON public.student_checklist_responses(student_id);
CREATE INDEX transition_supports_student_idx ON public.transition_supports(student_id);
CREATE INDEX classroom_duty_assignments_classroom_idx ON public.classroom_duty_assignments(classroom_id);
CREATE INDEX classroom_duty_assignments_user_idx ON public.classroom_duty_assignments(user_id);
CREATE INDEX student_support_assignments_student_idx ON public.student_support_assignments(student_id);
CREATE INDEX student_support_assignments_user_idx ON public.student_support_assignments(user_id);
CREATE INDEX staff_duty_assignments_user_idx ON public.staff_duty_assignments(user_id);
CREATE INDEX staff_duty_assignments_classroom_idx ON public.staff_duty_assignments(classroom_id);
CREATE INDEX daily_student_notes_student_date_idx ON public.daily_student_notes(student_id, note_date);
CREATE INDEX classroom_announcements_classroom_idx ON public.classroom_announcements(classroom_id);
CREATE INDEX reinforcement_systems_student_idx ON public.reinforcement_systems(student_id);
CREATE INDEX reinforcement_systems_classroom_idx ON public.reinforcement_systems(classroom_id);
CREATE INDEX reinforcement_options_system_idx ON public.reinforcement_options(reinforcement_system_id);
CREATE INDEX reinforcement_records_system_idx ON public.reinforcement_records(reinforcement_system_id);
CREATE INDEX reinforcement_records_student_idx ON public.reinforcement_records(student_id);
CREATE INDEX choice_boards_student_idx ON public.choice_boards(student_id);
CREATE INDEX choice_boards_classroom_idx ON public.choice_boards(classroom_id);
CREATE INDEX choice_board_items_board_idx ON public.choice_board_items(choice_board_id);

CREATE TRIGGER classroom_schedules_set_updated_at BEFORE UPDATE ON public.classroom_schedules
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER classroom_schedule_blocks_set_updated_at BEFORE UPDATE ON public.classroom_schedule_blocks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER classroom_schedule_exceptions_set_updated_at BEFORE UPDATE ON public.classroom_schedule_exceptions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER student_schedules_set_updated_at BEFORE UPDATE ON public.student_schedules
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER student_schedule_blocks_set_updated_at BEFORE UPDATE ON public.student_schedule_blocks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER classroom_routines_set_updated_at BEFORE UPDATE ON public.classroom_routines
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER routine_steps_set_updated_at BEFORE UPDATE ON public.routine_steps
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER routine_assignments_set_updated_at BEFORE UPDATE ON public.routine_assignments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER routine_logs_set_updated_at BEFORE UPDATE ON public.routine_implementation_logs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER task_analyses_set_updated_at BEFORE UPDATE ON public.task_analyses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER task_analysis_steps_set_updated_at BEFORE UPDATE ON public.task_analysis_steps
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER student_task_assignments_set_updated_at BEFORE UPDATE ON public.student_task_assignments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER task_completion_logs_set_updated_at BEFORE UPDATE ON public.task_completion_logs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER ef_skill_areas_set_updated_at BEFORE UPDATE ON public.executive_function_skill_areas
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER ef_plans_set_updated_at BEFORE UPDATE ON public.student_executive_function_plans
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER ef_supports_set_updated_at BEFORE UPDATE ON public.executive_function_supports
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER ef_observations_set_updated_at BEFORE UPDATE ON public.executive_function_observations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER ef_observation_history_set_updated_at BEFORE UPDATE ON public.ef_observation_status_history
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER student_checklists_set_updated_at BEFORE UPDATE ON public.student_checklists
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER checklist_items_set_updated_at BEFORE UPDATE ON public.student_checklist_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER checklist_responses_set_updated_at BEFORE UPDATE ON public.student_checklist_responses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER transition_supports_set_updated_at BEFORE UPDATE ON public.transition_supports
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER classroom_duty_assignments_set_updated_at BEFORE UPDATE ON public.classroom_duty_assignments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER student_support_assignments_set_updated_at BEFORE UPDATE ON public.student_support_assignments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER staff_duty_assignments_set_updated_at BEFORE UPDATE ON public.staff_duty_assignments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER daily_student_notes_set_updated_at BEFORE UPDATE ON public.daily_student_notes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER classroom_announcements_set_updated_at BEFORE UPDATE ON public.classroom_announcements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER reinforcement_systems_set_updated_at BEFORE UPDATE ON public.reinforcement_systems
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER reinforcement_options_set_updated_at BEFORE UPDATE ON public.reinforcement_options
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER reinforcement_records_set_updated_at BEFORE UPDATE ON public.reinforcement_records
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER choice_boards_set_updated_at BEFORE UPDATE ON public.choice_boards
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER choice_board_items_set_updated_at BEFORE UPDATE ON public.choice_board_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.has_direct_student_assignment(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.student_staff_assignments a
    WHERE a.organization_id = p_org_id
      AND a.student_id = p_student_id
      AND a.user_id = auth.uid()
      AND a.status = 'active'
      AND (a.end_date IS NULL OR a.end_date >= CURRENT_DATE)
  );
$$;

CREATE OR REPLACE FUNCTION public.can_read_classroom_ops(p_org_id uuid, p_classroom_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
      public.has_org_permission(p_org_id, 'classroom.operations.read')
      OR public.has_org_permission(p_org_id, 'classroom.schedule.manage')
      OR public.has_org_permission(p_org_id, 'classroom.manage')
    )
    AND (
      public.has_classroom_scope(p_org_id, p_classroom_id)
      OR public.has_org_permission(p_org_id, 'classroom.schedule.manage')
      OR public.has_org_permission(p_org_id, 'classroom.manage')
    );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_classroom_schedule(p_org_id uuid, p_classroom_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'classroom.schedule.manage')
    AND public.has_classroom_scope(p_org_id, p_classroom_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

CREATE OR REPLACE FUNCTION public.can_read_ef(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'ef.read')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_ef_plan(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'ef.plan.manage')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

CREATE OR REPLACE FUNCTION public.can_observe_ef(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'ef.observe')
    AND public.can_read_student(p_org_id, p_student_id)
    AND (
      public.member_role(p_org_id) <> 'paraprofessional'
      OR public.has_direct_student_assignment(p_org_id, p_student_id)
    );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_checklist(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'checklist.manage')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

CREATE OR REPLACE FUNCTION public.can_respond_checklist(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'checklist.respond')
    AND public.can_read_student(p_org_id, p_student_id)
    AND (
      public.member_role(p_org_id) <> 'paraprofessional'
      OR public.has_direct_student_assignment(p_org_id, p_student_id)
    );
$$;

CREATE OR REPLACE FUNCTION public.can_read_daily_note(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'daily_note.read')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_enter_daily_note(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'daily_note.enter')
    AND public.can_read_student(p_org_id, p_student_id)
    AND (
      public.member_role(p_org_id) <> 'paraprofessional'
      OR public.has_direct_student_assignment(p_org_id, p_student_id)
    );
$$;

CREATE OR REPLACE FUNCTION public.can_finalize_daily_note(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'daily_note.finalize')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

ALTER TABLE public.classroom_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_schedules FORCE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_schedule_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_schedule_blocks FORCE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_schedule_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_schedule_exceptions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_schedules FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_schedule_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_schedule_blocks FORCE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_routines FORCE ROW LEVEL SECURITY;
ALTER TABLE public.routine_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_steps FORCE ROW LEVEL SECURITY;
ALTER TABLE public.routine_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.routine_implementation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_implementation_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.task_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_analyses FORCE ROW LEVEL SECURITY;
ALTER TABLE public.task_analysis_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_analysis_steps FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_task_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.task_completion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_completion_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.executive_function_skill_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executive_function_skill_areas FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_executive_function_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_executive_function_plans FORCE ROW LEVEL SECURITY;
ALTER TABLE public.executive_function_supports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executive_function_supports FORCE ROW LEVEL SECURITY;
ALTER TABLE public.executive_function_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executive_function_observations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.ef_observation_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ef_observation_status_history FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_checklists FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_checklist_items FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_checklist_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_checklist_responses FORCE ROW LEVEL SECURITY;
ALTER TABLE public.transition_supports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transition_supports FORCE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_duty_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_duty_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_support_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_support_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.staff_duty_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_duty_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.daily_student_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_student_notes FORCE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_announcements FORCE ROW LEVEL SECURITY;
ALTER TABLE public.reinforcement_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reinforcement_systems FORCE ROW LEVEL SECURITY;
ALTER TABLE public.reinforcement_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reinforcement_options FORCE ROW LEVEL SECURITY;
ALTER TABLE public.reinforcement_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reinforcement_records FORCE ROW LEVEL SECURITY;
ALTER TABLE public.choice_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.choice_boards FORCE ROW LEVEL SECURITY;
ALTER TABLE public.choice_board_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.choice_board_items FORCE ROW LEVEL SECURITY;

CREATE POLICY classroom_schedules_select ON public.classroom_schedules FOR SELECT
USING (public.can_read_classroom_ops(organization_id, classroom_id));

CREATE POLICY classroom_schedules_mutate ON public.classroom_schedules FOR ALL
USING (public.can_manage_classroom_schedule(organization_id, classroom_id))
WITH CHECK (public.can_manage_classroom_schedule(organization_id, classroom_id));

CREATE POLICY classroom_schedule_blocks_select ON public.classroom_schedule_blocks FOR SELECT
USING (public.can_read_classroom_ops(organization_id, classroom_id));

CREATE POLICY classroom_schedule_blocks_mutate ON public.classroom_schedule_blocks FOR ALL
USING (public.can_manage_classroom_schedule(organization_id, classroom_id))
WITH CHECK (public.can_manage_classroom_schedule(organization_id, classroom_id));

CREATE POLICY classroom_schedule_exceptions_select ON public.classroom_schedule_exceptions FOR SELECT
USING (public.can_read_classroom_ops(organization_id, classroom_id));

CREATE POLICY classroom_schedule_exceptions_mutate ON public.classroom_schedule_exceptions FOR ALL
USING (public.can_manage_classroom_schedule(organization_id, classroom_id))
WITH CHECK (public.can_manage_classroom_schedule(organization_id, classroom_id));

CREATE POLICY student_schedules_select ON public.student_schedules FOR SELECT
USING (public.can_read_student(organization_id, student_id));

CREATE POLICY student_schedules_mutate ON public.student_schedules FOR ALL
USING (
  public.has_org_permission(organization_id, 'classroom.schedule.manage')
  AND public.can_read_student(organization_id, student_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'classroom.schedule.manage')
  AND public.can_read_student(organization_id, student_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY student_schedule_blocks_select ON public.student_schedule_blocks FOR SELECT
USING (public.can_read_student(organization_id, student_id));

CREATE POLICY student_schedule_blocks_mutate ON public.student_schedule_blocks FOR ALL
USING (
  public.has_org_permission(organization_id, 'classroom.schedule.manage')
  AND public.can_read_student(organization_id, student_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'classroom.schedule.manage')
  AND public.can_read_student(organization_id, student_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY classroom_routines_select ON public.classroom_routines FOR SELECT
USING (public.can_read_classroom_ops(organization_id, classroom_id));

CREATE POLICY classroom_routines_mutate ON public.classroom_routines FOR ALL
USING (
  public.has_org_permission(organization_id, 'routine.manage')
  AND public.can_read_classroom_ops(organization_id, classroom_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'routine.manage')
  AND public.can_read_classroom_ops(organization_id, classroom_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY routine_steps_select ON public.routine_steps FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.classroom_routines r
    WHERE r.id = routine_id AND public.can_read_classroom_ops(r.organization_id, r.classroom_id)
  )
);

CREATE POLICY routine_steps_mutate ON public.routine_steps FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.classroom_routines r
    WHERE r.id = routine_id
      AND public.has_org_permission(r.organization_id, 'routine.manage')
      AND public.can_read_classroom_ops(r.organization_id, r.classroom_id)
      AND public.member_role(r.organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.classroom_routines r
    WHERE r.id = routine_id
      AND r.organization_id = organization_id
      AND public.has_org_permission(r.organization_id, 'routine.manage')
      AND public.can_read_classroom_ops(r.organization_id, r.classroom_id)
      AND public.member_role(r.organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
  )
);

CREATE POLICY routine_assignments_select ON public.routine_assignments FOR SELECT
USING (
  (student_id IS NOT NULL AND public.can_read_student(organization_id, student_id))
  OR (classroom_id IS NOT NULL AND public.can_read_classroom_ops(organization_id, classroom_id))
);

CREATE POLICY routine_assignments_mutate ON public.routine_assignments FOR ALL
USING (
  public.has_org_permission(organization_id, 'routine.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
  AND (
    (student_id IS NOT NULL AND public.can_read_student(organization_id, student_id))
    OR (classroom_id IS NOT NULL AND public.can_read_classroom_ops(organization_id, classroom_id))
  )
)
WITH CHECK (
  public.has_org_permission(organization_id, 'routine.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
  AND (
    (student_id IS NOT NULL AND public.can_read_student(organization_id, student_id))
    OR (classroom_id IS NOT NULL AND public.can_read_classroom_ops(organization_id, classroom_id))
  )
);

CREATE POLICY routine_logs_select ON public.routine_implementation_logs FOR SELECT
USING (
  (student_id IS NOT NULL AND public.can_read_student(organization_id, student_id))
  OR (classroom_id IS NOT NULL AND public.can_read_classroom_ops(organization_id, classroom_id))
);

CREATE POLICY routine_logs_mutate ON public.routine_implementation_logs FOR ALL
USING (
  public.has_org_permission(organization_id, 'checklist.respond')
  AND (
    (student_id IS NOT NULL AND public.can_respond_checklist(organization_id, student_id))
    OR (classroom_id IS NOT NULL AND public.can_read_classroom_ops(organization_id, classroom_id))
  )
)
WITH CHECK (
  public.has_org_permission(organization_id, 'checklist.respond')
  AND (
    (student_id IS NOT NULL AND public.can_respond_checklist(organization_id, student_id))
    OR (classroom_id IS NOT NULL AND public.can_read_classroom_ops(organization_id, classroom_id))
  )
);

CREATE POLICY task_analyses_select ON public.task_analyses FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND (
    public.has_org_permission(organization_id, 'task_analysis.manage')
    OR public.has_org_permission(organization_id, 'classroom.operations.read')
  )
  AND (classroom_id IS NULL OR public.can_read_classroom_ops(organization_id, classroom_id))
);

CREATE POLICY task_analyses_mutate ON public.task_analyses FOR ALL
USING (
  public.has_org_permission(organization_id, 'task_analysis.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'task_analysis.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY task_steps_select ON public.task_analysis_steps FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.task_analyses t
    WHERE t.id = task_analysis_id
      AND public.is_org_member(t.organization_id)
      AND (t.classroom_id IS NULL OR public.can_read_classroom_ops(t.organization_id, t.classroom_id))
  )
);

CREATE POLICY task_steps_mutate ON public.task_analysis_steps FOR ALL
USING (
  public.has_org_permission(organization_id, 'task_analysis.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'task_analysis.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY student_task_assignments_select ON public.student_task_assignments FOR SELECT
USING (public.can_read_student(organization_id, student_id));

CREATE POLICY student_task_assignments_mutate ON public.student_task_assignments FOR ALL
USING (
  public.has_org_permission(organization_id, 'task_analysis.manage')
  AND public.can_read_student(organization_id, student_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'task_analysis.manage')
  AND public.can_read_student(organization_id, student_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY task_completion_logs_select ON public.task_completion_logs FOR SELECT
USING (public.can_read_student(organization_id, student_id));

CREATE POLICY task_completion_logs_mutate ON public.task_completion_logs FOR ALL
USING (public.can_respond_checklist(organization_id, student_id))
WITH CHECK (public.can_respond_checklist(organization_id, student_id));

CREATE POLICY ef_skill_areas_select ON public.executive_function_skill_areas FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND (public.has_org_permission(organization_id, 'ef.read') OR public.has_org_permission(organization_id, 'ef.plan.manage'))
);

CREATE POLICY ef_skill_areas_mutate ON public.executive_function_skill_areas FOR ALL
USING (
  public.has_org_permission(organization_id, 'ef.plan.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'ef.plan.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY ef_plans_select ON public.student_executive_function_plans FOR SELECT
USING (public.can_read_ef(organization_id, student_id));

CREATE POLICY ef_plans_mutate ON public.student_executive_function_plans FOR ALL
USING (public.can_manage_ef_plan(organization_id, student_id))
WITH CHECK (public.can_manage_ef_plan(organization_id, student_id));

CREATE POLICY ef_supports_select ON public.executive_function_supports FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.student_executive_function_plans p
    WHERE p.id = ef_plan_id AND public.can_read_ef(p.organization_id, p.student_id)
  )
);

CREATE POLICY ef_supports_mutate ON public.executive_function_supports FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.student_executive_function_plans p
    WHERE p.id = ef_plan_id AND public.can_manage_ef_plan(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.student_executive_function_plans p
    WHERE p.id = ef_plan_id AND p.organization_id = organization_id AND public.can_manage_ef_plan(p.organization_id, p.student_id)
  )
);

CREATE POLICY ef_observations_select ON public.executive_function_observations FOR SELECT
USING (public.can_read_ef(organization_id, student_id));

CREATE POLICY ef_observations_mutate ON public.executive_function_observations FOR ALL
USING (public.can_observe_ef(organization_id, student_id))
WITH CHECK (
  public.can_observe_ef(organization_id, student_id)
  AND EXISTS (
    SELECT 1 FROM public.student_executive_function_plans p
    WHERE p.id = ef_plan_id
      AND p.organization_id = organization_id
      AND p.student_id = student_id
  )
);

CREATE POLICY ef_observation_history_select ON public.ef_observation_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.executive_function_observations o
    WHERE o.id = observation_id AND public.can_read_ef(o.organization_id, o.student_id)
  )
);

CREATE POLICY ef_observation_history_insert ON public.ef_observation_status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.executive_function_observations o
    WHERE o.id = observation_id
      AND o.organization_id = organization_id
      AND public.can_observe_ef(o.organization_id, o.student_id)
  )
);

CREATE POLICY student_checklists_select ON public.student_checklists FOR SELECT
USING (public.can_read_student(organization_id, student_id));

CREATE POLICY student_checklists_mutate ON public.student_checklists FOR ALL
USING (public.can_manage_checklist(organization_id, student_id))
WITH CHECK (public.can_manage_checklist(organization_id, student_id));

CREATE POLICY checklist_items_select ON public.student_checklist_items FOR SELECT
USING (public.can_read_student(organization_id, student_id));

CREATE POLICY checklist_items_mutate ON public.student_checklist_items FOR ALL
USING (public.can_manage_checklist(organization_id, student_id))
WITH CHECK (
  public.can_manage_checklist(organization_id, student_id)
  AND EXISTS (
    SELECT 1 FROM public.student_checklists c
    WHERE c.id = checklist_id
      AND c.organization_id = organization_id
      AND c.student_id = student_id
  )
);

CREATE POLICY checklist_responses_select ON public.student_checklist_responses FOR SELECT
USING (public.can_read_student(organization_id, student_id));

CREATE POLICY checklist_responses_mutate ON public.student_checklist_responses FOR ALL
USING (public.can_respond_checklist(organization_id, student_id))
WITH CHECK (
  public.can_respond_checklist(organization_id, student_id)
  AND EXISTS (
    SELECT 1 FROM public.student_checklist_items i
    WHERE i.id = checklist_item_id
      AND i.organization_id = organization_id
      AND i.student_id = student_id
  )
);

CREATE POLICY transition_supports_select ON public.transition_supports FOR SELECT
USING (public.can_read_ef(organization_id, student_id));

CREATE POLICY transition_supports_mutate ON public.transition_supports FOR ALL
USING (public.can_manage_ef_plan(organization_id, student_id))
WITH CHECK (public.can_manage_ef_plan(organization_id, student_id));

CREATE POLICY classroom_duty_assignments_select ON public.classroom_duty_assignments FOR SELECT
USING (user_id = auth.uid() OR public.can_read_classroom_ops(organization_id, classroom_id));

CREATE POLICY classroom_duty_assignments_mutate ON public.classroom_duty_assignments FOR ALL
USING (
  public.has_org_permission(organization_id, 'staff.duty.assign')
  AND public.can_read_classroom_ops(organization_id, classroom_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'staff.duty.assign')
  AND public.can_read_classroom_ops(organization_id, classroom_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY student_support_assignments_select ON public.student_support_assignments FOR SELECT
USING (user_id = auth.uid() OR public.can_read_student(organization_id, student_id));

CREATE POLICY student_support_assignments_mutate ON public.student_support_assignments FOR ALL
USING (
  public.has_org_permission(organization_id, 'staff.duty.assign')
  AND public.can_read_student(organization_id, student_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'staff.duty.assign')
  AND public.can_read_student(organization_id, student_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY staff_duty_assignments_select ON public.staff_duty_assignments FOR SELECT
USING (
  user_id = auth.uid()
  OR (
    public.has_org_permission(organization_id, 'staff.duty.assign')
    AND (classroom_id IS NULL OR public.can_read_classroom_ops(organization_id, classroom_id))
  )
);

CREATE POLICY staff_duty_assignments_mutate ON public.staff_duty_assignments FOR ALL
USING (
  public.has_org_permission(organization_id, 'staff.duty.assign')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'staff.duty.assign')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY daily_student_notes_select ON public.daily_student_notes FOR SELECT
USING (public.can_read_daily_note(organization_id, student_id));

CREATE POLICY daily_student_notes_insert ON public.daily_student_notes FOR INSERT
WITH CHECK (
  (status = 'draft' AND public.can_enter_daily_note(organization_id, student_id))
  OR (status IN ('finalized', 'corrected') AND public.can_finalize_daily_note(organization_id, student_id))
);

CREATE POLICY daily_student_notes_update ON public.daily_student_notes FOR UPDATE
USING (
  (status = 'draft' AND public.can_enter_daily_note(organization_id, student_id))
  OR public.can_finalize_daily_note(organization_id, student_id)
)
WITH CHECK (
  (status = 'draft' AND public.can_enter_daily_note(organization_id, student_id))
  OR (status IN ('finalized', 'corrected', 'archived') AND public.can_finalize_daily_note(organization_id, student_id))
);

CREATE POLICY classroom_announcements_select ON public.classroom_announcements FOR SELECT
USING (public.can_read_classroom_ops(organization_id, classroom_id));

CREATE POLICY classroom_announcements_mutate ON public.classroom_announcements FOR ALL
USING (
  public.has_org_permission(organization_id, 'announcement.manage')
  AND public.can_read_classroom_ops(organization_id, classroom_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'announcement.manage')
  AND public.can_read_classroom_ops(organization_id, classroom_id)
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
  AND contains_student_pii = false
);

CREATE POLICY reinforcement_systems_select ON public.reinforcement_systems FOR SELECT
USING (
  (student_id IS NOT NULL AND public.can_read_ef(organization_id, student_id))
  OR (classroom_id IS NOT NULL AND public.can_read_classroom_ops(organization_id, classroom_id))
);

CREATE POLICY reinforcement_systems_mutate ON public.reinforcement_systems FOR ALL
USING (
  public.has_org_permission(organization_id, 'reinforcement.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
  AND (
    (student_id IS NOT NULL AND public.can_read_student(organization_id, student_id))
    OR (classroom_id IS NOT NULL AND public.can_read_classroom_ops(organization_id, classroom_id))
  )
)
WITH CHECK (
  public.has_org_permission(organization_id, 'reinforcement.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
  AND (
    (student_id IS NOT NULL AND public.can_read_student(organization_id, student_id))
    OR (classroom_id IS NOT NULL AND public.can_read_classroom_ops(organization_id, classroom_id))
  )
);

CREATE POLICY reinforcement_options_select ON public.reinforcement_options FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.reinforcement_systems s
    WHERE s.id = reinforcement_system_id
      AND (
        (s.student_id IS NOT NULL AND public.can_read_ef(s.organization_id, s.student_id))
        OR (s.classroom_id IS NOT NULL AND public.can_read_classroom_ops(s.organization_id, s.classroom_id))
      )
  )
);

CREATE POLICY reinforcement_options_mutate ON public.reinforcement_options FOR ALL
USING (
  public.has_org_permission(organization_id, 'reinforcement.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'reinforcement.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY reinforcement_records_select ON public.reinforcement_records FOR SELECT
USING (
  (student_id IS NOT NULL AND public.can_read_ef(organization_id, student_id))
  OR EXISTS (
    SELECT 1 FROM public.reinforcement_systems s
    WHERE s.id = reinforcement_system_id
      AND s.classroom_id IS NOT NULL
      AND public.can_read_classroom_ops(s.organization_id, s.classroom_id)
  )
);

CREATE POLICY reinforcement_records_mutate ON public.reinforcement_records FOR ALL
USING (
  public.has_org_permission(organization_id, 'reinforcement.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'reinforcement.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY choice_boards_select ON public.choice_boards FOR SELECT
USING (
  (student_id IS NOT NULL AND public.can_read_student(organization_id, student_id))
  OR (classroom_id IS NOT NULL AND public.can_read_classroom_ops(organization_id, classroom_id))
);

CREATE POLICY choice_boards_mutate ON public.choice_boards FOR ALL
USING (
  public.has_org_permission(organization_id, 'reinforcement.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
  AND (
    (student_id IS NOT NULL AND public.can_read_student(organization_id, student_id))
    OR (classroom_id IS NOT NULL AND public.can_read_classroom_ops(organization_id, classroom_id))
  )
)
WITH CHECK (
  public.has_org_permission(organization_id, 'reinforcement.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
  AND (
    (student_id IS NOT NULL AND public.can_read_student(organization_id, student_id))
    OR (classroom_id IS NOT NULL AND public.can_read_classroom_ops(organization_id, classroom_id))
  )
);

CREATE POLICY choice_board_items_select ON public.choice_board_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.choice_boards b
    WHERE b.id = choice_board_id
      AND (
        (b.student_id IS NOT NULL AND public.can_read_student(b.organization_id, b.student_id))
        OR (b.classroom_id IS NOT NULL AND public.can_read_classroom_ops(b.organization_id, b.classroom_id))
      )
  )
);

CREATE POLICY choice_board_items_mutate ON public.choice_board_items FOR ALL
USING (
  public.has_org_permission(organization_id, 'reinforcement.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'reinforcement.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);
