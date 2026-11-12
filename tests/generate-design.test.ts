import { describe, expect, it } from "vitest";
import {
  cannedModel,
  coursePlanSchema,
  defaultContext,
  designCourse,
  expandOutline,
  fakeModel,
  keepAlternatives,
  planCourse,
  TASK,
  type CoursePlan,
  type DesignOutline,
  type ModelRequest,
} from "@core/generate/index";
import { courseSchema } from "@core/schema";
import { brief, materials, plannedLecture, planReply } from "./fixtures/generate";

const context = defaultContext(brief, "Energy");

function sequence(...replies: string[]) {
  const calls: ModelRequest[] = [];
  const model = fakeModel((request) => {
    calls.push(request);
    return replies[Math.min(calls.length - 1, replies.length - 1)];
  });
  return { model, calls };
}

const alt = (approach: string, titles = ["Part A", "Part B"], file = "slides.pdf") => ({
  approach,
  why: "Another way.",
  lectures: titles.map((title) => ({ title, summary: "S.", pages: [{ file, from: 1, to: 3 }] })),
});

const recommended = { approach: "follow-source", lectures: [{ title: "Lecture 1" }] } as unknown as CoursePlan;

describe("keepAlternatives", () => {
  it("returns [] for none or for something that is not a list", () => {
    expect(keepAlternatives(recommended, [], ["slides.pdf"])).toEqual([]);
    expect(keepAlternatives(recommended, "none", ["slides.pdf"])).toEqual([]);
  });

  it("keeps one valid alternative as alt-1 with slugs", () => {
    const kept = keepAlternatives(recommended, [alt("by-topic")], ["slides.pdf"]);
    expect(kept).toHaveLength(1);
    expect(kept[0]).toMatchObject({ id: "alt-1", approach: "by-topic" });
    expect(kept[0].lectures.map((lecture) => lecture.slug)).toEqual(["part-a", "part-b"]);
  });

  it("keeps at most two", () => {
    const kept = keepAlternatives(recommended, [alt("by-topic"), alt("problem-first"), alt("timeline")], ["slides.pdf"]);
    expect(kept.map((item) => item.id)).toEqual(["alt-1", "alt-2"]);
  });

  it("drops the recommendation's approach, a repeated approach, an unknown approach, the same titles and an unknown file", () => {
    expect(keepAlternatives(recommended, [alt("follow-source")], ["slides.pdf"])).toEqual([]);
    expect(keepAlternatives(recommended, [alt("by-topic"), alt("by-topic", ["X", "Y"])], ["slides.pdf"])).toHaveLength(1);
    expect(keepAlternatives(recommended, [alt("random")], ["slides.pdf"])).toEqual([]);
    expect(keepAlternatives(recommended, [alt("by-topic", [" lecture 1 "])], ["slides.pdf"])).toEqual([]);
    expect(keepAlternatives(recommended, [alt("by-topic", ["A"], "other.pdf")], ["slides.pdf"])).toEqual([]);
  });
});

describe("designCourse", () => {
  it("returns the recommendation, its approach and why, and only valid alternatives", async () => {
    const reply = planReply([plannedLecture(1)], { approach: "by-topic", why: "Grouped by idea.", alternatives: [alt("timeline"), { broken: true }] });
    const { model, calls } = sequence(reply);
    const design = await designCourse(materials, brief, { ...context, subject: "Energy", goals: ["Explain energy"] }, model);
    expect(calls).toHaveLength(1);
    expect(calls[0].system.startsWith(TASK.plan)).toBe(true);
    expect(calls[0].user).toContain("Subject: Energy");
    expect(calls[0].user).toContain("Explain energy");
    expect(design.recommended).toMatchObject({ approach: "by-topic", why: "Grouped by idea." });
    expect(design.alternatives.map((item) => item.approach)).toEqual(["timeline"]);
  });

  it("does not fail because of a bad alternatives value", async () => {
    const design = await designCourse(materials, brief, context, sequence(planReply([plannedLecture(1)], { alternatives: "none" })).model);
    expect(design.alternatives).toEqual([]);
  });

  it("keeps the model's home page and cuts it to its limits", async () => {
    const home = { intro: "Welcome.", highlights: Array.from({ length: 6 }, (_, i) => ({ title: `H${i}`, md: "x" })), studyPath: ["Read", "Practise"] };
    const reply = JSON.stringify({ ...JSON.parse(planReply()), course: { ...JSON.parse(planReply()).course, home } });
    const design = await designCourse(materials, brief, context, sequence(reply).model);
    expect(design.recommended.course.home?.intro).toBe("Welcome.");
    expect(design.recommended.course.home?.highlights).toHaveLength(4);
    expect(courseSchema.safeParse(design.recommended.course).success).toBe(true);
  });

  it("an invalid approach becomes follow-source; goals are cut to four", async () => {
    const lecture = { ...plannedLecture(1), goals: ["a", "b", "c", "d", "e"] };
    const design = await designCourse(materials, brief, context, sequence(planReply([lecture], { approach: "weird" })).model);
    expect(design.recommended.approach).toBe("follow-source");
    expect(design.recommended.lectures[0].goals).toHaveLength(4);
  });

  it("still throws when the plan is invalid twice", async () => {
    await expect(designCourse(materials, brief, context, sequence("nope", "nope").model)).rejects.toThrow(/The course plan was invalid twice/);
  });
});

