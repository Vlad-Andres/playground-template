import type { Block, SectionBlocks } from "@/content/types";
import { lecture05Meta, lecture05Outline } from "./meta";
import { MinhashLab } from "@/widgets/dis/MinhashLab";
import { ShinglingExplorer } from "@/widgets/dis/ShinglingExplorer";

const objectives: Block[] = [
  {
    kind: "prose",
    md: "Part 2 of *Finding Similar Items at Scale* uses the same study material as Part 1. It covers §3.1–§3.3 of *Mining of Massive Datasets*: turn entities into sets, and turn sets into short signatures that still remember how similar they were.",
  },
  { kind: "list", variant: "objectives", items: lecture05Meta.objectives },
];

const entitiesAsSets: Block[] = [
  {
    kind: "prose",
    md: "Entity identification is based on similarity — on finding similar items. For a small number of entities of relatively small size, things are manageable. But what if there are **too many** entities? Then there are too many comparisons (**time**). What if the entities are **too large**? Then the memory requirements explode (**space**).\n\nThe approach: **see entities as sets**. Finding similar items is then reduced to finding similar sets.",
  },
  {
    kind: "table",
    headers: ["Problem expressed as finding similar sets", "What it is for"],
    rows: [
      ["Entity resolution", "Records describing the same real-world entity"],
      ["Pages with similar words", "Classification by topic, plagiarism, avoiding repetition"],
      ["Netflix users with similar tastes in movies", "Recommendation systems"],
      ["Dual: movies with similar sets of fans", "Movie classification"],
    ],
    caption: "Many data-mining problems can be expressed as finding similar sets.",
  },
  {
    kind: "prose",
    md: "**Similarity of documents** (MMDS §3.1.2) is about *character-level* similarity, not similar meaning. Testing for exact duplicates is easy — compare character by character. The interesting cases share large portions of text without being identical:\n\n- **Plagiarism** — the plagiarist may take only parts of a document, alter a few words and reorder sentences.\n- **Mirror pages** — popular sites are duplicated on several hosts; each copy differs slightly (host information, links to the *other* mirrors). Course pages reused from year to year behave the same way. Search engines should avoid showing near-identical pages on the first page of results.\n- **Articles from the same source** — one news-agency article is republished by many newspapers, each cutting paragraphs, adding material and surrounding it with its own logo, ads and links. Aggregators such as Google News want to show only one version.",
  },
  {
    kind: "prose",
    md: "**Collaborative filtering** (MMDS §3.1.3) recommends to users what similar users liked. Amazon can call two customers similar when their sets of purchased items have high Jaccard similarity — and two items similar when their sets of buyers do. Here similarities need not be high to be significant: mirror sites may exceed 90%, but even 20% can mark customers with similar tastes. Netflix movie ratings are not binary, so the book offers three ways to turn them into sets: ignore low ratings; give each movie two elements, *liked* and *hated*; or, for 1-to-5 stars, put a movie into a customer's **bag** $n$ times for $n$ stars and use bag similarity.",
  },
  {
    kind: "formula",
    tex: "SIM_{bag}(B, C) = \\frac{\\sum_x \\min\\big(\\#_B(x), \\#_C(x)\\big)}{|B| + |C|} \\qquad \\{a,a,a,b\\} \\text{ vs } \\{a,a,b,b,c\\} = \\frac{2 + 1}{4 + 5} = \\frac{1}{3}",
    caption: "Jaccard similarity of bags. With the union defined as the sum of the bag sizes, the largest possible value is 1/2.",
  },
  {
    kind: "info",
    variant: "warning",
    title: "The concrete goal",
    md: "Given a large number $N$ of documents — millions or billions — find the **near-duplicate** pairs. Three problems stand in the way: there are too many documents to compare all pairs; documents are so large or so many that they cannot fit in main memory; and many small pieces of one document can appear **out of order** in another, so order matters.",
  },
  { kind: "concepts", ids: ["set-similarity", "bag-similarity"] },
  {
    kind: "practice",
    id: "l5-sets",
    tasks: [
      {
        id: "jaccard-246",
        prompt: "What is the Jaccard similarity of {1, 2, 3, 4} and {2, 4, 6}?",
        check: { mode: "text", accept: ["2/5", "0.4"], placeholder: "fraction" },
        solution: "Intersection {2, 4}, union {1, 2, 3, 4, 6}: **2/5**.",
      },
      {
        id: "bag",
        prompt: "What is the Jaccard bag similarity of {1, 1, 1, 2} and {1, 1, 2, 2, 3}?",
        check: { mode: "text", accept: ["1/3", "3/9", "0.333"], placeholder: "fraction" },
        solution: "Intersection: 1 counted min(3, 2) = 2 times, 2 counted min(1, 2) = 1 time — size 3. Union: 4 + 5 = 9. Similarity **1/3**.",
      },
    ],
  },
];

