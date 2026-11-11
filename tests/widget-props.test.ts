import { describe, expect, it } from "vitest";
import { generatorWidgetTypes, widgetCatalogue, WIDGET_TYPES, type WidgetType } from "@core/widgets";

function ok(type: WidgetType, props: unknown): boolean {
  return widgetCatalogue[type].props.safeParse(props).success;
}
function withExample(type: WidgetType, patch: Record<string, unknown>): unknown {
  return { ...widgetCatalogue[type].example, ...patch };
}

describe("widget catalogue", () => {
  it("has a spec for every widget type", () => {
    for (const type of WIDGET_TYPES) expect(widgetCatalogue[type], type).toBeDefined();
  });
  it("lets the generator use no DIS lab", () => {
    expect(generatorWidgetTypes.some((type) => widgetCatalogue[type].pack === "dis")).toBe(false);
    expect(generatorWidgetTypes).toHaveLength(10);
  });
  it.each(WIDGET_TYPES.map((type) => [type]))("%s example passes its props schema", (type) => {
    expect(ok(type, widgetCatalogue[type].example)).toBe(true);
  });
  it("every generator widget has a one-sentence description", () => {
    for (const type of generatorWidgetTypes) expect(widgetCatalogue[type].description.length).toBeGreaterThan(20);
  });
});

describe("widget prop rules", () => {
  it("order-items: 3-8 distinct items", () => {
    expect(ok("order-items", withExample("order-items", { items: ["a", "b"] }))).toBe(false);
    expect(ok("order-items", withExample("order-items", { items: ["a", "b", "a"] }))).toBe(false);
    expect(ok("order-items", withExample("order-items", { items: Array.from({ length: 9 }, (_, i) => `i${i}`) }))).toBe(false);
  });
  it("match-pairs: 3-8 pairs, distinct sides", () => {
    expect(ok("match-pairs", { pairs: [{ left: "a", right: "1" }, { left: "b", right: "2" }] })).toBe(false);
    expect(ok("match-pairs", { pairs: [{ left: "a", right: "1" }, { left: "a", right: "2" }, { left: "c", right: "3" }] })).toBe(false);
  });
  it("categorize: every item category must be listed", () => {
    expect(ok("categorize", withExample("categorize", {
      items: [
        { text: "Wind", category: "Renewable" },
        { text: "Coal", category: "Fossil" },
        { text: "Sun", category: "Renewable" },
        { text: "Oil", category: "Non-renewable" },
      ],
    }))).toBe(false);
  });
  it("categorize: 2-4 categories, 4-12 items", () => {
    expect(ok("categorize", withExample("categorize", { categories: ["Renewable"] }))).toBe(false);
    expect(ok("categorize", withExample("categorize", { items: [{ text: "Wind", category: "Renewable" }] }))).toBe(false);
  });
  it("cloze: 1-8 gaps, at most 6 distractors", () => {
    expect(ok("cloze", { text: "No gaps here." })).toBe(false);
    expect(ok("cloze", { text: Array.from({ length: 9 }, (_, i) => `{{w${i}}}`).join(" ") })).toBe(false);
    expect(ok("cloze", { text: "A {{gap}}.", distractors: ["1", "2", "3", "4", "5", "6", "7"] })).toBe(false);
  });
  it("flow-stepper: edges point at existing nodes; ids unique", () => {
    expect(ok("flow-stepper", withExample("flow-stepper", { edges: [{ from: "request", to: "nowhere" }] }))).toBe(false);
    expect(ok("flow-stepper", { nodes: [{ id: "a", label: "A" }, { id: "a", label: "B" }], edges: [] })).toBe(false);
  });
  it("concept-map: links point at existing nodes", () => {
    expect(ok("concept-map", withExample("concept-map", { links: [{ from: "supply", to: "tax", label: "x" }] }))).toBe(false);
  });
  it("chart: every series has one value per label", () => {
    expect(ok("chart", withExample("chart", { series: [{ name: "2020", values: [1, 2] }] }))).toBe(false);
  });
  it("parameter-explorer: min < max and value inside", () => {
    const input = { id: "m", label: "Mass", min: 10, max: 1, step: 1, value: 5 };
    expect(ok("parameter-explorer", withExample("parameter-explorer", { inputs: [input] }))).toBe(false);
    expect(ok("parameter-explorer", withExample("parameter-explorer", { inputs: [{ ...input, min: 1, max: 10, value: 50 }], outputs: [{ label: "x", expr: "m" }] }))).toBe(false);
  });
  it("parameter-explorer: expressions parse and use only input ids", () => {
    expect(ok("parameter-explorer", withExample("parameter-explorer", { outputs: [{ label: "E", expr: "0.5 * m * c^2" }] }))).toBe(false);
    expect(ok("parameter-explorer", withExample("parameter-explorer", { outputs: [{ label: "E", expr: "m.constructor" }] }))).toBe(false);
    expect(ok("parameter-explorer", withExample("parameter-explorer", { inputs: [{ id: "pi", label: "P", min: 0, max: 1, step: 0.1, value: 0 }], outputs: [{ label: "x", expr: "pi" }] }))).toBe(false);
  });
  it("function-plot: xMin < xMax, params in range, expr uses x and params only", () => {
    expect(ok("function-plot", withExample("function-plot", { xMin: 5, xMax: 1 }))).toBe(false);
    expect(ok("function-plot", withExample("function-plot", { expr: "a * sin(k * x)" }))).toBe(false);
    expect(ok("function-plot", withExample("function-plot", { params: [{ id: "a", label: "A", min: 0, max: 1, value: 3 }] }))).toBe(false);
    expect(ok("function-plot", { expr: "x^2", xMin: -1, xMax: 1 })).toBe(true);
  });
  it("mock-exam: bounded question count and minutes", () => {
    expect(ok("mock-exam", {})).toBe(true);
    expect(ok("mock-exam", { questionCount: 4 })).toBe(false);
    expect(ok("mock-exam", { minutes: 181 })).toBe(false);
  });
  it("DIS labs take no props", () => {
    expect(ok("quorum-lab", {})).toBe(true);
    expect(ok("quorum-lab", { bad: true })).toBe(false);
  });
});
