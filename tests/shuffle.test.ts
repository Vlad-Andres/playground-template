import { describe, expect, it } from "vitest";
import { seededShuffle } from "@/widgets/core/shuffle";

describe("seededShuffle", () => {
  const items = ["a", "b", "c", "d"];
  it("is deterministic for the same seed", () => expect(seededShuffle(items, "seed")).toEqual(seededShuffle(items, "seed")));
  it("keeps every item", () => expect([...seededShuffle(items, "x")].sort()).toEqual(items));
  it("never returns the original order", () => {
    for (let seed = 0; seed < 200; seed += 1) expect(seededShuffle(items, `s${seed}`)).not.toEqual(items);
    expect(seededShuffle(["a", "b"], "z")).toEqual(["b", "a"]);
  });
  it("does not mutate its input", () => {
    const copy = [...items];
    seededShuffle(copy, "q");
    expect(copy).toEqual(items);
  });
});
