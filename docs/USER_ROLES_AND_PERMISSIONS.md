# User Roles and Permissions

## Purpose

Define initial role concepts, scope types, least-privilege principles, assignment-based authorization, and unresolved permission questions for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-29

Owner: Product Owner

## Scope

This document describes the implemented role and permission model used by Phase 3-15 migrations,
RLS helpers, and application permission checks. Role names alone are never sufficient
authorization; active organization membership and assignment scope are also required.

## Implemented Permission Codes

| Permission | Purpose |
| --- | --- |
| `org.manage` | Manage organization settings |
| `org.members.manage` | Manage memberships and invitations |
| `org.audit.read` | Read audit events |
| `school.manage` | Create/update schools |
| `program.manage` | Create/update programs |
| `classroom.manage` | Create/update classrooms |
| `staff.assign` | Manage school/program/classroom/student staff assignments |
| `student.create` | Create student records |
| `student.edit` | Edit authorized student records and assignments |
| `student.archive` | Archive/restore students |
| `student.read` | Read authorized students |
| `iep.manage` | Manage IEP cycles |
| `goal.manage` | Manage goals/objectives/baselines |
| `goal.read` | Read goals for authorized students |
| `progress.enter` | Enter progress sessions/data points |
| `progress.finalize` | Finalize progress sessions |
| `progress.read` | Read progress sessions/data points |
| `analytics.read` | Read calculated analytics summaries |
| `report.period.manage` | Manage reporting periods |
| `report.draft` | Create and edit draft progress reports |
| `report.review` | Review submitted progress reports |
| `report.finalize` | Finalize and correct progress reports |
| `report.read` | Read authorized progress reports |
| `report.export` | Record report print/PDF exports |
| `behavior.define` | Create and edit behavior definitions |
| `behavior.observe` | Enter behavior observations |
| `behavior.finalize` | Finalize and correct behavior observations |
| `behavior.read` | Read behavior data |
| `behavior.configure` | Configure behavior categories/scales |
| `fba.manage` | Manage FBA evidence workspaces |
| `fba.read` | Read FBA evidence workspaces |
| `intervention.library.manage` | Manage intervention library |
| `intervention.plan.manage` | Manage intervention plans |
| `intervention.plan.activate` | Activate, pause, complete, discontinue, or archive plans |
| `intervention.fidelity.enter` | Enter fidelity observations |
| `intervention.fidelity.finalize` | Finalize fidelity observations |
| `intervention.dosage.enter` | Enter dosage logs |
| `intervention.review` | Record intervention reviews |
| `intervention.read` | Read intervention data |
| `accommodation.library.manage` | Manage accommodation library items |
| `accommodation.manage` | Create and edit student accommodations |
| `accommodation.implement` | Record accommodation implementation activity |
| `accommodation.read` | Read authorized accommodation records |
| `service.definition.manage` | Manage service definitions |
| `service.plan.manage` | Create and edit student service plans |
| `service.plan.activate` | Activate, end, and archive service plans |
| `service.log.enter` | Enter service delivery logs |
| `service.log.finalize` | Finalize or correct service delivery logs |
| `service.read` | Read authorized service records |
| `service.export` | Record service exports |
| `contact.manage` | Manage student contacts |
| `contact.read` | Read student contacts |
| `communication.enter` | Enter communication logs |
| `communication.finalize` | Finalize communication logs |
| `communication.read` | Read authorized communication logs |
| `communication.template.manage` | Manage communication templates |
| `communication.internal.read` | Read internal/restricted communications |
| `meeting.manage` | Manage meetings |
| `meeting.finalize` | Finalize meeting records |
| `meeting.read` | Read authorized meetings |
| `meeting.type.manage` | Manage meeting types |
| `classroom.schedule.manage` | Manage classroom and student schedules |
| `classroom.operations.read` | Read classroom operations records |
| `routine.manage` | Manage classroom routines |
| `task_analysis.manage` | Manage task analyses |
| `ef.plan.manage` | Manage executive-function plans |
| `ef.observe` | Record executive-function observations |
| `ef.read` | Read executive-function support records |
| `checklist.manage` | Manage checklists |
| `checklist.respond` | Record checklist responses |
| `staff.duty.assign` | Assign staff duties |
| `daily_note.enter` | Enter daily student notes |
| `daily_note.finalize` | Finalize daily student notes |
| `daily_note.read` | Read daily student notes |
| `reinforcement.manage` | Manage reinforcement systems |
| `announcement.manage` | Manage classroom announcements |

