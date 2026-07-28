-- 202607280002_roles_permissions_profiles.sql

CREATE TABLE public.app_roles (
  code text PRIMARY KEY,
  label text NOT NULL,
  description text NOT NULL,
  is_assignable boolean NOT NULL DEFAULT true
);

INSERT INTO public.app_roles (code, label, description) VALUES
  ('platform_admin', 'Platform administrator', 'Internal platform configuration with minimized student access'),
  ('organization_admin', 'Organization administrator', 'Organization-wide administration'),
  ('district_sped_admin', 'District special education administrator', 'District/program special education administration'),
  ('building_admin', 'Building administrator', 'Assigned school administration'),
  ('program_admin', 'Program administrator', 'Assigned program administration'),
  ('intervention_specialist', 'Intervention specialist', 'Primary instructional caseload role'),
  ('special_education_teacher', 'Special education teacher', 'Classroom instructional role'),
  ('related_service_provider', 'Related service provider', 'Assigned student service role'),
  ('school_psychologist', 'School psychologist', 'Assigned evaluation/support role'),
  ('case_manager', 'Case manager', 'Assigned student case management'),
  ('paraprofessional', 'Paraprofessional', 'Limited assigned classroom/student support'),
  ('read_only_reviewer', 'Read-only reviewer', 'View-only access within assigned scope');

CREATE TABLE public.app_permissions (
  code text PRIMARY KEY,
  label text NOT NULL,
  description text NOT NULL
);

INSERT INTO public.app_permissions (code, label, description) VALUES
  ('org.manage', 'Manage organization', 'Update organization settings'),
  ('org.members.manage', 'Manage memberships', 'Invite, role-assign, and deactivate members'),
  ('org.audit.read', 'Read audit events', 'View organization audit history'),
  ('school.manage', 'Manage schools', 'Create and edit schools'),
  ('program.manage', 'Manage programs', 'Create and edit programs'),
  ('classroom.manage', 'Manage classrooms', 'Create and edit classrooms'),
  ('staff.assign', 'Assign staff', 'Manage school/program/classroom staff assignments'),
  ('student.create', 'Create students', 'Create student records'),
  ('student.edit', 'Edit students', 'Edit active student records'),
  ('student.archive', 'Archive students', 'Archive and restore students'),
  ('student.read', 'Read students', 'View authorized student records'),
  ('iep.manage', 'Manage IEP cycles', 'Create and edit IEP cycles'),
  ('goal.manage', 'Manage goals', 'Create and edit goals and objectives'),
  ('goal.read', 'Read goals', 'View authorized goals'),
  ('progress.enter', 'Enter progress data', 'Create and edit draft progress entries'),
  ('progress.finalize', 'Finalize progress data', 'Finalize or correct progress entries'),
  ('progress.read', 'Read progress data', 'View authorized progress data'),
  ('analytics.read', 'Read analytics', 'View authorized analytics');

CREATE TABLE public.role_permissions (
  role_code text NOT NULL REFERENCES public.app_roles(code) ON DELETE CASCADE,
  permission_code text NOT NULL REFERENCES public.app_permissions(code) ON DELETE CASCADE,
  PRIMARY KEY (role_code, permission_code)
);

-- Permission grants (least privilege by role)
INSERT INTO public.role_permissions (role_code, permission_code)
SELECT 'organization_admin', code FROM public.app_permissions;

INSERT INTO public.role_permissions (role_code, permission_code) VALUES
  ('district_sped_admin', 'org.audit.read'),
  ('district_sped_admin', 'school.manage'),
  ('district_sped_admin', 'program.manage'),
  ('district_sped_admin', 'classroom.manage'),
  ('district_sped_admin', 'staff.assign'),
  ('district_sped_admin', 'student.create'),
  ('district_sped_admin', 'student.edit'),
  ('district_sped_admin', 'student.archive'),
  ('district_sped_admin', 'student.read'),
  ('district_sped_admin', 'iep.manage'),
  ('district_sped_admin', 'goal.manage'),
  ('district_sped_admin', 'goal.read'),
  ('district_sped_admin', 'progress.enter'),
  ('district_sped_admin', 'progress.finalize'),
  ('district_sped_admin', 'progress.read'),
  ('district_sped_admin', 'analytics.read'),
  ('building_admin', 'school.manage'),
  ('building_admin', 'classroom.manage'),
  ('building_admin', 'staff.assign'),
  ('building_admin', 'student.create'),
  ('building_admin', 'student.edit'),
  ('building_admin', 'student.read'),
  ('building_admin', 'goal.read'),
  ('building_admin', 'progress.read'),
  ('building_admin', 'analytics.read'),
  ('program_admin', 'program.manage'),
  ('program_admin', 'classroom.manage'),
  ('program_admin', 'staff.assign'),
  ('program_admin', 'student.create'),
  ('program_admin', 'student.edit'),
  ('program_admin', 'student.read'),
  ('program_admin', 'iep.manage'),
  ('program_admin', 'goal.manage'),
  ('program_admin', 'goal.read'),
  ('program_admin', 'progress.enter'),
  ('program_admin', 'progress.finalize'),
  ('program_admin', 'progress.read'),
  ('program_admin', 'analytics.read'),
  ('intervention_specialist', 'student.read'),
  ('intervention_specialist', 'iep.manage'),
  ('intervention_specialist', 'goal.manage'),
  ('intervention_specialist', 'goal.read'),
  ('intervention_specialist', 'progress.enter'),
  ('intervention_specialist', 'progress.finalize'),
  ('intervention_specialist', 'progress.read'),
  ('intervention_specialist', 'analytics.read'),
  ('special_education_teacher', 'student.read'),
  ('special_education_teacher', 'goal.read'),
  ('special_education_teacher', 'progress.enter'),
  ('special_education_teacher', 'progress.read'),
  ('special_education_teacher', 'analytics.read'),
  ('related_service_provider', 'student.read'),
  ('related_service_provider', 'goal.read'),
  ('related_service_provider', 'progress.enter'),
  ('related_service_provider', 'progress.read'),
  ('related_service_provider', 'analytics.read'),
  ('school_psychologist', 'student.read'),
  ('school_psychologist', 'goal.read'),
  ('school_psychologist', 'progress.read'),
  ('school_psychologist', 'analytics.read'),
  ('case_manager', 'student.read'),
  ('case_manager', 'iep.manage'),
  ('case_manager', 'goal.manage'),
  ('case_manager', 'goal.read'),
  ('case_manager', 'progress.enter'),
  ('case_manager', 'progress.read'),
  ('case_manager', 'analytics.read'),
  ('paraprofessional', 'student.read'),
  ('paraprofessional', 'goal.read'),
  ('paraprofessional', 'progress.enter'),
  ('paraprofessional', 'progress.read'),
  ('read_only_reviewer', 'student.read'),
  ('read_only_reviewer', 'goal.read'),
  ('read_only_reviewer', 'progress.read'),
  ('read_only_reviewer', 'analytics.read');

CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  preferred_name text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER user_profiles_set_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Memberships are created in the next migration; keep self-only policies here.
CREATE POLICY user_profiles_select_self
ON public.user_profiles
FOR SELECT
USING (id = auth.uid());

CREATE POLICY user_profiles_update_self
ON public.user_profiles
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY user_profiles_insert_self
ON public.user_profiles
FOR INSERT
WITH CHECK (id = auth.uid());
