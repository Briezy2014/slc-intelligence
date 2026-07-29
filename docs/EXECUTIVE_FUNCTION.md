# Executive Function

Phase 15 adds executive-function support surfaces for plans, observations, checklists, tasks, and student schedules.

## Scope

- Skill areas and student executive-function plans.
- Supports and observations with prompt-level summaries.
- Student checklists, checklist responses, task analyses, task completion logs, and student schedule blocks.

## Analytics

- `src/lib/analytics/executive-function-calculations.ts` provides deterministic checklist %, task completion %, prompt distribution, independence %, schedule duration, and overlap detection.
- Missing or not-observed/not-applicable values are excluded from scored denominators and are not treated as zero.

## Guardrails

- Observations describe support use and do not claim mastery.
- Percentages are descriptive and should be reviewed by educators in context.

## Application layer

- Data module: `src/lib/data/executive-function.ts`.
- Actions: `src/lib/actions/executive-function.ts`.
- Validation: `src/lib/validation/executive-function.ts`.
- Routes:
  - `/executive-function/[[...slug]]`
  - `/students/[studentId]/executive-function/[[...slug]]`
