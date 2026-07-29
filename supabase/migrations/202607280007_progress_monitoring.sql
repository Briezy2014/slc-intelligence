-- 202607280007_progress_monitoring.sql

CREATE TABLE public.prompt_level_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  code text NOT NULL,
  label text NOT NULL,
  hierarchy_position integer NOT NULL,
  independence_value numeric,
  UNIQUE (organization_id, code)
);

CREATE TABLE public.intervention_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  goal_id uuid NOT NULL REFERENCES public.iep_goals(id) ON DELETE CASCADE,
  label text NOT NULL,
  phase_type text NOT NULL DEFAULT 'intervention' CHECK (phase_type IN ('baseline', 'intervention', 'maintenance', 'generalization', 'other')),
  start_date date NOT NULL,
  end_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX intervention_phases_goal_idx ON public.intervention_phases(goal_id);

CREATE TABLE public.progress_monitoring_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  goal_id uuid NOT NULL REFERENCES public.iep_goals(id) ON DELETE CASCADE,
  objective_id uuid REFERENCES public.iep_objectives(id) ON DELETE SET NULL,
  session_date date NOT NULL,
  collector_user_id uuid REFERENCES public.user_profiles(id),
  setting text,
  activity text,
  intervention_phase_id uuid REFERENCES public.intervention_phases(id) ON DELETE SET NULL,
  measurement_type text NOT NULL REFERENCES public.measurement_types(code),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'corrected', 'archived')),
  notes text,
  finalized_at timestamptz,
  finalized_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX progress_sessions_goal_date_idx ON public.progress_monitoring_sessions(goal_id, session_date);
CREATE INDEX progress_sessions_student_idx ON public.progress_monitoring_sessions(student_id);
CREATE INDEX progress_sessions_org_idx ON public.progress_monitoring_sessions(organization_id);

CREATE TABLE public.progress_data_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.progress_monitoring_sessions(id) ON DELETE CASCADE,
  measurement_type text NOT NULL REFERENCES public.measurement_types(code),
  -- Raw evidence fields (nullable by measurement type)
  correct_count integer,
  total_opportunities integer,
  calculated_percentage numeric,
  count_value integer,
  observation_duration_seconds numeric,
  calculated_rate numeric,
  rate_unit text,
  duration_value numeric,
  duration_unit text,
  latency_value numeric,
  latency_unit text,
  rubric_score numeric,
  rubric_max numeric,
  rubric_level text,
  prompt_level text,
  prompt_hierarchy_position integer,
  independence_value numeric,
  words_read integer,
  error_count integer,
  reading_time_seconds numeric,
  words_correct_per_minute numeric,
  accuracy_percentage numeric,
  task_independent_steps integer,
  task_prompted_steps integer,
  task_incorrect_steps integer,
  task_not_attempted_steps integer,
  custom_numeric_value numeric,
  custom_unit text,
  higher_is_better boolean,
  step_responses jsonb,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (total_opportunities IS NULL OR total_opportunities > 0),
  CHECK (correct_count IS NULL OR total_opportunities IS NULL OR correct_count <= total_opportunities),
  CHECK (observation_duration_seconds IS NULL OR observation_duration_seconds > 0)
);

CREATE INDEX progress_data_points_session_idx ON public.progress_data_points(session_id);

CREATE TABLE public.progress_entry_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.progress_monitoring_sessions(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  changed_by uuid REFERENCES public.user_profiles(id),
  note text,
  previous_snapshot jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.can_enter_progress(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'progress.enter')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_finalize_progress(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'progress.finalize')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

ALTER TABLE public.prompt_level_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_level_definitions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_phases FORCE ROW LEVEL SECURITY;
ALTER TABLE public.progress_monitoring_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_monitoring_sessions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.progress_data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_data_points FORCE ROW LEVEL SECURITY;
ALTER TABLE public.progress_entry_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_entry_status_history FORCE ROW LEVEL SECURITY;

CREATE POLICY prompt_defs_select ON public.prompt_level_definitions FOR SELECT
USING (public.is_org_member(organization_id));

CREATE POLICY prompt_defs_mutate ON public.prompt_level_definitions FOR ALL
USING (public.has_org_permission(organization_id, 'goal.manage'))
WITH CHECK (public.has_org_permission(organization_id, 'goal.manage'));

CREATE POLICY intervention_phases_select ON public.intervention_phases FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.iep_goals g
    WHERE g.id = goal_id AND public.can_read_student(g.organization_id, g.student_id)
  )
);

CREATE POLICY intervention_phases_mutate ON public.intervention_phases FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.iep_goals g
    WHERE g.id = goal_id AND public.can_manage_goal(g.organization_id, g.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.iep_goals g
    WHERE g.id = goal_id AND public.can_manage_goal(g.organization_id, g.student_id)
  )
);

CREATE POLICY progress_sessions_select ON public.progress_monitoring_sessions FOR SELECT
USING (
  public.has_org_permission(organization_id, 'progress.read')
  AND public.can_read_student(organization_id, student_id)
);

CREATE POLICY progress_sessions_insert ON public.progress_monitoring_sessions FOR INSERT
WITH CHECK (public.can_enter_progress(organization_id, student_id));

CREATE POLICY progress_sessions_update ON public.progress_monitoring_sessions FOR UPDATE
USING (
  (status = 'draft' AND public.can_enter_progress(organization_id, student_id))
  OR public.can_finalize_progress(organization_id, student_id)
)
WITH CHECK (
  (status IN ('draft', 'finalized', 'corrected', 'archived'))
  AND (
    public.can_enter_progress(organization_id, student_id)
    OR public.can_finalize_progress(organization_id, student_id)
  )
);

CREATE POLICY progress_points_select ON public.progress_data_points FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.progress_monitoring_sessions s
    WHERE s.id = session_id
      AND public.has_org_permission(s.organization_id, 'progress.read')
      AND public.can_read_student(s.organization_id, s.student_id)
  )
);

CREATE POLICY progress_points_mutate ON public.progress_data_points FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.progress_monitoring_sessions s
    WHERE s.id = session_id AND public.can_enter_progress(s.organization_id, s.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.progress_monitoring_sessions s
    WHERE s.id = session_id AND public.can_enter_progress(s.organization_id, s.student_id)
  )
);

CREATE POLICY progress_history_select ON public.progress_entry_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.progress_monitoring_sessions s
    WHERE s.id = session_id AND public.can_read_student(s.organization_id, s.student_id)
  )
);

CREATE POLICY progress_history_insert ON public.progress_entry_status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.progress_monitoring_sessions s
    WHERE s.id = session_id
      AND (
        public.can_enter_progress(s.organization_id, s.student_id)
        OR public.can_finalize_progress(s.organization_id, s.student_id)
      )
  )
);

GRANT SELECT ON public.app_roles, public.app_permissions, public.role_permissions, public.measurement_types TO authenticated, anon;
