-- 202607290006_family_communication_and_meetings.sql
-- Phase 14 database layer: family communication, contacts, meetings, and readiness links.

INSERT INTO public.app_permissions (code, label, description) VALUES
  ('contact.manage', 'Manage contacts', 'Create and edit student contact records'),
  ('contact.read', 'Read contacts', 'View authorized student contact records'),
  ('communication.enter', 'Enter communications', 'Create and edit draft communication records'),
  ('communication.finalize', 'Finalize communications', 'Finalize and correct communication records'),
  ('communication.read', 'Read communications', 'View authorized communication records'),
  ('communication.template.manage', 'Manage communication templates', 'Create and manage communication templates and categories'),
  ('communication.internal.read', 'Read internal communications', 'View internal and restricted communication notes'),
  ('meeting.manage', 'Manage meetings', 'Create and edit student meetings'),
  ('meeting.finalize', 'Finalize meetings', 'Finalize and correct meeting records'),
  ('meeting.read', 'Read meetings', 'View authorized meeting records'),
  ('meeting.type.manage', 'Manage meeting types', 'Create and manage organization meeting types')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code)
SELECT 'organization_admin', code
FROM public.app_permissions
WHERE code IN (
  'contact.manage',
  'contact.read',
  'communication.enter',
  'communication.finalize',
  'communication.read',
  'communication.template.manage',
  'communication.internal.read',
  'meeting.manage',
  'meeting.finalize',
  'meeting.read',
  'meeting.type.manage'
)
ON CONFLICT DO NOTHING;

INSERT INTO public.role_permissions (role_code, permission_code) VALUES
  ('district_sped_admin', 'contact.manage'),
  ('district_sped_admin', 'contact.read'),
  ('district_sped_admin', 'communication.enter'),
  ('district_sped_admin', 'communication.finalize'),
  ('district_sped_admin', 'communication.read'),
  ('district_sped_admin', 'communication.template.manage'),
  ('district_sped_admin', 'communication.internal.read'),
  ('district_sped_admin', 'meeting.manage'),
  ('district_sped_admin', 'meeting.finalize'),
  ('district_sped_admin', 'meeting.read'),
  ('district_sped_admin', 'meeting.type.manage'),
  ('building_admin', 'contact.manage'),
  ('building_admin', 'contact.read'),
  ('building_admin', 'communication.enter'),
  ('building_admin', 'communication.finalize'),
  ('building_admin', 'communication.read'),
  ('building_admin', 'communication.internal.read'),
  ('building_admin', 'meeting.manage'),
  ('building_admin', 'meeting.finalize'),
  ('building_admin', 'meeting.read'),
  ('program_admin', 'contact.manage'),
  ('program_admin', 'contact.read'),
  ('program_admin', 'communication.enter'),
  ('program_admin', 'communication.finalize'),
  ('program_admin', 'communication.read'),
  ('program_admin', 'communication.template.manage'),
  ('program_admin', 'communication.internal.read'),
  ('program_admin', 'meeting.manage'),
  ('program_admin', 'meeting.finalize'),
  ('program_admin', 'meeting.read'),
  ('program_admin', 'meeting.type.manage'),
  ('intervention_specialist', 'contact.manage'),
  ('intervention_specialist', 'contact.read'),
  ('intervention_specialist', 'communication.enter'),
  ('intervention_specialist', 'communication.finalize'),
  ('intervention_specialist', 'communication.read'),
  ('intervention_specialist', 'communication.template.manage'),
  ('intervention_specialist', 'communication.internal.read'),
  ('intervention_specialist', 'meeting.manage'),
  ('intervention_specialist', 'meeting.finalize'),
  ('intervention_specialist', 'meeting.read'),
  ('case_manager', 'contact.manage'),
  ('case_manager', 'contact.read'),
  ('case_manager', 'communication.enter'),
  ('case_manager', 'communication.finalize'),
  ('case_manager', 'communication.read'),
  ('case_manager', 'communication.template.manage'),
  ('case_manager', 'communication.internal.read'),
  ('case_manager', 'meeting.manage'),
  ('case_manager', 'meeting.finalize'),
  ('case_manager', 'meeting.read'),
  ('special_education_teacher', 'contact.read'),
  ('special_education_teacher', 'communication.enter'),
  ('special_education_teacher', 'communication.read'),
  ('special_education_teacher', 'meeting.read'),
  ('related_service_provider', 'contact.read'),
  ('related_service_provider', 'communication.enter'),
  ('related_service_provider', 'communication.read'),
  ('related_service_provider', 'meeting.read'),
  ('school_psychologist', 'contact.read'),
  ('school_psychologist', 'communication.enter'),
  ('school_psychologist', 'communication.finalize'),
  ('school_psychologist', 'communication.read'),
  ('school_psychologist', 'communication.internal.read'),
  ('school_psychologist', 'meeting.manage'),
  ('school_psychologist', 'meeting.finalize'),
  ('school_psychologist', 'meeting.read'),
  ('paraprofessional', 'communication.enter'),
  ('paraprofessional', 'communication.read'),
  ('read_only_reviewer', 'contact.read'),
  ('read_only_reviewer', 'communication.read'),
  ('read_only_reviewer', 'meeting.read')
