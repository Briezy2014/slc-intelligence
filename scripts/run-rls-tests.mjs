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
const northDraftReport = "91000000-0000-0000-0000-000000000002";
const northBehaviorDefinition = "95000000-0000-0000-0000-000000000001";
const northBehaviorSession = "98000000-0000-0000-0000-000000000001";
const southBehaviorSession = "98000000-0000-0000-0000-000000000004";
const northFbaWorkspace = "98600000-0000-0000-0000-000000000001";
const northInterventionPlan = "99100000-0000-0000-0000-000000000001";
const skyStudent = "a4444444-4444-4444-4444-444444444402";
const northAccommodation = "d1310000-0000-0000-0000-000000000001";
const northServicePlan = "d1360000-0000-0000-0000-000000000001";
const northServiceLog = "d13c0000-0000-0000-0000-000000000001";
const northContact = "d1410000-0000-0000-0000-000000000001";
const internalCommunication = "d1440000-0000-0000-0000-000000000002";
const northMeeting = "d1490000-0000-0000-0000-000000000001";
const northClassroom = "a3333333-3333-3333-3333-333333333301";
const northClassroomSchedule = "d1500000-0000-0000-0000-000000000001";

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
  assertEqual(
    "Specialist cannot self-promote role",
    role || "intervention_specialist",
    "intervention_specialist",
  );
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
  lastResult(
    asUser(northReadonly, `SELECT can_edit_student('${northOrg}', '${riverStudent}');`).stdout,
  ),
  "f",
);

assertEqual(
  "Read-only cannot manage goals",
  lastResult(
    asUser(northReadonly, `SELECT can_manage_goal('${northOrg}', '${riverStudent}');`).stdout,
  ),
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
    asUser(southAdmin, `SELECT count(*) FROM schools WHERE organization_id = '${northOrg}';`)
      .stdout,
  ),
  "0",
);

