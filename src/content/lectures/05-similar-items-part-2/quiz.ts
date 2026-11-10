import type { QuizQuestion } from "@/content/types";

export const lecture05Quiz: QuizQuestion[] = [
  {
    id: "q-approach",
    prompt: "Entity identification is based on similarity. What goes wrong when there are too many entities, or they are too large — and what is the approach?",
    options: [
      { id: "a", text: "Too many comparisons (time) and too much memory (space); see entities as sets and look for similar sets." },
      { id: "b", text: "The similarity measures stop being distance measures; switch to Euclidean distance." },
      { id: "c", text: "Nothing — a faster machine solves it." },
      { id: "d", text: "Entities can no longer be hashed; use B+ trees instead." },
    ],
    answerId: "a",
    explanation:
      "Comparing everything costs time, and large entities cost space. Representing each entity as a **set** reduces finding similar items to finding similar sets, which shingling, minhashing and LSH then make cheap.",
  },
  {
    id: "q-bag",
    prompt: "What is the Jaccard similarity of the bags {a, a, a, b} and {a, a, b, b, c}?",
    options: [
      { id: "a", text: "1/3" },
      { id: "b", text: "2/3" },
      { id: "c", text: "3/5" },
      { id: "d", text: "1/2" },
    ],
    answerId: "a",
    explanation:
      "The intersection counts *a* twice (the minimum of 3 and 2) and *b* once: size 3. The bag union is the sum of the sizes, 4 + 5 = 9. So the similarity is $3/9 = 1/3$ — and since the maximum for bags is 1/2, that is quite similar.",
  },
  {
    id: "q-shingles",
    prompt: "What does representing a document by its k-shingles give you that a set of important words does not?",
    options: [
      { id: "a", text: "It makes the representation smaller than the document." },
      { id: "b", text: "It removes the need for a distance measure." },
      { id: "c", text: "It keeps local word order, so reordering paragraphs changes only the shingles crossing the boundaries." },
      { id: "d", text: "It guarantees that no two documents share any shingle." },
    ],
    answerId: "c",
    explanation:
      "Shingles capture short sequences, so order matters locally. Changing one word only affects the shingles within distance $k$ of it, and reordering paragraphs only affects the $2k$ shingles that cross the boundaries. Shingle sets are **larger** than the document, which is exactly why minhashing follows.",
  },
  {
    id: "q-k-size",
    prompt: "What goes wrong if you pick the shingle size k too small — say k = 1 on web pages?",
    options: [
      { id: "a", text: "Almost every document contains almost every shingle, so unrelated documents look highly similar." },
      { id: "b", text: "The shingle sets become too large to hash." },
      { id: "c", text: "Jaccard similarity becomes negative." },
      { id: "d", text: "Minhashing can no longer be applied." },
    ],
    answerId: "a",
    explanation:
      "k must be large enough that any given shingle is unlikely to appear in any given document. With $k = 1$ nearly every page contains nearly every common character. A rule of thumb is $k = 5$ for short documents and $k = 10$ for long ones; the book $k = 5$ for emails and $k = 9$ for research articles.",
  },
  {
    id: "q-hashed",
    prompt: "Why do hashed 9-shingles (4 bytes each) discriminate better than plain 4-shingles (also 4 bytes)?",
    options: [
      { id: "a", text: "Hash functions remove stop words." },
      { id: "b", text: "Only about 20⁴ = 160,000 different 4-shingles are likely in English text, while hashed 9-shingles spread over almost all 2³² values." },
      { id: "c", text: "9-shingles never collide." },
      { id: "d", text: "They don't — both carry exactly the same information." },
    ],
    answerId: "b",
    explanation:
      "Most four-byte sequences never occur in real text, so 4-shingles use a small part of the space. There are many more than $2^{32}$ likely 9-shingles, so after hashing almost any 32-bit value is possible.",
  },
  {
    id: "q-row-types",
    prompt: "For two columns of a boolean matrix, which rows determine their Jaccard similarity?",
    options: [
      { id: "a", text: "Only the rows where both columns are 0." },
      { id: "b", text: "All rows equally." },
      { id: "c", text: "Rows of types a, b and c; SIM = a / (a + b + c)." },
      { id: "d", text: "Only the rows of type a." },
    ],
    answerId: "c",
    explanation:
      "Type a (1, 1) rows form the intersection; types a, b (1, 0) and c (0, 1) form the union. Type d (0, 0) rows — most rows of a sparse matrix — never matter.",
  },
  {
    id: "q-minhash",
    prompt: "What is the defining property of minhashing?",
    options: [
      { id: "a", text: "It compresses any set to exactly four bytes." },
      { id: "b", text: "The probability that two columns have the same minhash value equals their Jaccard similarity." },
      { id: "c", text: "It sorts the rows so that similar columns become adjacent." },
      { id: "d", text: "It removes every type-d row from the matrix." },
    ],
    answerId: "b",
    explanation:
      "Looking down the permuted columns until the first 1 appears, the two minhashes agree exactly when that row is type a and disagree on types b and c. So $P[h(C_1) = h(C_2)] = a/(a+b+c) = SIM(C_1, C_2)$.",
  },
  {
    id: "q-signature-similarity",
    prompt: "In the running example, columns 1 and 3 have Jaccard similarity 0.75 but their three-row signatures agree in only 2 of 3 rows. What does that show?",
    options: [
      { id: "a", text: "Minhashing is biased and underestimates similarity." },
      { id: "b", text: "Signature similarity equals the Jaccard similarity only in expectation; short signatures have large errors." },
      { id: "c", text: "The permutations were chosen wrongly." },
      { id: "d", text: "Columns 1 and 3 are not similar." },
    ],
    answerId: "b",
    explanation:
      "The **expected** signature similarity is the Jaccard similarity, but with three minhash functions the estimate is coarse — columns 2 and 4 (also 0.75) happen to agree in all three. Longer signatures shrink the expected error.",
  },
  {
    id: "q-row-hashing",
    prompt: "Why does real minhashing use row hashing instead of random permutations?",
    options: [
      { id: "a", text: "Permutations do not preserve Jaccard similarity." },
      { id: "b", text: "With a billion rows, picking and storing a random permutation is impractical and reading rows in permuted order thrashes." },
      { id: "c", text: "Hash functions give exact similarities, permutations only estimates." },
      { id: "d", text: "Row hashing needs no memory at all." },
    ],
    answerId: "b",
    explanation:
      "Representing one random permutation of a billion rows takes a billion entries, and accessing rows in permuted order leads to thrashing. Each hash function $k_i$ induces an ordering of the rows that acts as a random permutation, computed in one sequential pass.",
  },
  {
    id: "q-infinity",
    prompt: "Minhashing only the first m rows, one minhash value is ∞ for both columns. How is that row of the signatures counted?",
    options: [
      { id: "a", text: "As an agreement — both values are equal." },
      { id: "b", text: "As a disagreement." },
      { id: "c", text: "As neither: both columns had only 0s in those m rows, so it carries no information and is ignored." },
      { id: "d", text: "The whole signature must be recomputed." },
    ],
    answerId: "c",
    explanation:
      "If only one column is ∞, the other has a 1 among the first m rows while the ∞ column does not, so it is a disagreement. If both are ∞, the similarity depends only on rows we chose not to look at, so the row counts neither way.",
  },
];
