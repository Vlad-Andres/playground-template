import { describe, expect, it } from "vitest";
import { daysUntil, sourceLabel } from "@/lib/course-info";

describe("daysUntil", () => {
  const today = new Date(2026, 10, 11, 15, 0); // 11 Nov 2026, local time
  it("counts whole days to the exam", () => expect(daysUntil("2026-11-20", today)).toBe(9));
  it("is 0 on the exam day", () => expect(daysUntil("2026-11-11", today)).toBe(0));
  it("is null for a past or missing date", () => {
    expect(daysUntil("2026-11-10", today)).toBeNull();
    expect(daysUntil(undefined, today)).toBeNull();
  });
});

describe("sourceLabel", () => {
  it("groups pages by file", () => {
    expect(sourceLabel([{ file: "slides.pdf", page: 12 }])).toBe("slides.pdf · p. 12");
    expect(sourceLabel([{ file: "a.pdf", page: 3 }, { file: "a.pdf", page: 4 }, { file: "b.pdf", page: 1 }])).toBe("a.pdf · p. 3, 4 · b.pdf · p. 1");
  });
});
