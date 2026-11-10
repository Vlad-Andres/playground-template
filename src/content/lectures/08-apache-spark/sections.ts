import type { Block, SectionBlocks } from "@/content/types";
import { lecture08Meta, lecture08Outline } from "./meta";
import { LazyEvaluationLab } from "./interactive/LazyEvaluationLab";

const objectives: Block[] = [
  {
    kind: "prose",
    md: "This lecture is a first glimpse of Apache Spark — its basic principles, how it was created, how it differs from Hadoop MapReduce and what it offers. Expected knowledge: **Spark vs Hadoop** (the difference), **how Spark operates**, **what RDDs are**, **what DataFrames are**, and how they are used. The books (*Learning Apache Spark with Python*, *Spark: The Definitive Guide*, the Spark tutorial) are the main references for the labs and the project.",
  },
  { kind: "list", variant: "objectives", items: lecture08Meta.objectives },
];

const hadoop: Block[] = [
  {
    kind: "timeline",
    items: [
      { label: "1970", title: "SQL", md: "Relational databases." },
      { label: "~2000", title: "The big-data era (batch)", md: "MapReduce by Google, 2004." },
      { label: "~2010", title: "The fast-data era (streaming)", md: "Apache Kafka 2011, Apache Spark 2014, Apache Flink 2015." },
    ],
  },
  {
    kind: "prose",
    md: "**Apache Hadoop** is an ecosystem of tools for processing big data: an open-source project of the Apache group, a distributed framework written in Java. It has Google's MapReduce computation technology, **HDFS** (the Hadoop Distributed File System, inspired by GFS), and a framework for distributed computation in clusters — supported by Yahoo!, Facebook, Twitter, IBM and Microsoft.",
  },
  {
    kind: "table",
    headers: ["Technology", "Description"],
    rows: [
      ["MapReduce", "Distributed computation framework (data-processing model and execution environment)"],
      ["HDFS", "Distributed file system"],
      ["HBase", "Distributed, column-oriented database"],
      ["Hive", "Distributed data warehouse (SQL queries)"],
      ["Pig", "Higher-level data-flow language and parallel execution framework"],
      ["ZooKeeper", "Distributed coordination service"],
      ["Avro", "Data serialisation system (RPC and persistent data storage)"],
      ["Sqoop", "Bulk data transfer between structured data stores (e.g. an RDBMS) and HDFS"],
      ["Oozie", "Complex job workflow service"],
      ["YARN", "Yet Another Resource Negotiator — resource management (MapReduce v2)"],
      ["Flume, Mahout, Ambari", "Log collection, machine learning, cluster provisioning and monitoring"],
    ],
    caption: "The Apache Hadoop ecosystem.",
  },
  {
    kind: "prose",
    md: "Hadoop is **not a good fit** for low-latency data access, lots of small files, or multiple writers with arbitrary file modifications. Its large **block** abstraction is what it is good at: a file can be larger than any single disk in the network, the storage subsystem is simplified (metadata bookkeeping), and replication for fault tolerance and availability is easy (Lecture 9 covers HDFS blocks and replication in detail). A job goes **from HDFS to HDFS**: input splits are mapped, sorted, copied and merged to reducers, and each output part is written back to HDFS with replication.\n\nOf the use cases, Hadoop handles **map-only** and **classic MapReduce** jobs well, and does **not** handle **iterative** jobs, point-to-point graph computations, streaming, or maps that communicate through shared memory.",
  },
  {
    kind: "table",
    headers: ["Hadoop limitation"],
    rows: [
      ["Issue with small files"],
      ["Slow processing speed — due to replication, I/O operations and serialisation"],
      ["Latency"],
      ["Lengthy lines of code"],
      ["No real-time processing"],
      ["No iterative processing — data must be written to disk at each iteration"],
      ["Security"],
    ],
  },
  { kind: "concepts", ids: ["hadoop", "hadoop-limits"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What are the two core parts of Hadoop?", answer: "MapReduce (distributed computation) and HDFS (distributed file system, inspired by GFS)." },
      { prompt: "Name three things Hadoop is not a good fit for.", answer: "Low-latency access, lots of small files, multiple writers / arbitrary file modifications (also real-time and iterative processing)." },
      { prompt: "Why is Hadoop slow?", answer: "Replication, I/O operations and serialisation — every job reads from and writes to HDFS." },
    ],
  },
];

