# Component documentation approach

## Purpose

Describe how reusable UI components are documented for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Approach

1. Keep primitives under `src/components/ui` in a shadcn/ui-compatible style.
2. Keep layout, navigation, feedback, forms, data-display, and accessibility helpers in dedicated folders.
3. Document examples in `/component-gallery`.
4. Prefer semantic HTML, visible focus, programmatic labels, and status roles.
5. Add unit and e2e accessibility checks where practical.

## Current primitives and patterns

Button, Input, Label, Textarea, Select, Checkbox, Alert, Badge, Card, Dialog, DropdownShell, TableShell, EmptyState, LoadingState, ErrorState, PageHeader, Breadcrumbs, VisuallyHidden, AccessibleIcon, PublicHeader/Footer, Platform sidebar/top nav, MobileNav, OrganizationSelectorPlaceholder, UserMenuPlaceholder, SkipLink, FormField, SignInFormShell, ForgotPasswordFormShell.

## Out of scope

1. Production authentication behavior
2. Final brand color approval
3. Chart components
4. Data tables backed by student records

## Change History

| Date       | Change                                             | Author       |
| ---------- | -------------------------------------------------- | ------------ |
| 2026-07-28 | Initial Bundle 1 component documentation approach  | Cursor Agent |
| 2026-07-28 | Expanded inventory for full Bundle 1 component set | Cursor Agent |
