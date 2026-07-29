#!/usr/bin/env node
/**
 * RLS isolation tests against local PostgreSQL using JWT claim simulation.
 * No real student data. Uses fictional seed IDs only.
 */
import { spawnSync } from "node:child_process";

const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://slc:slc_dev_only@127.0.0.1:5432/slc_intelligence";

function sql(statements, { allowError = false } = {}) {
  const result = spawnSync(
    "psql",
    [databaseUrl, "-v", "ON_ERROR_STOP=1", "-At", "-c", statements],
    { encoding: "utf8", env: process.env },
  );
  if (result.status !== 0 && !allowError) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
  return {
    status: result.status ?? 1,
    stdout: (result.stdout || "").trim(),
    stderr: (result.stderr || "").trim(),
  };
}

/** Extract the last meaningful result line (ignore SET/RESET/config echoes). */
function lastResult(stdout) {
  const lines = stdout
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !["SET", "RESET", "BEGIN", "COMMIT"].includes(line));
  // Drop JWT config echoes that look like UUIDs when they are the only config return
  return lines[lines.length - 1] ?? "";
}

function asUser(userId, query, options = {}) {
  return sql(
    `
    SET ROLE authenticated;
    SELECT set_config('request.jwt.claim.sub', '${userId}', true);
    ${query}
    RESET ROLE;
  `,
    options,
  );
}

let passed = 0;
let failed = 0;

function assertEqual(name, actual, expected) {
  if (String(actual) === String(expected)) {
    console.log(`PASS ${name}`);
    passed += 1;
  } else {
    console.error(`FAIL ${name}: expected ${expected}, got ${actual}`);
    failed += 1;
  }
}

function assertTrue(name, condition) {
  if (condition) {
    console.log(`PASS ${name}`);
    passed += 1;
  } else {
    console.error(`FAIL ${name}`);
    failed += 1;
  }
}

const northAdmin = "11111111-1111-1111-1111-111111111101";
const southAdmin = "22222222-2222-2222-2222-222222222201";
const northBuilding = "11111111-1111-1111-1111-111111111102";
const northSpecialist = "11111111-1111-1111-1111-111111111103";
const northPara = "11111111-1111-1111-1111-111111111104";
const northReadonly = "11111111-1111-1111-1111-111111111105";
const noMembership = "55555555-5555-5555-5555-555555555501";
const inactive = "44444444-4444-4444-4444-444444444401";
const northOrg = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1";
const southOrg = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1";
const riverStudent = "a4444444-4444-4444-4444-444444444401";
const quinnStudent = "b4444444-4444-4444-4444-444444444401";

console.log("=== Stage A/B/C RLS isolation tests ===\n");

// --- Organization isolation ---
assertEqual(
  "North admin sees only North org",
  lastResult(asUser(northAdmin, "SELECT count(*) FROM organizations;").stdout),
  "1",
);

assertEqual(
  "South admin cannot see North org",
  lastResult(
    asUser(southAdmin, "SELECT count(*) FROM organizations WHERE slug = 'northwind-fictional';")
      .stdout,
  ),
  "0",
);

assertEqual(
  "No-membership user sees zero orgs",
  lastResult(asUser(noMembership, "SELECT count(*) FROM organizations;").stdout),
  "0",
);

assertEqual(
  "Inactive membership grants no org access",
  lastResult(asUser(inactive, "SELECT count(*) FROM organizations;").stdout),
  "0",
);

// --- Self-join / self-promote ---
{
  const attempt = asUser(
    northSpecialist,
    `WITH ins AS (
      INSERT INTO organization_memberships (organization_id, user_id, role_code, status)
      VALUES ('${southOrg}', '${northSpecialist}', 'organization_admin', 'active')
      ON CONFLICT DO NOTHING
      RETURNING 1
    ) SELECT count(*) FROM ins;`,
    { allowError: true },
  );
  assertTrue(
    "North specialist cannot insert self into South org",
    attempt.status !== 0 || lastResult(attempt.stdout) === "0",
  );
}

{
  const promote = asUser(
    northSpecialist,
    `UPDATE organization_memberships
     SET role_code = 'organization_admin'
     WHERE user_id = '${northSpecialist}'
       AND organization_id = '${northOrg}';
     SELECT role_code FROM organization_memberships
     WHERE user_id = '${northSpecialist}'
       AND organization_id = '${northOrg}';`,
    { allowError: true },
  );
  const role = lastResult(promote.stdout);
  assertEqual("Specialist cannot self-promote role", role || "intervention_specialist", "intervention_specialist");
}

