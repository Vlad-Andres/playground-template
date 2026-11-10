import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildContent } from "../scripts/content/build";
import { minimalLecture } from "./fixtures/minimal";
import { writeCourse } from "./fixtures/write-course";

const temporaryDirectories: string[] = [];

function directory(): string {
  const value = fs.mkdtempSync(path.join(os.tmpdir(), "content-build-"));
  temporaryDirectories.push(value);
  return value;
}

afterEach(() => {
  for (const dir of temporaryDirectories.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe("content build", () => {
  it("writes the five generated files", () => {
    const root = directory();
    const content = path.join(root, "content");
    const generated = path.join(root, "generated");
    const publicDirectory = path.join(root, "public");
    writeCourse(content);

    expect(buildContent(content, generated, publicDirectory)).toEqual([]);
    expect(fs.readdirSync(generated).sort()).toEqual(["course.json", "exam.json", "expected.json", "index.json", "lectures.json"]);
    expect(JSON.parse(fs.readFileSync(path.join(generated, "exam.json"), "utf8"))).toBeNull();
    expect(JSON.parse(fs.readFileSync(path.join(generated, "expected.json"), "utf8"))).toEqual([]);
  });

  it("writes nothing when content is invalid", () => {
    const root = directory();
    const content = path.join(root, "content");
    const generated = path.join(root, "generated");
    writeCourse(content, {
      lectures: {
        "01-intro.json": {
          ...minimalLecture,
          sections: [{ ...minimalLecture.sections[0], blocks: [{ kind: "widget", type: "missing", title: "Missing" }] }],
        },
      },
    });

    expect(buildContent(content, generated, path.join(root, "public")).some((item) => item.code === "E104")).toBe(true);
    expect(fs.existsSync(path.join(generated, "lectures.json"))).toBe(false);
  });

  it("copies figures", () => {
    const root = directory();
    const content = path.join(root, "content");
    const figure = path.join(content, "figures", "a", "x.png");
    writeCourse(content);
    fs.mkdirSync(path.dirname(figure), { recursive: true });
    fs.writeFileSync(figure, "image");
    const publicDirectory = path.join(root, "public");

    buildContent(content, path.join(root, "generated"), publicDirectory);
    expect(fs.readFileSync(path.join(publicDirectory, "figures", "a", "x.png"), "utf8")).toBe("image");
  });
});