ON CONFLICT DO NOTHING;

CREATE TABLE public.student_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  relationship text NOT NULL,
  contact_type text NOT NULL DEFAULT 'family' CHECK (contact_type IN ('family', 'guardian', 'caregiver', 'agency', 'other')),
  email text,
  phone_primary text,
  phone_secondary text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  sensitive_notes text,
  is_primary boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES public.student_contacts(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  preferred_method text CHECK (preferred_method IS NULL OR preferred_method IN ('phone', 'email', 'text', 'letter', 'in_person', 'portal', 'other')),
  preferred_language text,
  interpreter_needed boolean NOT NULL DEFAULT false,
  best_times text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.communication_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

CREATE TABLE public.communication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES public.student_contacts(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.communication_categories(id) ON DELETE SET NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  method text NOT NULL CHECK (method IN ('phone', 'email', 'text', 'letter', 'in_person', 'portal', 'video', 'other')),
  direction text NOT NULL CHECK (direction IN ('outbound', 'inbound', 'two_way', 'internal')),
  visibility text NOT NULL DEFAULT 'family_visible' CHECK (visibility IN ('family_visible', 'internal', 'restricted_admin')),
  subject text NOT NULL,
  summary text NOT NULL,
  followup_needed boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'corrected', 'archived')),
  finalized_at timestamptz,
  finalized_by uuid REFERENCES public.user_profiles(id),
  corrected_from_log_id uuid REFERENCES public.communication_logs(id) ON DELETE SET NULL,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.communication_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  communication_log_id uuid NOT NULL REFERENCES public.communication_logs(id) ON DELETE CASCADE,
  participant_kind text NOT NULL CHECK (participant_kind IN ('staff', 'contact', 'external', 'student')),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES public.student_contacts(id) ON DELETE SET NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
  external_name text,
  external_role text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (participant_kind = 'staff' AND user_id IS NOT NULL)
    OR (participant_kind = 'contact' AND contact_id IS NOT NULL)
    OR (participant_kind = 'student' AND student_id IS NOT NULL)
    OR (participant_kind = 'external' AND external_name IS NOT NULL)
  )
);

CREATE TABLE public.communication_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  communication_log_id uuid NOT NULL REFERENCES public.communication_logs(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES public.user_profiles(id),
  due_date date,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'completed', 'canceled', 'archived')),
  description text NOT NULL,
  completed_at timestamptz,
  completed_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.communication_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  default_visibility text NOT NULL DEFAULT 'family_visible' CHECK (default_visibility IN ('family_visible', 'internal', 'restricted_admin')),
  method text CHECK (method IS NULL OR method IN ('phone', 'email', 'text', 'letter', 'in_person', 'portal', 'video', 'other')),
  subject_template text,
  body_template text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

