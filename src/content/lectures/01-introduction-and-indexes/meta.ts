import type { LectureMeta, SectionOutline } from "@/content/types";

export const lecture01Outline = [
  { id: "objectives", title: "Learning objectives", kind: "objectives" },
  { id: "course", title: "The course at a glance", kind: "intuition" },
  { id: "big-data", title: "Where big data comes from", kind: "intuition" },
  { id: "data-science", title: "Data science, AI and data-intensive systems", kind: "concepts" },
  { id: "background", title: "Data models, database types and ACID", kind: "concepts" },
  { id: "tf-idf", title: "Words that matter: TF.IDF", kind: "concepts" },
  { id: "hash-functions", title: "Hash functions", kind: "playground" },
  { id: "why-indexes", title: "Disks, blocks and why indexes exist", kind: "intuition" },
  { id: "hash-indexes", title: "Hash indexes: static, extendible, linear", kind: "playground" },
  { id: "b-plus-trees", title: "B+ tree indexes", kind: "playground" },
  { id: "hash-vs-tree", title: "Hash index or B+ tree?", kind: "concepts" },
  { id: "mistakes", title: "Common mistakes", kind: "mistakes" },
  { id: "quiz", title: "Check your understanding", kind: "quiz" },
  { id: "summary", title: "Cheat sheet", kind: "summary" },
] as const satisfies readonly SectionOutline[];

export type Lecture01SectionId = (typeof lecture01Outline)[number]["id"];

export const lecture01Meta: LectureMeta = {
  slug: "introduction-and-indexes",
  number: 1,
  title: "Course Introduction & Indexes",
  subtitle: "What the course covers, where big data comes from, and the hash and B+ tree indexes everything else builds on",
  summary:
    "The first lecture sets the scene — goals, assessment, literature and the plan — and explains why data-intensive systems sit in the middle of data science, machine learning and AI. It then refreshes the background the rest of the course assumes: TF.IDF, hash functions, disk-based cost, and the two index structures every database relies on, hash indexes and B+ trees.",
  topics: [
    "Course organisation",
    "Big data",
    "Data science and AI",
    "Data models and ACID",
    "TF.IDF",
    "Hash functions",
    "Clustered indexes",
    "Static hashing",
    "Extendible hashing",
    "Linear hashing",
    "B+ trees",
  ],
  difficulty: "intro",
  estimatedMinutes: 100,
  sources: [
    { label: "Lecture 1 — Introduction", kind: "slides", detail: "Yannis Velegrakis, Utrecht University" },
    { label: "Hash Function and B+ Tree slides", kind: "slides", detail: "Extendible hashing, B+ tree indexes, clustered indexes" },
    {
      label: "Database Management Systems, Ch. 10–11",
      kind: "chapter",
      detail: "Ramakrishnan & Gehrke — Tree-Structured and Hash-Based Indexing",
    },
    {
      label: "Mining of Massive Datasets, §1.3–1.3.4",
      kind: "chapter",
      detail: "TF.IDF, hash functions, indexes and secondary storage",
    },
  ],
  objectives: [
    "Describe how the course is organised and assessed, and what it does and does not aim to teach.",
    "Explain where big data comes from and why data-intensive systems sit underneath data science, machine learning and AI.",
    "Name the three components of a data model, the main families of databases, and the four ACID properties.",
    "Compute TF.IDF scores and use them to say which words characterise a document.",
    "Pick a hash function and a number of buckets that spread a population of keys evenly.",
    "Explain what an index, a data entry and a clustered index are, and why the cost of an index is counted in disk pages.",
    "Trace inserts into static, extendible and linear hash indexes, including bucket splits and directory doubling.",
    "Search, insert into and delete from a B+ tree of order d, telling a copied-up key from a pushed-up one.",
    "Decide between a hash index and a B+ tree for a workload, and name what the B+ tree brings.",
  ],
  takeaways: [
    "Assessment is a final test (40%, multiple choice or short answers) and a project (60%, 10 points of which come from the presentation).",
    "Data arrives in three waves — employees, internet users, machines — and data-intensive systems are the infrastructure in the middle of big data, machine learning and AI.",
    "A data model has structures, constraints and operations; ACID stands for atomic, consistent, isolated and durable.",
    "TF.IDF = (f_ij / max_k f_kj) · log₂(N / n_i): a word scores high when it is frequent in this document and rare in the collection.",
    "A hash function should spread a reasonable population of keys evenly over B buckets; a prime B avoids factors shared with the keys.",
    "A disk block costs about 10 ms to read, some 10⁵ times slower than memory, so index cost is counted in page I/Os.",
    "Hash indexes answer equality selections in about one I/O but cannot do ranges; extendible hashing doubles a directory, linear hashing splits buckets round-robin.",
    "A B+ tree stays balanced and at least half full; leaf splits copy the separator up, index splits push it up, and the chained leaves make range scans cheap.",
  ],
  outline: lecture01Outline,
};
