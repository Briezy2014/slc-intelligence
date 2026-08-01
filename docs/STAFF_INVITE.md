# Staff invite + display name

## Add staff (owner / organization admin)

1. Open **Staff**.
2. Under **Add staff**, click **Copy invite code**.
3. Share the code with the educator.
4. They open **Request access** (`/request-access`), create an account, enter the invite code, and submit.
5. You open **Review access requests** on Staff (or Organization → Access requests) and approve them.
6. Optional: use **Add staff invitation** to record their email/role for your tracking.

The invite code is your organization slug. It is not a clickable dead label anymore — use **Copy invite code**.

## Fix “Product owner / Organization administrator” showing instead of a person name

That badge/role label is your **role**, not your name. Staff list Name should show a person name such as **Kara Williams**.

### In the app

1. Open **Staff**.
2. Under **My display name**, click **Use Kara Williams**, then **Save my name**.
3. Or edit the same fields under **Account**.

### Immediate Supabase SQL (optional)

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
