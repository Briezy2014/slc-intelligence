-- 202607290001_progress_reporting.sql
-- Phase 9: progress reporting periods, reports, evidence, versions, and exports.

INSERT INTO public.app_permissions (code, label, description) VALUES
  ('report.period.manage', 'Manage reporting periods', 'Create and manage progress reporting periods'),
  ('report.draft', 'Draft progress reports', 'Create and edit draft progress reports'),
  ('report.review', 'Review progress reports', 'Review submitted progress reports'),
  ('report.finalize', 'Finalize progress reports', 'Approve, finalize, and correct progress reports'),
  ('report.read', 'Read progress reports', 'View authorized progress reports'),
  ('report.export', 'Export progress reports', 'Create printable or PDF progress report exports')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code)
SELECT 'organization_admin', code
FROM public.app_permissions
WHERE code IN (
  'report.period.manage',
  'report.draft',
  'report.review',
  'report.finalize',
  'report.read',
  'report.export'
)
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code) VALUES
  ('district_sped_admin', 'report.period.manage'),
  ('district_sped_admin', 'report.draft'),
  ('district_sped_admin', 'report.review'),
  ('district_sped_admin', 'report.finalize'),
  ('district_sped_admin', 'report.read'),
  ('district_sped_admin', 'report.export'),
  ('building_admin', 'report.read'),
  ('building_admin', 'report.review'),
  ('program_admin', 'report.draft'),
  ('program_admin', 'report.review'),
  ('program_admin', 'report.read'),
  ('program_admin', 'report.finalize'),
  ('intervention_specialist', 'report.draft'),
  ('intervention_specialist', 'report.read'),
  ('intervention_specialist', 'report.finalize'),
  ('case_manager', 'report.draft'),
  ('case_manager', 'report.read'),
  ('case_manager', 'report.finalize'),
  ('special_education_teacher', 'report.draft'),
  ('special_education_teacher', 'report.read'),
  ('related_service_provider', 'report.draft'),
  ('related_service_provider', 'report.read'),
  ('school_psychologist', 'report.read'),
  ('school_psychologist', 'report.review'),
  ('read_only_reviewer', 'report.read')
ON CONFLICT DO NOTHING;

CREATE TABLE public.progress_descriptor_options (
  code text PRIMARY KEY,
  label text NOT NULL,
  description text NOT NULL,
  sort_order integer NOT NULL
);

INSERT INTO public.progress_descriptor_options (code, label, description, sort_order) VALUES
  ('exceeded', 'Exceeded expected progress', 'Student exceeded expected progress toward the goal for the reporting period.', 10),
  ('met', 'Met expected progress', 'Student met expected progress toward the goal for the reporting period.', 20),
  ('progressing', 'Progressing', 'Student is making progress but has not yet met the reporting-period expectation.', 30),
  ('limited_progress', 'Limited progress', 'Student made limited progress toward the goal during the reporting period.', 40),
  ('insufficient_data', 'Insufficient data', 'Available evidence is insufficient to determine progress.', 50)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE public.reporting_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  academic_year text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  due_date date,
  school_id uuid REFERENCES public.schools(id) ON DELETE SET NULL,
  program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, academic_year, name),
  CHECK (end_date >= start_date),
  CHECK (due_date IS NULL OR due_date >= end_date)
);

