# Database Schema Plan

## Purpose

Describe the planned multi-tenant data model domains, relationships, and database design principles for SLC Intelligence. This is a planning document only.

## Status

Status: Draft

Last updated: 2026-07-29

Owner: Product Owner

## Scope

This document now describes the implemented Phase 3-15 schema in `supabase/migrations/`.
No real student data is permitted in migrations, seed files, tests, or documentation.

## Implemented Tables

### Authentication, roles, tenancy, and audit

1. `app_roles`
2. `app_permissions`
3. `role_permissions`
4. `user_profiles`
5. `organizations`
6. `organization_memberships`
7. `organization_invitations`
8. `audit_events`

### Schools, programs, classrooms, and staff scope

1. `schools`
2. `programs`
3. `classrooms`
4. `school_staff_assignments`
5. `program_staff_assignments`
6. `classroom_staff_assignments`

### Student foundation

1. `students`
2. `student_enrollments`
3. `student_program_assignments`
4. `student_classroom_assignments`
5. `student_staff_assignments`
6. `student_status_history`

### IEP goals

1. `measurement_types`
2. `iep_cycles`
3. `iep_goals`
4. `iep_objectives`
5. `goal_baselines`
6. `goal_status_history`

### Progress monitoring

1. `prompt_level_definitions`
2. `intervention_phases`
3. `progress_monitoring_sessions`
4. `progress_data_points`
5. `progress_entry_status_history`

### Progress reporting

1. `progress_descriptor_options`
2. `reporting_periods`
3. `progress_reports`
4. `progress_report_goal_sections`
5. `progress_report_evidence_links`
6. `progress_report_status_history`
7. `progress_report_versions`
8. `report_exports`

### Behavior Detective and FBA support

1. `behavior_definitions`
2. `behavior_definition_examples`
3. `behavior_definition_nonexamples`
4. `replacement_behavior_definitions`
5. `intensity_scale_definitions`
6. `intensity_scale_levels`
7. `behavior_observation_sessions`
8. `abc_observations`
9. `frequency_observations`
10. `duration_observations`
11. `latency_observations`
12. `interval_observations`
13. `intensity_ratings`
14. `behavior_entry_status_history`
15. `behavior_observation_corrections`
16. `abc_category_options`
17. `abc_observation_category_assignments`
18. `organization_time_blocks`
19. `fba_evidence_workspaces`
20. `fba_evidence_links`
21. `fba_workspace_status_history`

### Intervention Intelligence

1. `intervention_library_items`
2. `intervention_plans`
3. `intervention_plan_versions`
4. `intervention_components`
5. `intervention_target_behaviors`
6. `intervention_replacement_behaviors`
7. `intervention_staff_assignments`
8. `intervention_schedules`
9. `fidelity_checklists`
10. `fidelity_checklist_items`
11. `fidelity_observations`
12. `fidelity_item_responses`
13. `intervention_dosage_logs`
14. `intervention_review_records`
15. `intervention_outcome_links`
16. `intervention_status_history`
17. `intervention_plan_phases`

### Accommodations and services

1. `accommodation_library_items`
2. `student_accommodations`
3. `student_accommodation_versions`
4. `accommodation_implementation_logs`
5. `accommodation_review_records`
6. `service_definitions`
7. `student_service_plans`
8. `student_service_plan_versions`
9. `service_plan_components`
10. `service_provider_assignments`
11. `service_schedules`
12. `service_delivery_logs`
13. `service_delivery_participants`
14. `service_delivery_status_history`
15. `service_cancellation_reasons`
16. `makeup_service_links`
17. `service_note_templates`
18. `service_review_records`
19. `service_exports`

### Family communication and meetings

1. `student_contacts`
2. `contact_preferences`
3. `communication_categories`
4. `communication_logs`
5. `communication_participants`
6. `communication_followups`
7. `communication_templates`
8. `communication_attachments`
9. `communication_status_history`
10. `meeting_types`
11. `meetings`
12. `meeting_participants`
13. `meeting_agenda_items`
14. `meeting_notes`
15. `meeting_decisions`
16. `meeting_action_items`
17. `meeting_acknowledgements`
18. `meeting_documents`
19. `meeting_status_history`
20. `meeting_versions`
21. `calendar_event_links`

### Executive function and classroom operations

1. `classroom_schedules`
2. `classroom_schedule_blocks`
3. `classroom_schedule_exceptions`
4. `student_schedules`
5. `student_schedule_blocks`
6. `classroom_routines`
7. `routine_steps`
8. `routine_assignments`
9. `routine_implementation_logs`
10. `task_analyses`
11. `task_analysis_steps`
12. `student_task_assignments`
13. `task_completion_logs`
14. `executive_function_skill_areas`
15. `student_executive_function_plans`
16. `executive_function_supports`
17. `executive_function_observations`
18. `ef_observation_status_history`
19. `student_checklists`
20. `student_checklist_items`
21. `student_checklist_responses`
22. `transition_supports`
23. `classroom_duty_assignments`
24. `student_support_assignments`
25. `staff_duty_assignments`
26. `daily_student_notes`
27. `classroom_announcements`
28. `reinforcement_systems`
29. `reinforcement_options`
30. `reinforcement_records`
31. `choice_boards`
32. `choice_board_items`

Every protected table is organization-scoped directly or through a parent record. Student names are
stored in protected rows only and are never used in application URLs.

## Multi-Tenant Hierarchy

Likely hierarchy:

Organization  
→ School  
→ Program  
→ Classroom or service team  
→ Student

Not every organization will use every level. The data model must support optional structures without weakening tenant isolation.

Every protected record must belong directly or indirectly to an organization.

## Core Domains

### Core tenancy and access

