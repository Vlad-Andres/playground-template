import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { referenceDocuments } from "../scripts/docs/reference";

describe("generated block and widget reference", () => {
  it.each(Object.entries(referenceDocuments()))("%s is up to date (run npm run docs:reference)", (file, content) => {
    expect(fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null).toBe(content);
  });
});
