# Documentation Directory

## Purpose

This directory holds the authoritative product, architecture, security, accessibility, analytics, and development-governance documentation for **SLC Intelligence**.

Documentation is the source of truth for product intent during Phase 0 and remains binding for later implementation phases unless the product owner explicitly approves a change.

## Status

Status: Draft

Last updated: 2026-07-29

Owner: Product Owner

## Scope

In scope:

1. Product identity and requirements
2. Architecture and database planning
3. Security, privacy, audit, and retention rules
4. Accessibility requirements
5. Analytics and decision-support guardrails
6. Testing strategy
7. Development rules and phase roadmap
8. AI governance (deferred features)

Out of scope:

1. Application source code
2. Executable database migrations
3. Environment secrets
4. Production deployment instructions that imply readiness

## Authoritative Documents

When documents conflict, surface the conflict for product-owner resolution. Do not silently choose one interpretation.

| Document                         | Authority                                        |
| -------------------------------- | ------------------------------------------------ |
| `MASTER_PRODUCT_SPEC.md`         | Product identity, principles, modules, non-goals |
| `PRODUCT_ROADMAP.md`             | Authorized phase and future phase boundaries     |
| `DEVELOPMENT_RULES.md`           | Engineering process and phase-control rules      |
| `SECURITY_AND_PRIVACY.md`        | Security, privacy, secrets, tenant isolation     |
| `USER_ROLES_AND_PERMISSIONS.md`  | Authorization model                              |
| `IEP_ANALYTICS_SPEC.md`          | Progress-monitoring analytics requirements       |
| `BEHAVIOR_DETECTIVE_SPEC.md`     | Behavior module requirements                     |
| `DECISION_SUPPORT_GUARDRAILS.md` | Allowed vs prohibited analytic language          |
| `DATABASE_SCHEMA.md`             | Implemented Phase 3-15 schema summary            |
| `ARCHITECTURE_DECISIONS.md`      | Proposed technology and architecture decisions   |
| `AUTHENTICATION.md`              | Supabase auth and no-fake-auth behavior          |
| `TENANT_ARCHITECTURE.md`         | Organization tenant boundaries                   |
| `RLS_STRATEGY.md`                | Row-level security policy strategy               |
| `ANALYTICS_FORMULAS.md`          | Implemented analytics formulas and exclusions    |
| `STUDENT_ACCESS_MODEL.md`        | Student access and assignment-scope model        |
| `PROGRESS_MONITORING_MODEL.md`   | Progress session/data-point model                |
| `MIGRATION_STRATEGY.md`          | Supabase migration ordering                      |
| `SEED_DATA.md`                   | Fictional seed user matrix                       |
| `KNOWN_RISKS.md`                 | Current implementation risks                     |
| `PROGRESS_REPORTING.md`          | Phase 9 reporting application notes              |
| `BEHAVIOR_DETECTIVE.md`          | Phase 10 behavior application notes              |
| `BEHAVIOR_ANALYTICS.md`          | Phase 11 behavior analytics notes                |
| `FBA_SUPPORT_GUARDRAILS.md`      | FBA evidence workspace guardrails                |
| `INTERVENTION_INTELLIGENCE.md`   | Phase 12 intervention application notes          |
| `ACCOMMODATIONS_AND_SERVICES.md` | Phase 13 accommodation/service application notes |
| `FAMILY_COMMUNICATION.md`        | Phase 14 family communication notes              |
| `MEETING_CENTER.md`              | Phase 14 meeting center notes                    |
| `EXECUTIVE_FUNCTION.md`          | Phase 15 executive-function notes                |
| `CLASSROOM_OPERATIONS.md`        | Phase 15 classroom operations notes              |
| `PHASE_9_BOUNDARIES.md`          | Completed Phase 9-12 boundary notes              |
| `PHASE_13_BOUNDARIES.md`         | Completed Phase 13 boundary notes                |
| `PHASE_16_BOUNDARIES.md`         | Completed Phase 16 boundary notes                |
| `ADMINISTRATIVE_INTELLIGENCE.md` | Phase 16 administrative analytics notes          |
| `THREAT_MODEL.md`                | Phase 17 threat model                            |
| `RLS_COVERAGE_MATRIX.md`         | Phase 17 RLS coverage matrix                     |
| `SECURITY_HARDENING_REPORT.md`   | Phase 17 hardening report                        |
| `ACCESSIBILITY_REVIEW.md`        | Phase 17 accessibility review                    |
| `RELIABILITY_REVIEW.md`          | Phase 17 reliability review                      |
| `PERFORMANCE_REVIEW.md`          | Phase 17 performance review                      |
| `PRODUCTION_ARCHITECTURE.md`     | Phase 18 production architecture                 |
| `PRODUCTION_ENVIRONMENT.md`      | Phase 18 environment guide                       |
| `SUPABASE_PRODUCTION_SETUP.md`   | Phase 18 Supabase setup                          |
| `VERCEL_PRODUCTION_SETUP.md`     | Phase 18 Vercel setup                            |
| `GODADDY_DNS_SETUP.md`           | Phase 18 DNS setup                               |
| `DEPLOYMENT_CHECKLIST.md`        | Phase 18 deployment checklist                    |
| `PRODUCTION_SMOKE_TEST_CHECKLIST.md` | Phase 18 smoke tests                         |
| `ROLLBACK_GUIDE.md`              | Phase 18 rollback guide                          |
| `INCIDENT_RESPONSE.md`           | Phase 18 incident response                       |
| `POST_LAUNCH_BACKLOG.md`         | Post-launch backlog categories                   |
| `ISSUE_TEMPLATE.md`              | Post-launch issue template                       |
| `PRODUCTION_RELEASE_NOTES.md`    | Finished-product release notes                   |
| `KNOWN_LIMITATIONS.md`           | Known limitations after launch                   |

