# Design System Direction

## Purpose

Describe the visual and interaction foundation for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Bundle 1 implements a provisional design system and public/platform shells. Final brand colors still require product-owner approval.

## Desired Product Characteristics

Professional, calm, intelligent, trustworthy, modern, clear, supportive, and data-informed without appearing clinical or punitive.

## Provisional Tokens (Bundle 1)

Implemented in `src/app/globals.css`:

1. Typography scale (`--text-xs` through `--text-5xl`) with Source Sans 3 and Source Serif 4
2. Spacing scale (`--space-1` through `--space-8`)
3. Surface hierarchy (`background`, `background-elevated`, `surface-subtle`)
4. Border-radius conventions (`sm`, `md`, `lg`)
5. Focus-ring behavior (`:focus-visible` + `--focus-ring`)
6. Status semantics with text labels/badges (not color alone)
7. Form-field patterns via Label/Input/Textarea/Select/Checkbox/FormField
8. Button hierarchy (primary, secondary, ghost, danger)
9. Card patterns
10. Table shell patterns
11. Empty/loading/error-state patterns
12. Responsive breakpoints via Tailwind defaults (sm/md/lg/xl)
13. Print considerations in `@media print`

Temporary neutral palette: cool gray surfaces, deep slate foreground, restrained teal accent. Not final branding.

## Prohibited Visual Patterns

Avoid childish classroom graphics, excessive bright colors, gamification of disability data, decorative clutter, dense dashboards without hierarchy, red-green-only status systems, alarmist language, punitive behavior language, unlabeled icon-only controls, and generic AI-looking gradients everywhere.

## Accessibility Expectations

See `ACCESSIBILITY_REQUIREMENTS.md`. Bundle 1 includes skip links, visible focus, semantic headings, programmatic labels, reduced-motion support, and accessible feedback states.

## Component Documentation Approach

Use the in-app `/component-gallery` route and `COMPONENT_DOCUMENTATION.md`. Storybook remains optional for a later phase.

## Open Questions

1. Final brand colors and logo assets
2. Whether Storybook should replace the in-app gallery later
3. Exact touch-target minimum for district procurement checklists

## Change History

| Date       | Change                                                    | Author       |
| ---------- | --------------------------------------------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft                                     | Cursor Agent |
| 2026-07-28 | Bundle 1 provisional tokens and shell guidance            | Cursor Agent |
| 2026-07-28 | Document implemented Bundle 1 token and pattern inventory | Cursor Agent |
