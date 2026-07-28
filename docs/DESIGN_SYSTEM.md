# Design System Direction

## Purpose

Describe the intended visual and interaction characteristics of SLC Intelligence without finalizing brand colors or implementing components.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

This document guides UI work. Bundle 1 introduces provisional design tokens and accessible shell components. Final brand colors still require product-owner approval.

## Provisional Tokens (Bundle 1)

Bundle 1 ships provisional CSS variables in `src/app/globals.css`:

1. Calm cool-gray surfaces
2. Deep slate foreground
3. Teal accent for trust and focus
4. Status colors that are never color-only in UI copy

These are temporary implementation tokens, not final branding.

## Desired Product Characteristics

The application should feel:

1. Professional
2. Calm
3. Intelligent
4. Trustworthy
5. Modern
6. Clear
7. Supportive
8. Data-informed without appearing clinical or punitive

## Prohibited Visual Patterns

Avoid:

1. Childish classroom graphics
2. Excessive bright colors
3. Gamification of disability data
4. Decorative clutter
5. Dense dashboards without hierarchy
6. Red-green-only status systems
7. Alarmist language
8. Punitive behavior language
9. Overuse of icons without labels
10. Generic AI-looking gradients everywhere

Also avoid defaulting to common AI-generated aesthetic clusters unless the product owner explicitly chooses a related direction later.

## Accessibility Expectations

Design tokens and components must support:

1. Sufficient contrast
2. Visible focus states
3. Non-color status semantics
4. Large enough touch targets
5. Reduced-motion alternatives
6. Accessible form, table, dialog, and chart patterns
7. WCAG 2.2 Level AA targets where feasible

See `ACCESSIBILITY_REQUIREMENTS.md`.

## Future Design-Token Categories

Plan tokens for:

1. Typography
2. Spacing
3. Border radius
4. Surface hierarchy
5. Status semantics
6. Chart conventions
7. Form patterns
8. Table patterns
9. Navigation patterns
10. Empty states
11. Error states
12. Loading states
13. Print styles
14. Accessibility standards

Do not invent final branding colors during Phase 0 unless provided by the product owner.

## Chart-Design Requirements

1. Clear hierarchy and readable axes/labels
2. Text summary or accessible data-table equivalent for every chart
3. No color-only encoding
4. Explicit date range and filter context
5. Visible limitation or insufficient-data states
6. Avoid ranking visualizations that compare students competitively

## Form-Design Requirements

1. Visible labels
2. Clear instructions and errors
3. Rapid-entry patterns for classroom use
4. Draft and save-and-return support
5. Mobile-responsive layouts
6. Keyboard-friendly controls
7. Measurement-specific fields that preserve raw values

## Table-Design Requirements

1. Semantic headers
2. Predictable sorting and filtering affordances
3. Row actions with labels
4. Responsive strategies that preserve meaning
5. Accessible empty states

## Dashboard Hierarchy

Command Center should present role-aware summaries with clear priority, not an undifferentiated widget wall.

First-priority content should help educators act on assigned students and deadlines within authorization scope.

Administrative dashboards must use aggregation and privacy safeguards and must not become surveillance scorecards.

## Responsive Requirements

1. Desktop and mobile-responsive support
2. Practical classroom data entry on smaller screens
3. No loss of critical labels when collapsing layouts

## Print Requirements

1. Print-friendly reports
2. Clear document title, date, scope, and limitations
3. Charts accompanied by text or tables
4. Draft versus final status visible when printed

## Branding Notes

1. Product name: SLC Intelligence
2. Tagline: The Intelligence Platform for Specialized Learning Classrooms
3. Do not add trademark symbols automatically throughout the UI
4. Brand assets may later live under `public/brand/`
5. Final colors and type selections require product-owner direction

## Core Requirements

1. Calm, professional educator-centered UI
2. Accessibility-first components
3. Clear hierarchy over decorative density
4. No punitive or gamified disability aesthetics

## Out of Scope

1. Final color palette
2. Final font licensing selections
3. Component implementation in Phase 0
4. Marketing landing-page production in Phase 0

## Open Questions

1. What typography pairing does the product owner prefer?
2. Will there be a distinct public marketing visual system versus the authenticated product shell?
3. What status semantic labels and shapes will replace color-only cues?
4. Should Command Center favor task queues, calendar deadlines, or data-quality alerts as the top visual priority for intervention specialists?

## Change History

| Date       | Change                                         | Author       |
| ---------- | ---------------------------------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft                          | Cursor Agent |
| 2026-07-28 | Bundle 1 provisional tokens and shell guidance | Cursor Agent |
