-- 202607290005_accommodations_and_services.sql
-- Phase 13 database layer: accommodations, related services, delivery logs, and exports.

INSERT INTO public.app_permissions (code, label, description) VALUES
  ('accommodation.library.manage', 'Manage accommodation library', 'Create and manage organization accommodation library items'),
  ('accommodation.manage', 'Manage accommodations', 'Create and edit student accommodations'),
  ('accommodation.implement', 'Implement accommodations', 'Record accommodation implementation activity'),
  ('accommodation.read', 'Read accommodations', 'View authorized accommodation records'),
  ('service.definition.manage', 'Manage service definitions', 'Create and manage organization service definitions and service configuration'),
  ('service.plan.manage', 'Manage service plans', 'Create and edit student service plans'),
  ('service.plan.activate', 'Activate service plans', 'Approve, activate, end, and archive service plans'),
  ('service.log.enter', 'Enter service logs', 'Create and edit draft service delivery logs'),
  ('service.log.finalize', 'Finalize service logs', 'Finalize, correct, and archive service delivery logs'),
  ('service.read', 'Read services', 'View authorized service plans and delivery records'),
  ('service.export', 'Export services', 'Create exports for authorized service records')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code)
SELECT 'organization_admin', code
FROM public.app_permissions
WHERE code IN (
  'accommodation.library.manage',
  'accommodation.manage',
  'accommodation.implement',
  'accommodation.read',
  'service.definition.manage',
  'service.plan.manage',
  'service.plan.activate',
  'service.log.enter',
  'service.log.finalize',
  'service.read',
  'service.export'
)
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code) VALUES
  ('district_sped_admin', 'accommodation.library.manage'),
  ('district_sped_admin', 'accommodation.manage'),
  ('district_sped_admin', 'accommodation.implement'),
  ('district_sped_admin', 'accommodation.read'),
  ('district_sped_admin', 'service.definition.manage'),
  ('district_sped_admin', 'service.plan.manage'),
  ('district_sped_admin', 'service.plan.activate'),
  ('district_sped_admin', 'service.log.enter'),
  ('district_sped_admin', 'service.log.finalize'),
  ('district_sped_admin', 'service.read'),
  ('district_sped_admin', 'service.export'),
  ('building_admin', 'accommodation.read'),
  ('building_admin', 'service.read'),
  ('building_admin', 'service.log.enter'),
  ('program_admin', 'accommodation.manage'),
  ('program_admin', 'accommodation.implement'),
  ('program_admin', 'accommodation.read'),
  ('program_admin', 'service.plan.manage'),
  ('program_admin', 'service.log.enter'),
  ('program_admin', 'service.log.finalize'),
  ('program_admin', 'service.read'),
  ('intervention_specialist', 'accommodation.manage'),
  ('intervention_specialist', 'accommodation.implement'),
  ('intervention_specialist', 'accommodation.read'),
  ('intervention_specialist', 'service.plan.manage'),
  ('intervention_specialist', 'service.log.enter'),
  ('intervention_specialist', 'service.log.finalize'),
  ('intervention_specialist', 'service.read'),
  ('case_manager', 'accommodation.manage'),
  ('case_manager', 'accommodation.implement'),
  ('case_manager', 'accommodation.read'),
  ('case_manager', 'service.plan.manage'),
  ('case_manager', 'service.log.enter'),
  ('case_manager', 'service.log.finalize'),
  ('case_manager', 'service.read'),
  ('special_education_teacher', 'accommodation.manage'),
  ('special_education_teacher', 'accommodation.implement'),
  ('special_education_teacher', 'accommodation.read'),
  ('special_education_teacher', 'service.log.enter'),
  ('special_education_teacher', 'service.read'),
  ('related_service_provider', 'accommodation.read'),
  ('related_service_provider', 'service.plan.manage'),
  ('related_service_provider', 'service.log.enter'),
  ('related_service_provider', 'service.log.finalize'),
  ('related_service_provider', 'service.read'),
  ('paraprofessional', 'accommodation.implement'),
  ('paraprofessional', 'accommodation.read'),
  ('paraprofessional', 'service.log.enter'),
  ('paraprofessional', 'service.read'),
  ('read_only_reviewer', 'accommodation.read'),
  ('read_only_reviewer', 'service.read')
