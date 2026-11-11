import { describe, expect, it } from "vitest";
import { layeredLayout, sampleFunction } from "@/widgets/core/layout";

const box = { width: 100, height: 40, gapX: 50, gapY: 10 };

describe("layeredLayout", () => {
  it("places a chain left to right", () => {
    const { placed, width } = layeredLayout([{ id: "a" }, { id: "b" }, { id: "c" }], [{ from: "a", to: "b" }, { from: "b", to: "c" }], box);
    expect(placed.map((item) => item.rank)).toEqual([0, 1, 2]);
    expect(width).toBe(400);
  });
  it("terminates on a cycle", () => {
    const { placed } = layeredLayout([{ id: "a" }, { id: "b" }], [{ from: "a", to: "b" }, { from: "b", to: "a" }], box);
    expect(placed).toHaveLength(2);
  });
});

describe("sampleFunction", () => {
  it("samples 200 points and turns non-finite values into gaps", () => {
    const points = sampleFunction((x) => 1 / x, -1, 1);
    expect(points).toHaveLength(200);
    expect(points[0]).toEqual({ x: -1, y: -1 });
    expect(sampleFunction((x) => Math.sqrt(x), -1, 1, 3)[0].y).toBeNull();
  });
});
