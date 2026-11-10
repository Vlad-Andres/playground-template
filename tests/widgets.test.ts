import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { toWidgetType } from "@/widgets/naming";
import { widgetManifest } from "@/widgets/manifest";
import { WIDGET_TYPES } from "@/widgets/types";

describe("widget registry", () => {
  it.each([
    ["BPlusTreeLab", "b-plus-tree-lab"],
    ["TwoPhaseCommitSimulator", "two-phase-commit-simulator"],
    ["ErPipeline", "er-pipeline"],
    ["MockExam", "mock-exam"],
  ])("%s → %s", (componentName, widgetType) => {
    expect(toWidgetType(componentName)).toBe(widgetType);
  });

  it("lists one type per file in src/widgets/dis", () => {
    const directory = path.resolve("src/widgets/dis");
    const types = fs
      .readdirSync(directory)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => toWidgetType(file.slice(0, -4)))
      .sort();
    expect(types).toEqual([...WIDGET_TYPES].sort());
  });

  it("manifest covers every type", () => {
    expect(Object.keys(widgetManifest).sort()).toEqual([...WIDGET_TYPES].sort());
  });
});
