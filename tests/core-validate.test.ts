import { describe, expect, it } from "vitest";
import { formatProblem, validateBlock, validateCourseData } from "@core/index";
import { minimalCourse, minimalLecture } from "./fixtures/minimal";

describe("validateBlock", () => {
  it("accepts a valid block", () => expect(validateBlock({ kind: "prose", md: "Hi" })).toEqual([]));
  it("reports an unknown kind as E003", () => expect(validateBlock({ kind: "nope" })[0].code).toBe("E003"));
  it("reports an unknown widget with a block-relative path", () => {
    expect(validateBlock({ kind: "widget", type: "missing", title: "x" })[0]).toMatchObject({ code: "E104", path: "type" });
  });
  it("formats problems on one line", () => {
    expect(formatProblem(validateBlock({ kind: "widget", type: "missing", title: "x" })[0])).toMatch(/^E104  type: /);
  });
});

describe("validateCourseData", () => {
  it("validates in-memory content without a file system", () => {
    const problems = validateCourseData({
      course: minimalCourse,
      lectures: [{ file: "lectures/01-intro.json", data: minimalLecture }],
      exam: null,
      expected: [],
      figures: new Set(),
    });
    expect(problems).toEqual([]);
  });
  it("uses the figures set for E106", () => {
    const lecture = structuredClone(minimalLecture);
    lecture.sections[0].blocks.push({ kind: "figure", src: "a.png", alt: "A", width: 1, height: 1 });
    const data = { course: minimalCourse, lectures: [{ file: "lectures/01-intro.json", data: lecture }], exam: null, expected: [] };
    expect(validateCourseData({ ...data, figures: new Set() }).map((p) => p.code)).toContain("E106");
    expect(validateCourseData({ ...data, figures: new Set(["a.png"]) })).toEqual([]);
  });
});
