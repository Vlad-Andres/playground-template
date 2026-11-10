import type { LectureMeta, SectionOutline } from "@/content/types";

export const lecture05Outline = [
  { id: "objectives", title: "Learning objectives", kind: "objectives" },
  { id: "entities-as-sets", title: "From entities to sets", kind: "intuition" },
  { id: "shingling", title: "Shingling documents", kind: "playground" },
  { id: "matrices", title: "Sets as boolean matrices", kind: "concepts" },
  { id: "minhashing", title: "Minhashing", kind: "concepts" },
  { id: "row-hashing", title: "Computing signatures in practice", kind: "playground" },
  { id: "mistakes", title: "Common mistakes", kind: "mistakes" },
  { id: "quiz", title: "Check your understanding", kind: "quiz" },
  { id: "summary", title: "Cheat sheet", kind: "summary" },
] as const satisfies readonly SectionOutline[];

export type Lecture05SectionId = (typeof lecture05Outline)[number]["id"];

export const lecture05Meta: LectureMeta = {
  slug: "similar-items-part-2",
  number: 5,
  title: "Finding Similar Items at Scale — Part 2",
  subtitle: "Shingling, Jaccard similarity and minhash signatures",
  summary:
    "To find similar items without comparing them whole, see every entity as a set: shingle documents into k-grams, compare the sets with Jaccard similarity, and compress each set into a short minhash signature that preserves that similarity in expectation — computed in one pass with row hashing.",
  topics: [
    "Applications of set similarity",
    "Collaborative filtering",
    "k-shingles",
    "Hashed shingles",
    "Characteristic matrix",
    "Minhashing",
    "Signature matrix",
    "Row hashing",
  ],
  difficulty: "core",
  estimatedMinutes: 75,
  sources: [
    { label: "Matching (Finding Similar Items)", kind: "slides", detail: "Yannis Velegrakis — shingling and minhashing" },
    {
      label: "Mining of Massive Datasets, Chapter 3",
      kind: "chapter",
      detail: "§3.1 Applications, §3.2 Shingling, §3.3 Similarity-preserving summaries",
    },
  ],
  objectives: [
    "Explain why finding similar items is reduced to finding similar sets, and list the applications of set similarity.",
    "Compute the Jaccard similarity of sets and of bags.",
    "Shingle a document into k-shingles, choose k, and explain hashed and word-based shingles.",
    "Represent sets as columns of a boolean matrix and classify its rows into types a, b, c and d.",
    "Compute minhash values from row permutations and explain why P[h(C₁) = h(C₂)] = SIM(C₁, C₂).",
    "Build a signature matrix in one pass with row hashing, and estimate similarity from signatures.",
    "Explain how minhashing over only the first m rows speeds things up, and how ∞ values are counted.",
  ],
  takeaways: [
    "Too many entities cost time and too large entities cost space: see entities as sets and reduce finding similar items to finding similar sets.",
    "Set similarity drives near-duplicate detection, plagiarism, mirror pages, news aggregation and collaborative filtering; bag similarity counts each element min-times in the intersection and sum-times in the union.",
    "A document is represented by its set of k-shingles; k must make any given shingle unlikely in any given document (5 for short documents, about 9–10 for long ones).",
    "Hashing 9-shingles to four bytes discriminates better than using 4-shingles; shingles built from stop words favour the news article over the page clutter.",
    "In the boolean matrix SIM(C₁, C₂) = a / (a + b + c): only rows with a 1 in at least one column count.",
    "The minhash of a column is the first row, in a random permutation, with a 1 — and P[h(C₁) = h(C₂)] = SIM(C₁, C₂).",
    "Signature similarity is the fraction of minhash functions that agree; its expected value is the Jaccard similarity, and longer signatures shrink the error.",
    "Row hashing replaces permutations: one slot per column and hash function, initialised to ∞, lowered whenever a row with a 1 hashes below it.",
  ],
  outline: lecture05Outline,
};
