#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://slc:slc_dev_only@127.0.0.1:5432/slc_intelligence";

function run(args) {
  const result = spawnSync("psql", args, { stdio: "inherit", env: process.env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("Dropping and recreating schemas...");
run([
  databaseUrl,
  "-v",
  "ON_ERROR_STOP=1",
  "-c",
  "DROP SCHEMA IF EXISTS public CASCADE; DROP SCHEMA IF EXISTS auth CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO slc; GRANT ALL ON SCHEMA public TO public;",
]);

const migrate = spawnSync("node", ["scripts/db-migrate.mjs"], {
  stdio: "inherit",
  env: process.env,
});
if (migrate.status !== 0) process.exit(migrate.status ?? 1);

const seedPaths = [
  "supabase/seed/01_fictional_dev_seed.sql",
  "supabase/seed/02_fictional_phase9_12_seed.sql",
  "supabase/seed/03_fictional_phase13_15_seed.sql",
  "supabase/seed/04_fictional_admin_intelligence_seed.sql",
];
for (const seedPath of seedPaths) {
  console.log(`Seeding ${seedPath}...`);
  run([databaseUrl, "-v", "ON_ERROR_STOP=1", "-f", seedPath]);
}

console.log("Database reset complete.");
