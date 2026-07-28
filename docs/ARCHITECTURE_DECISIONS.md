# Architecture Decision Records

## Purpose

Provide an index of architecture decisions for SLC Intelligence and record preliminary Phase 0 proposals.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Decisions listed here are **Proposed** until the product owner marks them accepted. Do not treat proposed decisions as irreversible.

## Decision Index

| ID | Decision | Status |
| --- | --- | --- |
| ADR-001 | Next.js as the web application framework | Proposed |
| ADR-002 | TypeScript with strict mode | Proposed |
| ADR-003 | Supabase as backend data and auth platform | Proposed |
| ADR-004 | PostgreSQL as the primary datastore | Proposed |
| ADR-005 | Vercel for Next.js hosting | Proposed |
| ADR-006 | Multi-tenant architecture with organization isolation | Proposed |
| ADR-007 | Row Level Security for protected data | Proposed |
| ADR-008 | Next.js App Router architecture | Proposed |
| ADR-009 | Version-controlled database migrations | Proposed |
| ADR-010 | Web-first responsive application | Proposed |
| ADR-011 | Deferred native mobile applications | Proposed |
| ADR-012 | Deferred AI features | Proposed |
| ADR-013 | Separate development and production environments | Proposed |

## ADR-001: Next.js

- **Status:** Proposed
- **Context:** Need a modern full-stack React framework with strong TypeScript support and server-capable patterns.
- **Decision:** Use Next.js for the web application.
- **Consequences:** Application phases will follow Next.js conventions; hosting aligns with Vercel.

## ADR-002: TypeScript Strict Mode

- **Status:** Proposed
- **Context:** Educational workflows and authorization logic require maintainable type safety.
- **Decision:** Use TypeScript with strict mode.
- **Consequences:** Avoid `any`; generated database types should be adopted when schema work begins.

## ADR-003: Supabase

- **Status:** Proposed
- **Context:** Need managed PostgreSQL, authentication, storage, and policy tooling.
- **Decision:** Use Supabase for database, authentication, storage, and approved backend services.
- **Consequences:** RLS and secure server-side privileged operations are mandatory design constraints.

## ADR-004: PostgreSQL

- **Status:** Proposed
- **Context:** Relational integrity is required for tenancy, assignments, goals, and auditability.
- **Decision:** Use PostgreSQL as the primary datastore.
- **Consequences:** Schema changes require migrations; constraints are a final integrity layer.

## ADR-005: Vercel

- **Status:** Proposed
- **Context:** Need hosting aligned with Next.js.
- **Decision:** Host the Next.js web application on Vercel.
- **Consequences:** Custom domain configuration is deferred; no production deployment in Phase 0.

## ADR-006: Multi-Tenant Architecture

- **Status:** Proposed
- **Context:** The product serves multiple educational organizations with strict isolation needs.
- **Decision:** Design as multi-tenant SaaS with organization-scoped protected records and membership/assignment-based authorization.
- **Consequences:** No global role-only authorization model; tenant isolation tests are required.

## ADR-007: Row Level Security

- **Status:** Proposed
- **Context:** Client-side checks are insufficient for student-data protection.
- **Decision:** Enable RLS for all exposed protected or tenant-specific tables and avoid permissive placeholder policies.
- **Consequences:** Policy testing becomes part of schema delivery.

## ADR-008: App Router

- **Status:** Proposed
- **Context:** Need current stable Next.js routing and server/client component patterns.
- **Decision:** Use the App Router architecture.
- **Consequences:** Prefer Server Components where appropriate; use Client Components only for required interactivity.

## ADR-009: Version-Controlled Migrations

- **Status:** Proposed
- **Context:** Undocumented dashboard schema changes create drift and risk.
- **Decision:** Implement all database changes through version-controlled migrations under `supabase/migrations/`.
- **Consequences:** No Phase 0 SQL; later phases must review migrations with RLS and rollback planning.

## ADR-010: Web-First Responsive Application

- **Status:** Proposed
- **Context:** Educators need practical access on desktop and mobile browsers without early native-app complexity.
- **Decision:** Build a web-first responsive application.
- **Consequences:** Native iOS/Android apps are deferred.

## ADR-011: Deferred Native Mobile Applications

- **Status:** Proposed
- **Context:** Native apps are excluded from initial release unless later approved.
- **Decision:** Do not build native iOS or Android applications in early phases.
- **Consequences:** Mobile-responsive web UX must support classroom entry needs.

## ADR-012: Deferred AI

- **Status:** Proposed
- **Context:** Permissions, privacy, and data quality must stabilize before AI drafting features.
- **Decision:** Defer AI packages and integrations; govern future AI through `AI_GOVERNANCE.md`.
- **Consequences:** No AI features in Phase 0; future AI requires human review and kill-switch controls.

## ADR-013: Separate Development and Production Environments

- **Status:** Proposed
- **Context:** Real student data must not mix with development workflows.
- **Decision:** Maintain separate development and production environments; use fictional data in development and demos unless an approved pilot process exists.
- **Consequences:** Secrets, projects, and datasets remain isolated; production use requires explicit readiness review.

## Core Requirements

1. Mark decisions Proposed until accepted
2. Record context, decision, and consequences
3. Update this index when major architecture choices change

## Out of Scope

1. Accepting decisions without product-owner review
2. Implementing the stack in Phase 0

## Open Questions

1. Which decisions should be accepted immediately after Phase 0 review?
2. Is there any known conflict that would require an alternative to Supabase or Vercel?
3. Will edge functions or only Next.js server routes be preferred for privileged operations?

## Change History

| Date | Change | Author |
| --- | --- | --- |
| 2026-07-28 | Initial Phase 0 ADR index and proposed decisions | Cursor Agent |