const spark: Block[] = [
  {
    kind: "info",
    variant: "insight",
    title: "“Efficient, fast, general-purpose cluster computing framework with high-level APIs in Java, Scala, Python, and R”",
    md: "Originally developed in 2009 at UC Berkeley's AMPLab and open source since 2010. Spark creates an **execution graph**, enables **in-memory computation**, and needs **way less code** to write.",
  },
  {
    kind: "prose",
    md: "**How much faster?** The Daytona GraySort benchmark sorts 100 TB in a distributed, parallel way. Hadoop's 2013 record: **72 minutes on 2100 machines**. Spark's 2014 record: **23 minutes on 207 machines** — on disk — and Spark also sorted 1 PB in 4 hours.",
  },
  {
    kind: "table",
    headers: ["Layer", "Components"],
    rows: [
      ["Libraries", "Spark SQL (structured data), Spark Streaming (real time), MLlib (machine learning), GraphX (graph processing)"],
      ["Engine", "Spark Core — the RDD API, with DataFrames / SQL / Datasets APIs on top"],
      ["Cluster managers", "Standalone scheduler, YARN, Mesos (and Kubernetes / Docker deployments)"],
      ["Data sources", "HDFS, HBase, Cassandra, MongoDB, MySQL, PostgreSQL, Elasticsearch, JSON, Parquet, Kafka, S3…"],
    ],
    caption: "The Apache Spark stack and ecosystem.",
  },
  {
    kind: "steps",
    title: "How a Spark application runs",
    steps: [
      { title: "Driver program", md: "Your program runs in the driver, which holds the **SparkContext** — the entry point to the cluster." },
      { title: "Cluster manager", md: "The SparkContext asks the cluster manager (standalone, YARN or Mesos) for resources on worker nodes." },
      { title: "Executors", md: "Each worker node runs an **executor** that executes **tasks** and keeps a **cache** of data in memory." },
      { title: "Actions trigger jobs", md: "When an action runs, the driver turns the DAG of operations into **stages**, and each stage is executed as a series of **tasks** — the fundamental unit of work — on the executors." },
    ],
  },
  {
    kind: "info",
    variant: "note",
    title: "Installing Spark on a cluster",
    md: "Download and unpack a version from the Spark website, copy it to all nodes, list the worker IPs in `spark/conf/slaves`, put the master IP and other settings in `spark/conf/spark-defaults.conf`, and start everything with `spark/sbin/start-all.sh`. The folders: `bin` (shell scripts), `conf`, `data` and `examples`, `jars` (libraries), `kubernetes`, `python`, `R`, `sbin` (start/stop scripts), `yarn`.",
  },
  { kind: "concepts", ids: ["spark", "spark-runtime"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Name the four libraries on top of Spark Core.", answer: "Spark SQL, Spark Streaming, MLlib, GraphX." },
      { prompt: "Which components run a Spark application?", answer: "A driver program with a SparkContext, a cluster manager (standalone, YARN, Mesos), and executors on worker nodes that run tasks and cache data." },
      { prompt: "Sort benchmark: Hadoop 2013 vs Spark 2014?", answer: "100 TB: Hadoop 72 min on 2100 machines; Spark 23 min on 207 machines." },
    ],
  },
];