## Implemented Role Matrix

| Role | Permissions |
| --- | --- |
| `organization_admin` | All implemented permissions |
| `district_sped_admin` | Broad school/program/classroom/staff, student, IEP/goal, progress, reporting, behavior, FBA, intervention, accommodation/service, communication/meeting, EF/classroom operations, analytics, and audit |
| `building_admin` | Building-scoped student access plus reporting review/read, behavior observe/read, FBA manage/read, intervention read controls, contact/communication/meeting, and classroom operations |
| `program_admin` | Program-scoped student access plus reporting, behavior, FBA, intervention, progress, accommodations/services, communication/meetings, EF/classroom operations, and analytics |
| `intervention_specialist` | Student read, IEP/goal, progress, reporting finalize/read/draft, behavior/FBA, intervention, accommodations/services, communication/meetings, EF supports, and daily notes |
| `special_education_teacher` | Student read, progress/report/behavior/intervention read-entry permissions plus accommodations, service log entry, communication entry, classroom operations, EF observation, checklists, daily notes, and announcements |
| `related_service_provider` | Student read, progress/report/behavior/intervention read-entry permissions plus service plan/log permissions, communication entry, EF observation, checklist response, and daily notes |
| `school_psychologist` | Student read, goal/progress/analytics, report review/read, behavior define/observe/finalize/read, FBA read, intervention review/read, internal communication, and meeting management |
| `case_manager` | Student read, IEP/goal, progress, reporting finalize/read/draft, behavior/FBA, intervention, accommodations/services, communication/meetings, EF supports, checklists, and daily notes |
| `paraprofessional` | Student read, goal/progress entry/read, behavior observe/read, intervention evidence entry/read, accommodation implementation/read, service log entry/read, communication entry/read, classroom operations read, EF observe/read, checklist response, and daily note entry/read |
| `read_only_reviewer` | Student/goal/progress/analytics/report/behavior/FBA/intervention/accommodation/service/contact/communication/meeting/classroom/EF/daily-note read |
| `platform_admin` | Reserved; no blanket student access in the app matrix |

## Core Authorization Principle

Authentication answers: Who is the user?

Authorization answers: What is this user allowed to access or change in this organization, school, program, classroom, or student record?

A user may have different roles in different organizations or schools. Do not store one global role on the user profile as the only authorization mechanism.

Use membership and assignment records to represent authorization.

## Roles

### Platform Owner

Internal product-level role.

Possible responsibilities:

1. Platform configuration
2. Organization provisioning
3. Subscription administration
4. Support operations
5. Security investigation
6. Feature flags
7. System monitoring

Platform Owner access to student data must be minimized, justified, and auditable.

### Organization Administrator

District or organization-level administrator.

Possible scope:

1. Organization configuration
2. School management
3. User invitations
4. Role assignments
5. Program configuration
6. Organization-level reports
7. Retention settings
8. Export controls
9. Integration settings

### Special Education Administrator

May access authorized district, building, program, or caseload-level special education information according to assignment.

### Building Administrator

Access limited to assigned buildings and authorized students or aggregate reports.

### Intervention Specialist

Primary instructional role.

Likely capabilities:

1. View assigned students
2. Manage authorized goals
3. Collect progress data
4. Record behavior data
5. Manage interventions
6. Document accommodations
7. Generate progress summaries
8. Communicate with families
9. Coordinate classroom staff
10. Prepare meeting materials

### Teacher or Classroom Staff

Capabilities depend on assignment and permission.

### Paraprofessional

Must have carefully limited permissions.

Potential capabilities:

1. View assigned students
2. View specific data-collection instructions
3. Enter assigned observations
4. Record implementation data
5. View immediate classroom supports

Potential restrictions:

1. No organization-wide reports
2. No permission management
3. No unrestricted IEP document access
4. No finalizing progress reports
5. No exports unless expressly authorized
6. No access to unrelated students

### Related Service Provider

Access must be limited to assigned students, services, goals, and records.

### Read-Only Reviewer

May view specifically authorized information without editing.

### Parent and Student

Deferred from initial release. Do not build parent or student portals unless a later phase authorizes them.

## Scope Types

Access decisions must consider:

1. User role
2. Organization membership
3. School assignment
4. Program assignment
5. Classroom assignment
6. Student assignment
7. Service-provider relationship
8. Record ownership where appropriate
9. Explicit administrative scope
10. Record status
11. Export permissions