CREATE TABLE public.communication_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  communication_log_id uuid NOT NULL REFERENCES public.communication_logs(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  file_name text NOT NULL,
  content_type text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  uploaded_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.communication_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  communication_log_id uuid NOT NULL REFERENCES public.communication_logs(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  changed_by uuid REFERENCES public.user_profiles(id),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.meeting_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

CREATE TABLE public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  meeting_type_id uuid REFERENCES public.meeting_types(id) ON DELETE SET NULL,
  title text NOT NULL,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  location text,
  virtual_link_note text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'held', 'finalized', 'canceled', 'archived')),
  created_by uuid REFERENCES public.user_profiles(id),
  finalized_at timestamptz,
  finalized_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (scheduled_end IS NULL OR scheduled_start IS NULL OR scheduled_end >= scheduled_start)
);

CREATE TABLE public.meeting_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  participant_kind text NOT NULL CHECK (participant_kind IN ('staff', 'contact', 'external', 'student')),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES public.student_contacts(id) ON DELETE SET NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
  external_name text,
  external_role text,
  invitation_status text NOT NULL DEFAULT 'not_sent' CHECK (
    invitation_status IN ('not_sent', 'sent', 'accepted', 'declined', 'tentative', 'not_required')
  ),
  attendance_status text NOT NULL DEFAULT 'unknown' CHECK (
    attendance_status IN ('unknown', 'present', 'absent', 'excused', 'partial', 'not_required')
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (participant_kind = 'staff' AND user_id IS NOT NULL)
    OR (participant_kind = 'contact' AND contact_id IS NOT NULL)
    OR (participant_kind = 'student' AND student_id IS NOT NULL)
    OR (participant_kind = 'external' AND external_name IS NOT NULL)
  )
);

CREATE TABLE public.meeting_agenda_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.meeting_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  note_kind text NOT NULL CHECK (
    note_kind IN (
      'discussion',
      'data_reviewed',
      'family_input',
      'student_input',
      'staff_input',
      'decision',
      'follow_up',
      'unresolved',
      'internal_prep'
    )
  ),
  note_text text NOT NULL,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.meeting_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  decision_text text NOT NULL,
  rationale text,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.meeting_action_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES public.user_profiles(id),
  description text NOT NULL,
  due_date date,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'completed', 'canceled', 'archived')),
  completed_at timestamptz,
  completed_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.meeting_acknowledgements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES public.student_contacts(id) ON DELETE SET NULL,
  acknowledged_by_name text,
  status text NOT NULL DEFAULT 'no_response' CHECK (
    status IN ('received', 'reviewed', 'acknowledged', 'declined', 'requested_clarification', 'no_response', 'other')
  ),
  note text,
  recorded_by uuid REFERENCES public.user_profiles(id),
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.meeting_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  document_type text,
  title text NOT NULL,
  storage_path text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  uploaded_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.meeting_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  changed_by uuid REFERENCES public.user_profiles(id),
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.meeting_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  version_number integer NOT NULL CHECK (version_number > 0),
  snapshot jsonb NOT NULL,
  reason text,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (meeting_id, version_number)
);

CREATE TABLE public.calendar_event_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  meeting_id uuid NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  external_provider text NOT NULL,
  external_event_id text NOT NULL,
  sync_status text NOT NULL DEFAULT 'linked' CHECK (sync_status IN ('linked', 'pending', 'failed', 'removed')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, external_provider, external_event_id)
);

COMMENT ON TABLE public.communication_logs IS
  'Communication records are metadata only; the platform does not send messages automatically.';
COMMENT ON TABLE public.meeting_acknowledgements IS
  'Acknowledgement statuses are descriptive receipt/review records and are not legal consent.';
