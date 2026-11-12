import { Suspense } from "react";
import { renderToReadableStream } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { buildSiteData } from "@core/site";
import { HomeScreen } from "@/screens/HomeScreen";
import { LectureScreen } from "@/screens/LectureScreen";
import { SiteProvider } from "@/site/context";
import { loadCourse } from "../scripts/content/load";

const BASE = "/courses/energy-12345678";
const loaded = loadCourse("examples/showcase");
if (!loaded.course) throw new Error("The showcase course did not load.");

const showcase = buildSiteData({
  key: loaded.course.id,
  course: loaded.course,
  lectures: [
    ...loaded.lectures.map((entry) => entry.data),
    // A second lecture so the lecture screen has previous/next links to check.
    {
      ...loaded.lectures[0].data,
      meta: { ...loaded.lectures[0].data.meta, slug: "after", number: 2, title: "After" },
    },
  ],
  exam: loaded.exam,
  expected: loaded.expected,
});

async function render(children: React.ReactNode) {
  const stream = await renderToReadableStream(
    <SiteProvider data={showcase} base={BASE}>
      <Suspense fallback={null}>{children}</Suspense>
    </SiteProvider>,
  );
  await stream.allReady;
  return new Response(stream).text();
}

function internalHrefs(html: string) {
  return [...html.matchAll(/href="([^"]*)"/g)]
    .map((match) => match[1])
    .filter((href) => href.startsWith("/"));
}

describe("screens mount under the site base", () => {
  it("prefixes every internal link on the home screen", async () => {
    const hrefs = internalHrefs(await render(<HomeScreen data={showcase} />));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) expect(href.startsWith(`${BASE}/`)).toBe(true);
  });

  it("prefixes every internal link on a lecture screen", async () => {
    const hrefs = internalHrefs(await render(<LectureScreen data={showcase} slug="everything" />));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) expect(href.startsWith(`${BASE}/`)).toBe(true);
  });
});

describe("home page welcome", () => {
  const home = {
    intro: "Welcome to **energy**.",
    highlights: [{ title: "Short lectures", md: "Each fits one sitting." }, { title: "Practice first", md: "Try before you read." }],
    studyPath: ["Read lecture 1", "Do the quiz"],
  };

  it("shows the intro, every highlight and the study path when the course has a home", async () => {
    const withHome = { ...showcase, course: { ...showcase.course, home } };
    const html = await render(<HomeScreen data={withHome} />);
    expect(html).toContain("data-course-welcome");
    expect(html).toMatch(/<strong[^>]*>energy<\/strong>/);
    for (const text of ["Short lectures", "Practice first", "How to study this course", "Read lecture 1", "Do the quiz"]) expect(html).toContain(text);
    expect(html.indexOf("data-course-welcome")).toBeLessThan(html.indexOf('id="lectures"'));
  });

  it("renders no welcome without a home", async () => {
    const html = await render(<HomeScreen data={showcase} />);
    expect(html).not.toContain("data-course-welcome");
    expect(html).not.toContain("How to study this course");
  });
});
