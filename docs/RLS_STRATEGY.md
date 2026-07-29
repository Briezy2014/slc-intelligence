# RLS Strategy

All protected tables in Phases 3-8 enable and force row level security.

Policy pattern:

1. Organization tables use `is_org_member` and `has_org_permission`.
2. School/program/classroom tables combine organization membership with assignment scope helpers.
3. Student tables use `can_read_student` and `can_edit_student`.
4. IEP goal tables require student readability plus `goal.read` or `goal.manage`.
5. Progress tables require student readability plus `progress.read`, `progress.enter`, or `progress.finalize`.
6. Audit events are append-only for normal roles and readable only through `org.audit.read`.

RLS tests should be expanded before production use to cover positive and negative cases for each role.
