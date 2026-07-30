import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const repoRoot = process.cwd();
const ignoredDirectories = new Set([
  ".git",
  ".next",
  "node_modules",
  "coverage",
  "playwright-report",
]);
const ignoredExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf"]);

const secretPatterns = [
  /supabase[^\n\r]{0,40}service[_-]?role[^\n\r]{0,40}(eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,})/i,
  /sb_secret_[A-Za-z0-9_-]{20,}/,
  /(?:api[_-]?key|secret|token)\s*[:=]\s*["'][A-Za-z0-9_-]{32,}["']/i,
  /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
];

function collectFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      return ignoredDirectories.has(entry) ? [] : collectFiles(fullPath);
    }
    if (ignoredExtensions.has(entry.slice(entry.lastIndexOf(".")).toLowerCase())) return [];
    return [fullPath];
  });
}

describe("secret scan", () => {
  it("does not contain obvious committed service-role keys or secrets", () => {
    const findings = collectFiles(repoRoot).flatMap((file) => {
      const content = readFileSync(file, "utf8");
      return secretPatterns.some((pattern) => pattern.test(content))
        ? [relative(repoRoot, file)]
        : [];
    });

    expect(findings).toEqual([]);
  });
});
