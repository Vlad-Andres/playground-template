import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { validateCourse } from "../scripts/content/validate";
import { minimalLecture } from "./fixtures/minimal";
import { writeCourse } from "./fixtures/write-course";

const temporaryDirectories: string[] = [];

function directory(): string {
  const value = fs.mkdtempSync(path.join(os.tmpdir(), "content-validation-"));
  temporaryDirectories.push(value);
  return value;
}

function problem(dir: string, code: string) {
  return validateCourse(dir).find((item) => item.code === code);
}

afterEach(() => {
  for (const dir of temporaryDirectories.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe("content validator", () => {
  it("returns no problems for the minimal course", () => {
    const dir = directory();
    writeCourse(dir);
    expect(validateCourse(dir)).toEqual([]);
  });

  it("E001 reports invalid JSON without crashing", () => {
    const dir = directory();
    writeCourse(dir, { raw: { "lectures/01-intro.json": '{ "meta": , }' } });
    expect(problem(dir, "E001")).toMatchObject({ file: "lectures/01-intro.json", path: "" });
  });

  it("E002 reports a missing course or lectures", () => {
    const dir = directory();
    fs.mkdirSync(path.join(dir, "lectures"), { recursive: true });
    expect(problem(dir, "E002")).toMatchObject({ file: "course.json" });

    const other = directory();
    fs.writeFileSync(path.join(other, "course.json"), "{}");
    expect(problem(other, "E002")).toMatchObject({ file: "lectures/" });
  });

  it("E003 reports schema violations", () => {
    const dir = directory();
    writeCourse(dir, { raw: { "lectures/01-intro.json": JSON.stringify({ ...minimalLecture, extra: true }) } });
    expect(problem(dir, "E003")).toMatchObject({ file: "lectures/01-intro.json" });
  });

  it("E101 reports duplicate ids", () => {
    const dir = directory();
    const lecture = structuredClone(minimalLecture);
    lecture.sections.push({ ...lecture.sections[0], id: lecture.sections[0].id });
    writeCourse(dir, { lectures: { "01-intro.json": lecture } });
    expect(problem(dir, "E101")).toMatchObject({ path: "sections[1].id" });
  });

  it("E102 reports unknown concept references", () => {
    const dir = directory();
    const lecture = structuredClone(minimalLecture);
    lecture.sections[0].blocks[1] = { kind: "concepts", ids: ["missing"] };
    writeCourse(dir, { lectures: { "01-intro.json": lecture } });
    expect(problem(dir, "E102")).toMatchObject({ path: "sections[0].blocks[1].ids[0]" });
  });

  it("E103 reports an answer outside the options", () => {
    const dir = directory();
    const lecture = structuredClone(minimalLecture);
    lecture.quiz[0].answerId = "missing";
    writeCourse(dir, { lectures: { "01-intro.json": lecture } });
    expect(problem(dir, "E103")).toMatchObject({ path: "quiz[0].answerId" });
  });

  it("E104 reports an unknown widget", () => {
    const dir = directory();
    const lecture = structuredClone(minimalLecture);
    lecture.sections[0].blocks.push({ kind: "widget", type: "missing-widget", title: "Missing" });
    writeCourse(dir, { lectures: { "01-intro.json": lecture } });
    expect(problem(dir, "E104")).toMatchObject({ path: "sections[0].blocks[2].type" });
  });

  it("E105 reports invalid widget props", () => {
    const dir = directory();
    const lecture = structuredClone(minimalLecture);
    lecture.sections[0].blocks.push({ kind: "widget", type: "quorum-lab", title: "Quorum", props: { bad: true } });
    writeCourse(dir, { lectures: { "01-intro.json": lecture } });
    expect(problem(dir, "E105")).toMatchObject({ path: "sections[0].blocks[2].props" });
  });

  it("E106 reports a missing figure", () => {
    const dir = directory();
    const lecture = structuredClone(minimalLecture);
    lecture.sections[0].blocks.push({
      kind: "figure",
      src: "missing.png",
      alt: "Missing",
      width: 1,
      height: 1,
    });
    writeCourse(dir, { lectures: { "01-intro.json": lecture } });
    expect(problem(dir, "E106")).toMatchObject({ path: "sections[0].blocks[2].src" });
  });

  it("E107 reports a filename that does not match lecture metadata", () => {
    const dir = directory();
    writeCourse(dir, { lectures: { "wrong-name.json": minimalLecture } });
    expect(problem(dir, "E107")).toMatchObject({ file: "lectures/wrong-name.json" });
  });

  it("E108 reports a select answer outside the options", () => {
    const dir = directory();
    const lecture = structuredClone(minimalLecture);
    lecture.sections[0].blocks.push({
      kind: "practice",
      id: "practice",
      tasks: [
        {
          id: "task",
          prompt: "Choose.",
          check: { mode: "select", options: ["a"], answer: ["b"] },
          solution: "a",
        },
      ],
    });
    writeCourse(dir, { lectures: { "01-intro.json": lecture } });
    expect(problem(dir, "E108")).toMatchObject({ path: "sections[0].blocks[2].tasks[0].check.answer[0]" });
  });

  it("E109 reports an expected link to an unknown lecture", () => {
    const dir = directory();
    writeCourse(dir, {
      expected: [
        {
          id: "topic",
          lectures: "Lecture 1",
          title: "Topic",
          links: [{ slug: "missing", label: "Missing" }],
          official: "Know this.",
          items: [],
        },
      ],
    });
    expect(problem(dir, "E109")).toMatchObject({ file: "expected.json", path: "[0].links[0].slug" });
  });

  it("W201 is a warning", () => {
    const dir = directory();
    const lecture = structuredClone(minimalLecture);
    lecture.sections[0].blocks[0] = { kind: "prose", md: Array(81).fill("word").join(" ") };
    writeCourse(dir, { lectures: { "01-intro.json": lecture } });
    expect(problem(dir, "W201")).toMatchObject({ severity: "warning", path: "sections[0].blocks[0].md" });
  });

  it("cross-checks exam.json: wrong answer id gives E103", () => {
    const dir = directory();
    const exam = { ...minimalLecture, meta: { ...minimalLecture.meta, slug: "exam", number: 0 }, quiz: [{ ...minimalLecture.quiz[0], answerId: "zzz" }] };
    writeCourse(dir, { exam });
    expect(problem(dir, "E103")).toMatchObject({ file: "exam.json" });
    expect(problem(dir, "E107")).toBeUndefined();
  });

  it("cross-checks exam.json: unknown widget type gives E104", () => {
    const dir = directory();
    const exam = {
      ...minimalLecture,
      meta: { ...minimalLecture.meta, slug: "exam", number: 0 },
      sections: [{ id: "s1", title: "Exam", kind: "concepts", blocks: [{ kind: "widget", type: "no-such-widget", title: "Missing" }] }],
    };
    writeCourse(dir, { exam });
    expect(problem(dir, "E104")).toMatchObject({ file: "exam.json" });
  });
});