ON CONFLICT DO NOTHING;

CREATE TABLE public.accommodation_library_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  accommodation_area text,
  description text NOT NULL,
  default_implementation_notes text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

CREATE TABLE public.student_accommodations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  iep_cycle_id uuid REFERENCES public.iep_cycles(id) ON DELETE SET NULL,
  library_item_id uuid REFERENCES public.accommodation_library_items(id) ON DELETE SET NULL,
  title text NOT NULL,
  accommodation_area text,
  description text NOT NULL,
  implementation_notes text,
  accommodation_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'under_review', 'revised', 'ended', 'archived')),
  start_date date,
  end_date date,
  created_by uuid REFERENCES public.user_profiles(id),
  updated_by uuid REFERENCES public.user_profiles(id),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE TABLE public.student_accommodation_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_accommodation_id uuid NOT NULL REFERENCES public.student_accommodations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  version_number integer NOT NULL CHECK (version_number > 0),
  snapshot jsonb NOT NULL,
  reason text,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_accommodation_id, version_number)
);

CREATE TABLE public.accommodation_implementation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_accommodation_id uuid NOT NULL REFERENCES public.student_accommodations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  implemented_by uuid REFERENCES public.user_profiles(id),
  setting text,
  implementation_status text NOT NULL CHECK (
    implementation_status IN ('implemented', 'partially_implemented', 'not_implemented', 'not_applicable', 'student_declined')
  ),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'corrected', 'archived')),
  notes text,
  finalized_at timestamptz,
  finalized_by uuid REFERENCES public.user_profiles(id),
  corrected_from_log_id uuid REFERENCES public.accommodation_implementation_logs(id) ON DELETE SET NULL,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.accommodation_review_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_accommodation_id uuid NOT NULL REFERENCES public.student_accommodations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  review_date date NOT NULL DEFAULT CURRENT_DATE,
  reviewed_by uuid REFERENCES public.user_profiles(id),
  review_summary text NOT NULL,
  recommendation text,
  next_review_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.service_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  service_area text NOT NULL,
  description text,
  default_delivery_type text CHECK (
    default_delivery_type IS NULL OR default_delivery_type IN ('push_in', 'pull_out', 'consultation', 'individual', 'group', 'other')
  ),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

CREATE TABLE public.student_service_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  iep_cycle_id uuid REFERENCES public.iep_cycles(id) ON DELETE SET NULL,
  service_definition_id uuid REFERENCES public.service_definitions(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  service_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'under_review', 'revised', 'ended', 'archived')),
  start_date date,
  end_date date,
  created_by uuid REFERENCES public.user_profiles(id),
  activated_at timestamptz,
  activated_by uuid REFERENCES public.user_profiles(id),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE TABLE public.student_service_plan_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  service_plan_id uuid NOT NULL REFERENCES public.student_service_plans(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  version_number integer NOT NULL CHECK (version_number > 0),
  snapshot jsonb NOT NULL,
  reason text,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (service_plan_id, version_number)
);

