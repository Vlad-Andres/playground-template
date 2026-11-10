import type { Concept } from "@/content/types";

export const lecture05Concepts: Concept[] = [
  {
    id: "set-similarity",
    term: "Finding similar sets",
    short: "Many data-mining problems reduce to finding sets with a large intersection relative to their union.",
    detail:
      "Entity resolution, pages with similar words (topic classification, plagiarism, repetition avoidance), customers with similar purchases or users with similar tastes in movies (recommendation), and the dual — movies with similar sets of fans. The similarity is textual or set-based, not similarity of meaning.",
    tags: ["applications"],
  },
  {
    id: "bag-similarity",
    term: "Jaccard similarity of bags",
    short: "Count an element min(times in B, times in C) in the intersection and the sum of its counts in the union.",
    detail:
      "Used when ratings become repeated elements (a movie rated n stars appears n times). With this definition the maximum is 1/2: {a, a, a, b} and {a, a, b, b, c} have intersection 3 and union 9, similarity 1/3.",
    tags: ["applications"],
  },
  {
    id: "shingling",
    term: "k-shingles",
    short: "The set of all length-k substrings (or word sequences, or any tokens) occurring in a document.",
    detail:
      "Shingling turns lexical similarity into set overlap and survives reordering: changing a word only affects shingles within distance $k$ of it, and moving a paragraph only changes the $2k$ shingles that cross its boundaries. Pick $k$ large enough that any given shingle is unlikely in any given document.",
    tags: ["sets"],
  },
  {
    id: "hashed-shingles",
    term: "Hashed shingles",
    short: "Represent a document by the set of hash values of its k-shingles.",
    detail:
      "Hashing 9-shingles down to 32 bits discriminates better than using 4-shingles directly, even though both cost four bytes: only about $20^4 = 160{,}000$ 4-shingles actually occur in English text, while hashed 9-shingles use the whole 32-bit range. Two documents can rarely appear to share a shingle when only the hash values collided.",
    tags: ["sets"],
  },
  {
    id: "word-shingles",
    term: "Shingles built from words",
    short: "A stop word followed by the next two words — tuned for finding the same news article on different pages.",
    detail:
      "News prose is full of stop words, ads and navigation are not. Shingles anchored on stop words therefore come mostly from the article, so pages with the same article and different surroundings score higher than pages with the same surroundings and a different article.",
    tags: ["sets"],
  },
  {
    id: "jaccard",
    term: "Jaccard similarity and the row types",
    short: "SIM(C₁, C₂) = |C₁ ∩ C₂| / |C₁ ∪ C₂| = a / (a + b + c).",
    detail:
      "Classify the rows of two columns as type a (1, 1), b (1, 0), c (0, 1) or d (0, 0). Intersection counts type a, union counts types a, b and c — type-d rows, the vast majority in a sparse matrix, never matter.",
    tags: ["sets"],
  },
  {
    id: "characteristic-matrix",
    term: "Boolean (characteristic) matrix",
    short: "Rows are elements of the universal set, columns are sets, a 1 means membership.",
    detail:
      "Encoding sets as 0/1 vectors turns intersection into bitwise AND and union into bitwise OR. The matrix is almost always extremely sparse, so it is a way of thinking rather than a storage format.",
    tags: ["sets"],
  },
  {
    id: "minhash",
    term: "Minhashing",
    short: "Permute the rows; the minhash of a column is the number of the first row in which it has a 1.",
    detail:
      "The surprising property is $P[h(C_1) = h(C_2)] = SIM(C_1, C_2)$: looking down the permuted columns until the first 1 appears, the hashes agree exactly when that row is type a, so the probability is $a/(a+b+c)$.",
    tags: ["signatures"],
  },
  {
    id: "signature-matrix",
    term: "Signature matrix",
    short: "One short column of minhash values per set, one row per minhash function.",
    detail:
      "The similarity of two signatures is the fraction of minhash functions (rows) in which they agree. Its expected value equals the Jaccard similarity of the underlying sets, and the longer the signatures, the smaller the expected error; 100 functions is typical.",
    tags: ["signatures"],
  },
  {
    id: "row-hashing",
    term: "Row hashing",
    short: "Simulate random permutations with hash functions in a single pass over the rows.",
    detail:
      "Permuting a billion rows even once is prohibitive, storing the permutation takes a billion entries, and reading rows in permuted order thrashes. Instead keep a slot per column and hash function initialised to ∞, scan the rows once, and lower the slot whenever a row with a 1 hashes below the current value.",
    tags: ["signatures", "implementation"],
  },
  {
    id: "minhash-speedup",
    term: "Minhashing on the first m rows",
    short: "Compute each minhash from only m of the k rows, accepting an occasional ∞.",
    detail:
      "Work drops by a factor k/m. A row where one column is ∞ and the other is not counts as a disagreement; a row where both are ∞ carries no information and is ignored. Splitting the rows into k/m groups yields k/m minhash values from one hash function and one pass, and balances out the estimation error.",
    tags: ["signatures", "implementation"],
  },
];
