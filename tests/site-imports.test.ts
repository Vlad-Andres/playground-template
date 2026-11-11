import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const SRC = fileURLToPath(new URL("../src", import.meta.url));
const IMPORT = /(?:from\s*|import\s*\(\s*|import\s+)["']([^"']+)["']/g;

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

describe("shared UI imports", () => {
  it("uses the @site alias, not @/, so the portal can vendor src/", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(SRC)) {
      const text = fs.readFileSync(file, "utf8");
      for (const match of text.matchAll(IMPORT)) {
        if (match[1].startsWith("@/")) offenders.push(`${path.relative(SRC, file)}: ${match[1]}`);
      }
    }

    expect(offenders).toEqual([]);
  });
});