// --- Goals / progress isolation ---
assertEqual(
  "North specialist sees North goals only",
  lastResult(
    asUser(northSpecialist, `SELECT count(*) FROM iep_goals WHERE organization_id = '${southOrg}';`)
      .stdout,
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

// --- Phase 9 reporting isolation and permissions ---
assertEqual(
  "South admin cannot read North progress reports",
  lastResult(
    asUser(
      southAdmin,
      `SELECT count(*) FROM progress_reports WHERE organization_id = '${northOrg}';`,
    ).stdout,
  ),
  "0",
);

assertEqual(
  "North specialist cannot read South reporting periods",
  lastResult(
    asUser(
      northSpecialist,
      `SELECT count(*) FROM reporting_periods WHERE organization_id = '${southOrg}';`,
    ).stdout,
  ),
  "0",
);

assertEqual(
  "Paraprofessional cannot finalize report",
  lastResult(
    asUser(northPara, `SELECT can_finalize_report('${northOrg}', '${riverStudent}');`).stdout,
  ),
  "f",
);

{
  const finalizeAttempt = asUser(
    northPara,
    `WITH u AS (
      UPDATE progress_reports
      SET status = 'finalized'
      WHERE id = '${northDraftReport}'
      RETURNING 1
    ) SELECT count(*) FROM u;`,
    { allowError: true },
  );
  assertTrue(
    "Paraprofessional report finalize update is blocked",
    finalizeAttempt.status !== 0 || lastResult(finalizeAttempt.stdout) === "0",
  );
}

{
  const readonlyEdit = asUser(
    northReadonly,
    `WITH u AS (
      UPDATE progress_report_goal_sections
      SET educator_narrative = 'tamper'
      RETURNING 1
    ) SELECT count(*) FROM u;`,
    { allowError: true },
  );
  assertTrue(
    "Read-only reviewer cannot edit report sections",
    readonlyEdit.status !== 0 || lastResult(readonlyEdit.stdout) === "0",
  );
}

// --- Phase 10/11 behavior and FBA isolation ---
assertEqual(
  "South admin cannot read North behavior sessions",
  lastResult(
    asUser(
      southAdmin,
      `SELECT count(*) FROM behavior_observation_sessions WHERE organization_id = '${northOrg}';`,
    ).stdout,
  ),
  "0",
);

assertEqual(
  "North specialist cannot read South behavior session by ID",
  lastResult(
    asUser(
      northSpecialist,
      `SELECT count(*) FROM behavior_observation_sessions WHERE id = '${southBehaviorSession}';`,
    ).stdout,
  ),
  "0",
);

{
  const readonlyBehaviorEdit = asUser(
    northReadonly,
    `WITH u AS (
      UPDATE behavior_definitions
      SET operational_definition = 'tamper'
      WHERE id = '${northBehaviorDefinition}'
      RETURNING 1
    ) SELECT count(*) FROM u;`,
    { allowError: true },
  );
  assertTrue(
    "Read-only reviewer cannot edit behavior definition",
    readonlyBehaviorEdit.status !== 0 || lastResult(readonlyBehaviorEdit.stdout) === "0",
  );
}

assertEqual(
  "Paraprofessional cannot finalize behavior",
  lastResult(
    asUser(northPara, `SELECT can_finalize_behavior('${northOrg}', '${riverStudent}');`).stdout,
  ),
  "f",
);

{
  const paraBehaviorFinalize = asUser(
    northPara,
    `WITH u AS (
      UPDATE behavior_observation_sessions
      SET status = 'corrected'
      WHERE id = '${northBehaviorSession}'
      RETURNING 1
    ) SELECT count(*) FROM u;`,
    { allowError: true },
  );
  assertTrue(
    "Paraprofessional behavior correction is blocked",
    paraBehaviorFinalize.status !== 0 || lastResult(paraBehaviorFinalize.stdout) === "0",
  );
}

assertEqual(
  "Read-only reviewer can read FBA but cannot manage",
  lastResult(
    asUser(northReadonly, `SELECT can_manage_fba('${northOrg}', '${riverStudent}');`).stdout,
  ),
  "f",
);

{
  const readonlyFbaEdit = asUser(
    northReadonly,
    `WITH u AS (
      UPDATE fba_evidence_workspaces
      SET team_notes = 'tamper'
      WHERE id = '${northFbaWorkspace}'
      RETURNING 1
    ) SELECT count(*) FROM u;`,
    { allowError: true },
  );
  assertTrue(
    "Read-only reviewer cannot edit FBA workspace",
    readonlyFbaEdit.status !== 0 || lastResult(readonlyFbaEdit.stdout) === "0",
  );
}

// --- Phase 12 intervention isolation and permissions ---
assertEqual(
  "South admin cannot read North intervention plans",
  lastResult(
    asUser(
      southAdmin,
      `SELECT count(*) FROM intervention_plans WHERE organization_id = '${northOrg}';`,
    ).stdout,
  ),
  "0",
);

{
  const readonlyPlanEdit = asUser(
    northReadonly,
    `WITH u AS (
      UPDATE intervention_plans
      SET title = 'tamper'
      WHERE id = '${northInterventionPlan}'
      RETURNING 1
    ) SELECT count(*) FROM u;`,
    { allowError: true },
  );
  assertTrue(
    "Read-only reviewer cannot edit intervention plan",
    readonlyPlanEdit.status !== 0 || lastResult(readonlyPlanEdit.stdout) === "0",
  );
}

{
  const paraActivate = asUser(
    northPara,
    `WITH u AS (
      UPDATE intervention_plans
      SET status = 'paused'
      WHERE id = '${northInterventionPlan}'
      RETURNING 1
    ) SELECT count(*) FROM u;`,
    { allowError: true },
  );
  assertTrue(
    "Paraprofessional cannot activate or pause intervention plan",
    paraActivate.status !== 0 || lastResult(paraActivate.stdout) === "0",
  );
}

// --- Phase 13-15 application-layer RLS isolation and permissions ---
assertEqual(
  "South admin cannot read North accommodations",
  lastResult(
    asUser(
      southAdmin,
      `SELECT count(*) FROM student_accommodations WHERE organization_id = '${northOrg}';`,
    ).stdout,
  ),
  "0",
);

assertEqual(
  "North specialist cannot read South service definitions",
  lastResult(
    asUser(
      northSpecialist,
      `SELECT count(*) FROM service_definitions WHERE organization_id = '${southOrg}';`,
    ).stdout,
  ),
  "0",
);

assertEqual(
  "South admin cannot read North contacts",
  lastResult(
    asUser(
      southAdmin,
      `SELECT count(*) FROM student_contacts WHERE organization_id = '${northOrg}';`,
    ).stdout,
  ),
  "0",
);

assertEqual(
  "South admin cannot read North meetings",
  lastResult(
    asUser(southAdmin, `SELECT count(*) FROM meetings WHERE organization_id = '${northOrg}';`)
      .stdout,
  ),
  "0",
);

assertEqual(
  "North specialist cannot read South classroom schedules",
  lastResult(
    asUser(
      northSpecialist,
      `SELECT count(*) FROM classroom_schedules WHERE organization_id = '${southOrg}';`,
    ).stdout,
  ),
  "0",
);

assertEqual(
  "Paraprofessional cannot activate service plan",
  lastResult(
    asUser(northPara, `SELECT can_activate_service_plan('${northOrg}', '${riverStudent}');`).stdout,
  ),
  "f",
);

{
  const paraServiceActivate = asUser(
    northPara,
    `WITH u AS (
      UPDATE student_service_plans
      SET status = 'active'
      WHERE id = '${northServicePlan}'
      RETURNING 1
    ) SELECT count(*) FROM u;`,
    { allowError: true },
  );
  assertTrue(
    "Paraprofessional service activation update is blocked",
    paraServiceActivate.status !== 0 || lastResult(paraServiceActivate.stdout) === "0",
  );
}

{
  const readonlyAccommodationEdit = asUser(
    northReadonly,
    `WITH u AS (
      UPDATE student_accommodations
      SET title = 'tamper'
      WHERE id = '${northAccommodation}'
      RETURNING 1
    ) SELECT count(*) FROM u;`,
    { allowError: true },
  );
  assertTrue(
    "Read-only reviewer cannot edit accommodations",
    readonlyAccommodationEdit.status !== 0 || lastResult(readonlyAccommodationEdit.stdout) === "0",
  );
}

{
  const readonlyContactEdit = asUser(
    northReadonly,
    `WITH u AS (
      UPDATE student_contacts
      SET first_name = 'tamper'
      WHERE id = '${northContact}'
      RETURNING 1
    ) SELECT count(*) FROM u;`,
    { allowError: true },
  );
  assertTrue(
    "Read-only reviewer cannot edit contacts",
    readonlyContactEdit.status !== 0 || lastResult(readonlyContactEdit.stdout) === "0",
  );
}

assertEqual(
  "Para without internal communication permission cannot read internal notes",
  lastResult(
    asUser(
      northPara,
      `SELECT count(*) FROM communication_logs WHERE id = '${internalCommunication}';`,
    ).stdout,
  ),
  "0",
);

{
  const unauthorizedGroupParticipant = asUser(
    northSpecialist,
    `WITH ins AS (
      INSERT INTO service_delivery_participants (organization_id, delivery_log_id, student_id, participation_note)
      VALUES ('${northOrg}', '${northServiceLog}', '${quinnStudent}', 'tamper')
      RETURNING 1
    ) SELECT count(*) FROM ins;`,
    { allowError: true },
  );
  assertTrue(
    "Unauthorized group participant insert is blocked",
    unauthorizedGroupParticipant.status !== 0 ||
      lastResult(unauthorizedGroupParticipant.stdout) === "0",
  );
}

{
  const classroomTamper = asUser(
    southAdmin,
    `WITH u AS (
      UPDATE classroom_schedules
      SET name = 'tamper'
      WHERE id = '${northClassroomSchedule}'
      RETURNING 1
    ) SELECT count(*) FROM u;`,
    { allowError: true },
  );
  assertTrue(
    "Classroom operations are isolated across organizations",
    classroomTamper.status !== 0 || lastResult(classroomTamper.stdout) === "0",
  );
}

assertEqual(
  "North paraprofessional can read assigned classroom operations",
  lastResult(
    asUser(
      northPara,
      `SELECT count(*) FROM classroom_schedules WHERE classroom_id = '${northClassroom}';`,
    ).stdout,
  ),
  "1",
);

assertEqual(
  "North org admin can read admin intelligence permission helper",
  lastResult(
    asUser(northAdmin, `SELECT public.can_read_admin_intelligence('${northOrg}')::text;`).stdout,
  ),
  "true",
);

assertEqual(
  "South org admin cannot read North privacy settings",
  lastResult(
    asUser(
      southAdmin,
      `SELECT count(*) FROM organization_privacy_settings WHERE organization_id = '${northOrg}';`,
    ).stdout,
  ),
  "0",
);

assertEqual(
  "North org admin can read North privacy settings",
  lastResult(
    asUser(
      northAdmin,
      `SELECT count(*) FROM organization_privacy_settings WHERE organization_id = '${northOrg}';`,
    ).stdout,
  ),
  "1",
);

assertEqual(
  "Paraprofessional cannot read admin intelligence",
  lastResult(
    asUser(northPara, `SELECT public.can_read_admin_intelligence('${northOrg}')::text;`).stdout,
  ),
  "false",
);

assertEqual(
  "Paraprofessional cannot read privacy settings",
  lastResult(
    asUser(
      northPara,
      `SELECT count(*) FROM organization_privacy_settings WHERE organization_id = '${northOrg}';`,
    ).stdout,
  ),
  "0",
);

assertEqual(
  "North org admin can export admin intelligence",
  lastResult(
    asUser(northAdmin, `SELECT public.can_export_admin_intelligence('${northOrg}')::text;`).stdout,
  ),
  "true",
);

assertEqual(
  "Building admin cannot export admin intelligence by default",
  lastResult(
    asUser(northBuilding, `SELECT public.can_export_admin_intelligence('${northOrg}')::text;`)
      .stdout,
  ),
  "false",
);

{
  const southExportTamper = asUser(
    southAdmin,
    `WITH ins AS (
      INSERT INTO administrative_export_events (organization_id, exported_by, export_type, filters, scope_summary)
      VALUES ('${northOrg}', '${southAdmin}', 'tamper', '{}'::jsonb, 'tamper')
      RETURNING 1
    ) SELECT count(*) FROM ins;`,
    { allowError: true },
  );
  assertTrue(
    "Cross-organization administrative export insert is blocked",
    southExportTamper.status !== 0 || lastResult(southExportTamper.stdout) === "0",
  );
}

{
  const northExport = asUser(
    northAdmin,
    `WITH ins AS (
      INSERT INTO administrative_export_events (organization_id, exported_by, export_type, filters, scope_summary)
      VALUES ('${northOrg}', '${northAdmin}', 'summary_csv', '{"schoolId":null}'::jsonb, 'Organization scope')
      RETURNING 1
    ) SELECT count(*) FROM ins;`,
  );
  assertEqual(
    "North org admin can insert administrative export event",
    lastResult(northExport.stdout),
    "1",
  );
}

assertTrue(
  "Reference catalogs have RLS forced",
  lastResult(
    sql(`
      SELECT bool_and(c.relrowsecurity AND c.relforcerowsecurity)::text
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname IN ('app_roles', 'app_permissions', 'role_permissions', 'measurement_types');
    `).stdout,
  ) === "true",
);

assertEqual(
  "Authenticated users can read app_roles catalog",
  lastResult(asUser(northAdmin, `SELECT count(*) > 0 FROM app_roles;`).stdout),
  "t",
);

{
  const catalogWrite = asUser(
    northAdmin,
    `WITH ins AS (
      INSERT INTO app_roles (code, label, description)
      VALUES ('tamper_role', 'tamper', 'tamper')
      RETURNING 1
    ) SELECT count(*) FROM ins;`,
    { allowError: true },
  );
  assertTrue(
    "Authenticated users cannot insert into app_roles catalog",
    catalogWrite.status !== 0 || lastResult(catalogWrite.stdout) === "0",
  );
}

console.log(`\nRLS tests passed=${passed} failed=${failed}`);
if (failed > 0) process.exit(1);