COMMENT ON TABLE public.calendar_event_links IS
  'External calendar identifiers are stored for integration readiness only.';
COMMENT ON COLUMN public.communication_attachments.storage_path IS
  'Storage path metadata only; do not store credentials in attachment records.';
COMMENT ON COLUMN public.meeting_participants.external_name IS
  'External meeting participants do not create authentication users.';

CREATE INDEX student_contacts_org_idx ON public.student_contacts(organization_id);
CREATE INDEX student_contacts_student_idx ON public.student_contacts(student_id);
CREATE INDEX student_contacts_status_idx ON public.student_contacts(organization_id, status);
CREATE INDEX contact_preferences_contact_idx ON public.contact_preferences(contact_id);
CREATE INDEX contact_preferences_student_idx ON public.contact_preferences(student_id);
CREATE INDEX communication_categories_org_idx ON public.communication_categories(organization_id);
CREATE INDEX communication_logs_student_idx ON public.communication_logs(student_id);
CREATE INDEX communication_logs_contact_idx ON public.communication_logs(contact_id);
CREATE INDEX communication_logs_visibility_idx ON public.communication_logs(organization_id, visibility);
CREATE INDEX communication_logs_occurred_idx ON public.communication_logs(student_id, occurred_at);
CREATE INDEX communication_participants_log_idx ON public.communication_participants(communication_log_id);
CREATE INDEX communication_followups_log_idx ON public.communication_followups(communication_log_id);
CREATE INDEX communication_followups_student_idx ON public.communication_followups(student_id);
CREATE INDEX communication_templates_org_idx ON public.communication_templates(organization_id);
CREATE INDEX communication_attachments_log_idx ON public.communication_attachments(communication_log_id);
CREATE INDEX communication_status_history_log_idx ON public.communication_status_history(communication_log_id);
CREATE INDEX meeting_types_org_idx ON public.meeting_types(organization_id);
CREATE INDEX meetings_student_idx ON public.meetings(student_id);
CREATE INDEX meetings_type_idx ON public.meetings(meeting_type_id);
CREATE INDEX meetings_schedule_idx ON public.meetings(organization_id, scheduled_start);
CREATE INDEX meeting_participants_meeting_idx ON public.meeting_participants(meeting_id);
CREATE INDEX meeting_agenda_items_meeting_idx ON public.meeting_agenda_items(meeting_id);
CREATE INDEX meeting_notes_meeting_idx ON public.meeting_notes(meeting_id);
CREATE INDEX meeting_decisions_meeting_idx ON public.meeting_decisions(meeting_id);
CREATE INDEX meeting_action_items_meeting_idx ON public.meeting_action_items(meeting_id);
CREATE INDEX meeting_acknowledgements_meeting_idx ON public.meeting_acknowledgements(meeting_id);
CREATE INDEX meeting_documents_meeting_idx ON public.meeting_documents(meeting_id);
CREATE INDEX meeting_status_history_meeting_idx ON public.meeting_status_history(meeting_id);
CREATE INDEX meeting_versions_meeting_idx ON public.meeting_versions(meeting_id);
CREATE INDEX calendar_event_links_meeting_idx ON public.calendar_event_links(meeting_id);

