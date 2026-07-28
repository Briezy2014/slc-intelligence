# SLC Intelligence

The Intelligence Platform for Specialized Learning Classrooms

## Product Summary

SLC Intelligence is a special education operations, progress-monitoring, behavior analytics, documentation, communication, and decision-support platform for Specialized Learning Classrooms, intervention specialists, special education teachers, paraprofessionals, related service providers, building administrators, special education administrators, district-level special education programs, school districts, and educational organizations.

The platform is designed to reduce fragmented documentation and turn classroom data into defensible, understandable, actionable educational information while preserving human decision authority.

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

**Pre-application planning and governance**

**Current authorized phase:** Phase 0: Foundation and Governance

This repository currently contains documentation, governance rules, and placeholder structure only. Application source code, packages, database schema, and deployment configuration are not part of Phase 0.

## Technology Direction

Planned stack (not installed in Phase 0):

1. Next.js (App Router), React, TypeScript (strict)
2. Tailwind CSS and shadcn/ui-compatible components
3. Supabase (PostgreSQL, Auth, Storage, Row Level Security)
4. Vercel for web hosting
5. Zod and React Hook Form for validation/forms
6. Vitest, React Testing Library, Playwright, and accessibility/policy testing

## Security Warning

This repository is designed with role-based access, tenant isolation, and auditability as architectural requirements.

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

## Repository Structure

```text
slc-intelligence/
├── docs/                 # Product and engineering governance documentation
├── supabase/             # Future migrations, seeds, functions, and DB tests
├── tests/                # Future automated test suites
├── public/               # Future public static assets
├── .gitignore
└── README.md
```

## Phase Control

Complete only the currently authorized phase. Do not begin Phase 1: Application Scaffold until the product owner explicitly authorizes it.

## Change History

| Date | Change | Author |
| --- | --- | --- |
| 2026-07-28 | Phase 0 root README established | Cursor Agent |
