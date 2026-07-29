# Significant Dependencies

## Purpose

Document significant application dependencies introduced in Bundle 1 and why they are needed.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Runtime dependencies

| Package                    | Why                                   |
| -------------------------- | ------------------------------------- |
| `next`                     | App Router web application framework  |
| `react` / `react-dom`      | UI runtime                            |
| `zod`                      | Environment and form validation       |
| `clsx`                     | Conditional class composition         |
| `tailwind-merge`           | Safe Tailwind class merging           |
| `class-variance-authority` | shadcn/ui-compatible variant API      |
| `@supabase/supabase-js`    | Supabase client                       |
| `@supabase/ssr`            | Cookie-based Auth for App Router      |
| `react-hook-form`          | Accessible authenticated forms        |
| `@hookform/resolvers`      | Zod resolvers for forms               |
| `lucide-react`             | Consistent professional outline icons |

## Development dependencies

| Package                                                                                | Why                           |
| -------------------------------------------------------------------------------------- | ----------------------------- |
| `typescript`                                                                           | Strict typing                 |
| `tailwindcss` / `@tailwindcss/postcss`                                                 | Utility styling               |
| `eslint` / `eslint-config-next`                                                        | Base linting                  |
| `prettier` / `prettier-plugin-tailwindcss`                                             | Formatting                    |
| `vitest`                                                                               | Unit/component test runner    |
| `@testing-library/react` / `@testing-library/jest-dom` / `@testing-library/user-event` | Component testing             |
| `jsdom`                                                                                | DOM environment for Vitest    |
| `@vitejs/plugin-react`                                                                 | Vitest React transform        |
| `@playwright/test`                                                                     | End-to-end testing            |
| `@axe-core/playwright`                                                                 | Accessibility scanning in e2e |
| `supabase`                                                                             | Local Supabase CLI support    |

## Explicitly deferred

1. AI SDKs
2. Large third-party UI kits beyond shadcn-compatible primitives
3. Service-role key usage in application runtime

## Change History

| Date       | Change                                  | Author       |
| ---------- | --------------------------------------- | ------------ |
| 2026-07-28 | Bundle 1 dependency inventory           | Cursor Agent |
| 2026-07-28 | Added Playwright and axe-core rationale | Cursor Agent |
| 2026-07-28 | Supabase, forms, and Lucide brand icons | Cursor Agent |
