# Significant Dependencies

## Purpose

Document significant application dependencies introduced in Bundle 1 and why they are needed.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Runtime dependencies

| Package                    | Why                                               |
| -------------------------- | ------------------------------------------------- |
| `next`                     | App Router web application framework              |
| `react` / `react-dom`      | UI runtime                                        |
| `zod`                      | Environment-variable schema and future validation |
| `clsx`                     | Conditional class composition                     |
| `tailwind-merge`           | Safe Tailwind class merging                       |
| `class-variance-authority` | shadcn/ui-compatible variant API for primitives   |

## Development dependencies

| Package                                                                                | Why                        |
| -------------------------------------------------------------------------------------- | -------------------------- |
| `typescript`                                                                           | Strict typing              |
| `tailwindcss` / `@tailwindcss/postcss`                                                 | Utility styling            |
| `eslint` / `eslint-config-next`                                                        | Base linting               |
| `prettier` / `prettier-plugin-tailwindcss`                                             | Formatting                 |
| `vitest`                                                                               | Unit test runner           |
| `@testing-library/react` / `@testing-library/jest-dom` / `@testing-library/user-event` | Component testing          |
| `jsdom`                                                                                | DOM environment for Vitest |
| `@vitejs/plugin-react`                                                                 | Vitest React transform     |

## Explicitly deferred

1. Supabase client packages (Phase 3+)
2. React Hook Form (when substantial forms begin)
3. Playwright (end-to-end phase expansion)
4. AI SDKs (deferred by AI governance)

## Change History

| Date       | Change                        | Author       |
| ---------- | ----------------------------- | ------------ |
| 2026-07-28 | Bundle 1 dependency inventory | Cursor Agent |
