-- 202607290004_intervention_intelligence.sql
-- Phase 12: intervention library, plans, fidelity, dosage, reviews, and outcomes.

INSERT INTO public.app_permissions (code, label, description) VALUES
  ('intervention.library.manage', 'Manage intervention library', 'Create and manage organization intervention library items'),
  ('intervention.plan.manage', 'Manage intervention plans', 'Create and edit student intervention plans'),
  ('intervention.plan.activate', 'Activate intervention plans', 'Approve, activate, pause, and close intervention plans'),
  ('intervention.fidelity.enter', 'Enter fidelity data', 'Enter draft intervention fidelity observations'),
  ('intervention.fidelity.finalize', 'Finalize fidelity data', 'Finalize and correct fidelity observations'),
  ('intervention.dosage.enter', 'Enter dosage data', 'Enter intervention dosage logs'),
  ('intervention.review', 'Review interventions', 'Record intervention reviews and recommendations'),
  ('intervention.read', 'Read interventions', 'View authorized intervention plans and evidence')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code)
SELECT 'organization_admin', code
FROM public.app_permissions
WHERE code LIKE 'intervention.%'
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code) VALUES
  ('district_sped_admin', 'intervention.library.manage'),
  ('district_sped_admin', 'intervention.plan.manage'),
  ('district_sped_admin', 'intervention.plan.activate'),
  ('district_sped_admin', 'intervention.fidelity.enter'),
  ('district_sped_admin', 'intervention.fidelity.finalize'),
  ('district_sped_admin', 'intervention.dosage.enter'),
  ('district_sped_admin', 'intervention.review'),
  ('district_sped_admin', 'intervention.read'),
  ('building_admin', 'intervention.plan.manage'),
  ('building_admin', 'intervention.plan.activate'),
  ('building_admin', 'intervention.fidelity.finalize'),
  ('building_admin', 'intervention.review'),
  ('building_admin', 'intervention.read'),
  ('program_admin', 'intervention.library.manage'),
  ('program_admin', 'intervention.plan.manage'),
  ('program_admin', 'intervention.plan.activate'),
  ('program_admin', 'intervention.fidelity.enter'),
  ('program_admin', 'intervention.fidelity.finalize'),
  ('program_admin', 'intervention.dosage.enter'),
  ('program_admin', 'intervention.review'),
  ('program_admin', 'intervention.read'),
  ('intervention_specialist', 'intervention.library.manage'),
  ('intervention_specialist', 'intervention.plan.manage'),
  ('intervention_specialist', 'intervention.plan.activate'),
  ('intervention_specialist', 'intervention.fidelity.enter'),
  ('intervention_specialist', 'intervention.fidelity.finalize'),
  ('intervention_specialist', 'intervention.dosage.enter'),
  ('intervention_specialist', 'intervention.review'),
  ('intervention_specialist', 'intervention.read'),
  ('case_manager', 'intervention.plan.manage'),
  ('case_manager', 'intervention.plan.activate'),
  ('case_manager', 'intervention.fidelity.enter'),
  ('case_manager', 'intervention.fidelity.finalize'),
  ('case_manager', 'intervention.dosage.enter'),
  ('case_manager', 'intervention.review'),
  ('case_manager', 'intervention.read'),
  ('special_education_teacher', 'intervention.fidelity.enter'),
  ('special_education_teacher', 'intervention.dosage.enter'),
  ('special_education_teacher', 'intervention.read'),
  ('related_service_provider', 'intervention.fidelity.enter'),
  ('related_service_provider', 'intervention.dosage.enter'),
  ('related_service_provider', 'intervention.read'),
  ('school_psychologist', 'intervention.review'),
  ('school_psychologist', 'intervention.read'),
  ('paraprofessional', 'intervention.fidelity.enter'),
  ('paraprofessional', 'intervention.dosage.enter'),
  ('paraprofessional', 'intervention.read'),
  ('read_only_reviewer', 'intervention.read')
ON CONFLICT DO NOTHING;

CREATE TABLE public.intervention_library_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  description text NOT NULL,
  evidence_level text NOT NULL DEFAULT 'promising' CHECK (
    evidence_level IN ('evidence_based', 'promising', 'emerging', 'local_practice', 'other')
  ),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

