import type { Block, SectionBlocks } from "@/content/types";
import { lecture12Meta, lecture12Outline } from "./meta";
import { VectorSearchLab } from "@/widgets/dis/VectorSearchLab";

const objectives: Block[] = [
  {
    kind: "prose",
    md: "The last NoSQL family of the course stores neither tuples, documents nor graphs but **vectors**. You are expected to know **what vector databases are, which queries they serve and which applications they have**; the slides list the concepts, and this page explains each one. Several building blocks come from earlier lectures and are only recalled here: distance measures (Lecture 2), locality-sensitive hashing (Lecture 6), k-means (Lecture 4), B+ trees (Lecture 1) and sharding and replication (Lecture 3).",
  },
  { kind: "list", variant: "objectives", items: lecture12Meta.objectives },
];

const what: Block[] = [
  {
    kind: "prose",
    md: "A **vector database** stores **multidimensional points** — vectors — instead of scalar values. The number of dimensions varies from a **few to several thousand**, depending on how detailed the data is. Its purpose is to **swiftly and precisely locate and retrieve vectors based on proximity or resemblance**: a search by **semantic relevance** rather than by exact match or fixed criteria.",
  },
  {
    kind: "table",
    headers: ["With a vector database you can…", "Similar by…"],
    rows: [
      ["Search for songs that resonate with a particular tune", "Melody and rhythm"],
      ["Find articles that align with another article", "Theme and perspective"],
      ["Identify gadgets that mirror a certain device", "Characteristics and reviews"],
    ],
  },
  {
    kind: "info",
    variant: "insight",
    title: "Exact match versus closest match",
    md: "A relational query asks *which rows have price = 20?* — every row either matches or not. A vector query asks *which items are most like this one?* — every item matches to some degree, and the answer is a **ranking**. That single change explains almost everything else on this page.",
  },
  { kind: "concepts", ids: ["vector-database"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What does a vector database store?", answer: "Multidimensional points (vectors), from a few to several thousand dimensions — not scalar values." },
      { prompt: "How does it retrieve data?", answer: "By proximity or resemblance to a query vector: semantic relevance instead of exact match." },
    ],
  },
];

const embeddings: Block[] = [
  {
    kind: "prose",
    md: "**How they work.** Traditional databases organise data as tables, nodes or documents and look for **exact** matches. Vector databases organise data as **vectors** and look for the **closest** match using a measure of similarity — typically with **Approximate Nearest Neighbour (ANN)** search, built on techniques such as hashing and graph-based search.\n\nWhere do the vectors come from? Unstructured data — **images, text, audio**, video — has no predefined format. An **embedding** turns each item into a vector, a numeric *code* that captures its meaning — like turning a book into a **short summary that still captures the main points**. Embeddings are computed by a **neural network** trained for the task (the slides mention a GNN); for words, it places words with similar meanings close together. Once items are vectors, *similar* means *nearby*.",
  },
  {
    kind: "steps",
    title: "From an item to an answer",
    steps: [
      { title: "Embed", md: "An embedding model maps each image, text or audio item to a vector (say 768 numbers)." },
      { title: "Store and index", md: "The vector is stored — usually with the item's id and attributes — and inserted into a **vector index**." },
      { title: "Embed the query", md: "The query (a photo, a sentence, a hummed tune) goes through the **same** model, giving a query vector q." },
      { title: "Search", md: "The database returns the vectors closest to q under a similarity score — exactly (k-NN) or approximately (ANN)." },
    ],
  },
  {
    kind: "prose",
    md: "The embedding model can live **inside or outside** the database. Under **direct manipulation** users insert, update and delete vectors themselves and are responsible for the model (pgvector). Under **indirect manipulation** users see a collection of **entities**, and the database runs the model — chosen from pre-trained models or supplied by the user (Pinecone). The slides call these *embedded in the DB* versus *as a plug-in*.",
  },
  { kind: "concepts", ids: ["embedding"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What is an embedding?", answer: "A vector computed by a neural network from an image, text or audio item, summarising its main points so that similar items are close." },
      { prompt: "Which search technique do vector databases typically use?", answer: "Approximate Nearest Neighbour (ANN) search, built on hashing, trees or graphs." },
      { prompt: "Direct versus indirect data manipulation?", answer: "Direct: users manipulate vectors and own the embedding model. Indirect: users manipulate entities and the database runs the model." },
    ],
  },
];