## Least-Privilege Principles

1. Default deny for protected educational records.
2. Grant the minimum scope required for the assigned educational or administrative task.
3. Separate view, create, update, finalize, export, and administer capabilities where practical.
4. Prefer assignment-based student access over organization-wide student lists for instructional roles.
5. Treat export and finalization as privileged actions.
6. Minimize Platform Owner access to student content.

## Organization Membership

Membership establishes that a user belongs to an organization. Membership alone does not grant unrestricted access to all students or all records in that organization.

## School Assignment

Building-scoped roles should be constrained to assigned schools unless a broader administrative scope is explicitly granted and audited.

## Program Assignment

Program-level access may allow authorized views of students and aggregates within an assigned program without granting unrelated school or organization access.

## Classroom Assignment

Classroom staff access should generally be limited to students and tasks associated with the assigned classroom or team.

## Student Assignment

Student-staff assignments are a primary authorization mechanism for instructional and related-service workflows.

## Export Permissions

Exports must be:

1. Explicitly authorized
2. Scoped to the user's allowed records
3. Logged
4. Clearly labeled
5. Restricted for paraprofessional and other limited roles by default

## Finalization Permissions

Finalizing progress reports, parent-facing summaries, or other formal documents should be limited to roles approved by the organization and product rules.

Draft creation and finalization must be distinguishable permissions.

## Administrative Permissions

Administrative permissions may include invitations, role assignment, retention configuration, organization settings, and organization-level reporting.

Administrative analytics must not become an employee-surveillance tool or simplistic teacher-performance score.

## Paraprofessional Restrictions

Paraprofessional accounts require carefully limited permissions as listed above. Product design must make over-permissioning difficult.

## Related-Service-Provider Scope

Related service providers should see only assigned students and the services, goals, and documentation relevant to their assignment.

## Permission-Matrix Template

Use the following template in later phases. Values are illustrative placeholders only and are not approved grants.

| Capability                   | Platform Owner | Org Admin | SpEd Admin | Building Admin | Intervention Specialist | Classroom Staff | Paraprofessional | Related Service | Read-Only |
| ---------------------------- | -------------- | --------- | ---------- | -------------- | ----------------------- | --------------- | ---------------- | --------------- | --------- |
| Manage organization settings | Limited        | Yes       | No         | No             | No                      | No              | No               | No              | No        |
| Invite users                 | Limited        | Yes       | TBD        | TBD            | No                      | No              | No               | No              | No        |
| View assigned students       | Minimized      | Scoped    | Scoped     | Scoped         | Yes                     | Scoped          | Scoped           | Scoped          | Scoped    |
| Enter progress data          | No             | No        | TBD        | No             | Yes                     | TBD             | Assigned only    | Assigned goals  | No        |
| Finalize progress reports    | No             | TBD       | TBD        | TBD            | TBD                     | No              | No               | TBD             | No        |
| Enter ABC data               | No             | No        | TBD        | No             | Yes                     | TBD             | Assigned only    | TBD             | No        |
| Export student reports       | Audited only   | Scoped    | Scoped     | Scoped         | Scoped                  | TBD             | No by default    | Scoped          | No        |
| Manage roles                 | Limited        | Yes       | TBD        | TBD            | No                      | No              | No               | No              | No        |

TBD cells require product-owner decisions before enforcement.

## Server-Side Enforcement

Do not rely on hidden buttons, disabled controls, route guards, or client-side filtering for security.

Authorization must eventually be enforced through:

1. PostgreSQL Row Level Security
2. Secure server-side operations
3. Database constraints
4. Validated organization and assignment relationships
5. Storage access policies

## Core Requirements

1. Membership- and assignment-based authorization
2. Least privilege by default
3. Distinct export and finalization controls
4. Auditable administrative access
5. Deferred parent and student portal access

## Out of Scope

1. Final complete permission matrix values
2. Runtime policy SQL
3. Parent and student portal permissions
4. Impersonation workflows, unless later approved with strict audit controls

## Open Questions

1. Can a user hold multiple roles in the same organization simultaneously?
2. Which roles may finalize progress reports by default?
3. May Building Administrators view identifiable student behavior details or only aggregates?
4. How are substitute teachers and temporary staff authorized and time-bounded?
5. What emergency break-glass access, if any, is allowed for Platform Owner support?
6. How are cross-school programs authorized when students span multiple buildings?

## Change History

| Date       | Change                | Author       |
| ---------- | --------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
