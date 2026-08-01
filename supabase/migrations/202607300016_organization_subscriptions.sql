-- 202607300016_organization_subscriptions.sql
-- Single monthly subscription plan per organization (Stripe-backed).

CREATE TABLE IF NOT EXISTS public.organization_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL UNIQUE REFERENCES public.organizations(id) ON DELETE CASCADE,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  stripe_price_id text,
  status text NOT NULL DEFAULT 'inactive'
    CHECK (status IN (
      'inactive',
      'trialing',
      'active',
      'past_due',
      'canceled',
      'unpaid',
      'incomplete',
      'incomplete_expired',
      'paused'
    )),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  canceled_at timestamptz,
  latest_invoice_id text,
  raw_status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS organization_subscriptions_status_idx
  ON public.organization_subscriptions(status);

CREATE INDEX IF NOT EXISTS organization_subscriptions_customer_idx
  ON public.organization_subscriptions(stripe_customer_id);

CREATE TRIGGER organization_subscriptions_set_updated_at
BEFORE UPDATE ON public.organization_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.organization_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_subscriptions FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS organization_subscriptions_select ON public.organization_subscriptions;
CREATE POLICY organization_subscriptions_select
ON public.organization_subscriptions FOR SELECT
USING (
  public.has_org_permission(organization_id, 'org.manage')
  OR public.has_org_permission(organization_id, 'org.members.manage')
  OR public.has_org_permission(organization_id, 'org.audit.read')
);

DROP POLICY IF EXISTS organization_subscriptions_insert ON public.organization_subscriptions;
CREATE POLICY organization_subscriptions_insert
ON public.organization_subscriptions FOR INSERT
WITH CHECK (public.has_org_permission(organization_id, 'org.manage'));

DROP POLICY IF EXISTS organization_subscriptions_update ON public.organization_subscriptions;
CREATE POLICY organization_subscriptions_update
ON public.organization_subscriptions FOR UPDATE
USING (public.has_org_permission(organization_id, 'org.manage'))
WITH CHECK (public.has_org_permission(organization_id, 'org.manage'));

COMMENT ON TABLE public.organization_subscriptions IS
  'One monthly Stripe subscription record per organization. No plan tiers.';
