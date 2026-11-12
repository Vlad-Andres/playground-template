import { describe, expect, it } from "vitest";
import { buildSiteData, replaceLectures, toLectureFile } from "@core/site";
import { cannedModel, fakeModel, outlineOf, planRefinement, rewriteLecture, TASK, type ModelRequest } from "@core/generate/index";
import { brief, goodLecture } from "./fixtures/generate";

const course = { id: "energy", title: "Energy", shortTitle: "Energy", description: "About energy.", language: "en", indexable: false };
const site = buildSiteData({ key: "energy-12345678", course, lectures: [goodLecture(1, "kinetic"), goodLecture(2, "potential"), goodLecture(3, "work"), goodLecture(4, "power")], exam: null, expected: [] });

function sequence(...replies: unknown[]) {
  const calls: ModelRequest[] = [];
  const model = fakeModel((request) => {
    calls.push(request);
    const reply = replies[Math.min(calls.length - 1, replies.length - 1)];
    return typeof reply === "string" ? reply : JSON.stringify(reply);
  });
  return { model, calls };
}

describe("outlineOf", () => {
  it("lists slug, title, summary and the block kinds per section, not the text", () => {
    const outline = outlineOf(site);
    expect(outline).toHaveLength(4);
    expect(outline[0]).toMatchObject({ slug: "kinetic", title: "Model title 1" });
    expect(outline[0].sections[0].kinds).toEqual(["list"]);
  });
});

describe("planRefinement", () => {
  it("drops unknown slugs, duplicates and empty instructions, and keeps at most three", async () => {
    const reply = {
      summary: "Simpler.",
      course: {},
      lectures: [
        { slug: "nope", instruction: "x" },
        { slug: "kinetic", instruction: "Simpler." },
        { slug: "kinetic", instruction: "Again." },
        { slug: "potential", instruction: "  " },
        { slug: "potential", instruction: "More examples." },
        { slug: "work", instruction: "Shorter." },
        { slug: "power", instruction: "Longer." },
      ],
    };
    const plan = await planRefinement("Make it better", site, brief, sequence(reply).model);
    expect(plan.lectures.map((lecture) => lecture.slug)).toEqual(["kinetic", "potential", "work"]);
  });

  it("a title change alone is a plan", async () => {
    const plan = await planRefinement("Rename it", site, brief, sequence({ summary: "Renamed.", course: { title: "Energy basics" }, lectures: [] }).model);
    expect(plan.course.title).toBe("Energy basics");
  });

  it("throws refine-empty after two empty replies", async () => {
    const { model, calls } = sequence({ summary: "", course: {}, lectures: [] });
    await expect(planRefinement("??", site, brief, model)).rejects.toThrow("refine-empty");
    expect(calls).toHaveLength(2);
    expect(calls[0].system.startsWith(TASK.refinePlan)).toBe(true);
  });

  it("the canned model refines the first lecture, and returns nothing for [empty]", async () => {
    expect((await planRefinement("simpler", site, brief, cannedModel())).lectures).toEqual([{ slug: "kinetic", instruction: "Make it simpler." }]);
    await expect(planRefinement("[empty]", site, brief, cannedModel())).rejects.toThrow("refine-empty");
  });
});

describe("rewriteLecture", () => {
  const existing = toLectureFile(site.lectures[0]);

  it("keeps number and slug even when the model changes them", async () => {
    const changed = { ...goodLecture(9, "other"), meta: { ...goodLecture(9, "other").meta, subtitle: "Changed" } };
    const result = await rewriteLecture(existing, "Simpler", null, brief, sequence(changed).model);
    expect(result.changed).toBe(true);
    expect(result.lecture.meta).toMatchObject({ number: 1, slug: "kinetic", subtitle: "Changed" });
  });

  it("returns the lecture unchanged after two replies that are not JSON", async () => {
    const { model, calls } = sequence("nope", "still nope");
    const result = await rewriteLecture(existing, "Simpler", null, brief, model);
    expect(calls).toHaveLength(2);
    expect(result).toEqual({ lecture: existing, changed: false });
  });

  it("drops one invalid block and keeps the rest", async () => {
    const reply = goodLecture(1, "kinetic");
    reply.sections[1].blocks.push({ kind: "bogus" } as never);
    const result = await rewriteLecture(existing, "Simpler", null, brief, sequence(JSON.stringify(reply), JSON.stringify({ items: [null] })).model);
    expect(result.lecture.sections.flatMap((section) => section.blocks).some((block) => (block as { kind: string }).kind === "bogus")).toBe(false);
    expect(result.lecture.sections[1].blocks.length).toBe(existing.sections[1].blocks.length);
  });

  it("says to use only the lecture's own facts when there are no pages, and sends pages when there are", async () => {
    const without = sequence(JSON.stringify(goodLecture(1, "kinetic")));
    await rewriteLecture(existing, "Simpler", null, brief, without.model);
    expect(without.calls[0].system).toContain("Use only facts that are already in this lecture.");
    const withPages = sequence(JSON.stringify(goodLecture(1, "kinetic")));
    await rewriteLecture(existing, "Simpler", "=== slides.pdf — page 1 ===\nText", brief, withPages.model);
    expect(withPages.calls[0].user).toContain("=== slides.pdf — page 1 ===");
  });

  it("the canned model marks the lecture as refined", async () => {
    const result = await rewriteLecture(existing, "Simpler", null, brief, cannedModel());
    expect(result.lecture.meta.subtitle).toBe("Refined");
  });
});

describe("replaceLectures", () => {
  it("replaces by slug keeping number and slug, ignores unknown slugs, and sets the title", () => {
    const input = structuredClone(site);
    const replacement = { ...goodLecture(7, "kinetic"), meta: { ...goodLecture(7, "kinetic").meta, title: "New kinetic" } };
    const next = replaceLectures(site, [replacement, goodLecture(1, "unknown")], { title: "Energy 2", description: "New." });
    expect(next.lectures[0].meta).toMatchObject({ number: 1, slug: "kinetic", title: "New kinetic" });
    expect(next.lectures).toHaveLength(4);
    expect(next.course).toMatchObject({ title: "Energy 2", description: "New." });
    expect(next.index[0].meta.title).toBe("New kinetic");
    expect(site).toEqual(input);
  });
});