CREATE TABLE public.service_plan_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  service_plan_id uuid NOT NULL REFERENCES public.student_service_plans(id) ON DELETE CASCADE,
  component_name text NOT NULL,
  service_minutes integer CHECK (service_minutes IS NULL OR service_minutes > 0),
  frequency text,
  setting text,
  delivery_type text CHECK (
    delivery_type IS NULL OR delivery_type IN ('push_in', 'pull_out', 'consultation', 'individual', 'group', 'other')
  ),
  notes text,
  sort_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.service_provider_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  service_plan_id uuid NOT NULL REFERENCES public.student_service_plans(id) ON DELETE CASCADE,
  provider_user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  assignment_role text NOT NULL DEFAULT 'provider',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE public.service_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  service_plan_id uuid NOT NULL REFERENCES public.student_service_plans(id) ON DELETE CASCADE,
  service_component_id uuid REFERENCES public.service_plan_components(id) ON DELETE SET NULL,
  day_of_week integer CHECK (day_of_week IS NULL OR day_of_week BETWEEN 0 AND 6),
  start_time time,
  planned_duration_minutes integer CHECK (planned_duration_minutes IS NULL OR planned_duration_minutes > 0),
  recurrence_note text,
  location text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.service_delivery_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  service_plan_id uuid NOT NULL REFERENCES public.student_service_plans(id) ON DELETE CASCADE,
  service_component_id uuid REFERENCES public.service_plan_components(id) ON DELETE SET NULL,
  primary_student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  provider_user_id uuid REFERENCES public.user_profiles(id),
  service_date date NOT NULL DEFAULT CURRENT_DATE,
  start_time time,
  end_time time,
  calculated_duration_minutes integer GENERATED ALWAYS AS (
    CASE
      WHEN start_time IS NOT NULL AND end_time IS NOT NULL
        THEN floor(EXTRACT(epoch FROM (end_time - start_time)) / 60)::integer
      ELSE NULL
    END
  ) STORED,
  delivery_type text NOT NULL CHECK (delivery_type IN ('push_in', 'pull_out', 'consultation', 'individual', 'group', 'other')),
  service_status text NOT NULL CHECK (
    service_status IN (
      'delivered',
      'partially_delivered',
      'rescheduled',
      'canceled',
      'student_absent',
      'provider_absent',
      'school_closed',
      'family_canceled',
      'student_unavailable',
      'other'
    )
  ),
  record_status text NOT NULL DEFAULT 'draft' CHECK (record_status IN ('draft', 'finalized', 'corrected', 'archived')),
  cancellation_reason_id uuid,
  notes text,
  finalized_at timestamptz,
  finalized_by uuid REFERENCES public.user_profiles(id),
  corrected_from_log_id uuid REFERENCES public.service_delivery_logs(id) ON DELETE SET NULL,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time IS NULL OR start_time IS NULL OR end_time >= start_time)
);

CREATE TABLE public.service_delivery_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  delivery_log_id uuid NOT NULL REFERENCES public.service_delivery_logs(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  participation_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (delivery_log_id, student_id)
);

CREATE TABLE public.service_delivery_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  delivery_log_id uuid NOT NULL REFERENCES public.service_delivery_logs(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  changed_by uuid REFERENCES public.user_profiles(id),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.service_cancellation_reasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  code text NOT NULL,
  label text NOT NULL,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

ALTER TABLE public.service_delivery_logs
ADD CONSTRAINT service_delivery_logs_cancellation_reason_fk
FOREIGN KEY (cancellation_reason_id) REFERENCES public.service_cancellation_reasons(id) ON DELETE SET NULL;

CREATE TABLE public.makeup_service_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  original_log_id uuid NOT NULL REFERENCES public.service_delivery_logs(id) ON DELETE CASCADE,
  makeup_log_id uuid REFERENCES public.service_delivery_logs(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'not_needed', 'canceled', 'archived')),
  note text,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (makeup_log_id IS NULL OR makeup_log_id <> original_log_id)
);

CREATE TABLE public.service_note_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  template_body text NOT NULL,
  service_area text,
  active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

CREATE TABLE public.service_review_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  service_plan_id uuid NOT NULL REFERENCES public.student_service_plans(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  review_date date NOT NULL DEFAULT CURRENT_DATE,
  reviewed_by uuid REFERENCES public.user_profiles(id),
  review_summary text NOT NULL,
  recommendation text,
  next_review_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.service_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  service_plan_id uuid REFERENCES public.student_service_plans(id) ON DELETE SET NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
  exported_by uuid REFERENCES public.user_profiles(id),
  export_format text NOT NULL DEFAULT 'csv' CHECK (export_format IN ('csv', 'pdf', 'json', 'print', 'other')),
  date_range_start date,
  date_range_end date,
  storage_path text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (date_range_end IS NULL OR date_range_start IS NULL OR date_range_end >= date_range_start)
);

