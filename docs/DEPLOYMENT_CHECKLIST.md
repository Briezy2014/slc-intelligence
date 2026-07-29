# Deployment Checklist

1. Migrations apply cleanly in order.
2. Production Supabase project is separate from development.
3. Production env vars set in Vercel (no service-role in public vars).
4. Auth site URL and redirects configured.
5. Domain added in Vercel.
6. GoDaddy DNS updated from Vercel values.
7. HTTPS active.
8. www → apex redirect verified.
9. robots/sitemap exclude protected routes.
10. Secret scan clean.
11. RLS and tenant isolation tests pass locally/staging.
12. Production smoke tests executed with fictional data only.
13. Rollback guide reviewed.
14. Product owner notified that production testing may begin.
