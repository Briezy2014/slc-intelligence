# RLS Strategy

All protected tables in Phases 3-15 enable and force row level security.

Policy pattern:

1. Organization tables use `is_org_member` and `has_org_permission`.
2. School/program/classroom tables combine organization membership with assignment scope helpers.
3. Student tables use `can_read_student` and `can_edit_student`.
4. IEP goal tables require student readability plus `goal.read` or `goal.manage`.
5. Progress tables require student readability plus `progress.read`, `progress.enter`, or `progress.finalize`.
6. Progress report tables require `report.*` permissions and student readability through `can_read_report`, `can_draft_report`, `can_review_report`, and `can_finalize_report`.
7. Behavior tables require `behavior.*` permissions and student readability through `can_read_behavior`, `can_define_behavior`, `can_observe_behavior`, and `can_finalize_behavior`.
8. FBA support tables require `fba.*` permissions or behavior read scope through `can_read_fba` and `can_manage_fba`.
9. Intervention tables require `intervention.*` permissions and student readability through `can_read_intervention`, `can_manage_intervention_plan`, `can_activate_intervention`, `can_enter_fidelity`, and `can_finalize_fidelity`.
10. Accommodation and service tables require `accommodation.*` / `service.*` permissions plus student readability through `can_read_accommodation`, `can_manage_accommodation`, `can_implement_accommodation`, `can_read_service`, `can_manage_service_plan`, `can_activate_service_plan`, `can_enter_service_log`, and `can_finalize_service_log`.
11. Contact and communication tables require `contact.*` / `communication.*` permissions plus student readability; internal and restricted communication reads require `communication.internal.read`.
12. Meeting tables require `meeting.*` permissions plus student readability; external participants are data rows only and do not create auth users.
13. Executive-function and classroom-operations tables require `ef.*`, `checklist.*`, `classroom.*`, `daily_note.*`, `routine.manage`, `staff.duty.assign`, `reinforcement.manage`, or `announcement.manage` helpers as applicable.
14. Audit events are append-only for normal roles and readable only through `org.audit.read`.

RLS tests include cross-organization isolation and restricted-role mutation checks for reports,
behavior/FBA, intervention rows, accommodations/services, contacts/communications, meetings, and classroom operations.
Additional positive cases should be added as workflows mature.