CREATE TRIGGER student_contacts_set_updated_at BEFORE UPDATE ON public.student_contacts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER contact_preferences_set_updated_at BEFORE UPDATE ON public.contact_preferences
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER communication_categories_set_updated_at BEFORE UPDATE ON public.communication_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER communication_logs_set_updated_at BEFORE UPDATE ON public.communication_logs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER communication_participants_set_updated_at BEFORE UPDATE ON public.communication_participants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER communication_followups_set_updated_at BEFORE UPDATE ON public.communication_followups
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER communication_templates_set_updated_at BEFORE UPDATE ON public.communication_templates
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER communication_attachments_set_updated_at BEFORE UPDATE ON public.communication_attachments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER communication_status_history_set_updated_at BEFORE UPDATE ON public.communication_status_history
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER meeting_types_set_updated_at BEFORE UPDATE ON public.meeting_types
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER meetings_set_updated_at BEFORE UPDATE ON public.meetings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER meeting_participants_set_updated_at BEFORE UPDATE ON public.meeting_participants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER meeting_agenda_items_set_updated_at BEFORE UPDATE ON public.meeting_agenda_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER meeting_notes_set_updated_at BEFORE UPDATE ON public.meeting_notes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER meeting_decisions_set_updated_at BEFORE UPDATE ON public.meeting_decisions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER meeting_action_items_set_updated_at BEFORE UPDATE ON public.meeting_action_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER meeting_acknowledgements_set_updated_at BEFORE UPDATE ON public.meeting_acknowledgements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER meeting_documents_set_updated_at BEFORE UPDATE ON public.meeting_documents
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER meeting_status_history_set_updated_at BEFORE UPDATE ON public.meeting_status_history
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER meeting_versions_set_updated_at BEFORE UPDATE ON public.meeting_versions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER calendar_event_links_set_updated_at BEFORE UPDATE ON public.calendar_event_links
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.can_read_contact(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'contact.read')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_contact(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'contact.manage')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

CREATE OR REPLACE FUNCTION public.can_read_communication(p_org_id uuid, p_student_id uuid, p_visibility text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'communication.read')
    AND public.can_read_student(p_org_id, p_student_id)
    AND (
      p_visibility = 'family_visible'
      OR (
        p_visibility = 'internal'
        AND public.has_org_permission(p_org_id, 'communication.internal.read')
      )
      OR (
        p_visibility = 'restricted_admin'
        AND public.has_org_permission(p_org_id, 'communication.internal.read')
        AND public.member_role(p_org_id) IN ('organization_admin', 'district_sped_admin', 'building_admin', 'program_admin')
      )
    );
$$;

CREATE OR REPLACE FUNCTION public.can_enter_communication(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'communication.enter')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_finalize_communication(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'communication.finalize')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

CREATE OR REPLACE FUNCTION public.can_read_meeting(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'meeting.read')
    AND public.can_read_student(p_org_id, p_student_id);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_meeting(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'meeting.manage')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

