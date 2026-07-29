-- 202607290003_behavior_analytics_fba.sql
-- Phase 11: behavior analytics support, ABC categorization, time blocks, and FBA workspaces.

INSERT INTO public.app_permissions (code, label, description) VALUES
  ('fba.manage', 'Manage FBA workspaces', 'Create and manage functional behavior assessment evidence workspaces'),
  ('fba.read', 'Read FBA workspaces', 'View authorized functional behavior assessment evidence')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code)
SELECT 'organization_admin', code
FROM public.app_permissions
WHERE code IN ('fba.manage', 'fba.read')
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code) VALUES
  ('district_sped_admin', 'fba.manage'),
  ('district_sped_admin', 'fba.read'),
  ('building_admin', 'fba.manage'),
  ('building_admin', 'fba.read'),
  ('program_admin', 'fba.manage'),
  ('program_admin', 'fba.read'),
  ('intervention_specialist', 'fba.manage'),
  ('intervention_specialist', 'fba.read'),
  ('case_manager', 'fba.manage'),
  ('case_manager', 'fba.read'),
  ('special_education_teacher', 'fba.read'),
  ('related_service_provider', 'fba.read'),
  ('school_psychologist', 'fba.read'),
  ('read_only_reviewer', 'fba.read')
ON CONFLICT DO NOTHING;

CREATE TABLE public.abc_category_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  category_type text NOT NULL CHECK (category_type IN ('antecedent', 'consequence')),
  code text NOT NULL,
  label text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, category_type, code)
);

CREATE INDEX abc_category_options_org_idx ON public.abc_category_options(organization_id);
CREATE INDEX abc_category_options_type_idx ON public.abc_category_options(organization_id, category_type, active);
CREATE TRIGGER abc_category_options_set_updated_at BEFORE UPDATE ON public.abc_category_options
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.abc_observation_category_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  abc_observation_id uuid NOT NULL REFERENCES public.abc_observations(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.behavior_observation_sessions(id) ON DELETE CASCADE,
  category_type text NOT NULL CHECK (category_type IN ('antecedent', 'consequence')),
  category_code text NOT NULL,
  source text NOT NULL DEFAULT 'suggested' CHECK (source IN ('suggested', 'confirmed')),
  confirmed_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (abc_observation_id, category_type, category_code)
);

CREATE INDEX abc_category_assignments_abc_idx ON public.abc_observation_category_assignments(abc_observation_id);
CREATE INDEX abc_category_assignments_session_idx ON public.abc_observation_category_assignments(session_id);

CREATE TABLE public.organization_time_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  code text NOT NULL,
  label text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  sort_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code),
  CHECK (end_time > start_time)
);

CREATE INDEX organization_time_blocks_org_idx ON public.organization_time_blocks(organization_id);
CREATE TRIGGER organization_time_blocks_set_updated_at BEFORE UPDATE ON public.organization_time_blocks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fba_evidence_workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  behavior_definition_id uuid NOT NULL REFERENCES public.behavior_definitions(id) ON DELETE RESTRICT,
  date_range_start date NOT NULL,
  date_range_end date NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'archived')),
  educator_hypothesis text,
  hypothesis_confirmed boolean NOT NULL DEFAULT false,
  hypothesis_confirmed_by uuid REFERENCES public.user_profiles(id),
  hypothesis_confirmed_at timestamptz,
  team_notes text,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (date_range_end >= date_range_start)
);

CREATE INDEX fba_workspaces_org_idx ON public.fba_evidence_workspaces(organization_id);
CREATE INDEX fba_workspaces_student_idx ON public.fba_evidence_workspaces(student_id);
CREATE INDEX fba_workspaces_behavior_idx ON public.fba_evidence_workspaces(behavior_definition_id);
CREATE INDEX fba_workspaces_status_idx ON public.fba_evidence_workspaces(organization_id, status);
CREATE INDEX fba_workspaces_dates_idx ON public.fba_evidence_workspaces(student_id, date_range_start, date_range_end);
CREATE TRIGGER fba_workspaces_set_updated_at BEFORE UPDATE ON public.fba_evidence_workspaces
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fba_evidence_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.fba_evidence_workspaces(id) ON DELETE CASCADE,
  evidence_type text NOT NULL CHECK (
    evidence_type IN ('behavior_session', 'abc_observation', 'frequency_observation', 'duration_observation', 'latency_observation', 'interval_observation', 'intensity_rating', 'analytics_range')
  ),
  evidence_id uuid,
  label text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX fba_evidence_links_workspace_idx ON public.fba_evidence_links(workspace_id);
CREATE INDEX fba_evidence_links_type_idx ON public.fba_evidence_links(evidence_type, evidence_id);

