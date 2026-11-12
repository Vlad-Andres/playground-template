import { describe, expect, it } from "vitest";
import { cannedModel, customLimit, fakeModel, lecturePrompt, planCourse, TASK, writeLecture, type Brief, type CoursePlan, type ModelRequest } from "@core/generate/index";
import { brief, goodLecture, materials, plannedLecture } from "./fixtures/generate";

const src = [{ file: "slides.pdf", page: 1 }];
const custom = (id: string, html = '<button onclick="pg.done(1)">Done</button>') => ({ kind: "custom", id, title: `Exercise ${id}`, description: "Press the button.", html, source: src });

function planWith(customPlanned: boolean): CoursePlan {
  const lecture = plannedLecture(1, "kinetic");
  if (customPlanned) lecture.sections = [...lecture.sections, { id: "try", title: "Try it", kind: "playground", blocks: ["custom"] }];
  return { course: { id: "energy", title: "Energy", shortTitle: "Energy", description: "d", language: "en", indexable: false }, lectures: [lecture], approach: "follow-source", why: "" };
}

function scripted(handlers: Partial<Record<keyof typeof TASK, (request: ModelRequest) => string>>) {
  const calls: { task: string; request: ModelRequest }[] = [];
  const model = fakeModel((request) => {
    const task = (Object.keys(TASK) as (keyof typeof TASK)[]).find((key) => request.system.startsWith(TASK[key]));
    if (!task || !handlers[task]) throw new Error(`unexpected call ${request.system.slice(0, 20)}`);
    calls.push({ task, request });
    return handlers[task](request);
  });
  return { model, calls };
}

function lectureWith(...extra: object[]) {
  const lecture = goodLecture(1, "kinetic");
  lecture.sections.push({ id: "try", title: "Try it", kind: "playground", blocks: extra as never });
  return JSON.stringify(lecture);
}

const prompt = (b: Brief, customPlanned: boolean) => {
  const planned = planWith(customPlanned).lectures[0];
  return lecturePrompt({ brief: b, lecturePlan: planned, courseTitle: "Energy", pagesText: "", pageCount: 6, customLimit: customLimit(b, planned) }).system;
};

describe("lecture prompt", () => {
  it("asks for fit, not variety, and for every goal to be covered", () => {
    const system = lecturePrompt({ brief, lecturePlan: plannedLecture(1), courseTitle: "Energy", pagesText: "", pageCount: 6, customLimit: 0 }).system;
    expect(system).not.toContain("5 different");
    expect(system).toContain("Do not add a kind for variety.");
    expect(system).toContain("At least 1 recall or practice block.");
    expect(system).toContain("Widgets are optional");
    expect(system).toContain("Every goal in the plan must be covered by at least one block.");
  });

  it('says "Do not use custom blocks" when nothing allows them', () => {
    expect(prompt({ ...brief, depth: "cram" }, true)).toContain('Do not use "custom" blocks.');
    expect(prompt({ ...brief, widgets: false }, true)).toContain('Do not use "custom" blocks.');
    expect(prompt(brief, false)).toContain('Do not use "custom" blocks.');
  });

  it("customLimit is 0 / 1 / 2 by depth, and 0 without widgets or a planned custom section", () => {
    const planned = planWith(true).lectures[0];
    expect([customLimit({ ...brief, depth: "cram" }, planned), customLimit({ ...brief, depth: "standard" }, planned), customLimit({ ...brief, depth: "deep" }, planned)]).toEqual([0, 1, 2]);
    expect(customLimit({ ...brief, widgets: false }, planned)).toBe(0);
    expect(customLimit(brief, planWith(false).lectures[0])).toBe(0);
  });

  it("describes the custom exercise and its limit when it is allowed", () => {
    const system = lecturePrompt({ brief, lecturePlan: planWith(true).lectures[0], courseTitle: "Energy", pagesText: "", pageCount: 6, customLimit: 1 }).system;
    expect(system).toContain("CUSTOM EXERCISE");
    expect(system).toContain("pg.done(score)");
    expect(system).toContain("at most 1");
    expect(system).not.toContain('Do not use "custom" blocks.');
  });
});

describe("custom exercises in writeLecture", () => {
  it("drops a custom block in a lecture that did not plan one (W309)", async () => {
    const { model } = scripted({ lecture: () => lectureWith(custom("a")), repair: () => JSON.stringify({ items: [null] }), improve: () => "{}" });
    const result = await writeLecture(planWith(false), 0, materials, brief, model);
    expect(result.lecture.sections.flatMap((section) => section.blocks).some((block) => block.kind === "custom")).toBe(false);
    expect(result.dropped.map((problem) => problem.code)).toContain("W309");
  });

  it("keeps one of two valid custom blocks at depth standard", async () => {
    const { model } = scripted({ lecture: () => lectureWith(custom("a"), custom("b")), improve: () => "{}" });
    const result = await writeLecture(planWith(true), 0, materials, { ...brief, depth: "standard" }, model);
    const kept = result.lecture.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "custom");
    expect(kept).toHaveLength(1);
    expect(result.dropped.filter((problem) => problem.code === "W309")).toHaveLength(1);
  });

  it("sends a custom block that uses fetch( to repair and drops it when still bad", async () => {
    const bad = custom("net", "<script>fetch('https://x.example')</script>");
    const { model, calls } = scripted({ lecture: () => lectureWith(bad), repair: () => JSON.stringify({ items: [bad] }), improve: () => "{}" });
    const result = await writeLecture(planWith(true), 0, materials, brief, model);
    expect(calls.filter((call) => call.task === "repair")).toHaveLength(1);
    expect(result.lecture.sections.flatMap((section) => section.blocks).some((block) => block.kind === "custom")).toBe(false);
    expect(result.dropped.some((problem) => problem.code === "E110")).toBe(true);
  });

  it("the canned model plans and writes one custom exercise only for the [custom] marker", async () => {
    const marked = [{ ...materials[0], pages: materials[0].pages.map((page, i) => (i === 0 ? { ...page, text: `${page.text} [custom]` } : page)) }];
    const plan = await planCourse(marked, brief, cannedModel());
    expect(plan.lectures[0].sections.some((section) => section.blocks.includes("custom"))).toBe(true);
    const { lecture } = await writeLecture(plan, 0, marked, brief, cannedModel());
    expect(lecture.sections.flatMap((section) => section.blocks).filter((block) => block.kind === "custom")).toHaveLength(1);
    const plain = await writeLecture(await planCourse(materials, brief, cannedModel()), 0, materials, brief, cannedModel());
    expect(plain.lecture.sections.flatMap((section) => section.blocks).some((block) => block.kind === "custom")).toBe(false);
  });
});
