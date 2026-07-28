# Testing Strategy

## Purpose

Define the future testing approach for SLC Intelligence across unit, integration, end-to-end, security, accessibility, analytics, and migration testing.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Phase 0 establishes strategy only. No test frameworks are installed and no application tests are executed in this phase.

## Planned Tooling

1. Vitest
2. React Testing Library
3. Playwright
4. Accessibility testing tools and manual protocols
5. Database-policy testing
6. Permission-boundary testing
7. Analytics calculation testing

## Unit Tests

Cover:

1. Pure calculation utilities
2. Validation schemas
3. Decision-support wording helpers
4. Date/reporting-period helpers
5. Formatting and parsing utilities

## Integration Tests

Cover:

1. Server-side services and repositories
2. Authorization checks across memberships and assignments
3. Report draft/finalization flows
4. Multi-table workflows with fictional data

## End-to-End Tests

Cover critical educator journeys such as:

1. Sign-in and tenant selection
2. Assigned student access
3. Progress-data entry
4. Behavior ABC entry
5. Draft report review
6. Denied access to out-of-scope students

## RLS Tests

Required for protected tables:

1. Same-organization allowed access under assignment rules
2. Cross-tenant denial
3. Role and assignment boundary denial
4. Export and privileged action restrictions
5. Verification that permissive `USING (true)` policies are absent on protected tables

## Role-Permission Tests

Validate:

1. Intervention specialist assigned-student access
2. Paraprofessional limited entry and export denial by default
3. Related-service-provider scope
4. Administrator scoped aggregates
5. Read-only reviewer restrictions
6. Finalization permission boundaries

## Analytics Calculation Tests

Cover:

1. Raw-value preservation
2. Measurement-specific calculations
3. Data-quality flags
4. Trend and goal-line calculations
5. Phase comparisons
6. Behavior pattern counts
7. Explainability metadata
8. Guardrails against prohibited conclusions

## Accessibility Tests

Cover:

1. Keyboard flows
2. Focus management
3. Form labels and errors
4. Table semantics
5. Chart text alternatives
6. Contrast checks where automatable
7. Reduced-motion behavior for motion-related features

## Report Tests

Cover:

1. Scope labels
2. Draft versus final states
3. Evidence references
4. Export logging
5. Accessible print/output structure
6. Small-group suppression behavior when defined

## Migration Tests

Cover:

1. Migration apply success
2. Rollback or forward-fix strategy where practical
3. RLS enabled after migration
4. Constraints and status history integrity

## Regression Tests

Maintain regression coverage for:

1. Authorization boundaries
2. Analytics calculations
3. Critical classroom entry workflows
4. Accessibility of shared components

## Seed-Data Requirements

1. Fictional data only
2. No real student names, IDs, or contact information
3. Seeds must support permission and analytics test scenarios
4. Demo seeds must be clearly identifiable as fictional

## Production Smoke Tests

Before and after production deployments:

1. Health endpoint
2. Authentication path
3. Tenant isolation sanity check with fictional or approved pilot accounts
4. Critical navigation
5. No secret leakage in client bundles

## Test Directory Layout

```text
tests/
  unit/
  integration/
  end-to-end/
  security/
  accessibility/
```

Supabase-specific policy tests may also live under `supabase/tests/`.

## Core Requirements

1. Security and permission tests are mandatory for protected data features
2. Analytics must have deterministic calculation tests
3. Accessibility is part of done
4. Fictional data only

## Out of Scope

1. Installing test runners in Phase 0
2. Claiming production readiness based on documentation alone
3. Testing against real student data

## Open Questions

1. What minimum coverage thresholds, if any, will be enforced in CI?
2. Will RLS tests run against local Supabase, CI containers, or both?
3. Which Playwright projects (browsers/devices) are required for release?
4. How often will full accessibility audits run versus smoke checks?

## Change History

| Date | Change | Author |
| --- | --- | --- |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
