-- 202607300014_communication_esign.sql
-- Family communication electronic acknowledgment / e-sign (receipt only, not IDEA consent).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.communication_logs
  ADD COLUMN IF NOT EXISTS acknowledgement_requested boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS esign_status text NOT NULL DEFAULT 'none'
    CHECK (esign_status IN ('none', 'pending', 'signed', 'clarification_requested')),
  ADD COLUMN IF NOT EXISTS signed_content_hash text;

COMMENT ON COLUMN public.communication_logs.esign_status IS
  'Parent/guardian receipt e-sign status for family-visible communications.';
COMMENT ON COLUMN public.communication_logs.signed_content_hash IS
  'SHA-256 hex of subject + summary captured at acknowledgment time.';

-- Backfill: family-visible rows stay none until staff requests e-sign.
UPDATE public.communication_logs
SET acknowledgement_requested = false,
    esign_status = COALESCE(esign_status, 'none')
WHERE true;

CREATE TABLE IF NOT EXISTS public.communication_acknowledgements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  communication_log_id uuid NOT NULL REFERENCES public.communication_logs(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  signer_display_name text NOT NULL,
  signer_email text,
  method text NOT NULL DEFAULT 'typed'
    CHECK (method IN ('typed', 'drawn', 'staff_attested')),
  status text NOT NULL DEFAULT 'acknowledged'
    CHECK (status IN ('acknowledged', 'reviewed', 'requested_clarification')),
  typed_signature text,
  signature_image_data text,
  content_hash text NOT NULL,
  user_agent text,
  notes text,
  signed_at timestamptz NOT NULL DEFAULT now(),
  recorded_by uuid REFERENCES public.user_profiles(id),
  sign_link_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS communication_acknowledgements_org_log_idx
  ON public.communication_acknowledgements(organization_id, communication_log_id, signed_at DESC);

CREATE TRIGGER communication_acknowledgements_set_updated_at
BEFORE UPDATE ON public.communication_acknowledgements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.communication_sign_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  communication_log_id uuid NOT NULL REFERENCES public.communication_logs(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  first_opened_at timestamptz,
  last_opened_at timestamptz,
  created_by uuid REFERENCES public.user_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS communication_sign_links_org_log_idx
  ON public.communication_sign_links(organization_id, communication_log_id, created_at DESC);

CREATE TRIGGER communication_sign_links_set_updated_at
BEFORE UPDATE ON public.communication_sign_links
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.communication_acknowledgements
  DROP CONSTRAINT IF EXISTS communication_acknowledgements_sign_link_id_fkey;
ALTER TABLE public.communication_acknowledgements
  ADD CONSTRAINT communication_acknowledgements_sign_link_id_fkey
  FOREIGN KEY (sign_link_id) REFERENCES public.communication_sign_links(id) ON DELETE SET NULL;

ALTER TABLE public.communication_acknowledgements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_acknowledgements FORCE ROW LEVEL SECURITY;
ALTER TABLE public.communication_sign_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_sign_links FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS communication_acknowledgements_select ON public.communication_acknowledgements;
CREATE POLICY communication_acknowledgements_select
ON public.communication_acknowledgements FOR SELECT
USING (
  public.has_org_permission(organization_id, 'communication.read')
  OR public.has_org_permission(organization_id, 'communication.enter')
  OR public.has_org_permission(organization_id, 'communication.finalize')
);

DROP POLICY IF EXISTS communication_acknowledgements_insert ON public.communication_acknowledgements;
CREATE POLICY communication_acknowledgements_insert
ON public.communication_acknowledgements FOR INSERT
WITH CHECK (
  public.has_org_permission(organization_id, 'communication.enter')
  OR public.has_org_permission(organization_id, 'communication.finalize')
);

DROP POLICY IF EXISTS communication_sign_links_select ON public.communication_sign_links;
CREATE POLICY communication_sign_links_select
ON public.communication_sign_links FOR SELECT
USING (
  public.has_org_permission(organization_id, 'communication.read')
  OR public.has_org_permission(organization_id, 'communication.enter')
  OR public.has_org_permission(organization_id, 'communication.finalize')
);

DROP POLICY IF EXISTS communication_sign_links_insert ON public.communication_sign_links;
CREATE POLICY communication_sign_links_insert
ON public.communication_sign_links FOR INSERT
WITH CHECK (
  public.has_org_permission(organization_id, 'communication.enter')
  OR public.has_org_permission(organization_id, 'communication.finalize')
);

DROP POLICY IF EXISTS communication_sign_links_update ON public.communication_sign_links;
CREATE POLICY communication_sign_links_update
ON public.communication_sign_links FOR UPDATE
USING (
  public.has_org_permission(organization_id, 'communication.enter')
  OR public.has_org_permission(organization_id, 'communication.finalize')
)
WITH CHECK (
  public.has_org_permission(organization_id, 'communication.enter')
  OR public.has_org_permission(organization_id, 'communication.finalize')
);

-- Public token lookup (no auth). Returns only family-visible communication content.
CREATE OR REPLACE FUNCTION public.get_communication_sign_packet(p_token text)
RETURNS TABLE (
  link_id uuid,
  communication_log_id uuid,
  organization_name text,
  subject text,
  summary text,
  method text,
  occurred_at timestamptz,
  esign_status text,
  expires_at timestamptz,
  already_signed boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_hash text := encode(digest(convert_to(p_token, 'utf8'), 'sha256'), 'hex');
BEGIN
  RETURN QUERY
  SELECT
    link.id,
    log.id,
    org.name,
    log.subject,
    log.summary,
    log.method,
    log.occurred_at,
    log.esign_status,
    link.expires_at,
    EXISTS (
      SELECT 1
      FROM public.communication_acknowledgements ack
      WHERE ack.communication_log_id = log.id
        AND ack.status IN ('acknowledged', 'reviewed')
    ) AS already_signed
  FROM public.communication_sign_links link
  JOIN public.communication_logs log ON log.id = link.communication_log_id
  JOIN public.organizations org ON org.id = link.organization_id
  WHERE link.token_hash = v_hash
    AND link.revoked_at IS NULL
    AND link.expires_at > now()
    AND log.visibility = 'family_visible';

  UPDATE public.communication_sign_links
  SET
    first_opened_at = COALESCE(first_opened_at, now()),
    last_opened_at = now()
  WHERE token_hash = v_hash
    AND revoked_at IS NULL
    AND expires_at > now();
END;
$$;

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
  v_method text := COALESCE(NULLIF(trim(p_method), ''), 'drawn');
BEGIN
  IF coalesce(trim(p_signer_display_name), '') = '' THEN
    RAISE EXCEPTION 'Signer name is required';
  END IF;
  IF coalesce(trim(p_typed_signature), '') = '' THEN
    RAISE EXCEPTION 'Typed signature is required';
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

  RETURN v_ack_id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_communication_sign_packet(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_communication_sign_packet(text, text, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_communication_sign_packet(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_communication_sign_packet(text, text, text, text, text, text, text, text) TO anon, authenticated;
