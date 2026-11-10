import type { QuizQuestion } from "@/content/types";

export const lecture03Quiz: QuizQuestion[] = [
  {
    id: "q-operators",
    prompt:
      "Which pair of operators fragments and then reconstructs a relation, for horizontal and vertical fragmentation respectively?",
    options: [
      { id: "a", text: "Selection / union, and projection / join." },
      { id: "b", text: "Projection / join, and selection / union." },
      { id: "c", text: "Selection / join, and projection / union." },
      { id: "d", text: "Union / selection in both cases." },
    ],
    answerId: "a",
    explanation:
      "Horizontal fragmentation picks tuples, so it fragments with **selection** ($\\sigma$) and reconstructs with **union** ($\\cup$). Vertical fragmentation picks attributes, so it fragments with **projection** ($\\pi$) and reconstructs with a **join** ($\\bowtie$) on the shared key.",
  },
  {
    id: "q-vertical-key",
    prompt: "What must every fragment of a vertical fragmentation contain, and why?",
    options: [
      { id: "a", text: "Every attribute of the primary key of at least one other fragment, to allow foreign-key checks." },
      { id: "b", text: "A common candidate key or superkey, so the join back is lossless." },
      { id: "c", text: "At least half the attributes, so no fragment becomes too narrow." },
      { id: "d", text: "Nothing in particular — any split of the schema can be reconstructed." },
    ],
    answerId: "b",
    explanation:
      "Without a shared candidate key the join cannot line the pieces back up, and an arbitrary vertical split is **not** reconstructable. Either repeat the primary key in every fragment — which sacrifices disjointness — or add a **tuple-id**, an artificial surrogate stored in each vertical fragment.",
  },
  {
    id: "q-predicates",
    prompt:
      "You fragment a relation using three decomposition predicates p₁, p₂ and p₃. How many fragments does building every combination give, and why would you do it that way?",
    options: [
      { id: "a", text: "3 fragments, one per predicate; it is the smallest complete set." },
      { id: "b", text: "6 fragments; every predicate contributes a positive and a negative fragment." },
      { id: "c", text: "2³ = 8 fragments; completeness and disjointness hold by construction." },
      { id: "d", text: "9 fragments, because the predicates must be paired with each other." },
    ],
    answerId: "c",
    explanation:
      "$n$ predicates give $2^n$ fragments, one for every combination of each predicate and its negation. Because the combinations cover everything and overlap nowhere, completeness and disjointness are automatic. Mutually exclusive predicates then collapse most of them to the empty set — three faculty predicates leave only four non-empty fragments, the last being the professors in none of those faculties.",
  },
  {
    id: "q-disjointness",
    prompt: "Which correctness property of a fragmentation is optional, and when is it deliberately given up?",
    options: [
      { id: "a", text: "Completeness, given up when some tuples are archived elsewhere." },
      { id: "b", text: "Reconstructability, given up when queries only ever read one fragment." },
      { id: "c", text: "Disjointness, given up when fragmentation is combined with replication." },
      { id: "d", text: "None of them — all three are mandatory." },
    ],
    answerId: "c",
    explanation:
      "Completeness (every tuple appears somewhere) and reconstructability (r can be recomputed) are required, or the fragmentation loses data. **Disjointness** is optional and is abandoned on purpose whenever fragments are replicated — and also whenever the primary key is repeated across vertical fragments.",
  },
  {
    id: "q-derived",
    prompt:
      "Professors are fragmented by faculty and lectures are fragmented by hours per week. Why is this bad, and what fixes it?",
    options: [
      { id: "a", text: "The join graph is complete — 3 × 3 joins, most of them empty. Derive the lecture fragmentation from the professor fragmentation with a semi-join." },
      { id: "b", text: "The fragmentation is not reconstructable. Add the tuple-id to both relations." },
      { id: "c", text: "The fragments are not disjoint. Use mutually exclusive predicates on hours per week." },
      { id: "d", text: "Nothing is wrong; the optimizer will rewrite the plan anyway." },
    ],
    answerId: "a",
    explanation:
      "Two unrelated fragmentations force every fragment of one to be joined against every fragment of the other — nine joins here, nearly all empty. **Derived fragmentation** builds the lecture fragments as semi-joins against the matching professor fragments, so the join graph falls apart into three independent, node-local joins.",
  },
  {
    id: "q-transparency",
    prompt: "Which kind of transparency does query translation onto fragments specifically require?",
    options: [
      { id: "a", text: "Replication transparency, so the optimizer can pick any copy." },
      { id: "b", text: "Fragmentation transparency, so the user's query names the relation rather than its fragments." },
      { id: "c", text: "Location transparency, so the optimizer can ignore where fragments live." },
      { id: "d", text: "Transaction transparency, so 2PC can be skipped." },
    ],
    answerId: "b",
    explanation:
      "The translator generates a plan **over the fragments** from a query written against the whole relation, which only makes sense if the user never had to name fragments — that is fragmentation transparency. The optimizer then uses knowledge of *where* those fragments sit to improve the plan.",
  },
  {
    id: "q-optimized-plan",
    prompt:
      "A query selects lecture titles where the professor's rank is C4. The naive plan unions all professor fragments, unions all lecture fragments, then joins. What does the optimized plan do?",
    options: [
      { id: "a", text: "It replaces the join with a semi-join and ships the result to the master." },
      { id: "b", text: "It reconstructs both relations first, but caches the unions for later queries." },
      { id: "c", text: "It pushes the selection and the join into each site, then unions the small per-site results." },
      { id: "d", text: "It broadcasts the professor relation to every lecture fragment." },
    ],
    answerId: "c",
    explanation:
      "Because the fragmentation is derived, each site already holds the professors *and* the lectures of one faculty. The optimizer pushes $\\sigma_{rang = C4}$ and the join below the union, so each node computes $\\pi_{titel}(\\sigma(\\text{Prof}) \\bowtie \\text{Vorls})$ locally and only the small results are unioned. The union moves from the bottom of the plan to the top.",
  },
  {
    id: "q-quorum",
    prompt:
      "Four sites carry weights 3, 1, 2 and 2, so W = 8. Which pair of quorums is valid for the quorum consensus protocol?",
    options: [
      { id: "a", text: "Qr = 4, Qw = 4" },
      { id: "b", text: "Qr = 4, Qw = 5" },
      { id: "c", text: "Qr = 5, Qw = 3" },
      { id: "d", text: "Qr = 2, Qw = 6, but only if site S1 is always included" },
    ],
    answerId: "b",
    explanation:
      "Both conditions must hold: $Q_r + Q_w > W$ and $2 Q_w > W$. For (4, 5): $9 > 8$ and $10 > 8$, so it is valid. (4, 4) fails the first ($8 \\not> 8$); (5, 3) fails both. The first condition makes every read overlap the latest write; the second stops two writes running concurrently.",
  },
  {
    id: "q-2pc-block",
    prompt: "In two-phase commit, exactly when is an agent blocked?",
    options: [
      { id: "a", text: "While waiting for PREPARE — it cannot start work until the coordinator speaks." },
      { id: "b", text: "After sending FAILED, until the coordinator confirms the abort." },
      { id: "c", text: "In state Prepared, if the coordinator crashes after collecting votes but before sending the decision." },
      { id: "d", text: "Never — 2PC is a non-blocking protocol." },
    ],
    answerId: "c",
    explanation:
      "Sending READY surrenders the agent's right to decide: in **Prepared** it may neither commit nor abort alone. If the coordinator dies between collecting the votes and broadcasting the decision, every prepared agent waits — holding its locks — until the coordinator recovers. This is why 2PC is called a *blocking* protocol and why 3PC, Paxos and Raft exist.",
  },
  {
    id: "q-join-choice",
    prompt: "Which join strategy requires no cross-shard communication at all, and what does it demand in return?",
    options: [
      { id: "a", text: "Broadcast join; it demands that one relation is small." },
      { id: "b", text: "Co-located join; it demands that both tables are sharded on the join column." },
      { id: "c", text: "Distributed join; it demands that both tables are re-partitioned first." },
      { id: "d", text: "Semi-join; it demands a Bloom filter on the join column." },
    ],
    answerId: "b",
    explanation:
      "If both tables are sharded on the join column, matching rows are already on the same machine, so each node joins locally and only the results go to the master. A **broadcast** join copies the smaller relation everywhere and a **distributed** join re-partitions both tables — both move data across the interconnect.",
  },
  {
    id: "q-bloom",
    prompt: "A Bloom filter is used to reduce the data shipped for a distributed join. What kind of error can it introduce?",
    options: [
      { id: "a", text: "False drops: some tuples without a join partner pass the filter and are shipped needlessly." },
      { id: "b", text: "False negatives: some matching tuples are filtered out, so the join result is incomplete." },
      { id: "c", text: "Both false positives and false negatives, which is why the join must be verified twice." },
      { id: "d", text: "None — a Bloom filter is exact, just smaller than the projection." },
    ],
    answerId: "a",
    explanation:
      "A Bloom filter never produces false negatives, so no genuine match is ever lost and **the join result stays exact**. Collisions only let extra tuples through — classically called *false drops* — and the real join at the other site discards them. The gain is the message size: a few bits instead of every join-column value.",
  },
  {
    id: "q-greenplum",
    prompt: "In Greenplum, what is the difference between DISTRIBUTED BY and PARTITION BY?",
    options: [
      { id: "a", text: "DISTRIBUTED BY chooses the replication factor; PARTITION BY chooses the shard key." },
      { id: "b", text: "DISTRIBUTED BY spreads rows across segment nodes; PARTITION BY splits the data within a segment." },
      { id: "c", text: "They are synonyms; PARTITION BY is the older spelling." },
      { id: "d", text: "DISTRIBUTED BY applies to the master node; PARTITION BY applies to mirror segments." },
    ],
    answerId: "b",
    explanation:
      "`DISTRIBUTED BY (col)` is the **sharding** decision — how rows are spread across segments, by hash or `DISTRIBUTED RANDOMLY` for round-robin. `PARTITION BY` is a local decision **inside** a segment, by list of values or by range, and can be subpartitioned. Master nodes hold the schemas; segment nodes hold the data.",
  },
];
