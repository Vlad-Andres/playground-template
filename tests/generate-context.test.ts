import { describe, expect, it } from "vitest";
import { answerContext, defaultContext, inferContext, resolveBrief, sampleMaterials, CONTEXT_SAMPLE_CHARACTERS, type CourseContext } from "../core/generate/context";
import { cannedModel } from "../core/generate/fake";
import { BudgetExceeded, fakeModel, type ModelRequest } from "../core/generate/model";
import { TASK } from "../core/generate/prompts";
import { requestSchema, type CourseRequest } from "../core/generate/types";
import { loadEval } from "./fixtures/eval/load";

const request = (extra: Partial<CourseRequest> = {}): CourseRequest => ({
  language: "auto",
  level: "auto",
  depth: "standard",
  examMode: false,
  quizzes: true,
  widgets: true,
  context: "",
  locale: "en",
  ...extra,
});

function scripted(...replies: unknown[]) {
  const calls: ModelRequest[] = [];
  const model = fakeModel((req) => {
    calls.push(req);
    const reply = replies[Math.min(calls.length - 1, replies.length - 1)];
    return typeof reply === "string" ? reply : JSON.stringify(reply);
  });
  return { model, calls };
}

const good = { subject: "Search algorithms", level: "university", goals: ["Explain binary search"], assumptions: [], focus: null };
const focus = { options: [{ id: "exam", label: "Pass the exam" }, { id: "deep", label: "Understand it deeply" }] };

describe("requestSchema", () => {
  it("accepts auto language and level and needs a two-letter locale", () => {
    expect(requestSchema.safeParse(request()).success).toBe(true);
    expect(requestSchema.safeParse(request({ language: "ro", level: "school" })).success).toBe(true);
    expect(requestSchema.safeParse(request({ locale: "eng" })).success).toBe(false);
    expect(requestSchema.safeParse({ ...request(), extra: 1 }).success).toBe(false);
  });
});

describe("sampleMaterials", () => {
  it("uses the first two pages of every file, cut to the limit", () => {
    const text = sampleMaterials([loadEval("cs-en.md"), loadEval("vocab-ro.md")]);
    expect(text).toContain("cs-en.md — page 2");
    expect(text).not.toContain("cs-en.md — page 3");
    expect(text).toContain("vocab-ro.md — page 1");
    expect(sampleMaterials([{ name: "big.txt", pages: [{ n: 1, text: "x".repeat(50_000) }] }]).length).toBeLessThanOrEqual(CONTEXT_SAMPLE_CHARACTERS);
  });
});