COMMENT ON TABLE public.student_accommodations IS
  'Platform records are descriptive supports; the platform does not determine legal compliance.';
COMMENT ON TABLE public.service_delivery_logs IS
  'Planned and recorded service fields are descriptive operational records; the platform does not determine legal compliance.';
COMMENT ON COLUMN public.service_schedules.recurrence_note IS
  'Documents simple recurrence without exploding planned rows.';

CREATE INDEX accommodation_library_org_idx ON public.accommodation_library_items(organization_id);
CREATE INDEX accommodation_library_status_idx ON public.accommodation_library_items(organization_id, status);
CREATE INDEX student_accommodations_org_idx ON public.student_accommodations(organization_id);
CREATE INDEX student_accommodations_student_idx ON public.student_accommodations(student_id);
CREATE INDEX student_accommodations_status_idx ON public.student_accommodations(organization_id, status);
CREATE INDEX student_accommodations_iep_idx ON public.student_accommodations(iep_cycle_id);
CREATE INDEX student_accommodation_versions_accommodation_idx ON public.student_accommodation_versions(student_accommodation_id);
CREATE INDEX student_accommodation_versions_student_idx ON public.student_accommodation_versions(student_id);
CREATE INDEX accommodation_logs_accommodation_idx ON public.accommodation_implementation_logs(student_accommodation_id);
CREATE INDEX accommodation_logs_student_idx ON public.accommodation_implementation_logs(student_id);
CREATE INDEX accommodation_logs_date_idx ON public.accommodation_implementation_logs(student_id, log_date);
CREATE INDEX accommodation_reviews_accommodation_idx ON public.accommodation_review_records(student_accommodation_id);
CREATE INDEX accommodation_reviews_student_idx ON public.accommodation_review_records(student_id);
CREATE INDEX service_definitions_org_idx ON public.service_definitions(organization_id);
CREATE INDEX service_definitions_status_idx ON public.service_definitions(organization_id, status);
CREATE INDEX service_plans_org_idx ON public.student_service_plans(organization_id);
CREATE INDEX service_plans_student_idx ON public.student_service_plans(student_id);
CREATE INDEX service_plans_status_idx ON public.student_service_plans(organization_id, status);
CREATE INDEX service_plan_versions_plan_idx ON public.student_service_plan_versions(service_plan_id);
CREATE INDEX service_plan_components_plan_idx ON public.service_plan_components(service_plan_id);
CREATE INDEX service_provider_assignments_plan_idx ON public.service_provider_assignments(service_plan_id);
CREATE INDEX service_provider_assignments_user_idx ON public.service_provider_assignments(provider_user_id);
CREATE INDEX service_schedules_plan_idx ON public.service_schedules(service_plan_id);
CREATE INDEX service_delivery_logs_plan_idx ON public.service_delivery_logs(service_plan_id);
CREATE INDEX service_delivery_logs_student_date_idx ON public.service_delivery_logs(primary_student_id, service_date);
CREATE INDEX service_delivery_logs_provider_idx ON public.service_delivery_logs(provider_user_id);
CREATE INDEX service_delivery_participants_log_idx ON public.service_delivery_participants(delivery_log_id);
CREATE INDEX service_delivery_participants_student_idx ON public.service_delivery_participants(student_id);
CREATE INDEX service_delivery_status_history_log_idx ON public.service_delivery_status_history(delivery_log_id);
CREATE INDEX service_cancellation_reasons_org_idx ON public.service_cancellation_reasons(organization_id);
CREATE INDEX makeup_service_links_original_idx ON public.makeup_service_links(original_log_id);
CREATE INDEX makeup_service_links_makeup_idx ON public.makeup_service_links(makeup_log_id);
CREATE INDEX service_note_templates_org_idx ON public.service_note_templates(organization_id);
CREATE INDEX service_reviews_plan_idx ON public.service_review_records(service_plan_id);
CREATE INDEX service_reviews_student_idx ON public.service_review_records(student_id);
CREATE INDEX service_exports_org_idx ON public.service_exports(organization_id);
CREATE INDEX service_exports_student_idx ON public.service_exports(student_id);

