-- Allow users to see organizations they belong to even when membership is not yet active.
-- (Previously organizations were only visible via is_org_member, which requires status=active.
-- That hid org names for pending members and made owner recovery confusing.)
DROP POLICY IF EXISTS organizations_select_any_membership ON public.organizations;
CREATE POLICY organizations_select_any_membership
ON public.organizations FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_memberships m
    WHERE m.organization_id = organizations.id
      AND m.user_id = auth.uid()
  )
);

-- Let an organization_admin reactivate their own membership when stuck pending/inactive.
-- This unblocks the founding owner without requiring another admin to approve them.
CREATE OR REPLACE FUNCTION public.activate_own_organization_admin_membership()
RETURNS TABLE (
  membership_id uuid,
  organization_id uuid,
  organization_name text,
  role_code text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.organization_memberships m
  SET
    status = 'active',
    end_date = NULL,
    updated_at = now()
  WHERE m.user_id = auth.uid()
    AND m.role_code = 'organization_admin'
    AND m.status IS DISTINCT FROM 'active';

  UPDATE public.organizations o
  SET
    status = 'active',
    archived_at = NULL,
    updated_at = now()
  WHERE o.id IN (
      SELECT m.organization_id
      FROM public.organization_memberships m
      WHERE m.user_id = auth.uid()
        AND m.role_code = 'organization_admin'
    )
    AND o.status IS DISTINCT FROM 'active';

  RETURN QUERY
  SELECT
    m.id,
    m.organization_id,
    o.name,
    m.role_code,
    m.status
  FROM public.organization_memberships m
  JOIN public.organizations o ON o.id = m.organization_id
  WHERE m.user_id = auth.uid()
    AND m.role_code = 'organization_admin'
    AND m.status = 'active'
  ORDER BY m.created_at ASC;
END;
$$;

REVOKE ALL ON FUNCTION public.activate_own_organization_admin_membership() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.activate_own_organization_admin_membership() TO authenticated;

-- If the signed-in user has no memberships at all, and exactly one organization exists
-- with zero active organization_admin members, claim that org as organization_admin.
-- Intended for single-tenant founder recovery (e.g. membership row missing after auth recreate).
CREATE OR REPLACE FUNCTION public.claim_sole_organization_as_admin()
RETURNS TABLE (
  membership_id uuid,
  organization_id uuid,
  organization_name text,
  role_code text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_org_id uuid;
  v_org_name text;
  v_membership_id uuid;
  v_admin_count integer;
  v_org_count integer;
  v_my_memberships integer;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT COUNT(*) INTO v_my_memberships
  FROM public.organization_memberships m
  WHERE m.user_id = v_user_id;

  IF v_my_memberships > 0 THEN
    -- User already has memberships; use activate_own_organization_admin_membership instead.
    RETURN;
  END IF;

  SELECT COUNT(*) INTO v_org_count FROM public.organizations;

  IF v_org_count <> 1 THEN
    RETURN;
  END IF;

  SELECT o.id, o.name INTO v_org_id, v_org_name
  FROM public.organizations o
  ORDER BY o.created_at ASC
  LIMIT 1;

  SELECT COUNT(*) INTO v_admin_count
  FROM public.organization_memberships m
  WHERE m.organization_id = v_org_id
    AND m.role_code = 'organization_admin'
    AND m.status = 'active'
    AND (m.end_date IS NULL OR m.end_date >= CURRENT_DATE);

  IF v_admin_count > 0 THEN
    RETURN;
  END IF;

  INSERT INTO public.organization_memberships (
    organization_id,
    user_id,
    role_code,
    status,
    start_date,
    end_date
  )
  VALUES (
    v_org_id,
    v_user_id,
    'organization_admin',
    'active',
    CURRENT_DATE,
    NULL
  )
  ON CONFLICT (organization_id, user_id) DO UPDATE
  SET
    role_code = 'organization_admin',
    status = 'active',
    end_date = NULL,
    updated_at = now()
  RETURNING id INTO v_membership_id;

  UPDATE public.organizations
  SET status = 'active', archived_at = NULL, updated_at = now()
  WHERE id = v_org_id;

  membership_id := v_membership_id;
  organization_id := v_org_id;
  organization_name := v_org_name;
  role_code := 'organization_admin';
  status := 'active';
  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_sole_organization_as_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_sole_organization_as_admin() TO authenticated;
