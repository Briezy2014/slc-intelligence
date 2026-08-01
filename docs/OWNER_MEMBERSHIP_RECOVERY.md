# Owner membership recovery

## What “Membership pending” means

That page is for **staff waiting for an organization admin to approve** an access request.

It is **not** a normal screen for the founding owner / organization administrator.

If the owner account sees it, the app could not find an **active** `organization_memberships` row for that signed-in user.

## Immediate Supabase fix (run in SQL editor)

Replace the email if needed, then run:

```sql
-- 1) Find the auth user id for the owner email
SELECT id, email
FROM auth.users
WHERE lower(email) = lower('briezy682014@gmail.com');

-- 2) Using that user id, ensure an active organization_admin membership exists.
-- If you already know the organization id, set it explicitly.
WITH owner AS (
  SELECT id AS user_id
  FROM auth.users
  WHERE lower(email) = lower('briezy682014@gmail.com')
  LIMIT 1
),
org AS (
  SELECT id AS organization_id
  FROM public.organizations
  ORDER BY created_at ASC
  LIMIT 1
)
INSERT INTO public.organization_memberships (
  organization_id,
  user_id,
  role_code,
  status,
  start_date,
  end_date
)
SELECT org.organization_id, owner.user_id, 'organization_admin', 'active', CURRENT_DATE, NULL
FROM owner, org
ON CONFLICT (organization_id, user_id) DO UPDATE
SET
  role_code = 'organization_admin',
  status = 'active',
  end_date = NULL,
  updated_at = now();

UPDATE public.organizations
SET status = 'active', archived_at = NULL
WHERE id = (SELECT id FROM public.organizations ORDER BY created_at ASC LIMIT 1);
```

Then sign out / sign in and open `/command-center`.

## App recovery (after migration deploy)

1. Apply `supabase/migrations/202608010001_owner_membership_recovery.sql`.
2. Sign in as the owner.
3. Open `/membership-pending`.
4. Click **Restore my owner / admin access**.