const rdds: Block[] = [
  {
    kind: "prose",
    md: "Spark Core's abstraction is the **RDD — Resilient Distributed Dataset**: a distributed collection of objects that can be cached in memory across cluster nodes. An RDD is:\n\n- **immutable** — operations create new RDDs, never change one;\n- **resilient** and **fault-tolerant** — missing or damaged partitions can be recomputed after node failures;\n- **distributed** — its data resides on multiple nodes;\n- **lazily evaluated** — nothing is computed until it is needed;\n- **cacheable / persistent** — it can be kept in memory or on disk.",
  },
  {
    kind: "table",
    headers: ["Transformations", "Actions"],
    rows: [
      ["Create a new dataset from an existing one (map is a transformation)", "Return a value to the driver program after running a computation (reduce is an action)"],
      ["Return pointers to a new RDD", "Result in a DAG of operations, compiled into stages of tasks"],
      ["Lazy: not computed immediately", "Trigger the computation"],
      ["Recomputed when actions run on them — unless persisted in memory or disk", ""],
    ],
    caption: "Lazy evaluation follows from the dependency chain of RDDs; the DAG lets Spark run complex operations consistently.",
  },
  {
    kind: "code",
    lang: "python",
    code: `x = rdd.map(f).map(g)        # no computation
print(x.reduce(h))           # the computation starts from rdd
print(x.map(k).count())      # the computation starts from rdd — again`,
    caption: "Lazy evaluation in action.",
  },
  {
    kind: "info",
    variant: "warning",
    title: "The drawback of lazy evaluation — and the fix",
    md: "**Drawbacks:** many partitions are computed multiple times, so execution takes longer. **Solution:** RDD persistence — caching RDDs in memory across operations, with a significant speed-up (at least 10×) and different levels of persistence: main memory, local disk, or mixed (`rdd.cache()`, `rdd.persist(level)`).",
  },
  {
    kind: "interactive",
    title: "Lazy evaluation and caching",
    description: "Define three RDDs, then run actions and count how often each RDD is computed — with and without cache().",
    component: LazyEvaluationLab,
  },
  { kind: "concepts", ids: ["rdd", "transformation-action", "lazy-evaluation"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What does RDD stand for, and list its properties.", answer: "Resilient Distributed Dataset: immutable, resilient, distributed, lazily evaluated, cacheable/persistent, fault-tolerant." },
      { prompt: "Transformation or action: map, filter, count, collect, flatMap, reduce?", answer: "Transformations: map, filter, flatMap. Actions: count, collect, reduce." },
      { prompt: "How does Spark recover a lost partition?", answer: "It recomputes it from the chain of transformations (lineage) that produced it — RDDs are immutable, so this is safe." },
    ],
  },
];

const rddOperations: Block[] = [
  {
    kind: "table",
    headers: ["Transformation", "Input", "Result"],
    rows: [
      ["map(x => x * x)", "{1, 2, 3, 4}", "{1, 4, 9, 16}"],
      ["filter(x => x != 1)", "{1, 2, 3, 4}", "{2, 3, 4}"],
      ["map(tokenize)", "{“coffee panda”, “happy panda”, “happiest panda party”}", "[[“coffee”, “panda”], [“happy”, “panda”], [“happiest”, “panda”, “party”]]"],
      ["flatMap(tokenize)", "same", "{“coffee”, “panda”, “happy”, “panda”, “happiest”, “panda”, “party”}"],
      ["RDD1.distinct()", "RDD1 = {coffee, coffee, panda, monkey, tea}", "{coffee, panda, monkey, tea}"],
      ["RDD1.union(RDD2)", "RDD2 = {coffee, monkey, kitty}", "{coffee, coffee, coffee, panda, monkey, monkey, tea, kitty}"],
      ["RDD1.intersection(RDD2)", "", "{coffee, monkey}"],
      ["RDD1.subtract(RDD2)", "", "{panda, tea}"],
      ["users.cartesian(venues)", "{User(1), User(2), User(3)} × {Betabrand, Asha Tea House, Ritual}", "all 9 (user, venue) pairs"],
    ],
    caption: "Common transformations: map and filter, map vs flatMap, and “list-like” set operations.",
  },
  {
    kind: "table",
    headers: ["Action", "Purpose", "On {1, 2, 3, 3}"],
    rows: [
      ["collect()", "Return all elements", "{1, 2, 3, 3}"],
      ["count()", "Count all elements", "4"],
      ["countByValue()", "Count elements by value", "{(1, 1), (2, 1), (3, 2)}"],
      ["take(2)", "Return num elements", "{1, 2}"],
      ["top(2)", "Return the top N values", "{3, 3}"],
      ["reduce((x, y) => x + y)", "Reduce", "9"],
    ],
    caption: "Actions.",
  },
  {
    kind: "prose",
    md: "**Loading data into RDDs**: *parallelized collections* from existing collections in the driver program (variables, lists, sets), or *external datasets* — S3, HDFS, Cassandra, MongoDB, MySQL, PostgreSQL and others.\n\n**Partitions**: RDDs are partitioned across nodes; the number of partitions matters — usually **2–4 per CPU**, chosen automatically by default. Transformations apply to the elements of the RDD by default, but you can also apply them per partition (`map` vs `mapPartitions`) and define your own partitioning functions.\n\n**Why memory matters**: in Hadoop MapReduce, data sharing between iterations goes through HDFS — read, iterate, write, read again — which is slow due to replication, serialisation and disk I/O. Spark passes the data between iterations in memory.",
  },
  {
    kind: "code",
    lang: "python",
    code: `# WordCount in 3 lines of Spark (vs 50+ lines of Java MapReduce)
f = sc.textFile(input_path)
w = f.flatMap(lambda line: line.split(" ")).map(lambda word: (word, 1)).cache()
w.reduceByKey(lambda a, b: a + b).saveAsTextFile(output_path)

# Average per key — a long Hadoop program, a short Spark one
data.map(lambda x: (x[0], (x[1], 1))) \\
    .reduceByKey(lambda a, b: (a[0] + b[0], a[1] + b[1])) \\
    .map(lambda kv: (kv[0], kv[1][0] / kv[1][1])) \\
    .collect()`,
    caption: "Write less code: word count and a per-key average, each in a few lines of Python.",
  },
  {
    kind: "practice",
    id: "l8-rdds",
    tasks: [
      {
        id: "count-by-value",
        prompt: "What does countByValue() return for the RDD {a, b, a, c, a}? Write it as pairs.",
        check: { mode: "text", accept: ["(a,3),(b,1),(c,1)", "{(a,3),(b,1),(c,1)}", "{(a, 3), (b, 1), (c, 1)}"], placeholder: "(a, 3), …" },
        solution: "**{(a, 3), (b, 1), (c, 1)}**.",
      },
      {
        id: "filter-map",
        prompt: "rdd = {1, 2, 3, 4}. What does rdd.filter(lambda x: x % 2 == 0).map(lambda x: x * 10).collect() return?",
        check: { mode: "text", accept: ["[20,40]", "{20,40}", "20,40"], placeholder: "[…]" },
        solution: "Keep 2 and 4, multiply by 10: **[20, 40]**. Only collect() triggered the computation.",
      },
    ],
  },
];

