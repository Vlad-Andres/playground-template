import type { QuizQuestion } from "@/content/types";

export const lecture08Quiz: QuizQuestion[] = [
  {
    id: "q-hadoop-fit",
    prompt: "Which workload is Hadoop NOT a good fit for?",
    options: [
      { id: "a", text: "Batch-processing a few terabyte-sized files." },
      { id: "b", text: "Low-latency access to lots of small files with multiple writers modifying them." },
      { id: "c", text: "A single-pass map-only job." },
      { id: "d", text: "Classic MapReduce aggregation." },
    ],
    answerId: "b",
    explanation: "Hadoop is built around large blocks and batch processing. Low-latency access, many small files, multiple writers and arbitrary file modifications are what it is not good at.",
  },
  {
    id: "q-iterative",
    prompt: "Why is Hadoop MapReduce slow for iterative algorithms such as most machine learning?",
    options: [
      { id: "a", text: "It cannot run more than one job." },
      { id: "b", text: "Each iteration is a separate job that reads its input from and writes its output to HDFS — replication, serialisation and disk I/O every time." },
      { id: "c", text: "Its map functions are interpreted." },
      { id: "d", text: "It does not support reduce." },
    ],
    answerId: "b",
    explanation: "Data sharing between iterations goes through HDFS. Spark keeps the intermediate data in memory between iterations instead.",
  },
  {
    id: "q-benchmark",
    prompt: "In the Daytona GraySort benchmark (sort 100 TB), how did Spark's 2014 record compare to Hadoop's 2013 record?",
    options: [
      { id: "a", text: "Same time, same machines." },
      { id: "b", text: "23 minutes on 207 machines versus 72 minutes on 2100 machines." },
      { id: "c", text: "Hadoop was faster." },
      { id: "d", text: "Spark could not sort on disk." },
    ],
    answerId: "b",
    explanation: "Roughly 3× faster with a tenth of the machines — on disk. Spark also sorted 1 PB in 4 hours.",
  },
  {
    id: "q-rdd",
    prompt: "Which property does NOT describe an RDD?",
    options: [
      { id: "a", text: "Immutable" },
      { id: "b", text: "Lazily evaluated" },
      { id: "c", text: "Updated in place by transformations" },
      { id: "d", text: "Fault-tolerant" },
    ],
    answerId: "c",
    explanation: "RDDs are immutable: a transformation returns a pointer to a new RDD and never changes the old one. That immutability is what makes recomputing lost partitions from the lineage safe.",
  },
  {
    id: "q-lazy",
    prompt: "x = rdd.map(f).map(g) — what happens when this line runs?",
    options: [
      { id: "a", text: "Both maps run immediately on the cluster." },
      { id: "b", text: "Nothing is computed; x records the transformations. Computation starts from rdd when an action such as x.reduce(…) runs." },
      { id: "c", text: "Only the first map runs." },
      { id: "d", text: "The data is collected to the driver." },
    ],
    answerId: "b",
    explanation: "Transformations are lazy. print(x.reduce(…)) starts the computation from rdd; a later print(x.map(…).count()) starts it from rdd again.",
  },
  {
    id: "q-persist",
    prompt: "Two actions use the same expensive RDD. What is the drawback of lazy evaluation here, and the fix?",
    options: [
      { id: "a", text: "None — Spark remembers every result automatically." },
      { id: "b", text: "Its partitions are computed twice; persist (cache) the RDD in memory or on disk." },
      { id: "c", text: "The second action fails." },
      { id: "d", text: "Use a reduce instead of a map." },
    ],
    answerId: "b",
    explanation: "Many partitions get computed multiple times, lengthening execution. RDD persistence keeps them across operations, at different levels (memory, disk, mixed), for at least a 10× speed-up.",
  },
  {
    id: "q-flatmap",
    prompt: "rdd1 = {\"coffee panda\", \"happy panda\", \"happiest panda party\"}. What does rdd1.flatMap(tokenize) return?",
    options: [
      { id: "a", text: "[[\"coffee\",\"panda\"], [\"happy\",\"panda\"], [\"happiest\",\"panda\",\"party\"]]" },
      { id: "b", text: "{\"coffee\", \"panda\", \"happy\", \"panda\", \"happiest\", \"panda\", \"party\"}" },
      { id: "c", text: "{\"coffee\", \"panda\", \"happy\", \"happiest\", \"party\"}" },
      { id: "d", text: "3" },
    ],
    answerId: "b",
    explanation: "map(tokenize) gives one list per element (option a); flatMap flattens the lists into one RDD of words, duplicates included.",
  },
  {
    id: "q-actions",
    prompt: "For an RDD containing {1, 2, 3, 3}, what do count() and reduce((x, y) => x + y) return?",
    options: [
      { id: "a", text: "3 and 6" },
      { id: "b", text: "4 and 9" },
      { id: "c", text: "4 and 6" },
      { id: "d", text: "{1, 2, 3} and 9" },
    ],
    answerId: "b",
    explanation: "count() counts all four elements; reduce sums them to 9. countByValue() would give {(1, 1), (2, 1), (3, 2)}, take(2) {1, 2} and top(2) {3, 3}.",
  },
  {
    id: "q-dataframe",
    prompt: "What does a DataFrame give you that an RDD does not?",
    options: [
      { id: "a", text: "Mutability." },
      { id: "b", text: "A schema of named, typed columns, so Spark knows what you want and can optimize the plan." },
      { id: "c", text: "Storage on disk." },
      { id: "d", text: "Execution without a cluster." },
    ],
    answerId: "b",
    explanation: "RDD operations are imperative — map and reduce specify *how*, not *what*, and a single RDD operation cannot be optimized. Structure limits what you can express but enables optimization.",
  },
  {
    id: "q-execution",
    prompt: "In which order does Spark execute DataFrame, Dataset or SQL code?",
    options: [
      { id: "a", text: "Physical plan → logical plan → code." },
      { id: "b", text: "Code → logical plan (optimized by Catalyst) → physical plan chosen by a cost model → executed as RDD manipulations on the cluster." },
      { id: "c", text: "Code is compiled straight to MapReduce jobs." },
      { id: "d", text: "Code → RDD → SQL." },
    ],
    answerId: "b",
    explanation: "Valid code becomes an unresolved logical plan, which the catalog resolves and Catalyst optimizes; Spark generates candidate physical plans, picks one by cost, and runs it over RDDs.",
  },
];
