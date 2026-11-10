import type { LectureMeta, SectionOutline } from "@/content/types";

export const lecture12Outline = [
  { id: "objectives", title: "Learning objectives", kind: "objectives" },
  { id: "what", title: "What a vector database is", kind: "intuition" },
  { id: "embeddings", title: "How they work: embeddings and nearest neighbours", kind: "concepts" },
  { id: "applications", title: "Applications", kind: "intuition" },
  { id: "challenges", title: "Why traditional databases struggle", kind: "concepts" },
  { id: "queries", title: "Query processing: scores, query types, variants", kind: "concepts" },
  { id: "playground", title: "Vector search playground", kind: "playground" },
  { id: "indexing", title: "Indexing: table, tree and graph", kind: "concepts" },
  { id: "systems", title: "Features and existing systems", kind: "concepts" },
  { id: "mistakes", title: "Common mistakes", kind: "mistakes" },
  { id: "quiz", title: "Check your understanding", kind: "quiz" },
  { id: "summary", title: "Cheat sheet", kind: "summary" },
] as const satisfies readonly SectionOutline[];

export const lecture12Meta: LectureMeta = {
  slug: "vector-databases",
  number: 12,
  title: "Vector Databases",
  subtitle: "Storing embeddings and finding what is similar: similarity scores, k-NN and ANN queries, vector indexes and systems",
  summary:
    "A vector database stores multidimensional points instead of scalar values and retrieves them by proximity — semantic similarity rather than exact match. This lecture covers what vector databases are, how embeddings turn images, text and audio into vectors, the applications they serve, why they differ from relational and NoSQL systems, the queries they answer (k-NN, ANN, (c, k)-search, range, hybrid and multi-vector), how they index vectors (table-, tree- and graph-based), and the systems that exist today.",
  topics: ["Embeddings", "Similarity score", "k-NN", "ANN", "(c, k)-search", "Hybrid query", "LSH", "Quantization", "HNSW", "Milvus", "pgvector"],
  difficulty: "core",
  estimatedMinutes: 60,
  sources: [
    { label: "NoSQL: Vector Databases", kind: "slides", detail: "Yannis Velegrakis — the guide to which concepts you need to know" },
    { label: "Vector Database Management Techniques and Systems", kind: "chapter", detail: "Pan, Wang, Li — SIGMOD 2024 tutorial: query processing, indexing, systems" },
    { label: "Survey of Vector Database Management Systems", kind: "chapter", detail: "Pan, Wang, Li — VLDB Journal 2024: definitions of the query types and scores" },
    { label: "The 7 Best Vector Databases in 2025", kind: "notes", detail: "DataCamp (Moez Ali) — embeddings, applications, features and popular systems" },
  ],
  objectives: [
    "Explain what a vector database stores and how it differs from relational, document and graph databases.",
    "Describe embeddings: how images, text and audio become vectors whose distance reflects similarity.",
    "Name the main applications of vector databases.",
    "Explain the five challenges that make vector data hard for traditional databases.",
    "Distinguish basic, aggregate (combined) and learned similarity scores, and explain score selection.",
    "Define k-NN, ANN, (c, k)-search and range queries, and the hybrid, multi-vector and batched variants.",
    "Classify vector indexes as table-based (LSH, learning to hash, quantization), tree-based or graph-based (KNN graphs, navigable small-world graphs).",
    "List the features of a good vector database and classify existing systems (Chroma, Pinecone, Milvus, Weaviate, Qdrant, Faiss, pgvector, Cassandra).",
  ],
  takeaways: [
    "A vector database stores multidimensional points (a few to several thousand dimensions) and retrieves them by proximity: semantic relevance, not exact match.",
    "Embeddings, computed by a neural network, turn images, text and audio into vectors that summarise their main points; similar items get nearby vectors.",
    "Applications: retail recommendation, financial analysis, healthcare, NLP and LLM retrieval, media analysis, anomaly detection.",
    "Challenges: similarity is vague and expensive, vectors are large (may span pages), have no sortable properties to index, and must co-exist with other data.",
    "Scores are basic (cosine, inner product, Euclidean, Hamming…), combined (mean or weighted sum of several) or learned (metric learning); picking the right one is score selection.",
    "(c, k)-search returns k vectors no more than c times worse than the best: c = 1 is exact k-NN, c > 1 is ANN. Range queries use a threshold instead of k.",
    "Hybrid queries add attribute predicates (pre-filter, post-filter or filter during the search); multi-vector queries combine several vectors per entity with an aggregate score.",
    "Indexes: table-based (LSH, learning to hash, quantization), tree-based (recursive partitioning, ANNOY) and graph-based (KNN graphs, navigable small-world graphs such as HNSW).",
  ],
  outline: lecture12Outline,
};
