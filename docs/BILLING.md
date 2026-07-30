# Billing — single monthly subscription

**Status:** Backend ready  
**Price:** $49/month per organization (configurable)  
**Plan tiers:** None — one monthly plan only

## What was added

- Public pricing page: `/pricing`
- Organization billing page: `/billing`
- Stripe Checkout + Customer Portal
- Stripe webhook: `/api/billing/webhook`
- Table: `organization_subscriptions`
- Soft enforcement flag (off by default)

## Required environment variables

1. `STRIPE_SECRET_KEY`
2. `STRIPE_PRICE_ID` — Stripe Price ID for the single monthly plan
3. `STRIPE_WEBHOOK_SECRET` — webhook signing secret for `/api/billing/webhook`
4. `SUPABASE_SERVICE_ROLE_KEY` — server-only, used by the webhook to update subscription rows

Optional:

1. `BILLING_MONTHLY_PRICE_USD=49` — display amount in UI
2. `BILLING_ENFORCEMENT=false` — keep `false` until outside-classroom users must subscribe

## Stripe setup checklist

1. Create one Product in Stripe (for example “SLC Intelligence”).
2. Create one recurring **monthly** Price (for example $49 USD).
3. Copy the Price ID into `STRIPE_PRICE_ID`.
4. Add webhook endpoint: `https://<your-domain>/api/billing/webhook`
5. Subscribe webhook to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Run SQL migration `202607300016_organization_subscriptions.sql` in Supabase.

## Classroom note

Your current classroom can keep working while Stripe keys are unset and while `BILLING_ENFORCEMENT=false`. When district/outside approval is ready, configure Stripe and optionally turn enforcement on.
