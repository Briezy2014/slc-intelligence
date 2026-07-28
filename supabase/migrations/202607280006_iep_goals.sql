-- 202607280006_iep_goals.sql

CREATE TABLE public.iep_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  label text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  review_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  updated_by uuid REFERENCES public.user_profiles(id),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX iep_cycles_student_idx ON public.iep_cycles(student_id);
CREATE TRIGGER iep_cycles_set_updated_at BEFORE UPDATE ON public.iep_cycles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.measurement_types (
  code text PRIMARY KEY,
  label text NOT NULL,
  description text NOT NULL,
  higher_is_better boolean NOT NULL DEFAULT true
);

INSERT INTO public.measurement_types (code, label, description, higher_is_better) VALUES
  ('percentage', 'Percentage', 'Correct opportunities / total opportunities', true),
  ('frequency', 'Frequency', 'Count within an observation window', false),
  ('rate', 'Rate', 'Count per unit time', false),
  ('duration', 'Duration', 'Elapsed time measurement', false),
  ('latency', 'Latency', 'Time to initiate after cue', false),
  ('rubric', 'Rubric score', 'Ordered rubric level or numeric score', true),
  ('prompt_level', 'Prompt level', 'Prompt intensity / independence', true),
  ('task_analysis', 'Task analysis', 'Step-level independence summary', true),
  ('reading_fluency', 'Reading fluency', 'Words correct per minute', true),
  ('reading_accuracy', 'Reading accuracy', 'Correct items / total items', true),
  ('independence', 'Independence level', 'Independence rating', true),
  ('custom_numeric', 'Custom numeric', 'Custom numeric measure with declared direction', true);

CREATE TABLE public.iep_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  iep_cycle_id uuid NOT NULL REFERENCES public.iep_cycles(id) ON DELETE CASCADE,
  goal_area text NOT NULL,
  goal_statement text NOT NULL,
  measurement_type text NOT NULL REFERENCES public.measurement_types(code),
  unit_of_measurement text,
  evaluation_frequency text,
  target_value numeric,
  target_direction text NOT NULL DEFAULT 'increase' CHECK (target_direction IN ('increase', 'decrease')),
  start_date date,
  target_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived', 'mastered_review')),
  responsible_user_id uuid REFERENCES public.user_profiles(id),
  created_by uuid REFERENCES public.user_profiles(id),
  updated_by uuid REFERENCES public.user_profiles(id),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (target_date IS NULL OR start_date IS NULL OR target_date >= start_date)
);

CREATE INDEX iep_goals_student_idx ON public.iep_goals(student_id);
CREATE INDEX iep_goals_org_idx ON public.iep_goals(organization_id);
CREATE TRIGGER iep_goals_set_updated_at BEFORE UPDATE ON public.iep_goals
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.iep_objectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  goal_id uuid NOT NULL REFERENCES public.iep_goals(id) ON DELETE CASCADE,
  sequence_no integer NOT NULL DEFAULT 1,
  objective_statement text NOT NULL,
  target_value numeric,
  measurement_type text REFERENCES public.measurement_types(code),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  start_date date,
  target_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX iep_objectives_goal_idx ON public.iep_objectives(goal_id);

CREATE TABLE public.goal_baselines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  goal_id uuid NOT NULL REFERENCES public.iep_goals(id) ON DELETE CASCADE,
  baseline_date date NOT NULL,
  measurement_type text NOT NULL REFERENCES public.measurement_types(code),
  numeric_value numeric,
  unit text,
  correct_count integer,
  total_opportunities integer,
  prompt_level text,
  setting text,
  conditions text,
  notes text,
  entered_by uuid REFERENCES public.user_profiles(id),
  source_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (total_opportunities IS NULL OR total_opportunities > 0),
  CHECK (correct_count IS NULL OR total_opportunities IS NULL OR correct_count <= total_opportunities)
);

CREATE TABLE public.goal_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  goal_id uuid NOT NULL REFERENCES public.iep_goals(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  changed_by uuid REFERENCES public.user_profiles(id),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.can_manage_goal(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'goal.manage')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

ALTER TABLE public.iep_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iep_cycles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.iep_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iep_goals FORCE ROW LEVEL SECURITY;
ALTER TABLE public.iep_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iep_objectives FORCE ROW LEVEL SECURITY;
ALTER TABLE public.goal_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_baselines FORCE ROW LEVEL SECURITY;
ALTER TABLE public.goal_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_status_history FORCE ROW LEVEL SECURITY;

CREATE POLICY iep_cycles_select ON public.iep_cycles FOR SELECT
USING (public.can_read_student(organization_id, student_id) AND public.has_org_permission(organization_id, 'goal.read'));

CREATE POLICY iep_cycles_mutate ON public.iep_cycles FOR ALL
USING (public.can_manage_goal(organization_id, student_id))
WITH CHECK (public.can_manage_goal(organization_id, student_id));

CREATE POLICY iep_goals_select ON public.iep_goals FOR SELECT
USING (public.can_read_student(organization_id, student_id) AND public.has_org_permission(organization_id, 'goal.read'));

CREATE POLICY iep_goals_mutate ON public.iep_goals FOR ALL
USING (public.can_manage_goal(organization_id, student_id))
WITH CHECK (public.can_manage_goal(organization_id, student_id));

CREATE POLICY iep_objectives_select ON public.iep_objectives FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.iep_goals g
    WHERE g.id = goal_id
      AND g.organization_id = iep_objectives.organization_id
      AND public.can_read_student(g.organization_id, g.student_id)
      AND public.has_org_permission(g.organization_id, 'goal.read')
  )
);

CREATE POLICY iep_objectives_mutate ON public.iep_objectives FOR ALL
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

CREATE POLICY goal_baselines_select ON public.goal_baselines FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.iep_goals g
    WHERE g.id = goal_id AND public.can_read_student(g.organization_id, g.student_id)
  )
);

CREATE POLICY goal_baselines_mutate ON public.goal_baselines FOR ALL
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

CREATE POLICY goal_status_select ON public.goal_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.iep_goals g
    WHERE g.id = goal_id AND public.can_read_student(g.organization_id, g.student_id)
  )
);

CREATE POLICY goal_status_insert ON public.goal_status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.iep_goals g
    WHERE g.id = goal_id AND public.can_manage_goal(g.organization_id, g.student_id)
  )
);
