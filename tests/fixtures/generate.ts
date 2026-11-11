import type { Brief, Material, PlannedLecture } from "@core/generate/index";
import type { LectureFile } from "@core/schema";

export const brief: Brief = { language: "en", level: "university", depth: "standard", examMode: true, quizzes: true, widgets: true, context: "" };

export const materials: Material[] = [
  { name: "slides.pdf", pages: Array.from({ length: 6 }, (_, i) => ({ n: i + 1, text: `Page ${i + 1}. Kinetic energy is one half m v squared. `.repeat(4) })) },
];

export function plannedLecture(number: number, slug = `lecture-${number}`): PlannedLecture {
  return {
    number,
    slug,
    title: `Lecture ${number}`,
    summary: "A summary.",
    pages: [{ file: "slides.pdf", from: 1, to: 6 }],
    sections: [
      { id: "goals", title: "Goals", kind: "objectives", blocks: ["list"] },
      { id: "core", title: "Core", kind: "concepts", blocks: ["prose", "table"] },
    ],
  };
}

export function planReply(lectures = [plannedLecture(1)], extra: Record<string, unknown> = {}) {
  return JSON.stringify({
    course: { id: "energy", title: "Energy", shortTitle: "Energy", description: "About energy.", language: "en", indexable: true, domains: ["core", "math"] },
    lectures,
    exam: { title: "Exam training", intro: "Practise." },
    ...extra,
  });
}

const src = [{ file: "slides.pdf", page: 1 }];

export function goodLecture(number = 1, slug = `lecture-${number}`): LectureFile {
  return {
    meta: {
      slug,
      number,
      title: `Model title ${number}`,
      subtitle: "Energy",
      summary: "Energy basics.",
      topics: ["energy"],
      difficulty: "intro",
      estimatedMinutes: 20,
      sources: [{ label: "Slides", kind: "slides", detail: "slides.pdf" }],
      objectives: ["Know kinetic energy."],
      takeaways: ["E = ½mv²."],
    },
    concepts: ["ke", "pe", "work", "power", "joule"].map((id) => ({ id, term: id, short: `${id} defined.` })),
    quiz: Array.from({ length: 6 }, (_, i) => ({
      id: `q${i + 1}`,
      prompt: `Question ${i + 1}?`,
      options: [{ id: "a", text: "A" }, { id: "b", text: "B" }],
      answerId: "a",
      explanation: "Because.",
    })),
    sections: [
      { id: "goals", title: "Goals", kind: "objectives", blocks: [{ kind: "list", variant: "objectives", items: ["Know it."], source: src }] },
      {
        id: "core",
        title: "Core",
        kind: "concepts",
        blocks: [
          { kind: "prose", md: "Energy is conserved.", source: src },
          { kind: "concepts", ids: ["ke", "pe"], source: src },
          { kind: "table", headers: ["a", "b"], rows: [["1", "2"]], source: src },
          { kind: "recall", cards: [{ prompt: "E?", answer: "½mv²" }], source: src },
          { kind: "practice", id: "p1", tasks: [{ id: "t1", prompt: "Pick", check: { mode: "select", options: ["x", "y"], answer: ["x"] }, solution: "x" }], source: src },
          { kind: "widget", type: "order-items", title: "Order", props: { prompt: "Order", items: ["a", "b", "c"] }, source: src },
        ],
      },
    ],
  };
}
