# Seed Data

Seed data is fictional and for local development only. No real student data, real staff data, real
family contacts, or real credentials may be committed.

All seed organizations, people, and students are clearly synthetic.

## Organizations (fictional)

| Name                                          | Slug                    |
| --------------------------------------------- | ----------------------- |
| Northwind Learning Collective (FICTIONAL)     | `northwind-fictional`   |
| Southbridge Education Cooperative (FICTIONAL) | `southbridge-fictional` |

## Fictional test user matrix

These emails appear in `supabase/seed/01_fictional_dev_seed.sql` for local PostgreSQL RLS testing.
They are not production accounts.

| Email                               | Role / purpose               | Organization            |
| ----------------------------------- | ---------------------------- | ----------------------- |
| `org.admin.north@example.test`      | Organization administrator   | Northwind               |
| `building.admin.north@example.test` | Building administrator       | Northwind               |
| `specialist.north@example.test`     | Intervention specialist      | Northwind               |
| `para.north@example.test`           | Paraprofessional             | Northwind               |
| `readonly.north@example.test`       | Read-only reviewer           | Northwind               |
| `org.admin.south@example.test`      | Organization administrator   | Southbridge             |
| `specialist.south@example.test`     | Intervention specialist      | Southbridge             |
| `dual.membership@example.test`      | Dual-org membership          | Northwind + Southbridge |
| `inactive.user@example.test`        | Inactive membership          | Northwind (inactive)    |
| `no.membership@example.test`        | Authenticated, no membership | None                    |

No passwords are committed. Passwords must be created in the Supabase Auth Dashboard (or local
Supabase Auth workflow) before browser sign-in works. Local `auth.users` rows used by
`npm run db:reset` exist only for JWT-claim RLS simulation and are not a substitute for Supabase Auth.

## Reset process

```bash
npm run db:reset
```

This drops local `public` and `auth` schemas, reapplies migrations, and reseeds fictional data.

## Phase 9-12 fictional rows

`supabase/seed/02_fictional_phase9_12_seed.sql` adds synthetic-only rows for:

1. Reporting periods, progress reports, report sections, evidence links, versions, and export logs.
2. Behavior definitions, observation sessions, ABC/frequency/duration rows, category assignments, time blocks, and FBA evidence workspaces.
3. Intervention library items, plans, components, schedules, fidelity checklists/responses, dosage logs, reviews, outcome links, and plan phases.

These rows are used by `npm run test:rls` for cross-organization isolation and restricted-role mutation checks.

## Phase 13-15 fictional rows

`supabase/seed/03_fictional_phase13_15_seed.sql` adds synthetic-only rows for:

1. Accommodation library items, student accommodations, implementation logs, and reviews.
2. Service definitions, service plans, components, schedules, delivery logs, group participants, makeup links, reviews, and export records.
3. Student contacts, contact preferences, communication categories/logs/follow-ups/templates, and family-visible/internal examples.
4. Meeting types, meetings, participants including external participants, notes, action items, acknowledgements, documents, and versions.
5. Classroom schedules, routines, task analyses, executive-function plans/supports/observations, checklists/responses, daily notes, announcements, reinforcement systems, and choice boards.

These rows remain fictional and support Phase 13-15 RLS isolation tests.
