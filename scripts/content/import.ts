import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundleSchema, isBundlePath } from "../../core/generate/bundle";
import { formatProblem, validateCourse } from "./validate";
import type { Problem } from "../../core/validate";

/** Replace the course in `outDir` with `files`: empties lectures/, removes exam.json and expected.json. */
export function writeContent(outDir: string, files: Record<string, string>): void {
  const bad = Object.keys(files).filter((file) => !isBundlePath(file));
  if (bad.length) throw new Error(`Refusing to write: ${bad.join(", ")}`);
  const lectures = path.join(outDir, "lectures");
  fs.rmSync(lectures, { recursive: true, force: true });
  fs.mkdirSync(lectures, { recursive: true });
  for (const file of ["exam.json", "expected.json"]) fs.rmSync(path.join(outDir, file), { force: true });
  for (const [file, text] of Object.entries(files)) {
    const target = path.resolve(outDir, file);
    if (!target.startsWith(path.resolve(outDir) + path.sep)) throw new Error(`Refusing to write outside ${outDir}: ${file}`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
  }
}

export function importBundle(bundleText: string, outDir: string): Problem[] {
  let raw: unknown;
  try {
    raw = JSON.parse(bundleText);
  } catch {
    throw new Error("The bundle is not valid JSON.");
  }
  const parsed = bundleSchema.safeParse(raw);
  if (!parsed.success) throw new Error(`Not a course bundle: ${parsed.error.issues[0]?.message ?? "invalid"}`);
  if (!parsed.data.files["course.json"]) throw new Error("The bundle has no course.json.");
  writeContent(outDir, parsed.data.files);
  return validateCourse(outDir);
}

function main(args: string[]): number {
  const bundlePath = args.find((arg) => !arg.startsWith("--"));
  const outIndex = args.indexOf("--out");
  const outDir = outIndex >= 0 ? args[outIndex + 1] : "content";
  if (!bundlePath || !outDir) {
    console.error("Usage: npm run import -- <bundle.json> [--out content]");
    return 2;
  }
  try {
    const problems = importBundle(fs.readFileSync(bundlePath, "utf8"), outDir);
    for (const problem of problems) console.log(formatProblem(problem));
    const errors = problems.filter((problem) => problem.severity === "error").length;
    console.log(errors ? `FAILED: ${errors} errors` : `Imported into ${outDir}: ${problems.length} warnings`);
    return errors ? 1 : 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Import failed.");
    return 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
