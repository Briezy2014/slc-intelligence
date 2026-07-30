-- 202607300011_education_documents.sql
-- IEP / ETR / progress-report document workspace records (assistive drafting + upload metadata).
-- These records support educator workflows and are not automatic legal determinations.

INSERT INTO public.app_permissions (code, label, description) VALUES
  ('education_document.manage', 'Manage education documents', 'Create and edit IEP/ETR/progress document drafts and upload records'),
  ('education_document.read', 'Read education documents', 'View authorized IEP/ETR/progress document drafts and upload records')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code)
SELECT role_code, permission_code
FROM (
  VALUES
    ('organization_admin', 'education_document.manage'),
    ('organization_admin', 'education_document.read'),
    ('district_sped_admin', 'education_document.manage'),
    ('district_sped_admin', 'education_document.read'),
    ('building_admin', 'education_document.read'),
    ('program_admin', 'education_document.manage'),
    ('program_admin', 'education_document.read'),
    ('intervention_specialist', 'education_document.manage'),
    ('intervention_specialist', 'education_document.read'),
    ('special_education_teacher', 'education_document.manage'),
    ('special_education_teacher', 'education_document.read'),
    ('case_manager', 'education_document.manage'),
    ('case_manager', 'education_document.read'),
    ('related_service_provider', 'education_document.read'),
    ('school_psychologist', 'education_document.manage'),
    ('school_psychologist', 'education_document.read'),
    ('read_only_reviewer', 'education_document.read')
) AS seed(role_code, permission_code)
ON CONFLICT DO NOTHING;

CREATE TABLE public.education_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('iep', 'etr', 'progress_report')),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'finalized', 'archived')),
  school_year text,
  grade_level text,
  template_key text,
  fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  section_notes jsonb NOT NULL DEFAULT '{}'::jsonb,
  legal_disclaimer text NOT NULL DEFAULT 'Draft for educator/team review only. Not an automatic legal determination or final district record.',
  created_by uuid REFERENCES public.user_profiles(id),
  updated_by uuid REFERENCES public.user_profiles(id),
  finalized_at timestamptz,
  finalized_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX education_documents_org_student_idx
  ON public.education_documents(organization_id, student_id, document_type, updated_at DESC);

CREATE TRIGGER education_documents_set_updated_at
BEFORE UPDATE ON public.education_documents
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.education_document_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  education_document_id uuid REFERENCES public.education_documents(id) ON DELETE SET NULL,
  document_type text NOT NULL CHECK (document_type IN ('iep', 'etr', 'progress_report', 'other')),
  file_name text NOT NULL,
  content_type text,
  byte_size bigint,
  storage_path text,
  notes text,
  uploaded_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX education_document_uploads_org_student_idx
  ON public.education_document_uploads(organization_id, student_id, created_at DESC);

CREATE TRIGGER education_document_uploads_set_updated_at
BEFORE UPDATE ON public.education_document_uploads
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.education_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_documents FORCE ROW LEVEL SECURITY;
ALTER TABLE public.education_document_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_document_uploads FORCE ROW LEVEL SECURITY;

CREATE POLICY education_documents_select
ON public.education_documents FOR SELECT
USING (
  public.has_org_permission(organization_id, 'education_document.read')
  OR public.has_org_permission(organization_id, 'education_document.manage')
);

CREATE POLICY education_documents_insert
ON public.education_documents FOR INSERT
WITH CHECK (public.has_org_permission(organization_id, 'education_document.manage'));

CREATE POLICY education_documents_update
ON public.education_documents FOR UPDATE
USING (public.has_org_permission(organization_id, 'education_document.manage'))
WITH CHECK (public.has_org_permission(organization_id, 'education_document.manage'));

CREATE POLICY education_document_uploads_select
ON public.education_document_uploads FOR SELECT
USING (
  public.has_org_permission(organization_id, 'education_document.read')
  OR public.has_org_permission(organization_id, 'education_document.manage')
);

CREATE POLICY education_document_uploads_insert
ON public.education_document_uploads FOR INSERT
WITH CHECK (public.has_org_permission(organization_id, 'education_document.manage'));

CREATE POLICY education_document_uploads_update
ON public.education_document_uploads FOR UPDATE
USING (public.has_org_permission(organization_id, 'education_document.manage'))
WITH CHECK (public.has_org_permission(organization_id, 'education_document.manage'));
