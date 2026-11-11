import { describe, expect, it } from "vitest";
import { blockExamples } from "@core/examples";
import { blockSchema } from "@core/schema";
import { validateBlock } from "@core/validate";

describe("blockExamples", () => {
  it.each(Object.entries(blockExamples))("%s example passes the block schema and widget checks", (kind, entry) => {
    expect(entry.example.kind).toBe(kind);
    expect(blockSchema.safeParse(entry.example).success).toBe(true);
    expect(validateBlock(entry.example)).toEqual([]);
    expect(entry.use.length).toBeGreaterThan(10);
    expect(entry.avoid.length).toBeGreaterThan(10);
  });
  it("covers all 14 block kinds", () => expect(Object.keys(blockExamples)).toHaveLength(14));
});
