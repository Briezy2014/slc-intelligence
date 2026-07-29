# Production Environment Guide

## Required Vercel production variables

Set these in Vercel Project Settings → Environment Variables (Production):

1. `NEXT_PUBLIC_APP_NAME=SLC Intelligence`
2. `NEXT_PUBLIC_APP_URL=https://slcintelligence.com`
3. `NEXT_PUBLIC_SUPABASE_URL=` (production project URL)
4. `NEXT_PUBLIC_SUPABASE_ANON_KEY=` (production anon key)
5. `SUPABASE_URL=` (same production URL, server alias)
6. `SUPABASE_ANON_KEY=` (same production anon key, server alias)

Optional later (product-owner approval required):

1. Email provider settings if transactional email leaves Supabase defaults
2. Error-monitoring DSN if a paid service is approved

## Prohibited

1. Service-role key in any `NEXT_PUBLIC_*` variable
2. Committing `.env.local` or production secrets
3. Sharing production credentials in chat, screenshots, or docs

## Preview environment

Use a separate non-production Supabase project and preview env values.
