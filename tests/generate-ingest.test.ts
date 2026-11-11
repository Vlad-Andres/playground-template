import { describe, expect, it } from "vitest";
import { briefSchema, checkMaterials, LIMITS, materialSchema, renderMaterials, type Material } from "@core/generate/index";

const page = (n: number, text = "x".repeat(200)) => ({ n, text });
const material = (name: string, pages: number, text?: string): Material => ({ name, pages: Array.from({ length: pages }, (_, i) => page(i + 1, text)) });

describe("checkMaterials", () => {
  it("accepts normal material", () => expect(checkMaterials([material("a.pdf", 3)])).toEqual({ ok: true }));
  it("empty", () => {
    expect(checkMaterials([])).toMatchObject({ ok: false, code: "empty" });
    expect(checkMaterials([{ name: "a.pdf", pages: [] }])).toMatchObject({ ok: false, code: "empty" });
  });
  it("too-many-files", () => {
    expect(checkMaterials(Array.from({ length: LIMITS.files + 1 }, (_, i) => material(`f${i}.pdf`, 1)))).toMatchObject({ ok: false, code: "too-many-files" });
  });
  it("too-many-pages", () => expect(checkMaterials([material("a.pdf", LIMITS.pages + 1)])).toMatchObject({ ok: false, code: "too-many-pages" }));
  it("too-long", () => expect(checkMaterials([material("a.pdf", 2, "y".repeat(LIMITS.characters / 2 + 1))])).toMatchObject({ ok: false, code: "too-long" }));
  it("scanned: under 40 characters per page on average", () => {
    expect(checkMaterials([material("scan.pdf", 10, "p. 1")])).toMatchObject({ ok: false, code: "scanned" });
  });
});

describe("renderMaterials", () => {
  const materials = [material("slides.pdf", 5), { name: "notes.txt", pages: [page(1, "hello")] }];
  it("heads each page with file name and page number", () => {
    const text = renderMaterials(materials);
    expect(text).toContain("=== slides.pdf — page 3 ===\n" + "x".repeat(200));
    expect(text).toContain("=== notes.txt — page 1 ===\nhello");
  });
  it("returns only the pages in the given ranges", () => {
    const text = renderMaterials(materials, [{ file: "slides.pdf", from: 2, to: 3 }]);
    expect(text.match(/=== /g)).toHaveLength(2);
    expect(text).toContain("slides.pdf — page 2");
    expect(text).toContain("slides.pdf — page 3");
    expect(text).not.toContain("notes.txt");
  });
});

describe("schemas", () => {
  it("parse a brief and a material", () => {
    expect(briefSchema.safeParse({ language: "en", level: "university", depth: "standard", examMode: true, quizzes: true, widgets: true, context: "" }).success).toBe(true);
    expect(briefSchema.safeParse({ language: "en", level: "phd", depth: "standard", examMode: true, quizzes: true, widgets: true, context: "" }).success).toBe(false);
    expect(briefSchema.safeParse({ language: "en", level: "school", depth: "cram", examMode: false, quizzes: true, widgets: true, context: "x".repeat(LIMITS.contextCharacters + 1) }).success).toBe(false);
    expect(materialSchema.safeParse(material("a.pdf", 1)).success).toBe(true);
  });
});