const shingling: Block[] = [
  {
    kind: "prose",
    md: "How do you turn a document into a set? A set of words, or of “important” words, is not effective — it throws away order. **Shingling** keeps it: generate the set of strings of length $k$ that appear in the document. A **k-shingle** (or k-gram) is a sequence of $k$ characters, $k$ words, or $k$ of any other token.",
  },
  {
    kind: "steps",
    title: "A small example, k = 2",
    steps: [
      { title: "Shingle each document", md: "$D_1 = abcab$ gives {ab, bc, ca} — *ab* occurs twice but appears once in the set. $D_2 = abfef$ gives {ab, bf, fe, ef}." },
      { title: "Fix an order on all shingles", md: "The shingles seen are [ab, bc, ca, bf, fe, ef]." },
      { title: "Each document becomes a 0/1 vector", md: "$D_1 = [1, 1, 1, 0, 0, 0]$ and $D_2 = [1, 0, 0, 1, 1, 1]$ — vectors in the space of shingles, and very **sparse** ones in practice. Their Jaccard similarity is $1/6$." },
    ],
  },
  {
    kind: "prose",
    md: "Documents that are intuitively similar have **many shingles in common**. Changing a word only affects the k-shingles within distance $k$ of that word, and reordering paragraphs only affects the $2k$ shingles that cross paragraph boundaries. With $k = 3$, *The dog which chased the cat* versus *The dog that chased the cat* replaces only seven 3-shingles: `g_w`, `_wh`, `whi`, `hic`, `ich`, `ch_` and `h_c`.\n\nWhite space deserves care: replace any run of blanks, tabs and newlines by a single blank rather than deleting it, so shingles spanning two words stay distinct. With $k = 9$, *touch down* gives `touch dow` and `ouch down` while *touchdown* gives `touchdown`.",
  },
  {
    kind: "info",
    variant: "warning",
    title: "Selecting the right k",
    md: "Pick $k$ large enough that the probability of any given shingle appearing in any given document is low; with $k = 1$ almost all web pages share almost all characters. A rule of thumb is **$k = 5$ for short documents** and **$k = 10$ for long documents**. The book reasons the same way: for emails, $27^5 \\approx 14$ million possible 5-shingles is plenty — though since common letters dominate, imagine only 20 characters and estimate $20^k$ — and **$k = 9$** is considered safe for research articles.",
  },
  {
    kind: "prose",
    md: "**Hashing shingles.** Represent a document by the set of **hash values** of its k-shingles: for $D_1 = abcab$, $S(D_1) = \\{ab, bc, ca\\}$ might become $h(D_1) = \\{1, 5, 7\\}$. Two documents could (rarely) appear to share shingles when in fact only the hash values were shared. The book maps 9-shingles to buckets in $[0, 2^{32} - 1]$, four bytes instead of nine — and this discriminates **better** than 4-shingles, which also cost four bytes: only about $20^4 = 160{,}000$ different 4-shingles are likely in English, while hashed 9-shingles fill almost the whole 32-bit range.\n\n**Selecting the right token** matters too. For finding the same news article on different pages, the book defines a shingle as a **stop word followed by the next two words**. News prose is full of stop words; ads and navigation are not, so the article contributes most of the shingles. *A spokesperson for the Sudzo Corporation revealed today…* yields *A spokesperson for*, *for the Sudzo*, *the Sudzo Corporation* and more; the ad *Buy Sudzo* yields none.",
  },
  {
    kind: "interactive",
    title: "Shingling explorer",
    description: "Change k, switch between character and word tokens, and watch which shingles two documents actually share.",
    component: ShinglingExplorer,
  },
  { kind: "concepts", ids: ["shingling", "hashed-shingles", "word-shingles"] },
  {
    kind: "practice",
    id: "l5-shingles",
    tasks: [
      {
        id: "count",
        prompt: "How many distinct 2-shingles does the document *abcdabd* have?",
        check: { mode: "text", accept: ["5"], placeholder: "count" },
        solution: "{ab, bc, cd, da, bd}: **5** — *ab* occurs twice but counts once.",
      },
      {
        id: "max",
        prompt: "What is the largest number of k-shingles a document of n characters can have (assuming the alphabet is large enough)?",
        check: { mode: "text", accept: ["n-k+1", "n − k + 1", "n+1-k", "n - k + 1"], placeholder: "formula in n and k" },
        solution: "One shingle starts at each of the first **n − k + 1** positions, and in the best case they are all different.",
      },
    ],
  },
];