const dataframes: Block[] = [
  {
    kind: "prose",
    md: "**Why structured?** Many datasets have a fixed structure — JSON, CSV, databases. RDDs offer an *imperative* API: map and reduce specify **how**, but not **what**. A single RDD operation such as `exampleRDD.map(lambda x: x * x)` cannot be optimized, and the order of operations matters — `RDD1.join(RDD2).filter(…)` joins everything before filtering.",
  },
  {
    kind: "prose",
    md: "Spark SQL offers two structured collections, **DataFrames** and **Datasets**: distributed, table-like collections with well-defined rows and columns, immutable, with lazily evaluated plans — conceptually like RDDs, but more complex by choice, and **optimizable**.\n\n- A **column** has a simple type (integer, string, custom) or a complex type (array, map); it can contain nulls and be transformed. Columns are just **expressions**: `expr(\"someCol - 5\")` is the same as `col(\"someCol\") - 5`, and both compile to the same logical plan.\n- A **row** is a record of data, of type `Row`, from SQL, RDDs, other sources, or created manually.\n- A **schema** names and types each column — a `StructType` of `StructField(name, dataType, nullable)` entries such as `ByteType`, `IntegerType`, `StringType`, `TimestampType`, `ArrayType`, `MapType`.",
  },
  {
    kind: "table",
    headers: ["DataFrame", "Dataset"],
    rows: [
      ["“Untyped”: there is a type, maintained by Spark and checked at runtime", "Typed: types must conform at compile time"],
      ["A DataFrame is simply a Dataset of type Row: records with columns, described by a schema", "Available in JVM-based languages only: Scala and Java"],
      ["Partitioned across machines, like an RDD", "Partitioned across machines, like an RDD"],
    ],
  },
  {
    kind: "steps",
    title: "Structured API execution",
    steps: [
      { title: "Write DataFrame / Dataset / SQL code", md: "All three APIs end up in the same pipeline." },
      { title: "Logical plan", md: "If the code is valid, Spark converts it to an **unresolved logical plan** — abstract transformations, without executors or drivers. The **catalog** resolves the tables and columns it refers to." },
      { title: "Optimize", md: "The **Catalyst optimizer** turns the resolved plan into an optimized logical plan." },
      { title: "Physical plan", md: "Spark generates several **physical plans** and picks the best through a **cost model**, checking for optimizations along the way." },
      { title: "Execute", md: "The physical plan runs as **RDD manipulations** on the cluster; Spark generates native Java bytecode at runtime that can remove whole tasks or stages, and returns the result." },
    ],
  },
  {
    kind: "code",
    lang: "python",
    code: `df = spark.read.format("json").load("/mnt/defg/flight-data/json/2015-summary.json")
df.printSchema()
df.createOrReplaceTempView("dfTable")     # now also queryable with spark.sql(...)
df.select("DEST_COUNTRY_NAME").where(df["count"] > 10).show()`,
    caption: "Creating and querying a DataFrame (the flight-data example from Spark: The Definitive Guide).",
  },
  { kind: "concepts", ids: ["dataframe", "catalyst", "partitions"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Why can't Spark optimize a sequence of RDD operations well?", answer: "RDD operations are imperative (how, not what) and opaque functions; Spark cannot see inside them, so the given order is executed as is." },
      { prompt: "DataFrame vs Dataset?", answer: "DataFrame: untyped (types checked at runtime), a Dataset of Row. Dataset: typed at compile time, Scala and Java only." },
      { prompt: "List the stages of structured API execution.", answer: "Code → unresolved logical plan → (catalog) resolved → Catalyst-optimized logical plan → physical plans → best by cost model → executed as RDDs." },
    ],
  },
];