CREATE TRIGGER accommodation_library_set_updated_at BEFORE UPDATE ON public.accommodation_library_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER student_accommodations_set_updated_at BEFORE UPDATE ON public.student_accommodations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER accommodation_versions_set_updated_at BEFORE UPDATE ON public.student_accommodation_versions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER accommodation_logs_set_updated_at BEFORE UPDATE ON public.accommodation_implementation_logs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER accommodation_reviews_set_updated_at BEFORE UPDATE ON public.accommodation_review_records
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_definitions_set_updated_at BEFORE UPDATE ON public.service_definitions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_plans_set_updated_at BEFORE UPDATE ON public.student_service_plans
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_plan_versions_set_updated_at BEFORE UPDATE ON public.student_service_plan_versions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_components_set_updated_at BEFORE UPDATE ON public.service_plan_components
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_provider_assignments_set_updated_at BEFORE UPDATE ON public.service_provider_assignments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_schedules_set_updated_at BEFORE UPDATE ON public.service_schedules
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_delivery_logs_set_updated_at BEFORE UPDATE ON public.service_delivery_logs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_delivery_participants_set_updated_at BEFORE UPDATE ON public.service_delivery_participants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_delivery_history_set_updated_at BEFORE UPDATE ON public.service_delivery_status_history
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_cancellation_reasons_set_updated_at BEFORE UPDATE ON public.service_cancellation_reasons
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER makeup_service_links_set_updated_at BEFORE UPDATE ON public.makeup_service_links
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_note_templates_set_updated_at BEFORE UPDATE ON public.service_note_templates
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_reviews_set_updated_at BEFORE UPDATE ON public.service_review_records
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER service_exports_set_updated_at BEFORE UPDATE ON public.service_exports
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.can_read_accommodation(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'accommodation.read')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_accommodation(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'accommodation.manage')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

CREATE OR REPLACE FUNCTION public.can_implement_accommodation(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'accommodation.implement')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_read_service(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'service.read')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_service_plan(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'service.plan.manage')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

CREATE OR REPLACE FUNCTION public.can_activate_service_plan(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'service.plan.activate')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer', 'special_education_teacher');
$$;

CREATE OR REPLACE FUNCTION public.can_enter_service_log(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'service.log.enter')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_finalize_service_log(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'service.log.finalize')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

ALTER TABLE public.accommodation_library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_library_items FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_accommodations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_accommodation_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_accommodation_versions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_implementation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_implementation_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_review_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_review_records FORCE ROW LEVEL SECURITY;
ALTER TABLE public.service_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_definitions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_service_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_service_plans FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_service_plan_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_service_plan_versions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.service_plan_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_plan_components FORCE ROW LEVEL SECURITY;
ALTER TABLE public.service_provider_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_provider_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.service_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_schedules FORCE ROW LEVEL SECURITY;
ALTER TABLE public.service_delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_delivery_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.service_delivery_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_delivery_participants FORCE ROW LEVEL SECURITY;
ALTER TABLE public.service_delivery_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_delivery_status_history FORCE ROW LEVEL SECURITY;
ALTER TABLE public.service_cancellation_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_cancellation_reasons FORCE ROW LEVEL SECURITY;
ALTER TABLE public.makeup_service_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.makeup_service_links FORCE ROW LEVEL SECURITY;
ALTER TABLE public.service_note_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_note_templates FORCE ROW LEVEL SECURITY;
ALTER TABLE public.service_review_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_review_records FORCE ROW LEVEL SECURITY;
ALTER TABLE public.service_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_exports FORCE ROW LEVEL SECURITY;

CREATE POLICY accommodation_library_select ON public.accommodation_library_items FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND (
    public.has_org_permission(organization_id, 'accommodation.read')
    OR public.has_org_permission(organization_id, 'accommodation.library.manage')
  )
);

