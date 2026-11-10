import type { Concept } from "@/content/types";

export const lecture06Concepts: Concept[] = [
  {
    id: "lsh",
    term: "Locality-sensitive hashing",
    short: "Hash items many times so that similar items are far likelier to share a bucket.",
    detail:
      "Anything landing in the same bucket for at least one hashing becomes a candidate pair, and only candidates are scored. Dissimilar pairs that collide are false positives; similar pairs that never collide are false negatives.",
    tags: ["lsh"],
  },
  {
    id: "candidate-pair",
    term: "Candidate pair",
    short: "A pair of columns that hashed to the same bucket at least once — the only pairs whose similarity is evaluated.",
    detail:
      "Dissimilar pairs that become candidates are **false positives**, caught when the candidates are checked. Similar pairs that never become candidates are **false negatives**, lost for good — the price of not comparing all pairs.",
    tags: ["lsh"],
  },
  {
    id: "banding",
    term: "The banding technique",
    short: "Split the signature matrix into b bands of r rows and hash each band separately.",
    detail:
      "Each band gets its own bucket array, so identical band vectors in different bands never collide. Two columns become candidates if they agree in all $r$ rows of at least one band.",
    tags: ["lsh"],
  },
  {
    id: "s-curve",
    term: "The S-curve",
    short: "A pair of similarity s becomes a candidate with probability 1 − (1 − sʳ)ᵇ.",
    detail:
      "The threshold — where the probability reaches one half — is approximately $(1/b)^{1/r}$. With $b=20$ and $r=5$, a pair at $s = 0.8$ is missed only about once in 3000, while a pair at $s = 0.2$ is a candidate with probability 0.006.",
    tags: ["lsh", "analysis"],
  },
  {
    id: "lsh-family",
    term: "(d₁, d₂, p₁, p₂)-sensitive family",
    short: "The formal condition that makes a hash family locality-sensitive.",
    detail:
      "A family is $(d_1,d_2,p_1,p_2)$-sensitive if $d(x,y) \\le d_1$ implies $P[h(x)=h(y)] \\ge p_1$ and $d(x,y) \\ge d_2$ implies $P[h(x)=h(y)] \\le p_2$. For minhash and Jaccard distance, $P[h(x)=h(y)] = 1 - d(x,y)$.",
    tags: ["lsh", "theory"],
  },
  {
    id: "blocking",
    term: "Blocking",
    short: "Only compare records that already agree on some cheap key.",
    detail:
      "In the Company A / Company B case, records were sorted by name, then by address, then by phone, and only records sharing an exact value were scored. This is LSH with three hand-picked hash functions, and it misses pairs that agree exactly on nothing.",
    tags: ["lsh", "practice"],
  },
  {
    id: "match-validation",
    term: "Validating record matches",
    short: "Use a field outside the score to estimate what fraction of a score band is genuine.",
    detail:
      "Perfect 300-point pairs had an average delay of 10 days; random pairs averaged 45. For a score band with average delay $x$, the true-match fraction is $(45-x)/35$. Any field that differs on average between true and false pairs works the same way.",
    tags: ["practice"],
  },
  {
    id: "length-filtering",
    term: "Length-based filtering",
    short: "Sort sets by size; s and t can only reach similarity J if Lₜ ≤ Lₛ / J.",
    detail:
      "The intersection cannot exceed $L_s$ and the union is at least $L_t$, so $SIM(s,t) \\le L_s/L_t$. At $J = 0.9$, a set of size 9 need only be compared with sets of size 9 and 10.",
    tags: ["high similarity"],
  },
  {
    id: "prefix-indexing",
    term: "Prefix indexing",
    short: "Index each set under the first ⌊(1−J)·Lₛ⌋ + 1 elements of its sorted representation.",
    detail:
      "If $t$ shared none of those prefix symbols, the best it could do is be the suffix of $s$, giving similarity $(L_s - p)/L_s < J$. Ordering symbols rarest-first makes the prefix buckets small. Unlike LSH, this is exact — no false negatives.",
    tags: ["high similarity"],
  },
];
