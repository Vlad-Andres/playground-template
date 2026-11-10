import type { Block, SectionBlocks } from "@/content/types";
import { lecture06Meta, lecture06Outline } from "./meta";
import { BandTuner } from "./interactive/BandTuner";
import { ErPipeline } from "./interactive/ErPipeline";

const objectives: Block[] = [
  {
    kind: "prose",
    md: "Part 3 of *Finding Similar Items at Scale* uses the same study material as Parts 1 and 2. It covers §3.4 and §3.8.1–§3.8.3 of *Mining of Massive Datasets*: make similar signatures collide, analyse how well that works, and apply it to real entity resolution.",
  },
  { kind: "list", variant: "objectives", items: lecture06Meta.objectives },
];

const lshIdea: Block[] = [
  {
    kind: "prose",
    md: "Signatures solve the *space* problem but not the *pairs* problem. A million documents with signatures of length 250 fit in a gigabyte, yet there are still half a trillion pairs of documents; at a microsecond per comparison that is almost six days.\n\nIf you genuinely need every pair's similarity, nothing can help. But usually you want only the pairs above some similarity bound — and then **locality-sensitive hashing** applies: hash the items many times, in a way that makes similar items far likelier to share a bucket, and only examine the **candidate pairs** that collide at least once.",
  },
  {
    kind: "prose",
    md: "**Locality-sensitive hashing** focuses on pairs of signatures likely to be similar. The general idea: from the collection of all elements (signatures, here) generate a small list of **candidate pairs** — pairs whose similarity must be evaluated. For signature matrices: hash columns to many buckets, and make elements of the same bucket candidate pairs.\n\nPick a similarity threshold $t$, a fraction below 1. We want columns $c$ and $d$ of the signature matrix $M$ to be a candidate pair **if and only if** their signatures agree in at least a fraction $t$ of the rows, i.e. $M(i, c) = M(i, d)$ for at least a fraction $t$ of the values of $i$. LSH only approximates that wish.",
  },
  {
    kind: "info",
    variant: "warning",
    title: "False positives and false negatives",
    md: "A dissimilar pair that becomes a candidate is a **false positive** — it costs a wasted check. A similar pair that never becomes a candidate is a **false negative** — it is never examined, so it is lost. Tuning LSH means trading one against the other.",
  },
  { kind: "concepts", ids: ["lsh", "candidate-pair"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What problem do signatures leave unsolved?", answer: "The number of pairs: a million documents still give about 5 × 10¹¹ pairs to compare." },
      { prompt: "When should columns c and d ideally be a candidate pair?", answer: "If and only if their signatures agree in at least a fraction t of the rows." },
    ],
  },
];

const banding: Block[] = [
  {
    kind: "prose",
    md: "The big idea: **hash the columns of the signature matrix several times**, arranging that (only) similar columns are likely to hash to the same bucket. Candidate pairs are those that hash to the same bucket **at least once**.\n\nDivide the matrix $M$ into $b$ **bands** of $r$ **rows** each. For each band, hash its portion of each column to a hash table with $k$ buckets — make $k$ as large as possible. Candidate column pairs are those that hash to the same bucket for at least one band. Then tune $b$ and $r$ to catch most similar pairs but few non-similar pairs.",
  },
  {
    kind: "prose",
    md: "For minhash signatures, the effective hashing is **banding**. Divide the signature matrix into $b$ bands of $r$ rows each. For every band, hash each column's $r$-row slice into a bucket array — a *separate* array per band, so identical slices in different bands never collide. With enough buckets, we can assume two slices land together exactly when they are identical.\n\nTwo columns that differ in band 1 still have $b - 1$ further chances. The more similar they are, the likelier one of those chances pays off.",
  },
  {
    kind: "info",
    variant: "note",
    title: "One band, two outcomes",
    md: "Suppose that in one band columns 2 and 6 land in the same bucket: they are **probably identical** in this band and become a candidate pair. Columns 6 and 7 land in different buckets: they are **surely different** in this band — but they may still meet in another band.",
  },
  { kind: "concepts", ids: ["banding"] },
  {
    kind: "recall",
    cards: [
      { prompt: "When do two columns become a candidate pair under banding?", answer: "When their r-row slices are identical in at least one of the b bands (they hash to the same bucket for that band)." },
      { prompt: "Why does each band get its own bucket array?", answer: "So identical slices in different bands never collide — only agreement within the same band counts." },
    ],
  },
];

