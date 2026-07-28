import { test, expect } from "@playwright/test";

test("health endpoint responds with ok payload", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body).toMatchObject({
    status: "ok",
    service: "slc-intelligence",
  });
  expect(body).not.toHaveProperty("supabaseServiceRole");
  expect(JSON.stringify(body)).not.toMatch(/service_role|password|secret/i);
});