// --- Student isolation ---
assertEqual(
  "North specialist can read assigned North students",
  lastResult(asUser(northSpecialist, "SELECT count(*) FROM students;").stdout),
  "2",
);

assertEqual(
  "North specialist cannot read South students",
  lastResult(
    asUser(northSpecialist, `SELECT count(*) FROM students WHERE organization_id = '${southOrg}';`)
      .stdout,
  ),
  "0",
);

assertEqual(
  "South admin cannot read North students",
  lastResult(
    asUser(southAdmin, `SELECT count(*) FROM students WHERE organization_id = '${northOrg}';`)
      .stdout,
  ),
  "0",
);

assertEqual(
  "Paraprofessional with classroom assignment sees classroom students",
  lastResult(asUser(northPara, "SELECT count(*) FROM students;").stdout),
  "2",
);

assertEqual(
  "Read-only reviewer with school scope can read enrolled students",
  lastResult(asUser(northReadonly, "SELECT count(*) FROM students;").stdout),
  "2",
);

// --- Permission helpers ---
assertEqual(
  "Paraprofessional cannot manage schools",
  lastResult(
    asUser(northPara, `SELECT has_org_permission('${northOrg}', 'school.manage');`).stdout,
  ),
  "f",
);

assertEqual(
  "Paraprofessional cannot finalize progress",
  lastResult(
    asUser(northPara, `SELECT can_finalize_progress('${northOrg}', '${riverStudent}');`).stdout,
  ),
  "f",
);

assertEqual(
  "Read-only cannot edit student",
  lastResult(asUser(northReadonly, `SELECT can_edit_student('${northOrg}', '${riverStudent}');`).stdout),
  "f",
);

assertEqual(
  "Read-only cannot manage goals",
  lastResult(asUser(northReadonly, `SELECT can_manage_goal('${northOrg}', '${riverStudent}');`).stdout),
  "f",
);

// --- School scope ---
assertEqual(
  "Building admin can see North schools",
  lastResult(asUser(northBuilding, "SELECT count(*) FROM schools;").stdout),
  "2",
);

assertEqual(
  "South admin cannot see North schools",
  lastResult(
    asUser(southAdmin, `SELECT count(*) FROM schools WHERE organization_id = '${northOrg}';`).stdout,
  ),
  "0",
);

// --- Goals / progress isolation ---
assertEqual(
  "North specialist sees North goals only",
  lastResult(
    asUser(
      northSpecialist,
      `SELECT count(*) FROM iep_goals WHERE organization_id = '${southOrg}';`,
    ).stdout,
  ),
  "0",
);

assertEqual(
  "South admin cannot see North progress sessions",
  lastResult(
    asUser(
      southAdmin,
      `SELECT count(*) FROM progress_monitoring_sessions WHERE organization_id = '${northOrg}';`,
    ).stdout,
  ),
  "0",
);

assertEqual(
  "North specialist cannot read Quinn (South student) by ID",
  lastResult(
    asUser(northSpecialist, `SELECT count(*) FROM students WHERE id = '${quinnStudent}';`).stdout,
  ),
  "0",
);

// --- Audit immutability ---
assertEqual(
  "Audit events are not updatable by specialist",
  lastResult(
    asUser(
      northSpecialist,
      `WITH u AS (
        UPDATE audit_events SET action_type = 'tamper' RETURNING 1
      ) SELECT count(*) FROM u;`,
      { allowError: true },
    ).stdout || "0",
  ),
  "0",
);

assertEqual(
  "Audit events are not deletable by admin",
  lastResult(
    asUser(
      northAdmin,
      `WITH d AS (
        DELETE FROM audit_events RETURNING 1
      ) SELECT count(*) FROM d;`,
      { allowError: true },
    ).stdout || "0",
  ),
  "0",
);

// --- Cross-org ID tampering ---
{
  const tamper = asUser(
    northSpecialist,
    `WITH ins AS (
      INSERT INTO students (id, organization_id, first_name, last_name, preferred_name, local_identifier, grade_level, enrollment_status)
      VALUES ('cccccccc-cccc-cccc-cccc-ccccccccccc1', '${southOrg}', 'Fake', 'Student', 'Fake', 'TAMPER-1', '1', 'active')
      RETURNING 1
    ) SELECT count(*) FROM ins;`,
    { allowError: true },
  );
  assertTrue(
    "Cannot create student in another organization",
    tamper.status !== 0 || lastResult(tamper.stdout) === "0",
  );
}

console.log(`\nRLS tests passed=${passed} failed=${failed}`);
if (failed > 0) process.exit(1);
