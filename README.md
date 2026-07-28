# SLC Intelligence

The Intelligence Platform for Specialized Learning Classrooms

## Product Summary

SLC Intelligence is a special education operations, progress-monitoring, behavior analytics, documentation, communication, and decision-support platform for Specialized Learning Classrooms, intervention specialists, special education teachers, paraprofessionals, related service providers, building administrators, special education administrators, district-level special education programs, school districts, and educational organizations.

## Intended Users

1. Intervention specialists
2. Special education teachers
3. Classroom staff and paraprofessionals
4. Related service providers
5. Building administrators
6. Special education administrators
7. Organization and district administrators

Parent and student portals are deferred from the initial release.

## Current Development Status

**Application scaffold and public shell (Bundle 1)**

**Current authorized phases for this bundle:** Phase 1 and Phase 2

Phase 0 foundation documentation is complete on `main`. Bundle 1 adds the Next.js application scaffold, provisional design system, navigation shell, authentication-page designs, and feedback states. Authentication backends, tenants, and student records are not included.

## Local development

```bash
npm install
npm run dev
```

Useful scripts:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run format:check`
- `npm run build`

Copy `.env.example` to `.env.local` and leave values empty until Phase 3. Never add service-role keys or real secrets.

## Technology Direction

1. Next.js (App Router), React, TypeScript (strict)
2. Tailwind CSS and shadcn/ui-compatible components
3. Supabase planned for later phases (PostgreSQL, Auth, Storage, RLS)
4. Vercel for web hosting
5. Zod for environment and future validation
6. Vitest and React Testing Library; Playwright planned later

## Security Warning

Designed with role-based access, tenant isolation, and auditability as architectural requirements.

Never commit secrets, service-role keys, access tokens, private keys, or production credentials.

Do not use the Supabase service-role key in browser code.

## Fictional-Data-Only Warning

Only fictional data may be used during development and demonstrations unless the product owner later establishes an approved controlled pilot process.

Never place real student information in source code, seeds, fixtures, screenshots, prompts, logs, or demos.

## No Production Use

This repository is under active development and is not approved for production use or real student data.

Do not claim legal certifications such as FERPA, HIPAA, COPPA, or SOC 2 unless a qualified legal and compliance process establishes that claim.

## Documentation

Authoritative product and engineering documentation lives in [`docs/`](docs/README.md).

Start with:

1. [`docs/MASTER_PRODUCT_SPEC.md`](docs/MASTER_PRODUCT_SPEC.md)
2. [`docs/PRODUCT_ROADMAP.md`](docs/PRODUCT_ROADMAP.md)
3. [`docs/DEVELOPMENT_RULES.md`](docs/DEVELOPMENT_RULES.md)
4. [`docs/SECURITY_AND_PRIVACY.md`](docs/SECURITY_AND_PRIVACY.md)
5. [`docs/COMPONENT_DOCUMENTATION.md`](docs/COMPONENT_DOCUMENTATION.md)

## Repository Structure

```text
slc-intelligence/
├── docs/
├── src/                  # Next.js App Router application
├── supabase/             # Future migrations, seeds, functions, and DB tests
├── tests/                # Automated test suites
├── public/               # Public static assets
├── .github/workflows/    # Basic CI checks
├── .env.example
├── .gitignore
└── README.md
```

## Phase Control

Complete only currently authorized phases. Do not begin Phase 3: Authentication and Tenant Foundation until the product owner explicitly authorizes it.

## Change History

| Date       | Change                                         | Author       |
| ---------- | ---------------------------------------------- | ------------ |
| 2026-07-28 | Phase 0 root README established                | Cursor Agent |
| 2026-07-28 | Bundle 1 application scaffold and public shell | Cursor Agent |