CREATE POLICY accommodation_library_mutate ON public.accommodation_library_items FOR ALL
USING (
  public.has_org_permission(organization_id, 'accommodation.library.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'accommodation.library.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY student_accommodations_select ON public.student_accommodations FOR SELECT
USING (public.can_read_accommodation(organization_id, student_id));

CREATE POLICY student_accommodations_insert ON public.student_accommodations FOR INSERT
WITH CHECK (public.can_manage_accommodation(organization_id, student_id));

CREATE POLICY student_accommodations_update ON public.student_accommodations FOR UPDATE
USING (public.can_manage_accommodation(organization_id, student_id))
WITH CHECK (public.can_manage_accommodation(organization_id, student_id));

CREATE POLICY accommodation_versions_select ON public.student_accommodation_versions FOR SELECT
USING (public.can_read_accommodation(organization_id, student_id));

CREATE POLICY accommodation_versions_insert ON public.student_accommodation_versions FOR INSERT
WITH CHECK (
  public.can_manage_accommodation(organization_id, student_id)
  AND EXISTS (
    SELECT 1 FROM public.student_accommodations a
    WHERE a.id = student_accommodation_id
      AND a.organization_id = organization_id
      AND a.student_id = student_id
  )
);

CREATE POLICY accommodation_logs_select ON public.accommodation_implementation_logs FOR SELECT
USING (public.can_read_accommodation(organization_id, student_id));

CREATE POLICY accommodation_logs_insert ON public.accommodation_implementation_logs FOR INSERT
WITH CHECK (
  public.can_implement_accommodation(organization_id, student_id)
  AND EXISTS (
    SELECT 1 FROM public.student_accommodations a
    WHERE a.id = student_accommodation_id
      AND a.organization_id = organization_id
      AND a.student_id = student_id
  )
);

CREATE POLICY accommodation_logs_update ON public.accommodation_implementation_logs FOR UPDATE
USING (public.can_implement_accommodation(organization_id, student_id))
WITH CHECK (public.can_implement_accommodation(organization_id, student_id));

CREATE POLICY accommodation_reviews_select ON public.accommodation_review_records FOR SELECT
USING (public.can_read_accommodation(organization_id, student_id));

CREATE POLICY accommodation_reviews_insert ON public.accommodation_review_records FOR INSERT
WITH CHECK (
  public.can_manage_accommodation(organization_id, student_id)
  AND EXISTS (
    SELECT 1 FROM public.student_accommodations a
    WHERE a.id = student_accommodation_id
      AND a.organization_id = organization_id
      AND a.student_id = student_id
  )
);

CREATE POLICY service_definitions_select ON public.service_definitions FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND (
    public.has_org_permission(organization_id, 'service.read')
    OR public.has_org_permission(organization_id, 'service.definition.manage')
  )
);

CREATE POLICY service_definitions_mutate ON public.service_definitions FOR ALL
USING (
  public.has_org_permission(organization_id, 'service.definition.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'service.definition.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY service_plans_select ON public.student_service_plans FOR SELECT
USING (public.can_read_service(organization_id, student_id));

CREATE POLICY service_plans_insert ON public.student_service_plans FOR INSERT
WITH CHECK (
  status IN ('draft', 'under_review')
  AND public.can_manage_service_plan(organization_id, student_id)
);

CREATE POLICY service_plans_update ON public.student_service_plans FOR UPDATE
USING (
  public.can_manage_service_plan(organization_id, student_id)
  OR public.can_activate_service_plan(organization_id, student_id)
)
WITH CHECK (
  (
    status IN ('draft', 'under_review', 'revised')
    AND public.can_manage_service_plan(organization_id, student_id)
  )
  OR (
    status IN ('active', 'ended', 'archived')
    AND public.can_activate_service_plan(organization_id, student_id)
  )
);

CREATE POLICY service_plan_versions_select ON public.student_service_plan_versions FOR SELECT
USING (public.can_read_service(organization_id, student_id));

CREATE POLICY service_plan_versions_insert ON public.student_service_plan_versions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.student_service_plans p
    WHERE p.id = service_plan_id
      AND p.organization_id = organization_id
      AND p.student_id = student_id
      AND (
        public.can_manage_service_plan(p.organization_id, p.student_id)
        OR public.can_activate_service_plan(p.organization_id, p.student_id)
      )
  )
);

CREATE POLICY service_components_select ON public.service_plan_components FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.student_service_plans p
    WHERE p.id = service_plan_id AND public.can_read_service(p.organization_id, p.student_id)
  )
);

