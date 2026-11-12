import { describe, expect, it } from "vitest";
import { decideLanguage, detectLanguage, type LanguageGuess } from "../core/generate/language";
import { loadEval } from "./fixtures/eval/load";

const page = (text: string, n = 1) => ({ n, text });

describe("detectLanguage", () => {
  it.each(["cs-en.md", "math-en.md", "history-en.md"])("%s is clearly English", (name) => {
    expect(detectLanguage([loadEval(name)])).toMatchObject({ kind: "clear", top: "en" });
  });

  it("vocab-ro.md is clearly Romanian", () => {
    expect(detectLanguage([loadEval("vocab-ro.md")])).toMatchObject({ kind: "clear", top: "ro" });
  });

  it("mixed-en-ro.md is mixed, Romanian first", () => {
    expect(detectLanguage([loadEval("mixed-en-ro.md")])).toMatchObject({ kind: "mixed", top: "ro", second: "en" });
  });

  it("numbers only are unknown", () => {
    expect(detectLanguage([{ name: "n.txt", pages: [page("1 2 3 4 5 6 7 8 9 10 3.14 2.71 100 200")] }])).toEqual({ kind: "unknown", top: null, second: null, share: 0 });
  });

  it("English with one-letter variables a, i, o and e stays English", () => {
    const text = "Let a be the first value and let i be the index of the loop. The value of o is the output of the function, and e is the base of the natural logarithm. We compare a with e in the loop, and the index i is increased by one in each step until it reaches the end of the array.";
    expect(detectLanguage([{ name: "v.txt", pages: [page(text)] }])).toMatchObject({ kind: "clear", top: "en" });
  });

  it("works across several files", () => {
    expect(detectLanguage([loadEval("cs-en.md"), loadEval("math-en.md")])).toMatchObject({ kind: "clear", top: "en", share: 1 });
  });
});

describe("decideLanguage", () => {
  const clearEn: LanguageGuess = { kind: "clear", top: "en", second: null, share: 1 };
  const mixed: LanguageGuess = { kind: "mixed", top: "ro", second: "en", share: 0.67 };
  const unknown: LanguageGuess = { kind: "unknown", top: null, second: null, share: 0 };

  it("1. an explicit choice wins", () => {
    expect(decideLanguage({ requested: "ro", locale: "en", guess: clearEn })).toEqual({ language: "ro", source: "user" });
  });
  it("2. clear material decides", () => {
    expect(decideLanguage({ requested: "auto", locale: "ro", guess: clearEn })).toEqual({ language: "en", source: "material" });
  });
  it("3. mixed material asks, without duplicates", () => {
    expect(decideLanguage({ requested: "auto", locale: "nl", guess: mixed })).toEqual({ ask: ["ro", "en", "nl"] });
    expect(decideLanguage({ requested: "auto", locale: "ro", guess: mixed })).toEqual({ ask: ["ro", "en"] });
  });
  it("4. otherwise the portal language, or English for an unsupported one", () => {
    expect(decideLanguage({ requested: "auto", locale: "ro", guess: unknown })).toEqual({ language: "ro", source: "portal" });
    expect(decideLanguage({ requested: "auto", locale: "sv", guess: unknown })).toEqual({ language: "en", source: "portal" });
  });
});
