# Tests Directory

## Purpose

Hold future automated and structured manual test suites for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Phase 0 creates placeholder folders only. No test frameworks are installed in this phase.

## Layout

| Path             | Intended use                                     |
| ---------------- | ------------------------------------------------ |
| `unit/`          | Unit tests                                       |
| `integration/`   | Integration tests                                |
| `end-to-end/`    | Playwright or equivalent end-to-end tests        |
| `security/`      | Permission-boundary and related security tests   |
| `accessibility/` | Accessibility automated and fixture-backed tests |

Additional Supabase policy tests may live under `supabase/tests/`.

## Rules

1. Use fictional data only.
2. Never include real student information in fixtures.
3. Prefer testing authorization and analytics calculations as first-class concerns.
4. See `docs/TESTING_STRATEGY.md` for the full strategy.

## Change History

| Date       | Change                     | Author       |
| ---------- | -------------------------- | ------------ |
| 2026-07-28 | Initial placeholder README | Cursor Agent |
