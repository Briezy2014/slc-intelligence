-- 202607290002_behavior_detective.sql
-- Phase 10: behavior definitions, direct observations, corrections, and intensity scales.

INSERT INTO public.app_permissions (code, label, description) VALUES
  ('behavior.define', 'Define behaviors', 'Create and manage observable behavior definitions'),
  ('behavior.observe', 'Record behavior observations', 'Enter draft behavior observation data'),
  ('behavior.finalize', 'Finalize behavior observations', 'Finalize and correct behavior observation data'),
  ('behavior.read', 'Read behavior data', 'View authorized behavior definitions and observations'),
  ('behavior.configure', 'Configure behavior settings', 'Manage organization-wide behavior settings')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code)
SELECT 'organization_admin', code
FROM public.app_permissions
WHERE code IN ('behavior.define', 'behavior.observe', 'behavior.finalize', 'behavior.read', 'behavior.configure')
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code) VALUES
  ('district_sped_admin', 'behavior.define'),
  ('district_sped_admin', 'behavior.observe'),
  ('district_sped_admin', 'behavior.finalize'),
  ('district_sped_admin', 'behavior.read'),
  ('district_sped_admin', 'behavior.configure'),
  ('building_admin', 'behavior.observe'),
  ('building_admin', 'behavior.read'),
  ('program_admin', 'behavior.define'),
  ('program_admin', 'behavior.observe'),
  ('program_admin', 'behavior.finalize'),
  ('program_admin', 'behavior.read'),
  ('intervention_specialist', 'behavior.define'),
  ('intervention_specialist', 'behavior.observe'),
  ('intervention_specialist', 'behavior.finalize'),
  ('intervention_specialist', 'behavior.read'),
  ('case_manager', 'behavior.define'),
  ('case_manager', 'behavior.observe'),
  ('case_manager', 'behavior.finalize'),
  ('case_manager', 'behavior.read'),
  ('special_education_teacher', 'behavior.observe'),
  ('special_education_teacher', 'behavior.read'),
  ('related_service_provider', 'behavior.observe'),
  ('related_service_provider', 'behavior.read'),
  ('school_psychologist', 'behavior.define'),
  ('school_psychologist', 'behavior.observe'),
  ('school_psychologist', 'behavior.finalize'),
  ('school_psychologist', 'behavior.read'),
  ('paraprofessional', 'behavior.observe'),
  ('paraprofessional', 'behavior.read'),
  ('read_only_reviewer', 'behavior.read')
ON CONFLICT DO NOTHING;

CREATE TABLE public.behavior_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  name text NOT NULL,
  operational_definition text NOT NULL,
  measurement_notes text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, student_id, name)
);

CREATE INDEX behavior_definitions_org_idx ON public.behavior_definitions(organization_id);
CREATE INDEX behavior_definitions_student_idx ON public.behavior_definitions(student_id);
CREATE INDEX behavior_definitions_status_idx ON public.behavior_definitions(organization_id, status);
CREATE TRIGGER behavior_definitions_set_updated_at BEFORE UPDATE ON public.behavior_definitions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.behavior_definition_examples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  behavior_definition_id uuid NOT NULL REFERENCES public.behavior_definitions(id) ON DELETE CASCADE,
  example_text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX behavior_definition_examples_behavior_idx ON public.behavior_definition_examples(behavior_definition_id);

CREATE TABLE public.behavior_definition_nonexamples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  behavior_definition_id uuid NOT NULL REFERENCES public.behavior_definitions(id) ON DELETE CASCADE,
  nonexample_text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX behavior_definition_nonexamples_behavior_idx ON public.behavior_definition_nonexamples(behavior_definition_id);

CREATE TABLE public.replacement_behavior_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  behavior_definition_id uuid REFERENCES public.behavior_definitions(id) ON DELETE SET NULL,
  name text NOT NULL,
  replacement_statement text NOT NULL,
  teaching_notes text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX replacement_behaviors_org_idx ON public.replacement_behavior_definitions(organization_id);
CREATE INDEX replacement_behaviors_student_idx ON public.replacement_behavior_definitions(student_id);
CREATE INDEX replacement_behaviors_behavior_idx ON public.replacement_behavior_definitions(behavior_definition_id);
CREATE TRIGGER replacement_behaviors_set_updated_at BEFORE UPDATE ON public.replacement_behavior_definitions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.intensity_scale_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  behavior_id uuid REFERENCES public.behavior_definitions(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, behavior_id, name)
);