const applications: Block[] = [
  {
    kind: "table",
    headers: ["Application", "What similarity search does there"],
    rows: [
      ["Retail experience", "Recommendation systems: suggest products by similar attributes, behaviour and preferences, not only past purchases"],
      ["Financial data analysis", "Detect patterns and subtle similarities or deviations in market data to inform investment strategies"],
      ["Healthcare", "Compare genomic sequences for more personalised treatments"],
      ["NLP applications", "Chatbots and virtual assistants match questions to the closest text; retrieval for large language models (RAG)"],
      ["Media analysis", "Compare images by their essential features — medical scans, surveillance or traffic camera footage"],
      ["Anomaly detection", "Spot the vectors that are far from everything else — fraud, security breaches"],
    ],
    caption: "The six applications on the slides. The SIGMOD tutorial adds e-commerce, recommendation and document retrieval, often over billions of vectors at millisecond latency.",
  },
  {
    kind: "info",
    variant: "note",
    title: "Similar and dissimilar are both useful",
    md: "Five of the applications look for the **nearest** vectors. Anomaly detection turns it around: an item whose nearest neighbours are all far away is an outlier.",
  },
  {
    kind: "recall",
    cards: [
      { prompt: "Name the six application areas on the slides.", answer: "Retail experience, financial data analysis, healthcare, NLP applications, media analysis, anomaly detection." },
      { prompt: "How does a vector database help anomaly detection?", answer: "Outliers are vectors far from all others — their nearest neighbours are distant." },
    ],
  },
];

const challenges: Block[] = [
  {
    kind: "prose",
    md: "Vector databases are different from relational and other NoSQL databases. The slides list five challenges:",
  },
  {
    kind: "table",
    headers: ["Challenge", "Why it matters"],
    rows: [
      ["Similarity is **vague** compared to the exact match", "Different applications mean different things by *similar*, so the query must say how similarity is measured — and different scores give different answers"],
      ["Similarity is **more expensive** than exact match", "A comparison touches all D dimensions; brute force over N vectors costs O(DN) per query, against one key comparison for an equality predicate"],
      ["Vectors are **large** and may span many pages", "Retrieving a full vector costs more I/O than a simple attribute and strains memory"],
      ["Vectors have **no properties** (like tuples or nodes do)", "Nothing sortable or categorical to index on, so B+ trees and hash indexes on values do not apply"],
      ["Vectors and other data must **co-exist**", "Real queries mix similarity with attribute predicates (hybrid queries), and it is unclear how to do both efficiently"],
    ],
  },
  {
    kind: "info",
    variant: "insight",
    title: "Why not just put a B+ tree on the vectors?",
    md: "A B+ tree (Lecture 1) needs keys with a **total order**, and closeness in that order must mean closeness of the data. Sort vectors by their first dimension and two vectors that are equal in every other dimension may end up far apart. Vector indexes therefore **partition the space** instead — with randomisation, learned partitions or navigable graphs.",
  },
  {
    kind: "recall",
    cards: [
      { prompt: "List the five challenges of vector data.", answer: "Similarity is vague; similarity is expensive; vectors are large (span pages); vectors have no indexable properties; vectors must co-exist with other data." },
      { prompt: "What does a brute-force similarity search cost?", answer: "O(DN): every one of N vectors compared with the query over D dimensions." },
    ],
  },
];

