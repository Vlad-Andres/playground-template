import type { Block, SectionBlocks } from "@/content/types";
import { lecture01Meta, lecture01Outline } from "./meta";
import { BPlusTreeLab } from "./interactive/BPlusTreeLab";
import { ExtendibleHashingLab } from "./interactive/ExtendibleHashingLab";
import { HashSpreadLab } from "./interactive/HashSpreadLab";

const objectives: Block[] = [
  {
    kind: "prose",
    md: "The first lecture has two halves. The introduction sets out the course — goals, literature, assessment, plan — and place data-intensive systems in the landscape of big data, data science and AI. The second half is a refresher the rest of the course depends on: §1.3 of *Mining of Massive Datasets* up to §1.3.4, and the hash and B+ tree indexes from the database textbook.",
  },
  { kind: "list", variant: "objectives", items: lecture01Meta.objectives },
];

const course: Block[] = [
  {
    kind: "prose",
    md: "The course is taught by **Prof. Yannis Velegrakis**, who heads the Data Intensive Systems group at Utrecht University; announcements go through Brightspace, where all course content lives. This first lecture covers four things: introductions, the course goals, an understanding of the concepts *data analysis*, *big data*, *data science* and *data-intensive systems*, and the background principles later lectures rely on.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "How to use this site",
    md: "Each lecture page covers **what** you are expected to know, at the level of **detail** the course description asks for from the book chapters and papers. Work through the sections in order, answer the memory cards and practice questions at the end of each section, and finish with the quiz.",
  },
  {
    kind: "table",
    headers: ["Component", "Weight", "What it is"],
    rows: [
      ["Final test", "40%", "Multiple choice or short answers."],
      [
        "Project",
        "60%",
        "Generate a data-processing task that is computationally intensive, then find ways to make it more efficient with distributed techniques and NoSQL technologies. The topic is the same for everyone; 10 of the 60 points come from the presentation.",
      ],
    ],
    caption: "Data Intensive Systems — student assessment.",
  },
  {
    kind: "prose",
    md: "The course is organised as a **guided tour** of important trends and technologies combined with a **deep dive** into selected must-know algorithms, techniques and technologies. Its learning outcomes introduce you to modern systems designed to scale **up** and **out**:\n\n- the systems for managing big data, and how to use them — where big data comes from, and the data management pipeline of acquisition, preparation, analysis and presentation;\n- developing large MapReduce and Spark programs, and using MLlib for applications that must scale;\n- knowing the different NoSQL solutions and picking the right one for each scenario;\n- building applications and systems, and understanding the technologies modern data-intensive systems are built on;\n- evaluating applications in terms of time (scale-up), and using the available technologies to scale out.",
  },
  {
    kind: "table",
    headers: ["You will", "Though"],
    rows: [
      ["not emerge an expert in statistics", "you will apply basic statistical methods — take a statistics course for depth"],
      ["not emerge an expert in machine learning", "you will meet important concepts and exercise them — take a dedicated ML course for depth"],
      ["get a good knowledge of different NoSQL databases", "you will understand the concepts they share and know how to apply them"],
      ["get a good knowledge of MapReduce, Spark and data-management concepts", "you will use all of these in the project"],
    ],
    caption: "What to expect — and not to expect — from this course.",
  },
  {
    kind: "table",
    headers: ["Book", "Authors"],
    rows: [
      ["Architecture of a Database System", "Hellerstein, Stonebraker & Hamilton"],
      ["Seven Databases in Seven Weeks", "Redmond & Wilson"],
      ["Designing Data-Intensive Applications", "Kleppmann"],
      ["High Performance Spark", "Karau & Warren"],
      ["Mining of Massive Datasets (3rd edition)", "Leskovec, Rajaraman & Ullman"],
      ["Graph Databases (2nd edition)", "Robinson, Webber & Eifrem"],
      ["Graph Algorithms", "Needham & Hodler"],
    ],
    caption: "Literature shown in the introduction. Mining of Massive Datasets is the textbook for several lectures.",
  },
  {
    kind: "timeline",
    items: [
      { label: "Lecture 1", title: "Introduction & indexes", md: "Goals, literature, assessment and planning; hash and B+ tree indexes; MMDS §1.3 up to §1.3.4." },
      { label: "Lecture 2", title: "Finding Similar Items at Scale — Part 1", md: "Entity resolution: what it is, why we need it, at which levels it occurs, and the distance metrics used to decide it." },
      { label: "Lecture 3", title: "Distributed Databases", md: "Guest lecture by Prof. Dr. Maximilian E. Schüle (Universität Bamberg): fragmentation, sharding, replication, quorums, two-phase commit, distributed joins, Greenplum and MemSQL. Practical exercise sheet." },
      { label: "Lecture 4", title: "In-Database Machine Learning", md: "Also by Prof. Schüle: running machine learning where the data is stored, and why that pays off." },
      { label: "Lecture 5", title: "Finding Similar Items at Scale — Part 2", md: "Same study material as Part 1: shingling documents into sets and compressing them with minhashing." },
      { label: "Lecture 6", title: "Finding Similar Items at Scale — Part 3", md: "Same study material: locality-sensitive hashing and entity resolution at scale." },
      { label: "Lecture 7", title: "MapReduce", md: "MMDS chapter 2: the model, and MapReduce algorithms for inverted indexes, matrix multiplication and joins." },
      { label: "Lecture 8", title: "Introduction to Apache Spark", md: "Spark versus Hadoop MapReduce, how Spark operates, RDDs and DataFrames." },
      { label: "Lecture 9", title: "Distributed File Systems", md: "The Google File System and the Hadoop Distributed File System." },
      { label: "Lecture 10", title: "NoSQL", md: "NoSQL Distilled: why NoSQL, aggregates, key-value, document and column-family stores, consistency, CAP in practice and quorums." },
      { label: "Lecture 11", title: "Graph Data Management", md: "Property graphs and RDF, relational storage of graphs, Neo4j with Cypher and Gremlin, data modelling with graphs, native graph internals, high availability and load balancing." },
      { label: "Lecture 12", title: "Vector Databases", md: "What vector databases store, the similarity queries they answer, their indexes, existing systems and applications." },
      { label: "Exam", title: "Final test", md: "On Remindo, on premises, around 2 hours, no material allowed: multiple choice and short open answers, some in pseudocode. A theory part and a part on the practical assignment. The Exam training page prepares for it." },
    ],
  },
  {
    kind: "info",
    variant: "note",
    title: "Assumed from your bachelor course",
    md: "Relational algebra, the entity-relationship model and SQL are **not** material of this course, but many lectures depend on them. Lecture 3 opens with a short refresher of the parts it needs.",
  },
  {
    kind: "recall",
    cards: [
      { prompt: "How are the 100 points of the course split?", answer: "Final test 40% (multiple choice or short answers); project 60%, of which 10 points come from the presentation." },
      { prompt: "What is the project about?", answer: "A computationally intensive data-processing task that you make more efficient with distributed techniques and NoSQL technologies. Everyone gets the same topic." },
      { prompt: "Which two styles does the course combine?", answer: "A guided tour of important trends and technologies, and a deep dive into selected must-know algorithms, techniques and technologies." },
    ],
  },
];

