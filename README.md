# SLC Intelligence

The Intelligence Platform for Specialized Learning Classrooms

## Product Summary

SLC Intelligence is a special education operations, progress-monitoring, behavior analytics, documentation, communication, and decision-support platform for Specialized Learning Classrooms, intervention specialists, special education teachers, paraprofessionals, related service providers, building administrators, special education administrators, district-level special education programs, school districts, and educational organizations.

## Current Development Status

**Phases 0-8 implemented locally (pending product-owner approval)**

| Phase                                         | Status      |
| --------------------------------------------- | ----------- |
| Phase 0: Foundation and Governance            | Completed   |
| Phase 1: Application Scaffold                 | Completed   |
| Phase 2: Design System and Public Shell       | Completed   |
| Phase 3: Authentication and Tenant Foundation | Completed |
| Phase 4: Schools, Programs, Classrooms, Staff | Completed |
| Phase 5: Student Foundation | Completed |
| Phase 6: IEP Goal Foundation | Completed |
| Phase 7: Progress Monitoring | Completed |
| Phase 8: IEP Analytics | Completed |
| Phase 9: Progress Reporting | Not started |

This repository is under active development and is not approved for production use or real student data.

## Local development

```bash
npm install
npm run dev
```

Scripts:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:e2e`
- `npm run format:check`
- `npm run build`

Copy `.env.example` to `.env.local` and configure Supabase URL/anon key for protected workflows.
If Supabase is not configured, protected pages show development/configuration notices and no fake
authentication is used. Never add service-role keys or real secrets.

## Application routes

- `/` public homepage
- `/about`
- `/privacy`
- `/accessibility`
- `/sign-in` (design shell)
- `/forgot-password` (design shell)
- `/command-center` (platform shell placeholder)
- `/component-gallery`
- `/api/health`

## Technology

1. Next.js App Router, React, TypeScript strict
2. Tailwind CSS and shadcn/ui-compatible primitives
3. Zod environment validation
4. Vitest + React Testing Library
5. Playwright + axe-core accessibility checks
6. Supabase Auth, RLS, migrations, and fictional local seed data for Phases 3-8

## Security and privacy warnings

- Designed with role-based access, tenant isolation, and auditability as architectural requirements.
- Never commit secrets or student records.
- Do not use the Supabase service-role key in browser code.
- Do not claim FERPA/HIPAA/COPPA/SOC 2 certification.

## Documentation

See [`docs/`](docs/README.md), especially:

1. `MASTER_PRODUCT_SPEC.md`
2. `PRODUCT_ROADMAP.md`
3. `DESIGN_SYSTEM.md`
4. `SECURITY_AND_PRIVACY.md`
5. `COMPONENT_DOCUMENTATION.md`

## Phase control

Phase 9 progress reporting is not started. Do not add automated progress-report drafting without
explicit product-owner authorization.