CREATE INDEX reporting_periods_org_idx ON public.reporting_periods(organization_id);
CREATE INDEX reporting_periods_school_idx ON public.reporting_periods(school_id);
CREATE INDEX reporting_periods_program_idx ON public.reporting_periods(program_id);
CREATE INDEX reporting_periods_status_dates_idx ON public.reporting_periods(organization_id, status, start_date, end_date);
CREATE TRIGGER reporting_periods_set_updated_at BEFORE UPDATE ON public.reporting_periods
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.progress_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  iep_cycle_id uuid NOT NULL REFERENCES public.iep_cycles(id) ON DELETE CASCADE,
  reporting_period_id uuid NOT NULL REFERENCES public.reporting_periods(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN (
    'not_started', 'draft', 'ready_for_review', 'changes_requested', 'approved', 'finalized', 'corrected', 'archived'
  )),
  prepared_by uuid REFERENCES public.user_profiles(id),
  assigned_reviewer_id uuid REFERENCES public.user_profiles(id),
  submitted_at timestamptz,
  finalized_at timestamptz,
  finalized_by uuid REFERENCES public.user_profiles(id),
  corrected_at timestamptz,
  archived_at timestamptz,
  version_number integer NOT NULL DEFAULT 1 CHECK (version_number > 0),
  parent_report_id uuid REFERENCES public.progress_reports(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX progress_reports_org_idx ON public.progress_reports(organization_id);
CREATE INDEX progress_reports_student_idx ON public.progress_reports(student_id);
CREATE INDEX progress_reports_period_idx ON public.progress_reports(reporting_period_id);
CREATE INDEX progress_reports_status_idx ON public.progress_reports(organization_id, status);
CREATE INDEX progress_reports_finalized_idx ON public.progress_reports(finalized_at);
CREATE TRIGGER progress_reports_set_updated_at BEFORE UPDATE ON public.progress_reports
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.progress_report_goal_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.progress_reports(id) ON DELETE CASCADE,
  goal_id uuid NOT NULL REFERENCES public.iep_goals(id) ON DELETE RESTRICT,
  goal_statement_snapshot text NOT NULL,
  baseline_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  target_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  period_start date NOT NULL,
  period_end date NOT NULL,
  observation_count integer NOT NULL DEFAULT 0 CHECK (observation_count >= 0),
  current_performance_summary text,
  trend_summary text,
  prompt_summary text,
  generalization_summary text,
  maintenance_summary text,
  intervention_phase_summary text,
  data_sufficiency_status text NOT NULL DEFAULT 'not_reviewed' CHECK (
    data_sufficiency_status IN ('not_reviewed', 'sufficient', 'limited', 'insufficient')
  ),
  data_sufficiency_notes text,
  educator_narrative text,
  progress_descriptor text REFERENCES public.progress_descriptor_options(code),
  descriptor_source text NOT NULL DEFAULT 'system_suggested' CHECK (
    descriptor_source IN ('system_suggested', 'educator_selected', 'educator_modified', 'finalized')
  ),
  system_summary_draft text,
  system_summary_label text NOT NULL DEFAULT 'System-generated draft language — educator review required',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (report_id, goal_id),
  CHECK (period_end >= period_start)
);

CREATE INDEX progress_report_sections_report_idx ON public.progress_report_goal_sections(report_id);
CREATE INDEX progress_report_sections_goal_idx ON public.progress_report_goal_sections(goal_id);
CREATE TRIGGER progress_report_sections_set_updated_at BEFORE UPDATE ON public.progress_report_goal_sections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.progress_report_evidence_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.progress_report_goal_sections(id) ON DELETE CASCADE,
  evidence_type text NOT NULL CHECK (
    evidence_type IN ('session', 'data_point', 'baseline', 'intervention_phase', 'analytics_range')
  ),
  evidence_id uuid,
  label text NOT NULL,
  date_range_start date,
  date_range_end date,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (date_range_end IS NULL OR date_range_start IS NULL OR date_range_end >= date_range_start)
);

CREATE INDEX progress_report_evidence_section_idx ON public.progress_report_evidence_links(section_id);
CREATE INDEX progress_report_evidence_type_idx ON public.progress_report_evidence_links(evidence_type, evidence_id);

CREATE TABLE public.progress_report_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.progress_reports(id) ON DELETE CASCADE,
  from_status text CHECK (from_status IN (
    'not_started', 'draft', 'ready_for_review', 'changes_requested', 'approved', 'finalized', 'corrected', 'archived'
  )),
  to_status text NOT NULL CHECK (to_status IN (
    'not_started', 'draft', 'ready_for_review', 'changes_requested', 'approved', 'finalized', 'corrected', 'archived'
  )),
  changed_by uuid REFERENCES public.user_profiles(id),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX progress_report_status_history_report_idx ON public.progress_report_status_history(report_id, created_at DESC);

