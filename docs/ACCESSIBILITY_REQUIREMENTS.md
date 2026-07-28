# Accessibility Requirements

## Purpose

Define accessibility requirements, testing expectations, and definition-of-done criteria for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Accessibility applies to all future user interfaces, including forms, tables, navigation, charts, dialogs, reports, and empty, loading, and error states.

## WCAG Target

Target WCAG 2.2 Level AA where feasible and do not regress below applicable legal or contractual accessibility requirements.

## Keyboard Use

1. Full keyboard navigation for all interactive controls
2. Logical tab order
3. No keyboard traps
4. Shortcut keys, if introduced, must not conflict with assistive technology and must be documented

## Focus Management

1. Visible focus indicators
2. Dialog focus management
3. Focus restoration after closing overlays
4. Skip links to primary content

## Forms

1. Programmatic labels for every field
2. Accessible field instructions
3. Accessible error messages associated with fields
4. Do not use placeholder text as a substitute for a field label
5. Preserve entered data when recoverable validation errors occur
6. Support keyboard entry and save-and-return workflows

## Tables

1. Screen-reader-compatible tables
2. Proper headers and captions or accessible names
3. Sortable and filterable table controls must expose state accessibly
4. Row actions must be reachable by keyboard

## Charts

1. Every chart must have an equivalent understandable text summary or accessible data-table view
2. Do not convey meaning by color alone
3. Provide text alternatives for visual analytics
4. Support keyboard access to interactive chart controls if interactivity exists

## Color

1. Sufficient color contrast
2. No color-only meaning
3. Avoid red-green-only status systems
4. Status must include text or iconographic reinforcement that remains meaningful without color

## Touch Targets

Touch targets must be large enough for practical classroom and mobile use. Exact minimum sizes will follow design-system tokens and accessibility testing.

## Error Messages

Error messages must be:

1. Understandable
2. Accessible to assistive technology
3. Associated with the relevant fields or page regions
4. Free of secret or sensitive system details

## Loading States

Loading and error states must be announced accessibly and must not leave users without a programmatic status update when content changes asynchronously.

## Responsive Design

Layouts must work on desktop and mobile-responsive viewports used in classrooms.

## Reduced Motion

Respect reduced-motion preferences. Motion should create presence and hierarchy, not noise, and must remain optional where it could cause harm or distraction.

## Screen Readers

Interfaces must be usable with common screen readers through semantic HTML, ARIA only where necessary, and tested accessible names/roles/states.

## PDF and Report Accessibility

Reports and print/PDF outputs must aim for accessible structure, including:

1. Headings
2. Tagged or equivalently structured content where feasible
3. Text alternatives for visual analytics
4. Clear date, scope, and limitation labels
5. Readable print styles

## Testing Expectations

Plan for:

1. Automated accessibility checks in CI where practical
2. Manual keyboard testing
3. Screen-reader sampling for critical flows
4. Color-contrast verification
5. Chart text-alternative verification
6. Form label and error association checks
7. Dialog focus-management checks
8. Accessibility regression tests for critical components

## Definition of Done (Accessibility)

A user-facing feature is not done unless:

1. It is operable by keyboard
2. Focus is visible and managed
3. Labels, instructions, and errors are programmatic
4. Charts have text or table equivalents
5. Color is not the only indicator
6. Loading, empty, and error states are accessible
7. Relevant accessibility tests are added or manually documented
8. No known WCAG 2.2 AA regressions are introduced without product-owner acknowledgment

## Core Requirements

1. Accessibility by design from Phase 1 onward
2. Semantic HTML first
3. Equivalent text for visual analytics
4. Inclusive educator workflows on desktop and mobile-responsive layouts

## Out of Scope

1. Final component library implementation in Phase 0
2. Third-party audit procurement in Phase 0
3. Native mobile application accessibility (native apps deferred)

## Open Questions

1. Which assistive technologies and browser combinations are in-scope for formal release testing?
2. Will VPAT or equivalent documentation be required for district procurement?
3. What exact minimum touch-target size will the design system adopt?
4. How will printable report accessibility be validated for each report type?

## Change History

| Date | Change | Author |
| --- | --- | --- |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
