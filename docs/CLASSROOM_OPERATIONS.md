# Classroom Operations

Classroom operations surfaces for schedules, routines, daily notes, announcements, and the Daily Command Center.

## Scope

- Classroom schedules and schedule blocks
- Daily student notes (coded students during pilot)
- Classroom routines
- Classroom announcements (no student PII)
- Daily Command Center route for today-focused work
- One-click **pilot demo setup** (school, classroom, S1/S2, sample schedule)

## Guardrails

- Reinforcement records must not be used for punitive ranking or deprivation of basic needs.
- Classroom announcements are guarded against student PII and should stay classroom-level.
- Daily notes remain student-scoped records.
- During the pilot, use coded students (**S1**, **S2**) only — never real student or family PII.

## How to model for district administration

1. Open **Classroom Operations** or **Daily Command Center**.
2. Click **Set up demo classroom (S1 + S2)**.
3. Review the sample weekday schedule blocks.
4. Add daily notes for S1/S2, routines, and staff announcements as needed.
5. Use the Schedules / Notes / Routines / Announcements tabs to focus each workflow.

## Application layer

- Workspace UI: `src/components/domain/classroom-operations-workspace.tsx`
- Data module: `src/lib/data/classroom-operations.ts`
- Actions: `src/lib/actions/classroom-operations.ts`
- Demo setup: `src/lib/actions/pilot-demo-setup.ts`
- Validation: `src/lib/validation/classroom-operations.ts`
- Routes:
  - `/classroom-operations`
  - `/classroom-operations/daily`
  - `/classroom-operations/schedules`
  - `/classroom-operations/notes`
  - `/classroom-operations/routines`
  - `/classroom-operations/announcements`
  - `/classrooms/[classroomId]/schedule`
