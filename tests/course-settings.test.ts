import { describe, expect, it } from "vitest";
import { blockSchema, courseSchema } from "@core/schema";
import { readableInk } from "@core/color";
import { minimalCourse } from "./fixtures/minimal";

const ok = (value: unknown) => courseSchema.safeParse({ ...minimalCourse, ...(value as object) }).success;

describe("course settings", () => {
  it("accepts every new optional field", () => {
    expect(
      ok({
        level: "university",
        domains: ["core", "math", "cs", "memorise", "humanities"],
        examDate: "2026-12-01",
        theme: { accent: "#14532d", corners: "sharp" },
        features: { assistant: false, difficult: true, search: false },
      }),
    ).toBe(true);
  });
  it("still accepts a course without them", () => expect(ok({})).toBe(true));
  it("rejects a named accent colour", () => expect(ok({ theme: { accent: "red" } })).toBe(false));
  it("rejects a non-ISO exam date", () => expect(ok({ examDate: "11/12/2026" })).toBe(false));
  it("rejects an unknown level and domain", () => {
    expect(ok({ level: "phd" })).toBe(false);
    expect(ok({ domains: ["chemistry"] })).toBe(false);
  });
  it("rejects unknown theme keys", () => expect(ok({ theme: { font: "serif" } })).toBe(false));
});

describe("block source references", () => {
  it("accepts 1-5 page references on any block", () => {
    expect(blockSchema.safeParse({ kind: "prose", md: "x", source: [{ file: "slides.pdf", page: 12 }] }).success).toBe(true);
    expect(blockSchema.safeParse({ kind: "recall", cards: [], source: [{ file: "a.pdf", page: 1 }] }).success).toBe(true);
  });
  it("rejects an empty source list", () => {
    expect(blockSchema.safeParse({ kind: "prose", md: "x", source: [] }).success).toBe(false);
  });
  it("rejects more than five and non-positive pages", () => {
    const six = Array.from({ length: 6 }, (_, page) => ({ file: "a.pdf", page: page + 1 }));
    expect(blockSchema.safeParse({ kind: "prose", md: "x", source: six }).success).toBe(false);
    expect(blockSchema.safeParse({ kind: "prose", md: "x", source: [{ file: "a.pdf", page: 0 }] }).success).toBe(false);
  });
});

describe("readableInk", () => {
  it("uses black on white", () => expect(readableInk("#ffffff")).toBe("#000000"));
  it("uses white on dark green", () => expect(readableInk("#14532d")).toBe("#ffffff"));
  it("uses black on yellow", () => expect(readableInk("#facc15")).toBe("#000000"));
});