CREATE TABLE public.fba_workspace_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.fba_evidence_workspaces(id) ON DELETE CASCADE,
  from_status text CHECK (from_status IN ('draft', 'in_review', 'archived')),
  to_status text NOT NULL CHECK (to_status IN ('draft', 'in_review', 'archived')),
  changed_by uuid REFERENCES public.user_profiles(id),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX fba_status_history_workspace_idx ON public.fba_workspace_status_history(workspace_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.can_read_fba(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.can_read_student(p_org_id, p_student_id)
    AND (
      public.has_org_permission(p_org_id, 'fba.read')
      OR public.has_org_permission(p_org_id, 'behavior.read')
    );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_fba(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'fba.manage')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

ALTER TABLE public.abc_category_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abc_category_options FORCE ROW LEVEL SECURITY;
ALTER TABLE public.abc_observation_category_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abc_observation_category_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.organization_time_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_time_blocks FORCE ROW LEVEL SECURITY;
ALTER TABLE public.fba_evidence_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fba_evidence_workspaces FORCE ROW LEVEL SECURITY;
ALTER TABLE public.fba_evidence_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fba_evidence_links FORCE ROW LEVEL SECURITY;
ALTER TABLE public.fba_workspace_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fba_workspace_status_history FORCE ROW LEVEL SECURITY;

CREATE POLICY abc_category_options_select ON public.abc_category_options FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND (
    public.has_org_permission(organization_id, 'behavior.read')
    OR public.has_org_permission(organization_id, 'fba.read')
  )
);

CREATE POLICY abc_category_options_mutate ON public.abc_category_options FOR ALL
USING (
  (
    public.has_org_permission(organization_id, 'behavior.configure')
    OR public.has_org_permission(organization_id, 'fba.manage')
  )
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  (
    public.has_org_permission(organization_id, 'behavior.configure')
    OR public.has_org_permission(organization_id, 'fba.manage')
  )
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY abc_category_assignments_select ON public.abc_observation_category_assignments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id AND public.can_read_behavior(s.organization_id, s.student_id)
  )
);

CREATE POLICY abc_category_assignments_mutate ON public.abc_observation_category_assignments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id
      AND (
        public.can_finalize_behavior(s.organization_id, s.student_id)
        OR public.can_manage_fba(s.organization_id, s.student_id)
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.behavior_observation_sessions s
    WHERE s.id = session_id
      AND (
        public.can_finalize_behavior(s.organization_id, s.student_id)
        OR public.can_manage_fba(s.organization_id, s.student_id)
      )
  )
);

CREATE POLICY organization_time_blocks_select ON public.organization_time_blocks FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND (
    public.has_org_permission(organization_id, 'behavior.read')
    OR public.has_org_permission(organization_id, 'fba.read')
  )
);

CREATE POLICY organization_time_blocks_mutate ON public.organization_time_blocks FOR ALL
USING (
  (
    public.has_org_permission(organization_id, 'behavior.configure')
    OR public.has_org_permission(organization_id, 'fba.manage')
  )
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  (
    public.has_org_permission(organization_id, 'behavior.configure')
    OR public.has_org_permission(organization_id, 'fba.manage')
  )
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY fba_workspaces_select ON public.fba_evidence_workspaces FOR SELECT
USING (public.can_read_fba(organization_id, student_id));

CREATE POLICY fba_workspaces_insert ON public.fba_evidence_workspaces FOR INSERT
WITH CHECK (
  status IN ('draft', 'in_review')
  AND public.can_manage_fba(organization_id, student_id)
);

CREATE POLICY fba_workspaces_update ON public.fba_evidence_workspaces FOR UPDATE
USING (public.can_manage_fba(organization_id, student_id))
WITH CHECK (public.can_manage_fba(organization_id, student_id));

CREATE POLICY fba_evidence_links_select ON public.fba_evidence_links FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.fba_evidence_workspaces w
    WHERE w.id = workspace_id AND public.can_read_fba(w.organization_id, w.student_id)
  )
);

CREATE POLICY fba_evidence_links_mutate ON public.fba_evidence_links FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.fba_evidence_workspaces w
    WHERE w.id = workspace_id AND public.can_manage_fba(w.organization_id, w.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.fba_evidence_workspaces w
    WHERE w.id = workspace_id AND public.can_manage_fba(w.organization_id, w.student_id)
  )
);

CREATE POLICY fba_status_history_select ON public.fba_workspace_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.fba_evidence_workspaces w
    WHERE w.id = workspace_id AND public.can_read_fba(w.organization_id, w.student_id)
  )
);

CREATE POLICY fba_status_history_insert ON public.fba_workspace_status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.fba_evidence_workspaces w
    WHERE w.id = workspace_id AND public.can_manage_fba(w.organization_id, w.student_id)
  )
);
