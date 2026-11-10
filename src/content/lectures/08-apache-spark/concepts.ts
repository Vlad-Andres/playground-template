import type { Concept } from "@/content/types";

export const lecture08Concepts: Concept[] = [
  {
    id: "hadoop",
    term: "Apache Hadoop",
    short: "An open-source Java ecosystem for big data: MapReduce for computation, HDFS for storage.",
    detail: "HDFS is inspired by GFS, MapReduce by Google's computation model; around them sit YARN, Hive, HBase, Pig, ZooKeeper, Sqoop, Oozie, Flume and more. Supported by Yahoo!, Facebook, Twitter, IBM and Microsoft.",
    tags: ["hadoop"],
  },
  {
    id: "hadoop-limits",
    term: "Hadoop limitations",
    short: "Small files, slow processing, latency, verbose code, no real-time and no efficient iterative processing.",
    detail: "Slowness comes from replication, I/O and serialisation: every iteration of an algorithm is a MapReduce job that reads from and writes to HDFS.",
    tags: ["hadoop"],
  },
  {
    id: "spark",
    term: "Apache Spark",
    short: "An efficient, fast, general-purpose cluster computing framework with high-level APIs in Java, Scala, Python and R.",
    detail: "Developed from 2009 at UC Berkeley's AMPLab and open source since 2010. It builds an execution graph, computes in memory, and needs far less code than MapReduce. Spark is a processing framework, not a storage system.",
    tags: ["spark"],
  },
  {
    id: "spark-runtime",
    term: "Driver, cluster manager, executors",
    short: "The driver program holds the SparkContext; a cluster manager assigns worker nodes; executors run tasks and cache data.",
    detail: "The cluster manager can be Spark's standalone scheduler, YARN or Mesos. An action makes the driver turn the DAG into stages, each executed as a series of tasks on the executors.",
    tags: ["spark"],
  },
  {
    id: "rdd",
    term: "RDD",
    short: "Resilient Distributed Dataset: an immutable collection of records partitioned across the nodes of a cluster.",
    detail: "Immutable, resilient, distributed, lazily evaluated, cacheable/persistent and fault-tolerant. *Resilient* means missing or damaged partitions can be recomputed after a node failure from the chain of transformations that produced them.",
    tags: ["rdd"],
  },
  {
    id: "transformation-action",
    term: "Transformations and actions",
    short: "Transformations return a new RDD and are lazy; actions return a value to the driver and trigger computation.",
    detail: "map, flatMap, filter, distinct, union, intersection, subtract and cartesian are transformations; collect, count, countByValue, take, top and reduce are actions.",
    tags: ["rdd"],
  },
  {
    id: "lazy-evaluation",
    term: "Lazy evaluation and persistence",
    short: "Nothing is computed until an action needs a result; then the whole chain is computed from the source.",
    detail: "Laziness lets Spark see the whole DAG before running it, but partitions used by several actions are recomputed each time. cache()/persist() keeps an RDD in memory, on disk or both — a speed-up of at least 10×.",
    tags: ["rdd"],
  },
  {
    id: "partitions",
    term: "Partitions",
    short: "The pieces of an RDD spread over the nodes; usually 2–4 per CPU, chosen automatically by default.",
    detail: "Transformations apply to every element by default; mapPartitions applies a function to a whole partition at once, and users can define their own partitioning functions.",
    tags: ["rdd"],
  },
  {
    id: "dataframe",
    term: "DataFrame and Dataset",
    short: "Distributed, table-like, immutable collections with well-defined rows and columns and a schema.",
    detail: "DataFrames are ‘untyped’: types exist but are checked by Spark at runtime; a DataFrame is a Dataset of type Row. Datasets are typed at compile time and available in Scala and Java. Both are optimizable, unlike single RDD operations.",
    tags: ["spark sql"],
  },
  {
    id: "catalyst",
    term: "Structured API execution",
    short: "Code → unresolved logical plan → optimized logical plan (Catalyst) → physical plans → best by cost model → RDD operations on the cluster.",
    detail: "The logical plan only represents abstract transformations; the catalog resolves tables and columns, Catalyst optimizes, a cost model picks the physical plan, and Spark generates bytecode at runtime.",
    tags: ["spark sql"],
  },
];