1. organizations
2. schools
3. programs
4. classrooms
5. teams
6. user_profiles
7. organization_memberships
8. school_assignments
9. program_assignments
10. classroom_assignments
11. student_staff_assignments
12. roles
13. permissions
14. role_permissions
15. invitations

### Student domain

1. students
2. student_enrollments
3. student_program_assignments
4. student_classroom_assignments
5. student_status_history
6. student_guardians or family contacts
7. student_alerts
8. student_tags, only if governed and appropriate

### IEP and goals domain

1. iep_cycles
2. iep_goals
3. goal_objectives
4. goal_measurement_definitions
5. goal_baselines
6. goal_data_points
7. goal_sessions
8. goal_intervention_phases
9. goal_status_history
10. progress_reporting_periods
11. progress_report_drafts
12. progress_report_finalizations
13. goal_attachments

### Behavior domain

1. behavior_definitions
2. replacement_behavior_definitions
3. behavior_events
4. behavior_abc_records
5. behavior_measurements
6. behavior_interventions
7. behavior_intervention_assignments
8. behavior_fidelity_records
9. behavior_plan_versions
10. fba_workspaces
11. behavior_safety_records, if authorized and carefully governed

### Intervention domain

1. interventions
2. intervention_assignments
3. intervention_sessions
4. intervention_fidelity_records
5. intervention_review_records
6. intervention_status_history

### Accommodations and services

1. accommodations
2. student_accommodations
3. accommodation_implementation_records
4. service_definitions
5. student_services
6. service_sessions
7. service_variances

### Communication and meetings

1. family_contacts
2. communication_templates
3. communication_follow_ups
4. meetings
5. meeting_participants
6. meeting_agenda_items
7. meeting_notes
8. meeting_tasks

### Files and reporting

1. attachments
2. report_definitions
3. generated_reports
4. export_events
5. report_snapshots

### Governance

1. audit_events
2. record_comments
3. notifications
4. tasks
5. feature_flags
6. organization_settings
7. retention_policies
8. consent or acknowledgment records where required

## Relationships

High-level relationship rules:

1. Organizations own schools, programs, settings, and memberships.
2. Students are organization-scoped and may have school, program, and classroom assignments.
3. Staff authorization flows through memberships and assignments, not a single global role.
4. Goals, behavior definitions, interventions, accommodations, and services attach to students within organization scope.
5. Data points and ABC records attach to definitions or goals and retain collector, timestamp, and status metadata.
6. Reports and exports reference source evidence and actor identity.
7. Audit events reference actor, organization, subject, action, and timestamp.

## Identifier Strategy

Planned approach:

1. Use opaque UUIDs as primary keys for application entities.
2. Do not expose sequential identifiers as the sole external reference for sensitive records.
3. Keep organization_id on protected tables directly or through enforced relational paths.
4. Prefer stable IDs that survive archival and status changes.

Final ID conventions will be confirmed when migrations begin.

## Organization Scoping

1. Every protected table must be tenant-isolatable.
2. Queries and policies must validate organization membership and assignment scope.
3. Cross-tenant joins must be impossible through ordinary application workflows.

## Status History

Important status changes should retain history rather than overwriting previous state without traceability.

Examples:

1. Goal status history
2. Student status history
3. Intervention status history
4. Report draft versus finalized transitions

## Soft Deletion

Protected educational records should generally use controlled archival or soft-deletion patterns rather than immediate hard deletion.

Deletion must eventually distinguish:

1. User correction
2. Soft deletion
3. Archival
4. Legal retention
5. Organization offboarding
6. Permanent deletion where authorized

## Audit Requirements

Significant actions must be auditable. Audit history should be tamper-resistant and not editable through ordinary application workflows.

See `AUDIT_AND_RETENTION.md`.

## Derived Data

Avoid storing derived analytics redundantly unless justified by:

1. Performance requirements
2. Auditability
3. Report snapshot immutability

When derived values are stored, record calculation method and timestamp.

## Time and Date Handling

Future implementation must use:

1. UTC for stored timestamps where appropriate
2. Organization or user timezone for display
3. Explicit date-only types for date-only educational fields
4. Clear handling of academic years
5. Clear handling of reporting periods

## Future Migration Rules

1. All database changes must be implemented through version-controlled migrations.
2. Do not make undocumented production schema changes through the Supabase dashboard.
3. Migrations must be reviewable, reversible where practical, and tested.
4. RLS policies are part of schema governance and must be migrated with tables.

## RLS Design Principles

1. Enable RLS for all exposed tables containing protected or tenant-specific data.
2. Do not create permissive placeholder policies such as `USING (true)` or `WITH CHECK (true)` for protected tables.
3. Policies must encode organization and assignment checks.
4. Do not use the Supabase service-role key in browser code.
5. Privileged operations must occur through secure server-side paths.

## Database Naming Conventions

Planned conventions:

1. snake_case table and column names
2. Plural table names for entity collections
3. `_id` suffix for foreign keys
4. `_at` suffix for timestamps
5. Clear status enums or constrained text values
6. Avoid ambiguous abbreviations

## Core Requirements

1. Organization-scoped multi-tenancy
2. Assignment-based authorization data
3. Raw evidence preservation for analytics source tables
4. Soft deletion and status history support
5. Version-controlled schema evolution

## Out of Scope

1. SQL DDL in Phase 0
2. Seed data execution
3. Generated database types
4. Production Supabase project configuration

## Open Questions

1. Should programs exist independently of schools, or always under a school?
2. Are classrooms and service teams one abstraction or separate entities?
3. How should historical enrollments be retained after school transfers?
4. What student identifiers are educationally necessary versus privacy-minimizing?
5. Should report snapshots store rendered documents, structured evidence packages, or both?

## Change History

| Date       | Change                | Author       |
| ---------- | --------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
