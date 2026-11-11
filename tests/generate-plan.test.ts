import { describe, expect, it } from "vitest";
import { fakeModel, planCourse, TASK, type ModelRequest } from "@core/generate/index";
import { brief, materials, plannedLecture, planReply } from "./fixtures/generate";

function sequence(...replies: string[]) {
  const calls: ModelRequest[] = [];
  const model = fakeModel((request) => {
    calls.push(request);
    return replies[Math.min(calls.length - 1, replies.length - 1)];
  });
  return { model, calls };
}

describe("planCourse", () => {
  it("returns a plan with indexable false and the brief's language and level", async () => {
    const { model, calls } = sequence(planReply());
    const plan = await planCourse(materials, brief, model);
    expect(calls).toHaveLength(1);
    expect(calls[0].system.startsWith(TASK.plan)).toBe(true);
    expect(calls[0].user).toContain("=== slides.pdf — page 1 ===");
    expect(plan.course.indexable).toBe(false);
    expect(plan.course.language).toBe("en");
    expect(plan.course.level).toBe("university");
    expect(plan.exam?.title).toBe("Exam training");
  });

  it("applies the brief's title and accent", async () => {
    const { model } = sequence(planReply());
    const plan = await planCourse(materials, { ...brief, title: "My course", accent: "#123456" }, model);
    expect(plan.course.title).toBe("My course");
    expect(plan.course.theme?.accent).toBe("#123456");
  });

  it("clamps 14 lectures to 12 and renumbers them 1..12", async () => {
    const lectures = Array.from({ length: 14 }, (_, i) => plannedLecture(i + 5));
    const plan = await planCourse(materials, brief, sequence(planReply(lectures)).model);
    expect(plan.lectures).toHaveLength(12);
    expect(plan.lectures.map((lecture) => lecture.number)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
  });

  it("makes duplicate slugs unique", async () => {
    const plan = await planCourse(materials, brief, sequence(planReply([plannedLecture(1, "intro"), plannedLecture(2, "intro"), plannedLecture(3, "Intro!")])).model);
    const slugs = plan.lectures.map((lecture) => lecture.slug);
    expect(new Set(slugs).size).toBe(3);
    expect(slugs[0]).toBe("intro");
  });

  it("drops the exam when exam mode is off", async () => {
    const plan = await planCourse(materials, { ...brief, examMode: false }, sequence(planReply()).model);
    expect(plan.exam).toBeUndefined();
  });

  it("retries once with the validation errors, then succeeds with exactly 2 calls", async () => {
    const { model, calls } = sequence('{"course": {"title": 5}, "lectures": []}', planReply());
    const plan = await planCourse(materials, brief, model);
    expect(calls).toHaveLength(2);
    expect(calls[1].user).toContain("PROBLEMS");
    expect(plan.lectures).toHaveLength(1);
  });

  it("throws when the plan is invalid twice", async () => {
    await expect(planCourse(materials, brief, sequence("not json at all", '{"lectures": "x"}').model)).rejects.toThrow(/plan/i);
  });
});