CREATE INDEX intervention_library_org_idx ON public.intervention_library_items(organization_id);
CREATE INDEX intervention_library_status_idx ON public.intervention_library_items(organization_id, status);
CREATE TRIGGER intervention_library_set_updated_at BEFORE UPDATE ON public.intervention_library_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.intervention_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  library_item_id uuid REFERENCES public.intervention_library_items(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'ready_for_review', 'active', 'paused', 'revised', 'completed', 'discontinued', 'archived')
  ),
  start_date date,
  end_date date,
  created_by uuid REFERENCES public.user_profiles(id),
  owner_user_id uuid REFERENCES public.user_profiles(id),
  activated_at timestamptz,
  activated_by uuid REFERENCES public.user_profiles(id),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE INDEX intervention_plans_org_idx ON public.intervention_plans(organization_id);
CREATE INDEX intervention_plans_student_idx ON public.intervention_plans(student_id);
CREATE INDEX intervention_plans_library_idx ON public.intervention_plans(library_item_id);
CREATE INDEX intervention_plans_status_idx ON public.intervention_plans(organization_id, status);
CREATE INDEX intervention_plans_dates_idx ON public.intervention_plans(student_id, start_date, end_date);
CREATE TRIGGER intervention_plans_set_updated_at BEFORE UPDATE ON public.intervention_plans
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.intervention_plan_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.intervention_plans(id) ON DELETE CASCADE,
  version_number integer NOT NULL CHECK (version_number > 0),
  snapshot jsonb NOT NULL,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  reason text,
  UNIQUE (plan_id, version_number)
);

CREATE INDEX intervention_plan_versions_plan_idx ON public.intervention_plan_versions(plan_id);

CREATE TABLE public.intervention_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.intervention_plans(id) ON DELETE CASCADE,
  label text NOT NULL,
  description text NOT NULL,
  implementation_notes text,
  sort_order integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX intervention_components_plan_idx ON public.intervention_components(plan_id);
CREATE TRIGGER intervention_components_set_updated_at BEFORE UPDATE ON public.intervention_components
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.intervention_target_behaviors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.intervention_plans(id) ON DELETE CASCADE,
  behavior_definition_id uuid REFERENCES public.behavior_definitions(id) ON DELETE SET NULL,
  target_description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX intervention_target_behaviors_plan_idx ON public.intervention_target_behaviors(plan_id);
CREATE INDEX intervention_target_behaviors_behavior_idx ON public.intervention_target_behaviors(behavior_definition_id);

CREATE TABLE public.intervention_replacement_behaviors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.intervention_plans(id) ON DELETE CASCADE,
  replacement_behavior_definition_id uuid REFERENCES public.replacement_behavior_definitions(id) ON DELETE SET NULL,
  replacement_description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX intervention_replacement_behaviors_plan_idx ON public.intervention_replacement_behaviors(plan_id);

CREATE TABLE public.intervention_staff_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.intervention_plans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  responsibility_type text NOT NULL DEFAULT 'implementer',
  role_description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX intervention_staff_assignments_plan_idx ON public.intervention_staff_assignments(plan_id);
CREATE INDEX intervention_staff_assignments_user_idx ON public.intervention_staff_assignments(user_id);
CREATE TRIGGER intervention_staff_assignments_set_updated_at BEFORE UPDATE ON public.intervention_staff_assignments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.intervention_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.intervention_plans(id) ON DELETE CASCADE,
  schedule_label text NOT NULL,
  frequency text,
  days_of_week jsonb NOT NULL DEFAULT '[]'::jsonb,
  start_time time,
  end_time time,
  setting text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time IS NULL OR start_time IS NULL OR end_time > start_time)
);

CREATE INDEX intervention_schedules_plan_idx ON public.intervention_schedules(plan_id);
CREATE TRIGGER intervention_schedules_set_updated_at BEFORE UPDATE ON public.intervention_schedules
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fidelity_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.intervention_plans(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX fidelity_checklists_plan_idx ON public.fidelity_checklists(plan_id);
CREATE TRIGGER fidelity_checklists_set_updated_at BEFORE UPDATE ON public.fidelity_checklists
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fidelity_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id uuid NOT NULL REFERENCES public.fidelity_checklists(id) ON DELETE CASCADE,
  item_text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 1,
  required boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (checklist_id, sort_order)
);