const matrices: Block[] = [
  {
    kind: "prose",
    md: "With documents as sets, similarity is **Jaccard similarity** (Lecture 2): the size of the intersection over the size of the union — two sets sharing 3 elements out of 8 distinct ones have similarity 3/8.\n\nMany similarity problems can be formalised as finding subsets with a significant intersection. **Encode sets as 0/1 vectors**, one dimension per element of the universal set: set intersection becomes **bitwise AND** and union **bitwise OR**. For $C_1 = 10111$ and $C_2 = 10011$ the intersection has size 3 and the union size 4, so the Jaccard *similarity* is 3/4 and the *distance* 1/4.",
  },
  {
    kind: "info",
    variant: "warning",
    title: "The challenge",
    md: "Suppose we need near-duplicate documents among $N = 1$ million documents. Naïvely we compute the Jaccard similarity of every pair: $N(N-1)/2 \\approx 5 \\times 10^{11}$ comparisons. At $10^5$ seconds per day and $10^6$ comparisons per second, that takes **5 days**. For $N = 10$ million it takes more than a year. The solution: construct much smaller **signatures** of the items and compare those instead.",
  },
  {
    kind: "prose",
    md: "Picture all the sets together as one **boolean matrix**: **rows** are the elements of the universal set (for example, all k-shingles), **columns** are the sets, and there is a 1 in row $e$ and column $S$ if and only if $e$ is a member of $S$. Column similarity is the Jaccard similarity of the sets of rows in which they have a 1. The typical matrix is very sparse — it is a way of thinking, never actually stored.",
  },
  {
    kind: "table",
    headers: ["Row", "C₁", "C₂", "Counts towards"],
    rows: [
      ["1", "0", "1", "union"],
      ["2", "1", "0", "union"],
      ["3", "1", "1", "intersection and union"],
      ["4", "0", "0", "nothing"],
      ["5", "1", "1", "intersection and union"],
      ["6", "0", "1", "union"],
    ],
    caption: "Column similarity: 2 rows in the intersection, 5 in the union, Sim(C₁, C₂) = 2/5 = 0.4.",
  },
  {
    kind: "table",
    headers: ["Row type", "C₁", "C₂", "Counts towards"],
    rows: [
      ["a", "1", "1", "intersection and union"],
      ["b", "1", "0", "union only"],
      ["c", "0", "1", "union only"],
      ["d", "0", "0", "nothing"],
    ],
    caption: "Given two columns, every row is one of four types. With a = the number of type-a rows, etc., Sim(C₁, C₂) = a / (a + b + c).",
  },
  { kind: "concepts", ids: ["jaccard", "characteristic-matrix"] },
  {
    kind: "recall",
    cards: [
      { prompt: "How long does comparing all pairs of 1 million documents take, and what is the way out?", answer: "≈ 5 × 10¹¹ comparisons, about 5 days at 10⁶ per second; compare much smaller signatures instead." },
      { prompt: "In the boolean matrix, what are rows, columns and a 1?", answer: "Rows are elements of the universal set (e.g. shingles), columns are sets, a 1 means the element belongs to the set." },
      { prompt: "Express Jaccard similarity in terms of row types.", answer: "a / (a + b + c) — type-d rows (0, 0) don't count." },
    ],
  },
];