const queries: Block[] = [
  {
    kind: "prose",
    md: "**Query processing** starts from a search specification: **which score** measures similarity, **which kind of query**, and through **which interface**.\n\n**Score design.** A similarity score f(a, b) maps two vectors to a number. The slides distinguish three kinds:\n\n- **Basic** scores come straight from the vector space: **inner product** a·b, **cosine** (the angle, ignoring length), **Minkowski** distances (Euclidean L₂, Manhattan L₁ — see Lecture 2), **Hamming** (number of differing dimensions) and **Mahalanobis**. For some, larger means more similar (inner product, cosine similarity); for distances, smaller does.\n- **Combined** (aggregate) scores merge several scores into one comparable number — the **mean** or a **weighted sum** — when a query or an entity has several vectors.\n- **Learned** scores are fitted to the data by **metric learning**.\n\n**Score selection** is choosing the best score for a task. Different scores give different rankings for the same collection, automatic selection is still hard, the query itself may need disambiguation first, and the **curse of dimensionality** makes some distance-based scores less useful in high dimensions.",
  },
  {
    kind: "formula",
    tex: "a \\cdot b = \\sum_{i=1}^{D} a_i b_i \\qquad \\cos(a,b) = \\frac{a \\cdot b}{\\lVert a \\rVert\\,\\lVert b \\rVert} \\qquad L_p(a,b) = \\Big(\\sum_{i=1}^{D} |a_i - b_i|^p\\Big)^{1/p}",
    caption: "Inner product, cosine similarity and Minkowski distance (p = 2 Euclidean, p = 1 Manhattan). Each costs O(D).",
  },
  {
    kind: "prose",
    md: "**Query types.** A database manipulation query inserts, updates or deletes vectors. A **search** query returns part of the collection:\n\n- **k-NN** — the k vectors nearest to the query vector q.\n- **ANN** — approximate nearest neighbours: k vectors that are *almost* the nearest, found much faster with an index.\n- **(c, k)-search** — the slides' general form: *find the k most similar vectors, none of which is more than c times worse than the best*. Formally, a k-size result S′ with d(x′, q) ≤ c · min d(x, q) for every x′ in S′.\n- **Range** — all vectors within a threshold r: { x | d(x, q) ≤ r }, when you want everything similar enough, not a fixed number.\n\nAnswer quality is measured with **precision and recall** against the exact answer. The basic operator is **similarity projection**: project every vector onto its score against q, then sort or keep a top-k priority queue.",
  },
  {
    kind: "formula",
    tex: "\\text{(c, k)-search: } |S'| = k,\\;\\; d(x', q) \\le c \\cdot \\min_{x \\in S} d(x, q) \\;\\;\\forall x' \\in S' \\qquad c = 1:\\ \\text{k-NN} \\qquad c > 1:\\ \\text{ANN}",
    caption: "Some texts (including the SIGMOD tutorial) measure the slack from 0 instead, writing c = 0 for the exact k-NN query — the idea is the same.",
  },
  {
    kind: "prose",
    md: "**Query variants.**\n\n- **Hybrid** (predicated, *filtered*) queries: each vector has structured attributes, and every result must also satisfy a boolean predicate — the k most similar items **with price < 100**. Common in e-commerce recommendation.\n- **Multi-vector** queries: the query, each entity, or both have **several vectors** — a face photographed from several angles — compared through an **aggregate score**.\n- **Batched** queries: many searches arrive at once and can share work, which suits GPUs.\n\nA hybrid query can be run in three ways: **pre-filtering** (apply the predicate first, then search what remains — a *block-first* scan), **post-filtering** (search first, then drop failing results — which can return **fewer than k**) or **single-stage** filtering (check the predicate while traversing the index — a *visit-first* scan). Systems either predefine one plan per query type or choose with rules (predicate selectivity) or a cost model.",
  },
  {
    kind: "code",
    lang: "sql",
    code: `-- hybrid k-NN in SQL: the 5 nearest items that also cost less than 100
SELECT * FROM items
WHERE price < 100
ORDER BY distance(embedding, :query_vector)
LIMIT 5;

-- the same idea in PostgreSQL with pgvector: <-> is Euclidean distance
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;   -- k-NN
SELECT * FROM items WHERE embedding <-> '[3,1,2]' < 5;          -- range`,
    caption: "Query interfaces: native systems mostly offer a small API (Chroma: add, query, update, upsert, delete…); systems built on relational databases extend SQL.",
    run: {
      note: "distance(embedding, :query_vector) is generic pseudo-SQL; the runnable version writes it with pgvector's <-> operator and the query vector [3,1,2].",
      hint: "change the query vector, the price limit, k (LIMIT) or the radius 5; try <=> (cosine distance) instead of <->",
      code: `-- hybrid k-NN: the 5 nearest items that also cost less than 100
SELECT name, price, embedding, embedding <-> '[3,1,2]' AS distance
FROM items
WHERE price < 100
ORDER BY embedding <-> '[3,1,2]'
LIMIT 5;

-- the same idea in PostgreSQL with pgvector: <-> is Euclidean distance
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;   -- k-NN
SELECT * FROM items WHERE embedding <-> '[3,1,2]' < 5;          -- range`,
    },
  },
  { kind: "concepts", ids: ["similarity-score", "knn-ann", "ck-search", "hybrid-query", "multi-vector"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Three kinds of score design?", answer: "Basic (inner product, cosine, Minkowski, Hamming, Mahalanobis), combined/aggregate (mean, weighted sum), learned (metric learning)." },
      { prompt: "What is score selection?", answer: "Choosing the best similarity score for a task — hard to automate, and complicated by the curse of dimensionality." },
      { prompt: "Define (c, k)-search.", answer: "Return k vectors, none more than c times worse than the best one; c = 1 is exact k-NN, c > 1 is ANN." },
      { prompt: "k-NN versus range query?", answer: "k-NN returns a fixed number k of nearest vectors; range returns all vectors within a threshold." },
      { prompt: "Pre-filtering versus post-filtering?", answer: "Pre: apply the predicate, then search the rest (always k results). Post: search k nearest, then drop failing ones (may return fewer than k)." },
      { prompt: "What is a multi-vector query?", answer: "The query or the entities have several vectors each, combined with an aggregate score such as the mean or a weighted sum." },
    ],
  },
  {
    kind: "practice",
    id: "l12-scores",
    tasks: [
      {
        id: "cosine-dot",
        prompt: "q = (1, 0). a = (2, 0) and b = (10, 10). Which is more similar to q by cosine similarity, and which by inner product?",
        check: { mode: "open" },
        solution: "Cosine: cos(q, a) = 2 / (1 · 2) = **1**; cos(q, b) = 10 / (1 · 14.14) ≈ 0.71 — **a** wins (same direction). Inner product: q·a = 2, q·b = **10** — **b** wins because the inner product rewards length. Different scores, different answers: that is why score selection matters.",
      },
      {
        id: "ck",
        prompt: "The nearest vector to q is at distance 2. With c = 1.5 and k = 3, which distances are allowed in the answer of a (c, k)-search?",
        check: { mode: "text", accept: ["3", "<= 3", "≤ 3", "up to 3", "at most 3"], placeholder: "max distance" },
        solution: "Every returned vector must be within c × 2 = **3**. Any 3 vectors with distance ≤ 3 form a correct answer; with c = 1 only the exact 3 nearest would.",
      },
      {
        id: "postfilter",
        prompt: "k = 10, post-filtering, and only 20% of the collection satisfies the predicate (independently of similarity). How many results do you expect?",
        check: { mode: "text", accept: ["2"], placeholder: "results" },
        solution: "About 10 × 0.2 = **2** of the 10 nearest pass the filter. Pre-filtering or single-stage filtering would return 10.",
      },
    ],
  },
];

