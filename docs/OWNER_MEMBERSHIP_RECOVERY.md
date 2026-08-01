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
SET status = 'active', updated_at = now()
WHERE id = (SELECT id FROM public.organizations ORDER BY created_at ASC LIMIT 1);
```

`organizations` has **no** `archived_at` column — only `status`. Do not set `archived_at`.

Then sign out / sign in and open `/command-center`.

### Set display name to Kara Williams (optional)

Profile rows must exist before membership inserts (memberships reference `user_profiles`). Run this first or right after:

```sql
WITH owner AS (
  SELECT id AS user_id
  FROM auth.users
  WHERE lower(email) IN (
    lower('briezy682014@gmail.com'),
    lower('aspyn682014@yahoo.com')
  )
)
INSERT INTO public.user_profiles (id, display_name, preferred_name, status)
SELECT owner.user_id, 'Kara Williams', 'Kara', 'active'
FROM owner
ON CONFLICT (id) DO UPDATE
SET
  display_name = 'Kara Williams',
  preferred_name = 'Kara',
  status = 'active',
  updated_at = now();
```


## App recovery (after migration deploy)

1. Apply `supabase/migrations/202608010001_owner_membership_recovery.sql`.
2. Sign in as the owner.
3. Open `/membership-pending`.
4. Click **Restore my owner / admin access**.
