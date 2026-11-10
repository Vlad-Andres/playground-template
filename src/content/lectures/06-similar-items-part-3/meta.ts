import type { LectureMeta, SectionOutline } from "@/content/types";

export const lecture06Outline = [
  { id: "objectives", title: "Learning objectives", kind: "objectives" },
  { id: "lsh-idea", title: "Locality-sensitive hashing", kind: "intuition" },
  { id: "banding", title: "The banding technique", kind: "concepts" },
  { id: "analysis", title: "Analysing banding: the S-curve", kind: "playground" },
  { id: "pipeline", title: "The whole pipeline", kind: "visual" },
  { id: "lsh-families", title: "Locality-sensitive families", kind: "concepts" },
  { id: "er-at-scale", title: "Entity resolution at scale", kind: "examples" },
  { id: "high-similarity", title: "When similarity is very high", kind: "concepts" },
  { id: "mistakes", title: "Common mistakes", kind: "mistakes" },
  { id: "quiz", title: "Check your understanding", kind: "quiz" },
  { id: "summary", title: "Cheat sheet", kind: "summary" },
] as const satisfies readonly SectionOutline[];

export type Lecture06SectionId = (typeof lecture06Outline)[number]["id"];

export const lecture06Meta: LectureMeta = {
  slug: "similar-items-part-3",
  number: 6,
  title: "Finding Similar Items at Scale — Part 3",
  subtitle: "Locality-sensitive hashing, and entity resolution at scale",
  summary:
    "Signatures solve the space problem but not the pairs problem. Part 3 covers MMDS §3.4 and §3.8.1–§3.8.3: band the signature matrix so that only similar columns are likely to share a bucket, analyse the resulting S-curve, assemble the whole pipeline, and see how real entity resolution adapts the idea to records — scoring, blocking and validating matches without labels.",
  topics: [
    "Locality-sensitive hashing",
    "Candidate pairs",
    "Banding",
    "S-curve",
    "LSH threshold",
    "Locality-sensitive families",
    "Blocking",
    "Validating matches",
    "Prefix indexing",
  ],
  difficulty: "core",
  estimatedMinutes: 70,
  sources: [
    { label: "Matching (Finding Similar Items)", kind: "slides", detail: "Yannis Velegrakis — locality-sensitive hashing" },
    {
      label: "Mining of Massive Datasets, Chapter 3",
      kind: "chapter",
      detail: "§3.4 LSH for documents and §3.8.1–§3.8.3 entity resolution",
    },
  ],
  objectives: [
    "Explain how LSH turns all-pairs comparison into a small set of candidate pairs, and what false positives and false negatives are.",
    "Apply the banding technique to a signature matrix and say when two columns become a candidate pair.",
    "Compute the S-curve 1 − (1 − sʳ)ᵇ and the threshold (1/b)^(1/r), and tune b and r for a target similarity.",
    "Lay out the complete pipeline from documents to verified similar pairs.",
    "State what a (d₁, d₂, p₁, p₂)-sensitive family is and how minhashing fits it.",
    "Describe how entity resolution adapts LSH to records: field scoring, blocking, and validating matches without labels.",
    "Name the alternatives to LSH when the required similarity is very high.",
  ],
  takeaways: [
    "LSH hashes items many times so that similar items are likely to share a bucket at least once; only those candidate pairs are evaluated.",
    "Banding splits the signature matrix into b bands of r rows; columns agreeing on all r rows of any one band become candidates.",
    "P[candidate] = 1 − (1 − sʳ)ᵇ: an S-curve with threshold ≈ (1/b)^(1/r). With b = 20 and r = 5, a pair at 0.8 is missed only about once in 3000.",
    "Choose a threshold below the target to avoid false negatives, above it to limit false positives.",
    "The pipeline: shingle → minhash → choose b and r → LSH for candidates → check signatures → optionally check the documents.",
    "A family is (d₁, d₂, p₁, p₂)-sensitive if close points collide with probability ≥ p₁ and far points with ≤ p₂; for minhash, P[h(x) = h(y)] = 1 − d(x, y).",
    "Records need field-aware scoring and blocking; a field outside the score validates matches without labels: f = (45 − x) / 35.",
    "LSH suits relatively low similarities; for very high ones, length filtering and prefix indexing find all pairs exactly.",
  ],
  outline: lecture06Outline,
};