CREATE INDEX fidelity_checklist_items_checklist_idx ON public.fidelity_checklist_items(checklist_id);

CREATE TABLE public.fidelity_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.intervention_plans(id) ON DELETE CASCADE,
  checklist_id uuid NOT NULL REFERENCES public.fidelity_checklists(id) ON DELETE RESTRICT,
  observation_date date NOT NULL,
  observer_user_id uuid REFERENCES public.user_profiles(id),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'corrected', 'archived')),
  notes text,
  finalized_at timestamptz,
  finalized_by uuid REFERENCES public.user_profiles(id),
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX fidelity_observations_plan_idx ON public.fidelity_observations(plan_id);
CREATE INDEX fidelity_observations_checklist_idx ON public.fidelity_observations(checklist_id);
CREATE INDEX fidelity_observations_status_idx ON public.fidelity_observations(status);
CREATE INDEX fidelity_observations_date_idx ON public.fidelity_observations(plan_id, observation_date);
CREATE TRIGGER fidelity_observations_set_updated_at BEFORE UPDATE ON public.fidelity_observations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fidelity_item_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_id uuid NOT NULL REFERENCES public.fidelity_observations(id) ON DELETE CASCADE,
  checklist_item_id uuid NOT NULL REFERENCES public.fidelity_checklist_items(id) ON DELETE RESTRICT,
  response text NOT NULL CHECK (response IN ('yes', 'partial', 'no', 'not_observed')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (observation_id, checklist_item_id)
);

CREATE INDEX fidelity_item_responses_observation_idx ON public.fidelity_item_responses(observation_id);
CREATE TRIGGER fidelity_item_responses_set_updated_at BEFORE UPDATE ON public.fidelity_item_responses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.intervention_dosage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.intervention_plans(id) ON DELETE CASCADE,
  log_date date NOT NULL,
  delivered_by uuid REFERENCES public.user_profiles(id),
  duration_minutes numeric CHECK (duration_minutes IS NULL OR duration_minutes >= 0),
  sessions_delivered integer NOT NULL DEFAULT 1 CHECK (sessions_delivered >= 0),
  setting text,
  notes text,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX intervention_dosage_logs_plan_idx ON public.intervention_dosage_logs(plan_id);
CREATE INDEX intervention_dosage_logs_date_idx ON public.intervention_dosage_logs(plan_id, log_date);
CREATE TRIGGER intervention_dosage_logs_set_updated_at BEFORE UPDATE ON public.intervention_dosage_logs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.intervention_review_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.intervention_plans(id) ON DELETE CASCADE,
  review_date date NOT NULL,
  reviewer_user_id uuid REFERENCES public.user_profiles(id),
  summary text NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('continue', 'revise', 'pause', 'complete', 'discontinue')),
  next_review_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX intervention_review_records_plan_idx ON public.intervention_review_records(plan_id);
CREATE INDEX intervention_review_records_date_idx ON public.intervention_review_records(plan_id, review_date);

CREATE TABLE public.intervention_outcome_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.intervention_plans(id) ON DELETE CASCADE,
  evidence_type text NOT NULL CHECK (
    evidence_type IN ('goal', 'progress_session', 'behavior_session', 'fba_workspace', 'report_section')
  ),
  evidence_id uuid,
  label text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX intervention_outcome_links_plan_idx ON public.intervention_outcome_links(plan_id);
CREATE INDEX intervention_outcome_links_type_idx ON public.intervention_outcome_links(evidence_type, evidence_id);

CREATE TABLE public.intervention_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.intervention_plans(id) ON DELETE CASCADE,
  from_status text CHECK (
    from_status IN ('draft', 'ready_for_review', 'active', 'paused', 'revised', 'completed', 'discontinued', 'archived')
  ),
  to_status text NOT NULL CHECK (
    to_status IN ('draft', 'ready_for_review', 'active', 'paused', 'revised', 'completed', 'discontinued', 'archived')
  ),
  changed_by uuid REFERENCES public.user_profiles(id),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX intervention_status_history_plan_idx ON public.intervention_status_history(plan_id, created_at DESC);

