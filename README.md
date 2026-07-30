# SLC Intelligence

The Intelligence Platform for Specialized Learning Classrooms

## Product Summary

SLC Intelligence is a special education operations, progress-monitoring, behavior analytics, documentation, communication, and decision-support platform for Specialized Learning Classrooms, intervention specialists, special education teachers, paraprofessionals, related service providers, building administrators, special education administrators, district-level special education programs, school districts, and educational organizations.

Primary dashboard: Command Center  
Production domain: SLCintelligence.com  
Canonical URL: https://slcintelligence.com

## Current Development Status

**Phases 0–18 completed for finished-product launch. Post-launch testing in progress.**

| Phase                                                                     | Status    |
| ------------------------------------------------------------------------- | --------- |
| Phase 0: Foundation and Governance                                        | Completed |
| Phase 1: Application Scaffold                                             | Completed |
| Phase 2: Design System and Public Shell                                   | Completed |
| Phase 3: Authentication and Tenant Foundation                             | Completed |
| Phase 4: Schools, Programs, Classrooms, Staff                             | Completed |
| Phase 5: Student Foundation                                               | Completed |
| Phase 6: IEP Goal Foundation                                              | Completed |
| Phase 7: Progress Monitoring                                              | Completed |
| Phase 8: IEP Analytics                                                    | Completed |
| Phase 9: Progress Reporting                                               | Completed |
| Phase 10: Behavior Detective Foundation                                   | Completed |
| Phase 11: Behavior Analytics and FBA Support                              | Completed |
| Phase 12: Intervention Intelligence                                       | Completed |
| Phase 13: Accommodations and Service Documentation                        | Completed |
| Phase 14: Family Communication and Meeting Center                         | Completed |
| Phase 15: Executive Function and Classroom Operations                     | Completed |
| Phase 16: Administrative Intelligence                                     | Completed |
| Phase 17: Security, Accessibility, Reliability, and Performance Hardening | Completed |
| Phase 18: Production Deployment and Finished Product Launch               | Completed |

Production Deployment: Completed (application package and deployment configuration)  
Post-Launch Testing: In progress  
Future Development: Pending product-owner authorization

Do not use real student data. Demonstration and seed records are fictional only.

## Local development

```bash
npm install
cp .env.example .env.local
npm run db:reset
npm run dev
```

Scripts:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:rls`
- `npm run test:e2e`
- `npm run format:check`
- `npm run build`
- `npm run db:migrate`
- `npm run db:reset`

Never add service-role keys or real secrets to the repository or `NEXT_PUBLIC_*` variables.

## Application routes

Public: `/`, `/about`, `/privacy`, `/terms`, `/accessibility`, `/support`, `/account-deletion`, `/sign-in`, `/forgot-password`, `/reset-password`

Protected modules include Command Center, Students, Goals, Progress, Reports, Behavior Detective, Interventions, Accommodations, Services, Family Communication, Meeting Center, Executive Function, Classroom Operations, Administrative Intelligence, and Organization settings.

## Production

See:

- `docs/PRODUCTION_ARCHITECTURE.md`
- `docs/PRODUCTION_ENVIRONMENT.md`
- `docs/SUPABASE_PRODUCTION_SETUP.md`
- `docs/VERCEL_PRODUCTION_SETUP.md`
- `docs/GODADDY_DNS_SETUP.md`
- `docs/DEPLOYMENT_CHECKLIST.md`
- `docs/PRODUCTION_SMOKE_TEST_CHECKLIST.md`
- `docs/ROLLBACK_GUIDE.md`

## Security reminders

1. Enable and trust RLS
2. Enforce authorization in database and server layers
3. Keep tenant and student isolation intact
4. Use fictional seed data only
5. Do not claim FERPA/IDEA/Section 504/HIPAA/WCAG certification
