-- 202607300010_organization_access_requests.sql
-- Public account request + admin approval workflow (in-app notification queue).

CREATE TABLE public.organization_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  requester_user_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  email text NOT NULL,
  full_name text NOT NULL,
  requested_role_codes text[] NOT NULL DEFAULT '{}',
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'cancelled')),
  granted_role_code text REFERENCES public.app_roles(code),
  reviewed_by uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  review_note text,
  resulting_membership_id uuid REFERENCES public.organization_memberships(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (cardinality(requested_role_codes) >= 1)
);

CREATE INDEX organization_access_requests_org_status_idx
  ON public.organization_access_requests(organization_id, status, created_at DESC);
CREATE INDEX organization_access_requests_email_idx
  ON public.organization_access_requests(lower(email));
CREATE INDEX organization_access_requests_requester_idx
  ON public.organization_access_requests(requester_user_id);

CREATE TRIGGER organization_access_requests_set_updated_at
BEFORE UPDATE ON public.organization_access_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.organization_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_access_requests FORCE ROW LEVEL SECURITY;

CREATE POLICY access_requests_select_admin_or_self
ON public.organization_access_requests
FOR SELECT
USING (
  requester_user_id = auth.uid()
  OR public.has_org_permission(organization_id, 'org.members.manage')
);

CREATE POLICY access_requests_update_admin
ON public.organization_access_requests
FOR UPDATE
USING (public.has_org_permission(organization_id, 'org.members.manage'))
WITH CHECK (public.has_org_permission(organization_id, 'org.members.manage'));

-- Resolve org without exposing the organizations table to anonymous users.
CREATE OR REPLACE FUNCTION public.resolve_organization_id_by_slug(p_slug text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id
  FROM public.organizations
  WHERE lower(slug) = lower(trim(p_slug))
    AND status = 'active'
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.resolve_organization_id_by_slug(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_organization_id_by_slug(text) TO anon, authenticated;

-- Authenticated users submit their own pending access request by org slug.
CREATE OR REPLACE FUNCTION public.submit_organization_access_request(
  p_org_slug text,
  p_full_name text,
  p_email text,
  p_requested_role_codes text[],
  p_message text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_org_id uuid;
  v_user_id uuid := auth.uid();
  v_request_id uuid;
  v_role text;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF p_full_name IS NULL OR length(trim(p_full_name)) < 2 THEN
    RAISE EXCEPTION 'Full name is required';
  END IF;

  IF p_email IS NULL OR position('@' in p_email) = 0 THEN
    RAISE EXCEPTION 'Valid email is required';
  END IF;

  IF p_requested_role_codes IS NULL OR cardinality(p_requested_role_codes) < 1 THEN
    RAISE EXCEPTION 'Select at least one role';
  END IF;

  FOREACH v_role IN ARRAY p_requested_role_codes LOOP
    IF v_role = 'platform_admin' THEN
      RAISE EXCEPTION 'That role cannot be requested';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.app_roles WHERE code = v_role) THEN
      RAISE EXCEPTION 'Invalid role requested';
    END IF;
  END LOOP;

  v_org_id := public.resolve_organization_id_by_slug(p_org_slug);
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Organization not found';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.organization_memberships m
    WHERE m.organization_id = v_org_id
      AND m.user_id = v_user_id
      AND m.status = 'active'
  ) THEN
    RAISE EXCEPTION 'You already have active access';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.organization_access_requests r
    WHERE r.organization_id = v_org_id
      AND r.requester_user_id = v_user_id
      AND r.status = 'pending'
  ) THEN
    RAISE EXCEPTION 'A pending request already exists';
  END IF;

  INSERT INTO public.organization_access_requests (
    organization_id,
    requester_user_id,
    email,
    full_name,
    requested_role_codes,
    message,
    status
  ) VALUES (
    v_org_id,
    v_user_id,
    lower(trim(p_email)),
    trim(p_full_name),
    p_requested_role_codes,
    NULLIF(trim(COALESCE(p_message, '')), ''),
    'pending'
  )
  RETURNING id INTO v_request_id;

  RETURN v_request_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_organization_access_request(text, text, text, text[], text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_organization_access_request(text, text, text, text[], text) TO authenticated;
