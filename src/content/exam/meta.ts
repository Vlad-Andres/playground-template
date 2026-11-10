import type { LectureMeta, SectionOutline } from "@/content/types";

export const examOutline = [
  { id: "objectives", title: "How to use this page", kind: "objectives" },
  { id: "format", title: "How the test works", kind: "intuition" },
  { id: "answering", title: "Writing answers that score", kind: "examples" },
  { id: "map", title: "What each lecture can ask", kind: "concepts" },
  { id: "comparisons", title: "Comparisons the test likes", kind: "concepts" },
  { id: "mock", title: "Timed mock test", kind: "playground" },
  { id: "open", title: "Open questions with model answers", kind: "exercises" },
  { id: "pseudocode", title: "Pseudocode and calculation drills", kind: "exercises" },
  { id: "practical", title: "The practical-assignment part", kind: "concepts" },
  { id: "quiz", title: "Cross-lecture multiple choice", kind: "quiz" },
  { id: "summary", title: "Last-day checklist", kind: "summary" },
] as const satisfies readonly SectionOutline[];

export const examMeta: LectureMeta = {
  slug: "exam-training",
  number: 0,
  title: "Exam Training",
  subtitle: "Practise for the final test in its own format: multiple choice, short open answers and pseudocode, under time pressure",
  summary:
    "The final test is taken on Remindo, on premises, in about two hours and without any material. It mixes multiple-choice questions with short free-text answers and small pieces of pseudocode, in a theory part and a part about the practical assignment. This page trains exactly that: a timed mock test drawn from every lecture, exam-style open questions and calculations with model answers, the comparisons the test likes to ask, and a checklist for the last day.",
  topics: ["Remindo", "Multiple choice", "Open questions", "Pseudocode", "MapReduce", "Spark", "NoSQL", "Graph databases", "Vector databases"],
  difficulty: "core",
  estimatedMinutes: 180,
  sources: [
    { label: "Course exam information", kind: "notes", detail: "Type of test, question kinds, duration, rules" },
    { label: "Sample test", kind: "notes", detail: "Used only to mirror the style of the questions — not as study material" },
    { label: "Lectures 1–12 on this site", kind: "notes", detail: "Every question here is answered by a lecture page" },
  ],
  objectives: [
    "Know the format of the test and what a good answer looks like for each kind of question.",
    "Check, lecture by lecture, that you can answer the questions the test is likely to ask.",
    "Explain the classic differences (Hadoop vs HDFS, Spark vs MapReduce, graph database vs graph analytics, ACID vs BASE…) in two or three sentences.",
    "Write map and reduce functions, Spark pipelines and Cypher queries in pseudocode, and do the standard calculations (LSH, minhash, quorums, hashing, record offsets).",
    "Take a timed mock test across all lectures and find your weak spots.",
    "Prepare to explain the design decisions of your own practical assignment.",
  ],
  takeaways: [
    "Answer exactly what is asked, briefly and precisely: every question can be fully answered with a short answer.",
    "For “what is X”: definition, purpose, one example. For “difference between X and Y”: what each is, the key difference, an example of each.",
    "For pseudocode, give the input and output of each function and the key: map(in_key, in_value) → list(out_key, value); reduce(out_key, list(value)) → list(out_value).",
    "Multiple choice: eliminate options that are true but answer a different question; watch for absolutes (always, only, never).",
    "Two parts: theory (all lectures) and the practical assignment (your own design choices and why).",
  ],
  outline: examOutline,
};