const minhashing: Block[] = [
  {
    kind: "prose",
    md: "**Minhashing** converts large sets into short signatures while preserving similarity. Imagine the rows of the boolean matrix **permuted randomly**. The **minhash function** $h(C)$ is the number of the first row, in the permuted order, in which column $C$ has a 1. Use several — e.g. 100 — independent permutations to create a signature for each column. The signatures form another matrix, the **signature matrix**, whose columns represent the sets and whose rows are the minhash values, one per permutation.",
  },
  {
    kind: "table",
    headers: ["Row", "π₁", "π₂", "π₃", "C₁", "C₂", "C₃", "C₄"],
    rows: [
      ["1", "2", "4", "3", "1", "0", "1", "0"],
      ["2", "3", "2", "4", "1", "0", "0", "1"],
      ["3", "7", "1", "7", "0", "1", "0", "1"],
      ["4", "6", "3", "2", "0", "1", "0", "1"],
      ["5", "1", "6", "6", "0", "1", "0", "1"],
      ["6", "5", "7", "1", "1", "0", "1", "0"],
      ["7", "4", "5", "5", "1", "0", "1", "0"],
    ],
    caption: "The running example: three permutations (each πᵢ gives a row's position in the permuted order) and a 7 × 4 input matrix of shingles × documents.",
  },
  {
    kind: "table",
    headers: ["Minhash", "C₁", "C₂", "C₃", "C₄"],
    rows: [
      ["h₁ (π₁)", "2", "1", "2", "1"],
      ["h₂ (π₂)", "2", "1", "4", "1"],
      ["h₃ (π₃)", "1", "2", "1", "2"],
    ],
    caption: "The signature matrix M. Under π₁, column C₁ has 1s in rows at positions 2, 3, 5 and 4 — so the 2nd element of the permutation is the first to map to a 1, and h₁(C₁) = 2.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "The surprising property",
    md: "The probability, over all permutations of the rows, that $h(C_1) = h(C_2)$ is the same as $Sim(C_1, C_2)$. **Both are $a / (a + b + c)$!**\n\nWhy? Look down the permuted columns $C_1$ and $C_2$ until you see the first 1. Type-d rows are skipped. If that row is type a, then $h(C_1) = h(C_2)$; if it is type b or c, then not. Every one of the $a + b + c$ rows is equally likely to come first.",
  },
  {
    kind: "prose",
    md: "The **similarity of signatures** is the fraction of the minhash functions in which they agree — thinking of signatures as columns of integers, the fraction of rows in which they agree. Thus the **expected** similarity of two signatures equals the Jaccard similarity of the sets they represent, and the longer the signatures, the smaller the expected error.",
  },
  {
    kind: "table",
    headers: ["Pair", "Col/Col (Jaccard)", "Sig/Sig (3 minhashes)"],
    rows: [
      ["C₁–C₃", "0.75", "0.67"],
      ["C₂–C₄", "0.75", "1.00"],
      ["C₁–C₂", "0", "0"],
      ["C₃–C₄", "0", "0"],
    ],
    caption: "Signature similarity estimates Jaccard similarity: right on average, noisy with only three minhash functions.",
  },
  { kind: "concepts", ids: ["minhash", "signature-matrix"] },
  {
    kind: "practice",
    id: "l5-minhash",
    tasks: [
      {
        id: "h2-c3",
        prompt: "In the example, column C₃ has 1s in rows 1, 6 and 7. Under π₂ those rows sit at positions 4, 7 and 5. What is h₂(C₃)?",
        check: { mode: "text", accept: ["4"], placeholder: "minhash" },
        solution: "The first position, in permuted order, holding a 1 for C₃ is the smallest of 4, 7 and 5: **4**.",
      },
      {
        id: "sig-sim",
        prompt: "Signatures [2, 2, 1] and [2, 4, 1] — what is their signature similarity?",
        check: { mode: "text", accept: ["2/3", "0.67", "0.667"], placeholder: "fraction" },
        solution: "They agree in the first and third minhash: **2/3** — the estimate for C₁–C₃, whose true Jaccard similarity is 0.75.",
      },
    ],
  },
];