const playground: Block[] = [
  {
    kind: "interactive",
    title: "Search a song collection",
    description: "Eighteen songs embedded in two dimensions (real embeddings have hundreds). Click to move the query vector q, change the score, k, c or the radius, and try a hybrid filter with pre- and post-filtering.",
    component: VectorSearchLab,
  },
  {
    kind: "info",
    variant: "note",
    title: "Things to try",
    md: "1. Euclidean, k = 4, q near *Wild Hearts*: then filter **genre = Pop** with **post-filtering** — most of the 4 nearest are Rock, so fewer than 4 results survive. Switch to **pre-filtering**: 4 Pop songs.\n2. Switch to **Cosine**: everything on the same ray from the origin is equally close — length no longer matters.\n3. Switch to **inner product**: the songs far out in q's direction win, even when they are far from q.\n4. **(c, k) ANN**: raise c from 1 and watch the dashed zone of acceptable answers grow.",
  },
];

const indexing: Block[] = [
  {
    kind: "prose",
    md: "An index speeds up search by **partitioning** the collection so that most vectors are never compared. Since vectors cannot be sorted, vector indexes partition with **randomisation**, **learned partitioning** or **navigable partitioning**, and by structure they are **table-based**, **tree-based** or **graph-based**.",
  },
  {
    kind: "table",
    headers: ["Family", "Idea", "Examples", "Trade-off"],
    rows: [
      ["Table-based: **LSH**", "Random hash functions put similar vectors in the same bucket; the query is hashed and colliding vectors are candidates", "E2LSH (random hyperplanes), FALCONN", "Easy to update; error guarantees; big buckets help recall but are slow to scan"],
      ["Table-based: **Learning to hash (L2H)**", "Machine learning learns the hash function, e.g. k-means clusters as buckets", "SPANN, spectral hashing", "High-quality partitions, but data-dependent: poor with out-of-distribution updates"],
      ["Table-based: **Quantization**", "Map vectors to **smaller vectors** or codes to save space and comparison time", "SQ (64 → 32 bits per dimension), PQ (product quantization), IVF-PQ / IVFADC", "Compression loses some accuracy"],
      ["**Tree-based**", "Recursively partition the vectors to build a search tree", "k-d tree, PCA trees, random-projection trees, ANNOY (forest of trees)", "Logarithmic search; deterministic splits adapt poorly to high dimensions"],
      ["**Graph-based**: KNN graphs", "Each vector is connected to its k most similar vectors — edges for close similarity", "KGraph (NN-Descent), EFANNA", "Exact O(N²) construction; answered by walking the graph"],
      ["**Graph-based**: MSNs and small-world graphs", "Edges chosen to make the graph **easy to navigate**: greedy best-first search reaches the target in about O(log N) steps", "NSG, Vamana/DiskANN, NSW, **HNSW**", "Very fast in practice, less theory, hard to update"],
    ],
    caption: "The slides' classification of vector indexes (SIGMOD tutorial, Section 2.2). MSN = monotonic search network.",
  },
  {
    kind: "prose",
    md: "**LSH, again.** Lecture 6 used LSH to find similar documents: split minhash signatures into **b bands of r rows** and make every pair that agrees in a whole band a candidate. A vector LSH index is the same construction: each vector is hashed into **L tables**, each hash the concatenation of **K** functions from a locality-sensitive family (for vectors: random hyperplanes or projections instead of minhashes). L plays the role of b, K the role of r, and the same S-curve trade-off between false positives and false negatives applies.\n\n**Quantization** in one picture: product quantization splits a 128-dimensional vector into, say, 8 sub-vectors of 16 dimensions, runs k-means (Lecture 4) separately in each sub-space with 256 centroids, and stores each sub-vector as the **one-byte id of its nearest centroid** — 8 bytes instead of 512.\n\n**Graph search** in one picture: start at an entry node, look at its neighbours, move to the one closest to q, and repeat until no neighbour is closer. **HNSW** stacks such graphs in layers, sparse at the top and dense at the bottom, like a skip list, so the walk takes long jumps first and fine steps last.",
  },
  {
    kind: "info",
    variant: "warning",
    title: "Two different kinds of graph",
    md: "A graph-based **vector index** is a navigation structure over vectors built by the vector database — not a graph database like Neo4j (Lecture 11). Weaviate does offer a graph data model over its entities as well, but that is a separate feature.",
  },
  {
    kind: "prose",
    md: "**Executing at scale.** Many vector databases are **distributed**: the collection is **sharded and replicated** (Lecture 3) and a search is **scatter-gather** — every shard returns its local top k and a coordinator merges them. Shards can be equal-sized or index-guided (all vectors of one bucket in one shard). Search is accelerated with **SIMD** and **GPUs**. Because many indexes are hard to update, systems apply updates **out of place** — asynchronously on replicas, in a buffer merged in bulk later, or in a log-structured merge (LSM) tree.",
  },
  { kind: "concepts", ids: ["vector-index", "quantization", "graph-index"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Three structural families of vector indexes?", answer: "Table-based (LSH, learning to hash, quantization), tree-based (recursive partitioning), graph-based (KNN graphs, MSNs and small-world graphs)." },
      { prompt: "What does quantization do?", answer: "Maps vectors to smaller vectors or codes, saving storage and comparison time at some cost in accuracy." },
      { prompt: "KNN graph versus small-world graph?", answer: "KNNG edges connect each vector to its k most similar ones; MSN/SWG edges are chosen to make the graph easy to navigate (≈ O(log N) greedy steps)." },
      { prompt: "How do L and K of an LSH index relate to Lecture 6?", answer: "L hash tables are the bands b; K concatenated hash functions are the rows r per band." },
      { prompt: "How is a distributed vector search answered?", answer: "Scatter-gather: each shard returns its local top k, a coordinator merges them into the global top k." },
    ],
  },
  {
    kind: "practice",
    id: "l12-index",
    tasks: [
      {
        id: "pq",
        prompt: "Product quantization splits 256-dimensional float32 vectors (4 bytes per dimension) into 16 sub-vectors and encodes each with one byte. By what factor does each vector shrink?",
        check: { mode: "text", accept: ["64", "64x", "64×"], placeholder: "factor" },
        solution: "Original: 256 × 4 = 1024 bytes. Quantized: 16 × 1 = 16 bytes. **64×** smaller.",
      },
      {
        id: "scatter",
        prompt: "A collection is split over 4 shards and the user wants k = 10. What does each shard return, and how is the final answer produced?",
        check: { mode: "open" },
        solution: "Each shard returns its own **top 10** with scores; the coordinator merges the 40 candidates and keeps the **10 best**. Returning fewer than 10 per shard could miss results, since all 10 global winners may live on one shard.",
      },
    ],
  },
];

