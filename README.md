# SLC Intelligence

The Intelligence Platform for Specialized Learning Classrooms

## Product Summary

SLC Intelligence is a special education operations, progress-monitoring, behavior analytics, documentation, communication, and decision-support platform for Specialized Learning Classrooms, intervention specialists, special education teachers, paraprofessionals, related service providers, building administrators, special education administrators, district-level special education programs, school districts, and educational organizations.

## Current Development Status

**Bundle 1 complete locally (pending product-owner approval)**

| Phase                                         | Status      |
| --------------------------------------------- | ----------- |
| Phase 0: Foundation and Governance            | Completed   |
| Phase 1: Application Scaffold                 | Completed   |
| Phase 2: Design System and Public Shell       | Completed   |
| Phase 3: Authentication and Tenant Foundation | Not started |

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

Copy `.env.example` to `.env.local` and leave values empty until Phase 3. Never add service-role keys or real secrets.

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
6. Supabase planned for Phase 3+ (not connected)

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

Do not begin Phase 3 until the product owner explicitly authorizes it.