CREATE POLICY service_components_mutate ON public.service_plan_components FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.student_service_plans p
    WHERE p.id = service_plan_id AND public.can_manage_service_plan(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.student_service_plans p
    WHERE p.id = service_plan_id AND public.can_manage_service_plan(p.organization_id, p.student_id)
  )
);

CREATE POLICY service_provider_assignments_select ON public.service_provider_assignments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.student_service_plans p
    WHERE p.id = service_plan_id AND public.can_read_service(p.organization_id, p.student_id)
  )
);

CREATE POLICY service_provider_assignments_mutate ON public.service_provider_assignments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.student_service_plans p
    WHERE p.id = service_plan_id AND public.can_manage_service_plan(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.student_service_plans p
    WHERE p.id = service_plan_id AND public.can_manage_service_plan(p.organization_id, p.student_id)
  )
);

CREATE POLICY service_schedules_select ON public.service_schedules FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.student_service_plans p
    WHERE p.id = service_plan_id AND public.can_read_service(p.organization_id, p.student_id)
  )
);

CREATE POLICY service_schedules_mutate ON public.service_schedules FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.student_service_plans p
    WHERE p.id = service_plan_id AND public.can_manage_service_plan(p.organization_id, p.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.student_service_plans p
    WHERE p.id = service_plan_id AND public.can_manage_service_plan(p.organization_id, p.student_id)
  )
);

CREATE POLICY service_delivery_logs_select ON public.service_delivery_logs FOR SELECT
USING (public.can_read_service(organization_id, primary_student_id));

CREATE POLICY service_delivery_logs_insert ON public.service_delivery_logs FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.student_service_plans p
    WHERE p.id = service_plan_id
      AND p.organization_id = organization_id
      AND p.student_id = primary_student_id
      AND (
        (record_status = 'draft' AND public.can_enter_service_log(p.organization_id, p.student_id))
        OR (record_status IN ('finalized', 'corrected') AND public.can_finalize_service_log(p.organization_id, p.student_id))
      )
  )
);

CREATE POLICY service_delivery_logs_update ON public.service_delivery_logs FOR UPDATE
USING (
  (record_status = 'draft' AND public.can_enter_service_log(organization_id, primary_student_id))
  OR public.can_finalize_service_log(organization_id, primary_student_id)
)
WITH CHECK (
  (record_status = 'draft' AND public.can_enter_service_log(organization_id, primary_student_id))
  OR (record_status IN ('finalized', 'corrected', 'archived') AND public.can_finalize_service_log(organization_id, primary_student_id))
);

CREATE POLICY service_participants_select ON public.service_delivery_participants FOR SELECT
USING (
  public.can_read_service(organization_id, student_id)
  AND EXISTS (
    SELECT 1 FROM public.service_delivery_logs l
    WHERE l.id = delivery_log_id AND public.can_read_service(l.organization_id, l.primary_student_id)
  )
);

CREATE POLICY service_participants_insert ON public.service_delivery_participants FOR INSERT
WITH CHECK (
  public.can_read_student(organization_id, student_id)
  AND EXISTS (
    SELECT 1 FROM public.service_delivery_logs l
    WHERE l.id = delivery_log_id
      AND l.organization_id = organization_id
      AND (
        (l.record_status = 'draft' AND public.can_enter_service_log(l.organization_id, l.primary_student_id))
        OR public.can_finalize_service_log(l.organization_id, l.primary_student_id)
      )
  )
);

