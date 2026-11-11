import { describe, expect, it } from "vitest";
import { validateCourseData } from "@core/validate";
import { courseSchema, lectureFileSchema } from "@core/schema";
import { DEFAULT_BUDGET, finishCourse, type CoursePlan } from "@core/generate/index";
import { brief, goodLecture, plannedLecture } from "./fixtures/generate";

const course = { id: "energy", title: "Energy", shortTitle: "Energy", description: "d", language: "en", indexable: false };
const plan = (exam: boolean): CoursePlan => ({
  course,
  lectures: [plannedLecture(1, "kinetic"), plannedLecture(2, "potential")],
  ...(exam ? { exam: { title: "Exam training", intro: "Practise." } } : {}),
});
const lectures = [goodLecture(1, "kinetic"), goodLecture(2, "potential")];

function reload(files: Record<string, string>) {
  return validateCourseData({
    course: courseSchema.parse(JSON.parse(files["course.json"])),
    lectures: Object.entries(files)
      .filter(([path]) => path.startsWith("lectures/"))
      .map(([file, text]) => ({ file, data: lectureFileSchema.parse(JSON.parse(text)) })),
    exam: files["exam.json"] ? lectureFileSchema.parse(JSON.parse(files["exam.json"])) : null,
    expected: [],
    figures: new Set(),
  });
}

describe("finishCourse", () => {
  it("writes course.json and NN-slug lecture files that validate with zero errors", () => {
    const { files, problems } = finishCourse(plan(false), lectures, { ...brief, examMode: false });
    expect(Object.keys(files).sort()).toEqual(["course.json", "lectures/01-kinetic.json", "lectures/02-potential.json"]);
    expect(problems.filter((problem) => problem.severity === "error")).toEqual([]);
    expect(reload(files).filter((problem) => problem.severity === "error")).toEqual([]);
    expect(files["course.json"].endsWith("\n")).toBe(true);
  });

  it("adds exam.json in exam mode with unique, prefixed quiz ids and a mock-exam widget", () => {
    const { files, problems } = finishCourse(plan(true), lectures, brief);
    expect(problems.filter((problem) => problem.severity === "error")).toEqual([]);
    const exam = lectureFileSchema.parse(JSON.parse(files["exam.json"]));
    expect(exam.meta).toMatchObject({ number: 0, slug: "exam", title: "Exam training" });
    const ids = exam.quiz.map((question) => question.id);
    expect(ids).toHaveLength(6);
    expect(new Set(ids).size).toBe(6);
    expect(ids[0]).toBe("l1-q1");
    expect(exam.sections[0].blocks.some((block) => block.kind === "widget" && block.type === "mock-exam")).toBe(true);
    expect(reload(files).filter((problem) => problem.severity === "error")).toEqual([]);
  });

  it("writes no exam.json without exam mode", () => {
    expect(finishCourse(plan(true), lectures, { ...brief, examMode: false }).files["exam.json"]).toBeUndefined();
  });

  it("exports the default budget", () => expect(DEFAULT_BUDGET).toEqual({ inputTokens: 600_000, outputTokens: 120_000 }));
});
