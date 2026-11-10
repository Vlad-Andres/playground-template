import type { Concept } from "@/content/types";

export const lecture07Concepts: Concept[] = [
  {
    id: "scalable",
    term: "Scalable",
    short: "Operationally: can make use of thousands of cheap computers. Formally: about N log N operations, and soon only one pass over the data.",
    detail:
      "In the past, scalable meant “works even if the data doesn't fit in main memory” and polynomial time. Indexes make needle-in-a-haystack queries O(log N), but tasks that must touch every record are fundamentally O(N); spreading them over k workers makes them O(N/k).",
    tags: ["motivation"],
  },
  {
    id: "map",
    term: "Map function",
    short: "map(in_key, in_value) → list(out_key, intermediate_value): processes one input element into key-value pairs.",
    detail: "Applied independently to every input element, so map tasks run in parallel on chunks of the input. Keys need not be unique — the same key may be emitted many times.",
    tags: ["model"],
  },
  {
    id: "shuffle",
    term: "Grouping by key (shuffle)",
    short: "The system collects all values with the same key and delivers them, as one list, to one reducer.",
    detail:
      "Keys are hashed into r buckets, one per reduce task; each map task writes one local file per reduce task. This is what lets a single reducer see every occurrence of a word, whatever document it came from.",
    tags: ["model"],
  },
  {
    id: "reduce",
    term: "Reduce function",
    short: "reduce(out_key, list(intermediate_value)) → list(out_value): combines all values for one key.",
    detail:
      "A *reducer* is one application of the reduce function to one key and its value list; a *reduce task* executes many reducers. Using fewer reduce tasks than keys, and more tasks than nodes, averages out skew between long and short value lists.",
    tags: ["model"],
  },
  {
    id: "combiner",
    term: "Combiner",
    short: "Applying the reduce function inside each map task before the shuffle.",
    detail:
      "Allowed when the reduce function is associative and commutative (e.g. a sum). Word count then sends (w, m) once per map task instead of m pairs (w, 1). The real reducers are still needed to combine the results of different map tasks.",
    tags: ["optimisation"],
  },
  {
    id: "master-workers",
    term: "Master and workers",
    short: "The master creates M map and R reduce tasks, assigns them to workers, and tracks their status.",
    detail:
      "Usually one map task per input chunk (split). Map workers write their output to local disk, partitioned into R regions; the master tells reduce workers where to read them. Reduce output goes to the distributed file system.",
    tags: ["execution"],
  },
  {
    id: "failures",
    term: "Coping with node failures",
    short: "Map worker fails: redo all its map tasks, even completed ones. Reduce worker fails: reschedule its running tasks. Master fails: restart the job.",
    detail:
      "Completed map tasks must be redone because their output lives on the failed node's local disk. The master detects failures by pinging workers periodically.",
    tags: ["execution"],
  },
  {
    id: "inverted-index",
    term: "Inverted index",
    short: "For every word, the list of documents containing it.",
    detail: "Map: for each word w of document d emit (w, d). Reduce: for each w, output (w, list of distinct documents). It is the core data structure of search engines.",
    tags: ["algorithms"],
  },
  {
    id: "mr-join",
    term: "Natural join in MapReduce",
    short: "Key every tuple by the join attribute, tag it with its relation, and pair R-values with S-values in the reducer.",
    detail:
      "For R(A, B) ⋈ S(B, C): map emits (b, (R, a)) and (b, (S, c)); the reducer for b outputs every (a, b, c). Lumping both relations into one dataset with relation tags is what lets one job see both. It is the classic parallel hash join.",
    tags: ["algorithms"],
  },
  {
    id: "mr-matmul",
    term: "Matrix multiplication in MapReduce",
    short: "Two jobs (join on j, then sum per (i, k)) or one job keyed by the output cell (i, k).",
    detail:
      "In one step, each $m_{ij}$ is sent to all keys $(i, k)$ and each $n_{jk}$ to all keys $(i, k)$; the reducer matches values with the same $j$, multiplies and sums. Two passes usually have lower communication cost.",
    tags: ["algorithms"],
  },
];
