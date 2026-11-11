import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCourse } from "./load";
import { formatProblem, validateCourseData, type Problem } from "../../core/validate";

export { formatProblem };

function figureFiles(contentDir: string): Set<string> {
  const directory = path.join(contentDir, "figures");
  if (!fs.existsSync(directory)) return new Set();
  return new Set(
    fs
      .readdirSync(directory, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => path.relative(directory, path.join(entry.parentPath, entry.name)).split(path.sep).join("/")),
  );
}

export function validateCourse(contentDir: string): Problem[] {
  const loaded = loadCourse(contentDir);
  return [...loaded.problems, ...validateCourseData({ ...loaded, figures: figureFiles(contentDir) })];
}

function main(args: string[]): number {
  const strict = args.includes("--strict");
  const contentDir = args.find((arg) => !arg.startsWith("--")) ?? process.env.CONTENT_DIR ?? "content";
  const loaded = loadCourse(contentDir);
  const problems = validateCourse(contentDir);
  for (const problem of problems) console.log(formatProblem(problem));
  const errors = problems.filter((problem) => problem.severity === "error").length;
  const warnings = problems.filter((problem) => problem.severity === "warning").length;
  if (errors > 0) console.log(`FAILED: ${errors} errors, ${warnings} warnings`);
  else console.log(`OK: ${loaded.lectures.length} lectures, ${errors} errors, ${warnings} warnings`);
  return errors > 0 || (strict && warnings > 0) ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
