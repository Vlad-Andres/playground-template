import type { LectureMeta, SectionOutline } from "@/content/types";

export const lecture10Outline = [
  { id: "objectives", title: "Learning objectives", kind: "objectives" },
  { id: "relational-value", title: "Why databases, and why relational", kind: "intuition" },
  { id: "impedance-mismatch", title: "Impedance mismatch", kind: "concepts" },
  { id: "integration", title: "Integration and application databases", kind: "concepts" },
  { id: "clusters", title: "Clusters and the birth of NoSQL", kind: "intuition" },
  { id: "aggregates", title: "Aggregates", kind: "concepts" },
  { id: "aggregate-models", title: "Key-value, document and column-family", kind: "examples" },
  { id: "more-models", title: "Relationships, graphs, schemas and views", kind: "concepts" },
  { id: "consistency", title: "Update and read consistency", kind: "concepts" },
  { id: "cap", title: "Relaxing consistency: CAP and BASE", kind: "concepts" },
  { id: "durability-quorums", title: "Relaxing durability and quorums", kind: "playground" },
  { id: "mistakes", title: "Common mistakes", kind: "mistakes" },
  { id: "quiz", title: "Check your understanding", kind: "quiz" },
  { id: "summary", title: "Cheat sheet", kind: "summary" },
] as const satisfies readonly SectionOutline[];

export const lecture10Meta: LectureMeta = {
  slug: "nosql",
  number: 10,
  title: "NoSQL and Scaling Up Data Storage",
  subtitle: "What lies beyond relational: aggregates, data models and consistency",
  summary:
    "Relational databases gave us persistence, concurrency, integration and a standard model, but they clash with in-memory data structures and with clusters. This lecture follows NoSQL Distilled: why NoSQL appeared, aggregate orientation and the key-value, document, column-family and graph models, schemalessness and materialized views, and how NoSQL systems think about consistency — write-write and read-write conflicts, eventual consistency, CAP, BASE, durability and quorums.",
  topics: ["Impedance mismatch", "Application databases", "Clusters", "Aggregates", "Key-value", "Document", "Column-family", "Graph", "Schemaless", "Consistency", "CAP", "Quorums"],
  difficulty: "core",
  estimatedMinutes: 80,
  sources: [
    { label: "NoSQL and the idea of scaling up data storage", kind: "slides", detail: "Yannis Velegrakis, with slides from Martin Fowler" },
    { label: "NoSQL Distilled", kind: "chapter", detail: "Sadalage & Fowler — exam material: Chapters 1, 2, 3 and 5" },
  ],
  objectives: [
    "List what relational databases offer and what a data model consists of.",
    "Explain the impedance mismatch and the difference between integration and application databases.",
    "Explain why clusters drove the rise of NoSQL and list the common characteristics of NoSQL databases.",
    "Define an aggregate, draw aggregate boundaries for an example, and explain the consequences of aggregate orientation.",
    "Compare the key-value, document, column-family and graph data models.",
    "Explain schemalessness and implicit schemas, materialized views, and modeling for data access.",
    "Distinguish write-write and read-write conflicts, logical and replication consistency, and read-your-writes consistency.",
    "Explain the CAP theorem, BASE, relaxed durability, and quorum rules W > N/2 and R + W > N.",
  ],
  takeaways: [
    "A data model has structures, constraints and operations; the relational model (Codd, 1970) stores everything as tables of flat rows.",
    "Impedance mismatch: rich in-memory structures must be split over many tables and reassembled.",
    "Integration databases are shared by many applications; application databases are owned by one, which integrates with others through services — and is free to choose a non-relational store.",
    "Relational databases are not designed for clusters; Google's Bigtable and Amazon's Dynamo inspired NoSQL: non-relational, cluster-friendly, open source, 21st-century web, schemaless.",
    "An aggregate is a unit of related data that we manipulate and keep consistent as a whole; it is the unit of distribution and of atomic updates.",
    "Key-value treats the aggregate as opaque; document databases see its structure; column-family stores split it into column families; graph databases are aggregate-ignorant and ACID.",
    "Schemaless databases still have an implicit schema in the code; materialized views precompute data organized differently from the aggregates.",
    "Under a network partition you trade consistency against availability — really consistency against latency; quorums with R + W > N give strongly consistent reads.",
  ],
  outline: lecture10Outline,
};
