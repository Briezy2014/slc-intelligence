# Tenant Architecture

`organizations` are the tenant boundary. Schools, programs, classrooms, students, goals, progress
sessions, assignments, invitations, and audit events are scoped to an organization.

Tenant safeguards:

1. Server components and actions derive organization scope from active membership.
2. Client-supplied organization IDs are checked against membership before use.
3. RLS policies deny cross-organization access by default.
4. Student access is additionally constrained by student, school, program, classroom, or staff assignment scope.
5. URLs use UUIDs only; student names are never embedded in routes.
