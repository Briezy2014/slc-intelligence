# RLS Coverage Matrix

Status: Production launch review  
Last updated: 2026-07-29

## Summary

1. Tenant and student-bearing tables enable and force RLS.
2. Reference catalogs (`app_roles`, `app_permissions`, `role_permissions`, `measurement_types`) enable and force RLS with authenticated SELECT only after migration `202607290009`.
3. `progress_descriptor_options` allows authenticated SELECT with `USING (true)` because it is a non-tenant descriptor catalog; writes remain denied by absence of write policies except where explicitly granted elsewhere.
4. Application authorization is enforced in both database policies and server actions.

## Matrix conventions

- **Org**: organization membership required
- **Student**: student-read/edit helpers
- **Role**: permission or role restriction
- **Active**: inactive/archived memberships rejected through helpers

| Table group | RLS | SELECT | INSERT | UPDATE | DELETE/archive | Org | School/program/classroom | Student | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| organizations / memberships / invitations / audit | Yes | Scoped | Scoped | Scoped | Restricted | Yes | N/A | N/A | Audit immutable from clients |
| schools / programs / classrooms / staff assignments | Yes | Scoped | Manage perms | Manage perms | Archive/manage | Yes | Scope helpers | N/A | |
| students / enrollments / assignments | Yes | Student helpers | Create/edit perms | Edit perms | Archive perms | Yes | Enrollment/assignment | Yes | |
| IEP cycles / goals / progress | Yes | Goal/progress helpers | Enter/manage | Finalize rules | History preserved | Yes | Via student | Yes | |
| reporting / behavior / intervention | Yes | Module helpers | Module perms | Finalize rules | Corrections retained | Yes | Via student | Yes | |
| accommodations / services | Yes | Module helpers | Module perms | Finalize rules | History retained | Yes | Via student | Yes | |
| family / meetings | Yes | Module helpers | Module perms | Finalize rules | Visibility rules | Yes | Via student | Yes | Internal communication permission |
| executive function / classroom ops | Yes | Module helpers | Module perms | Finalize rules | Classroom scope | Yes | Classroom | Student where applicable | |
| administrative privacy / export events | Yes | Admin read/audit | Export insert | Org manage for privacy | No client delete for exports | Yes | Filter only | No expansion | Suppression in app layer |
| reference catalogs | Yes | Authenticated | None | None | None | N/A | N/A | N/A | Migration 009 |

## Verification

`npm run test:rls` exercises cross-org, student, role, report, behavior, intervention, accommodation/service, communication/meeting, classroom operations, and administrative intelligence controls.
