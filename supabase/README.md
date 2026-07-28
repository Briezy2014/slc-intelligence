# Supabase Directory

## Purpose

Hold future Supabase migrations, seed fixtures, edge functions, and database-policy tests for SLC Intelligence.

## Status

Status: Draft

Last updated: 2026-07-28

Owner: Product Owner

## Scope

Phase 0 creates placeholder structure only.

## Contents

| Path          | Intended use                                           |
| ------------- | ------------------------------------------------------ |
| `migrations/` | Version-controlled SQL migrations (none in Phase 0)    |
| `seed/`       | Fictional seed data only                               |
| `functions/`  | Approved server-side Supabase functions, if used later |
| `tests/`      | Database and RLS policy tests                          |

## Rules

1. Do not create SQL or migrations in Phase 0.
2. Do not connect to Supabase in Phase 0.
3. Never commit secrets or service-role keys.
4. Never seed real student information.
5. Do not create permissive RLS placeholder policies for protected tables when migrations begin.

## Current Authorized Phase

Phase 0: Foundation and Governance — no database objects.

## Change History

| Date       | Change                     | Author       |
| ---------- | -------------------------- | ------------ |
| 2026-07-28 | Initial placeholder README | Cursor Agent |