const systems: Block[] = [
  {
    kind: "table",
    headers: ["Feature of a good vector database", "Meaning"],
    rows: [
      ["Scalability and adaptability", "Scale to millions or billions of vectors across nodes; tune for insertion rate, query rate and hardware"],
      ["Multi-user support and privacy", "Many users and collections with data isolation: changes to one collection are invisible to others unless shared"],
      ["API", "A full set of APIs and SDKs (Python, Node, Go, Java…) to integrate and manage it"],
      ["GUI", "User-friendly interfaces that give a visual overview and lower the learning curve"],
    ],
  },
  {
    kind: "table",
    headers: ["Kind (slides)", "Meaning", "Example"],
    rows: [
      ["Mostly vector (native)", "Built for vector search only: simple API, no query optimiser, limited attribute filtering", "Chroma (also Pinecone, Vald)"],
      ["Mostly mixed (native)", "Built for vectors and attributes together, with query optimisation and hybrid queries", "Milvus (also Qdrant, Weaviate)"],
      ["NoSQL (extended)", "A NoSQL store with vector indexes added to its storage engine and query language", "Cassandra (also MongoDB, Redis, Vespa)"],
      ["Relational (extended)", "A relational DBMS with a vector type, distance operators and indexes, planned by its optimiser", "PostgreSQL with pgvector"],
    ],
    caption: "Existing systems by how they were built.",
  },
  {
    kind: "table",
    headers: ["System", "In one line"],
    rows: [
      ["Chroma", "Open-source embedding database for LLM applications; the same API from a notebook to a production cluster"],
      ["Pinecone", "Fully managed, highly scalable service with real-time ingestion and low-latency search"],
      ["Weaviate", "Open source; vectorises data during import or accepts your own vectors; a graph data model over objects"],
      ["Faiss", "Open-source library (Meta) for fast similarity search and clustering of dense vectors, also on GPUs — a library, not a database"],
      ["Qdrant", "Vector database and similarity search engine with filtering on payloads"],
      ["Milvus", "Open source with a distributed architecture: millions of vectors, high-speed similarity search"],
      ["pgvector", "Extension of PostgreSQL: vector types and similarity search inside SQL — for smaller scale"],
    ],
    caption: "Popular vector databases on the slides. The slides' “Pinecode”, “Fais” and “Grant” are Pinecone, Faiss and (most likely) Qdrant.",
  },
  { kind: "concepts", ids: ["native-extended"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Four features of a good vector database?", answer: "Scalability and adaptability; multi-user support and privacy; an API; a GUI." },
      { prompt: "Classify Chroma, Milvus, Cassandra and PostgreSQL.", answer: "Chroma: mostly vector (native). Milvus: mostly mixed (native). Cassandra: NoSQL extended. PostgreSQL (pgvector): relational extended." },
      { prompt: "Milvus versus pgvector?", answer: "Milvus: distributed, millions of vectors, high-speed search. pgvector: PostgreSQL extension for smaller scale." },
    ],
  },
];

