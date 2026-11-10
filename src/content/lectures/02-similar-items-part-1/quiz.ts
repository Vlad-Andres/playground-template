import type { QuizQuestion } from "@/content/types";

export const lecture02Quiz: QuizQuestion[] = [
  {
    id: "q-local-knowledge",
    prompt: "Which of these is a case of *local knowledge*, rather than a text variation, causing two descriptions of one entity?",
    options: [
      { id: "a", text: "“Trans. Knowl. Data Eng.” abbreviating a journal name." },
      { id: "b", text: "A typo turning “Smith” into “Smtih”." },
      { id: "c", text: "One source stores a person as a publication author, another as an email sender, each with its own format and identifiers." },
      { id: "d", text: "Writing “IBM” for “International Business Machines”." },
    ],
    answerId: "c",
    explanation:
      "Abbreviations, misspellings and acronyms are **text variations**. **Local knowledge** is the deeper cause: each source picks its own format, and there is no global coordination for identifier assignment.",
  },
  {
    id: "q-levels",
    prompt: "Co-author lists separate the different researchers called “Ling Chen” on DBLP. Which family of solutions is that?",
    options: [
      { id: "a", text: "Atomic similarity methods." },
      { id: "b", text: "Similarity methods for sets." },
      { id: "c", text: "Methods in uncertain data." },
      { id: "d", text: "Edit distance with gaps." },
    ],
    answerId: "b",
    explanation:
      "The name string is identical, so no atomic similarity can tell the authors apart. Comparing the **sets** of co-authors (and venues) of two publications can: papers sharing co-authors such as Sourav S. Bhowmick belong to the same Ling Chen.",
  },
  {
    id: "q-edit",
    prompt: "With insert, delete and update each costing 1, what is the edit distance between “ekaterini” and “katerina”?",
    options: [
      { id: "a", text: "1" },
      { id: "b", text: "2" },
      { id: "c", text: "3" },
      { id: "d", text: "9" },
    ],
    answerId: "b",
    explanation:
      "Delete the leading *e* and update the final *i* into *a*: two operations. (Drawn the other way round, it is an insert and an update.)",
  },
  {
    id: "q-jaro",
    prompt: "What is the Jaro similarity of DEIS and DESI?",
    options: [
      { id: "a", text: "0.75" },
      { id: "b", text: "0.8333" },
      { id: "c", text: "0.9167" },
      { id: "d", text: "1.0" },
    ],
    answerId: "c",
    explanation:
      "All $C = 4$ characters are common; *I* and *S* appear in swapped order, two mismatched positions, so $T = 2/2 = 1$. $Jaro = \\frac{1}{3}\\left(\\frac{4}{4} + \\frac{4}{4} + \\frac{4-1}{4}\\right) = \\frac{2.75}{3} \\approx 0.9167$.",
  },
  {
    id: "q-jaccard",
    prompt: "Encoded as bit vectors, C₁ = 10111 and C₂ = 10011. What is their Jaccard distance?",
    options: [
      { id: "a", text: "1/4" },
      { id: "b", text: "3/4" },
      { id: "c", text: "1/5" },
      { id: "d", text: "3/5" },
    ],
    answerId: "a",
    explanation:
      "Intersection (bitwise AND) has 3 ones, union (bitwise OR) has 4, so the Jaccard similarity is $3/4$ and the distance is $1 - 3/4 = 1/4$.",
  },
  {
    id: "q-axioms",
    prompt: "Which of these is NOT one of the four axioms of a distance measure?",
    options: [
      { id: "a", text: "d(x, y) ≥ 0" },
      { id: "b", text: "d(x, y) = d(y, x)" },
      { id: "c", text: "d(x, y) ≤ 1" },
      { id: "d", text: "d(x, y) ≤ d(x, z) + d(z, y)" },
    ],
    answerId: "c",
    explanation:
      "The axioms are non-negativity, $d(x,y) = 0$ exactly when $x = y$, symmetry, and the triangle inequality. Nothing bounds a distance by 1 — Euclidean and edit distances grow without limit.",
  },
  {
    id: "q-norms",
    prompt: "For a = (5, 5) and b = (9, 8), what are the L₂, L₁ and L∞ distances?",
    options: [
      { id: "a", text: "5, 7 and 4" },
      { id: "b", text: "7, 5 and 3" },
      { id: "c", text: "5, 7 and 7" },
      { id: "d", text: "25, 7 and 4" },
    ],
    answerId: "a",
    explanation:
      "The differences are 4 and 3. $L_2 = \\sqrt{4^2 + 3^2} = 5$, $L_1 = 4 + 3 = 7$ (the Manhattan route along the axes), and $L_\\infty = \\max(4, 3) = 4$.",
  },
  {
    id: "q-cosine",
    prompt: "What is the cosine distance between [1, 2, −1] and [2, 1, 1]?",
    options: [
      { id: "a", text: "30°" },
      { id: "b", text: "45°" },
      { id: "c", text: "60°" },
      { id: "d", text: "90°" },
    ],
    answerId: "c",
    explanation:
      "The dot product is $2 + 2 - 1 = 3$ and both vectors have length $\\sqrt{6}$, so $\\cos\\theta = 3/6 = 1/2$ and $\\theta = 60°$.",
  },
  {
    id: "q-choice",
    prompt: "You want to compare customers by the sets of products they bought. Which distance fits best?",
    options: [
      { id: "a", text: "Jaccard distance." },
      { id: "b", text: "Edit distance." },
      { id: "c", text: "L₂ distance." },
      { id: "d", text: "Jaro similarity." },
    ],
    answerId: "a",
    explanation:
      "The data are sets, so Jaccard distance applies directly. Edit distance and Jaro are for strings; $L_2$ needs real-valued coordinates — there is no meaningful location of a set in a space.",
  },
  {
    id: "q-non-euclidean",
    prompt: "Why are sets and strings said to live in non-Euclidean spaces?",
    options: [
      { id: "a", text: "Because their distances violate the triangle inequality." },
      { id: "b", text: "Because there is no notion of the average of two points — distances depend on properties of the points, not on a location." },
      { id: "c", text: "Because they have infinitely many dimensions." },
      { id: "d", text: "Because their distances are always between 0 and 1." },
    ],
    answerId: "b",
    explanation:
      "A Euclidean space has real-valued dimensions and dense points, so you can average two points. There is no average of two sets or two strings; their distance measures are still proper distances, just not based on location.",
  },
  {
    id: "q-transitive",
    prompt: "Deduplication accepts every pair scoring at least 0.6. P1–P2 scores 0.9 and P2–P5 scores 0.6, but P1–P5 was never compared. Where does P5 end up?",
    options: [
      { id: "a", text: "In its own cluster, since it was not compared with P1." },
      { id: "b", text: "In the same cluster as P1 and P2, because clustering closes matches transitively." },
      { id: "c", text: "It is deleted as a duplicate of P2." },
      { id: "d", text: "It depends on the merge rule." },
    ],
    answerId: "b",
    explanation:
      "Clustering connects records through chains of accepted pairs, so P1, P2 and P5 form one cluster and are merged into one unified record. That is why the clusters a threshold produces need checking, not just the pairs.",
  },
  {
    id: "q-quadratic",
    prompt: "You must deduplicate one million records. Why is scoring every pair with a good similarity function not an option?",
    options: [
      { id: "a", text: "The similarity function itself is too inaccurate at that scale." },
      { id: "b", text: "There are about 5 × 10¹¹ pairs, which takes days even at a million comparisons per second." },
      { id: "c", text: "One million records cannot fit in main memory." },
      { id: "d", text: "Jaccard similarity is undefined for more than 1000 sets." },
    ],
    answerId: "b",
    explanation:
      "$N(N-1)/2 \\approx 5 \\times 10^{11}$ pairs. At $10^6$ comparisons per second and $10^5$ seconds per day that is about five days — and ten million records take more than a year. That cost is the *problem for the next lecture*.",
  },
];
