# Authentication

Phase 3-8 uses Supabase Auth through server-side Supabase clients and middleware.

Rules:

1. Protected pages require a Supabase user only when Supabase is configured.
2. Unconfigured environments show a development/configuration notice and never fake auth.
3. Organization membership is verified after authentication through `organization_memberships`.
4. The selected organization is stored in an HTTP-only `slc_org_id` cookie.
5. Auth error messages are intentionally generic and do not enumerate accounts.
6. No service-role key is used in application code.

## Access requests (approval workflow)

Educators can create an account at `/request-access` (email/password + role checkboxes + staff invite code).
This does **not** grant platform access immediately.

1. The requester account is created in Supabase Auth.
2. A pending row is stored in `organization_access_requests`.
3. Organization admins review the queue at `/organization/access-requests` (in-app notification inbox).
4. Approve creates an active `organization_membership` with the granted role; deny leaves the account without access.

Outbound email notifications are not sent by the app yet. The admin queue is the notification surface for MVP.