CREATE TABLE public.progress_report_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.progress_reports(id) ON DELETE CASCADE,
  version_number integer NOT NULL CHECK (version_number > 0),
  snapshot jsonb NOT NULL,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  reason text,
  UNIQUE (report_id, version_number)
);

CREATE INDEX progress_report_versions_report_idx ON public.progress_report_versions(report_id);

CREATE TABLE public.report_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.progress_reports(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  exported_by uuid REFERENCES public.user_profiles(id),
  export_format text NOT NULL CHECK (export_format IN ('print', 'pdf')),
  version_number integer NOT NULL CHECK (version_number > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX report_exports_report_idx ON public.report_exports(report_id);
CREATE INDEX report_exports_org_idx ON public.report_exports(organization_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.can_read_report(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'report.read')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_draft_report(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'report.draft')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

CREATE OR REPLACE FUNCTION public.can_finalize_report(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'report.finalize')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer', 'special_education_teacher');
$$;

CREATE OR REPLACE FUNCTION public.can_review_report(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'report.review')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

ALTER TABLE public.progress_descriptor_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_descriptor_options FORCE ROW LEVEL SECURITY;
ALTER TABLE public.reporting_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reporting_periods FORCE ROW LEVEL SECURITY;
ALTER TABLE public.progress_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_reports FORCE ROW LEVEL SECURITY;
ALTER TABLE public.progress_report_goal_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_report_goal_sections FORCE ROW LEVEL SECURITY;
ALTER TABLE public.progress_report_evidence_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_report_evidence_links FORCE ROW LEVEL SECURITY;
ALTER TABLE public.progress_report_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_report_status_history FORCE ROW LEVEL SECURITY;
ALTER TABLE public.progress_report_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_report_versions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.report_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_exports FORCE ROW LEVEL SECURITY;

CREATE POLICY progress_descriptor_options_select ON public.progress_descriptor_options FOR SELECT
USING (true);

CREATE POLICY reporting_periods_select ON public.reporting_periods FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND (
    public.has_org_permission(organization_id, 'report.read')
    OR public.has_org_permission(organization_id, 'report.period.manage')
  )
);

CREATE POLICY reporting_periods_insert ON public.reporting_periods FOR INSERT
WITH CHECK (public.has_org_permission(organization_id, 'report.period.manage'));

CREATE POLICY reporting_periods_update ON public.reporting_periods FOR UPDATE
USING (public.has_org_permission(organization_id, 'report.period.manage'))
WITH CHECK (public.has_org_permission(organization_id, 'report.period.manage'));

CREATE POLICY progress_reports_select ON public.progress_reports FOR SELECT
USING (public.can_read_report(organization_id, student_id));

CREATE POLICY progress_reports_insert ON public.progress_reports FOR INSERT
WITH CHECK (
  status IN ('not_started', 'draft')
  AND public.can_draft_report(organization_id, student_id)
);

CREATE POLICY progress_reports_update ON public.progress_reports FOR UPDATE
USING (
  (status IN ('not_started', 'draft', 'changes_requested') AND public.can_draft_report(organization_id, student_id))
  OR (status IN ('ready_for_review', 'changes_requested', 'approved') AND public.can_review_report(organization_id, student_id))
  OR public.can_finalize_report(organization_id, student_id)
)
WITH CHECK (
  (
    status IN ('not_started', 'draft', 'ready_for_review', 'changes_requested')
    AND public.can_draft_report(organization_id, student_id)
  )
  OR (
    status IN ('changes_requested', 'approved')
    AND public.can_review_report(organization_id, student_id)
  )
  OR (
    status IN ('approved', 'finalized', 'corrected', 'archived')
    AND public.can_finalize_report(organization_id, student_id)
  )
);

CREATE POLICY progress_report_sections_select ON public.progress_report_goal_sections FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.progress_reports r
    WHERE r.id = report_id AND public.can_read_report(r.organization_id, r.student_id)
  )
);

