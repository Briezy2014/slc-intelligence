-- 202607280003_organizations_memberships_invitations_audit.sql

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOINHERIT;
  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER organizations_set_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.organization_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  role_code text NOT NULL REFERENCES public.app_roles(code),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX organization_memberships_user_idx ON public.organization_memberships(user_id);
CREATE INDEX organization_memberships_org_idx ON public.organization_memberships(organization_id);

CREATE TRIGGER organization_memberships_set_updated_at
BEFORE UPDATE ON public.organization_memberships
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.organization_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  role_code text NOT NULL REFERENCES public.app_roles(code),
  token_hash text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'cancelled', 'expired')),
  invited_by uuid REFERENCES public.user_profiles(id),
  expires_at timestamptz NOT NULL,
  accepted_by uuid REFERENCES public.user_profiles(id),
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, email, status)
);

CREATE INDEX organization_invitations_org_idx ON public.organization_invitations(organization_id);
CREATE INDEX organization_invitations_email_idx ON public.organization_invitations(lower(email));

CREATE TRIGGER organization_invitations_set_updated_at
BEFORE UPDATE ON public.organization_invitations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  actor_user_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  success boolean NOT NULL DEFAULT true,
  previous_state jsonb,
  new_state jsonb,
  request_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_events_org_idx ON public.audit_events(organization_id, created_at DESC);
CREATE INDEX audit_events_actor_idx ON public.audit_events(actor_user_id, created_at DESC);

-- Authorization helper functions
CREATE OR REPLACE FUNCTION public.is_org_member(p_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_memberships m
    JOIN public.organizations o ON o.id = m.organization_id
    WHERE m.organization_id = p_org_id
      AND m.user_id = auth.uid()
      AND m.status = 'active'
      AND o.status = 'active'
      AND (m.end_date IS NULL OR m.end_date >= CURRENT_DATE)
  );
$$;

CREATE OR REPLACE FUNCTION public.has_org_permission(p_org_id uuid, p_permission text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_memberships m
    JOIN public.role_permissions rp ON rp.role_code = m.role_code
    JOIN public.organizations o ON o.id = m.organization_id
    WHERE m.organization_id = p_org_id
      AND m.user_id = auth.uid()
      AND m.status = 'active'
      AND o.status = 'active'
      AND rp.permission_code = p_permission
      AND (m.end_date IS NULL OR m.end_date >= CURRENT_DATE)
  );
$$;

CREATE OR REPLACE FUNCTION public.member_role(p_org_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.role_code
  FROM public.organization_memberships m
  WHERE m.organization_id = p_org_id
    AND m.user_id = auth.uid()
    AND m.status = 'active'
  LIMIT 1;
$$;

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships FORCE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events FORCE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles FORCE ROW LEVEL SECURITY;

CREATE POLICY organizations_select_member
ON public.organizations FOR SELECT
USING (public.is_org_member(id));

CREATE POLICY organizations_update_admin
ON public.organizations FOR UPDATE
USING (public.has_org_permission(id, 'org.manage'))
WITH CHECK (public.has_org_permission(id, 'org.manage'));

CREATE POLICY memberships_select_org_member
ON public.organization_memberships FOR SELECT
USING (public.is_org_member(organization_id) OR user_id = auth.uid());

CREATE POLICY memberships_insert_admin
ON public.organization_memberships FOR INSERT
WITH CHECK (public.has_org_permission(organization_id, 'org.members.manage'));

CREATE POLICY memberships_update_admin
ON public.organization_memberships FOR UPDATE
USING (public.has_org_permission(organization_id, 'org.members.manage'))
WITH CHECK (public.has_org_permission(organization_id, 'org.members.manage'));

CREATE POLICY invitations_select_admin
ON public.organization_invitations FOR SELECT
USING (public.has_org_permission(organization_id, 'org.members.manage'));

CREATE POLICY invitations_insert_admin
ON public.organization_invitations FOR INSERT
WITH CHECK (public.has_org_permission(organization_id, 'org.members.manage'));

CREATE POLICY invitations_update_admin
ON public.organization_invitations FOR UPDATE
USING (public.has_org_permission(organization_id, 'org.members.manage'))
WITH CHECK (public.has_org_permission(organization_id, 'org.members.manage'));

CREATE POLICY audit_select_permission
ON public.audit_events FOR SELECT
USING (
  organization_id IS NOT NULL
  AND public.has_org_permission(organization_id, 'org.audit.read')
);

CREATE POLICY audit_insert_member
ON public.audit_events FOR INSERT
WITH CHECK (
  organization_id IS NULL
  OR public.is_org_member(organization_id)
);

-- No update/delete policies for audit_events => immutable for ordinary roles

DROP POLICY IF EXISTS user_profiles_select_self ON public.user_profiles;
CREATE POLICY user_profiles_select_self_or_peer
ON public.user_profiles FOR SELECT
USING (
  id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.organization_memberships mine
    JOIN public.organization_memberships peer
      ON peer.organization_id = mine.organization_id
    WHERE mine.user_id = auth.uid()
      AND mine.status = 'active'
      AND peer.user_id = user_profiles.id
      AND peer.status = 'active'
  )
);
