import type { LectureMeta, SectionOutline } from "@/content/types";

export const lecture07Outline = [
  { id: "objectives", title: "Learning objectives", kind: "objectives" },
  { id: "scalable", title: "What scalable means", kind: "intuition" },
  { id: "model", title: "The MapReduce model", kind: "playground" },
  { id: "execution", title: "How a MapReduce job runs", kind: "visual" },
  { id: "inverted-index", title: "Building an inverted index", kind: "examples" },
  { id: "relational", title: "Relational algebra and joins", kind: "examples" },
  { id: "matrices", title: "Matrix-vector and matrix multiplication", kind: "examples" },
  { id: "mistakes", title: "Common mistakes", kind: "mistakes" },
  { id: "quiz", title: "Check your understanding", kind: "quiz" },
  { id: "summary", title: "Cheat sheet", kind: "summary" },
] as const satisfies readonly SectionOutline[];

export const lecture07Meta: LectureMeta = {
  slug: "mapreduce",
  number: 7,
  title: "MapReduce",
  subtitle: "Map, shuffle, reduce — and the classic algorithms written in it",
  summary:
    "When data outgrows one machine, scalable means “can make use of thousands of cheap computers” and “one pass over the data”. MapReduce makes that programmable with two functions: map turns each input into key-value pairs, the system groups them by key, and reduce combines each group. This lecture builds the model from small examples, explains how Hadoop executes a job and survives failures, and works through the algorithms you must be able to write: word count, an inverted index, relational operators and joins, and matrix multiplication.",
  topics: ["Scalability", "Map", "Shuffle", "Reduce", "Combiners", "Hadoop execution", "Inverted index", "Joins", "Matrix multiplication"],
  difficulty: "core",
  estimatedMinutes: 80,
  sources: [
    { label: "Map-Reduce and Parallel Algorithms", kind: "slides", detail: "Lecture slides, based on Bill Howe (UW)" },
    { label: "Mining of Massive Datasets, Chapter 2", kind: "chapter", detail: "MapReduce and the new software stack, §2.1–§2.3" },
    { label: "MapReduce: Simplified Data Processing on Large Clusters", kind: "notes", detail: "Dean & Ghemawat (Google, 2004) — optional reading" },
  ],
  objectives: [
    "Explain what scalable means today and why tasks that must touch every record need parallelism.",
    "Describe the MapReduce programming model: map, grouping by key (shuffle), reduce, and their signatures.",
    "Write map and reduce functions for word count and similar counting tasks, and say when a combiner is allowed.",
    "Describe how a job executes on Hadoop — master, workers, splits, local intermediate files — and how node failures are handled.",
    "Write a MapReduce program that builds an inverted index.",
    "Implement selection, projection, union, intersection, difference, natural join and grouping with MapReduce.",
    "Multiply a matrix by a vector, and two matrices in two steps or one, with MapReduce.",
  ],
  takeaways: [
    "Scalable now means using thousands of cheap computers and getting one pass over the data; an O(N) task over N records on k workers takes O(N/k).",
    "map(in_key, in_value) → list(out_key, intermediate_value); the system groups by key; reduce(out_key, list(intermediate_value)) → list(out_value).",
    "Every key goes to exactly one reducer, so a reducer sees every occurrence of its key regardless of which input it came from.",
    "A combiner runs the reduce function inside map tasks; it is valid when the reduce function is associative and commutative.",
    "The master splits the input into M map tasks and R reduce tasks; map output stays on local disk, so a failed map worker's tasks are redone even if finished; only a master failure restarts the job.",
    "Inverted index: map emits (word, document id), reduce collects the list of documents per word.",
    "Natural join R(A,B) ⋈ S(B,C): map emits (b, (R, a)) and (b, (S, c)); reduce pairs every R value with every S value for that b.",
    "Matrix multiplication: two jobs (join on j, then group by (i, k) and sum) or one job keyed by output cell (i, k) that matches values on j.",
  ],
  outline: lecture07Outline,
};
