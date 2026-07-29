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

## Implemented Coverage

1. Public homepage renders product identity and development notice
2. Skip link exists
3. Sign-in form labels and deferred authentication messaging
4. Health endpoint responds correctly without secrets
5. Command Center development/configuration language
6. Basic public navigation
7. Homepage axe critical-violation check
8. Analytics calculations for percentages, rates, WCPM, reading accuracy, task analysis, descriptive statistics, trend/ROI, aim line, moving averages, phase comparison, prompt distribution, generalization/maintenance grouping, draft exclusion, incompatible units, and edge cases.
9. Auth error mapping.
10. Validation schemas for organization, student, goal, and progress inputs.
11. Repository secret scan for obvious service-role/JWT/API-key material.

## Commands

```bash
npm test
npm run test:e2e
npm run test:coverage
```

## Seed-data requirements

Fictional data only. No real student names, IDs, or contacts.

## Out of Scope for Bundle 1

1. Full browser coverage for every protected CRUD workflow.
2. Expanded RLS positive/negative policy tests for each role.
3. Remote Supabase migration smoke tests.

## Change History

| Date       | Change                                               | Author       |
| ---------- | ---------------------------------------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft                                | Cursor Agent |
| 2026-07-28 | Bundle 1 Vitest/Playwright/axe foundation documented | Cursor Agent |