const mistakes: Block[] = [
  { kind: "info", variant: "pitfall", title: "Expecting exact answers by default", md: "Most vector searches are approximate (ANN): faster, but the result can miss some true nearest neighbours. Quality is measured by recall." },
  { kind: "info", variant: "pitfall", title: "Treating all scores as interchangeable", md: "Cosine ignores length, the inner product rewards it, Euclidean measures position. The same collection gives different rankings — score selection matters." },
  { kind: "info", variant: "pitfall", title: "Forgetting that post-filtering can return fewer than k", md: "Filtering after the search drops results; pre-filtering or single-stage filtering keeps k." },
  { kind: "info", variant: "pitfall", title: "Indexing vectors with a B+ tree", md: "Vectors have no meaningful total order; vector indexes partition the space with hashing, trees of splits or navigable graphs." },
  { kind: "info", variant: "pitfall", title: "Confusing a graph-based index with a graph database", md: "HNSW is a navigation structure over vectors, not a property graph you query with Cypher." },
  { kind: "info", variant: "pitfall", title: "Calling Faiss a database", md: "Faiss is a library for similarity search; it has no multi-user support, storage management or query language." },
];

const quiz: Block[] = [{ kind: "prose", md: "Twelve questions on what vector databases are, their queries, indexes and systems." }];

