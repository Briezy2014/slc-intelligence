import { describe, expect, it } from "vitest";
import { formatMonthlyPriceLabel, isBillingEnforcementEnabled } from "@/lib/billing/config";
import { isSubscriptionAccessActive } from "@/lib/billing/subscriptions";

describe("billing config", () => {
  it("formats the single monthly price label", () => {
    expect(formatMonthlyPriceLabel(49)).toBe("$49/month");
  });

  it("treats active and trialing as access-active", () => {
    expect(isSubscriptionAccessActive("active")).toBe(true);
    expect(isSubscriptionAccessActive("trialing")).toBe(true);
    expect(isSubscriptionAccessActive("canceled")).toBe(false);
    expect(isSubscriptionAccessActive("inactive")).toBe(false);
  });

  it("keeps enforcement off by default", () => {
    expect(isBillingEnforcementEnabled()).toBe(false);
  });
});