const bigData: Block[] = [
  {
    kind: "prose",
    md: "*Data is the new gold.* Banking and securities, insurance, transportation, education, manufacturing, energy and utilities, healthcare, media and entertainment all run on large data — and exploiting it makes possible:",
  },
  {
    kind: "table",
    headers: ["Domain", "Opportunity"],
    rows: [
      ["Education", "Correlate academic effectiveness with various factors"],
      ["Healthcare", "Preventive and personalised care"],
      ["Urban planning", "Fusion of high-fidelity geographical data"],
      ["Intelligent transportation", "Analysis and visualisation of live, detailed road-network data"],
      ["Environmental modelling", "Sensor networks"],
      ["Energy saving", "Unveiling patterns of use"],
      ["Financial systemic risk", "Analyse contracts and relationships among entities"],
      ["Security", "Social networks, financial transactions, transportation"],
      ["Computer security", "Log information, data transfers and transactions"],
      ["Democracy", "Citizens understand how the government operates"],
    ],
    caption: "Opportunities for data exploitation.",
  },
  {
    kind: "timeline",
    items: [
      { label: "Data", title: "Employees and data engineers", md: "Organisations record their own operations — the classic database world." },
      { label: "More data", title: "Internet users", md: "Users become data producers: Facebook, Twitter, eBay, LinkedIn, TikTok, YouTube." },
      { label: "Big data", title: "Machine-generated data", md: "Click-logs, product scanning, sensors, cellphones, infection tracing, network traffic monitors — no human in the loop, so no natural limit on volume." },
    ],
  },
  {
    kind: "prose",
    md: "The *Internet minute* infographics make the volume concrete: in every 60 seconds there are millions of searches, messages, video views and app downloads, and every year's figures exceed the last. Global data generated annually has grown from a couple of zettabytes in 2010 to an estimated **200 ZB for 2025**.",
  },
  {
    kind: "table",
    headers: ["1 zettabyte (ZB) =", "Value"],
    rows: [
      ["bytes", "10²¹"],
      ["exabytes (EB)", "1,000"],
      ["petabytes (PB)", "1,000,000"],
      ["terabytes (TB)", "1 billion"],
    ],
    caption: "200 ZB is roughly 1,800 iPhones' worth of storage for every person on earth.",
  },
  {
    kind: "info",
    variant: "note",
    title: "Checking the streaming claim",
    md: "A popular claim says streaming 1 ZB nonstop over a 100 Mbps connection would take about 285 million years. The arithmetic gives $8 \\times 10^{21}$ bits $/ 10^8$ bits/s $= 8 \\times 10^{13}$ s, about **2.5 million years** at 100 Mbps; 285 million years corresponds to roughly a 1 Mbps line. Either way: no single machine can even read this data, let alone process it.",
  },
  {
    kind: "prose",
    md: "Why is so much stored? The **catalyst** is cost: storage prices keep going down, at the core (data centres), at the edge and at the endpoints. *We became greedy and started to store everything* — and **we do not need to do so**. The consequence is visible in space consumption: demand for data-centre capacity could more than triple by 2030, and storage demand is outpacing supply. *It seems that we are already running out of (storage) space.*",
  },
  {
    kind: "recall",
    cards: [
      { prompt: "What are the three successive sources of data, and which one makes data *big*?", answer: "Employees and data engineers, then internet users, then machine-generated data (click-logs, sensors, cellphones, network monitors…). Machine-generated data makes it big." },
      { prompt: "How many bytes is a zettabyte, and how much data is estimated for 2025?", answer: "$10^{21}$ bytes; about 200 ZB of data in total by 2025." },
      { prompt: "What is the catalyst for the large volume of stored data?", answer: "Storage costs keep going down, so we became greedy and store everything — although we do not need to." },
    ],
  },
];

