import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("public shell", () => {
  test("homepage renders product identity and development notice", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Skip to main content" })).toBeAttached();
    await expect(page.getByText("SLC Intelligence").first()).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "The Intelligence Platform for Specialized Learning Classrooms",
      }),
    ).toBeVisible();
    await expect(page.getByText(/not approved for production use/i).first()).toBeVisible();
    await expect(page.getByText(/FERPA-compliant/i)).toHaveCount(0);
  });

  test("sign-in form has accessible labels and configuration messaging", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByLabel("Work email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("link", { name: "Forgot password" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    await page.getByLabel("Work email").fill("educator@example.org");
    await page.getByLabel("Password").fill("example-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(
      page.getByText(/Supabase authentication is not configured|Unable to sign in|Configuration needed/i).first(),
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
