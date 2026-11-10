import type { Concept } from "@/content/types";

export const lecture03Concepts: Concept[] = [
  {
    id: "why-cluster",
    term: "Limits of a single machine",
    short: "Space, performance, geo-locality and redundancy each cap what one node can do.",
    detail:
      "A single machine holds a few terabytes, delivers hundreds of GFLOPS, sits at one point on the globe with the speed of light between it and everyone else, and has no redundancy when it fails. Every one of those is a reason to use several machines.",
    tags: ["motivation"],
  },
  {
    id: "acid-base",
    term: "ACID versus BASE",
    short: "Strong guarantees cost synchronisation; weak ones push the problem into your application.",
    detail:
      "ACID is atomicity, consistency, isolation and durability. BASE is basically available, soft state and eventual consistency. BASE is faster because it synchronises less, but it gives no consistent view — unusable for banking, and a source of subtle bugs elsewhere. Before choosing BASE, be sure you need the performance, or you will end up reimplementing ACID in the application layer.",
    tags: ["foundations"],
  },
  {
    id: "replication",
    term: "Replication",
    short: "Several sites keep copies of the same data.",
    detail:
      "Replication buys faster retrieval, higher read throughput, tolerance of node failures and better locality. The price is keeping the copies in agreement on every write.",
    tags: ["placement"],
  },
  {
    id: "fragmentation",
    term: "Fragmentation",
    short: "A relation r is divided into fragments r₁ … rₙ that together carry enough information to rebuild r.",
    detail:
      "Fragmentation and replication combine freely: a relation is cut into fragments, and the system keeps several identical replicas of each fragment.",
    tags: ["placement"],
  },
  {
    id: "horizontal-fragmentation",
    term: "Horizontal fragmentation",
    short: "Each tuple of r is assigned to one or more fragments — a selection.",
    detail:
      "Fragments are built with selection predicates and put back together with union. This is the same operation as sharding: every machine holds a chunk of the rows.",
    tags: ["fragmentation"],
  },
  {
    id: "vertical-fragmentation",
    term: "Vertical fragmentation",
    short: "The schema of r is split into smaller schemas — a projection.",
    detail:
      "Every fragment schema must contain a common candidate key (or superkey) so the join back is lossless. Where no natural key is available, a tuple-id — an artificial surrogate added to each fragment — serves as one.",
    tags: ["fragmentation"],
  },
  {
    id: "fragmentation-correctness",
    term: "Correctness of a fragmentation",
    short: "Completeness and reconstructability are required; disjointness is optional.",
    detail:
      "**Completeness**: every tuple of r occurs in at least one fragment. **Reconstructability**: r can be recomputed from the fragments — union for horizontal, join for vertical. **Disjointness**: fragments do not overlap; this one is deliberately abandoned once fragmentation is combined with replication.",
    tags: ["fragmentation"],
  },
  {
    id: "decomposition-predicates",
    term: "Decomposition predicates",
    short: "n predicates yield 2ⁿ fragments, one per combination of the predicates and their negations.",
    detail:
      "Building all $2^n$ combinations guarantees completeness and disjointness by construction. Mutually exclusive predicates collapse most combinations to the empty set: three faculty predicates give $2^3 = 8$ combinations but only four non-empty fragments, the fourth being the tuples matching none of them.",
    tags: ["fragmentation"],
  },
  {
    id: "derived-fragmentation",
    term: "Derived horizontal fragmentation",
    short: "Fragment the second relation along the fragmentation of the first, using a semi-join.",
    detail:
      "Fragmenting two relations on unrelated attributes makes the join graph complete — every fragment of one must meet every fragment of the other, and most of those joins are empty. Deriving the second fragmentation from the first makes the graph fall apart into independent, node-local joins.",
    tags: ["fragmentation", "optimization"],
  },
  {
    id: "allocation",
    term: "Allocation",
    short: "Deciding which node stores which fragment.",
    detail:
      "Fragments are placed where they are used: the physics lectures and physics professors on the physics node, administration data on the administration node. More shards than machines gives better skew handling; MemSQL, for example, allocates eight shards per leaf node.",
    tags: ["placement"],
  },
  {
    id: "sharding",
    term: "Sharding",
    short: "Horizontal fragmentation across the machines of a cluster.",
    detail:
      "Each machine holds a chunk of the dataset. Query runtimes improve — especially when no cross-shard communication is needed — and the dataset may exceed the capacity of any single machine. Performance then depends heavily on the interconnect.",
    tags: ["placement"],
  },
  {
    id: "data-transparency",
    term: "Data transparency",
    short: "The degree to which a user can stay unaware of how and where data is stored.",
    detail:
      "Three kinds matter: **fragmentation transparency** (the user does not name fragments), **replication transparency** (the user does not choose a copy) and **location transparency** (the user does not name a site).",
    tags: ["transparency"],
  },
  {
    id: "query-translation",
    term: "Query translation and optimization",
    short: "Translate the query onto fragments, then optimize given where those fragments live.",
    detail:
      "It requires fragmentation transparency and takes two steps: reconstruct the relation from its fragments, then combine that with the algebraic query plan. The optimizer's job is to push selections and projections down into the fragments and to avoid reconstructing anything it does not need.",
    tags: ["optimization"],
  },
  {
    id: "rowa",
    term: "Read one, write all",
    short: "Read from any single replica; write to every replica.",
    detail:
      "Reads are as cheap as they can be, but a write must reach every copy, so it is expensive and fails whenever any replica is unavailable. In quorum terms it is $Q_w = W$ and $Q_r = 1$.",
    tags: ["replication"],
  },
  {
    id: "quorum-consensus",
    term: "Quorum consensus protocol",
    short: "Weight each site, then require reads and writes to lock enough weight to overlap.",
    detail:
      "Let $W$ be the total of all site weights and choose a read quorum $Q_r$ and a write quorum $Q_w$ with $Q_r + Q_w > W$ and $2 Q_w > W$. The first condition forces every read to intersect the latest write; the second stops two writes proceeding at once. Tuning $Q_r$ against $Q_w$ shifts the cost between reads and writes.",
    tags: ["replication"],
  },
  {
    id: "two-phase-commit",
    term: "Two-phase commit",
    short: "A coordinator collects votes, then broadcasts one decision to all agents.",
    detail:
      "2PC gives a distributed transaction atomicity: all n agents persist the changes or all discard them. Phase one is PREPARE and the READY or FAILED votes; phase two is the COMMIT or ABORT decision and the ACKs. The decisive action at every step is writing the log record *before* sending the message.",
    tags: ["transactions"],
  },
  {
    id: "2pc-blocking",
    term: "Why 2PC blocks",
    short: "A prepared agent has given up its right to decide and must wait for the coordinator.",
    detail:
      "In state Prepared an agent may neither commit nor abort on its own. If the coordinator crashes after collecting the votes but before sending the decision, every prepared agent is blocked and keeps its locks until the coordinator recovers. The coordinator is a single point of failure.",
    tags: ["transactions"],
  },
  {
    id: "2pc-variants",
    term: "Beyond basic 2PC",
    short: "Linear 2PC, presumed abort, 3PC and consensus protocols.",
    detail:
      "**Linear 2PC** chains the agents: $2(n-1)$ messages instead of $4n$, at higher latency. **Presumed abort** reads a missing log entry as abort, saving log writes and ACKs. **3PC** adds a pre-commit phase that removes the blocking at the cost of a round trip, and is rare in practice. **Paxos and Raft** replicate the coordinator itself, so its crash no longer blocks anyone.",
    tags: ["transactions"],
  },
  {
    id: "join-types",
    term: "Co-located, distributed and broadcast joins",
    short: "Three ways to get matching rows onto the same machine.",
    detail:
      "A **co-located** join needs both tables sharded on the join column, so every machine joins locally and the master only concatenates. A **distributed** join re-partitions both tables on the join column first. A **broadcast** join sends the smaller relation to every machine. The last two involve cross-shard communication.",
    tags: ["joins"],
  },
  {
    id: "semi-join",
    term: "Semi-join filter",
    short: "Ship only the join-column values, so only tuples with a partner travel back.",
    detail:
      "Send $\\pi_C(R)$ to the site holding $S$, compute $\\pi_C(R) \\bowtie S$ there, and send that back for the final join. Only tuples that actually have a join partner cross the network. The same filtering can be applied in both directions at once.",
    tags: ["joins"],
  },
  {
    id: "bloom-filter-join",
    term: "Bloom filter join",
    short: "Ship a bit vector instead of the join values — smaller, at the cost of false drops.",
    detail:
      "Hash every join value of $R$ into an $m$-bit vector with $k$ hash functions and send the bits. The remote site keeps a tuple when all of its bits are set. There are no false negatives, so no real match is ever lost; false positives — classically called **false drops** — simply ship a few extra tuples, which the final join discards anyway.",
    tags: ["joins"],
  },
  {
    id: "greenplum",
    term: "Greenplum",
    short: "A distributed, open-source database built on PostgreSQL.",
    detail:
      "Vanilla PostgreSQL supports read replicas but neither data distribution nor distributed queries. Greenplum adds both: a **master** node holding the schemas and **segment** nodes holding the data, plus a standby master and mirror segments. `DISTRIBUTED BY` shards across segments (hash or random round-robin); `PARTITION BY` splits data within a segment by list or range, with subpartitioning.",
    tags: ["systems"],
  },
  {
    id: "memsql",
    term: "MemSQL",
    short: "A MySQL-compatible distributed database of aggregator and leaf nodes.",
    detail:
      "**Aggregator** nodes hold metadata, distribute queries, aggregate results and handle monitoring and failover; **leaf** nodes store data and execute SQL. Tables are sharded by primary key unless a `SHARD KEY` is given, and reference tables are replicated to every machine so broadcast joins become local.",
    tags: ["systems"],
  },
  {
    id: "cap",
    term: "The CAP theorem",
    short: "Under a network partition you must choose between consistency and availability.",
    detail:
      "Conjectured by Brewer in 2000 and proven by Gilbert and Lynch in 2002. Partitions are not a design choice — they happen — so the real statement is: *if* the network partitions, choose. CP systems refuse requests on the minority side; AP systems accept writes everywhere and reconcile later. The choice is made per operation, not once for the whole system.",
    tags: ["consistency"],
  },
  {
    id: "pacelc",
    term: "PACELC",
    short: "If Partition, trade Availability against Consistency; Else trade Latency against Consistency.",
    detail:
      "Abadi's refinement makes the cost visible even when nothing is broken: every synchronous replica has to be waited for. Dynamo, Cassandra and Riak are PA/EL; MongoDB is PA/EC; HBase, Spanner and VoltDB are PC/EC.",
    tags: ["consistency"],
  },
  {
    id: "consistency-models",
    term: "Consistency models and session guarantees",
    short: "From linearisable to eventual, each level allows more reordering and more parallelism.",
    detail:
      "**Linearisable** reads see the latest committed write in real-time order; **sequential** fixes one order for everyone but not the real-time one; **causal** orders only dependent operations; **eventual** merely promises convergence once updates stop. Session guarantees make eventual consistency programmable: read your writes, monotonic reads, monotonic writes, and writes follow reads.",
    tags: ["consistency"],
  },
];
