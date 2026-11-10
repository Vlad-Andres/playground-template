import type { LectureMeta, SectionOutline } from "@/content/types";

export const lecture08Outline = [
  { id: "objectives", title: "Learning objectives", kind: "objectives" },
  { id: "hadoop", title: "Apache Hadoop and its limits", kind: "intuition" },
  { id: "spark", title: "Apache Spark: what it is and how it runs", kind: "concepts" },
  { id: "rdds", title: "RDDs: transformations, actions, lazy evaluation", kind: "playground" },
  { id: "rdd-operations", title: "Working with RDDs", kind: "examples" },
  { id: "dataframes", title: "Spark SQL: DataFrames and Datasets", kind: "concepts" },
  { id: "spark-vs-hadoop", title: "Spark versus Hadoop MapReduce", kind: "concepts" },
  { id: "mistakes", title: "Common mistakes", kind: "mistakes" },
  { id: "quiz", title: "Check your understanding", kind: "quiz" },
  { id: "summary", title: "Cheat sheet", kind: "summary" },
] as const satisfies readonly SectionOutline[];

export const lecture08Meta: LectureMeta = {
  slug: "apache-spark",
  number: 8,
  title: "Introduction to Apache Spark",
  subtitle: "From Hadoop to Spark: RDDs, lazy evaluation and DataFrames",
  summary:
    "Hadoop made MapReduce on commodity clusters practical, but writes every intermediate result to disk — slow for iterative and interactive work. Spark keeps data in memory, builds an execution graph and computes it lazily. This lecture covers the Hadoop ecosystem and its limits, how Spark is built and how it runs, RDDs with their transformations and actions, and the structured DataFrame and Dataset APIs with their optimized execution.",
  topics: ["Hadoop ecosystem", "Hadoop limitations", "Spark architecture", "RDDs", "Transformations and actions", "Lazy evaluation", "Caching", "Partitions", "DataFrames", "Catalyst"],
  difficulty: "core",
  estimatedMinutes: 70,
  sources: [
    { label: "From Apache Hadoop to Apache Spark", kind: "slides", detail: "Yannis Velegrakis — slides 1–42" },
    { label: "Apache Spark tutorial", kind: "notes", detail: "Spark Core basics, with Learning Apache Spark with Python and Spark: The Definitive Guide as references" },
  ],
  objectives: [
    "Describe Hadoop and its ecosystem, what it is not a good fit for, and its limitations.",
    "Explain what Spark is, its components, and how a Spark application runs on a cluster.",
    "Define an RDD and its properties, and tell transformations from actions.",
    "Explain lazy evaluation, its drawback, and how persistence solves it.",
    "Use common RDD transformations and actions and predict their results.",
    "Explain what DataFrames and Datasets add over RDDs and how Spark executes structured queries.",
    "Compare Spark with Hadoop MapReduce.",
  ],
  takeaways: [
    "Hadoop = MapReduce + HDFS + an ecosystem (YARN, Hive, HBase, Pig, ZooKeeper…); it is not for low latency, many small files or arbitrary file modifications.",
    "Hadoop is slow for iterative work: every MapReduce job reads from and writes to HDFS, with replication, serialisation and disk I/O.",
    "Spark is a general-purpose cluster computing framework with in-memory computation, an execution graph, and APIs in Java, Scala, Python and R; it is a processing framework, not storage.",
    "A driver program with a SparkContext talks to a cluster manager, which runs executors (with tasks and a cache) on worker nodes.",
    "An RDD is an immutable, distributed, partitioned collection that is lazily evaluated, cacheable and fault-tolerant through its lineage.",
    "Transformations (map, filter, flatMap, union…) return new RDDs lazily; actions (collect, count, reduce, take…) trigger the computation of the DAG.",
    "Without persistence every action recomputes the chain; cache()/persist() keeps an RDD in memory or on disk (≥ 10× faster).",
    "DataFrames and Datasets are distributed tables with schemas; their code goes through a logical plan, the Catalyst optimizer and a physical plan before running as RDD operations.",
  ],
  outline: lecture08Outline,
};
