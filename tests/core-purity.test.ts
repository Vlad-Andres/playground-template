import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const coreDir = path.resolve("core");

function coreFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return coreFiles(full);
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
  });
}

function specifiers(source: string): string[] {
  const pattern = /(?:import|export)\s[^"'`;]*?from\s*["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\s+["']([^"']+)["']/g;
  return [...source.matchAll(pattern)].map((match) => match[1] ?? match[2] ?? match[3]);
}

describe("core purity", () => {
  const files = coreFiles(coreDir);

  it("has files", () => expect(files.length).toBeGreaterThan(0));

  it.each(files.map((file) => [path.relative(coreDir, file), file]))("%s imports only zod or files inside core/", (_name, file) => {
    for (const specifier of specifiers(fs.readFileSync(file, "utf8"))) {
      if (specifier === "zod") continue;
      expect(specifier.startsWith("./") || specifier.startsWith("../"), `${specifier} in ${file}`).toBe(true);
      const target = path.resolve(path.dirname(file), specifier);
      expect(target.startsWith(coreDir + path.sep), `${specifier} leaves core/`).toBe(true);
    }
  });

  it("detects a forbidden import", () => {
    expect(specifiers('import fs from "node:fs";\nimport { x } from "./y";')).toEqual(["node:fs", "./y"]);
  });
});
