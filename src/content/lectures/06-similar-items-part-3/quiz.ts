import type { QuizQuestion } from "@/content/types";

export const lecture06Quiz: QuizQuestion[] = [
  {
    id: "q-candidates",
    prompt: "In LSH, what is a false negative?",
    options: [
      { id: "a", text: "A dissimilar pair that becomes a candidate pair." },
      { id: "b", text: "A similar pair that never hashes to the same bucket, so it is never evaluated." },
      { id: "c", text: "A candidate pair whose signatures disagree in every row." },
      { id: "d", text: "A bucket that receives no columns." },
    ],
    answerId: "b",
    explanation:
      "Only candidate pairs are ever evaluated. A similar pair that never collides is lost for good — a **false negative**. A dissimilar pair that collides is a **false positive**, which costs only the time to check it.",
  },
  {
    id: "q-banding",
    prompt: "Under the banding technique, when do two columns become a candidate pair?",
    options: [
      { id: "a", text: "When they agree in at least one row of every band." },
      { id: "b", text: "When their full signatures are identical." },
      { id: "c", text: "When they agree in all r rows of at least one band." },
      { id: "d", text: "When they land in the same bucket of the same band array more than b times." },
    ],
    answerId: "c",
    explanation:
      "Each band hashes the $r$-row slice of every column into its own bucket array, and identical slices collide. Agreeing in all $r$ rows of **any single** band is enough; the more similar two columns are, the likelier that is to happen somewhere.",
  },
  {
    id: "q-threshold",
    prompt: "You use signatures of length 64 split into b = 16 bands of r = 4 rows. Roughly where does the S-curve cross one half?",
    options: [
      { id: "a", text: "s ≈ 0.25" },
      { id: "b", text: "s ≈ 0.50" },
      { id: "c", text: "s ≈ 0.75" },
      { id: "d", text: "s ≈ 0.94" },
    ],
    answerId: "b",
    explanation:
      "The threshold is approximately $(1/b)^{1/r}$. Here that is the fourth root of $1/16$, which is exactly $1/2$. Pairs above 0.5 are very likely to be candidates, pairs below are unlikely.",
  },
  {
    id: "q-tuning",
    prompt: "Keeping the signature length n = b · r fixed, you increase r and decrease b. What happens?",
    options: [
      { id: "a", text: "The threshold rises: fewer false positives, but more similar pairs are missed." },
      { id: "b", text: "The threshold falls: more candidate pairs and more false positives." },
      { id: "c", text: "Nothing changes, because n is unchanged." },
      { id: "d", text: "The curve stops being an S-curve." },
    ],
    answerId: "a",
    explanation:
      "The threshold $(1/b)^{1/r}$ moves up as $r$ grows and $b$ shrinks — agreeing on more rows in fewer chances is harder. Choose a threshold **below** your target similarity if missing pairs is expensive, and above it if you care most about limiting the work of scoring candidates.",
  },
  {
    id: "q-s-curve",
    prompt: "With b = 20 bands of r = 5 rows, roughly what is the probability that a pair with Jaccard similarity 0.8 becomes a candidate?",
    options: [
      { id: "a", text: "0.33" },
      { id: "b", text: "0.80" },
      { id: "c", text: "0.9996" },
      { id: "d", text: "1, exactly" },
    ],
    answerId: "c",
    explanation:
      "Agreeing on one band has probability $0.8^5 \\approx 0.328$. Missing all 20 bands has probability $(1 - 0.328)^{20} \\approx 0.00035$, so the pair is a candidate with probability about $0.99965$ — one false negative in roughly 3000 such pairs.",
  },
  {
    id: "q-family",
    prompt: "For minhashing and Jaccard distance, what is P[h(x) = h(y)]?",
    options: [
      { id: "a", text: "d(x, y)" },
      { id: "b", text: "1 − d(x, y)" },
      { id: "c", text: "1 / d(x, y)" },
      { id: "d", text: "It depends on the permutation." },
    ],
    answerId: "b",
    explanation:
      "The probability that two minhashes agree is the Jaccard **similarity**, which is one minus the Jaccard distance. That makes the minhash functions a $(d_1, d_2, 1 - d_1, 1 - d_2)$-sensitive family for any $d_1 < d_2$.",
  },
  {
    id: "q-pipeline",
    prompt: "In the full pipeline, what happens to a candidate pair produced by LSH?",
    options: [
      { id: "a", text: "It is reported as similar immediately." },
      { id: "b", text: "Its signatures are compared, and it is kept only if they agree in at least a fraction t of the components — optionally confirmed on the documents themselves." },
      { id: "c", text: "It is re-hashed with more bands." },
      { id: "d", text: "It is discarded unless both documents share the first shingle." },
    ],
    answerId: "b",
    explanation:
      "LSH only proposes pairs worth examining. Step 6 checks each candidate's signatures against the threshold $t$, and step 7 optionally goes back to the documents to rule out pairs that merely got lucky in their signatures.",
  },
  {
    id: "q-blocking",
    prompt:
      "In the Company A versus Company B dispute, what played the role of the locality-sensitive hash functions?",
    options: [
      { id: "a", text: "Minhash signatures of the shingled records." },
      { id: "b", text: "Sorting the records by name, then by address, then by phone, and scoring only exact ties." },
      { id: "c", text: "Random hyperplanes over the record vectors." },
      { id: "d", text: "A single hash over the concatenation of all three fields." },
    ],
    answerId: "b",
    explanation:
      "Three 'hash functions' sent records to the same bucket only when the name, the address or the phone matched exactly — implemented as three sort passes. It missed any true pair that agreed exactly on none of the three fields, which was accepted as a deliberate trade-off.",
  },
  {
    id: "q-validation",
    prompt:
      "Perfect 300-point matches averaged a 10-day delay, random pairs 45 days, so the true-match fraction at average delay x is (45 − x)/35. A score band averages 31 days. What fraction of those pairs are real matches?",
    options: [
      { id: "a", text: "About 0.11" },
      { id: "b", text: "About 0.40" },
      { id: "c", text: "About 0.69" },
      { id: "d", text: "It cannot be estimated without labelled data." },
    ],
    answerId: "b",
    explanation:
      "$(45 - 31)/35 = 14/35 = 0.4$. The trick needs only a field that is *not* part of the score and that differs on average between true and false pairs — creation dates here, but height or any similar attribute would work the same way.",
  },
  {
    id: "q-exact",
    prompt: "Which technique finds every pair above the similarity bound, with no false negatives at all?",
    options: [
      { id: "a", text: "Minhashing with 400 hash functions." },
      { id: "b", text: "Banding with a threshold well below the target." },
      { id: "c", text: "Prefix indexing combined with length-based filtering." },
      { id: "d", text: "Hashing every document on its first few characters." },
    ],
    answerId: "c",
    explanation:
      "Prefix indexing is exact: indexing a set under its first $\\lfloor (1-J)L_s \\rfloor + 1$ symbols provably cannot miss a pair at similarity $J$ or above. LSH always risks false negatives, and it is most useful precisely when the similarity you accept is relatively low.",
  },
];