const dataScience: Block[] = [
  {
    kind: "prose",
    md: "What do data scientists do? *“They need to find nuggets of truth in data and then explain it to the business leaders”* (Richard Snee, EMC). Mike Driscoll's **three sexy skills of data geeks** spell out what that takes:\n\n1. **Manage the data** — store, query, maintain, transform, parse, scrape and format it. This needs computing skills.\n2. **Analyse** it — this needs mathematical skills.\n3. **Present** the analysis results.",
  },
  {
    kind: "table",
    headers: ["Overlap in Drew Conway's Venn diagram", "Result"],
    rows: [
      ["Hacking skills ∩ math & statistics knowledge", "Machine learning"],
      ["Math & statistics ∩ substantive expertise", "Traditional research"],
      ["Hacking skills ∩ substantive expertise (no math)", "The danger zone"],
      ["All three", "Data science"],
    ],
    caption: "The DBA and software engineer start from hacking skills, the statistician from math, the business analyst from expertise. This course sits at the centre.",
  },
  {
    kind: "prose",
    md: "Picture it as nested circles: **AI** contains **machine learning**, which contains **big data**, at whose core sit **data-intensive systems**. Data systems are in the middle of all this — they provide the infrastructure, data management and algorithms that let machine learning and AI work at scale.",
  },
  {
    kind: "table",
    headers: ["Area", "What it does", "Examples"],
    rows: [
      [
        "Data-intensive systems",
        "Manage, store, process and analyse massive amounts of data efficiently and reliably: distributed storage and computing, ingestion, curation and querying, big-data analytics, data management and integration, scalable infrastructure.",
        "HDFS, Spark, NoSQL, vector databases, data pipelines, stream processing",
      ],
      [
        "Machine learning",
        "Learns patterns from data to make predictions or decisions: statistical and optimisation methods, deep learning, model training and evaluation, scalable ML algorithms.",
        "Classification, regression, recommendation, embeddings",
      ],
      [
        "AI",
        "Builds intelligent behaviour by combining machine learning with reasoning, knowledge, planning, natural-language processing and multi-agent systems.",
        "LLMs, RAG + LLM agents, robotics, autonomous systems",
      ],
    ],
    caption: "How data-intensive systems, machine learning and AI are connected. Their overlap is data-driven ML/AI systems at scale.",
  },
  {
    kind: "steps",
    title: "What companies think AI looks like — and what it actually is",
    intro: "The naive picture is three boxes: **Data → AI → Value**. Each box hides a pipeline of its own.",
    steps: [
      { title: "Data", md: "Selection, sourcing and synthesis of the data to use." },
      { title: "AI — data engineering", md: "Exploration, cleaning, normalising, feature engineering and scaling. This is where most of the effort goes." },
      { title: "AI — modelling", md: "Model selection, training, evaluation and tuning." },
      { title: "Value", md: "Registration, deployment, monitoring and retraining of the model." },
      { title: "Constraints around everything", md: "Legal, ethical and transparency, historical bias, and security constraints apply to every step." },
    ],
  },
  {
    kind: "timeline",
    items: [
      { label: "1", title: "Acquisition & storage", md: "Collect the data and keep it somewhere it can be processed." },
      { label: "2", title: "Cleaning, annotation, integration, aggregation", md: "Turn unruly raw data into something consistent and combined." },
      { label: "3", title: "Exploration & querying", md: "Look at the data, ask it questions." },
      { label: "4", title: "Modelling & data analysis", md: "Only now does the analysis everybody talks about begin." },
    ],
  },
  {
    kind: "info",
    variant: "insight",
    title: "Where the time goes",
    md: "Data scientists, according to interviews and expert estimates, spend **50% to 80%** of their time mired in the mundane labour of collecting and preparing unruly digital data before it can be explored for useful nuggets (*New York Times*). The first stages of the pipeline are exactly the territory of data-intensive systems.",
  },
  { kind: "concepts", ids: ["data-intensive-system", "data-sources", "data-pipeline"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Name Mike Driscoll's three skills of data geeks.", answer: "Manage the data (computing skills), analyse it (math skills), present the analysis results." },
      { prompt: "In Conway's Venn diagram, what is hacking skills plus substantive expertise without math?", answer: "The danger zone." },
      { prompt: "List the four stages of the data processing pipeline.", answer: "Acquisition & storage → cleaning, annotation, integration, aggregation → exploration & querying → modelling & data analysis." },
      { prompt: "What hides behind the box *AI* in Data → AI → Value?", answer: "Data engineering (exploration, cleaning, normalising, features, scaling) and modelling (model selection, training, evaluation, tuning) — under legal, ethical, bias and security constraints." },
    ],
  },
];

const background: Block[] = [
  {
    kind: "prose",
    md: "Every database is built on a **data model**, which has three components:\n\n1. **Structures** — how data is organised (relations, documents, key-value pairs, graphs…).\n2. **Constraints** — the rules data must satisfy (keys, foreign keys, domains…).\n3. **Operations** — what you can do with it (relational algebra and SQL, document queries, graph traversals…).\n\nDifferent families of databases make different choices for each component.",
  },
  {
    kind: "table",
    headers: ["Type", "Stores data as", "Examples"],
    rows: [
      ["Relational", "Tables with predefined schemas and relationships between them", "Oracle, MySQL, PostgreSQL, SQL Server"],
      ["Document", "Documents, often in JSON or BSON format", "MongoDB, CouchDB"],
      ["Key-value", "Key-value pairs for fast retrieval", "Redis"],
      ["Columnar", "Columns instead of rows, for analytical queries", "Cassandra, HBase"],
      ["Graph", "Graphs, managing entities and their relationships", "Neo4j"],
      ["Time series", "Timestamped or time-series data, optimised for it", "InfluxDB, TimescaleDB, Prometheus"],
      ["Object-oriented", "Objects, as used in object-oriented programming", "ObjectStore"],
      ["In-memory", "Data kept primarily in memory for fast retrieval", "DuckDB, Memcached"],
      ["Vector", "High-dimensional vectors, stored, indexed and searched efficiently", "Pinecone, Milvus"],
    ],
    caption: "Nine database types you must know. Relational databases bring structured data, SQL, transactions with ACID, indexing and optimisation; NoSQL systems add distributed architectures and new data models, and NewSQL tries to combine both.",
  },
  {
    kind: "prose",
    md: "Relational systems guarantee **ACID** transactions:",
  },
  {
    kind: "table",
    headers: ["Property", "Meaning"],
    rows: [
      ["Atomic", "Each transaction is either properly carried out, or the process halts and the database reverts to the state before the transaction started — so all data in the database is valid."],
      ["Consistent", "A processed transaction will never endanger the structural integrity of the database."],
      ["Isolated", "Transactions cannot compromise the integrity of other transactions by interacting with them while they are still in progress."],
      ["Durable", "The data of a completed transaction persists even through network or power outages; a failed transaction does not affect the data."],
    ],
  },
  {
    kind: "info",
    variant: "note",
    title: "“No indexes, please — I'm allergic to them”",
    md: "A well-known comic sums up the background: a query with one SELECT on a very big table, eight joins, five subqueries and a GROUP BY, sent to MySQL without indexes — and its author is still waiting at the counter long after everyone else. The rest of this lecture is about the indexes that would have saved them.",
  },
  { kind: "concepts", ids: ["data-model", "acid"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What are the three components of a data model?", answer: "Structures, constraints and operations." },
      { prompt: "Expand ACID and give the one-line meaning of each letter.", answer: "Atomic (all or nothing), Consistent (never breaks integrity), Isolated (in-progress transactions don't interfere), Durable (committed data survives outages)." },
      { prompt: "Name four of the nine database types and an example of each.", answer: "E.g. document (MongoDB), key-value (Redis), columnar (Cassandra), graph (Neo4j), time series (InfluxDB), vector (Pinecone), in-memory (DuckDB), relational (PostgreSQL), object-oriented (ObjectStore)." },
    ],
  },
];

