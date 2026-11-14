import { describe, expect, it } from "vitest";
import { citationLabel, linkCitations, type CitableLecture } from "@site/lib/assistant/citations";
import { sitePaths } from "@site/site/paths";

const lectures: CitableLecture[] = [
  { slug: "charge", number: 1, sections: [{ id: "intro", title: "What is charge" }, { id: "current", title: "Current" }] },
  { slug: "ohm", number: 2, sections: [{ id: "law", title: "Ohm's law" }] },
];
const paths = sitePaths("/courses/x");

describe("assistant citations", () => {
  it("labels lecture sections from 1", () => {
    expect(citationLabel(2, 0)).toBe("[L2 §1]");
  });

  it("turns a valid label into a link to that section", () => {
    expect(linkCitations("See [L1 §2].", lectures, paths)).toBe("See [Lecture 1 › Current](/courses/x/lectures/charge/#current).");
  });

  it("links every label in a combined bracket", () => {
    expect(linkCitations("Both [L1 §1; L2 §1]", lectures, paths)).toBe(
      "Both [Lecture 1 › What is charge](/courses/x/lectures/charge/#intro), [Lecture 2 › Ohm's law](/courses/x/lectures/ohm/#law)",
    );
  });

  it("drops brackets around unknown labels and leaves other brackets alone", () => {
    expect(linkCitations("Odd [L9 §1] and [L1 §7].", lectures, paths)).toBe("Odd L9 §1 and L1 §7.");
    expect(linkCitations("A [link](https://a.test), [x] and $[a,b]$", lectures, paths)).toBe("A [link](https://a.test), [x] and $[a,b]$");
  });
});

describe("lecture context labels", () => {
  it("puts a citation label on every section heading of a numbered lecture", async () => {
    const { lectureToContext } = await import("@site/lib/assistant/lectureContext");
    const { loadCourse } = await import("../scripts/content/load");
    const { buildSiteData } = await import("@core/site");
    const loaded = loadCourse("examples/showcase");
    const site = buildSiteData({ key: "x", course: loaded.course!, lectures: loaded.lectures.map((entry) => entry.data), exam: null, expected: [] });
    const lecture = site.lectures[0];
    const context = lectureToContext(lecture);
    lecture.sections.forEach((section, index) => {
      expect(context).toContain(`## ${citationLabel(lecture.meta.number, index)} ${section.title}`);
    });
    const exam = lectureToContext({ ...lecture, meta: { ...lecture.meta, number: 0 } });
    expect(exam).not.toMatch(/\[L0 §/);
  });
});
