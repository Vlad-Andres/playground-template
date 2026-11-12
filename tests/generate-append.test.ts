import { describe, expect, it } from "vitest";
import { appendLectures, buildSiteData } from "@core/site";
import { cannedModel, fakeModel, LIMITS, planAppend, TASK, type ModelRequest } from "@core/generate/index";
import { brief, goodLecture, materials, plannedLecture } from "./fixtures/generate";

const course = { id: "energy", title: "Energy", shortTitle: "Energy", description: "d", language: "en", indexable: false };
const siteWith = (count: number, exam = false) =>
  buildSiteData({
    key: "energy-12345678",
    course,
    lectures: Array.from({ length: count }, (_, i) => goodLecture(i + 1, `lecture-${i + 1}`)),
    exam: exam ? { ...goodLecture(0, "exam"), quiz: [] } : null,
    expected: [],
  });

function sequence(...replies: unknown[]) {
  const calls: ModelRequest[] = [];
  const model = fakeModel((request) => {
    calls.push(request);
    const reply = replies[Math.min(calls.length - 1, replies.length - 1)];
    return typeof reply === "string" ? reply : JSON.stringify(reply);
  });
  return { model, calls };
}

const reply = (restructure: unknown, lectures = [plannedLecture(1, "lecture-1")]) => ({ lectures, restructure });

describe("planAppend", () => {
  it("numbers new lectures after the existing ones and keeps slugs unique", async () => {
    const { model, calls } = sequence(reply({ recommended: false, affected: [], reason: "" }));
    const plan = await planAppend(materials, brief, siteWith(2), model);
    expect(calls[0].system.startsWith(TASK.appendPlan)).toBe(true);
    expect(plan.lectures.map((lecture) => [lecture.number, lecture.slug])).toEqual([[3, "lecture-1-2"]]);
    expect(plan.restructure).toBeNull();
  });

  it.each([
    ["not recommended", { recommended: false, affected: ["lecture-1", "lecture-2"], reason: "r" }],
    ["one affected lecture", { recommended: true, affected: ["lecture-1"], reason: "r" }],
    ["unknown slugs", { recommended: true, affected: ["x", "y"], reason: "r" }],
    ["a duplicate", { recommended: true, affected: ["lecture-1", "lecture-1"], reason: "r" }],
  ])("no reorganisation for %s", async (_name, proposal) => {
    expect((await planAppend(materials, brief, siteWith(3), sequence(reply(proposal)).model)).restructure).toBeNull();
  });

  it("offers a reorganisation for two real lectures", async () => {
    const plan = await planAppend(materials, brief, siteWith(3), sequence(reply({ recommended: true, affected: ["lecture-1", "lecture-2", "x"], reason: "Overlaps." })).model);
    expect(plan.restructure).toEqual({ affected: ["lecture-1", "lecture-2"], reason: "Overlaps." });
  });

  it("caps the new lectures at the course limit (23 existing + 2 planned → 1)", async () => {
    const plan = await planAppend(materials, brief, siteWith(23), sequence(reply(null, [plannedLecture(1, "a"), plannedLecture(2, "b")])).model);
    expect(LIMITS.courseLectures).toBe(24);
    expect(plan.lectures).toHaveLength(1);
  });

  it("throws after two invalid replies", async () => {
    await expect(planAppend(materials, brief, siteWith(1), sequence("nope", { lectures: "x" }).model)).rejects.toThrow(/The course plan was invalid twice/);
  });

  it("the canned model proposes a reorganisation only for [restructure]", async () => {
    expect((await planAppend(materials, brief, siteWith(3), cannedModel())).restructure).toBeNull();
    const marked = [{ ...materials[0], pages: [{ n: 1, text: `${materials[0].pages[0].text} [restructure]` }] }];
    expect((await planAppend(marked, brief, siteWith(3), cannedModel())).restructure?.affected).toEqual(["lecture-1", "lecture-2"]);
  });
});

describe("appendLectures", () => {
  it("adds after the existing lectures with unique slugs, adds exam questions, and leaves existing lectures and the input alone", () => {
    const site = siteWith(2, true);
    const before = structuredClone(site);
    const next = appendLectures(site, [goodLecture(1, "lecture-1"), goodLecture(1, "new-one")]);
    expect(next.lectures.map((lecture) => [lecture.meta.number, lecture.meta.slug])).toEqual([[1, "lecture-1"], [2, "lecture-2"], [3, "lecture-1-2"], [4, "new-one"]]);
    expect(next.lectures.slice(0, 2)).toEqual(before.lectures);
    expect(next.index).toHaveLength(4);
    expect(next.exam?.quiz.map((question) => question.id).slice(0, 3)).toEqual(["l3-q1", "l3-q2", "l3-q3"]);
    expect(next.exam?.quiz).toHaveLength(6);
    expect(site).toEqual(before);
  });
});