const tfIdf: Block[] = [
  {
    kind: "prose",
    md: "Many data-mining tasks categorise documents by topic, and topics are recognised by the special words that characterise them — *ball*, *bat*, *pitch*, *run* for baseball. The obvious guess, that a document's most frequent words matter most, is exactly wrong: those are **stop words** such as *the* and *and*, usually removed before classification.\n\nThe indicators are relatively **rare** words — but not every rare word. *Notwithstanding* and *albeit* are rare and tell you nothing; *chukker* is just as rare and tips you off that the document is about polo. The difference is **concentration**: a useful word, once it appears, tends to appear repeatedly (the first chukker, the second chukker…).",
  },
  {
    kind: "formula",
    tex: "TF_{ij} = \\frac{f_{ij}}{\\max_k f_{kj}} \\qquad IDF_i = \\log_2 \\frac{N}{n_i} \\qquad \\text{score}_{ij} = TF_{ij} \\times IDF_i",
    caption: "fᵢⱼ is the number of occurrences of term i in document j; term i appears in nᵢ of the N documents.",
  },
  {
    kind: "steps",
    title: "MMDS Example 1.4",
    intro: "A repository of $N = 2^{20} = 1{,}048{,}576$ documents; word $w$ appears in $2^{10} = 1024$ of them.",
    steps: [
      { title: "Inverse document frequency", md: "$IDF_w = \\log_2(2^{20} / 2^{10}) = \\log_2 2^{10} = 10$." },
      { title: "A document where w dominates", md: "In document $j$, $w$ appears 20 times and no word appears more often, so $TF_{wj} = 20/20 = 1$ and the score is $1 \\times 10 = 10$." },
      { title: "A document where w is incidental", md: "In document $k$, $w$ appears once while the most frequent word appears 20 times: $TF_{wk} = 1/20$, score $= 10/20 = 1/2$." },
    ],
  },
  { kind: "concepts", ids: ["tf-idf"] },
  {
    kind: "practice",
    id: "l1-tf-idf",
    tasks: [
      {
        id: "idf-40",
        prompt: "A repository holds ten million documents. What is the IDF of a word that appears in **40** of them, to the nearest integer?",
        check: { mode: "text", accept: ["18"], placeholder: "IDF" },
        solution: "$\\log_2(10^7 / 40) = \\log_2 250{,}000 \\approx 17.93$, so **18**.",
      },
      {
        id: "idf-10000",
        prompt: "Same repository: what is the IDF of a word that appears in **10,000** documents?",
        check: { mode: "text", accept: ["10"], placeholder: "IDF" },
        solution: "$\\log_2(10^7 / 10^4) = \\log_2 1000 \\approx 9.97$, so **10**.",
      },
      {
        id: "tf-idf-five",
        prompt:
          "Ten million documents; word $w$ appears in 320 of them. In document $d$ the most frequent word occurs 15 times and $w$ occurs **5** times. Approximately what is the TF.IDF score of $w$ in $d$?",
        check: { mode: "text", accept: ["5", "5.0", "4.98", "4.977", "4.97"], placeholder: "score" },
        hint: "Compute $IDF = \\log_2(10^7/320)$ first.",
        solution:
          "$IDF = \\log_2(31{,}250) \\approx 14.93$ and $TF = 5/15 = 1/3$, so the score is about **5** (4.98). Had $w$ appeared once, $TF = 1/15$ and the score would be about 1.",
      },
    ],
  },
];

const hashFunctions: Block[] = [
  {
    kind: "prose",
    md: "Hash tables are familiar from programming; the hash functions that make them work are also essential parts of many data-mining algorithms and of database indexes. A **hash function** $h$ takes a **hash-key** value and produces a **bucket number**, an integer from $0$ to $B - 1$.\n\nThe defining intuition is that $h$ *randomises* hash-keys: if keys are drawn from a reasonable population, $h$ sends roughly equal numbers of them to each of the $B$ buckets. (A population smaller than $B$ is not reasonable — some buckets must stay empty.)",
  },
  {
    kind: "prose",
    md: "For integer keys the common choice is $h(x) = x \\bmod B$. It works well when the population is all positive integers — each bucket gets $1/B$ of them. But suppose the keys are the **even** integers and $B = 10$: only buckets 0, 2, 4, 6 and 8 can ever be hit. With $B = 11$ each bucket receives $1/11$ of the even integers. In general, a $B$ sharing a factor with all (or most) keys gives a skewed distribution, so **choose $B$ prime** — though you still have to watch for keys that are all multiples of $B$ itself.",
  },
  {
    kind: "interactive",
    title: "How evenly does x mod B spread the keys?",
    description: "Pick the number of buckets and the population of keys. Watch whole buckets go dark when B and the keys share a factor.",
    component: HashSpreadLab,
  },
  {
    kind: "prose",
    md: "Keys that are not integers are first turned into integers:\n\n- **Strings**: convert each character to its ASCII or Unicode code and sum them before dividing by $B$. If $B$ exceeds the typical sum, group the characters (four at a time gives 32-bit integers, good for $B$ around $2^{30}$) and sum the groups.\n- **Records**: recursively convert each component with the method for its type, sum, and take the result modulo $B$.\n- **Arrays, sets and bags**: convert each element, sum, and take the result modulo $B$.\n\nThe database textbook adds that $h(v) = (a \\cdot v + b) \\bmod N$ works well in practice, with $a$ and $b$ chosen to tune the function.",
  },
  { kind: "concepts", ids: ["hash-function"] },
  {
    kind: "practice",
    id: "l1-hash-functions",
    tasks: [
      {
        id: "multiples",
        prompt:
          "Hash-keys are all non-negative multiples of a constant $c$, and $h(x) = x \\bmod 15$. For which values of $c$ is $h$ suitable — that is, spreads keys roughly equally over the 15 buckets? Select all that apply.",
        check: { mode: "select", options: ["2", "3", "4", "5", "6", "7", "9", "10", "11"], answer: ["2", "4", "7", "11"] },
        hint: "Which buckets can $k \\cdot c \\bmod 15$ ever reach when $c$ shares a factor with 15?",
        solution:
          "$h$ is suitable exactly when $c$ shares no factor with $15 = 3 \\times 5$, i.e. $\\gcd(c, 15) = 1$: **2, 4, 7, 11**. A multiple of 3 can only reach buckets 0, 3, 6, 9, 12; a multiple of 5 only 0, 5, 10.",
      },
    ],
  },
];