CREATE OR REPLACE FUNCTION public.can_finalize_meeting(p_org_id uuid, p_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_org_permission(p_org_id, 'meeting.finalize')
    AND public.can_read_student(p_org_id, p_student_id)
    AND public.member_role(p_org_id) NOT IN ('paraprofessional', 'read_only_reviewer');
$$;

CREATE OR REPLACE FUNCTION public.can_read_meeting_note(p_org_id uuid, p_student_id uuid, p_note_kind text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.can_read_meeting(p_org_id, p_student_id)
    AND (
      p_note_kind <> 'internal_prep'
      OR public.has_org_permission(p_org_id, 'communication.internal.read')
    );
$$;

ALTER TABLE public.student_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_contacts FORCE ROW LEVEL SECURITY;
ALTER TABLE public.contact_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_preferences FORCE ROW LEVEL SECURITY;
ALTER TABLE public.communication_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_categories FORCE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.communication_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_participants FORCE ROW LEVEL SECURITY;
ALTER TABLE public.communication_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_followups FORCE ROW LEVEL SECURITY;
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_templates FORCE ROW LEVEL SECURITY;
ALTER TABLE public.communication_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_attachments FORCE ROW LEVEL SECURITY;
ALTER TABLE public.communication_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_status_history FORCE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_types FORCE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings FORCE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants FORCE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_agenda_items FORCE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_notes FORCE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_decisions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_action_items FORCE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_acknowledgements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_acknowledgements FORCE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_documents FORCE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_status_history FORCE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_versions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_event_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_event_links FORCE ROW LEVEL SECURITY;

CREATE POLICY student_contacts_select ON public.student_contacts FOR SELECT
USING (public.can_read_contact(organization_id, student_id));

CREATE POLICY student_contacts_mutate ON public.student_contacts FOR ALL
USING (public.can_manage_contact(organization_id, student_id))
WITH CHECK (public.can_manage_contact(organization_id, student_id));

CREATE POLICY contact_preferences_select ON public.contact_preferences FOR SELECT
USING (public.can_read_contact(organization_id, student_id));

CREATE POLICY contact_preferences_mutate ON public.contact_preferences FOR ALL
USING (public.can_manage_contact(organization_id, student_id))
WITH CHECK (
  public.can_manage_contact(organization_id, student_id)
  AND EXISTS (
    SELECT 1 FROM public.student_contacts c
    WHERE c.id = contact_id
      AND c.organization_id = organization_id
      AND c.student_id = student_id
  )
);

CREATE POLICY communication_categories_select ON public.communication_categories FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND (
    public.has_org_permission(organization_id, 'communication.read')
    OR public.has_org_permission(organization_id, 'communication.template.manage')
  )
);

CREATE POLICY communication_categories_mutate ON public.communication_categories FOR ALL
USING (
  public.has_org_permission(organization_id, 'communication.template.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'communication.template.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY communication_logs_select ON public.communication_logs FOR SELECT
USING (public.can_read_communication(organization_id, student_id, visibility));

CREATE POLICY communication_logs_insert ON public.communication_logs FOR INSERT
WITH CHECK (
  (
    (status = 'draft' AND public.can_enter_communication(organization_id, student_id))
    OR (status IN ('finalized', 'corrected') AND public.can_finalize_communication(organization_id, student_id))
  )
  AND (
    visibility = 'family_visible'
    OR public.has_org_permission(organization_id, 'communication.internal.read')
  )
);

CREATE POLICY communication_logs_update ON public.communication_logs FOR UPDATE
USING (
  (status = 'draft' AND public.can_enter_communication(organization_id, student_id))
  OR public.can_finalize_communication(organization_id, student_id)
)
WITH CHECK (
  (
    (status = 'draft' AND public.can_enter_communication(organization_id, student_id))
    OR (status IN ('finalized', 'corrected', 'archived') AND public.can_finalize_communication(organization_id, student_id))
  )
  AND (
    visibility = 'family_visible'
    OR public.has_org_permission(organization_id, 'communication.internal.read')
  )
);

CREATE POLICY communication_participants_select ON public.communication_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.communication_logs l
    WHERE l.id = communication_log_id
      AND public.can_read_communication(l.organization_id, l.student_id, l.visibility)
  )
);

CREATE POLICY communication_participants_mutate ON public.communication_participants FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.communication_logs l
    WHERE l.id = communication_log_id
      AND (
        (l.status = 'draft' AND public.can_enter_communication(l.organization_id, l.student_id))
        OR public.can_finalize_communication(l.organization_id, l.student_id)
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.communication_logs l
    WHERE l.id = communication_log_id
      AND l.organization_id = organization_id
      AND (
        (l.status = 'draft' AND public.can_enter_communication(l.organization_id, l.student_id))
        OR public.can_finalize_communication(l.organization_id, l.student_id)
      )
  )
  AND (
    participant_kind <> 'student'
    OR (student_id IS NOT NULL AND public.can_read_student(organization_id, student_id))
  )
);

CREATE POLICY communication_followups_select ON public.communication_followups FOR SELECT
USING (public.has_org_permission(organization_id, 'communication.read') AND public.can_read_student(organization_id, student_id));

CREATE POLICY communication_followups_mutate ON public.communication_followups FOR ALL
USING (public.can_enter_communication(organization_id, student_id) OR public.can_finalize_communication(organization_id, student_id))
WITH CHECK (public.can_enter_communication(organization_id, student_id) OR public.can_finalize_communication(organization_id, student_id));