CREATE INDEX intensity_scale_definitions_org_idx ON public.intensity_scale_definitions(organization_id);
CREATE INDEX intensity_scale_definitions_behavior_idx ON public.intensity_scale_definitions(behavior_id);
CREATE TRIGGER intensity_scales_set_updated_at BEFORE UPDATE ON public.intensity_scale_definitions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.intensity_scale_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scale_id uuid NOT NULL REFERENCES public.intensity_scale_definitions(id) ON DELETE CASCADE,
  level_number integer NOT NULL CHECK (level_number > 0),
  label text NOT NULL,
  observable_anchor text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (scale_id, level_number)
);

CREATE INDEX intensity_scale_levels_scale_idx ON public.intensity_scale_levels(scale_id);

CREATE TABLE public.behavior_observation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  behavior_definition_id uuid NOT NULL REFERENCES public.behavior_definitions(id) ON DELETE RESTRICT,
  measurement_method text NOT NULL CHECK (
    measurement_method IN ('abc', 'frequency', 'duration', 'latency', 'interval', 'intensity')
  ),
  session_date date NOT NULL,
  session_time time,
  observer_user_id uuid REFERENCES public.user_profiles(id),
  setting text,
  activity text,
  people_present text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'corrected', 'archived')),
  notes text,
  finalized_at timestamptz,
  finalized_by uuid REFERENCES public.user_profiles(id),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX behavior_sessions_org_idx ON public.behavior_observation_sessions(organization_id);
CREATE INDEX behavior_sessions_student_idx ON public.behavior_observation_sessions(student_id);
CREATE INDEX behavior_sessions_behavior_idx ON public.behavior_observation_sessions(behavior_definition_id);
CREATE INDEX behavior_sessions_status_idx ON public.behavior_observation_sessions(organization_id, status);
CREATE INDEX behavior_sessions_date_idx ON public.behavior_observation_sessions(student_id, session_date);
CREATE TRIGGER behavior_sessions_set_updated_at BEFORE UPDATE ON public.behavior_observation_sessions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Subtype observation tables are used for data integrity and measurement-specific checks
-- instead of storing all measurement variants in unconstrained JSON.
CREATE TABLE public.abc_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.behavior_observation_sessions(id) ON DELETE CASCADE,
  recorded_antecedent text NOT NULL,
  observable_behavior text NOT NULL,
  recorded_consequence text NOT NULL,
  duration_seconds numeric CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  intensity_level_id uuid REFERENCES public.intensity_scale_levels(id) ON DELETE SET NULL,
  replacement_observed boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX abc_observations_session_idx ON public.abc_observations(session_id);

