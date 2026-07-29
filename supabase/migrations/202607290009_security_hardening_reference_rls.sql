-- Phase 17: Harden reference-catalog tables with RLS.
-- These catalogs contain no tenant student data. Default deny for writes.
-- Authenticated users may read catalog rows required by the application.

ALTER TABLE public.app_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_roles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.app_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_permissions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.measurement_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurement_types FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS app_roles_select ON public.app_roles;
CREATE POLICY app_roles_select ON public.app_roles
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS app_permissions_select ON public.app_permissions;
CREATE POLICY app_permissions_select ON public.app_permissions
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS role_permissions_select ON public.role_permissions;
CREATE POLICY role_permissions_select ON public.role_permissions
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS measurement_types_select ON public.measurement_types;
CREATE POLICY measurement_types_select ON public.measurement_types
FOR SELECT TO authenticated
USING (true);
