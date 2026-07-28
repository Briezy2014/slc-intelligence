# Seed Data

Seed data is fictional and for local development only. No real student data, real staff data, real
family contacts, or real credentials may be committed.

All seed organizations, people, and students are clearly synthetic.

## Organizations (fictional)

| Name | Slug |
| --- | --- |
| Northwind Learning Collective (FICTIONAL) | `northwind-fictional` |
| Southbridge Education Cooperative (FICTIONAL) | `southbridge-fictional` |

## Fictional test user matrix

These emails appear in `supabase/seed/01_fictional_dev_seed.sql` for local PostgreSQL RLS testing.
They are not production accounts.

| Email | Role / purpose | Organization |
| --- | --- | --- |
| `org.admin.north@example.test` | Organization administrator | Northwind |
| `building.admin.north@example.test` | Building administrator | Northwind |
| `specialist.north@example.test` | Intervention specialist | Northwind |
| `para.north@example.test` | Paraprofessional | Northwind |
| `readonly.north@example.test` | Read-only reviewer | Northwind |
| `org.admin.south@example.test` | Organization administrator | Southbridge |
| `specialist.south@example.test` | Intervention specialist | Southbridge |
| `dual.membership@example.test` | Dual-org membership | Northwind + Southbridge |
| `inactive.user@example.test` | Inactive membership | Northwind (inactive) |
| `no.membership@example.test` | Authenticated, no membership | None |

No passwords are committed. Passwords must be created in the Supabase Auth Dashboard (or local
Supabase Auth workflow) before browser sign-in works. Local `auth.users` rows used by
`npm run db:reset` exist only for JWT-claim RLS simulation and are not a substitute for Supabase Auth.

## Reset process

```bash
npm run db:reset
```

This drops local `public` and `auth` schemas, reapplies migrations, and reseeds fictional data.
