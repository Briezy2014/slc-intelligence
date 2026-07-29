-- Phase 16: Administrative Intelligence
-- Aggregates must never expand access beyond underlying module authorization.
-- Small-group suppression is a privacy safeguard, not a legal standard.
-- Missing documentation must not be treated as zero educational outcomes.

INSERT INTO public.app_permissions (code, label, description) VALUES
  ('admin.intelligence.read', 'Read administrative intelligence', 'View authorized workflow aggregates'),
  ('admin.export', 'Export administrative summaries', 'Export authorized aggregate summaries'),
  ('admin.audit.read', 'Read administrative audit', 'View administrative export and audit activity')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code) VALUES
  ('organization_admin', 'admin.intelligence.read'),
  ('organization_admin', 'admin.export'),
  ('organization_admin', 'admin.audit.read'),
  ('district_sped_admin', 'admin.intelligence.read'),
  ('district_sped_admin', 'admin.export'),
  ('district_sped_admin', 'admin.audit.read'),
  ('building_admin', 'admin.intelligence.read'),
  ('program_admin', 'admin.intelligence.read')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.organization_privacy_settings (
  organization_id uuid PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
  small_group_threshold integer NOT NULL DEFAULT 5 CHECK (small_group_threshold >= 1),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.administrative_export_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  exported_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  export_type text NOT NULL DEFAULT 'summary',
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  scope_summary text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS administrative_export_events_org_idx
  ON public.administrative_export_events(organization_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.can_read_admin_intelligence(p_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_org_member(p_org_id)
    AND public.has_org_permission(p_org_id, 'admin.intelligence.read');
$$;

CREATE OR REPLACE FUNCTION public.can_export_admin_intelligence(p_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_org_member(p_org_id)
    AND public.has_org_permission(p_org_id, 'admin.export');
$$;

DROP TRIGGER IF EXISTS organization_privacy_settings_set_updated_at ON public.organization_privacy_settings;
CREATE TRIGGER organization_privacy_settings_set_updated_at
BEFORE UPDATE ON public.organization_privacy_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.organization_privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_privacy_settings FORCE ROW LEVEL SECURITY;
ALTER TABLE public.administrative_export_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrative_export_events FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS privacy_settings_select ON public.organization_privacy_settings;
CREATE POLICY privacy_settings_select ON public.organization_privacy_settings
FOR SELECT USING (public.can_read_admin_intelligence(organization_id));

DROP POLICY IF EXISTS privacy_settings_upsert ON public.organization_privacy_settings;
CREATE POLICY privacy_settings_upsert ON public.organization_privacy_settings
FOR ALL
USING (public.has_org_permission(organization_id, 'org.manage'))
WITH CHECK (public.has_org_permission(organization_id, 'org.manage'));

DROP POLICY IF EXISTS admin_export_select ON public.administrative_export_events;
CREATE POLICY admin_export_select ON public.administrative_export_events
FOR SELECT USING (
  public.has_org_permission(organization_id, 'admin.audit.read')
  OR exported_by = auth.uid()
);

DROP POLICY IF EXISTS admin_export_insert ON public.administrative_export_events;
CREATE POLICY admin_export_insert ON public.administrative_export_events
FOR INSERT WITH CHECK (public.can_export_admin_intelligence(organization_id));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_privacy_settings TO authenticated;
GRANT SELECT, INSERT ON public.administrative_export_events TO authenticated;
