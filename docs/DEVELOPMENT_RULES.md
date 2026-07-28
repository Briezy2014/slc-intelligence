# Development Rules

## Purpose

Define engineering rules, phase control, review expectations, and quality gates for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

These rules apply to all contributors and agents working in this repository.

## Phase Control

Complete only the currently authorized phase.

At the end of each phase:

1. Stop implementation
2. Run required checks
3. Summarize changes
4. List files created or modified
5. Explain decisions
6. Identify risks
7. Identify unresolved questions
8. Provide manual test instructions
9. Provide rollback instructions
10. Wait for approval

**Current phase status:** Phase 0–2 completed for Bundle 1. Phase 3 is not started and must not begin without explicit authorization.

Do not begin Phase 1 or later phases unless the product owner explicitly authorizes the next phase.

## No Silent Scope Expansion

Do not add major features, dependencies, tables, integrations, or architectural patterns that were not required by the authorized phase.

## Preserve Working Code

Do not rewrite working application sections unnecessarily. Prefer focused, reviewable changes.

## No Duplicate Systems

Before creating a utility, type, component, service, schema, or hook, search for an existing one.

## Type Safety

Use TypeScript strict mode in application phases. Avoid `any`. If `any` is unavoidable, explain and isolate it.

## Validation

All future writes must be validated:

1. Client-side for usability
2. Server-side for trust
3. Database-level for integrity

Prefer Zod for runtime validation and React Hook Form for substantial interactive forms when application work begins.

## Error Handling

Future user-facing errors must:

1. Be understandable
2. Avoid exposing secrets
3. Explain recovery steps
4. Preserve entered data when possible
5. Be accessible to assistive technology

## Logging

Do not log student information unnecessarily. Logs must avoid full student records, tokens, passwords, cookies, service keys, and sensitive narrative notes.

## Dates and Time

Future implementation must use:

1. UTC for stored timestamps where appropriate
2. Organization or user timezone for display
3. Explicit date-only types for date-only educational fields
4. Clear handling of academic years
5. Clear handling of reporting periods

## Soft Deletion

Protected educational records should generally use controlled archival or soft-deletion patterns rather than immediate hard deletion.

## Status History

Important status changes should retain history rather than overwriting the previous state without traceability.

## Documentation

Update relevant documentation in the same phase as architectural or workflow changes.

Conflicts between documents or between documents and implementation must be surfaced rather than silently resolved.

## Comments

Use comments to explain why, not to restate obvious code.

## Dependency Restraint

Do not add a package when the platform or existing stack already provides an adequate solution.

Document every significant dependency and why it is needed.

Do not install packages during Phase 0 unless specifically required to inspect the existing repository. Phase 0 is documentation and project-governance setup only.

## Technology Stack Direction

Unless a documented technical conflict requires a proposal to the product owner:

1. Next.js App Router
2. React
3. TypeScript strict mode
4. Tailwind CSS
5. shadcn/ui-compatible component architecture
6. Supabase (PostgreSQL, Auth, Storage, RLS)
7. Vercel for web hosting
8. Zod, React Hook Form
9. Vitest, React Testing Library, Playwright, accessibility and policy tests

## Branching Recommendations

1. Keep `main` stable and free of secrets and real student data.
2. Use short-lived feature branches named for the phase or change.
3. Do not configure branch protection during Phase 0.
4. Do not merge phase work until the product owner approves the phase report when phase control requires approval.

## Commit-Message Recommendations

Use concise, descriptive commit messages.

Preferred Phase 0 message when authorized:

```text
chore: establish SLC Intelligence foundation and governance
```

Prefer conventional prefixes such as `chore:`, `docs:`, `feat:`, `fix:`, `test:`, and `security:` in later phases.

## Pull-Request Expectations

Future pull requests should include:

1. Summary of intent
2. Phase authorization reference
3. Test plan
4. Security considerations
5. Accessibility considerations
6. Documentation updates
7. Rollback notes for risky changes

## Code-Review Checklist

1. Scope matches authorized phase
2. No secrets or real student data
3. Type safety maintained
4. Validation present for writes
5. Authorization not client-only
6. Accessibility considered for UI changes
7. Tests updated appropriately
8. Documentation updated
9. No unnecessary dependencies
10. Error handling is safe and understandable

## Migration Review

When database work begins:

1. Migrations are version-controlled
2. RLS policies are included and non-permissive
3. Soft-delete and audit implications are considered
4. Rollback or forward-fix strategy is documented
5. No undocumented dashboard schema edits

## Security Review

1. No committed secrets
2. No service-role key in browser code
3. Tenant isolation preserved
4. Export and privileged actions audited
5. Logging avoids sensitive content

## Accessibility Review

1. Keyboard operation
2. Focus management
3. Labels and errors
4. Chart text alternatives
5. Contrast and non-color indicators
6. Responsive behavior

## Testing Review

1. Unit, integration, end-to-end, security, and accessibility coverage as appropriate
2. Analytics calculations tested
3. Permission boundaries tested
4. Fictional seed data only

## Documentation Review

1. Authoritative documents remain consistent
2. Open questions are explicit
3. Phase status is accurate
4. Terminology matches `GLOSSARY.md`

## Rollback Planning

Every phase report must include rollback instructions.

For documentation-only phases, rollback is restoring prior Git state for affected files.

For later phases, rollback may include reverting commits, disabling feature flags, or reverse migrations where safe.

## Repository Isolation

This repository is separate from all other products and projects. Do not import, reference, copy, modify, or connect to code, databases, credentials, assets, repositories, or infrastructure belonging to SwimIQ or any other application.

## Core Requirements

1. Phase-gated delivery
2. Security and privacy by default
3. Accessibility by design
4. Maintainable typed architecture
5. Documentation synchronized with change

## Out of Scope

1. Branch-protection configuration in Phase 0
2. CI setup in Phase 0
3. Package installation in Phase 0

## Open Questions

1. What required reviewers will be enforced once branch protection is configured?
2. What is the required test-passing policy before merge in application phases?
3. Will preview deployments be enabled for every pull request?

## Change History

| Date       | Change                | Author       |
| ---------- | --------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