const rowHashing: Block[] = [
  {
    kind: "prose",
    md: "Suppose there are **1 billion rows**. It is hard to pick a random permutation of 1…billion; representing one takes 1 billion entries; and accessing rows in permuted order leads to thrashing. Permuting rows even once is prohibitive.\n\n**Row hashing** solves it: pick $K = 100$ hash functions $k_i$; the ordering of the rows under $k_i$ gives a random row permutation. And it can be done in **one pass**: for each column $C$ and hash function $k_i$ keep a *slot* for the minhash value, initialise every $sig(C)[i] = \\infty$, and scan the rows looking for 1s. If row $j$ has a 1 in column $C$, then for each $k_i$: if $k_i(j) < sig(C)[i]$, set $sig(C)[i] \\leftarrow k_i(j)$.",
  },
  {
    kind: "code",
    lang: "python",
    code: `# M[i][c] is the minhash of column c under hash function h_i.
for i in range(n_hashes):
    for c in columns:
        M[i][c] = INFINITY

for r in rows:
    h = [h_i(r) for h_i in hashes]        # compute every h_i(r) once
    for c in columns:
        if document_c_has_1_in_row(c, r):
            for i in range(n_hashes):
                if h[i] < M[i][c]:
                    M[i][c] = h[i]`,
    caption: "The algorithm: one pass over the rows builds every signature at once.",
  },
  {
    kind: "interactive",
    title: "Minhash signature builder",
    description:
      "The worked example from the lecture. Step through the rows and watch the signature slots fall from infinity. Click any 0/1 cell to change the input and see what happens.",
    component: MinhashLab,
  },
  {
    kind: "steps",
    title: "Hand-trace the lecture example",
    intro:
      "Rows 1–5, two columns, $h(x) = x \\bmod 5$ and $g(x) = (2x+1) \\bmod 5$. Column $C_1$ has 1s in rows 1, 3, 4; column $C_2$ in rows 2, 3, 5.",
    steps: [
      { title: "Initialise every slot to infinity", md: "$sig(C_1) = [\\infty, \\infty]$ and $sig(C_2) = [\\infty, \\infty]$. Nothing has been seen yet." },
      { title: "Row 1 — h(1) = 1, g(1) = 3", md: "Only $C_1$ has a 1, so $sig(C_1) = [1, 3]$. $C_2$ is untouched." },
      { title: "Row 2 — h(2) = 2, g(2) = 0", md: "Only $C_2$ has a 1, so $sig(C_2) = [2, 0]$." },
      { title: "Row 3 — h(3) = 3, g(3) = 2", md: "Both columns have a 1. For $C_1$, 3 is not below 1 but 2 is below 3, so $sig(C_1) = [1, 2]$. For $C_2$, neither 3 nor 2 improves on $[2, 0]$." },
      { title: "Row 4 — h(4) = 4, g(4) = 4", md: "Only $C_1$ has a 1, and neither 4 improves on $[1, 2]$. Nothing changes." },
      { title: "Row 5 — h(5) = 0, g(5) = 1", md: "Only $C_2$ has a 1. Now $0 < 2$, so the first slot drops: $sig(C_2) = [0, 0]$." },
      { title: "Read off the result", md: "$sig(C_1) = [1, 2]$ and $sig(C_2) = [0, 0]$ — they agree in zero rows. The true Jaccard similarity is $1/5 = 0.2$: only row 3 is type a, rows 1, 2, 4 and 5 are type b or c. Two hash functions are simply not enough to estimate 0.2; that is the noise 100 hashes average away." },
    ],
  },
  {
    kind: "prose",
    md: "**Speeding up minhashing** (MMDS §3.3.6–§3.3.7). Each minhash function still examines all $k$ rows. Instead, compute it from only the **first $m$ rows**, cutting the work by a factor $k/m$. A column with only 0s in those rows gets the value $\\infty$, and signatures are compared with three cases:\n\n1. Neither column is $\\infty$: count agreement or disagreement as usual.\n2. One column is $\\infty$, the other not: the other column has a 1 among the first $m$ rows and the $\\infty$ column does not — count a **disagreement**.\n3. Both are $\\infty$: the first $m$ rows say nothing about these sets, so count **neither**.\n\nAs long as case 3 is rare, accuracy barely suffers, and the time saved buys extra minhash functions. With hash functions instead of true permutations, hash only the first $m$ rows and take the minimum seen so far. Better still, split the $k$ rows into $k/m$ groups and compute one minhash value per group: a single hash function and a single pass yield $k/m$ signature rows, and errors in one group are balanced by the others.",
  },
  {
    kind: "steps",
    title: "MMDS Example 3.9: two groups of four rows",
    intro: "Eight rows, sets $S_1$ = rows {5, 6, 7}, $S_2$ = {4, 5, 6}, $S_3$ = {3, 4, 5}. True similarities: $SIM(S_1,S_2) = 1/2$, $SIM(S_1,S_3) = 1/5$, $SIM(S_2,S_3) = 1/2$. Take $m = 4$.",
    steps: [
      { title: "First four rows", md: "$S_1$ has no 1 there, so its minhash is $\\infty$ and never agrees with $S_2$: restricted to these rows, $SIM(S_1, S_2) = 0$." },
      { title: "Last four rows", md: "Restricted to rows 5–8, $S_1 = \\{5,6,7\\}$ and $S_2 = \\{5,6\\}$, so their similarity there is $2/3$." },
      { title: "Expected agreement", md: "The two minhash values agree with expected fraction $(0 + 2/3)/2 = 1/3$, against a true 1/2 — an error, but not a large one. For $S_1, S_3$ it is $(0 + 1/3)/2 = 1/6$ against 1/5, and for $S_2, S_3$ exactly 1/2. With far more than four rows per group the expected error approaches zero." },
    ],
  },
  { kind: "concepts", ids: ["row-hashing", "minhash-speedup"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Why can't you just permute the rows?", answer: "With a billion rows, picking and storing a random permutation is impractical (a billion entries), and reading rows in permuted order thrashes." },
      { prompt: "Describe the one-pass row-hashing algorithm.", answer: "Slots sig(C)[i] = ∞ for every column and hash function; scan rows; for a row j with a 1 in column C, set sig(C)[i] = kᵢ(j) whenever kᵢ(j) is smaller." },
      { prompt: "Minhashing on the first m rows: how is a signature row counted when one column is ∞? When both are?", answer: "One ∞: a disagreement. Both ∞: neither — the row is ignored." },
    ],
  },
];

