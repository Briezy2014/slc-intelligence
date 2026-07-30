-- 202607300013_comms_translation_plans_district_forms.sql
-- Communication language + parent acknowledgements, student plan flags (504/Gifted/EL),
-- district blank form templates, and expanded education document types.

-- ---------------------------------------------------------------------------
-- Communication language + acknowledgement request
-- ---------------------------------------------------------------------------
ALTER TABLE public.communication_logs
  ADD COLUMN IF NOT EXISTS language_code text NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS source_language_code text NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS source_summary text,
  ADD COLUMN IF NOT EXISTS acknowledgement_requested boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.communication_logs.language_code IS
  'Language of the stored subject/summary (BCP-47 style code, e.g. en, es, ar).';
COMMENT ON COLUMN public.communication_logs.source_summary IS
  'Optional original English (or source-language) body kept when a translated summary is saved.';

-- ---------------------------------------------------------------------------
-- Parent / family acknowledgement on communications (not IDEA consent)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.communication_acknowledgements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  communication_log_id uuid NOT NULL REFERENCES public.communication_logs(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  signer_display_name text NOT NULL,
  signer_email text,
  method text NOT NULL DEFAULT 'typed'
    CHECK (method IN ('typed', 'drawn', 'staff_attested')),
  status text NOT NULL DEFAULT 'acknowledged'
    CHECK (status IN ('acknowledged', 'reviewed', 'requested_clarification')),
  typed_signature text,
  content_hash text,
  notes text,
  signed_at timestamptz NOT NULL DEFAULT now(),
  recorded_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS communication_acknowledgements_org_log_idx
  ON public.communication_acknowledgements(organization_id, communication_log_id, signed_at DESC);

CREATE TRIGGER communication_acknowledgements_set_updated_at
BEFORE UPDATE ON public.communication_acknowledgements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.communication_acknowledgements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_acknowledgements FORCE ROW LEVEL SECURITY;

CREATE POLICY communication_acknowledgements_select
ON public.communication_acknowledgements FOR SELECT
USING (
  public.has_org_permission(organization_id, 'communication.read')
  OR public.has_org_permission(organization_id, 'communication.enter')
  OR public.has_org_permission(organization_id, 'communication.finalize')
);

CREATE POLICY communication_acknowledgements_insert
ON public.communication_acknowledgements FOR INSERT
WITH CHECK (
  public.has_org_permission(organization_id, 'communication.enter')
  OR public.has_org_permission(organization_id, 'communication.finalize')
);

-- ---------------------------------------------------------------------------
-- Student support plan flags (IEP / 504 / Gifted / EL)
-- ---------------------------------------------------------------------------
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS has_iep boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_section_504 boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_gifted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_english_learner boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS home_language text,
  ADD COLUMN IF NOT EXISTS support_plan_notes text;

COMMENT ON COLUMN public.students.has_section_504 IS
  'Staff-indicated Section 504 plan flag for caseload organization. Not a legal determination.';
COMMENT ON COLUMN public.students.has_gifted IS
  'Staff-indicated gifted identification/services flag. Not a legal determination.';
COMMENT ON COLUMN public.students.has_english_learner IS
  'Staff-indicated English learner (EL) flag for language supports. Not a legal determination.';

-- ---------------------------------------------------------------------------
-- Expand education document types for 504 / Gifted / EL
-- ---------------------------------------------------------------------------
ALTER TABLE public.education_documents
  DROP CONSTRAINT IF EXISTS education_documents_document_type_check;
ALTER TABLE public.education_documents
  ADD CONSTRAINT education_documents_document_type_check
  CHECK (document_type IN ('iep', 'etr', 'progress_report', 'section_504', 'gifted', 'el'));

ALTER TABLE public.education_document_uploads
  DROP CONSTRAINT IF EXISTS education_document_uploads_document_type_check;
ALTER TABLE public.education_document_uploads
  ADD CONSTRAINT education_document_uploads_document_type_check
  CHECK (document_type IN ('iep', 'etr', 'progress_report', 'section_504', 'gifted', 'el', 'other'));

-- ---------------------------------------------------------------------------
-- District blank official form templates (org-level masters)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.district_form_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  document_type text NOT NULL
    CHECK (document_type IN ('iep', 'etr', 'progress_report', 'section_504', 'gifted', 'el', 'other')),
  name text NOT NULL,
  description text,
  file_name text,
  content_type text,
  byte_size bigint,
  storage_path text,
  extracted_text text,
  is_blank_master boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS district_form_templates_org_type_idx
  ON public.district_form_templates(organization_id, document_type, active);

CREATE TRIGGER district_form_templates_set_updated_at
BEFORE UPDATE ON public.district_form_templates
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.district_form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.district_form_templates FORCE ROW LEVEL SECURITY;

CREATE POLICY district_form_templates_select
ON public.district_form_templates FOR SELECT
USING (
  public.has_org_permission(organization_id, 'education_document.read')
  OR public.has_org_permission(organization_id, 'education_document.manage')
);

CREATE POLICY district_form_templates_insert
ON public.district_form_templates FOR INSERT
WITH CHECK (public.has_org_permission(organization_id, 'education_document.manage'));

CREATE POLICY district_form_templates_update
ON public.district_form_templates FOR UPDATE
USING (public.has_org_permission(organization_id, 'education_document.manage'))
WITH CHECK (public.has_org_permission(organization_id, 'education_document.manage'));
