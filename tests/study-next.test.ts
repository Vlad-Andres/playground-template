import { describe, expect, it } from "vitest";
import { newItem } from "@site/lib/difficult";
import type { ExamAttempt } from "@site/lib/examHistory";
import type { ProgressState } from "@site/lib/progress";
import { STUDY_NEXT_LIMIT, studyNext } from "@site/lib/studyNext";

const lectures = [1, 2, 3, 4, 5].map((number) => ({ slug: `l${number}`, number, title: `Lecture ${number}` }));
const started = (quizBest = 0, quizTotal = 0) => ({ sections: ["a"], quizBest, quizTotal });
const exam = (rows: [string, number, number][]): ExamAttempt => ({
  at: 1,
  score: rows.reduce((sum, [, right]) => sum + right, 0),
  total: rows.reduce((sum, [, , total]) => sum + total, 0),
  byLecture: rows.map(([slug, right, total]) => ({ slug, right, total })),
});

describe("studyNext", () => {
  it("suggests the first lecture to a new visitor", () => {
    expect(studyNext({ lectures, progress: {}, difficult: [], exam: null })).toEqual([
      { slug: "l1", number: 1, title: "Lecture 1", kind: "start", reason: "Not started yet" },
    ]);
  });

  it("ranks weak exam lectures, then weak quizzes, then flagged parts, then the next unstarted lecture", () => {
    const progress: ProgressState = { l1: started(5, 5), l2: started(2, 5), l3: started(5, 5), l4: started(5, 5) };
    const difficult = [newItem("l3", "s", null, 0), newItem("l3", "t", 2, 0)];
    const result = studyNext({ lectures, progress, difficult, exam: exam([["l4", 1, 3], ["l1", 3, 3]]) });
    expect(result.map((item) => [item.slug, item.kind])).toEqual([["l4", "exam"], ["l2", "quiz"], ["l3", "flagged"]]);
    expect(result.map((item) => item.reason)).toEqual([
      "2 of 3 wrong in your last practice exam",
      "Best quiz score 2 / 5",
      "2 parts you marked as difficult",
    ]);
  });

  it("lists each lecture once, under its strongest reason, ties in lecture order", () => {
    const progress: ProgressState = { l2: started(1, 5), l3: started(1, 5) };
    const result = studyNext({ lectures, progress, difficult: [newItem("l2", "s", null, 0)], exam: exam([["l3", 0, 2], ["l2", 0, 2]]) });
    expect(result.map((item) => [item.slug, item.kind])).toEqual([["l2", "exam"], ["l3", "exam"], ["l1", "start"]]);
  });

  it("returns at most the limit and nothing when everything is on track", () => {
    const weak: ProgressState = Object.fromEntries(lectures.map((lecture) => [lecture.slug, started(0, 5)]));
    expect(studyNext({ lectures, progress: weak, difficult: [], exam: null })).toHaveLength(STUDY_NEXT_LIMIT);
    const strong: ProgressState = Object.fromEntries(lectures.map((lecture) => [lecture.slug, started(5, 5)]));
    expect(studyNext({ lectures, progress: strong, difficult: [], exam: null })).toEqual([]);
  });

  it("ignores exam rows and flags for lectures the course no longer has", () => {
    const result = studyNext({ lectures: lectures.slice(0, 1), progress: { l1: started(5, 5) }, difficult: [newItem("gone", "s", null, 0)], exam: exam([["gone", 0, 3]]) });
    expect(result).toEqual([]);
  });
});

describe("quizHref", () => {
  it("links to the quiz section id from the outline, or the lecture when there is none", async () => {
    const { quizHref, sitePaths } = await import("@site/site/paths");
    const paths = sitePaths("/courses/x");
    expect(quizHref(paths, { outline: [{ id: "intro", kind: "intuition" }, { id: "practice", kind: "quiz" }] }, "l1")).toBe("/courses/x/lectures/l1/#practice");
    expect(quizHref(paths, { outline: [] }, "l1")).toBe("/courses/x/lectures/l1/");
  });
});
