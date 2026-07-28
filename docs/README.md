# Documentation Directory

## Purpose

This directory holds the authoritative product, architecture, security, accessibility, analytics, and development-governance documentation for **SLC Intelligence**.

Documentation is the source of truth for product intent during Phase 0 and remains binding for later implementation phases unless the product owner explicitly approves a change.

## Status

Status: Draft

Last updated: 2026-07-28

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
| `DATABASE_SCHEMA.md`             | Planned data model (no SQL in Phase 0)           |
| `ARCHITECTURE_DECISIONS.md`      | Proposed technology and architecture decisions   |

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

**Current phase status:** Phase 0–2 completed for Bundle 1. Phase 3 is not started.

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