Supporting documents refine these authorities and must remain consistent with them.

`COMPONENT_DOCUMENTATION.md` describes the Bundle 1 in-app component gallery approach.

## Document-Review Workflow

1. Draft or update documentation in the same phase as the related product or architecture change.
2. Mark status as `Draft` until product-owner review.
3. Record open questions explicitly; do not invent final answers for unresolved legal, statistical, or policy issues.
4. After product-owner approval, update status and change history.
5. If implementation discovers a conflict with documentation, stop scope expansion and document the conflict.

## Phase-Approval Workflow

1. Complete only the currently authorized phase listed in `PRODUCT_ROADMAP.md`.
2. Deliver the phase completion report required by `DEVELOPMENT_RULES.md`.
3. Stop and wait for product-owner approval before beginning the next phase.
4. Do not treat roadmap order as automatic authorization.

**Current phase status:** Phases 0-18 are completed for finished-product launch. Post-launch testing is in progress.

## Implementation and Documentation Sync

Implementation changes that affect product behavior, permissions, analytics, security, accessibility, data model, reporting, or AI use must update the relevant documentation in the same phase.

Conflicts between documents, or between documents and code, must be surfaced rather than silently resolved.

## Core Requirements

1. Use consistent product terminology defined in `GLOSSARY.md`.
2. Use fictional data only in examples.
3. Do not claim legal certifications.
4. Keep Phase 0 free of application code, packages, SQL, secrets, and deployment configuration.

## Out of Scope

1. Final brand colors
2. Final statistical thresholds for decision support
3. Final legal compliance attestations
4. Parent and student portal specifications beyond deferred status

## Open Questions

1. Which document becomes the single conflict-resolution authority if two authoritative documents disagree after approval?
2. What formal review cadence will the product owner use for documentation updates?

## Change History

| Date       | Change                | Author       |
| ---------- | --------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
| 2026-07-29 | Phase 9-12 application docs added | Cursor Agent |