const whyIndexes: Block[] = [
  {
    kind: "prose",
    md: "An **index** is a data structure that makes it efficient to retrieve objects given the value of one or more of their fields — the **search key**. Given a value $v$, the index returns the records with $v$ in that field without reading the whole file. A hash table is the simplest way to build one: hash the phone field of every (name, address, phone) record, put each record in its bucket (a linked list in memory, or a disk block), and later hash a phone number to find the only bucket worth searching. With roughly as many buckets as records, each bucket holds only a few.",
  },
  {
    kind: "prose",
    md: "Why do indexes matter so much for large data? Because of **secondary storage**. Disks are organised into **blocks**, the minimum unit moved between disk and memory (64 KB in the book's example). Accessing and reading a block takes about **10 ms** — at least five orders of magnitude ($10^5$) slower than reading a word from main memory. If you only need a few bytes, having them in memory is overwhelmingly better; if you process every byte of a block, moving the block still costs far more than the computation.\n\nPlacing related data on one **cylinder** (the blocks reachable without moving the disk head) reads them much faster than 10 ms per block, but a disk cannot transfer more than about **100 MB per second** however the data is laid out. A megabyte is no problem; a hundred gigabytes or a terabyte is a problem just to *read*.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "So cost is counted in page I/Os",
    md: "In the rest of the course, and in the database textbook, the cost of an index operation is the number of disk pages it reads or writes. The CPU work in between is negligible by comparison.",
  },
  {
    kind: "prose",
    md: "The textbook motivates tree indexes the same way. A file sorted on $gpa$ can answer *gpa > 3.0* by binary search, but binary search on a large file still fetches many pages. Build a second, much smaller file with one entry per data page — *(first key on page, pointer to page)* — and binary-search that instead. Repeat the construction on the index file until the top fits on one page, and you have a tree.",
  },
  {
    kind: "table",
    headers: ["Alternative", "Data entry k* is…", "Consequence"],
    rows: [
      ["(1)", "the data record itself, with key value k", "The index is the file organisation itself; it is necessarily clustered."],
      ["(2)", "⟨k, rid⟩ — the id of a record with key k", "Small entries; the records live in a separate data file."],
      ["(3)", "⟨k, list of rids⟩ — all records with key k", "Most compact for duplicates; entries vary in length."],
    ],
    caption: "What an index stores for each search key value. Upper tree levels hold index entries ⟨key, page pointer⟩ that only direct the search.",
  },
  {
    kind: "prose",
    md: "An index is **clustered** when the data records are stored in the same order as its data entries — or close to it — and **unclustered** otherwise. Suppose alternative (2) is used and the records sit in a heap file. To build a clustered index, first sort the heap file, leaving some free space on each page for future inserts. Overflow pages may still be needed later, so the order of the records is *close to*, but not identical to, the sort order. A file can be clustered on at most one search key.",
  },
  {
    kind: "info",
    variant: "warning",
    title: "Why clustering matters",
    md: "Both indexes lead you to the right data entries in sorted order. With a **clustered** index the matching records are packed on consecutive pages, so a range query reads one page per *page* of results. With an **unclustered** index consecutive data entries point all over the data file, so a range query can cost one I/O per *record*.",
  },
  { kind: "concepts", ids: ["index", "data-entry", "clustered-index"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Roughly how long does reading a disk block take, and how does that compare to main memory?", answer: "About 10 ms — at least $10^5$ times slower than reading a word from memory." },
      { prompt: "What are the three alternatives for a data entry k*?", answer: "(1) the data record itself; (2) ⟨k, rid⟩; (3) ⟨k, list of rids⟩." },
      { prompt: "How do you build a clustered index with alternative (2) over a heap file?", answer: "Sort the heap file first, leaving free space on each page; overflow pages may be needed later, so the order stays close to sorted." },
      { prompt: "Why is a range query through an unclustered index potentially expensive?", answer: "Consecutive data entries point to records on different pages, so each matching record can cost its own page I/O." },
    ],
  },
];