CREATE POLICY progress_report_sections_insert ON public.progress_report_goal_sections FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.progress_reports r
    WHERE r.id = report_id
      AND r.status IN ('not_started', 'draft', 'changes_requested')
      AND public.can_draft_report(r.organization_id, r.student_id)
  )
);

CREATE POLICY progress_report_sections_update ON public.progress_report_goal_sections FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.progress_reports r
    WHERE r.id = report_id
      AND (
        (r.status IN ('not_started', 'draft', 'changes_requested') AND public.can_draft_report(r.organization_id, r.student_id))
        OR (r.status IN ('approved', 'finalized', 'corrected') AND public.can_finalize_report(r.organization_id, r.student_id))
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.progress_reports r
    WHERE r.id = report_id
      AND (
        (r.status IN ('not_started', 'draft', 'changes_requested') AND public.can_draft_report(r.organization_id, r.student_id))
        OR (r.status IN ('approved', 'finalized', 'corrected') AND public.can_finalize_report(r.organization_id, r.student_id))
      )
  )
);

CREATE POLICY progress_report_evidence_select ON public.progress_report_evidence_links FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.progress_report_goal_sections s
    JOIN public.progress_reports r ON r.id = s.report_id
    WHERE s.id = section_id AND public.can_read_report(r.organization_id, r.student_id)
  )
);

CREATE POLICY progress_report_evidence_insert ON public.progress_report_evidence_links FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.progress_report_goal_sections s
    JOIN public.progress_reports r ON r.id = s.report_id
    WHERE s.id = section_id
      AND r.status IN ('not_started', 'draft', 'changes_requested')
      AND public.can_draft_report(r.organization_id, r.student_id)
  )
);

CREATE POLICY progress_report_evidence_update ON public.progress_report_evidence_links FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.progress_report_goal_sections s
    JOIN public.progress_reports r ON r.id = s.report_id
    WHERE s.id = section_id
      AND r.status IN ('not_started', 'draft', 'changes_requested')
      AND public.can_draft_report(r.organization_id, r.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.progress_report_goal_sections s
    JOIN public.progress_reports r ON r.id = s.report_id
    WHERE s.id = section_id
      AND r.status IN ('not_started', 'draft', 'changes_requested')
      AND public.can_draft_report(r.organization_id, r.student_id)
  )
);

CREATE POLICY progress_report_status_history_select ON public.progress_report_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.progress_reports r
    WHERE r.id = report_id AND public.can_read_report(r.organization_id, r.student_id)
  )
);

CREATE POLICY progress_report_status_history_insert ON public.progress_report_status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.progress_reports r
    WHERE r.id = report_id
      AND (
        public.can_draft_report(r.organization_id, r.student_id)
        OR public.can_review_report(r.organization_id, r.student_id)
        OR public.can_finalize_report(r.organization_id, r.student_id)
      )
  )
);

CREATE POLICY progress_report_versions_select ON public.progress_report_versions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.progress_reports r
    WHERE r.id = report_id AND public.can_read_report(r.organization_id, r.student_id)
  )
);

CREATE POLICY progress_report_versions_insert ON public.progress_report_versions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.progress_reports r
    WHERE r.id = report_id
      AND r.status IN ('approved', 'finalized', 'corrected')
      AND public.can_finalize_report(r.organization_id, r.student_id)
  )
);

CREATE POLICY report_exports_select ON public.report_exports FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.progress_reports r
    WHERE r.id = report_id
      AND r.organization_id = report_exports.organization_id
      AND public.can_read_report(r.organization_id, r.student_id)
  )
);

CREATE POLICY report_exports_insert ON public.report_exports FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.progress_reports r
    WHERE r.id = report_id
      AND r.organization_id = report_exports.organization_id
      AND public.can_read_report(r.organization_id, r.student_id)
      AND (
        public.has_org_permission(r.organization_id, 'report.export')
        OR public.has_org_permission(r.organization_id, 'report.read')
      )
  )
);
