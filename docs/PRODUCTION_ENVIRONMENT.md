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

## Billing (single monthly plan)

Set these when you are ready to charge organizations (no Free/Pro tiers):

1. `STRIPE_SECRET_KEY=`
2. `STRIPE_PRICE_ID=` (one monthly Stripe Price ID)
3. `STRIPE_WEBHOOK_SECRET=`
4. `SUPABASE_SERVICE_ROLE_KEY=` (server-only; webhook updates)
5. `BILLING_MONTHLY_PRICE_USD=49` (UI display amount)
6. `BILLING_ENFORCEMENT=false` (keep false until outside-classroom charging should be required)

See `docs/BILLING.md`.

## Prohibited

1. Service-role key in any `NEXT_PUBLIC_*` variable
2. Committing `.env.local` or production secrets
3. Sharing production credentials in chat, screenshots, or docs

## Preview environment

Use a separate non-production Supabase project and preview env values.