CREATE TABLE public.frequency_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL UNIQUE REFERENCES public.behavior_observation_sessions(id) ON DELETE CASCADE,
  count integer NOT NULL CHECK (count >= 0),
  observation_duration_seconds numeric NOT NULL CHECK (observation_duration_seconds > 0),
  calculated_rate_per_minute numeric CHECK (calculated_rate_per_minute IS NULL OR calculated_rate_per_minute >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.duration_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL UNIQUE REFERENCES public.behavior_observation_sessions(id) ON DELETE CASCADE,
  total_duration_seconds numeric NOT NULL CHECK (total_duration_seconds >= 0),
  episode_count integer NOT NULL CHECK (episode_count >= 0),
  average_episode_seconds numeric CHECK (average_episode_seconds IS NULL OR average_episode_seconds >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.latency_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL UNIQUE REFERENCES public.behavior_observation_sessions(id) ON DELETE CASCADE,
  trigger_description text NOT NULL,
  latency_seconds numeric NOT NULL CHECK (latency_seconds >= 0),
  response_description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.interval_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL UNIQUE REFERENCES public.behavior_observation_sessions(id) ON DELETE CASCADE,
  recording_method text NOT NULL CHECK (recording_method IN ('whole', 'partial', 'momentary')),
  interval_duration_seconds numeric NOT NULL CHECK (interval_duration_seconds > 0),
  interval_count integer NOT NULL CHECK (interval_count > 0),
  intervals_positive integer NOT NULL CHECK (intervals_positive >= 0),
  percentage_of_intervals numeric CHECK (percentage_of_intervals IS NULL OR percentage_of_intervals BETWEEN 0 AND 100),
  interval_results jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (intervals_positive <= interval_count)
);

CREATE TABLE public.intensity_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL UNIQUE REFERENCES public.behavior_observation_sessions(id) ON DELETE CASCADE,
  intensity_level_id uuid NOT NULL REFERENCES public.intensity_scale_levels(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.behavior_entry_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.behavior_observation_sessions(id) ON DELETE CASCADE,
  from_status text CHECK (from_status IN ('draft', 'finalized', 'corrected', 'archived')),
  to_status text NOT NULL CHECK (to_status IN ('draft', 'finalized', 'corrected', 'archived')),
  changed_by uuid REFERENCES public.user_profiles(id),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX behavior_entry_status_history_session_idx ON public.behavior_entry_status_history(session_id, created_at DESC);

CREATE TABLE public.behavior_observation_corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.behavior_observation_sessions(id) ON DELETE CASCADE,
  previous_snapshot jsonb NOT NULL,
  corrected_by uuid NOT NULL REFERENCES public.user_profiles(id),
  corrected_at timestamptz NOT NULL DEFAULT now(),
  reason text NOT NULL
);

CREATE INDEX behavior_observation_corrections_session_idx ON public.behavior_observation_corrections(session_id);

CREATE OR REPLACE FUNCTION public.can_read_behavior(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'behavior.read')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_define_behavior(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'behavior.define')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

CREATE OR REPLACE FUNCTION public.can_observe_behavior(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'behavior.observe')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_finalize_behavior(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'behavior.finalize')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

ALTER TABLE public.behavior_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_definitions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_definition_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_definition_examples FORCE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_definition_nonexamples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_definition_nonexamples FORCE ROW LEVEL SECURITY;
ALTER TABLE public.replacement_behavior_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replacement_behavior_definitions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intensity_scale_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intensity_scale_definitions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intensity_scale_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intensity_scale_levels FORCE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_observation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_observation_sessions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.abc_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abc_observations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.frequency_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frequency_observations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.duration_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duration_observations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.latency_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.latency_observations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.interval_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interval_observations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intensity_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intensity_ratings FORCE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_entry_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_entry_status_history FORCE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_observation_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_observation_corrections FORCE ROW LEVEL SECURITY;

CREATE POLICY behavior_definitions_select ON public.behavior_definitions FOR SELECT
USING (public.can_read_behavior(organization_id, student_id));

CREATE POLICY behavior_definitions_insert ON public.behavior_definitions FOR INSERT
WITH CHECK (public.can_define_behavior(organization_id, student_id));

CREATE POLICY behavior_definitions_update ON public.behavior_definitions FOR UPDATE
USING (public.can_define_behavior(organization_id, student_id))
WITH CHECK (public.can_define_behavior(organization_id, student_id));

CREATE POLICY behavior_examples_select ON public.behavior_definition_examples FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_definitions b
    WHERE b.id = behavior_definition_id AND public.can_read_behavior(b.organization_id, b.student_id)
  )
);

CREATE POLICY behavior_examples_mutate ON public.behavior_definition_examples FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_definitions b
    WHERE b.id = behavior_definition_id AND public.can_define_behavior(b.organization_id, b.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.behavior_definitions b
    WHERE b.id = behavior_definition_id AND public.can_define_behavior(b.organization_id, b.student_id)
  )
);

CREATE POLICY behavior_nonexamples_select ON public.behavior_definition_nonexamples FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_definitions b
    WHERE b.id = behavior_definition_id AND public.can_read_behavior(b.organization_id, b.student_id)
  )
);

CREATE POLICY behavior_nonexamples_mutate ON public.behavior_definition_nonexamples FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_definitions b
    WHERE b.id = behavior_definition_id AND public.can_define_behavior(b.organization_id, b.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.behavior_definitions b
    WHERE b.id = behavior_definition_id AND public.can_define_behavior(b.organization_id, b.student_id)
  )
);

CREATE POLICY replacement_behaviors_select ON public.replacement_behavior_definitions FOR SELECT
USING (public.can_read_behavior(organization_id, student_id));

CREATE POLICY replacement_behaviors_mutate ON public.replacement_behavior_definitions FOR ALL
USING (public.can_define_behavior(organization_id, student_id))
WITH CHECK (public.can_define_behavior(organization_id, student_id));

CREATE POLICY intensity_scales_select ON public.intensity_scale_definitions FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND public.has_org_permission(organization_id, 'behavior.read')
);

CREATE POLICY intensity_scales_mutate ON public.intensity_scale_definitions FOR ALL
USING (
  (
    public.has_org_permission(organization_id, 'behavior.configure')
    AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
  )
  OR EXISTS (
    SELECT 1 FROM public.behavior_definitions b
    WHERE b.id = behavior_id AND public.can_define_behavior(b.organization_id, b.student_id)
  )
)
WITH CHECK (
  (
    public.has_org_permission(organization_id, 'behavior.configure')
    AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
  )
  OR EXISTS (
    SELECT 1 FROM public.behavior_definitions b
    WHERE b.id = behavior_id AND public.can_define_behavior(b.organization_id, b.student_id)
  )
);