const mistakes: Block[] = [
  {
    kind: "info",
    variant: "pitfall",
    title: "Using a set of words instead of shingles",
    md: "A bag or set of words loses order, so it cannot tell a plagiarised paragraph from the same words used differently. Shingles keep local order.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Choosing k too small",
    md: "With tiny $k$ every document contains most shingles and everything looks similar. Choose $k$ so that a given shingle is unlikely in a given document.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Deleting white space",
    md: "Collapse runs of white space into one blank instead of removing it, or *touch down* and *touchdown* become indistinguishable.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Estimating similarity from a short signature",
    md: "Expected signature similarity equals Jaccard similarity, but with 2 or 3 minhash functions the variance is enormous — the hand-traced example estimates 0.2 as 0.0. Unbiased is not the same as accurate.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Reading the minhash as a row number before permuting",
    md: "$h(C)$ is the position, **in the permuted order**, of the first row with a 1 — not the original row index. In the running example the permutation columns give exactly those positions.",
  },
];

const quiz: Block[] = [
  {
    kind: "prose",
    md: "Ten questions on turning entities into sets and sets into signatures.",
  },
];

const summary: Block[] = [
  { kind: "list", variant: "takeaways", items: lecture05Meta.takeaways },
  {
    kind: "table",
    headers: ["Quantity", "Formula", "Where it shows up"],
    rows: [
      ["Pairs to compare", "N(N−1)/2 ≈ 5 × 10¹¹ for N = 10⁶", "The reason for signatures"],
      ["Jaccard similarity", "|C₁ ∩ C₂| / |C₁ ∪ C₂| = a/(a+b+c)", "Set and column similarity"],
      ["Bag similarity", "Σ min counts / (|B| + |C|), at most 1/2", "Ratings as repeated elements"],
      ["Number of k-shingles", "at most n − k + 1", "Shingle sets are as large as documents"],
      ["Shingle space", "≈ 20ᵏ likely shingles", "Choosing k"],
      ["Minhash property", "P[h(C₁) = h(C₂)] = SIM(C₁, C₂)", "Why signatures preserve similarity"],
      ["Signature similarity", "fraction of agreeing minhashes", "Estimating Jaccard similarity"],
      ["Speed-up", "k/m less work using m of k rows", "Minhashing at scale"],
    ],
    caption: "Everything worth memorising from Part 2.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "The one sentence version",
    md: "Turn each document into its set of shingles, and each set into a short minhash signature whose agreement rate with another signature estimates their Jaccard similarity — small enough to fit in memory, but still one comparison per pair, which Part 3 fixes.",
  },
];

export const lecture05Blocks: SectionBlocks<typeof lecture05Outline> = {
  objectives,
  "entities-as-sets": entitiesAsSets,
  shingling,
  matrices,
  minhashing,
  "row-hashing": rowHashing,
  mistakes,
  quiz,
  summary,
};