const analysis: Block[] = [
  {
    kind: "formula",
    tex: "P[\\text{candidate pair}] = 1 - \\left(1 - s^{\\,r}\\right)^{b}",
    caption: "Agree in all r rows of a band with probability sʳ; miss every one of the b bands with probability (1 − sʳ)ᵇ.",
  },
  {
    kind: "interactive",
    title: "Band tuner",
    description:
      "Drag b and r and watch the S-curve move. The dashed line marks the threshold (1/b)^(1/r) where the probability crosses one half.",
    component: BandTuner,
  },
  {
    kind: "steps",
    title: "Why b = 20, r = 5 is a good default",
    intro: "Signatures of length 100, split into twenty bands of five rows.",
    steps: [
      {
        title: "Locate the threshold",
        md: "$(1/b)^{1/r} = (1/20)^{1/5} \\approx 0.549$ — just above one half. Pairs above it are very likely to be candidates, pairs below are unlikely.",
      },
      {
        title: "Take a genuinely similar pair, s = 0.8",
        md: "$s^5 = 0.328$, so the chance of agreeing in all five rows of one band is about 33%. Missing that band happens with probability $1 - 0.328 = 0.672$.",
      },
      {
        title: "Miss all twenty bands",
        md: "$0.672^{20} \\approx 0.00035$. So $P[\\text{candidate}] \\approx 0.99965$: only about one in 3000 pairs at 80% similarity is a false negative.",
      },
      {
        title: "Check the other end, s = 0.2",
        md: "$1 - (1 - 0.2^5)^{20} \\approx 0.006$. Six in a thousand dissimilar pairs get scored unnecessarily — cheap insurance.",
      },
      {
        title: "Read the slope",
        md: "The curve rises by more than 0.6 between $s = 0.4$ and $s = 0.6$, so the slope in the middle exceeds 3. It is not the ideal step function, but it is steep where it matters.",
      },
    ],
  },
  {
    kind: "table",
    headers: ["s", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8"],
    rows: [["1 − (1 − s⁵)²⁰", ".006", ".047", ".186", ".470", ".802", ".975", ".9996"]],
    caption: "The S-curve for b = 20, r = 5 (Mining of Massive Datasets, Figure 3.9).",
  },
  {
    kind: "info",
    variant: "warning",
    title: "Pick the threshold deliberately",
    md: "Choose $b$ and $r$ with $br = n$ so that $(1/b)^{1/r}$ lands near your target similarity $t$. If **missing pairs is expensive**, aim for a threshold *below* $t$ and accept more false positives. If **scoring candidates is expensive**, aim *above* $t$. LSH is most valuable when the similarity you accept is relatively low.",
  },
  { kind: "concepts", ids: ["s-curve"] },
  {
    kind: "practice",
    id: "l6-s-curve",
    tasks: [
      {
        id: "threshold",
        prompt: "Signatures of length 64 are split into b = 16 bands of r = 4 rows. What is the approximate threshold (1/b)^(1/r)?",
        check: { mode: "text", accept: ["0.5", "1/2", ".5"], placeholder: "threshold" },
        solution: "$(1/16)^{1/4} = $ **0.5**.",
      },
      {
        id: "probability",
        prompt: "With r = 3 and b = 10, what is the probability that a pair with s = 0.5 becomes a candidate? Two decimals.",
        check: { mode: "text", accept: ["0.74", ".74", "0.737"], placeholder: "probability" },
        solution: "$s^3 = 0.125$, $(1 - 0.125)^{10} = 0.875^{10} \\approx 0.263$, so $P \\approx $ **0.74**.",
      },
    ],
  },
];

const pipeline: Block[] = [
  {
    kind: "prose",
    md: "Put the pieces together and the whole method is a short recipe. Nothing in it is optional except the last step, and every step has a knob that trades accuracy for speed.",
  },
  {
    kind: "timeline",
    items: [
      {
        label: "Step 1",
        title: "Shingle",
        md: "Pick $k$ and build the set of k-shingles for each document. Optionally hash the shingles to shorter bucket numbers.",
      },
      {
        label: "Step 2",
        title: "Sort by shingle",
        md: "Order the document-shingle pairs so the signature pass can stream over them.",
      },
      {
        label: "Step 3",
        title: "Minhash",
        md: "Pick a signature length $n$ and compute all signatures in one pass using row hashing.",
      },
      {
        label: "Step 4",
        title: "Choose b and r",
        md: "Fix the similarity threshold $t$ you want, then pick $b$ and $r$ with $br = n$ and $(1/b)^{1/r} \\approx t$ — lower to avoid false negatives, higher to limit false positives.",
      },
      {
        label: "Step 5",
        title: "Band and bucket",
        md: "Apply LSH to the signature matrix and collect the candidate pairs.",
      },
      {
        label: "Step 6",
        title: "Check the signatures",
        md: "For each candidate, measure the fraction of signature components that agree and keep those at or above $t$.",
      },
      {
        label: "Step 7",
        title: "Verify on the real data (optional)",
        md: "Go back to the documents themselves to rule out pairs that merely got lucky in their signatures.",
      },
    ],
  },
  {
    kind: "interactive",
    title: "Pipeline explorer",
    description:
      "Click a stage to see what it produces, why it works, and what it costs. Watch how the data volume collapses from N² to something you can afford.",
    component: ErPipeline,
  },
  {
    kind: "info",
    variant: "note",
    title: "The big picture",
    md: "**Document** → the set of strings of length $k$ that appear in it (**shingling**) → **signatures**: short integer vectors that represent the sets and reflect their similarity (**minhashing**) → **locality-sensitive hashing** → **candidate pairs**: those pairs of signatures that we need to test for similarity.",
  },
];

const lshFamilies: Block[] = [
  {
    kind: "prose",
    md: "LSH rests on a general condition (the theory is MMDS §3.6, beyond the required sections — know the definition). Consider a space $S$ of points with distance measure $d$. A family of hash functions is **$(d_1, d_2, p_1, p_2)$-sensitive** if, for any two points $x$ and $y$ and every $h$ in the family:",
  },
  {
    kind: "formula",
    tex: "d(x,y) \\le d_1 \\Rightarrow P[h(x)=h(y)] \\ge p_1 \\qquad d(x,y) \\ge d_2 \\Rightarrow P[h(x)=h(y)] \\le p_2",
    caption: "For Jaccard distance and minhash: P[h(x) = h(y)] = 1 − d(x, y).",
  },
  {
    kind: "prose",
    md: "Close points collide often, far points rarely. Banding is the standard way of **amplifying** such a family: requiring agreement on all $r$ rows of a band (an AND) and accepting any of $b$ bands (an OR) pushes $p_1$ towards 1 and $p_2$ towards 0 — which is exactly what turns a weak guarantee into the steep S-curve.",
  },
  { kind: "concepts", ids: ["lsh-family"] },
];

const erAtScale: Block[] = [
  {
    kind: "prose",
    md: "Records are not documents. Their similarity fits neither the similar-sets nor the similar-vectors model that the theory is built on, so real entity resolution adapts the idea rather than applying it verbatim.\n\nThe canonical example: Company A solicited customers for Company B, then the two quarrelled over how many customers A had actually delivered. Each held about a million records with names, addresses and phone numbers — and no field saying *this is a customer A provided*. A trillion pairs, and no ground truth.",
  },
  {
    kind: "prose",
    md: "**Scoring.** Each of the three fields was worth 100 points, so an exact match everywhere scored 300. Mismatches were deducted using edit distance, with the penalty growing *quadratically* in the distance. Public tables then softened specific cases: *Bill* and *William* were treated as differing in one letter, though their edit distance is 5.\n\n**Blocking.** Scoring a trillion pairs was impossible, so three crude hash functions were used: one sent records to the same bucket only when names matched exactly, one for addresses, one for phone numbers. In practice there was no hashing at all — the records were sorted three times and consecutive ties were scored. This misses any true pair that matches exactly on none of the three fields, which was accepted: a judge would not have believed such a pair anyway.",
  },
  {
    kind: "steps",
    title: "Validating the matches without labels",
    intro:
      "How do you decide which score is high enough, when nobody ever labelled the data? Use a field that is *not* part of the score.",
    steps: [
      {
        title: "Find an unused signal",
        md: "Record creation dates. A subscription bought at A and registered at B could not lag by more than 90 days, so a random constrained pair has an average delay of 45 days.",
      },
      {
        title: "Anchor on the certain matches",
        md: "Pairs scoring a perfect 300 had an average delay of 10 days. Assume those are all genuine.",
      },
      {
        title: "Interpolate",
        md: "For a score band whose average delay is $x$, with a true-match fraction $f$: $x = 10f + 45(1-f) = 45 - 35f$, so $f = (45 - x)/35$.",
      },
      {
        title: "Read the answer off",
        md: "Down to a score of 185, $x$ stayed near 10 — those pairs are essentially certain. A score of 185 means one field identical, one completely different, and one with a small discrepancy. Even at 115, $x$ was noticeably below 45, so some of those were real too.",
      },
      {
        title: "Generalise the trick",
        md: "It works whenever there is a scoring system **and** some field outside it whose value differs on average between true and false pairs. With heights: $f = (h_1 - h)/(h_1 - h_0)$, where $h_0$ is the average difference for perfect matches and $h_1$ for random pairs.",
      },
    ],
  },
  { kind: "concepts", ids: ["blocking", "match-validation"] },
  {
    kind: "practice",
    id: "l6-validation",
    tasks: [
      {
        id: "fraction",
        prompt: "Perfect matches average a 10-day delay, random pairs 45 days. A score band averages 24 days. What fraction of its pairs are true matches?",
        check: { mode: "text", accept: ["0.6", "3/5", ".6", "60%"], placeholder: "fraction" },
        solution: "$f = (45 - 24)/35 = 21/35 = $ **0.6**.",
      },
    ],
  },
];

const highSimilarity: Block[] = [
  {
    kind: "info",
    variant: "note",
    title: "Know the ideas",
    md: "For very high similarity there are further methods: finding identical items (hash on the first few letters, hash the whole document, hash fixed positions only), representing sets as strings, length-based filtering and prefix indexing. They are MMDS §3.9, outside the required book sections, so know the ideas rather than every detail.",
  },
  {
    kind: "prose",
    md: "LSH earns its keep when the similarity you accept is relatively low. When you want sets that are *almost identical* — say Jaccard similarity at least 0.9 — there are faster methods, and they are **exact**: no false negatives at all.\n\nFirst represent a set as a string: fix an order on the universal set and list the set's elements in that order. Such strings never repeat a character, and shared characters always appear in the same relative order.",
  },
  {
    kind: "prose",
    md: "**Length-based filtering.** Sort the strings by length. The intersection of $s$ and $t$ cannot exceed $L_s$, and their union is at least $L_t$, so $SIM(s,t) \\le L_s / L_t$. For the pair to be worth comparing at all, $L_t \\le L_s / J$.\n\n**Prefix indexing.** Index each string under its first $p = \\lfloor (1-J) L_s \\rfloor + 1$ symbols. If $t$ shared none of those, the best it could be is the suffix of $s$ after the prefix, giving similarity $(L_s - p)/L_s$, which is below $J$ by construction.",
  },
  {
    kind: "steps",
    title: "Prefix indexing at J = 0.9",
    steps: [
      {
        title: "Compute the prefix length",
        md: "For $L_s = 9$: $p = \\lfloor 0.1 \\times 9 \\rfloor + 1 = 1$. The string is indexed under its first symbol only.",
      },
      {
        title: "Check the escape routes",
        md: "Take $s = bcdefghij$. A string $t$ starting with *a* can only reach 0.9 if it is $abcdefghij$ — but that has length 10, so $p = 2$ and it is indexed under both *a* and *b*. The pair is found.",
      },
      {
        title: "Check the other direction",
        md: "If $t$ starts with *c* or later, the best case is $t = cdefghij$, giving $SIM = 8/9 < 0.9$. No comparison needed.",
      },
      {
        title: "Combine with length filtering",
        md: "At $J = 0.9$ a string of length 9 is only compared with strings of length 9 and 10, since $9/0.9 = 10$. Strings of length 10-19 are indexed under two symbols, 20-29 under three, and so on.",
      },
      {
        title: "Order the symbols rarest first",
        md: "Instead of lexicographic order, count how often each element occurs across all sets and order by that count, lowest first. Prefixes then contain rare symbols, so the index buckets they fall into are small.",
      },
    ],
  },
  {
    kind: "info",
    variant: "note",
    title: "For truly identical items",
    md: "Hashing on the first few characters breaks when every document starts with the same HTML header. Hashing the entire document works but reads every byte. The practical compromise is to hash a fixed set of random positions — and never compare two documents whose lengths differ significantly.",
  },
  { kind: "concepts", ids: ["length-filtering", "prefix-indexing"] },
];

const mistakes: Block[] = [
  {
    kind: "info",
    variant: "pitfall",
    title: "Confusing similarity with distance",
    md: "Jaccard **similarity** is intersection over union; Jaccard **distance** is one minus that. The S-curve is drawn against similarity, but the locality-sensitive family definition is stated in terms of distance. Read the axis label before answering.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Thinking a candidate pair is a match",
    md: "LSH only produces pairs *worth examining*. Candidates still have to be scored, and pairs above the threshold may still be checked against the original documents. Skipping that step means shipping every false positive.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Treating false negatives as a bug",
    md: "They are the deliberate price of avoiding the quadratic comparison. The only question is how many you are willing to lose, and that is what choosing $b$ and $r$ decides. If you cannot lose any, use prefix indexing instead — but only high similarity thresholds make that affordable.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Estimating similarity from a short signature",
    md: "The expected signature similarity equals the Jaccard similarity, but the variance at $n = 2$ or $n = 5$ is enormous — the lecture example estimates 0.2 as 0.0. Unbiased is not the same as accurate.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Forgetting that clustering is transitive",
    md: "A threshold that looks safe pairwise can merge two clearly different entities through a chain of intermediate records. Always look at the clusters the threshold produces, not just at the pairs it accepts.",
  },
];

const quiz: Block[] = [
  {
    kind: "prose",
    md: "Ten questions on LSH, banding and entity resolution at scale.",
  },
];

const summary: Block[] = [
  { kind: "list", variant: "takeaways", items: lecture06Meta.takeaways },
  {
    kind: "table",
    headers: ["Quantity", "Formula", "Where it shows up"],
    rows: [
      ["Banding probability", "1 − (1 − sʳ)ᵇ", "The S-curve"],
      ["LSH threshold", "(1/b)^(1/r)", "Tuning b and r"],
      ["Signature length", "n = b · r", "Fixed when tuning"],
      ["Minhash family", "P[h(x) = h(y)] = 1 − d(x, y)", "(d₁, d₂, p₁, p₂)-sensitivity"],
      ["True-match fraction", "f = (45 − x) / 35", "Validating record matches"],
      ["Length filter", "Lₜ ≤ Lₛ / J", "Exact high-similarity search"],
      ["Prefix length", "⌊(1 − J)·Lₛ⌋ + 1", "Prefix indexing"],
    ],
    caption: "Everything worth memorising from Part 3.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "The one sentence version across all three parts",
    md: "Turn items into sets, compress the sets into signatures that preserve Jaccard similarity, band the signatures so that only plausibly similar pairs ever meet, and spend your expensive scoring function only on those.",
  },
];

export const lecture06Blocks: SectionBlocks<typeof lecture06Outline> = {
  objectives,
  "lsh-idea": lshIdea,
  banding,
  analysis,
  pipeline,
  "lsh-families": lshFamilies,
  "er-at-scale": erAtScale,
  "high-similarity": highSimilarity,
  mistakes,
  quiz,
  summary,
};
