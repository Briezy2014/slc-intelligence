-- FICTIONAL administrative privacy settings only.
INSERT INTO public.organization_privacy_settings (organization_id, small_group_threshold)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 5),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 5)
ON CONFLICT (organization_id) DO UPDATE
SET small_group_threshold = EXCLUDED.small_group_threshold;
