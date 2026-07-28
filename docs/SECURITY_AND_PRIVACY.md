# Security and Privacy

## Purpose

Define security, privacy, tenant isolation, secret management, logging, export, retention, and production-readiness requirements for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

This document governs security architecture and privacy-conscious development practices. It does not assert legal certification.

## Prohibited Claims

Do not claim that the product is FERPA-certified, FERPA-compliant, HIPAA-compliant, COPPA-certified, SOC 2 certified, or legally certified unless a qualified legal and compliance process establishes that claim.

Preferred language:

- Designed to support privacy-conscious educational workflows.
- Designed with role-based access, tenant isolation, and auditability.

## Fictional-Data-Only Development

Only fictional data may be used during development and demonstrations unless the product owner later establishes an approved controlled pilot process.

Never place real student information in:

1. Cursor prompts
2. GitHub
3. Source code
4. Seed files
5. Screenshots
6. Test fixtures
7. Error logs
8. Analytics services
9. Public demos
10. Unapproved AI systems

## Secret Management

Never commit or display:

1. Supabase database passwords
2. Supabase service-role keys
3. Private API keys
4. Authentication secrets
5. Vercel secrets
6. Production credentials
7. Personal access tokens
8. Private signing keys
9. Encryption keys
10. Student records

Use environment-variable placeholders only.

Future local environment files must be excluded through `.gitignore`.

Create `.env.example` only when the application phase requires it. It must contain variable names and safe descriptions, never real values.

Do not use the Supabase service-role key in browser code.

## Row Level Security (RLS)

1. RLS must be enabled for all exposed tables containing protected or tenant-specific data.
2. Do not create permissive placeholder policies such as `USING (true)` or `WITH CHECK (true)` for protected tables.
3. Policies must enforce organization and assignment scope.
4. RLS tests are required before protected tables are considered production-ready.

## Implemented Phase 3-8 RLS Summary

Implemented migrations enable and force RLS for organization, membership, invitation, audit,
school/program/classroom, staff assignment, student, IEP goal, and progress-monitoring tables.

Primary helper functions:

1. `is_org_member(p_org_id)` verifies active membership in an active organization.
2. `has_org_permission(p_org_id, p_permission)` checks role grants through `role_permissions`.
3. `member_role(p_org_id)` returns the active organization role.
4. `has_school_scope`, `has_program_scope`, and `has_classroom_scope` enforce assignment scope.
5. `can_read_student`, `can_edit_student`, `can_manage_goal`, `can_enter_progress`, and
   `can_finalize_progress` enforce student-level access.

Application data modules also verify authenticated user and active organization membership before
querying. When Supabase is not configured, protected pages show a development/configuration notice
and no fake user or fake student data is produced. Server actions validate input with Zod, check
permissions, write audit events, and return safe generic errors instead of SQL or internal details.

## Tenant Isolation

1. Every protected record belongs directly or indirectly to an organization.
2. Cross-tenant access must be denied by default.
3. Authorization is membership- and assignment-based.
4. Client-side filtering is never sufficient security.

## Least Privilege

1. Default deny for protected educational records.
2. Separate authentication from authorization.
3. Minimize Platform Owner access to student data.
4. Treat export, finalization, permission changes, and bulk operations as privileged.

## Secure Storage

Future uploads must include:

1. Allowed file-type restrictions
2. Size limits
3. Organization-scoped storage paths
4. Secure filenames
5. Authorization policies
6. Virus or malware scanning strategy before production
7. Retention rules
8. Download logging where appropriate
9. Accessible file descriptions
10. Prohibition against public storage buckets for student records

## Logging Limitations

Do not log student information unnecessarily.

Logs must avoid:

1. Full student records
2. Access tokens
3. Passwords
4. Session cookies
5. Service keys
6. Sensitive narrative notes

## Export Controls

Exports must be permission-controlled, logged, scoped, and clearly labeled.

Users must not be able to export records beyond their authorized organizational and student scope.

## Auditability

Significant actions must generate audit events. Audit history should be tamper-resistant and not editable through ordinary application workflows.

See `AUDIT_AND_RETENTION.md`.

## Retention

The platform must eventually support configurable retention, archival, and deletion policies.

Deletion must distinguish:

1. User correction
2. Soft deletion
3. Archival
4. Legal retention
5. Organization offboarding
6. Permanent deletion where authorized

## Incident-Response Planning

Future production readiness requires documented procedures for:

1. Suspected unauthorized access
2. Credential exposure
3. Misconfigured storage or RLS
4. Accidental inclusion of real student data in non-approved environments
5. Communication and containment steps
6. Post-incident review

Detailed runbooks are deferred until hardening phases, but planning is required before launch.

## Backup and Restoration Planning

Future requirements:

1. Regular backups for database and critical storage
2. Tested restoration procedures
3. Clear recovery-point and recovery-time objectives to be approved later
4. Verification that restored data retain access controls

## Third-Party Service Review

Before adopting a third-party service that may process educational or authentication data:

1. Document the purpose
2. Document data shared
3. Review security and privacy posture
4. Confirm contractual and organizational approval
5. Prohibit unapproved AI providers from receiving student records

## Threat-Modeling Requirements

Threat modeling is required before production launch and should consider at least:

1. Cross-tenant data leakage
2. Privilege escalation through membership misuse
3. Export abuse
4. Insecure direct object references
5. Storage path guessing
6. Session hijacking
7. Insider threat and support-access misuse
8. Injection and unsafe query patterns
9. Dependency vulnerabilities
10. Misconfigured RLS policies

## Production-Readiness Requirements

Before production use with real educational data:

1. RLS audit completed
2. Permission audit completed
3. Secret management verified
4. Backup and restore tested
5. Incident-response procedures drafted
6. Accessibility and security hardening reviewed
7. Product-owner authorization for controlled pilot or launch
8. No real student data in development repositories or fixtures

## Core Requirements

1. Privacy by design
2. Tenant isolation
3. Server-side and RLS enforcement
4. Fictional data in development
5. No compliance certification claims without legal process

## Out of Scope

1. Final legal policy text
2. Production credential provisioning in Phase 0
3. Live penetration testing in Phase 0
4. Domain configuration in Phase 0

## Open Questions

1. What retention defaults apply for inactive organizations?
2. Will a formal SOC 2 or equivalent process be pursued, and when?
3. What breach-notification obligations apply for target customer contracts?
4. Which support operations justify audited Platform Owner access to tenant metadata versus student content?
5. What malware-scanning provider is approved for uploads?

## Change History

| Date       | Change                | Author       |
| ---------- | --------------------- | ------------ |
| 2026-07-28 | Initial Phase 0 draft | Cursor Agent |
