import { describe, expect, it } from "vitest";
import { lintLecture } from "@core/generate/index";
import type { LectureFile } from "@core/schema";
import { brief, goodLecture } from "./fixtures/generate";

const good = () => structuredClone(goodLecture()) as LectureFile;
const codes = (lecture: LectureFile, b = brief) => lintLecture(lecture, b).map((problem) => problem.code);

describe("lintLecture", () => {
  it("is clean for a lecture that meets the standard targets", () => expect(codes(good())).toEqual([]));
  it("W301 fewer concepts than the depth target", () => {
    const lecture = good();
    lecture.concepts = lecture.concepts.slice(0, 2);
    lecture.sections[1].blocks[1] = { kind: "concepts", ids: ["ke"], source: [{ file: "slides.pdf", page: 1 }] };
    expect(codes(lecture)).toContain("W301");
  });
  it("W302 fewer quiz questions than the target, only while quizzes are on", () => {
    const lecture = good();
    lecture.quiz = lecture.quiz.slice(0, 2);
    expect(codes(lecture)).toContain("W302");
    expect(codes(lecture, { ...brief, quizzes: false })).not.toContain("W302");
  });
  it("W303 no recall or practice block", () => {
    const lecture = good();
    lecture.sections[1].blocks = lecture.sections[1].blocks.filter((block) => block.kind !== "recall" && block.kind !== "practice");
    expect(codes(lecture)).toContain("W303");
  });
  it("W304 more than 60% prose", () => {
    const lecture = good();
    const prose = { kind: "prose" as const, md: "Text.", source: [{ file: "slides.pdf", page: 1 }] };
    lecture.sections[1].blocks.push(prose, prose, prose, prose, prose, prose, prose, prose, prose, prose);
    expect(codes(lecture)).toContain("W304");
  });
  it("W305 no table, steps, timeline, widget, formula or code", () => {
    const lecture = good();
    lecture.sections[1].blocks = lecture.sections[1].blocks.filter((block) => block.kind !== "table" && block.kind !== "widget");
    expect(codes(lecture)).toContain("W305");
  });
  it("W306 a block without source", () => {
    const lecture = good();
    delete lecture.sections[0].blocks[0].source;
    expect(codes(lecture)).toContain("W306");
  });
});

describe("lintLecture size and variety", () => {
  it("W307 too few blocks for the number of pages", () => {
    expect(lintLecture(good(), brief, 60).map((problem) => problem.code)).toContain("W307");
    expect(lintLecture(good(), brief, 6).map((problem) => problem.code)).not.toContain("W307");
  });
  it("W308 fewer than five block kinds", () => {
    const lecture = good();
    expect(codes(lecture)).not.toContain("W308");
    lecture.sections[1].blocks = lecture.sections[1].blocks.filter((block) => !["widget", "practice", "table"].includes(block.kind));
    expect(codes(lecture)).toContain("W308");
  });
});
