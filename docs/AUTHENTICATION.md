# Authentication

Phase 3-8 uses Supabase Auth through server-side Supabase clients and middleware.

Rules:

1. Protected pages require a Supabase user only when Supabase is configured.
2. Unconfigured environments show a development/configuration notice and never fake auth.
3. Organization membership is verified after authentication through `organization_memberships`.
4. The selected organization is stored in an HTTP-only `slc_org_id` cookie.
5. Auth error messages are intentionally generic and do not enumerate accounts.
6. No service-role key is used in application code.
