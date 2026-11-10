import { describe, expect, it } from "vitest";
import { toIndexEntry, toLecture } from "@/content/assemble";
import { minimalLecture } from "./fixtures/minimal";

describe("content assembly", () => {
  it("derives the outline from sections", () => {
    expect(toLecture(minimalLecture).meta.outline).toEqual([
      { id: "s1", title: minimalLecture.sections[0].title, kind: minimalLecture.sections[0].kind },
    ]);
  });

  it("collects exercise sheets into the index entry", () => {
    const lecture = structuredClone(minimalLecture);
    lecture.sections[0].blocks.push({
      kind: "exercises",
      sheet: {
        id: "sheet",
        title: "Practice",
        description: "Practice problems.",
        source: "Demo",
        exercises: [],
      },
    });
    expect(toIndexEntry(toLecture(lecture)).exercises).toHaveLength(1);
  });
});
