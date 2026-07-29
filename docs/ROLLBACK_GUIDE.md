# Rollback Guide

1. Identify the previous known-good Vercel deployment in the Vercel dashboard.
2. Promote/redeploy that deployment to production.
3. Database migrations are generally forward-only; do not run destructive rollback SQL without product-owner approval and a verified backup.
4. Confirm Supabase backup availability before schema changes.
5. Disable a broken feature with an env flag or by reverting the release commit if needed.
6. Disable new account creation in Supabase Auth settings if invitation abuse occurs.
7. Revoke compromised credentials in Supabase and Vercel; rotate env vars.
8. Temporarily remove the custom domain in Vercel only if DNS/TLS is actively harmful.
9. Display a maintenance notice page if prolonged downtime is required.
10. Preserve incident evidence (timestamps, deployment IDs, sanitized logs).
11. Restoration requires product-owner approval except when stopping an active data-security exposure.