CREATE POLICY communication_templates_select ON public.communication_templates FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND (
    public.has_org_permission(organization_id, 'communication.read')
    OR public.has_org_permission(organization_id, 'communication.template.manage')
  )
  AND (
    default_visibility = 'family_visible'
    OR public.has_org_permission(organization_id, 'communication.internal.read')
  )
);

CREATE POLICY communication_templates_mutate ON public.communication_templates FOR ALL
USING (
  public.has_org_permission(organization_id, 'communication.template.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'communication.template.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY communication_attachments_select ON public.communication_attachments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.communication_logs l
    WHERE l.id = communication_log_id
      AND public.can_read_communication(l.organization_id, l.student_id, l.visibility)
  )
);

CREATE POLICY communication_attachments_mutate ON public.communication_attachments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.communication_logs l
    WHERE l.id = communication_log_id
      AND (
        (l.status = 'draft' AND public.can_enter_communication(l.organization_id, l.student_id))
        OR public.can_finalize_communication(l.organization_id, l.student_id)
      )
  )
)
WITH CHECK (
  public.can_read_student(organization_id, student_id)
  AND EXISTS (
    SELECT 1 FROM public.communication_logs l
    WHERE l.id = communication_log_id
      AND l.organization_id = organization_id
      AND l.student_id = student_id
      AND (
        (l.status = 'draft' AND public.can_enter_communication(l.organization_id, l.student_id))
        OR public.can_finalize_communication(l.organization_id, l.student_id)
      )
  )
);

CREATE POLICY communication_status_history_select ON public.communication_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.communication_logs l
    WHERE l.id = communication_log_id
      AND public.can_read_communication(l.organization_id, l.student_id, l.visibility)
  )
);

CREATE POLICY communication_status_history_insert ON public.communication_status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.communication_logs l
    WHERE l.id = communication_log_id
      AND l.organization_id = organization_id
      AND (
        public.can_enter_communication(l.organization_id, l.student_id)
        OR public.can_finalize_communication(l.organization_id, l.student_id)
      )
  )
);

CREATE POLICY meeting_types_select ON public.meeting_types FOR SELECT
USING (
  public.is_org_member(organization_id)
  AND (
    public.has_org_permission(organization_id, 'meeting.read')
    OR public.has_org_permission(organization_id, 'meeting.type.manage')
  )
);

CREATE POLICY meeting_types_mutate ON public.meeting_types FOR ALL
USING (
  public.has_org_permission(organization_id, 'meeting.type.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'meeting.type.manage')
  AND public.member_role(organization_id) NOT IN ('paraprofessional', 'read_only_reviewer')
);

CREATE POLICY meetings_select ON public.meetings FOR SELECT
USING (public.can_read_meeting(organization_id, student_id));

CREATE POLICY meetings_insert ON public.meetings FOR INSERT
WITH CHECK (status IN ('draft', 'scheduled') AND public.can_manage_meeting(organization_id, student_id));

CREATE POLICY meetings_update ON public.meetings FOR UPDATE
USING (public.can_manage_meeting(organization_id, student_id) OR public.can_finalize_meeting(organization_id, student_id))
WITH CHECK (
  (
    status IN ('draft', 'scheduled', 'held', 'canceled')
    AND public.can_manage_meeting(organization_id, student_id)
  )
  OR (
    status IN ('finalized', 'archived')
    AND public.can_finalize_meeting(organization_id, student_id)
  )
);

CREATE POLICY meeting_child_select ON public.meeting_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_read_meeting(m.organization_id, m.student_id)
  )
);

CREATE POLICY meeting_participants_mutate ON public.meeting_participants FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_manage_meeting(m.organization_id, m.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id
      AND m.organization_id = organization_id
      AND public.can_manage_meeting(m.organization_id, m.student_id)
  )
  AND (
    participant_kind <> 'student'
    OR (student_id IS NOT NULL AND public.can_read_student(organization_id, student_id))
  )
);

