import type { LectureMeta, SectionOutline } from "@/content/types";

export const lecture02Outline = [
  { id: "objectives", title: "Learning objectives", kind: "objectives" },
  { id: "big-picture", title: "One entity, a thousand names", kind: "intuition" },
  { id: "levels", title: "Where entity resolution happens", kind: "concepts" },
  { id: "string-similarity", title: "Comparing strings", kind: "playground" },
  { id: "set-similarity", title: "Comparing sets: Jaccard similarity", kind: "concepts" },
  { id: "distances", title: "Distance measures", kind: "playground" },
  { id: "deduplication", title: "Entity linkage and deduplication", kind: "playground" },
  { id: "cost", title: "The cost of entity linkage", kind: "intuition" },
  { id: "mistakes", title: "Common mistakes", kind: "mistakes" },
  { id: "quiz", title: "Check your understanding", kind: "quiz" },
  { id: "summary", title: "Cheat sheet", kind: "summary" },
] as const satisfies readonly SectionOutline[];

export type Lecture02SectionId = (typeof lecture02Outline)[number]["id"];

export const lecture02Meta: LectureMeta = {
  slug: "similar-items-part-1",
  number: 2,
  title: "Finding Similar Items at Scale — Part 1",
  subtitle: "Entity resolution, and the similarity and distance measures that decide it",
  summary:
    "The same real-world entity turns up under countless descriptions, and one description can name many entities. This first part defines entity resolution, shows at which levels it happens, and builds the toolbox for deciding it: string similarity for atomic values, Jaccard similarity for sets, and the distance measures — Euclidean and non-Euclidean — used everywhere after. It ends with the deduplication pipeline and the quadratic cost that Parts 2 and 3 set out to beat.",
  topics: [
    "Entity resolution",
    "Edit and gap distance",
    "Jaro and Jaro-Winkler",
    "Jaccard similarity",
    "Distance axioms",
    "L₁, L₂ and L∞ norms",
    "Cosine distance",
    "Hamming distance",
    "Deduplication",
  ],
  difficulty: "core",
  estimatedMinutes: 70,
  sources: [
    { label: "Entity Resolution (Finding Similar Items)", kind: "slides", detail: "Yannis Velegrakis" },
    {
      label: "Mining of Massive Datasets, Chapter 3",
      kind: "chapter",
      detail: "§3.1.1 Jaccard similarity and §3.5 Distance measures",
    },
  ],
  objectives: [
    "Define entity resolution, explain why one entity gets many descriptions, and list the steps of the typical methodology.",
    "Name the levels at which entity resolution happens and the four families of solutions.",
    "Compute edit, gap and Jaro similarity for short strings and say which suits which case.",
    "Compute Jaccard similarity and Jaccard distance of two sets.",
    "State the four axioms of a distance measure and tell Euclidean from non-Euclidean spaces.",
    "Compute L₁, L₂, L∞, cosine and Hamming distances, and pick a measure that fits the data.",
    "Trace the deduplication pipeline from pairwise similarity to a clean relation, and explain why comparing all pairs does not scale.",
  ],
  takeaways: [
    "Entity resolution decides whether two data structures correspond to the same real-world entity: identify them, decide how to merge, update the collection.",
    "Descriptions diverge through text variations (misspellings, acronyms, abbreviations…) and local knowledge (own formats, no global identifier coordination).",
    "Solutions work at four levels: atomic values, sets, inner relationships and uncertain data.",
    "Edit distance counts inserts, deletes and updates; gap distance makes abbreviations cheap; Jaro and Jaro-Winkler suit short names.",
    "Jaccard similarity is |C₁ ∩ C₂| / |C₁ ∪ C₂|; Jaccard distance is one minus it.",
    "A distance measure is non-negative, zero exactly for identical points, symmetric, and obeys the triangle inequality.",
    "Euclidean spaces have the Lᵣ norms — L₂, L₁ (Manhattan), L∞; non-Euclidean measures include Jaccard, cosine, edit and Hamming distance.",
    "Deduplication scores pairs, clusters similar records and merges each cluster — but N records give N(N−1)/2 pairs, which Parts 2 and 3 avoid.",
  ],
  outline: lecture02Outline,
};
