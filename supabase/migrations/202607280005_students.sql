-- 202607280005_students.sql

CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  preferred_name text,
  local_identifier text NOT NULL,
  grade_level text,
  enrollment_status text NOT NULL DEFAULT 'active' CHECK (enrollment_status IN ('active', 'inactive', 'archived')),
  start_date date,
  end_date date,
  created_by uuid REFERENCES public.user_profiles(id),
  updated_by uuid REFERENCES public.user_profiles(id),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, local_identifier),
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE INDEX students_org_idx ON public.students(organization_id);
CREATE INDEX students_status_idx ON public.students(organization_id, enrollment_status);
CREATE TRIGGER students_set_updated_at BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.student_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX student_enrollments_student_idx ON public.student_enrollments(student_id);

CREATE TABLE public.student_program_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.student_classroom_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.student_staff_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  assignment_role text NOT NULL CHECK (assignment_role IN (
    'case_manager', 'intervention_specialist', 'related_service_provider', 'paraprofessional', 'teacher', 'other'
  )),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX student_staff_assignments_user_idx ON public.student_staff_assignments(user_id);
CREATE INDEX student_staff_assignments_student_idx ON public.student_staff_assignments(student_id);

CREATE TABLE public.student_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  changed_by uuid REFERENCES public.user_profiles(id),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.can_read_student(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.has_org_permission(p_org_id, 'student.read')
    AND (
      public.member_role(p_org_id) IN ('organization_admin', 'district_sped_admin')
      OR EXISTS (
        SELECT 1 FROM public.student_staff_assignments a
        WHERE a.organization_id = p_org_id AND a.student_id = p_student_id
          AND a.user_id = auth.uid() AND a.status = 'active'
          AND (a.end_date IS NULL OR a.end_date >= CURRENT_DATE)
      )
      OR EXISTS (
        SELECT 1 FROM public.student_enrollments e
        WHERE e.student_id = p_student_id AND e.organization_id = p_org_id AND e.status = 'active'
          AND public.has_school_scope(p_org_id, e.school_id)
      )
      OR EXISTS (
        SELECT 1 FROM public.student_program_assignments p
        WHERE p.student_id = p_student_id AND p.organization_id = p_org_id AND p.status = 'active'
          AND public.has_program_scope(p_org_id, p.program_id)
      )
      OR EXISTS (
        SELECT 1 FROM public.student_classroom_assignments c
        WHERE c.student_id = p_student_id AND c.organization_id = p_org_id AND c.status = 'active'
          AND public.has_classroom_scope(p_org_id, c.classroom_id)
      )
    );
$$;

CREATE OR REPLACE FUNCTION public.can_edit_student(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'student.edit')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_program_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_program_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_classroom_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_classroom_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_staff_assignments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.student_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_status_history FORCE ROW LEVEL SECURITY;

CREATE POLICY students_select ON public.students FOR SELECT
USING (public.can_read_student(organization_id, id));

CREATE POLICY students_insert ON public.students FOR INSERT
WITH CHECK (public.has_org_permission(organization_id, 'student.create'));

CREATE POLICY students_update ON public.students FOR UPDATE
USING (public.can_edit_student(organization_id, id) OR public.has_org_permission(organization_id, 'student.archive'))
WITH CHECK (public.can_edit_student(organization_id, id) OR public.has_org_permission(organization_id, 'student.archive'));

CREATE POLICY student_enrollments_select ON public.student_enrollments FOR SELECT
USING (public.can_read_student(organization_id, student_id));

CREATE POLICY student_enrollments_mutate ON public.student_enrollments FOR ALL
USING (public.can_edit_student(organization_id, student_id))
WITH CHECK (public.can_edit_student(organization_id, student_id));

CREATE POLICY student_program_select ON public.student_program_assignments FOR SELECT
USING (public.can_read_student(organization_id, student_id));

CREATE POLICY student_program_mutate ON public.student_program_assignments FOR ALL
USING (public.can_edit_student(organization_id, student_id))
WITH CHECK (public.can_edit_student(organization_id, student_id));

CREATE POLICY student_classroom_select ON public.student_classroom_assignments FOR SELECT
USING (public.can_read_student(organization_id, student_id));

CREATE POLICY student_classroom_mutate ON public.student_classroom_assignments FOR ALL
USING (public.can_edit_student(organization_id, student_id))
WITH CHECK (public.can_edit_student(organization_id, student_id));

CREATE POLICY student_staff_select ON public.student_staff_assignments FOR SELECT
USING (public.can_read_student(organization_id, student_id) OR user_id = auth.uid());

CREATE POLICY student_staff_mutate ON public.student_staff_assignments FOR ALL
USING (public.has_org_permission(organization_id, 'staff.assign'))
WITH CHECK (public.has_org_permission(organization_id, 'staff.assign'));

CREATE POLICY student_status_select ON public.student_status_history FOR SELECT
USING (public.can_read_student(organization_id, student_id));

CREATE POLICY student_status_insert ON public.student_status_history FOR INSERT
WITH CHECK (public.can_edit_student(organization_id, student_id) OR public.has_org_permission(organization_id, 'student.archive'));
