-- 202607300015_staff_notifications_parent_read.sql
-- In-app staff notifications when a parent reads/acknowledges a family communication.

CREATE TABLE IF NOT EXISTS public.staff_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  recipient_user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'communication_parent_read'
    CHECK (kind IN (
      'communication_parent_read',
      'communication_parent_signed',
      'general'
    )),
  title text NOT NULL,
  body text NOT NULL,
  communication_log_id uuid REFERENCES public.communication_logs(id) ON DELETE CASCADE,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  acknowledgement_id uuid REFERENCES public.communication_acknowledgements(id) ON DELETE SET NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS staff_notifications_org_created_idx
  ON public.staff_notifications(organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS staff_notifications_recipient_unread_idx
  ON public.staff_notifications(organization_id, recipient_user_id, read_at, created_at DESC);

CREATE TRIGGER staff_notifications_set_updated_at
BEFORE UPDATE ON public.staff_notifications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.staff_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_notifications FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS staff_notifications_select ON public.staff_notifications;
CREATE POLICY staff_notifications_select
ON public.staff_notifications FOR SELECT
USING (
  public.has_org_permission(organization_id, 'communication.read')
  OR public.has_org_permission(organization_id, 'communication.enter')
  OR public.has_org_permission(organization_id, 'communication.finalize')
);

DROP POLICY IF EXISTS staff_notifications_update ON public.staff_notifications;
CREATE POLICY staff_notifications_update
ON public.staff_notifications FOR UPDATE
USING (
  public.has_org_permission(organization_id, 'communication.read')
  OR public.has_org_permission(organization_id, 'communication.enter')
  OR public.has_org_permission(organization_id, 'communication.finalize')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'communication.read')
  OR public.has_org_permission(organization_id, 'communication.enter')
  OR public.has_org_permission(organization_id, 'communication.finalize')
);

-- Helper: create org-wide staff notifications for parent read/sign events.
CREATE OR REPLACE FUNCTION public.notify_staff_parent_communication_ack(
  p_organization_id uuid,
  p_communication_log_id uuid,
  p_student_id uuid,
  p_acknowledgement_id uuid,
  p_signer_display_name text,
  p_method text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_subject text;
  v_title text;
  v_body text;
  v_kind text;
BEGIN
  SELECT subject INTO v_subject
  FROM public.communication_logs
  WHERE id = p_communication_log_id;

  v_kind := CASE
    WHEN COALESCE(p_method, 'typed') = 'drawn' THEN 'communication_parent_signed'
    ELSE 'communication_parent_read'
  END;

  v_title := CASE
    WHEN v_kind = 'communication_parent_signed' THEN 'Parent signed a school communication'
    ELSE 'Parent marked a school communication as read'
  END;

  v_body := format(
    '%s acknowledged receipt of “%s” (%s).',
    COALESCE(NULLIF(trim(p_signer_display_name), ''), 'A parent/guardian'),
    COALESCE(v_subject, 'school communication'),
    COALESCE(p_method, 'typed')
  );

  -- Org-wide notification (recipient_user_id null) visible to staff with communication read/enter.
  INSERT INTO public.staff_notifications (
    organization_id,
    recipient_user_id,
    kind,
    title,
    body,
    communication_log_id,
    student_id,
    acknowledgement_id
  ) VALUES (
    p_organization_id,
    NULL,
    v_kind,
    v_title,
    left(v_body, 2000),
    p_communication_log_id,
    p_student_id,
    p_acknowledgement_id
  );
END;
$$;

-- Update public sign packet to create a staff notification.
CREATE OR REPLACE FUNCTION public.submit_communication_sign_packet(
  p_token text,
  p_signer_display_name text,
  p_typed_signature text,
  p_signature_image_data text DEFAULT NULL,
  p_signer_email text DEFAULT NULL,
  p_method text DEFAULT 'drawn',
  p_user_agent text DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_hash text := encode(digest(convert_to(p_token, 'utf8'), 'sha256'), 'hex');
  v_link public.communication_sign_links%ROWTYPE;
  v_log public.communication_logs%ROWTYPE;
  v_content_hash text;
  v_ack_id uuid;
  v_method text := COALESCE(NULLIF(trim(p_method), ''), 'typed');
BEGIN
  IF coalesce(trim(p_signer_display_name), '') = '' THEN
    RAISE EXCEPTION 'Signer name is required';
  END IF;
  IF coalesce(trim(p_typed_signature), '') = '' THEN
    -- Allow single-name "read and send" flow: typed signature defaults to display name.
    p_typed_signature := p_signer_display_name;
  END IF;
  IF v_method NOT IN ('typed', 'drawn', 'staff_attested') THEN
    RAISE EXCEPTION 'Invalid signature method';
  END IF;

  SELECT * INTO v_link
  FROM public.communication_sign_links
  WHERE token_hash = v_hash
    AND revoked_at IS NULL
    AND expires_at > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sign link is invalid or expired';
  END IF;

  SELECT * INTO v_log
  FROM public.communication_logs
  WHERE id = v_link.communication_log_id
    AND visibility = 'family_visible';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Communication is not available for signing';
  END IF;

  v_content_hash := encode(
    digest(convert_to(v_log.subject || E'\n' || v_log.summary, 'utf8'), 'sha256'),
    'hex'
  );

  INSERT INTO public.communication_acknowledgements (
    organization_id,
    communication_log_id,
    student_id,
    signer_display_name,
    signer_email,
    method,
    status,
    typed_signature,
    signature_image_data,
    content_hash,
    user_agent,
    notes,
    sign_link_id,
    signed_at
  ) VALUES (
    v_link.organization_id,
    v_link.communication_log_id,
    v_link.student_id,
    left(trim(p_signer_display_name), 180),
    NULLIF(left(trim(COALESCE(p_signer_email, '')), 180), ''),
    v_method,
    'acknowledged',
    left(trim(p_typed_signature), 180),
    NULLIF(p_signature_image_data, ''),
    v_content_hash,
    NULLIF(left(trim(COALESCE(p_user_agent, '')), 400), ''),
    NULLIF(left(trim(COALESCE(p_notes, '')), 2000), ''),
    v_link.id,
    now()
  )
  RETURNING id INTO v_ack_id;

  UPDATE public.communication_logs
  SET
    acknowledgement_requested = true,
    esign_status = 'signed',
    signed_content_hash = v_content_hash,
    updated_at = now()
  WHERE id = v_log.id;

  PERFORM public.notify_staff_parent_communication_ack(
    v_link.organization_id,
    v_link.communication_log_id,
    v_link.student_id,
    v_ack_id,
    p_signer_display_name,
    v_method
  );

  RETURN v_ack_id;
END;
$$;

REVOKE ALL ON FUNCTION public.notify_staff_parent_communication_ack(uuid, uuid, uuid, uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.notify_staff_parent_communication_ack(uuid, uuid, uuid, uuid, text, text) TO authenticated;

REVOKE ALL ON FUNCTION public.submit_communication_sign_packet(text, text, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_communication_sign_packet(text, text, text, text, text, text, text, text) TO anon, authenticated;
