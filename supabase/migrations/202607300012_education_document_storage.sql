-- Optional storage bucket for education document uploads.
-- Run in Supabase SQL Editor if you want binary file retention in Storage.
-- OCR/field population works even without this bucket (browser extracts text first).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'education-documents',
  'education-documents',
  false,
  26214400,
  ARRAY[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Authenticated users can upload/read only within their org folder prefix: {organization_id}/...
DROP POLICY IF EXISTS education_documents_storage_select ON storage.objects;
CREATE POLICY education_documents_storage_select
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'education-documents'
  AND public.has_org_permission((storage.foldername(name))[1]::uuid, 'education_document.read')
);

DROP POLICY IF EXISTS education_documents_storage_insert ON storage.objects;
CREATE POLICY education_documents_storage_insert
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'education-documents'
  AND public.has_org_permission((storage.foldername(name))[1]::uuid, 'education_document.manage')
);

DROP POLICY IF EXISTS education_documents_storage_update ON storage.objects;
CREATE POLICY education_documents_storage_update
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'education-documents'
  AND public.has_org_permission((storage.foldername(name))[1]::uuid, 'education_document.manage')
)
WITH CHECK (
  bucket_id = 'education-documents'
  AND public.has_org_permission((storage.foldername(name))[1]::uuid, 'education_document.manage')
);
