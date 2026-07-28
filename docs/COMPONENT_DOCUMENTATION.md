# Component documentation approach

## Purpose

Describe how reusable UI components are documented during Bundle 1 (Phase 2) for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Bundle 1 uses an in-app component gallery plus short markdown notes. Full Storybook (or equivalent) may be considered later if product-owner approved.

## Approach

1. Keep primitives under `src/components/ui` in a shadcn/ui-compatible style.
2. Keep layout and feedback patterns under `src/components/layout` and `src/components/feedback`.
3. Document examples in `/components` (Component gallery route).
4. Prefer semantic HTML, visible focus, programmatic labels, and status roles.
5. Add unit tests for critical accessible behaviors where practical.

## Current primitives

1. Button
2. Input
3. Label
4. Alert
5. SkipLink
6. SiteHeader
7. AppShell
8. EmptyState
9. LoadingState
10. ErrorState

## Out of scope

1. Production authentication behavior
2. Final brand color approval
3. Chart components
4. Data tables backed by student records

## Open questions

1. Should Storybook be introduced in a later design-system hardening phase?
2. Which additional primitives are required before Phase 3 forms?

## Change History

| Date       | Change                                            | Author       |
| ---------- | ------------------------------------------------- | ------------ |
| 2026-07-28 | Initial Bundle 1 component documentation approach | Cursor Agent |
