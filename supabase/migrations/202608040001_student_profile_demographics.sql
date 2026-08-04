-- Optional demographics for student profile (leave blank for de-identified practice students).

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS address_line1 text,
  ADD COLUMN IF NOT EXISTS address_line2 text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS postal_code text;

COMMENT ON COLUMN public.students.date_of_birth IS
  'Optional date of birth. Leave null for de-identified / practice students.';
COMMENT ON COLUMN public.students.address_line1 IS
  'Optional street address. Leave null for de-identified / practice students.';
