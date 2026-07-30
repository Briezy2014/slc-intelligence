import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("public shell", () => {
  test("homepage renders product identity without development prefacing", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeAttached();
    await expect(page.getByText("SLC Intelligence").first()).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "The Intelligence Platform for Specialized Learning Classrooms",
      }),
    ).toBeVisible();
    await expect(page.getByText(/not approved for production use/i)).toHaveCount(0);
    await expect(page.getByText(/Development build/i)).toHaveCount(0);
    await expect(page.getByText(/FERPA-compliant/i)).toHaveCount(0);
  });

  test("sign-in form has accessible labels and configuration messaging", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByLabel("Work email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("link", { name: /Forgot password/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    await expect(
      page.getByText(/Supabase authentication is not configured|Configuration needed/i).first(),
    ).toBeVisible();
    // Sign-in is disabled until Supabase env is present; messaging is shown up front.
    await expect(page.getByRole("button", { name: "Sign in" })).toBeDisabled();
    await expect(
      page.locator("#main-content").getByRole("link", { name: /Request access/i }),
    ).toBeVisible();
  });

  test("command center redirects to sign-in when Supabase is not configured", async ({ page }) => {
    await page.goto("/command-center");
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();
    await expect(
      page.getByText(/Supabase authentication is not configured|Configuration needed/i).first(),
    ).toBeVisible();
  });

  test("basic navigation works", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page.getByRole("heading", { name: "About SLC Intelligence" })).toBeVisible();
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Privacy" })
      .click();
    await expect(page.getByRole("heading", { name: "Privacy" })).toBeVisible();
  });

  test("homepage has no critical accessibility violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter((violation) => violation.impact === "critical");
    expect(critical).toEqual([]);
  });
});