CREATE TABLE public.intervention_plan_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.intervention_plans(id) ON DELETE CASCADE,
  label text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  phase_type text NOT NULL DEFAULT 'implementation' CHECK (
    phase_type IN ('baseline', 'implementation', 'maintenance', 'generalization', 'fade', 'other')
  ),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX intervention_plan_phases_plan_idx ON public.intervention_plan_phases(plan_id);
CREATE INDEX intervention_plan_phases_dates_idx ON public.intervention_plan_phases(plan_id, start_date, end_date);
CREATE TRIGGER intervention_plan_phases_set_updated_at BEFORE UPDATE ON public.intervention_plan_phases
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.can_read_intervention(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'intervention.read')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_intervention_plan(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'intervention.plan.manage')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

CREATE OR REPLACE FUNCTION public.can_activate_intervention(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'intervention.plan.activate')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

CREATE OR REPLACE FUNCTION public.can_enter_fidelity(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'intervention.fidelity.enter')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_finalize_fidelity(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'intervention.fidelity.finalize')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

ALTER TABLE public.intervention_library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_library_items FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_plans FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_plan_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_plan_versions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_components FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_target_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_target_behaviors FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_replacement_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_replacement_behaviors FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_staff_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_schedules FORCE ROW LEVEL SECURITY;
ALTER TABLE public.fidelity_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fidelity_checklists FORCE ROW LEVEL SECURITY;
ALTER TABLE public.fidelity_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fidelity_checklist_items FORCE ROW LEVEL SECURITY;
ALTER TABLE public.fidelity_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fidelity_observations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.fidelity_item_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fidelity_item_responses FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_dosage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_dosage_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_review_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_review_records FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_outcome_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_outcome_links FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_status_history FORCE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_plan_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_plan_phases FORCE ROW LEVEL SECURITY;

CREATE POLICY intervention_library_select ON public.intervention_library_items FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND (
    public.has_org_permission(organization_id, 'intervention.read')
    OR public.has_org_permission(organization_id, 'intervention.library.manage')
  )
);

CREATE POLICY intervention_library_mutate ON public.intervention_library_items FOR ALL
USING (
  public.has_org_permission(organization_id, 'intervention.library.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'intervention.library.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY intervention_plans_select ON public.intervention_plans FOR SELECT
USING (public.can_read_intervention(organization_id, student_id));

CREATE POLICY intervention_plans_insert ON public.intervention_plans FOR INSERT
WITH CHECK (
  status IN ('draft', 'ready_for_review')
  AND public.can_manage_intervention_plan(organization_id, student_id)
);

CREATE POLICY intervention_plans_update ON public.intervention_plans FOR UPDATE
USING (
  public.can_manage_intervention_plan(organization_id, student_id)
  OR public.can_activate_intervention(organization_id, student_id)
)
WITH CHECK (
  (
    status IN ('draft', 'ready_for_review', 'revised')
    AND public.can_manage_intervention_plan(organization_id, student_id)
  )
  OR (
    status IN ('active', 'paused', 'completed', 'discontinued', 'archived')
    AND public.can_activate_intervention(organization_id, student_id)
  )
);

CREATE POLICY intervention_plan_versions_select ON public.intervention_plan_versions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_plan_versions_insert ON public.intervention_plan_versions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id
      AND (
        public.can_manage_intervention_plan(p.organization_id, p.student_id)
        OR public.can_activate_intervention(p.organization_id, p.student_id)
      )
  )
);

CREATE POLICY intervention_components_select ON public.intervention_components FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_components_mutate ON public.intervention_components FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_target_behaviors_select ON public.intervention_target_behaviors FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_target_behaviors_mutate ON public.intervention_target_behaviors FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_replacement_behaviors_select ON public.intervention_replacement_behaviors FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_replacement_behaviors_mutate ON public.intervention_replacement_behaviors FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_staff_select ON public.intervention_staff_assignments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_staff_mutate ON public.intervention_staff_assignments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_schedules_select ON public.intervention_schedules FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_schedules_mutate ON public.intervention_schedules FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
);

CREATE POLICY fidelity_checklists_select ON public.fidelity_checklists FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY fidelity_checklists_mutate ON public.fidelity_checklists FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
);