const sparkVsHadoop: Block[] = [
  {
    kind: "table",
    headers: ["", "Hadoop MapReduce", "Spark"],
    rows: [
      ["What it is", "Computation model + HDFS storage + ecosystem", "A processing framework, not a storage system (uses HDFS, S3, Cassandra…)"],
      ["Intermediate data", "Written to and read from HDFS between jobs", "Kept in memory (cacheable), spilled to disk if needed"],
      ["Programming model", "Map and reduce only; long Java programs", "Many transformations and actions in Java, Scala, Python, R; a few lines"],
      ["Execution", "One job at a time, eagerly", "Lazy: a DAG of stages and tasks built when an action runs"],
      ["Iterative algorithms (ML)", "One MapReduce job per iteration, through HDFS", "Iterations share data in memory"],
      ["Interactive / streaming", "No real-time processing", "Spark Streaming, interactive shells"],
      ["Speed", "100 TB sort: 72 min on 2100 machines", "100 TB sort: 23 min on 207 machines"],
      ["Fault tolerance", "Re-run failed tasks; data replicated in HDFS", "Recompute lost RDD partitions from lineage"],
    ],
  },
  {
    kind: "recall",
    cards: [
      { prompt: "Give three differences between Spark and Hadoop MapReduce.", answer: "E.g. in-memory vs disk between steps; lazy DAG execution vs eager jobs; rich API in several languages vs map/reduce in Java; iterative/interactive support; much faster." },
      { prompt: "Does Spark replace HDFS?", answer: "No — Spark is a processing framework, not a storage system; it commonly reads from and writes to HDFS." },
    ],
  },
];

const mistakes: Block[] = [
  { kind: "info", variant: "pitfall", title: "Thinking a transformation runs immediately", md: "`rdd.map(f)` computes nothing. Only an action — collect, count, reduce, take, save — triggers the job." },
  { kind: "info", variant: "pitfall", title: "Reusing an RDD without caching it", md: "Every action recomputes the chain from the source. Persist an RDD that several actions use." },
  { kind: "info", variant: "pitfall", title: "Confusing map with flatMap", md: "map produces exactly one output per input (a list stays a list); flatMap flattens the results into separate elements." },
  { kind: "info", variant: "pitfall", title: "Calling Spark a storage system", md: "Spark processes data; storage comes from HDFS, S3, databases and other sources." },
];

const quiz: Block[] = [{ kind: "prose", md: "Ten questions on Hadoop, Spark's architecture, RDDs and DataFrames." }];

const summary: Block[] = [
  { kind: "list", variant: "takeaways", items: lecture08Meta.takeaways },
  {
    kind: "table",
    headers: ["Concept", "Remember"],
    rows: [
      ["RDD", "Immutable, resilient, distributed, lazy, cacheable, fault-tolerant"],
      ["Transformation", "map, filter, flatMap, distinct, union, intersection, subtract, cartesian — lazy, returns an RDD"],
      ["Action", "collect, count, countByValue, take, top, reduce — returns a value, triggers the DAG"],
      ["Persistence", "cache()/persist(): memory, disk or mixed; ≥ 10× speed-up"],
      ["Partitions", "2–4 per CPU, automatic by default"],
      ["DataFrame", "Dataset[Row], schema checked at runtime"],
      ["Execution", "logical plan → Catalyst → physical plan (cost model) → RDDs"],
    ],
  },
];

export const lecture08Blocks: SectionBlocks<typeof lecture08Outline> = {
  objectives,
  hadoop,
  spark,
  rdds,
  "rdd-operations": rddOperations,
  dataframes,
  "spark-vs-hadoop": sparkVsHadoop,
  mistakes,
  quiz,
  summary,
};
