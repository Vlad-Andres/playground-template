import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentType, ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { buildSiteData } from "@core/site";
import { widgetCatalogue, type ParameterExplorerProps, type WidgetType } from "@core/widgets";
import { Categorize } from "@/widgets/core/Categorize";
import { Chart } from "@/widgets/core/Chart";
import { Cloze } from "@/widgets/core/Cloze";
import { ConceptMap } from "@/widgets/core/ConceptMap";
import { FlowStepper } from "@/widgets/core/FlowStepper";
import { FunctionPlot } from "@/widgets/core/FunctionPlot";
import { MatchPairs } from "@/widgets/core/MatchPairs";
import { MockExam } from "@/widgets/core/MockExam";
import { OrderItems } from "@/widgets/core/OrderItems";
import { ParameterExplorer } from "@/widgets/core/ParameterExplorer";
import { SiteProvider } from "@/site/context";
import { minimalCourse, minimalLecture } from "./fixtures/minimal";

const site = buildSiteData({
  key: minimalCourse.id,
  course: minimalCourse,
  lectures: [minimalLecture],
  exam: null,
  expected: [],
});

function render(node: ReactNode) {
  return renderToStaticMarkup(<SiteProvider data={site} base="">{node}</SiteProvider>);
}

const cases: [WidgetType, ComponentType<any>, string][] = [
  ["order-items", OrderItems, "Put the phases of mitosis in order."],
  ["match-pairs", MatchPairs, "Mitochondrion"],
  ["categorize", Categorize, "Sort the examples."],
  ["cloze", Cloze, "Photosynthesis turns"],
  ["flow-stepper", FlowStepper, "Request"],
  ["concept-map", ConceptMap, "Supply"],
  ["chart", Chart, "Asia"],
  ["parameter-explorer", ParameterExplorer, "Kinetic energy"],
  ["function-plot", FunctionPlot, "a * sin(b * x)"],
  ["mock-exam", MockExam, "Questions"],
];

describe("generic widgets render their catalogue example", () => {
  it.each(cases)("%s", (type, Component, expected) => {
    const html = render(<Component {...widgetCatalogue[type].example} />);
    expect(html).toContain(expected);
  });

  it("parameter-explorer computes the output from the initial values", () => {
    const html = render(<ParameterExplorer {...(widgetCatalogue["parameter-explorer"].example as ParameterExplorerProps)} />);
    expect(html).toContain("125"); // 0.5 * 10 * 5^2
  });

  it("order-items never starts in the correct order", () => {
    const html = render(<OrderItems prompt="p" items={["one", "two", "three"]} />);
    const positions = ["one", "two", "three"].map((item) => html.indexOf(`>${item}<`));
    expect(positions).not.toEqual([...positions].sort((a, b) => a - b));
  });

  it("cloze offers every answer and distractor in each gap", () => {
    const html = render(<Cloze text="A {{x}} and {{y}}." distractors={["z"]} />);
    expect(html.match(/<select/g)).toHaveLength(2);
    expect(html.match(/<option value="z">/g)).toHaveLength(2);
  });

  it("renders model text as text, not HTML", () => {
    const html = render(<OrderItems prompt="<img src=x onerror=alert(1)>" items={["<b>a</b>", "b", "c"]} />);
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<b>");
  });
});