const hashIndexes: Block[] = [
  {
    kind: "prose",
    md: "Hash-based indexes are excellent for **equality** selections and useless for **range** selections: hashing deliberately scatters neighbouring values. The textbook builds up three schemes.",
  },
  {
    kind: "prose",
    md: "**Static hashing.** The file is a fixed collection of $N$ buckets, numbered $0$ to $N - 1$. Each bucket has one **primary page** and possibly a chain of **overflow pages**. To search, insert or delete $k*$, compute $h(k) \\bmod N$ and work in that bucket only; an entry that does not fit goes to a new overflow page. Searching ideally costs **one** I/O, insert and delete **two** (read and write the page).\n\nThe problem is that $N$ is fixed. If the file shrinks, space is wasted; if it grows, long overflow chains develop and every search must walk them. Keeping pages 80% full at creation delays the problem, and periodically **rehashing** into more buckets cures it — but rehashing takes time and the index is unusable meanwhile. Static hashing shares this drawback, and its concurrency advantage, with the static tree index ISAM.",
  },
  {
    kind: "prose",
    md: "**Extendible hashing** fixes this with one idea: keep a **directory** of pointers to buckets, and double the number of buckets by doubling *only the directory*, splitting only the bucket that overflowed. The hash value is read as a binary number and its **last $d$ bits** index the directory, where $d$ is the **global depth**. Each bucket also has a **local depth** $l$: all its entries agree on their last $l$ bits.",
  },
  {
    kind: "interactive",
    title: "Extendible hashing, step by step",
    description:
      "The textbook's file: global depth 2, four buckets of four entries. Insert keys and watch which ones fit, which split a bucket, and which double the directory.",
    component: ExtendibleHashingLab,
  },
  {
    kind: "steps",
    title: "The textbook's three inserts",
    intro: "Start: A = {4*, 12*, 32*, 16*}, B = {1*, 5*, 21*}, C = {10*}, D = {15*, 7*, 19*}; global depth 2, every local depth 2.",
    steps: [
      { title: "Insert 13* (binary 1101)", md: "Last two bits 01 lead to bucket B, which has room. Done — one page read, one written." },
      { title: "Insert 20* (binary 10100)", md: "Last two bits 00 lead to bucket A, which is full. Split A: redistribute its entries plus 20* on the last **three** bits. A keeps 32* and 16* (…000), the new split image A2 gets 4*, 12* and 20* (…100). Both get local depth 3." },
      { title: "Double the directory", md: "A's local depth (2) equalled the global depth (2), so the directory cannot tell A from A2. It doubles to 8 entries by **copying itself**; the global depth becomes 3, and element 100 is redirected to A2. Every other bucket is now pointed to by two directory elements." },
      { title: "Insert 9* (binary 1001)", md: "Last three bits 001 lead to B, which is full again. B's local depth (2) is **below** the global depth (3): two elements, 001 and 101, already point to it. Split B into B = {1*, 9*} and B2 = {5*, 21*, 13*}, redirect 101 to B2 — **no doubling**." },
    ],
  },
  {
    kind: "formula",
    tex: "\\#\\text{directory elements pointing to a bucket} = 2^{\\,d - l}",
    caption: "If l < d, a split just rewires half of those pointers. If l = d, exactly one element points to the bucket and the directory must double.",
  },
  {
    kind: "prose",
    md: "Using the *last* bits is deliberate: doubling then means copying the directory and fixing the pointers of the split buckets. **Deletes** reverse inserts: an empty bucket can be merged with its split image, lowering its local depth, and if every directory element points to the same bucket as its split image the directory can be halved — often skipped in practice.\n\n**Cost.** If the directory fits in memory, an equality search is one I/O, otherwise two. That is likely: a 100 MB file with 100-byte entries and 4 KB pages holds a million entries in about 25,000 buckets, so the directory has only about 25,000 elements. Two caveats remain. With a **skewed** distribution of hash values the directory can grow large in spurts. And **collisions** — more entries with the *same* hash value than fit on a page — cannot be resolved by splitting, so overflow pages are still needed for them.",
  },
  {
    kind: "prose",
    md: "**Linear hashing** is dynamic too, but needs no directory, handles collisions naturally, and lets you trade slightly longer overflow chains for higher space utilisation. It uses a **family** of hash functions $h_0, h_1, h_2, \\ldots$, each with twice the range of its predecessor:",
  },
  {
    kind: "formula",
    tex: "h_i(v) = h(v) \\bmod (2^i N) \\qquad N_{Level} = N \\cdot 2^{Level}",
    caption: "With N = 32 initial buckets, h₀ uses the last 5 bits, h₁ the last 6, h₂ the last 7, and so on.",
  },
  {
    kind: "prose",
    md: "Splitting proceeds in **rounds**. During round $Level$ only $h_{Level}$ and $h_{Level+1}$ are in use. The bucket to split next is **Next**, initially 0. Whenever an insert needs a new overflow page, a split is triggered: bucket *Next* — not necessarily the one that overflowed — is split with $h_{Level+1}$ into itself and its split image $Next + N_{Level}$, and *Next* moves on. When the last bucket of the round has been split, the number of buckets has doubled, *Level* increases and *Next* returns to 0. Because buckets split round-robin, every overflow chain is eventually redistributed before it gets longer than one or two pages.\n\nTo **search** for key $k$: compute $b = h_{Level}(k)$. If $b \\ge Next$, bucket $b$ has not been split this round and the entry is there. If $b < Next$, the bucket was already split, so apply $h_{Level+1}$ to decide between $b$ and $b + N_{Level}$.",
  },
  {
    kind: "steps",
    title: "The textbook's linear hashing example",
    intro: "Level 0, $N = 4$ buckets of four entries, Next = 0. Buckets: 00 = {32*, 44*, 36*}, 01 = {9*, 25*, 5*}, 10 = {14*, 18*, 10*, 30*}, 11 = {31*, 35*, 7*, 11*}.",
    steps: [
      { title: "Insert 43* (h₀ = 11)", md: "Bucket 11 is full, so 43* goes to a new overflow page — which triggers a split of bucket **Next = 0**. With $h_1$ (last three bits) its entries divide into 000 = {32*} and the new bucket 100 = {44*, 36*}. Next becomes 1. Bucket 11 keeps its overflow page for now." },
      { title: "Insert 37* (h₀ = 01)", md: "Bucket 01 has room; no split." },
      { title: "Insert 29* (h₀ = 01)", md: "Bucket 01 is full, so a split is triggered — and this time Next = 1 is the full bucket itself. With $h_1$ it divides into 001 = {9*, 25*} and the new 101 = {5*, 37*, 29*}, which makes room without an overflow page. Next becomes 2." },
      { title: "Search for 18* and 44*", md: "$h_0(18) = 10 = 2 \\ge Next$: bucket 2 is unsplit, look there. $h_0(44) = 00 = 0 < Next$: bucket 0 was split, so apply $h_1(44) = 100$ — the split image." },
      { title: "End of the round", md: "After 22*, 66* and 34* split bucket 2, inserting 50* splits bucket 3, the last of the round. All four original buckets are now split, so Level becomes 1 and Next returns to 0." },
    ],
  },
  {
    kind: "table",
    headers: ["", "Extendible hashing", "Linear hashing"],
    rows: [
      ["Directory", "Yes, doubled in one step", "None needed — buckets can be allocated consecutively"],
      ["Which bucket splits", "Always the one that overflowed", "The bucket Next, round-robin"],
      ["Overflow pages", "Only for collisions", "Yes, but chains rarely exceed two pages"],
      ["Equality search", "1 I/O if the directory is in memory, else 2", "About 1.2 I/Os on average for uniform data"],
      ["Skewed data", "Directory grows; occupancy stays high", "Chains and poor space utilisation can make it worse"],
    ],
    caption: "Moving from hᵢ to hᵢ₊₁ in linear hashing is the gradual version of doubling the directory in extendible hashing.",
  },
  { kind: "concepts", ids: ["static-hashing", "extendible-hashing", "depths", "linear-hashing"] },
  {
    kind: "practice",
    id: "l1-hash-indexes",
    tasks: [
      {
        id: "pointers",
        prompt: "An extendible hash file has global depth 3. How many directory elements point to a bucket with local depth 1?",
        check: { mode: "text", accept: ["4"], placeholder: "elements" },
        solution: "$2^{d-l} = 2^{3-1} = $ **4**.",
      },
      {
        id: "doubling",
        prompt: "Global depth 3, and an insert overflows a bucket whose local depth is also 3. How many elements does the directory have afterwards?",
        check: { mode: "text", accept: ["16"], placeholder: "elements" },
        solution: "Local depth equals global depth, so the directory doubles from $2^3 = 8$ to **16** elements and the global depth becomes 4.",
      },
      {
        id: "linear-search",
        prompt: "Linear hashing with Level = 0, $N = 4$ and Next = 2. Into which bucket does a key with $h(k) = 29$ (binary 11101) go?",
        check: { mode: "text", accept: ["5", "101"], placeholder: "bucket" },
        hint: "Start with $h_0$, then check whether that bucket was already split this round.",
        solution: "$h_0(29) = 29 \\bmod 4 = 1 < Next = 2$, so bucket 1 has already been split this round. Apply $h_1(29) = 29 \\bmod 8 = 5$ (last three bits 101): the key is in the split image, bucket **5**. A key with $h = 25$ (11001) would instead stay in bucket 1.",
      },
    ],
  },
];

