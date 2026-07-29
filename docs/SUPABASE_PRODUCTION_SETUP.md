# Supabase Production Setup

1. Create a dedicated production Supabase project in an appropriate region.
2. Store the database password in an approved secret manager — never in git.
3. Apply migrations in order from `supabase/migrations`.
4. Verify RLS after migration using the RLS coverage matrix and isolation tests against a staging clone when possible.
5. Configure Auth:
   - Site URL: `https://slcintelligence.com`
   - Redirect URLs:
     - `https://slcintelligence.com/auth/callback`
     - `https://www.slcintelligence.com/auth/callback`
     - `https://slcintelligence.com/reset-password`
     - `https://www.slcintelligence.com/reset-password`
6. Configure storage buckets and storage RLS before enabling protected uploads.
7. Review backup settings and enable automated backups available on the plan.
8. Seed only fictional demonstration data, or start clean for organization onboarding.
9. Do not enable development-only bypasses.
10. Never expose the service-role key to the Next.js browser bundle.
