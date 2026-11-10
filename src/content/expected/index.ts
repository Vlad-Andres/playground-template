/**
 * "Expected at the exam": the official expected-knowledge statement of every lecture, followed by
 * that knowledge in the shortest form that is still complete. Each item can be ticked off as known.
 * The lecture pages hold the full explanations; this page is for last-day revision.
 */

export interface ExpectedItem {
  id: string;
  title: string;
  /** Markdown. */
  md: string;
}

export interface ExpectedTopic {
  id: string;
  lectures: string;
  title: string;
  /** Lecture pages that explain this topic in full. */
  links: { slug: string; label: string }[];
  /** The course's own statement of what is expected. */
  official: string;
  items: ExpectedItem[];
}

export const expectedTopics: ExpectedTopic[] = [
  {
    id: "indexes",
    lectures: "Lecture 1",
    title: "Hash functions, hash indexes and B+ trees",
    links: [{ slug: "introduction-and-indexes", label: "Lecture 1" }],
    official:
      "Section 1.3 (until 1.3.4 inclusive) of Mining Massive Datasets. From the database textbook: how to use the principle of a hash function in different scenarios, what a hash index is and how it works; the difference with the B+ tree index, how the latter works, and what benefits it brings.",
    items: [
      {
        id: "tfidf",
        title: "TF.IDF (MMDS 1.3.1)",
        md: `Finds the words that characterise a document: frequent **in this document**, rare **in the collection**.

- **TF**ᵢⱼ = fᵢⱼ / maxₖ fₖⱼ — frequency of word i in document j, divided by the frequency of the most frequent word in j.
- **IDF**ᵢ = log₂(N / nᵢ) — N documents in total, nᵢ of them contain word i.
- **Score = TF × IDF.** A word in every document has IDF = log₂ 1 = 0. Stop words score low, topic words high.`,
      },
      {
        id: "hash-functions",
        title: "Hash functions (MMDS 1.3.2)",
        md: `A hash function h maps a **hash-key** to a **bucket number** 0 … B−1 and should spread the keys **evenly** ("randomise" them).

- Integers: h(x) = x mod B. Choose **B prime**: if B shares a factor with the keys (all keys even, B = 10) only some buckets are used.
- Strings and other types: convert to an integer first (e.g. sum the character codes, or group characters), then mod B. Records: combine the hashes of the components.
- **Uses in this course:** hash indexes, grouping keys in MapReduce (which reducer gets a key), sharding and partitioning, hashed shingles, minhashing, LSH buckets, Bloom filters.`,
      },
      {
        id: "index-and-storage",
        title: "Indexes and secondary storage (MMDS 1.3.3–1.3.4)",
        md: `- An **index** is a data structure that retrieves records efficiently given the value of one or more fields, without scanning everything. A **hash table** is one way: hash the field value, look only in that bucket.
- **Disks** are organised in **blocks** (e.g. 64 KB). Reading a block takes about **10 ms** — roughly **10⁵ times slower** than main memory. So an algorithm's cost is counted in **disk I/Os** (blocks read), and good algorithms keep the data they need in memory or read each block once.`,
      },
      {
        id: "hash-index",
        title: "Hash index: static, extendible, linear",
        md: `A hash index puts each **data entry** in the bucket h(key). **Equality search ≈ 1–2 I/Os. No range queries** — hashing destroys order.

- **Static hashing:** a fixed number of primary pages; full buckets get **overflow chains**, which grow long as the file grows.
- **Extendible hashing:** a **directory** of 2ᵈ pointers (d = **global depth**, the last d bits of h); each bucket has a **local depth** l. When a bucket overflows: **split only that bucket**; if l = d the **directory doubles** first. Costs at most one extra I/O for the directory.
- **Linear hashing:** **no directory**. Buckets are split **in round-robin order** (pointer *Next*), whichever bucket overflowed; hash family hᵢ(v) = h(v) mod 2ⁱN. If hᵢ(v) points before *Next*, use hᵢ₊₁. Overflow pages exist, but only briefly.`,
      },
      {
        id: "bplus",
        title: "B+ tree: how it works",
        md: `A **balanced** tree: every root-to-leaf path has the same length.

- **Index (inner) nodes** hold only keys and pointers to direct the search. **Leaves** hold the data entries and are **chained** to their neighbours.
- **Order d:** every node holds between **d and 2d** entries (the root: 1 to 2d), so it is always at least half full. **Fan-out** is large (≈ 100+), so the **height** ≈ log_fanout(N) is 3–4 in practice.
- **Search:** root to leaf, one page per level.
- **Insert:** into the right leaf. If full, **split**: in a **leaf** the middle key is **copied up** (it stays in the leaf); in an **index node** it is **pushed up** (it moves). Splits can cascade to the root, which is how the tree grows taller.
- **Delete:** if a node falls below d entries, **redistribute** from a sibling, otherwise **merge** with it (and remove the separator in the parent).`,
      },
      {
        id: "hash-vs-bplus",
        title: "Hash index versus B+ tree, and the B+ tree's benefits",
        md: `| | Hash index | B+ tree |
|---|---|---|
| Equality (key = v) | ≈ 1–2 I/Os — best | height of the tree (3–4 I/Os) |
| Range (a ≤ key ≤ b) | **not supported** | find a, then follow the leaf chain |
| Sorted output, prefix search, min/max | no | yes |
| Growth | directory doubling / splitting | stays balanced automatically |

**Benefits of the B+ tree:** supports equality **and** range queries, keeps the data sorted, stays balanced under inserts and deletes with a guaranteed log cost, and nodes are always at least 50% full. A **clustered** index (data stored in key order) makes ranges read few pages; an unclustered one may cost one I/O per matching record.`,
      },
    ],
  },
  {
    id: "similar-items",
    lectures: "Lectures 2, 5 and 6",
    title: "Entity resolution and finding similar items",
    links: [
      { slug: "similar-items-part-1", label: "Part 1" },
      { slug: "similar-items-part-2", label: "Part 2" },
      { slug: "similar-items-part-3", label: "Part 3" },
    ],
    official:
      "What entity resolution is, why we need it, at what level it can occur, the different distance metrics, in what situations they are used, and their formulas. How to generate n-grams, perform min-hash and apply LSH. MMDS Chapter 3: 3.1.1 to 3.4, 3.5, 3.8.1, 3.8.2 and 3.8.3. What a distance metric is and the popular distance metrics.",
    items: [
      {
        id: "er-what",
        title: "Entity resolution: what, why, at which levels",
        md: `**What:** deciding whether two descriptions (records, data structures) refer to the **same real-world entity** — then identifying them, deciding how to merge, and updating the collection. Also called deduplication, record linkage, entity linkage.

**Why needed:** the same entity appears differently because of
- **text variations** — misspellings, acronyms, abbreviations, different word order, transformations;
- **local knowledge** — every source has its own formats and identifiers; there is no global coordination.

Without it, integrated data has duplicates and wrong counts and joins.

**Levels (families of solutions):**
1. **Atomic values** — compare strings (edit distance, Jaro…).
2. **Sets** — compare records as sets of values or tokens (Jaccard).
3. **Inner relationships** — use the links between entities (co-authors separate the different "Ling Chen").
4. **Uncertain data** — keep probabilities instead of forcing a decision.

**Cost:** N records give **N(N−1)/2** pairs (10⁶ records ≈ 5·10¹¹), so comparing everything is infeasible → blocking, minhashing, LSH.`,
      },
      {
        id: "string-measures",
        title: "String measures: edit, gap, Jaro, Jaro-Winkler",
        md: `- **Edit distance (Levenshtein):** minimum number of **inserts, deletes and substitutions** to turn x into y. MMDS version (inserts and deletes only): **|x| + |y| − 2·|LCS(x, y)|**. *Use:* typos in strings.
- **Gap (affine gap) distance:** a run of missing characters costs an **opening** cost plus a small **extension** cost per character, so long gaps are cheap. *Use:* abbreviations ("knowl. data").
- **Jaro similarity:** **⅓·(C/|s₁| + C/|s₂| + (C − T)/C)**, with C = common characters (within half the longer length) and T = transpositions (half the common characters out of order). *Use:* short strings, **names**.
- **Jaro-Winkler:** Jaro plus a bonus for a **common prefix** — names usually agree at the start.`,
      },
      {
        id: "distance-metric",
        title: "What a distance metric is (MMDS 3.5.1)",
        md: `A function d(x, y) producing a number, with four **axioms**:

1. **d(x, y) ≥ 0** — no negative distances;
2. **d(x, y) = 0 if and only if x = y**;
3. **d(x, y) = d(y, x)** — symmetry;
4. **d(x, y) ≤ d(x, z) + d(z, y)** — the triangle inequality.

**Euclidean** spaces have points with real coordinates (an average of points exists). **Non-Euclidean** spaces (sets, strings) do not.`,
      },
      {
        id: "distance-list",
        title: "The popular distance measures, formula and use",
        md: `| Measure | Formula | Use for |
|---|---|---|
| **Euclidean L₂** | √Σ(xᵢ − yᵢ)² | points in space |
| **Manhattan L₁** | Σ\\|xᵢ − yᵢ\\| | grid-like differences |
| **L∞** | max \\|xᵢ − yᵢ\\| | largest single difference |
| **Lᵣ norm** | (Σ\\|xᵢ − yᵢ\\|ʳ)^(1/r) | the general form |
| **Jaccard distance** | 1 − \\|A ∩ B\\| / \\|A ∪ B\\| | **sets** (shingles, purchases) |
| **Cosine distance** | the **angle** arccos(x·y / (‖x‖·‖y‖)) | vectors where only **direction** matters (text, embeddings) |
| **Edit distance** | inserts + deletes (+ substitutions) | **strings** |
| **Hamming distance** | number of positions that differ | **bit vectors** of equal length |

Example: a = (5, 5), b = (9, 8): L₂ = 5, L₁ = 7, L∞ = 4.`,
      },
      {
        id: "shingles",
        title: "Generating n-grams (k-shingles) (MMDS 3.2)",
        md: `A **k-shingle** (character n-gram) is any substring of length k. A document becomes the **set** of its k-shingles, so documents sharing text share shingles.

- "abcdabd", k = 2 → {ab, bc, cd, da, bd} (ab appears twice, counted once). A document of n characters has at most **n − k + 1** shingles.
- **Choosing k:** large enough that any given shingle is unlikely in any given document: **k ≈ 5** for short texts (emails), **k ≈ 9–10** for long documents. Too small (k = 1) → every document looks similar.
- **Hashed shingles:** hash 9-shingles to 4-byte integers — more discriminating than 4-shingles in the same space.
- **Word shingles:** e.g. a stop word followed by the next two words — favours the article text over page clutter.
- Similarity of two documents = **Jaccard similarity** of their shingle sets. For **bags**: intersection counts min, union counts the sum.`,
      },
      {
        id: "minhash",
        title: "Performing minhash (MMDS 3.3)",
        md: `**Goal:** replace large sets by short **signatures** that preserve Jaccard similarity.

- **Characteristic matrix:** rows = elements (shingles), columns = sets, 1 if the element is in the set. For two columns, with a = rows (1,1) and b, c = rows with exactly one 1: **SIM = a / (a + b + c)**.
- **Minhash** of a column under a random **permutation** of the rows = the first row (in permuted order) where the column has a 1.
- **Key property:** **P[h(C₁) = h(C₂)] = SIM(C₁, C₂)**.
- **Signature** = the minhash values under n permutations. **Signature similarity** = fraction of positions that agree ≈ Jaccard similarity (more hash functions → smaller error).

**In practice (row hashing instead of permutations):**
1. Pick n hash functions hᵢ(r) on row numbers; set every SIG(i, c) = ∞.
2. For each row r: compute h₁(r) … hₙ(r) once.
3. For each column c with a **1** in row r: SIG(i, c) = **min**(SIG(i, c), hᵢ(r)).`,
      },
      {
        id: "lsh",
        title: "Applying LSH: banding and the S-curve (MMDS 3.4)",
        md: `**Goal:** find **candidate pairs** without comparing all pairs of signatures.

- Split the signature matrix into **b bands of r rows** (n = b·r). Hash each band's portion of every column to buckets. Two columns are a **candidate pair** if they land in the same bucket for **at least one band**.
- For a pair with similarity s: **P[candidate] = 1 − (1 − sʳ)ᵇ** — an **S-curve**.
- **Threshold** (where it rises steeply) ≈ **(1/b)^(1/r)**.
- More **rows per band** (fewer bands) → threshold moves **up**: fewer false positives, more false negatives. More **bands** → the opposite.
- **False positive:** dissimilar pair that becomes a candidate (costs a check). **False negative:** similar pair never becoming a candidate (lost).
- Example: b = 20, r = 5: s = 0.8 → 0.9996; s = 0.3 → 0.047; threshold ≈ 0.55.

**Whole pipeline:** shingle → minhash signatures → choose b, r for the target threshold → LSH gives candidates → check the signatures (and optionally the documents) of candidates.`,
      },
      {
        id: "lsh-er",
        title: "LSH for entity resolution and validating matches (MMDS 3.8.1–3.8.3)",
        md: `- **Records, not documents:** records have fields, so score each field (e.g. with edit distance) and add the scores; a pair above a threshold is a match.
- **Avoiding all pairs:** instead of minhashing, use simple **"hash functions" on fields** — put records in the same bucket if they agree **exactly** on a field (name, or address, or phone); only records sharing a bucket are scored. This is **blocking**.
- **Validating without labelled data:** use a field **not used in the score** (e.g. a creation date). For true matches the dates should be close; for random pairs they differ by a known average. If random pairs differ by 45 on average, true matches by 10, and the candidates' average is x, the fraction of true matches is **f = (45 − x) / 35**.
- Any field that true matches agree on (and false ones do not) can validate the method the same way.`,
      },
    ],
  },
  {
    id: "distributed-db",
    lectures: "Lecture 3",
    title: "Distributed databases",
    links: [{ slug: "distributed-databases", label: "Lecture 3" }],
    official:
      "Understand and use horizontal and vertical fragmentation, and how to combine the fragments into the complete dataset. Know the concepts of sharding, data transparency, optimization, replication, the quorum consensus protocol, two-phase commit, joins with regular or Bloom filters, Greenplum (what it is and a fragmentation example) and MemSQL. Relational algebra, ER and SQL are assumed.",
    items: [
      {
        id: "fragmentation",
        title: "Horizontal and vertical fragmentation, and reconstruction",
        md: `- **Horizontal:** split the **tuples** with **selections** — Rᵢ = σ_pᵢ(R). **Reconstruct with union:** R = R₁ ∪ R₂ ∪ … With n decomposition predicates you get up to 2ⁿ fragments (all combinations of pᵢ / ¬pᵢ).
- **Vertical:** split the **attributes** with **projections** — Rᵢ = π_Aᵢ(R). Every fragment must contain the **key** (or a tuple id). **Reconstruct with a join on the key:** R = R₁ ⋈ R₂ ⋈ …
- **Combined:** fragment one way, then the other; reconstruct in reverse order.
- **Correctness rules:** **completeness** (every tuple / attribute is in some fragment), **reconstructability** (R can be rebuilt), **disjointness** (no data in two fragments — optional; given up on purpose for replication, and the key always repeats in vertical fragments).
- **Derived horizontal fragmentation:** fragment a second relation to follow the first using a **semi-join** (Lectures ⋉ Professorsᵢ), so each join can be done locally.`,
      },
      {
        id: "sharding-transparency",
        title: "Sharding, allocation and data transparency",
        md: `- **Sharding** = horizontal fragmentation across machines by a **shard key** (hash or range); each node stores one shard. Gives scale-out and parallelism.
- **Allocation** = deciding which fragment is stored on which site — without replication (each fragment once) or with replication (some fragments on several sites).
- **Transparency** = what the user does **not** need to know:
  - **Fragmentation transparency** — query the global relation as if it were not fragmented (the highest level);
  - **Replication transparency** — unaware that copies exist;
  - **Location transparency** — unaware of which site holds the data.`,
      },
      {
        id: "optimization",
        title: "Query translation and optimization",
        md: `1. **Translate:** replace each global relation by its reconstruction (∪ of horizontal fragments, ⋈ of vertical ones) — the naive plan ships everything and rebuilds the relations.
2. **Optimize:** **push selections and projections down** into the fragments; **drop fragments** whose predicate contradicts the query (a selection on rank = C4 never needs the fragment of other ranks); with derived fragmentation, **push the join below the union** so each site joins locally and only small results are unioned.

Goal: ship as little data as possible and do work in parallel at the sites.`,
      },
      {
        id: "replication-quorum",
        title: "Replication and the quorum consensus protocol",
        md: `**Replication:** several sites hold copies → faster reads, availability, locality. Price: keeping copies consistent on writes.

- **ROWA (read one, write all):** cheap reads; a write fails if any replica is down.
- **Quorum consensus:** each site has a **weight**; W = total weight. Choose a read quorum Qr and a write quorum Qw with
  - **Qr + Qw > W** — every read overlaps the latest write;
  - **2·Qw > W** — two writes cannot happen at once.
- A read locks sites of total weight ≥ Qr and takes the copy with the **highest version number**. A write locks ≥ Qw and increases the version.
- Example: weights 3, 1, 2, 2 → W = 8; Qw = 5, Qr = 4 is valid. ROWA is Qw = W, Qr = 1.`,
      },
      {
        id: "2pc",
        title: "Two-phase commit",
        md: `Makes a transaction over several sites **atomic** (all commit or all abort). Roles: one **coordinator**, several **agents** (participants).

1. **Phase 1 – voting:** coordinator sends **PREPARE**. Each agent writes its changes to its log and answers **READY** (it can commit) or **FAILED**.
2. **Phase 2 – decision:** all READY → coordinator logs and sends **COMMIT**; otherwise **ABORT**. Agents act and send **ACK**.

**Blocking problem:** an agent that answered READY may neither commit nor abort by itself. If the coordinator crashes before sending the decision, the agents wait — **holding their locks** — until it recovers. The coordinator is a single point of failure (hence 3PC, Paxos, Raft).`,
      },
      {
        id: "joins",
        title: "Distributed joins: semi-join and Bloom filter",
        md: `Joining R (site 1) with S (site 2) on attribute C without shipping a whole relation:

- **Semi-join filter:** send only **π_C(R)** to site 2; compute S′ = S ⋉ R there (the S tuples that have a partner); ship S′ back and join. R ⋈ S = R ⋈ (S ⋉ π_C(R)). Pays off when few tuples have partners.
- **Bloom filter:** instead of the values, send a **bit vector** of m bits: for every join value of R set the bits h₁(v) … h_k(v). Site 2 keeps only S tuples whose bits are all set. Much smaller message, but **false positives** ("false drops") — some non-matching tuples are shipped and then removed by the real join. **Never false negatives.**
- **By data placement:** **co-located join** (both tables sharded on the join key → local joins, no shipping), **broadcast join** (small table copied to every node), **distributed / redistribute join** (reshuffle one side on the join key).`,
      },
      {
        id: "greenplum-memsql",
        title: "Greenplum and MemSQL",
        md: `**Greenplum:** a **massively parallel (MPP), shared-nothing** database built on PostgreSQL. A **master** plans queries; **segments** store the data and execute in parallel.
- **DISTRIBUTED BY (col)** — hash-shards rows **across segments** (horizontal fragmentation between nodes). DISTRIBUTED RANDOMLY = round-robin.
- **PARTITION BY RANGE / LIST** — splits a table **within** each segment (e.g. one partition per month), so queries skip partitions.
- Example: sales DISTRIBUTED BY (trans_id) PARTITION BY RANGE (date) with sub-partitions by region.

**MemSQL (SingleStore):** a distributed **in-memory** SQL database. **Aggregator** nodes route and combine; **leaf** nodes store shards. Tables are sharded by a **SHARD KEY**; small **reference tables** are **replicated to every node** so joins with them are local.`,
      },
    ],
  },
  {
    id: "in-db-ml",
    lectures: "Lecture 4",
    title: "In-database machine learning",
    links: [{ slug: "in-database-machine-learning", label: "Lecture 4" }],
    official:
      "Know the idea of in-database machine learning and its benefits: running machine learning directly where the data is stored, rather than extracting it into the memory of another system. Depending on the database, it may support training models, making predictions, or both.",
    items: [
      {
        id: "idea",
        title: "The idea",
        md: `**In-database machine learning** = running machine learning **where the data is stored**, instead of exporting the data to a separate ML system and loading it into that system's memory. Depending on the database it supports **training**, **prediction (scoring)**, or **both**.

How it is possible: SQL can iterate with **recursive queries** (k-means, gradient descent), matrices can be stored as **(i, j, value) relations** and multiplied with a join + SUM … GROUP BY, and some systems add arrays and automatic differentiation.`,
      },
      {
        id: "benefits",
        title: "The six benefits",
        md: `1. **Less data movement** — no copying of large datasets to an ML platform: saves transfer time and duplicate storage.
2. **Fresher predictions** — models work on the **current** records, not on a periodic export.
3. **Simpler workflows** — preparation and prediction fit into existing SQL queries, reports and applications; fewer pipelines to maintain.
4. **Easier access for analysts** — people who know SQL can use ML without building a Python application.
5. **More centralised security** — no exported copies; the database's access control and auditing are reused.
6. **Efficient processing at scale** — uses the database's **parallel processing**; no need to pull everything onto one machine.

**Example:** an online store scores each customer's likelihood of leaving and **joins the predictions with the customer records** to produce a retention report — all inside the database.`,
      },
    ],
  },
  {
    id: "mapreduce",
    lectures: "Lecture 7",
    title: "MapReduce",
    links: [{ slug: "mapreduce", label: "Lecture 7" }],
    official:
      "Know what MapReduce is and be able to write a MapReduce program for some basic sequential tasks. Study material: MMDS Chapter 2. It is very important to know the examples of that chapter: how to create an inverted index, how to multiply matrices, and how to make joins.",
    items: [
      {
        id: "what",
        title: "What MapReduce is",
        md: `A **programming model and system** for processing very large data **in parallel on a cluster** of commodity machines, **tolerating failures**. Purpose: **distribute and scale out (almost) linearly**. You write two functions; the system does the rest.

- **map(in_key, in_value) → list(out_key, intermediate_value)** — applied to every input element independently.
- **Group by key (shuffle)** — the system collects all values of the same key; a hash of the key decides the reducer, so **each key goes to exactly one reducer**.
- **reduce(out_key, list(intermediate_value)) → list(out_value)** — combines **all** values of one key.
- **Combiner:** runs the reduce function inside the map task before the shuffle; allowed only if it is **associative and commutative** (sum, max — not average). Flow: **Map → Combine → Reduce**.
- Reduce can start only when **all mappers have finished**.`,
      },
      {
        id: "execution",
        title: "How a job runs and survives failures",
        md: `- Input files live in a distributed file system, split into **chunks**. The **master** creates **M map tasks** (one per chunk) and **R reduce tasks** and assigns them to **workers**.
- Map output is written to the map worker's **local disk**, partitioned into R files; reduce workers fetch, sort, and reduce; the output goes to the DFS.
- **Map worker fails:** redo **all** its map tasks, even completed ones (their output was local and is gone).
- **Reduce worker fails:** reschedule only its running tasks (finished output is already in the DFS).
- **Master fails:** the whole job restarts.`,
      },
      {
        id: "basic-programs",
        title: "Writing basic programs: the recipe and the standard ones",
        md: `**Recipe:** decide what must meet in one reducer → make that the **key**.

| Task | map emits | reduce does |
|---|---|---|
| Word count | (word, 1) | sum |
| Sum of n integers | ("sum", x) — one constant key | sum |
| Max / min per group | (group, value) | max / min |
| Average per group | (group, (value, 1)) | sum both, divide (**not** an average of averages) |
| Selection σ | (t, t) if the condition holds | identity |
| Projection π | (t′, t′) | emit once (removes duplicates) |
| Union | (t, t) | emit once |
| Intersection | (t, t) | emit if **both** relations sent it |
| Difference R − S | (t, "R") or (t, "S") | emit if only "R" |
| Group by A, aggregate θ(B) | (a, b) | apply θ |`,
      },
      {
        id: "inverted-index",
        title: "Example: inverted index",
        md: `For every word, the list of documents that contain it.

- **map(docId, text):** for each word w in the text → emit **(w, docId)**.
- **reduce(w, list of docIds):** emit **(w, sorted list of distinct docIds)**.`,
      },
      {
        id: "join",
        title: "Example: natural join R(A, B) ⋈ S(B, C)",
        md: `- **map:** tuple (a, b) of R → emit **(b, ("R", a))**; tuple (b, c) of S → emit **(b, ("S", c))**. The **join attribute is the key**; the **tag** says which relation the value came from.
- **reduce(b, list):** separate the R-values and the S-values; for **every pair** (a from R, c from S) emit **(a, b, c)**.

Input is a set of files with tuples of both relations: the in_key is the position / file, the in_value is one tuple with its relation name.`,
      },
      {
        id: "matrix",
        title: "Example: matrix-vector and matrix multiplication",
        md: `Matrices are stored as triples (i, j, mᵢⱼ).

- **Matrix × vector x = M·v** (v fits in memory): map (i, j, mᵢⱼ) → **(i, mᵢⱼ·vⱼ)**; reduce: **sum** → xᵢ. If v does not fit, cut M and v into matching stripes.
- **Matrix × matrix P = M·N, two jobs:**
  1. map: mᵢⱼ → (j, (M, i, mᵢⱼ)); nⱼₖ → (j, (N, k, nⱼₖ)). reduce on j: for each pair emit ((i, k), mᵢⱼ·nⱼₖ) — a **join on j**.
  2. map: identity. reduce on (i, k): **sum** → pᵢₖ.
- **One job:** map: mᵢⱼ → ((i, k), (M, j, mᵢⱼ)) for **every k**; nⱼₖ → ((i, k), (N, j, nⱼₖ)) for **every i**. reduce on (i, k): match the values with the same j, multiply, **sum**.`,
      },
    ],
  },
  {
    id: "spark",
    lectures: "Lecture 8",
    title: "Apache Spark",
    links: [{ slug: "apache-spark", label: "Lecture 8" }],
    official: "Spark versus Hadoop (what is the difference), how Spark operates, what RDDs are, what DataFrames are, and how they are used.",
    items: [
      {
        id: "spark-vs-hadoop",
        title: "Spark versus Hadoop",
        md: `**Hadoop** = an ecosystem: **MapReduce** (computation) + **HDFS** (storage) + YARN, Hive, HBase… (So HDFS is one part of Hadoop.) Hadoop MapReduce writes to and reads from **disk (HDFS) between every job** — replication, serialisation, I/O — so it is slow for **iterative** algorithms (machine learning) and interactive queries; code is verbose; no real-time processing.

**Spark** = a general-purpose cluster **processing framework** (not storage — it reads HDFS, S3, databases…).

| | Hadoop MapReduce | Spark |
|---|---|---|
| Intermediate data | on disk (HDFS) | **in memory** (cacheable) |
| Iterative / interactive | slow | fast (10–100×) |
| Fault tolerance | replication, re-run tasks | **lineage**: recompute lost partitions |
| API | map and reduce only | many operators; SQL, streaming, MLlib, GraphX |
| Languages | mainly Java | Scala, Java, Python, R |`,
      },
      {
        id: "how-spark-operates",
        title: "How Spark operates",
        md: `- The **driver program** holds the **SparkContext** (SparkSession), turns your code into a **DAG** of operations, and schedules **tasks**.
- A **cluster manager** (standalone, YARN, Mesos, Kubernetes) allocates **worker nodes**.
- **Executors** on the workers run the tasks and **cache** data; results return to the driver.
- **Lazy evaluation:** transformations only build the DAG (the **lineage**). An **action** triggers execution of everything needed.
- Without **cache() / persist()**, every action recomputes the whole chain from the source; persisting keeps an RDD in memory (or disk) for reuse.
- Data is split into **partitions** (about 2–4 per CPU); one task per partition.`,
      },
      {
        id: "rdd",
        title: "RDDs and how they are used",
        md: `**RDD = Resilient Distributed Dataset:** an **immutable**, **partitioned** collection of records distributed over the cluster, **lazily evaluated**, **cacheable**, and **fault-tolerant through lineage** (a lost partition is recomputed from its parents — no replication needed).

- **Create:** from a collection (parallelize) or external data (textFile on HDFS, S3…), or from another RDD.
- **Transformations** (lazy, return an RDD): map, filter, flatMap, distinct, union, intersection, subtract, cartesian, reduceByKey, groupByKey, join.
- **Actions** (return a value to the driver, trigger computation): collect, count, countByValue, take, top, reduce, saveAsTextFile.

Word count: textFile → flatMap(split into words) → map(word → (word, 1)) → reduceByKey(+) → collect / save.`,
      },
      {
        id: "dataframe",
        title: "DataFrames and how they are used",
        md: `A **DataFrame** is a distributed, immutable **table**: rows and **named columns with a schema** (like a relational table). A **Dataset** is the typed version; DataFrame = Dataset of Row (types checked at runtime).

- **Use:** read structured data (JSON, CSV, Parquet, JDBC), then select, where / filter, groupBy, agg, join, orderBy — or register it as a view and query it with **SQL** (spark.sql).
- **Why better than RDDs for structured data:** because Spark knows the schema, the **Catalyst optimizer** can optimise the query: code → **logical plan** → optimised logical plan → **physical plans** → the cheapest by a cost model → executed as **RDD operations**. Same performance from every language.
- RDDs remain for unstructured data and low-level control.`,
      },
    ],
  },
  {
    id: "dfs",
    lectures: "Lecture 9",
    title: "Distributed file systems",
    links: [{ slug: "distributed-file-systems", label: "Lecture 9" }],
    official:
      "Know how the different file systems work (what is on the slides). For GFS and HDFS: everything described in “The Hadoop Distributed File System: Architecture and Design”, and from “HDFS and Distributed File Systems” by Velegrakis everything mentioned on the slides.",
    items: [
      {
        id: "dfs-why",
        title: "Why distributed file systems; NFS and RAID",
        md: `A **DFS** stores files across many machines behind **one namespace**. Requirements: **fault tolerance** (with thousands of machines, failure is the norm), consistency, security, efficiency, scalability, hardware independence.

- **NFS (Sun, 1985):** a client **mounts** a remote directory and uses it like a local one. **Stateless** server; client caching and read-ahead. One server holds a file → **not very fault tolerant or scalable**.
- **RAID** (several disks of one machine acting as one): **0** striping (speed, no redundancy), **1** mirroring, **2–4** striping with error-correcting codes or a dedicated parity disk, **5** **parity distributed** over all disks (survives one disk failure). Protects against disk failure only, not machine failure.`,
      },
      {
        id: "gfs-design",
        title: "GFS: assumptions and architecture",
        md: `**Assumptions:** commodity hardware that fails often; a modest number of **huge files**; mostly **large streaming reads** and **appends** (few random writes); high sustained throughput matters more than latency.

- **One master** keeps all **metadata in memory**: the namespace, the file → chunk mapping, chunk locations (learned from chunkservers). Changes are recorded in a replicated **operation log** with **checkpoints**.
- Files are split into fixed **64 MB chunks**, each with a 64-bit **chunk handle**, stored as ordinary files on **chunkservers**, **3 replicas** by default.
- **Clients** ask the master only for metadata; **data flows directly between clients and chunkservers** — the master is never a data bottleneck.
- Why large chunks: fewer master interactions, less metadata, persistent connections.`,
      },
      {
        id: "gfs-ops",
        title: "GFS: read, write, record append, consistency, fault tolerance",
        md: `- **Read:** client sends (file name, chunk index) → master returns the chunk handle and replica locations → client reads from the **closest** chunkserver.
- **Write:** the master grants one replica a **lease** (60 s) — the **primary**. The client **pushes the data to all replicas**, then sends the write request to the primary, which chooses a **serial order** and tells the secondaries to apply it in that order; they reply; the primary answers the client. On error the client retries.
- **Record append:** the client gives only the data; GFS appends it **atomically, at least once**, at an offset **GFS chooses**. If the record does not fit in the chunk, the chunk is padded and the client retries on a new chunk (a record is at most ¼ of a chunk). Replicas may contain duplicates and padding.
- **Consistency:** a region is **consistent** if all clients see the same data on all replicas; **defined** if consistent and showing exactly one mutation's write. Concurrent successful writes → consistent but undefined; failed write → inconsistent.
- **Fault tolerance:** master log replication and fast recovery, **chunk version numbers** to detect stale replicas, **checksums** (32-bit per 64 KB block), re-replication, **lazy garbage collection** of deleted files.`,
      },
      {
        id: "hdfs-arch",
        title: "HDFS: goals and architecture",
        md: `**Assumptions and goals:** hardware failure is the norm (detect and recover automatically); **streaming data access** (batch, high throughput, not low latency); **large data sets**; a **simple coherency model: write once, read many**; **"moving computation is cheaper than moving data"**; portability across hardware and software.

- **Master/slave.** One **NameNode**: manages the **file system namespace** (open, close, rename), regulates client access, and holds the **block → DataNode mapping**. Many **DataNodes** (one per node): store the blocks, serve reads and writes, and create, delete and replicate blocks on the NameNode's instruction.
- A file is a sequence of **blocks** (default 64 MB in the document; all but the last the same size). **User data never flows through the NameNode.**
- Traditional hierarchical namespace (directories and files); no hard or soft links; the **replication factor** is per file.`,
      },
      {
        id: "hdfs-replication",
        title: "HDFS: replication, rack awareness, safemode",
        md: `- Each block is replicated (**default factor 3**) for fault tolerance. The NameNode makes all replication decisions and receives from every DataNode a periodic **Heartbeat** (it is alive) and a **Blockreport** (the list of its blocks).
- **Rack-aware placement (factor 3):** one replica on a node in the **local rack**, the second on a **different node in the local rack**, the third on a node in a **different rack**. So a block sits on **two racks**, never all on one rack or one node: a rack failure cannot lose it, and a write crosses racks only once (cheaper than three racks).
- **Replica selection:** a read uses the replica **closest** to the reader (same rack if possible).
- **Safemode:** at start-up the NameNode waits for Blockreports; a block is *safely replicated* when its minimum number of replicas has checked in. After a configurable percentage is safe (plus 30 s) it leaves safemode and replicates the under-replicated blocks. No replication happens during safemode.`,
      },
      {
        id: "hdfs-metadata",
        title: "HDFS: metadata persistence (EditLog, FsImage)",
        md: `- **EditLog:** a transaction log on the NameNode's local disk recording **every change** to the metadata (file created, replication changed…).
- **FsImage:** a file holding the **entire namespace**, the file → block mapping and file-system properties.
- The NameNode keeps the whole image **in memory**. **Checkpoint:** at start-up it reads the FsImage, applies the EditLog, writes a new FsImage and truncates the EditLog. (The Secondary NameNode performs such checkpoints periodically; it is not a hot standby.)
- A DataNode stores each block as a separate local file and does not know about HDFS files; on start-up it scans them and sends the **Blockreport**.
- Communication: TCP/IP; **ClientProtocol** (client ↔ NameNode) and **DataNode Protocol**, over RPC. The NameNode only **responds** to requests, it never initiates them.`,
      },
      {
        id: "hdfs-robustness",
        title: "HDFS: robustness",
        md: `- **DataNode failure / network partition:** no Heartbeat → the NameNode marks the node **dead**, sends it no more I/O, and **re-replicates** the blocks whose replica count fell below the factor.
- **Cluster rebalancing:** moving data from full DataNodes to emptier ones (planned in the document).
- **Data integrity:** the client stores a **checksum** for each block in a hidden file; on read it verifies and, if corrupt, fetches another replica.
- **Metadata disk failure:** FsImage and EditLog are central — the NameNode can keep **multiple synchronised copies**. The NameNode machine is a **single point of failure**; manual intervention is needed if it fails.
- **Snapshots:** not supported in that version (planned).`,
      },
      {
        id: "hdfs-data",
        title: "HDFS: data organisation, writing and deleting",
        md: `- **Blocks:** large (64 MB), because applications write once and read in streams.
- **Staging:** a client first buffers the data in a **temporary local file**. When a block's worth has accumulated it contacts the NameNode, which inserts the file name into the hierarchy and allocates a block and DataNodes. The client flushes the block to the first DataNode. On close, the rest is flushed and the NameNode commits the creation — a file is lost if the NameNode dies before the close.
- **Replication pipelining:** the client sends the block in small portions (4 KB) to the **first DataNode**, which stores each portion and **forwards it to the second**, which forwards to the third — a pipeline.
- **Access:** Java API, a C wrapper, the **FS shell** (e.g. dfs -mkdir, -cat), DFSAdmin commands, and a web browser interface.
- **Deleting:** a deleted file is moved to **/trash** and can be restored while it is there; after a configurable time (6 hours in the document) the NameNode removes it and the blocks are freed. **Lowering the replication factor** makes the NameNode pick excess replicas to delete.`,
      },
    ],
  },
  {
    id: "nosql",
    lectures: "Lecture 10",
    title: "NoSQL",
    links: [{ slug: "nosql", label: "Lecture 10" }],
    official: "From NoSQL Distilled: Chapters 1, 2, 3 and 5.",
    items: [
      {
        id: "why-nosql",
        title: "Chapter 1 – Why NoSQL",
        md: `- **Value of relational databases:** persistent data, **concurrency** control through **transactions**, **integration** (many applications sharing one database), and a (mostly) standard model and SQL.
- **Impedance mismatch:** the relational model (flat tuples in tables) differs from in-memory data structures (nested objects), forcing translation; ORMs help but do not remove it.
- **Integration database** (shared by many applications — complex, hard to change) versus **application database** (owned by one application; others integrate through **services**), which frees the team to choose another kind of store.
- **Attack of the clusters:** the web's data volumes need **scaling out** on clusters of commodity machines (cheaper and more resilient than scaling up). Relational databases are **not designed for clusters**. Google **Bigtable** and Amazon **Dynamo** showed the alternative.
- **NoSQL:** no strict definition. Common characteristics: **not relational, run well on clusters, open source, built for 21st-century web estates, schemaless**.
- **Polyglot persistence:** use different stores for different needs. Two reasons to choose NoSQL: data too big for one machine / performance, and **easier development** (less impedance mismatch).`,
      },
      {
        id: "aggregates",
        title: "Chapter 2 – Aggregate data models",
        md: `- A **data model** is how we perceive and manipulate data (the storage model is how it is stored).
- **Aggregate:** a collection of related objects treated as **one unit** — for manipulation, for **consistency / atomic updates**, and for **distribution** on a cluster (the whole aggregate lives on one node). Example: an order with its line items, addresses and payment.
- The boundaries depend on **how the data is accessed**; there is no single right answer. Aggregates help some queries (get the order) and hurt others (sales per product across all orders).
- Aggregate-oriented stores have **no ACID transactions across aggregates** — only atomic operations on one aggregate. Relational and graph databases are **aggregate-ignorant**.

| Model | The aggregate is… | Access | Examples |
|---|---|---|---|
| **Key-value** | an **opaque** blob | only by key | Riak, Redis, Dynamo |
| **Document** | a document whose **structure is visible** | by key, **queries on fields**, indexes, partial retrieval | MongoDB, CouchDB |
| **Column-family** | a row key → **column families** → columns (a two-level map) | by row key and column; rows may have different columns | Bigtable, HBase, Cassandra |`,
      },
      {
        id: "more-models",
        title: "Chapter 3 – More details on data models",
        md: `- **Relationships:** aggregates reference each other by **id**; the database may know about the links, but updating several aggregates is **not atomic**. Many inter-aggregate relationships make aggregate stores awkward.
- **Graph databases:** small records with **complex interconnections** — nodes and edges with properties. Queries traverse edges; traversal is cheap because the work moves from query time to **insert time**. Usually run on one server, **ACID**. Opposite of aggregates.
- **Schemaless databases:** store data without defining a schema first — easy to change, handles non-uniform data. But there is always an **implicit schema** in the code that reads the data; the database cannot validate or optimise with it, and several applications may disagree.
- **Materialized views:** precomputed, cached results for queries that cut across aggregates; updated **eagerly** (with the base data) or in **batch** — often computed with map-reduce.
- **Modeling for data access:** design aggregates (and column families) for the **queries** you need; denormalise at write time.`,
      },
      {
        id: "consistency",
        title: "Chapter 5 – Update and read consistency",
        md: `- **Write-write conflict:** two clients update the same item at once → a **lost update**. **Pessimistic** approach: prevent it with **locks** (safe but can deadlock, less responsive). **Optimistic:** detect it — a **conditional update** (check that the version is unchanged) or keep both and **merge**.
- **Read-write conflict (inconsistent read):** a client reads in the middle of another's multi-step update → loss of **logical consistency**. Aggregate stores guarantee it only **within one aggregate**; across aggregates there is an **inconsistency window**.
- **Replication consistency:** all replicas return the same value. **Eventual consistency:** replicas may differ for a while (stale data) but converge when updates stop.
- **Read-your-writes / session consistency:** you always see your own updates — via **sticky sessions** or **version stamps**.`,
      },
      {
        id: "cap-durability-quorums",
        title: "Chapter 5 – CAP, relaxing durability, quorums",
        md: `- **CAP theorem:** of **Consistency**, **Availability** and **Partition tolerance** you can have only two. A single server is CA. A cluster must tolerate partitions, so: **when a partition happens, choose consistency or availability** — and it is a trade-off, not binary. Often it is really **consistency versus latency**.
- Examples: hotel booking across two sites (refuse bookings, or risk a double booking); Dynamo's **shopping cart** is always writable and conflicting carts are **merged**.
- **BASE:** Basically Available, Soft state, Eventual consistency — the counterpart of ACID.
- **Relaxing durability:** keep data in memory and flush periodically — faster, but a crash loses the latest updates (fine for session state). **Replication durability** fails if a node acknowledges a write and dies before replicating it.
- **Quorums** (N = replication factor): **write quorum W > N/2** prevents conflicting writes; **R + W > N** gives strongly consistent reads. N = 3, W = 2, R = 2 is typical; W = 3, R = 1 for fast reads; W = 1 needs R = 3.`,
      },
    ],
  },
  {
    id: "graph",
    lectures: "Lecture 11",
    title: "Graph data management",
    links: [{ slug: "graph-databases", label: "Lecture 11" }],
    official:
      "Know the Cypher query language (the features mentioned on the slides, no extra features) and the concepts on the slides. They are described in: Chapter 3 (Data Modelling) of Graph Databases for Cypher; Chapter 6 for the internals of graph databases; and, for how Neo4j achieves load balancing, the two-page Load Balancing section of Chapter 4 and the High Availability section of Seven Databases in Seven Weeks.",
    items: [
      {
        id: "graph-basics",
        title: "Slide concepts: why graphs, property graph, graph DB versus analytics",
        md: `- **Why graphs:** humans think in graphs; graphs capture **heterogeneous** data with **no fixed schema**, show how parts connect, and are **hard to model with relational joins**. Examples: social, media, information (citation), transportation and communication networks.
- **Property graph model:** **nodes** (objects; can have **labels**), **relationships** (connect two nodes; have a **type** and a **direction**), **properties** (name–value pairs on nodes **and** relationships).
- **Graph database versus graph analytics:** a graph DB (Neo4j) is for **storage** and querying (like an RDBMS for tuples) — e.g. find friends of friends. Graph analytics **processes** the graph (k-core, centrality, PageRank) — like clustering for ordinary data.
- **Storing graphs with relational technology** means many self-joins for path queries.
- **Neo4j:** **whiteboard friendly** (store what you draw; values and structure only where needed), focuses on relationships, scales to tens of billions of nodes with master-slave replication. Accessed via Java, REST (JSON), **Cypher**, **Gremlin**; **Lucene**-based indexing.`,
      },
      {
        id: "cypher-read",
        title: "Cypher: reading (MATCH, WHERE, RETURN)",
        md: `Cypher is **declarative, expressive, pattern matching** — you draw the pattern in ASCII art.

- Node: **(n)**, with label **(n:Person)**, with property **(p:Person {name: "Tom Hanks"})** (inline = exact match only).
- Relationship: **-[:ACTED_IN]->** directed, **--** / **-->** any type, **-[r:TYPE]->** bound to r.
- All nodes: MATCH (n) RETURN n
- Filter: MATCH (m:Movie) WHERE m.released > 1990 AND m.released < 2000 RETURN m
- Pattern: MATCH (:Person {name:"Tom Hanks"})-[:ACTED_IN]->(m:Movie) RETURN m.title
- Order: … RETURN m.title, m.released ORDER BY m.released DESC
- Co-actors: MATCH (:Person {name:"Tom Hanks"})-->(:Movie)<-[:ACTED_IN]-(x:Person) RETURN x.name
- **Chapter 3 extras:** several patterns separated by commas sharing identifiers; **variable-length** paths -[:T*1..4]-; alternatives -[:STREET|CITY*1..2]-; **anonymous** node (); **DISTINCT**; **count(x)**, **collect(x)**; **AS** alias; a path p = (…)-[…]-(…) with **length(p)**; **WITH** pipes one query part into the next.
- A query is **anchored** on nodes found by label + property; the rest of the pattern is matched around them.`,
      },
      {
        id: "cypher-write",
        title: "Cypher: writing (CREATE, MERGE, SET, DELETE)",
        md: `- Node: CREATE (p:Person {name:"Tom Hanks"})
- Relationship between existing nodes: MATCH (p:Person {name:"Tom Hanks"}), (m:Movie {title:"Apollo 13"}) CREATE (p)-[:ACTED_IN]->(m)
- Whole pattern at once: CREATE (:Person {name:"Tom Hanks"})-[:ACTED_IN]->(:Movie {title:"Apollo 13"})
- **CREATE always adds** (duplicates possible); **MERGE** creates only what is missing.
- **SET** r.rating = 97 sets a property (also on a relationship); **DELETE** removes — a node can be deleted only after its relationships.
- Other clauses named in Chapter 3: FOREACH, UNION, CREATE UNIQUE, START (deprecated).
- **Indexes and constraints:** CREATE INDEX ON :Venue(name); CREATE CONSTRAINT ON (c:Country) ASSERT c.name IS UNIQUE. Indexes find the **starting nodes**; the rest is traversal.`,
      },
      {
        id: "modelling",
        title: "Data modelling with graphs (Chapter 3)",
        md: `- **Relational modelling:** whiteboard → E-R diagram → normalised tables with foreign keys and **join tables** (accidental complexity) → **denormalisation** for speed → slow, risky **migrations**.
- **Graph modelling:** the whiteboard sketch **is** the model; enrich it: **roles → labels**, **attributes → properties**, **connections → named, directed relationships**. No normalisation or denormalisation.
- **Test the model:** (1) it **reads well** as sentences when you follow relationships; (2) **design for queryability** — write the queries of your use cases.
- **Identify elements from language:** **common nouns → labels**, **verbs with an object → relationship types**, **proper nouns → nodes** with properties.
- **Pitfall:** do **not encode an entity in a relationship**. (bob)-[:EMAILED]->(charlie) loses the email; make **Email** a node with SENT, TO, CC, BCC. Replies and forwards are nodes too (labels Email + Reply, linked by REPLY_TO).
- **Cross-domain models:** several domains live in one graph, connected by relationships. **Evolution** is additive: new nodes and relationship types do not break existing queries.`,
      },
      {
        id: "internals",
        title: "Graph database internals (Chapter 6)",
        md: `- **Native graph processing = index-free adjacency:** every node holds **direct references to its relationships**, so a hop costs **O(1)**. A traversal of m relationships costs **O(m)** instead of **O(m log n)** with a global index. Both directions are equally cheap; joins are effectively **precomputed**. Query time depends on the part of the graph visited, not its total size.
- **Native graph storage:** separate **store files** for nodes, relationships, labels and properties. Node and relationship records are **fixed size**, so a record is found at **id × record size** (O(1)).
  - **Node record:** in-use flag, id of first relationship, id of first property, labels, flags.
  - **Relationship record:** start node, end node, type, **previous / next relationship for the start node and for the end node** (two **doubly linked lists**), first property.
  - **Properties:** a singly linked list of records with key–value pairs (small values inlined, large ones in dynamic stores).
- **Cache:** an LRU-style page cache keeps hot parts of the store files in memory.
- **APIs** (high → low level): **Cypher** (declarative), **Traversal framework**, **Core API** (imperative), Kernel API.
- **Transactions:** Neo4j is **ACID**. A transaction is an in-memory object with **locks** on what it writes; on commit the changes go to the **write-ahead log** (durable once flushed), then to the store. Recovery replays the log.
- **Scale:** **capacity** (tens of billions of nodes/relationships), **latency** (traversal cost independent of size), **throughput** (queries touch a local subgraph).`,
      },
      {
        id: "ha-load-balancing",
        title: "High availability and load balancing",
        md: `**High availability (Seven Databases):**
- A **master-slave cluster**; **every instance holds the full graph**. The master is **elected** automatically (formerly via **ZooKeeper** coordinators; now self-coordinating). A returning old master rejoins as a slave.
- Writes go to the master and are pushed to the slaves. **Slaves also accept writes**: the slave synchronises with the master, which propagates to the others.
- A write on one node is **not immediately on all others** → the cluster is **eventually consistent** (AP in CAP) and loses pure ACID. HA mainly **scales reads**.
- **Weakness:** it replicates the **whole graph**, not subgraphs — graphs cannot easily be sharded.

**Load balancing (Graph Databases, Chapter 4)** — Neo4j has **no built-in load balancer**; use the network's:
1. **Separate reads from writes:** writes → the **master**; reads → **balanced over the whole cluster**. Distinguish by HTTP method (GET vs POST/PUT/DELETE); since the REST API sends all Cypher by POST, use **two load balancers** (a write one and a read one) and let the application choose.
2. **Cache sharding:** route requests for the same part of the graph (same user, same region) to the **same instance**, so that part is already in its memory cache. Works because queries are graph-local; all instances still hold all data.
3. **Read your own writes:** route the write **through the slave** that will serve the user's next read (slower — use sparingly).`,
      },
    ],
  },
  {
    id: "vector",
    lectures: "Lecture 12",
    title: "Vector databases",
    links: [{ slug: "vector-databases", label: "Lecture 12" }],
    official:
      "Know what vector databases are, what kind of queries they serve and what applications they may have. The slides are the guide to the concepts; know what each one is.",
    items: [
      {
        id: "vdb-what",
        title: "What a vector database is and how it works",
        md: `- Stores **multidimensional points (vectors)**, not scalar values; from a few to **several thousand dimensions**.
- Purpose: **swiftly and precisely locate and retrieve vectors by proximity / resemblance** — **semantic relevance** instead of exact match (similar songs, articles, gadgets).
- **How:** traditional databases use tables, nodes or documents; vector databases use vectors and search with **Approximate Nearest Neighbour (ANN)** search.
- **Embeddings:** an image, text or audio item is turned into a vector (a "code") that is a **summary capturing its main points**, produced by a neural network. Similar items get nearby vectors.`,
      },
      {
        id: "vdb-applications",
        title: "Applications",
        md: `1. **Retail experience** — recommendations from similar products and behaviour.
2. **Financial data analysis** — spotting patterns and similarities in market data.
3. **Healthcare** — comparing genomic data for personalised treatment.
4. **NLP applications** — chatbots, virtual assistants, retrieval for language models.
5. **Media analysis** — comparing images and video (medical scans, surveillance).
6. **Anomaly detection** — items far from everything else (fraud, security).`,
      },
      {
        id: "vdb-challenges",
        title: "Challenges and features",
        md: `**Why they differ from relational / NoSQL systems:**
- similarity is **vague** compared to exact match;
- similarity is **more expensive** to compute than exact match;
- vectors are **large** and may span many pages;
- vectors have **no properties** (attributes to sort or index on) like tuples or nodes;
- vectors and **other forms of data must co-exist**.

**Features of a vector database:** scalability and adaptability; multi-user support and privacy; an API; a GUI.`,
      },
      {
        id: "vdb-queries",
        title: "Queries they serve",
        md: `- **Score design** — how similarity is measured: **basic** (cosine, inner product, Euclidean, Hamming), **combined** (several scores merged, e.g. mean or weighted sum), **learned** (metric learning). **Score selection** = learning / choosing the best score for a task.
- **Query types:** **k-NN** (the k nearest vectors, exact) and **ANN** (approximately nearest — faster).
- **Basic search query — (c, k)-search:** find the **k most similar vectors**, none of which is more than **c times worse than the best**. No slack = exact k-NN; with slack = ANN. (A **range** query returns everything within a threshold.)
- **Query variants:** **hybrid** (similarity **plus** a condition on attributes, e.g. price < 100) and **multi-vector** (several vectors per query or item, combined with an aggregate score).
- **Data manipulation** (the embedding model): **embedded in the database** or **as a plug-in**.`,
      },
      {
        id: "vdb-indexing",
        title: "Indexing",
        md: `- **Table-based:**
  - **LSH** (locality-sensitive hashing) — similar vectors hash to the same bucket;
  - **L2H** (learning to hash) — the hash function is learned with machine learning;
  - **Quantization** — map vectors to **smaller vectors** (compression).
- **Tree-based:** **recursively partition** the vectors to build a search tree.
- **Graph-based:**
  - **k-nearest-neighbour graphs (KNNG)** — edges represent close similarity;
  - **monotonic search networks (MSN)** and **small-world graphs (SWG)** — edges chosen to make the graph **easy to navigate**.`,
      },
      {
        id: "vdb-systems",
        title: "Existing systems",
        md: `| Kind | Example |
|---|---|
| Mostly vector (native) | **Chroma** |
| Mostly mixed | **Milvus** |
| NoSQL with vectors | **Cassandra** |
| Relational with vectors | **PostgreSQL** |

**Popular:** Chroma (open source), Pinecone, Weaviate (open source), Faiss (open source library), Qdrant, **Milvus** (open source; **distributed architecture, millions of vectors, high-speed similarity search**), **pgvector** (an **extension of PostgreSQL**, for **smaller scale**).`,
      },
    ],
  },
];

export const expectedItemCount = expectedTopics.reduce((sum, topic) => sum + topic.items.length, 0);

export function expectedKey(topicId: string, itemId: string) {
  return `${topicId}/${itemId}`;
}