const bPlusTrees: Block[] = [
  {
    kind: "prose",
    md: "Tree indexes support efficient **range** searches — including sorted scans — as well as insertion and deletion. The textbook first presents **ISAM**, a static tree: the leaf pages are allocated sequentially when the file is created, inserts that do not fit go to overflow pages, and only leaf pages are ever modified, so the index levels never need locking. It works well for data that rarely changes; with many inserts to the same leaf, long overflow chains form. The **B+ tree** is the dynamic structure that adjusts gracefully to inserts and deletes and is the most widely used index of all.",
  },
  {
    kind: "prose",
    md: "Its shape in two lines:\n\n- **Leaf pages contain data entries** and are chained (previous and next).\n- **Non-leaf pages have index entries**, used only to direct searches: $P_0, K_1, P_1, K_2, P_2, \\ldots, K_m, P_m$.\n\nPointer $P_i$ leads to the subtree whose keys $K$ satisfy $K_i \\le K < K_{i+1}$; $P_0$ covers keys below $K_1$ and $P_m$ keys of at least $K_m$. The doubly linked leaves are called the **sequence set**.",
  },
  {
    kind: "table",
    headers: ["Property", "Why it matters"],
    rows: [
      ["Insert and delete keep the tree balanced", "Every search walks the same number of levels — the height of the tree."],
      ["Each node except the root holds d ≤ m ≤ 2d entries (order d); the root holds 1 ≤ m ≤ 2d", "At least 50% occupancy is guaranteed (if the full delete algorithm is used); B+ trees typically run about 67% full."],
      ["High fan-out", "The height is rarely more than 3 or 4, so a search reads 3–4 pages."],
      ["Chained leaves", "Range queries and sorted scans walk the sequence set without going back up the tree."],
    ],
  },
  {
    kind: "code",
    lang: "python",
    code: `def find(key):                       # returns the leaf where key belongs
    return tree_search(root, key)

def tree_search(node, key):
    if node.is_leaf:
        return node
    if key < node.keys[0]:            # K < K1  -> P0
        return tree_search(node.children[0], key)
    if key >= node.keys[-1]:          # K >= Km -> Pm
        return tree_search(node.children[-1], key)
    i = index such that node.keys[i - 1] <= key < node.keys[i]
    return tree_search(node.children[i], key)`,
    caption: "The textbook's search algorithm. Finding i inside a node can use a linear or a binary search.",
  },
  {
    kind: "prose",
    md: "Take this example tree: the root holds 17, its children 5, 13 and 27, 30, and the leaves 2* 3* | 5* 7* 8* | 14* 16* | 22* 24* | 27* 29* | 33* 34* 38* 39*. **Find 28\\*?** Go right of 17, between 27 and 30, to leaf 27* 29* — 28* is not there, so it is not in the tree. **29\\*?** Same leaf, found. **All > 15\\* and < 30\\*?** Descend once to the leaf for 15, then follow the chain: 16*, 22*, 24*, 27*, 29*, stopping at 33*.",
  },
  {
    kind: "interactive",
    title: "B+ tree of order 2",
    description:
      "The textbook's tree (root 13 17 24 30). Insert keys to see leaf and index splits, find a key to see the root-to-leaf path, or run a range query along the leaf chain.",
    component: BPlusTreeLab,
  },
  {
    kind: "steps",
    title: "Inserting 8* into the textbook tree",
    intro: "Insertion finds the leaf where the entry belongs and puts it there. *Insert/delete: find data entry in leaf, then change it. Need to adjust parent sometimes. And change sometimes bubbles up the tree.*",
    steps: [
      { title: "Find the leaf", md: "8 < 13, so the entry belongs in the left-most leaf 2* 3* 5* 7* — which is full ($2d = 4$ entries)." },
      { title: "Split the leaf, copy 5 up", md: "Five entries: the first $d = 2$ stay (2* 3*), the rest move to a new leaf (5* 7* 8*). The new leaf's smallest key, 5, goes into the parent as ⟨5, pointer to new leaf⟩ — **copied up**: 5* must stay in the leaf, because all data entries live at the leaf level." },
      { title: "Split the index node, push 17 up", md: "The root now needs 5 keys and 6 pointers: 5 13 17 24 30. Split it into two nodes of $d$ keys and $d + 1$ pointers — 5 13 and 24 30 — and **push up** the middle key 17. It moves to the parent and appears only once in the index levels." },
      { title: "Grow a new root", md: "The split node was the root, so a new root holding just 17 is created. The height grows from 1 to 2 — at the top, which is how the tree stays balanced." },
      { title: "Or redistribute instead", md: "A variant first checks a sibling with the same parent: the leaf 14* 16* has room, so moving 8* there (and copying up the new low key 8) avoids the split. It improves occupancy but costs extra I/O, so it is usually done only at the leaf level, if at all." },
    ],
  },
  {
    kind: "steps",
    title: "Deleting 19*, 20* and 24*",
    intro: "Deletion removes the entry from its leaf; if the leaf drops below $d$ entries it **redistributes** with a sibling or **merges** with it. Start from the tree after inserting 8*.",
    steps: [
      { title: "Delete 19*", md: "The leaf 19* 20* 22* keeps two entries — still at least $d$. Done." },
      { title: "Delete 20* — redistribute", md: "Now the leaf holds only 22*. Its sibling 24* 27* 29* can spare an entry: move 24* over and **copy up** the sibling's new low key, 27, replacing 24 in the parent." },
      { title: "Delete 24* — merge leaves", md: "The leaf holds only 22* and its sibling 27* 29* has nothing to spare. Together they fit on one page: merge into 22* 27* 29* and **toss** the parent entry ⟨27, …⟩. The parent index node is left with only the key 30." },
      { title: "Merge index nodes, pull 17 down", md: "That index node is below $d = 2$ and its sibling 5 13 cannot spare a key. Merge them, **pulling down** the splitting key 17 from the root: 5 13 17 30 — four keys, five pointers, a full node." },
      { title: "The root disappears", md: "The old root has lost its only key, so the merged node becomes the new root and the height **decreases** by one. Had the sibling had a spare key, the entries would instead have been redistributed *through* the parent." },
    ],
  },
  {
    kind: "info",
    variant: "note",
    title: "Duplicates, key compression and practice",
    md: "Several entries with the same key can be handled with overflow pages, or — more commonly — by treating the record id as part of the search key, which makes the index unique. Because the height is about $\\log_{fan\\text{-}out}(\\#\\text{entries})$, systems compress index keys (*Da* and *De* are enough to separate *David Smith* from *Devarakonda…*) to raise the fan-out. As an illustration: with a fan-out of 133, three index levels already reach $133^3 \\approx 2.35$ million leaf pages.",
  },
  { kind: "concepts", ids: ["isam", "b-plus-tree", "order", "copy-push"] },
  {
    kind: "practice",
    id: "l1-b-plus-trees",
    tasks: [
      {
        id: "max-keys",
        prompt: "A B+ tree has order $d = 3$. What is the maximum number of child pointers of a non-leaf node?",
        check: { mode: "text", accept: ["7"], placeholder: "pointers" },
        solution: "At most $2d = 6$ keys, hence $2d + 1 = $ **7** pointers.",
      },
      {
        id: "new-root",
        prompt: "After inserting 8* into the textbook tree (root 13 17 24 30), which key is in the new root?",
        check: { mode: "text", accept: ["17"], placeholder: "key" },
        solution: "**17**, the middle key of the split root 5 13 17 24 30. It is pushed up, so it no longer appears in either half.",
      },
      {
        id: "copy-or-push",
        prompt: "Explain in your own words why a leaf split copies its separator up while an index split pushes it up.",
        check: { mode: "open" },
        solution:
          "All data entries must reside in leaves, so the separator of a leaf split (the smallest key of the new leaf) has to stay in the leaf *and* be inserted into the parent. Index entries only direct the search; the middle key of an index split is needed exactly once to separate the two new nodes, so it moves up instead of being duplicated.",
      },
    ],
  },
];