CREATE POLICY meeting_agenda_select ON public.meeting_agenda_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_read_meeting(m.organization_id, m.student_id)
  )
);

CREATE POLICY meeting_agenda_mutate ON public.meeting_agenda_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_manage_meeting(m.organization_id, m.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND m.organization_id = organization_id AND public.can_manage_meeting(m.organization_id, m.student_id)
  )
);

CREATE POLICY meeting_notes_select ON public.meeting_notes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_read_meeting_note(m.organization_id, m.student_id, note_kind)
  )
);

CREATE POLICY meeting_notes_mutate ON public.meeting_notes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_manage_meeting(m.organization_id, m.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id
      AND m.organization_id = organization_id
      AND public.can_manage_meeting(m.organization_id, m.student_id)
      AND (note_kind <> 'internal_prep' OR public.has_org_permission(m.organization_id, 'communication.internal.read'))
  )
);

CREATE POLICY meeting_decisions_select ON public.meeting_decisions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_read_meeting(m.organization_id, m.student_id)
  )
);

CREATE POLICY meeting_decisions_mutate ON public.meeting_decisions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_finalize_meeting(m.organization_id, m.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND m.organization_id = organization_id AND public.can_finalize_meeting(m.organization_id, m.student_id)
  )
);

CREATE POLICY meeting_action_items_select ON public.meeting_action_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_read_meeting(m.organization_id, m.student_id)
  )
);

CREATE POLICY meeting_action_items_mutate ON public.meeting_action_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_manage_meeting(m.organization_id, m.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND m.organization_id = organization_id AND public.can_manage_meeting(m.organization_id, m.student_id)
  )
);

CREATE POLICY meeting_acknowledgements_select ON public.meeting_acknowledgements FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_read_meeting(m.organization_id, m.student_id)
  )
);

CREATE POLICY meeting_acknowledgements_mutate ON public.meeting_acknowledgements FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND (public.can_manage_meeting(m.organization_id, m.student_id) OR public.can_finalize_meeting(m.organization_id, m.student_id))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id
      AND m.organization_id = organization_id
      AND (public.can_manage_meeting(m.organization_id, m.student_id) OR public.can_finalize_meeting(m.organization_id, m.student_id))
  )
);

CREATE POLICY meeting_documents_select ON public.meeting_documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_read_meeting(m.organization_id, m.student_id)
  )
);

CREATE POLICY meeting_documents_mutate ON public.meeting_documents FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_manage_meeting(m.organization_id, m.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND m.organization_id = organization_id AND public.can_manage_meeting(m.organization_id, m.student_id)
  )
);

CREATE POLICY meeting_status_history_select ON public.meeting_status_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_read_meeting(m.organization_id, m.student_id)
  )
);

CREATE POLICY meeting_status_history_insert ON public.meeting_status_history FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id
      AND m.organization_id = organization_id
      AND (public.can_manage_meeting(m.organization_id, m.student_id) OR public.can_finalize_meeting(m.organization_id, m.student_id))
  )
);

CREATE POLICY meeting_versions_select ON public.meeting_versions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_read_meeting(m.organization_id, m.student_id)
  )
);

CREATE POLICY meeting_versions_insert ON public.meeting_versions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id
      AND m.organization_id = organization_id
      AND (public.can_manage_meeting(m.organization_id, m.student_id) OR public.can_finalize_meeting(m.organization_id, m.student_id))
  )
);

CREATE POLICY calendar_event_links_select ON public.calendar_event_links FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_read_meeting(m.organization_id, m.student_id)
  )
);

CREATE POLICY calendar_event_links_mutate ON public.calendar_event_links FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND public.can_manage_meeting(m.organization_id, m.student_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.meetings m
    WHERE m.id = meeting_id AND m.organization_id = organization_id AND public.can_manage_meeting(m.organization_id, m.student_id)
  )
);
