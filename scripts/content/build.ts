import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toIndexEntry, toLecture } from "../../src/content/assemble";
import { loadCourse, type Problem } from "./load";
import { validateCourse } from "./validate";

function writeJson(file: string, value: unknown): void {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

export function buildContent(contentDir: string, generatedDir: string, publicDir: string): Problem[] {
  const problems = validateCourse(contentDir);
  if (problems.some((problem) => problem.severity === "error")) return problems;

  const loaded = loadCourse(contentDir);
  const lectures = loaded.lectures.map(({ data }) => toLecture(data)).sort((a, b) => a.meta.number - b.meta.number);
  fs.rmSync(generatedDir, { recursive: true, force: true });
  fs.mkdirSync(generatedDir, { recursive: true });
  writeJson(path.join(generatedDir, "course.json"), loaded.course);
  writeJson(path.join(generatedDir, "lectures.json"), lectures);
  writeJson(path.join(generatedDir, "index.json"), lectures.map(toIndexEntry));
  writeJson(path.join(generatedDir, "exam.json"), loaded.exam ? toLecture(loaded.exam) : null);
  writeJson(path.join(generatedDir, "expected.json"), loaded.expected);

  const publicFigures = path.join(publicDir, "figures");
  fs.rmSync(publicFigures, { recursive: true, force: true });
  const sourceFigures = path.join(contentDir, "figures");
  if (fs.existsSync(sourceFigures)) fs.cpSync(sourceFigures, publicFigures, { recursive: true });
  return problems;
}

function main(args: string[]): number {
  const contentDir = args.find((arg) => !arg.startsWith("--")) ?? process.env.CONTENT_DIR ?? "content";
  const generatedDir = path.resolve("src/content/generated");
  const problems = buildContent(contentDir, generatedDir, path.resolve("public"));
  for (const problem of problems) console.log(`${problem.code} ${problem.file} ${problem.path}: ${problem.message} Fix: ${problem.fix}`);
  const errors = problems.filter((problem) => problem.severity === "error").length;
  const warnings = problems.filter((problem) => problem.severity === "warning").length;
  console.log(errors ? `FAILED: ${errors} errors, ${warnings} warnings` : `OK: ${problems.length ? "content built" : "content built"}, ${errors} errors, ${warnings} warnings`);
  return errors ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
