import { describe, expect, it } from "vitest";
import {
  ACCOMMODATION_TEMPLATES,
  COMMUNICATION_TEMPLATES,
  EF_SKILL_TEMPLATES,
  INTERVENTION_TEMPLATES,
  SERVICE_TEMPLATES,
} from "@/lib/catalogs";
import { ensureStarterLibrariesForOrganization } from "@/lib/org/ensure-starter-libraries";

function createMockSupabase(existing: Record<string, string[]>) {
  const inserts: Record<string, unknown[]> = {};
  return {
    inserts,
    client: {
      from(table: string) {
        return {
          select() {
            return {
              eq: async () => ({
                data: (existing[table] ?? []).map((name) => ({ name })),
                error: null,
              }),
            };
          },
          insert(rows: unknown[]) {
            inserts[table] = rows;
            return Promise.resolve({ error: null });
          },
        };
      },
    },
  };
}

describe("ensureStarterLibrariesForOrganization", () => {
  it("inserts all catalog rows when libraries are empty", async () => {
    const mock = createMockSupabase({});
    const result = await ensureStarterLibrariesForOrganization({
      // @ts-expect-error minimal supabase mock
      supabase: mock.client,
      organizationId: "org-1",
      actorUserId: "user-1",
      audit: false,
    });

    expect(result.imported).toBe(
      INTERVENTION_TEMPLATES.length +
        ACCOMMODATION_TEMPLATES.length +
        EF_SKILL_TEMPLATES.length +
        COMMUNICATION_TEMPLATES.length +
        SERVICE_TEMPLATES.length,
    );
    expect(mock.inserts.intervention_library_items).toHaveLength(INTERVENTION_TEMPLATES.length);
    expect(mock.inserts.accommodation_library_items).toHaveLength(ACCOMMODATION_TEMPLATES.length);
    expect(mock.inserts.executive_function_skill_areas).toHaveLength(EF_SKILL_TEMPLATES.length);
    expect(mock.inserts.communication_templates).toHaveLength(COMMUNICATION_TEMPLATES.length);
    expect(mock.inserts.service_definitions).toHaveLength(SERVICE_TEMPLATES.length);
  });

  it("skips insert when catalogs are already full", async () => {
    const mock = createMockSupabase({
      intervention_library_items: INTERVENTION_TEMPLATES.map((item) => item.name),
      accommodation_library_items: ACCOMMODATION_TEMPLATES.map((item) => item.name),
      executive_function_skill_areas: EF_SKILL_TEMPLATES.map((item) => item.name),
      communication_templates: COMMUNICATION_TEMPLATES.map((item) => item.name),
      service_definitions: SERVICE_TEMPLATES.map((item) => item.name),
    });
    const result = await ensureStarterLibrariesForOrganization({
      // @ts-expect-error minimal supabase mock
      supabase: mock.client,
      organizationId: "org-1",
      actorUserId: "user-1",
      audit: false,
    });
    expect(result.imported).toBe(0);
    expect(Object.keys(mock.inserts)).toHaveLength(0);
  });
});
