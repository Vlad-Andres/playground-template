import { describe, expect, it } from "vitest";
import {
  answerContext,
  cannedModel,
  designCourse,
  finishCourse,
  inferContext,
  resolveBrief,
  writeLecture,
  type CourseRequest,
  type ModelClient,
} from "@core/generate/index";
import { loadEval } from "./fixtures/eval/load";

const request: CourseRequest = { language: "auto", level: "auto", depth: "standard", examMode: true, quizzes: true, widgets: true, context: "", locale: "en" };

function counted(): { model: ModelClient; calls: () => number } {
  const inner = cannedModel();
  let calls = 0;
  return {
    model: { complete: (req) => ((calls += 1), inner.complete(req)) },
    calls: () => calls,
  };
}

/** The whole create pipeline with the canned model; returns the decision and what finishCourse found. */
async function run(name: string, answers?: Record<string, string>) {
  const materials = [loadEval(name)];
  const { model, calls } = counted();
  let context = await inferContext(materials, request, model);
  const questions = context.questions;
  let brief;
  if (questions.length) {
    const answered = answerContext(context, request, answers ?? {});
    if (!answered.ok) throw new Error("unanswered");
    context = answered.context;
    brief = answered.brief;
  } else {
    brief = resolveBrief(request, context);
  }
  const design = await designCourse(materials, brief, context, model);
  const lectures = [];
  for (let index = 0; index < design.recommended.lectures.length; index += 1) lectures.push((await writeLecture(design.recommended, index, materials, brief, model)).lecture);
  const { problems } = finishCourse(design.recommended, lectures, brief);
  return { questions, language: brief.language, lectures, problems, calls: calls(), lectureCount: design.recommended.lectures.length };
}

describe("content-fit evaluation set (canned model)", () => {
  it.each([
    ["cs-en.md", "en"],
    ["math-en.md", "en"],
    ["vocab-ro.md", "ro"],
    ["history-en.md", "en"],
  ])("%s → %s, valid, sourced, within the call budget", async (name, language) => {
    const result = await run(name);
    expect(result.questions).toEqual([]);
    expect(result.language).toBe(language);
    expect(result.problems.filter((problem) => problem.severity === "error")).toEqual([]);
    for (const lecture of result.lectures) for (const block of lecture.sections.flatMap((section) => section.blocks)) expect(block.source, `${name} ${block.kind}`).toBeTruthy();
    // G2: at most 2 (context) + 2 (design) + 4 per lecture.
    expect(result.calls).toBeLessThanOrEqual(2 + 2 + 4 * result.lectureCount);
  });

  it("mixed-en-ro.md asks which language, then builds a valid course in the chosen one", async () => {
    const result = await run("mixed-en-ro.md", { language: "ro" });
    expect(result.questions[0]).toMatchObject({ id: "language" });
    expect(result.language).toBe("ro");
    expect(result.problems.filter((problem) => problem.severity === "error")).toEqual([]);
  });
});
