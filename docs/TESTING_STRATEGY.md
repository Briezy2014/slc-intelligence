# Testing Strategy

## Purpose

Define the testing approach for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Bundle 1 establishes unit, component, end-to-end, and accessibility testing foundations. No tests use real student data.

## Planned and Implemented Tooling

1. Vitest — unit and component tests
2. React Testing Library — component accessibility and behavior
3. Playwright — end-to-end browser tests
4. `@axe-core/playwright` — accessibility scans in e2e
5. Future: RLS, permission-boundary, analytics calculation, migration, and report tests

## Bundle 1 Initial Coverage

1. Public homepage renders product identity and development notice
2. Skip link exists
3. Sign-in form labels and deferred authentication messaging
4. Health endpoint responds correctly without secrets
5. Command Center placeholder development language
6. Basic public navigation
7. Homepage axe critical-violation check

## Commands

```bash
npm test
npm run test:e2e
npm run test:coverage
```

## Seed-data requirements

Fictional data only. No real student names, IDs, or contacts.

## Out of Scope for Bundle 1

1. Authentication integration tests
2. Database policy tests
3. Protected-data workflow tests

## Change History

| Date       | Change                                               | Author       |
| ---------- | ---------------------------------------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft                                | Cursor Agent |
| 2026-07-28 | Bundle 1 Vitest/Playwright/axe foundation documented | Cursor Agent |
