import { describe, expect, it } from "vitest";
import { bundleSchema, isBundlePath, joinTextItems, makeBundle, splitTextIntoPages } from "@core/generate/index";

describe("isBundlePath", () => {
  it.each(["course.json", "exam.json", "lectures/01-intro.json"])("allows %s", (path) => expect(isBundlePath(path)).toBe(true));
  it.each(["../x.json", "/etc/x", "lectures/../course.json", "expected.json", "lectures/sub/x.json", "figures/a.png", "lectures\\x.json", ""])(
    "refuses %j",
    (path) => expect(isBundlePath(path)).toBe(false),
  );
  it("makeBundle refuses a bad path and bundleSchema rejects it", () => {
    expect(() => makeBundle({ "../x.json": "{}" })).toThrow();
    expect(bundleSchema.safeParse({ format: "playground-bundle@1", files: { "/etc/x": "" } }).success).toBe(false);
  });
});

describe("text helpers", () => {
  it("joins pdf.js items with line ends", () => {
    expect(joinTextItems([{ str: "Hello", hasEOL: false }, { str: "world", hasEOL: true }, { str: "Next line", hasEOL: false }, { nope: 1 }])).toBe("Hello world\nNext line");
  });
  it("splits long text into pages of about 3000 characters", () => {
    const text = Array.from({ length: 40 }, (_, i) => `Paragraph ${i} ${"word ".repeat(40)}`).join("\n\n");
    const pages = splitTextIntoPages(text);
    expect(pages.length).toBeGreaterThan(2);
    expect(pages.every((page) => page.text.length <= 3000)).toBe(true);
    expect(pages.map((page) => page.n)).toEqual(pages.map((_, i) => i + 1));
    expect(pages.map((page) => page.text).join(" ").replace(/\s+/g, " ")).toBe(text.replace(/\s+/g, " ").trim());
  });
});
