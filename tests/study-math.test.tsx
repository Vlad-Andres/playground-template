import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { QuizCard } from "@/components/content/QuizCard";
import { MiniQuiz } from "@/components/difficult/MiniQuiz";
import { ExerciseAnswer } from "@/components/content/ExerciseAnswer";
import { Formula } from "@/components/content/Formula";
import { DataTable } from "@/components/content/DataTable";
import { CourseWelcome } from "@/components/home/CourseWelcome";
import { Cloze } from "@/widgets/core/Cloze";
import { buildSiteData } from "@core/site";
import { SiteProvider } from "@/site/context";
import { minimalCourse, minimalLecture } from "./fixtures/minimal";

const site = buildSiteData({ key: minimalCourse.id, course: minimalCourse, lectures: [minimalLecture], exam: null, expected: [] });
const math = "$p=mv$";
const question = {
  id: "momentum",
  prompt: `What does ${math} describe?`,
  options: [{ id: "a", text: math }, { id: "b", text: "Energy" }],
  answerId: "a",
  explanation: "Mass times velocity.",
};

it("typesets the quiz prompt and choice in lessons and targeted review", () => {
  for (const node of [
    <QuizCard key="lecture" lectureSlug={minimalLecture.meta.slug} sectionId="check" questions={[question]} />,
    <MiniQuiz key="review" questions={[question]} />,
  ]) {
    const html = renderToStaticMarkup(<SiteProvider data={site} base="">{node}</SiteProvider>);
    expect(html.match(/class="katex"/g)).toHaveLength(2);
    expect(html).not.toContain(math);
  }
});

it("typesets selectable exercise answers, captions, and study steps", () => {
  const html = renderToStaticMarkup(<SiteProvider data={site} base="">
    <ExerciseAnswer sheetId="practice" index={0} task={{ id: "p", prompt: "Choose", solution: "Momentum", check: { mode: "select", options: [math, "Energy"], answer: [math] } }} />
    <Formula tex="E" caption={math} />
    <DataTable headers={["Name"]} rows={[["Momentum"]]} caption={math} />
    <CourseWelcome home={{ studyPath: [math] }} />
  </SiteProvider>);
  expect(html.match(/class="katex"/g)).toHaveLength(5);
  expect(html).not.toContain(`>${math}<`);
});

it("renders math in cloze choices without putting rich markup inside native options", () => {
  const html = renderToStaticMarkup(<Cloze text={`Momentum: {{${math}}}`} distractors={["$E=mc^2$"]} />);
  expect(html.match(/class="katex"/g)).toHaveLength(2);
  expect(html).not.toContain("<option");
});
