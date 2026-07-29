# Migration Strategy

Migrations live under `supabase/migrations/` and are ordered by phase.

Current sequence:

1. Auth helpers and extensions.
2. Roles, permissions, and profiles.
3. Organizations, memberships, invitations, and audit.
4. Schools, programs, classrooms, and staff assignments.
5. Students and student assignments.
6. IEP cycles, goals, objectives, and baselines.
7. Progress monitoring sessions and data points.

Local development may use seeded fictional data. Remote Supabase environments must apply migrations
through the approved Supabase workflow and must not use service-role keys in application code.