CREATE POLICY intensity_levels_select ON public.intensity_scale_levels FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intensity_scale_definitions s
    WHERE s.id = scale_id
      AND public.is_org_member(s.organization_id)
      AND public.has_org_permission(s.organization_id, 'behavior.read')
  )
);

CREATE POLICY intensity_levels_mutate ON public.intensity_scale_levels FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.intensity_scale_definitions s
    LEFT JOIN public.behavior_definitions b ON b.id = s.behavior_id
    WHERE s.id = scale_id
      AND (
        (
          public.has_org_permission(s.organization_id, 'behavior.configure')
          AND public.member_role(s.organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
        )
        OR (b.id IS NOT NULL AND public.can_define_behavior(b.organization_id, b.student_id))
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intensity_scale_definitions s
    LEFT JOIN public.behavior_definitions b ON b.id = s.behavior_id
    WHERE s.id = scale_id
      AND (
        (
          public.has_org_permission(s.organization_id, 'behavior.configure')
          AND public.member_role(s.organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
        )
        OR (b.id IS NOT NULL AND public.can_define_behavior(b.organization_id, b.student_id))
      )
  )
);

CREATE POLICY behavior_sessions_select ON public.behavior_observation_sessions FOR SELECT
USING (public.can_read_behavior(organization_id, student_id));

CREATE POLICY behavior_sessions_insert ON public.behavior_observation_sessions FOR INSERT
WITH CHECK (
  (
    status = 'draft'
    AND public.can_observe_behavior(organization_id, student_id)
  )
  OR (
    status IN ('finalized', 'corrected')
    AND public.can_finalize_behavior(organization_id, student_id)
  )
);

CREATE POLICY behavior_sessions_update ON public.behavior_observation_sessions FOR UPDATE
USING (
  (status = 'draft' AND public.can_observe_behavior(organization_id, student_id))
  OR public.can_finalize_behavior(organization_id, student_id)
)
WITH CHECK (
  (
    status = 'draft'
    AND public.can_observe_behavior(organization_id, student_id)
  )
  OR (
    status IN ('finalized', 'corrected', 'archived')
    AND public.can_finalize_behavior(organization_id, student_id)
  )
);

CREATE POLICY abc_observations_select ON public.abc_observations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND public.can_read_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY abc_observations_mutate ON public.abc_observations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND s.status = 'draft' AND public.can_observe_behavior(s.organization_id, s.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND s.status = 'draft' AND public.can_observe_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY frequency_observations_select ON public.frequency_observations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND public.can_read_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY frequency_observations_mutate ON public.frequency_observations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND s.status = 'draft' AND public.can_observe_behavior(s.organization_id, s.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND s.status = 'draft' AND public.can_observe_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY duration_observations_select ON public.duration_observations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND public.can_read_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY duration_observations_mutate ON public.duration_observations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND s.status = 'draft' AND public.can_observe_behavior(s.organization_id, s.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND s.status = 'draft' AND public.can_observe_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY latency_observations_select ON public.latency_observations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND public.can_read_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY latency_observations_mutate ON public.latency_observations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND s.status = 'draft' AND public.can_observe_behavior(s.organization_id, s.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND s.status = 'draft' AND public.can_observe_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY interval_observations_select ON public.interval_observations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND public.can_read_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY interval_observations_mutate ON public.interval_observations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND s.status = 'draft' AND public.can_observe_behavior(s.organization_id, s.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND s.status = 'draft' AND public.can_observe_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY intensity_ratings_select ON public.intensity_ratings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND public.can_read_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY intensity_ratings_mutate ON public.intensity_ratings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND s.status = 'draft' AND public.can_observe_behavior(s.organization_id, s.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND s.status = 'draft' AND public.can_observe_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY behavior_status_history_select ON public.behavior_entry_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND public.can_read_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY behavior_status_history_insert ON public.behavior_entry_status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id
      AND (
        public.can_observe_behavior(s.organization_id, s.student_id)
        OR public.can_finalize_behavior(s.organization_id, s.student_id)
      )
  )
);

CREATE POLICY behavior_corrections_select ON public.behavior_observation_corrections FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND public.can_read_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY behavior_corrections_insert ON public.behavior_observation_corrections FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND public.can_finalize_behavior(s.organization_id, s.student_id)
  )
);
