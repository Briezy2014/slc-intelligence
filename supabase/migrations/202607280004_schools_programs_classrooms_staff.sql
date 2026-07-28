-- 202607280004_schools_programs_classrooms_staff.sql

CREATE TABLE public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  school_code text,
  school_type text NOT NULL DEFAULT 'public' CHECK (school_type IN ('public', 'private', 'charter', 'other')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

CREATE INDEX schools_org_idx ON public.schools(organization_id);
CREATE TRIGGER schools_set_updated_at BEFORE UPDATE ON public.schools
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  school_id uuid REFERENCES public.schools(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  program_type text NOT NULL DEFAULT 'specialized_learning' CHECK (program_type IN ('specialized_learning', 'related_services', 'inclusion', 'other')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX programs_org_idx ON public.programs(organization_id);
CREATE INDEX programs_school_idx ON public.programs(school_id);
CREATE TRIGGER programs_set_updated_at BEFORE UPDATE ON public.programs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  program_id uuid REFERENCES public.programs(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  academic_year text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX classrooms_org_idx ON public.classrooms(organization_id);
CREATE INDEX classrooms_school_idx ON public.classrooms(school_id);
CREATE TRIGGER classrooms_set_updated_at BEFORE UPDATE ON public.classrooms
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.school_staff_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  assignment_type text NOT NULL DEFAULT 'staff',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX school_staff_assignments_user_idx ON public.school_staff_assignments(user_id);
CREATE INDEX school_staff_assignments_school_idx ON public.school_staff_assignments(school_id);

CREATE TABLE public.program_staff_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  assignment_type text NOT NULL DEFAULT 'staff',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX program_staff_assignments_user_idx ON public.program_staff_assignments(user_id);

CREATE TABLE public.classroom_staff_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  assignment_type text NOT NULL DEFAULT 'staff',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX classroom_staff_assignments_user_idx ON public.classroom_staff_assignments(user_id);

CREATE OR REPLACE FUNCTION public.has_school_scope(p_org_id uuid, p_school_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.has_org_permission(p_org_id, 'school.manage')
    OR public.has_org_permission(p_org_id, 'student.read') AND EXISTS (
      SELECT 1 FROM public.organization_memberships m
      WHERE m.organization_id = p_org_id AND m.user_id = auth.uid() AND m.status = 'active'
        AND m.role_code IN ('organization_admin', 'district_sped_admin')
    )
    OR EXISTS (
      SELECT 1 FROM public.school_staff_assignments a
      WHERE a.organization_id = p_org_id
        AND a.school_id = p_school_id
        AND a.user_id = auth.uid()
        AND a.status = 'active'
        AND (a.end_date IS NULL OR a.end_date >= CURRENT_DATE)
    );
$$;

CREATE OR REPLACE FUNCTION public.has_program_scope(p_org_id uuid, p_program_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.has_org_permission(p_org_id, 'program.manage')
    OR EXISTS (
      SELECT 1 FROM public.program_staff_assignments a
      WHERE a.organization_id = p_org_id
        AND a.program_id = p_program_id
        AND a.user_id = auth.uid()
        AND a.status = 'active'
        AND (a.end_date IS NULL OR a.end_date >= CURRENT_DATE)
    )
    OR EXISTS (
      SELECT 1
      FROM public.programs p
      JOIN public.school_staff_assignments s
        ON s.school_id = p.school_id AND s.user_id = auth.uid() AND s.status = 'active'
      WHERE p.id = p_program_id AND p.organization_id = p_org_id
    );
$$;

CREATE OR REPLACE FUNCTION public.has_classroom_scope(p_org_id uuid, p_classroom_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.has_org_permission(p_org_id, 'classroom.manage')
    OR EXISTS (
      SELECT 1 FROM public.classroom_staff_assignments a
      WHERE a.organization_id = p_org_id
        AND a.classroom_id = p_classroom_id
        AND a.user_id = auth.uid()
        AND a.status = 'active'
        AND (a.end_date IS NULL OR a.end_date >= CURRENT_DATE)
    )
    OR EXISTS (
      SELECT 1
      FROM public.classrooms c
      WHERE c.id = p_classroom_id
        AND c.organization_id = p_org_id
        AND (
          public.has_school_scope(p_org_id, c.school_id)
          OR (c.program_id IS NOT NULL AND public.has_program_scope(p_org_id, c.program_id))
        )
    );
$$;

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools FORCE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms FORCE ROW LEVEL SECURITY;
ALTER TABLE public.school_staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_staff_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.program_staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_staff_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_staff_assignments FORCE ROW LEVEL SECURITY;

CREATE POLICY schools_select ON public.schools FOR SELECT
USING (public.is_org_member(organization_id) AND (
  public.has_org_permission(organization_id, 'school.manage')
  OR public.has_school_scope(organization_id, id)
  OR public.member_role(organization_id) IN ('organization_admin', 'district_sped_admin')
));

CREATE POLICY schools_insert ON public.schools FOR INSERT
WITH CHECK (public.has_org_permission(organization_id, 'school.manage'));

CREATE POLICY schools_update ON public.schools FOR UPDATE
USING (public.has_org_permission(organization_id, 'school.manage'))
WITH CHECK (public.has_org_permission(organization_id, 'school.manage'));

CREATE POLICY programs_select ON public.programs FOR SELECT
USING (public.is_org_member(organization_id) AND (
  public.has_org_permission(organization_id, 'program.manage')
  OR public.has_program_scope(organization_id, id)
  OR public.member_role(organization_id) IN ('organization_admin', 'district_sped_admin')
));

CREATE POLICY programs_insert ON public.programs FOR INSERT
WITH CHECK (public.has_org_permission(organization_id, 'program.manage'));

CREATE POLICY programs_update ON public.programs FOR UPDATE
USING (public.has_org_permission(organization_id, 'program.manage'))
WITH CHECK (public.has_org_permission(organization_id, 'program.manage'));

CREATE POLICY classrooms_select ON public.classrooms FOR SELECT
USING (public.is_org_member(organization_id) AND (
  public.has_org_permission(organization_id, 'classroom.manage')
  OR public.has_classroom_scope(organization_id, id)
  OR public.member_role(organization_id) IN ('organization_admin', 'district_sped_admin')
));

CREATE POLICY classrooms_insert ON public.classrooms FOR INSERT
WITH CHECK (public.has_org_permission(organization_id, 'classroom.manage'));

CREATE POLICY classrooms_update ON public.classrooms FOR UPDATE
USING (public.has_org_permission(organization_id, 'classroom.manage'))
WITH CHECK (public.has_org_permission(organization_id, 'classroom.manage'));

CREATE POLICY school_staff_select ON public.school_staff_assignments FOR SELECT
USING (public.is_org_member(organization_id) AND (user_id = auth.uid() OR public.has_org_permission(organization_id, 'staff.assign')));

CREATE POLICY school_staff_mutate ON public.school_staff_assignments FOR ALL
USING (public.has_org_permission(organization_id, 'staff.assign'))
WITH CHECK (public.has_org_permission(organization_id, 'staff.assign'));

CREATE POLICY program_staff_select ON public.program_staff_assignments FOR SELECT
USING (public.is_org_member(organization_id) AND (user_id = auth.uid() OR public.has_org_permission(organization_id, 'staff.assign')));

CREATE POLICY program_staff_mutate ON public.program_staff_assignments FOR ALL
USING (public.has_org_permission(organization_id, 'staff.assign'))
WITH CHECK (public.has_org_permission(organization_id, 'staff.assign'));

CREATE POLICY classroom_staff_select ON public.classroom_staff_assignments FOR SELECT
USING (public.is_org_member(organization_id) AND (user_id = auth.uid() OR public.has_org_permission(organization_id, 'staff.assign')));

CREATE POLICY classroom_staff_mutate ON public.classroom_staff_assignments FOR ALL
USING (public.has_org_permission(organization_id, 'staff.assign'))
WITH CHECK (public.has_org_permission(organization_id, 'staff.assign'));