describe("old plans and planCourse", () => {
  it("a plan stored before this change still parses, with defaults", () => {
    const old = { course: JSON.parse(planReply()).course, lectures: [{ ...plannedLecture(1), goals: undefined }] };
    const parsed = coursePlanSchema.parse({ ...old, course: { ...old.course, indexable: false } });
    expect(parsed).toMatchObject({ approach: "follow-source", why: "" });
    expect(parsed.lectures[0].goals).toEqual([]);
  });

  it("planCourse still returns a plan", async () => {
    const plan = await planCourse(materials, brief, sequence(planReply()).model);
    expect(plan.lectures).toHaveLength(1);
    expect(plan.approach).toBe("follow-source");
  });
});

describe("expandOutline", () => {
  const outline: DesignOutline = {
    id: "alt-1",
    approach: "by-topic",
    why: "By topic.",
    lectures: [
      { slug: "speed", title: "Speed", summary: "About speed.", pages: [{ file: "slides.pdf", from: 1, to: 3 }] },
      { slug: "mass", title: "Mass", summary: "About mass.", pages: [{ file: "slides.pdf", from: 4, to: 6 }] },
    ],
  };

  it("keeps the outline's titles, slugs, summaries, pages and approach even when the model changes them", async () => {
    const reply = planReply([plannedLecture(1, "changed"), plannedLecture(2, "also-changed")]);
    const { model, calls } = sequence(reply);
    const plan = await expandOutline(materials, brief, context, outline, model);
    expect(calls[0].system.startsWith(TASK.expand)).toBe(true);
    expect(calls[0].user).toContain("LECTURES ARE FIXED");
    expect(plan.lectures.map((lecture) => [lecture.number, lecture.slug, lecture.title, lecture.pages[0].from])).toEqual([[1, "speed", "Speed", 1], [2, "mass", "Mass", 4]]);
    expect(plan).toMatchObject({ approach: "by-topic", why: "By topic." });
  });

  it("fails after two replies with the wrong number of lectures", async () => {
    const { model, calls } = sequence(planReply([plannedLecture(1)]), planReply([plannedLecture(1)]));
    await expect(expandOutline(materials, brief, context, outline, model)).rejects.toThrow(/The course plan was invalid twice/);
    expect(calls).toHaveLength(2);
  });

  it("works with the canned model", async () => {
    const plan = await expandOutline(materials, brief, context, outline, cannedModel());
    expect(plan.lectures.map((lecture) => lecture.title)).toEqual(["Speed", "Mass"]);
  });
});

describe("canned model", () => {
  it("returns one by-topic alternative only for the [alternatives] marker", async () => {
    expect((await designCourse(materials, brief, context, cannedModel())).alternatives).toEqual([]);
    const marked = [{ ...materials[0], pages: [{ n: 1, text: `${materials[0].pages[0].text} [alternatives]` }, ...materials[0].pages.slice(1)] }];
    const design = await designCourse(marked, brief, context, cannedModel());
    expect(design.alternatives).toHaveLength(1);
    expect(design.alternatives[0]).toMatchObject({ approach: "by-topic", lectures: [{ title: "Everything" }] });
    expect(design.recommended.course.home?.intro).toBeTruthy();
  });
});
