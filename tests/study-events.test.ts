import fs from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { announceStudyEvent, STUDY_EVENT } from "@site/lib/studyEvents";

describe("study events", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("dispatches one browser event with only its type", () => {
    const target = new EventTarget();
    const seen: unknown[] = [];
    target.addEventListener(STUDY_EVENT, (event) => seen.push((event as CustomEvent).detail));
    vi.stubGlobal("window", target);
    announceStudyEvent("quiz_completed");
    expect(STUDY_EVENT).toBe("study-event");
    expect(seen).toEqual([{ type: "quiz_completed" }]);
  });

  it("does nothing outside a browser", () => {
    vi.stubGlobal("window", undefined);
    expect(() => announceStudyEvent("exam_completed")).not.toThrow();
  });

  it("is announced when a quiz, a review rating and a practice exam complete, and the template makes no network call for it", () => {
    for (const [file, type] of [
      ["src/components/content/QuizCard.tsx", "quiz_completed"],
      ["src/hooks/useDifficult.ts", "review_completed"],
      ["src/widgets/core/MockExam.tsx", "exam_completed"],
    ]) expect(fs.readFileSync(file, "utf8"), file).toContain(`announceStudyEvent("${type}")`);
    expect(fs.readFileSync("src/lib/studyEvents.ts", "utf8")).not.toMatch(/fetch|sendBeacon|XMLHttpRequest/);
  });
});
