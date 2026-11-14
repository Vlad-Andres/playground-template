import { describe, expect, it } from "vitest";
import { addExamAttempt, EXAM_HISTORY_LIMIT, latestTwo, reviveExamHistory, type ExamAttempt } from "@site/lib/examHistory";

const attempt = (at: number, score: number, total = 10): ExamAttempt => ({
  at,
  score,
  total,
  byLecture: [{ slug: "one", right: score, total }],
});

describe("exam history", () => {
  it("keeps the newest attempts first, at most the limit", () => {
    let history: ExamAttempt[] = [];
    for (let at = 1; at <= EXAM_HISTORY_LIMIT + 3; at += 1) history = addExamAttempt(history, attempt(at, at % 10));
    expect(EXAM_HISTORY_LIMIT).toBe(10);
    expect(history).toHaveLength(EXAM_HISTORY_LIMIT);
    expect(history[0].at).toBe(EXAM_HISTORY_LIMIT + 3);
  });

  it("ignores attempts without questions", () => {
    expect(addExamAttempt([], attempt(1, 0, 0))).toEqual([]);
  });

  it("returns the latest attempt and the one before it", () => {
    const history = addExamAttempt(addExamAttempt([], attempt(1, 6)), attempt(2, 8));
    expect(latestTwo(history)).toEqual({ latest: history[0], previous: history[1] });
    expect(latestTwo([history[1]])).toEqual({ latest: history[1], previous: null });
    expect(latestTwo([])).toEqual({ latest: null, previous: null });
  });

  it("revives only well-formed stored attempts", () => {
    const good = attempt(5, 7);
    expect(reviveExamHistory([good, { at: "x" }, null, { ...good, byLecture: [{ slug: 3 }] }])).toEqual([
      good,
      { ...good, byLecture: [] },
    ]);
    expect(reviveExamHistory("nope")).toBeNull();
  });
});
