#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://slc:slc_dev_only@127.0.0.1:5432/slc_intelligence";
const migrationsDir = path.resolve("supabase/migrations");

const files = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.error("No migration files found.");
  process.exit(1);
}

for (const file of files) {
  const fullPath = path.join(migrationsDir, file);
  console.log(`Applying ${file}...`);
  const result = spawnSync("psql", [databaseUrl, "-v", "ON_ERROR_STOP=1", "-f", fullPath], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) {
    console.error(`Migration failed: ${file}`);
    process.exit(result.status ?? 1);
  }
}

console.log(`Applied ${files.length} migrations successfully.`);