const hashVsTree: Block[] = [
  {
    kind: "table",
    headers: ["", "Hash index", "B+ tree index"],
    rows: [
      ["Equality selection", "About 1 I/O (1.2 for linear hashing, 2 if the directory is on disk)", "One root-to-leaf path: 3–4 I/Os, fewer with the top levels cached"],
      ["Range selection", "Not supported — neighbouring keys are scattered", "One descent, then a scan of the chained leaves"],
      ["Sorted access", "No", "Yes, via the sequence set"],
      ["Growth", "Extendible: directory doubling; linear: round-robin splits; static: overflow chains", "Splits at the leaves, propagating up; always balanced"],
      ["Typical use", "Equality lookups, and join methods such as index nested loops", "The default general-purpose index"],
    ],
  },
  {
    kind: "prose",
    md: "Tree-based indexes are almost as good as hashing for equality selections and also support ranges, so many commercial systems choose to support only them. Hashing remains very useful inside relational operators — the index nested loops join issues many equality selections, where the difference adds up.\n\nThe **benefits the B+ tree brings** follow from its design: it stays balanced, so every lookup costs the same few I/Os; it grows and shrinks gracefully without overflow chains, unlike ISAM or static hashing; its high fan-out keeps it shallow; and its sorted, chained leaves answer range queries and sorted scans directly. For a file that is updated frequently and needs sorted access, a B+ tree is almost always better than keeping the file itself sorted.",
  },
  {
    kind: "recall",
    cards: [
      { prompt: "Why can't a hash index answer *salary > 50,000*?", answer: "Hashing scatters neighbouring values across unrelated buckets; there is no order to scan." },
      { prompt: "Name four benefits of a B+ tree.", answer: "Balanced (predictable 3–4 I/Os), dynamic without overflow chains, high fan-out and low height, sorted chained leaves for range queries and sorted scans." },
      { prompt: "When does hashing still beat a tree?", answer: "For many equality lookups — e.g. inside an index nested loops join — where its ~1 I/O versus 3–4 adds up." },
    ],
  },
];

const mistakes: Block[] = [
  {
    kind: "info",
    variant: "pitfall",
    title: "Expecting the most frequent words to matter most",
    md: "The most frequent words are stop words. TF.IDF rewards words that are frequent in the document **and** rare in the collection; a rare word only helps if it concentrates in few documents.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Choosing B with a factor shared by the keys",
    md: "$x \\bmod 10$ on even keys uses only half the buckets. Prefer a prime $B$, and still check that the keys are not all multiples of it.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Doubling the directory on every split",
    md: "Extendible hashing doubles the directory only when the overflowing bucket's local depth equals the global depth. Otherwise several directory elements already point to it and the split just rewires half of them.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Splitting the overflowing bucket in linear hashing",
    md: "Linear hashing splits the bucket **Next**, round-robin. The bucket that overflowed gets an overflow page and waits for its turn.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Pushing up a leaf key",
    md: "Leaf splits **copy** the separator up — the data entry must stay in the leaf. Only index-node splits **push** the middle key up, removing it from the lower level.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Forgetting that the tree grows at the root",
    md: "A B+ tree never adds a level at the bottom. Height grows only when the root splits, and shrinks only when the root loses its last key, which keeps all leaves at the same depth.",
  },
];

const quiz: Block[] = [
  {
    kind: "prose",
    md: "Twelve questions across the whole lecture, from the course set-up to B+ tree deletion. Read the explanation after each answer — it is often more useful than the answer itself.",
  },
];

const summary: Block[] = [
  { kind: "list", variant: "takeaways", items: lecture01Meta.takeaways },
  {
    kind: "table",
    headers: ["Quantity", "Formula", "Where it shows up"],
    rows: [
      ["Term frequency", "TFᵢⱼ = fᵢⱼ / maxₖ fₖⱼ", "TF.IDF"],
      ["Inverse document frequency", "IDFᵢ = log₂(N / nᵢ)", "TF.IDF"],
      ["Integer hash function", "h(x) = x mod B, B prime", "Hash tables and indexes"],
      ["Directory size", "2ᵈ elements for global depth d", "Extendible hashing"],
      ["Pointers to a bucket", "2^(d − l)", "Doubling needed iff l = d"],
      ["Linear hashing family", "hᵢ(v) = h(v) mod 2ⁱN", "Rounds of splitting"],
      ["B+ tree occupancy", "d ≤ m ≤ 2d (root: 1 ≤ m ≤ 2d)", "Order d"],
      ["B+ tree height", "≈ log_fan-out(#data entries)", "Cost of a search in I/Os"],
    ],
    caption: "Everything worth memorising from this lecture.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "The one sentence version",
    md: "Big data is mostly machine-generated and too large to read on one machine, so everything this course builds starts from two indexing ideas: hash a key to jump straight to its bucket, or keep keys sorted in a shallow balanced tree that also answers ranges.",
  },
];

export const lecture01Blocks: SectionBlocks<typeof lecture01Outline> = {
  objectives,
  course,
  "big-data": bigData,
  "data-science": dataScience,
  background,
  "tf-idf": tfIdf,
  "hash-functions": hashFunctions,
  "why-indexes": whyIndexes,
  "hash-indexes": hashIndexes,
  "b-plus-trees": bPlusTrees,
  "hash-vs-tree": hashVsTree,
  mistakes,
  quiz,
  summary,
};