CREATE POLICY service_participants_update ON public.service_delivery_participants FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.service_delivery_logs l
    WHERE l.id = delivery_log_id
      AND (
        (l.record_status = 'draft' AND public.can_enter_service_log(l.organization_id, l.primary_student_id))
        OR public.can_finalize_service_log(l.organization_id, l.primary_student_id)
      )
  )
)
WITH CHECK (
  public.can_read_student(organization_id, student_id)
  AND EXISTS (
    SELECT 1 FROM public.service_delivery_logs l
    WHERE l.id = delivery_log_id
      AND l.organization_id = organization_id
      AND (
        (l.record_status = 'draft' AND public.can_enter_service_log(l.organization_id, l.primary_student_id))
        OR public.can_finalize_service_log(l.organization_id, l.primary_student_id)
      )
  )
);

CREATE POLICY service_delivery_history_select ON public.service_delivery_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.service_delivery_logs l
    WHERE l.id = delivery_log_id AND public.can_read_service(l.organization_id, l.primary_student_id)
  )
);

CREATE POLICY service_delivery_history_insert ON public.service_delivery_status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.service_delivery_logs l
    WHERE l.id = delivery_log_id
      AND l.organization_id = organization_id
      AND (
        public.can_enter_service_log(l.organization_id, l.primary_student_id)
        OR public.can_finalize_service_log(l.organization_id, l.primary_student_id)
      )
  )
);

CREATE POLICY service_cancellation_reasons_select ON public.service_cancellation_reasons FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND (
    public.has_org_permission(organization_id, 'service.read')
    OR public.has_org_permission(organization_id, 'service.log.enter')
    OR public.has_org_permission(organization_id, 'service.definition.manage')
  )
);

CREATE POLICY service_cancellation_reasons_mutate ON public.service_cancellation_reasons FOR ALL
USING (
  public.has_org_permission(organization_id, 'service.definition.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'service.definition.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY makeup_service_links_select ON public.makeup_service_links FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.service_delivery_logs l
    WHERE l.id = original_log_id AND public.can_read_service(l.organization_id, l.primary_student_id)
  )
);

CREATE POLICY makeup_service_links_mutate ON public.makeup_service_links FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.service_delivery_logs l
    WHERE l.id = original_log_id AND public.can_finalize_service_log(l.organization_id, l.primary_student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.service_delivery_logs l
    WHERE l.id = original_log_id
      AND l.organization_id = organization_id
      AND public.can_finalize_service_log(l.organization_id, l.primary_student_id)
  )
);

CREATE POLICY service_note_templates_select ON public.service_note_templates FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND (
    public.has_org_permission(organization_id, 'service.read')
    OR public.has_org_permission(organization_id, 'service.log.enter')
    OR public.has_org_permission(organization_id, 'service.definition.manage')
  )
);

CREATE POLICY service_note_templates_mutate ON public.service_note_templates FOR ALL
USING (
  public.has_org_permission(organization_id, 'service.definition.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'service.definition.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY service_reviews_select ON public.service_review_records FOR SELECT
USING (public.can_read_service(organization_id, student_id));

CREATE POLICY service_reviews_insert ON public.service_review_records FOR INSERT
WITH CHECK (
  public.can_manage_service_plan(organization_id, student_id)
  AND EXISTS (
    SELECT 1 FROM public.student_service_plans p
    WHERE p.id = service_plan_id
      AND p.organization_id = organization_id
      AND p.student_id = student_id
  )
);

CREATE POLICY service_exports_select ON public.service_exports FOR SELECT
USING (
  public.has_org_permission(organization_id, 'service.export')
  AND (student_id IS NULL OR public.can_read_service(organization_id, student_id))
);

CREATE POLICY service_exports_insert ON public.service_exports FOR INSERT
WITH CHECK (
  public.has_org_permission(organization_id, 'service.export')
  AND (student_id IS NULL OR public.can_read_service(organization_id, student_id))
);
