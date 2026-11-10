import type { LectureMeta, SectionOutline } from "@/content/types";

export const lecture03Outline = [
  { id: "objectives", title: "Learning objectives", kind: "objectives" },
  { id: "prerequisites", title: "Refresher: ER model and relational algebra", kind: "concepts" },
  { id: "why-clusters", title: "Why a cluster at all", kind: "intuition" },
  { id: "fragmentation", title: "Horizontal and vertical fragmentation", kind: "concepts" },
  { id: "reconstruction", title: "Correctness and reconstruction", kind: "visual" },
  { id: "derived", title: "Derived fragmentation", kind: "examples" },
  { id: "sharding", title: "Sharding, allocation and transparency", kind: "concepts" },
  { id: "optimization", title: "Query translation and optimization", kind: "examples" },
  { id: "replication", title: "Replication and quorum consensus", kind: "playground" },
  { id: "two-phase-commit", title: "Two-phase commit", kind: "playground" },
  { id: "joins", title: "Joins across shards", kind: "playground" },
  { id: "systems", title: "Greenplum and MemSQL", kind: "visual" },
  { id: "consistency", title: "CAP, PACELC and consistency", kind: "concepts" },
  { id: "mistakes", title: "Common mistakes", kind: "mistakes" },
  { id: "quiz", title: "Check your understanding", kind: "quiz" },
  { id: "summary", title: "Cheat sheet", kind: "summary" },
  { id: "exercises", title: "Exercise sheet 01", kind: "exercises" },
] as const satisfies readonly SectionOutline[];

export type Lecture03SectionId = (typeof lecture03Outline)[number]["id"];

export const lecture03Meta: LectureMeta = {
  slug: "distributed-databases",
  number: 3,
  title: "Distributed Databases",
  subtitle: "Fragmentation, sharding, replication and distributed transactions",
  summary:
    "One machine runs out of space, speed and redundancy, so the data has to be spread across a cluster — without the user noticing. This lecture covers how a relation is cut into fragments and put back together, how shards and replicas are placed, how a quorum and two-phase commit keep the result correct, and how joins are computed when the rows live on different machines.",
  topics: [
    "Horizontal fragmentation",
    "Vertical fragmentation",
    "Sharding",
    "Data transparency",
    "Query optimization",
    "Replication",
    "Quorum consensus",
    "Two-phase commit",
    "Semi-join and Bloom filters",
    "Greenplum",
    "MemSQL",
    "CAP and PACELC",
  ],
  difficulty: "core",
  estimatedMinutes: 90,
  sources: [
    { label: "Distributed Databases", kind: "slides", detail: "Prof. Dr. Maximilian E. Schüle, Universität Bamberg" },
    {
      label: "Database Management Systems, Ch. 2 and 4",
      kind: "chapter",
      detail: "Ramakrishnan & Gehrke — ER model and relational algebra (prerequisite refresher)",
    },
    {
      label: "Greenplum administrator guide",
      kind: "notes",
      detail: "DDL for distribution and partitioning",
    },
    {
      label: "MemSQL distributed SQL",
      kind: "notes",
      detail: "Shard keys and reference tables",
    },
  ],
  objectives: [
    "Fragment a relation horizontally and vertically, and say which operator reconstructs it.",
    "Check a fragmentation for completeness, reconstructability and disjointness.",
    "Explain why derived fragmentation turns a complete join graph into node-local joins.",
    "Distinguish fragmentation, replication and location transparency, and rewrite a query plan over fragments.",
    "Pick read and write quorums that satisfy Qr + Qw > W and 2·Qw > W, and say what they guarantee.",
    "Trace two-phase commit through its states and name exactly when an agent blocks.",
    "Choose between co-located, distributed and broadcast joins, and reduce transfer with a semi-join or a Bloom filter.",
    "Describe what Greenplum and MemSQL do, and write a Greenplum distribution and partitioning clause.",
  ],
  takeaways: [
    "Horizontal fragmentation splits tuples (selection, reconstructed by union); vertical fragmentation splits attributes (projection, reconstructed by join on a common key).",
    "A fragmentation must be complete and reconstructable; disjointness is optional and is given up on purpose when replication is added.",
    "Derived fragmentation aligns a second relation with the first via a semi-join, so a complete join graph collapses into independent local joins.",
    "Transparency comes in three flavours — fragmentation, replication and location — and the optimizer needs the first to push selections and projections into fragments.",
    "Quorum consensus with Qr + Qw > W and 2·Qw > W guarantees every read overlaps the latest write; relaxing it gives eventual consistency.",
    "2PC makes a distributed transaction atomic but blocks: an agent in Prepared has surrendered its vote and waits for a coordinator that may be down.",
    "Semi-joins ship only join-column values; a Bloom filter ships bits instead, trading false drops for a much smaller message.",
    "Greenplum DISTRIBUTED BY shards across segments while PARTITION BY splits within a segment; MemSQL shards by primary key and replicates reference tables for broadcast joins.",
  ],
  outline: lecture03Outline,
};
