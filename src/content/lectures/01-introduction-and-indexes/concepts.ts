import type { Concept } from "@/content/types";

export const lecture01Concepts: Concept[] = [
  {
    id: "data-intensive-system",
    term: "Data-intensive system",
    short: "A system built to manage, store, process and analyse massive amounts of data efficiently and reliably.",
    detail:
      "It supplies the infrastructure that machine learning and AI run on: distributed storage and computing, data ingestion, curation and querying, big-data analytics, data management and integration. Examples are HDFS, Spark, NoSQL and vector databases, data pipelines and stream processing.",
    tags: ["course"],
  },
  {
    id: "data-sources",
    term: "Three sources of data",
    short: "Employees and data engineers, then internet users, then machines.",
    detail:
      "Organisations first produced data themselves. Internet users then became data producers on Facebook, Twitter, eBay, LinkedIn, TikTok and YouTube. Machine-generated data — click-logs, product scanning, sensors, cellphones, infection tracing, network traffic monitors — is what turns more data into **big** data.",
    tags: ["big data"],
  },
  {
    id: "data-pipeline",
    term: "Data processing pipeline",
    short: "Acquisition and storage → cleaning, annotation, integration, aggregation → exploration and querying → modelling and analysis.",
    detail:
      "Interviews and expert estimates put 50% to 80% of a data scientist's time into collecting and preparing unruly data before anything can be explored — which is the part data-intensive systems make tractable.",
    tags: ["big data"],
  },
  {
    id: "data-model",
    term: "Data model",
    short: "Three components: structures, constraints and operations.",
    detail:
      "In the relational model the structures are relations, the constraints are keys, foreign keys and domains, and the operations are relational algebra and SQL. Every database family — relational, document, key-value, columnar, graph, time-series, object-oriented, in-memory, vector — makes a different choice for each of the three.",
    tags: ["background"],
  },
  {
    id: "acid",
    term: "ACID",
    short: "Atomic, consistent, isolated, durable — the guarantees of a transaction.",
    detail:
      "**Atomic**: the transaction is carried out completely or the database reverts to the state before it started. **Consistent**: a processed transaction never endangers the structural integrity of the database. **Isolated**: transactions cannot compromise each other while still in progress. **Durable**: the effects of a completed transaction persist through network or power outages.",
    tags: ["background"],
  },
  {
    id: "tf-idf",
    term: "TF.IDF",
    short: "Term frequency times inverse document frequency: how concentrated a word is in a few documents.",
    detail:
      "$TF_{ij} = f_{ij} / \\max_k f_{kj}$ normalises the count of term $i$ in document $j$ by the most frequent term there; $IDF_i = \\log_2(N/n_i)$ rewards terms that appear in few of the $N$ documents. The terms with the highest $TF_{ij} \\times IDF_i$ best characterise the topic of document $j$.",
    tags: ["MMDS 1.3.1"],
  },
  {
    id: "hash-function",
    term: "Hash function",
    short: "Maps a hash-key to a bucket number in 0 … B−1, spreading a reasonable population of keys evenly.",
    detail:
      "For integers, $h(x) = x \\bmod B$ is common; choose $B$ prime so it shares no factor with the keys. Strings are turned into integers by summing character codes (in groups when $B$ is large), records and collections by converting and summing their components.",
    tags: ["MMDS 1.3.2", "hashing"],
  },
  {
    id: "index",
    term: "Index",
    short: "A data structure that retrieves the objects with a given value in one or more fields without scanning all of them.",
    detail:
      "A hash table on the phone field of (name, address, phone) records is the simplest example: hash the phone, go to that bucket, and search only it. The fields the index is built on form its **search key**.",
    tags: ["MMDS 1.3.3", "indexing"],
  },
  {
    id: "data-entry",
    term: "Data entry k*",
    short: "What an index stores for search key value k: the record itself, ⟨k, rid⟩, or ⟨k, list of rids⟩.",
    detail:
      "Alternative (1) stores the data record in the index; alternatives (2) and (3) store record ids that point into a separate data file. Index entries in the upper levels of a tree only direct the search towards the data entries.",
    tags: ["indexing"],
  },
  {
    id: "clustered-index",
    term: "Clustered index",
    short: "The data records are stored in (or close to) the order of the data entries.",
    detail:
      "With alternative (2) and a heap file, a clustered index is built by sorting the heap file first, leaving free space on each page; later inserts may need overflow pages, so the order is close to, but not identical to, the sort order. A range query through a clustered index reads one page per page of results, through an unclustered one up to one page per result.",
    tags: ["indexing"],
  },
  {
    id: "static-hashing",
    term: "Static hashing",
    short: "A fixed number N of buckets, each a primary page plus a chain of overflow pages.",
    detail:
      "Search costs about one I/O and insert or delete two. As the file grows, overflow chains get long and performance degrades; the only cure is rehashing into more buckets, during which the index cannot be used.",
    tags: ["hashing"],
  },
  {
    id: "extendible-hashing",
    term: "Extendible hashing",
    short: "A directory of 2ᵈ bucket pointers, indexed by the last d bits of the hash value; only the overflowing bucket splits.",
    detail:
      "When a bucket splits, its entries are redistributed on one more bit into the bucket and its split image. If the bucket's local depth equalled the global depth, the directory doubles by copying itself. No overflow pages are needed except for collisions.",
    tags: ["hashing"],
  },
  {
    id: "depths",
    term: "Global and local depth",
    short: "Global depth d: bits the directory uses. Local depth l: bits all entries of a bucket agree on.",
    detail:
      "Exactly $2^{d-l}$ directory elements point to a bucket of local depth $l$. Splitting a bucket with $l < d$ just rewires half of those pointers; splitting one with $l = d$ forces the directory to double.",
    tags: ["hashing"],
  },
  {
    id: "linear-hashing",
    term: "Linear hashing",
    short: "No directory: buckets are split one by one, round-robin, using a family of hash functions hᵢ(v) = h(v) mod 2ⁱN.",
    detail:
      "A round splits every bucket that existed at its start, from bucket *Next* onwards. A split is triggered by an insert that needs an overflow page, but the bucket that splits is *Next*, not necessarily the one that overflowed. A key goes to bucket $h_{Level}(k)$, unless that bucket was already split this round — then $h_{Level+1}$ decides.",
    tags: ["hashing"],
  },
  {
    id: "isam",
    term: "ISAM",
    short: "Indexed Sequential Access Method: a static tree index whose leaf pages are allocated sequentially at creation.",
    detail:
      "Inserts that do not fit go to overflow pages, so long chains can develop when the data changes. Because only leaf pages are ever modified, the index levels never need locking — an advantage for concurrent access.",
    tags: ["trees"],
  },
  {
    id: "b-plus-tree",
    term: "B+ tree",
    short: "A balanced, dynamic tree index: data entries in chained leaves, index entries above that only direct the search.",
    detail:
      "Insert and delete keep it balanced, every node except the root is at least half full, and because of the high fan-out its height is rarely more than 3 or 4. The doubly linked leaves (the *sequence set*) make range scans and sorted access cheap.",
    tags: ["trees"],
  },
  {
    id: "order",
    term: "Order d and fan-out",
    short: "Every non-root node holds m entries with d ≤ m ≤ 2d; the root holds 1 ≤ m ≤ 2d.",
    detail:
      "A non-leaf node with m keys has m + 1 child pointers. The number of children per node is the fan-out; the height is about $\\log_{fan\\text{-}out}(\\#\\text{data entries})$, which is why compressing keys to raise the fan-out pays off.",
    tags: ["trees"],
  },
  {
    id: "copy-push",
    term: "Copy up versus push up",
    short: "A leaf split copies its separator key up; an index-node split pushes its middle key up.",
    detail:
      "Every data entry must stay in a leaf, so the smallest key of the new leaf appears both in the leaf and in its parent. An index node has no such constraint: of 2d + 1 keys, d stay left, d move right, and the middle one moves to the parent only.",
    tags: ["trees"],
  },
];
