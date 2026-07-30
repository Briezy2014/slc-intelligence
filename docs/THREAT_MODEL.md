# Threat Model

Status: Completed for production launch review  
Last updated: 2026-07-29

This threat model covers finished-product risks for SLC Intelligence. It does not claim residual risk is zero.

| Threat                        | Risk     | Existing mitigation                                             | Verification                      | Remaining risk                            | Follow-up                         |
| ----------------------------- | -------- | --------------------------------------------------------------- | --------------------------------- | ----------------------------------------- | --------------------------------- |
| Cross-organization access     | Critical | RLS + membership helpers + server permission checks             | RLS suite, tenant isolation tests | Misconfigured production env              | Continuous RLS regression         |
| Cross-school access           | High     | School-scope helpers and assignments                            | Role/scope tests                  | Broad org-admin visibility is intentional | Document admin scope expectations |
| Cross-classroom access        | High     | Classroom assignment helpers                                    | Classroom isolation tests         | Admin roles may see broader scopes        | Keep drill-down auth rechecks     |
| Cross-student access          | Critical | `can_read_student` and related helpers                          | Student authorization tests       | Complex assignment edge cases             | Expand matrix as roles evolve     |
| Privilege escalation          | Critical | Role changes require manage permissions; self-promotion blocked | RLS membership tests              | Compromised admin account                 | MFA guidance for admins           |
| Role manipulation             | Critical | Membership update policies                                      | Specialist self-promote blocked   | Service-role misuse outside app           | Never expose service-role         |
| ID manipulation               | High     | Server membership org ID used, not trusted client org alone     | Action context + RLS              | Client can probe IDs                      | Keep opaque errors                |
| Service-role misuse           | Critical | App does not use service-role key                               | Secret scan, env review           | Operator misuse in console                | Operational controls              |
| Exposed environment variables | Critical | `.gitignore`, env schemas, no secrets in `NEXT_PUBLIC_*`        | Secret scan                       | Human misconfiguration in Vercel          | Deployment checklist              |
| Public exports                | High     | Auth + export permissions + audit events                        | Export tests/actions              | Browser download after auth               | Keep short-lived blob URLs        |
| Storage leakage               | Medium   | Storage policies where buckets exist                            | Storage policy review             | Future bucket misconfig                   | Review before enabling uploads    |
| Cache leakage                 | Medium   | Protected routes dynamic; no public student static output       | robots/sitemap disallow           | CDN misconfig                             | Keep protected routes dynamic     |
| Log leakage                   | High     | Safe operational logger redacts JWTs/secrets                    | Code review                       | Verbose third-party tooling               | Ban student narrative in logs     |
| Invitation abuse              | Medium   | Invitation permissions + expiry model                           | Invitation flow tests             | Email compromise                          | Rate-limit guidance               |
| Password-reset abuse          | Medium   | Supabase Auth reset flow + safe redirects                       | Auth tests                        | Email flooding                            | Provider rate limits              |
| Session theft                 | High     | Secure cookies via Supabase SSR                                 | Session tests                     | XSS or device theft                       | Security headers + XSS hygiene    |
| Unsafe redirects              | High     | Relative same-origin redirect checks in middleware              | Middleware review                 | Future open-redirect regressions          | Keep allowlist logic              |
| Malicious uploads             | Medium   | Upload validation where implemented                             | Validation review                 | Future file types                         | Virus scanning backlog            |
| Small-group re-identification | High     | Suppression threshold + export suppression                      | Suppression unit tests            | Subtraction inference                     | Additional noise controls later   |
| Staff-data misuse             | Medium   | Neutral admin language; no rankings                             | Admin principles review           | Misinterpretation by users                | Training docs                     |
| Audit-log tampering           | High     | Append-oriented audit policies                                  | RLS audit immutability tests      | Privileged DB access                      | Backup + least privilege          |
| Archived-membership access    | High     | Active membership checks                                        | Inactive membership tests         | Stale client sessions                     | Session refresh + denial          |
| Production-data leakage       | Critical | Separate prod project requirement; fictional seeds              | Deployment checklist              | Human error sharing dumps                 | Access controls                   |
| Demonstration-data confusion  | Medium   | Fictional labeling guidance                                     | Seed docs                         | Users mistaking demo for real             | Clear org naming                  |
| Backup exposure               | High     | Supabase backup review required                                 | Ops checklist                     | Unencrypted exports                       | Encrypt offsite copies            |

## Stop conditions

Do not deploy if cross-organization isolation, student isolation, RLS verification, secret exposure, or authentication fundamentals fail.
