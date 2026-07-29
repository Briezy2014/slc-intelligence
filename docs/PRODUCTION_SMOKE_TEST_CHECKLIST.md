# Production Smoke-Test Checklist

Use fictional data only.

## Public

1. Root URL loads with branding
2. www redirects
3. HTTPS active
4. Favicon and metadata correct
5. Sign-in, password-reset, privacy, terms, accessibility, support pages load
6. No development banner in production
7. No localhost URLs

## Auth / authz

1. Valid and invalid sign-in
2. Sign out and session restoration
3. Password reset request
4. Unauthorized protected route redirect
5. Organization isolation checks with two orgs when available

## Core workflows

Create fictional organization/school/classroom/student/goal/progress/report/behavior/intervention/accommodation/service/communication/meeting/EF/classroom-ops records and verify Administrative Intelligence summaries.

## Responsive

Desktop, tablet, and mobile navigation, forms, tables, dialogs, print preview.