describe("inferContext", () => {
  it("clear English material with a Romanian portal: English course, no question", async () => {
    const { model } = scripted(good);
    const context = await inferContext([loadEval("cs-en.md")], request({ locale: "ro" }), model);
    expect(context).toMatchObject({ language: "en", languageSource: "material", questions: [], subject: "Search algorithms", level: "university" });
  });

  it("an explicit language wins over the material", async () => {
    const { model } = scripted(good);
    expect(await inferContext([loadEval("cs-en.md")], request({ language: "ro" }), model)).toMatchObject({ language: "ro", languageSource: "user" });
  });

  it("mixed material asks which language", async () => {
    const { model } = scripted(good);
    const context = await inferContext([loadEval("mixed-en-ro.md")], request({ locale: "nl" }), model);
    expect(context.language).toBeNull();
    expect(context.questions).toEqual([{ id: "language", options: [{ id: "ro", label: "Romanian" }, { id: "en", label: "English" }, { id: "nl", label: "Dutch" }] }]);
    const twoOptions = await inferContext([loadEval("mixed-en-ro.md")], request({ locale: "en" }), scripted(good).model);
    expect(twoOptions.questions[0].options.map((option) => option.id)).toEqual(["ro", "en"]);
  });

  it("keeps a valid focus question only when the note is empty", async () => {
    const withFocus = { ...good, focus };
    expect((await inferContext([loadEval("cs-en.md")], request(), scripted(withFocus).model)).questions).toEqual([{ id: "focus", options: focus.options }]);
    expect((await inferContext([loadEval("cs-en.md")], request({ context: "For my exam" }), scripted(withFocus).model)).questions).toEqual([]);
  });

  it.each([
    ["five options", { options: ["a", "b", "c", "d", "e"].map((id) => ({ id, label: id })) }],
    ["a duplicate id", { options: [{ id: "a", label: "A" }, { id: "a", label: "B" }] }],
    ["an 81-character label", { options: [{ id: "a", label: "x".repeat(81) }, { id: "b", label: "B" }] }],
    ["one option", { options: [{ id: "a", label: "A" }] }],
  ])("drops a focus with %s", async (_name, bad) => {
    expect((await inferContext([loadEval("cs-en.md")], request(), scripted({ ...good, focus: bad }).model)).questions).toEqual([]);
  });

  it("falls back after two broken replies, in exactly two calls", async () => {
    const { model, calls } = scripted("not json", { subject: 5 });
    const context = await inferContext([loadEval("cs-en.md")], request(), model);
    expect(calls).toHaveLength(2);
    expect(calls[0].system.startsWith(TASK.context)).toBe(true);
    expect(context).toEqual({ language: "en", languageSource: "material", level: "university", subject: "cs-en", goals: [], assumptions: [], questions: [] });
  });

  it("the person's level wins; an invalid model level becomes university", async () => {
    expect((await inferContext([loadEval("cs-en.md")], request({ level: "school" }), scripted(good).model)).level).toBe("school");
    expect((await inferContext([loadEval("cs-en.md")], request(), scripted({ ...good, level: "expert" }).model)).level).toBe("university");
  });

  it("cuts long fields to their limits", async () => {
    const long = { ...good, subject: "s".repeat(300), goals: Array.from({ length: 9 }, () => "g".repeat(400)), assumptions: Array.from({ length: 9 }, () => "a") };
    const context = await inferContext([loadEval("cs-en.md")], request(), scripted(long).model);
    expect(context.subject).toHaveLength(120);
    expect(context.goals).toHaveLength(5);
    expect(context.goals[0]).toHaveLength(160);
    expect(context.assumptions).toHaveLength(4);
  });

  it("does not swallow a budget stop", async () => {
    const model = { complete: async () => { throw new BudgetExceeded(); } };
    await expect(inferContext([loadEval("cs-en.md")], request(), model)).rejects.toBeInstanceOf(BudgetExceeded);
  });

  it("the canned model asks for focus only on the [ask-focus] marker", async () => {
    const plain = await inferContext([loadEval("cs-en.md")], request(), cannedModel());
    expect(plain).toMatchObject({ subject: "Sample subject", questions: [] });
    const marked = { name: "m.txt", pages: [{ n: 1, text: `${loadEval("cs-en.md").pages[0].text} [ask-focus]` }] };
    expect((await inferContext([marked], request(), cannedModel())).questions[0]).toMatchObject({ id: "focus" });
  });
});

describe("answerContext and resolveBrief", () => {
  const open: CourseContext = {
    language: null,
    languageSource: null,
    level: "university",
    subject: "S",
    goals: [],
    assumptions: [],
    questions: [{ id: "language", options: [{ id: "ro", label: "Romanian" }, { id: "en", label: "English" }] }, { id: "focus", options: focus.options }],
  };

  it("needs an answer to every open question", () => {
    expect(answerContext(open, request(), { language: "ro" })).toEqual({ ok: false });
    expect(answerContext(open, request(), { language: "de", focus: "skip" })).toEqual({ ok: false });
    expect(answerContext(open, request(), { language: "ro", focus: "nope" })).toEqual({ ok: false });
  });

  it("skip keeps the note; a real focus is added to it", () => {
    const skipped = answerContext(open, request({ context: "Note" }), { language: "ro", focus: "skip" });
    expect(skipped).toMatchObject({ ok: true, context: { language: "ro", languageSource: "user", questions: [] }, brief: { language: "ro", context: "Note" } });
    const chosen = answerContext(open, request({ context: "Note" }), { language: "en", focus: "exam" });
    expect(chosen.ok && chosen.brief.context).toBe("Note\nFocus chosen by the learner: Pass the exam");
  });

  it("resolveBrief copies the request and takes language and level from the context; throws while the language is open", () => {
    const ctx = defaultContext({ language: "ro", level: "school", depth: "deep", examMode: true, quizzes: false, widgets: true, context: "" }, "Topic");
    expect(ctx).toEqual({ language: "ro", languageSource: "user", level: "school", subject: "Topic", goals: [], assumptions: [], questions: [] });
    expect(resolveBrief(request({ depth: "deep", title: "T", accent: "#112233", context: "c" }), ctx)).toEqual({ language: "ro", level: "school", depth: "deep", examMode: false, quizzes: true, widgets: true, title: "T", accent: "#112233", context: "c" });
    expect(() => resolveBrief(request(), open)).toThrow();
  });
});
