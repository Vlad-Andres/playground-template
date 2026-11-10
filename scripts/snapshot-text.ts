import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function snapshotText(outDir: string): Record<string, string> {
  const result: Record<string, string> = {};

  function visit(directory: string): void {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(entryPath);
      } else if (entry.isFile() && entry.name === "index.html") {
        const relativePath = path.relative(outDir, entryPath).split(path.sep).join("/");
        const html = fs.readFileSync(entryPath, "utf8");
        const visibleText = html
          .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        result[relativePath] = visibleText;
      }
    }
  }

  visit(outDir);
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
}

function readSnapshot(file: string): Record<string, string> {
  return JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, string>;
}

function main(args: string[]): number {
  const [outDir, mode, snapshotFile] = args;
  if (!outDir || (mode !== "--write" && mode !== "--compare") || !snapshotFile) {
    console.error("Usage: snapshot-text <outDir> (--write|--compare) <file>");
    return 2;
  }

  const snapshot = snapshotText(outDir);
  if (mode === "--write") {
    fs.mkdirSync(path.dirname(snapshotFile), { recursive: true });
    fs.writeFileSync(snapshotFile, `${JSON.stringify(snapshot, null, 2)}\n`);
    return 0;
  }

  const expected = readSnapshot(snapshotFile);
  const keys = new Set([...Object.keys(snapshot), ...Object.keys(expected)]);
  const differingKeys = [...keys].filter((key) => snapshot[key] !== expected[key]).sort();
  console.log(`${differingKeys.length} pages differ (${keys.size} compared)`);
  for (const key of differingKeys) {
    console.log(key);
  }
  return differingKeys.length > 0 ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