CREATE POLICY fidelity_items_select ON public.fidelity_checklist_items FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.fidelity_checklists c
    JOIN public.intervention_plans p ON p.id = c.plan_id
    WHERE c.id = checklist_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY fidelity_items_mutate ON public.fidelity_checklist_items FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.fidelity_checklists c
    JOIN public.intervention_plans p ON p.id = c.plan_id
    WHERE c.id = checklist_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.fidelity_checklists c
    JOIN public.intervention_plans p ON p.id = c.plan_id
    WHERE c.id = checklist_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
);

CREATE POLICY fidelity_observations_select ON public.fidelity_observations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY fidelity_observations_insert ON public.fidelity_observations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id
      AND (
        (status = 'draft' AND public.can_enter_fidelity(p.organization_id, p.student_id))
        OR (status IN ('finalized', 'corrected') AND public.can_finalize_fidelity(p.organization_id, p.student_id))
      )
  )
);

CREATE POLICY fidelity_observations_update ON public.fidelity_observations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id
      AND (
        (status = 'draft' AND public.can_enter_fidelity(p.organization_id, p.student_id))
        OR public.can_finalize_fidelity(p.organization_id, p.student_id)
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id
      AND (
        (status = 'draft' AND public.can_enter_fidelity(p.organization_id, p.student_id))
        OR (status IN ('finalized', 'corrected', 'archived') AND public.can_finalize_fidelity(p.organization_id, p.student_id))
      )
  )
);

CREATE POLICY fidelity_responses_select ON public.fidelity_item_responses FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.fidelity_observations o
    JOIN public.intervention_plans p ON p.id = o.plan_id
    WHERE o.id = observation_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY fidelity_responses_mutate ON public.fidelity_item_responses FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.fidelity_observations o
    JOIN public.intervention_plans p ON p.id = o.plan_id
    WHERE o.id = observation_id
      AND o.status = 'draft'
      AND public.can_enter_fidelity(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.fidelity_observations o
    JOIN public.intervention_plans p ON p.id = o.plan_id
    WHERE o.id = observation_id
      AND o.status = 'draft'
      AND public.can_enter_fidelity(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_dosage_select ON public.intervention_dosage_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_dosage_mutate ON public.intervention_dosage_logs FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id
      AND public.has_org_permission(p.organization_id, 'intervention.dosage.enter')
      AND public.can_read_student(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id
      AND public.has_org_permission(p.organization_id, 'intervention.dosage.enter')
      AND public.can_read_student(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_reviews_select ON public.intervention_review_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_reviews_insert ON public.intervention_review_records FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id
      AND public.has_org_permission(p.organization_id, 'intervention.review')
      AND public.can_read_student(p.organization_id, p.student_id)
      AND public.member_role(p.organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
  )
);

CREATE POLICY intervention_outcomes_select ON public.intervention_outcome_links FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_outcomes_mutate ON public.intervention_outcome_links FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id
      AND (
        public.can_manage_intervention_plan(p.organization_id, p.student_id)
        OR (
          public.has_org_permission(p.organization_id, 'intervention.review')
          AND public.can_read_student(p.organization_id, p.student_id)
          AND public.member_role(p.organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
        )
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id
      AND (
        public.can_manage_intervention_plan(p.organization_id, p.student_id)
        OR (
          public.has_org_permission(p.organization_id, 'intervention.review')
          AND public.can_read_student(p.organization_id, p.student_id)
          AND public.member_role(p.organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
        )
      )
  )
);

CREATE POLICY intervention_status_history_select ON public.intervention_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_status_history_insert ON public.intervention_status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id
      AND (
        public.can_manage_intervention_plan(p.organization_id, p.student_id)
        OR public.can_activate_intervention(p.organization_id, p.student_id)
      )
  )
);

CREATE POLICY intervention_plan_phases_select ON public.intervention_plan_phases FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_read_intervention(p.organization_id, p.student_id)
  )
);

CREATE POLICY intervention_plan_phases_mutate ON public.intervention_plan_phases FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.intervention_plans p
    WHERE p.id = plan_id AND public.can_manage_intervention_plan(p.organization_id, p.student_id)
  )
);