const summary: Block[] = [
  { kind: "list", variant: "takeaways", items: lecture12Meta.takeaways },
  {
    kind: "table",
    headers: ["Concept", "Remember"],
    rows: [
      ["Vector database", "Multidimensional points; retrieval by proximity, not exact match"],
      ["Embedding", "Neural-network summary of an image, text or audio item as a vector"],
      ["Applications", "Retail, finance, healthcare, NLP/LLMs, media analysis, anomaly detection"],
      ["Challenges", "Vague and expensive similarity; large vectors; no indexable properties; co-existence with other data"],
      ["Scores", "Basic (cosine, inner product, Euclidean, Hamming), combined (mean, weighted sum), learned (metric learning)"],
      ["Queries", "k-NN, ANN, (c, k)-search (c = 1 exact), range; variants hybrid, multi-vector, batched"],
      ["Hybrid execution", "Pre-filter (block-first), post-filter (may give < k), single-stage (visit-first)"],
      ["Indexes", "Table: LSH, L2H, quantization; tree: recursive partitioning; graph: KNNG, MSN, small-world (HNSW)"],
      ["Systems", "Native mostly-vector (Chroma), mostly-mixed (Milvus); extended NoSQL (Cassandra), relational (pgvector); library (Faiss)"],
    ],
  },
];

export const lecture12Blocks: SectionBlocks<typeof lecture12Outline> = {
  objectives,
  what,
  embeddings,
  applications,
  challenges,
  queries,
  playground,
  indexing,
  systems,
  mistakes,
  quiz,
  summary,
};
