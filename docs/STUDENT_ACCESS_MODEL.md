# Student Access Model

Student access is not organization-wide by default. A user must have `student.read` and one of:

1. An administrative role with organization-level student scope.
2. A direct `student_staff_assignments` row.
3. Scope through active school enrollment and school assignment.
4. Scope through active program assignment and program assignment.
5. Scope through active classroom assignment and classroom assignment.

Editing requires `student.edit`, readable student scope, and a role that is not read-only or
paraprofessional. Archiving requires `student.archive`. Student names are protected data and are not
used in URLs.
