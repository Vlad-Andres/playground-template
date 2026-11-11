import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { importBundle } from "../scripts/content/import";
import { validateCourse } from "../scripts/content/validate";
import { parseArgs, runGenerate } from "../scripts/generate/cli";
import { makeBundle } from "@core/generate/index";
import { minimalCourse, minimalLecture } from "./fixtures/minimal";

const temporary: string[] = [];
function tempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "generate-cli-"));
  temporary.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of temporary.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe("npm run import", () => {
  it("refuses paths outside the content folder", () => {
    const out = tempDir();
    for (const bad of ["../x.json", "/etc/x"]) {
      const bundle = JSON.stringify({ format: "playground-bundle@1", files: { "course.json": "{}", [bad]: "{}" } });
      expect(() => importBundle(bundle, out)).toThrow();
    }
    expect(fs.existsSync(path.join(out, "..", "x.json"))).toBe(false);
  });

  it("imports a valid bundle, replacing old lectures, exam and expected", () => {
    const out = tempDir();
    fs.mkdirSync(path.join(out, "lectures"));
    fs.writeFileSync(path.join(out, "lectures", "09-old.json"), "{}");
    fs.writeFileSync(path.join(out, "expected.json"), "[]");
    const bundle = makeBundle({ "course.json": JSON.stringify(minimalCourse), "lectures/01-intro.json": JSON.stringify(minimalLecture) });
    const problems = importBundle(JSON.stringify(bundle), out);
    expect(problems.filter((problem) => problem.severity === "error")).toEqual([]);
    expect(fs.readdirSync(path.join(out, "lectures"))).toEqual(["01-intro.json"]);
    expect(fs.existsSync(path.join(out, "expected.json"))).toBe(false);
    expect(validateCourse(out).filter((problem) => problem.severity === "error")).toEqual([]);
  });
});

describe("npm run generate -- --fake", () => {
  it("writes a valid course with an exam and a bundle", async () => {
    const materials = tempDir();
    const out = tempDir();
    fs.writeFileSync(path.join(materials, "notes.md"), "# Notes\n\n" + "Energy is conserved in a closed system. ".repeat(200));
    fs.writeFileSync(path.join(materials, "extra.txt"), "Kinetic energy depends on speed squared. ".repeat(100));
    fs.writeFileSync(path.join(materials, "ignored.png"), "x");
    const bundle = path.join(out, "bundle.json");
    const lines: string[] = [];
    const summary = await runGenerate(parseArgs(["--materials", materials, "--out", out, "--exam", "--fake", "--bundle", bundle]), (line) => lines.push(line));
    expect(summary.errors).toEqual([]);
    expect(summary.lectures).toBe(2);
    expect(validateCourse(out).filter((problem) => problem.severity === "error")).toEqual([]);
    expect(fs.existsSync(path.join(out, "exam.json"))).toBe(true);
    expect(JSON.parse(fs.readFileSync(bundle, "utf8")).format).toBe("playground-bundle@1");
    expect(lines[0]).toContain("extra.txt");
    expect(lines.some((line) => line.startsWith("plan: 2 lectures"))).toBe(true);
  });
});
