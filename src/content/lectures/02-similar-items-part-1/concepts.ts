import type { Concept } from "@/content/types";

export const lecture02Concepts: Concept[] = [
  {
    id: "entity-resolution",
    term: "Entity resolution",
    short: "Deciding whether two data structures describe the same real-world entity.",
    detail:
      "The methodology has three parts: identify the data that describes the same object, decide how to merge it, and update the data collection. It travels under many names — record linkage, deduplication, entity matching, merge/purge, reference reconciliation, object identification, duplicate detection.",
    tags: ["definition"],
  },
  {
    id: "why-hard",
    term: "Why descriptions diverge",
    short: "Text variations plus local knowledge produce many names for one entity.",
    detail:
      "Text variations cover misspellings, acronyms, transformations and abbreviations. Local knowledge is the deeper cause: every source picks its own format (a person as the author of a publication is not described like a person in an email), and nobody coordinates identifier assignment globally.",
    tags: ["motivation"],
  },
  {
    id: "er-levels",
    term: "Four families of solutions",
    short: "Atomic similarity, similarity for sets, inner relationships, and methods for uncertain data.",
    detail:
      "They correspond to the level at which two descriptions are compared: single values such as names, sets of values such as co-authors, the relationships connecting a record to others, and data whose values are themselves uncertain.",
    tags: ["definition"],
  },
  {
    id: "edit-distance",
    term: "Edit distance",
    short: "The cheapest sequence of character edits that turns one string into another.",
    detail:
      "In the Levenshtein formulation, delete, insert and update each cost 1 — turning *ekaterini* into *katerina* costs 2. The book uses an insert/delete-only variant, where $d(x,y) = |x| + |y| - 2 \\cdot |LCS(x,y)|$. Both are proper distance measures.",
    tags: ["atomic similarity", "distance"],
  },
  {
    id: "gap-distance",
    term: "Gap distance",
    short: "Edit distance plus cheap 'open gap' and 'extend gap' operations.",
    detail:
      "Plain edit distance punishes abbreviations badly: turning 'knowledge and data' into 'knowl. data' costs one edit per deleted character. Charging once to open a gap and a small amount $e$ per extension makes that cost $1 + o + 8e$.",
    tags: ["atomic similarity"],
  },
  {
    id: "jaro",
    term: "Jaro and Jaro-Winkler similarity",
    short: "A similarity tuned for short strings such as first and last names.",
    detail:
      "With $C$ common characters and $T$ transpositions (half the number of mismatched common characters), $Jaro(s_1,s_2) = \\frac{1}{3}\\left(\\frac{C}{|s_1|} + \\frac{C}{|s_2|} + \\frac{C-T}{C}\\right)$. Jaro-Winkler adds extra weight for a matching prefix, which suits personal names.",
    tags: ["atomic similarity"],
  },
  {
    id: "jaccard",
    term: "Jaccard similarity and distance",
    short: "Intersection over union; distance is one minus the similarity.",
    detail:
      "$SIM(C_1,C_2) = \\frac{|C_1 \\cap C_2|}{|C_1 \\cup C_2|}$ and $d(C_1,C_2) = 1 - SIM(C_1,C_2)$. It compares sets of values — the co-authors of two publications, the words or shingles of two documents, the products two customers bought.",
    tags: ["sets", "distance"],
  },
  {
    id: "distance-measure",
    term: "Distance measure axioms",
    short: "Non-negative, zero exactly for identical points, symmetric, and obeys the triangle inequality.",
    detail:
      "$d(x,y) \\ge 0$; $d(x,y) = 0$ iff $x = y$; $d(x,y) = d(y,x)$; $d(x,y) \\le d(x,z) + d(z,y)$. Jaccard, edit, Hamming, cosine and all Lᵣ distances qualify.",
    tags: ["distance", "theory"],
  },
  {
    id: "euclidean-norms",
    term: "Euclidean distances (Lᵣ norms)",
    short: "In a space of real-valued dimensions: L₂ (straight line), L₁ (Manhattan), L∞ (largest difference).",
    detail:
      "$L_r(x,y) = \\left(\\sum_i |x_i - y_i|^r\\right)^{1/r}$. $L_2$ is the most common notion of distance, $L_1$ is the distance travelled along the coordinates, and $L_\\infty$ — the limit as $r \\to \\infty$ — is the maximum difference in any dimension. For $a = (5,5)$ and $b = (9,8)$: $L_2 = 5$, $L_1 = 7$, $L_\\infty = 4$.",
    tags: ["distance"],
  },
  {
    id: "non-euclidean",
    term: "Non-Euclidean distances",
    short: "Jaccard for sets, cosine for vectors, edit for strings, Hamming for bit vectors.",
    detail:
      "They depend on properties of the points rather than their location in a space — there is no meaningful *average* of two sets or two strings. Cosine distance is the angle $\\arccos\\frac{x \\cdot y}{\\|x\\|\\|y\\|}$, between 0° and 180°; Hamming distance counts the positions in which two vectors differ.",
    tags: ["distance"],
  },
  {
    id: "clustering-merge",
    term: "Entity linkage and deduplication",
    short: "Compute pairwise similarity, cluster similar records, merge each cluster into one unified record.",
    detail:
      "Clustering closes matches transitively, so a threshold that looks safe pair by pair can still chain different entities together. The merge rule decides per field which value survives — majority, most recent, or an aggregate.",
    tags: ["practice"],
  },
];
