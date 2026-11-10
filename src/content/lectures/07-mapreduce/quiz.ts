import type { QuizQuestion } from "@/content/types";

export const lecture07Quiz: QuizQuestion[] = [
  {
    id: "q-trimming",
    prompt: "Trimming the last bases of every DNA read: can an index help, and what does parallelism buy?",
    options: [
      { id: "a", text: "An index makes it O(log N)." },
      { id: "b", text: "No index helps — every record must be touched, so it is O(N); with k workers it takes O(N/k)." },
      { id: "c", text: "Sorting the reads first makes it O(1)." },
      { id: "d", text: "Parallelism cannot help with O(N) tasks." },
    ],
    answerId: "b",
    explanation:
      "Indexes help needle-in-a-haystack problems such as finding GATTACGATATTA. A task that transforms every record is fundamentally $O(N)$; distributing the records over $k$ computers that apply the same function makes it $O(N/k)$.",
  },
  {
    id: "q-signature",
    prompt: "Which pair of signatures describes the MapReduce programming model?",
    options: [
      { id: "a", text: "map(key, list(value)) → value and reduce(key, value) → list(key, value)" },
      { id: "b", text: "map(in_key, in_value) → list(out_key, intermediate_value) and reduce(out_key, list(intermediate_value)) → list(out_value)" },
      { id: "c", text: "map(table) → table and reduce(table, table) → table" },
      { id: "d", text: "map(value) → value and reduce(value, value) → value" },
    ],
    answerId: "b",
    explanation: "Map turns one input key-value pair into intermediate pairs; after grouping, reduce receives one key with the list of all its values. Both are inspired by functional programming (Lisp, Scheme, Haskell).",
  },
  {
    id: "q-shuffle",
    prompt: "Why does word count across 5M documents need a shuffle, not just more map tasks?",
    options: [
      { id: "a", text: "Map tasks cannot count." },
      { id: "b", text: "Map tasks produce many small per-document histograms; the shuffle guarantees that one reducer sees every occurrence of a given word, wherever it appeared." },
      { id: "c", text: "To sort the documents by length." },
      { id: "d", text: "To replicate the input for fault tolerance." },
    ],
    answerId: "b",
    explanation: "We want one big histogram, not a bunch of little ones. Grouping by key sends all (word, count) pairs for the same word to the same reducer, which adds them up.",
  },
  {
    id: "q-combiner",
    prompt: "When may the reduce function also be used as a combiner inside the map tasks?",
    options: [
      { id: "a", text: "Always." },
      { id: "b", text: "When it is associative and commutative, like a sum or a max." },
      { id: "c", text: "Only when there is a single reduce task." },
      { id: "d", text: "Only for joins." },
    ],
    answerId: "b",
    explanation: "Then values can be combined in any order and grouping — partially in each map task, finally in the reducer — with the same result. An average, for example, cannot be combined naively.",
  },
  {
    id: "q-failure",
    prompt: "A map worker fails after completing its map tasks. What does the master do?",
    options: [
      { id: "a", text: "Nothing — completed tasks are done." },
      { id: "b", text: "Restarts the whole job." },
      { id: "c", text: "Redoes all its map tasks, even completed ones, because their output was on that node's local disk, and tells the reducers the new locations." },
      { id: "d", text: "Redoes only the reduce tasks." },
    ],
    answerId: "c",
    explanation: "Intermediate map output lives on the worker's local disk, not in the DFS, so it is lost with the node. Only a failure of the master node forces restarting the entire job.",
  },
  {
    id: "q-inverted",
    prompt: "In an inverted index job over tweets, what does the map function emit for “tweet1: I love pancakes for breakfast”?",
    options: [
      { id: "a", text: "(tweet1, [i, love, pancakes, for, breakfast])" },
      { id: "b", text: "(i, tweet1), (love, tweet1), (pancakes, tweet1), (for, tweet1), (breakfast, tweet1)" },
      { id: "c", text: "(pancakes, 1), (breakfast, 1)" },
      { id: "d", text: "(tweet1, 5)" },
    ],
    answerId: "b",
    explanation: "Each word becomes a key with the document id as value; the reducer for *pancakes* then receives [tweet1, tweet2] and outputs (pancakes, (tweet1, tweet2)).",
  },
  {
    id: "q-join-key",
    prompt: "Joining Employee(Name, SSN) with AssignedDepartments(EmpSSN, DepName) in MapReduce, what is the map output key, and why tag the values with the relation name?",
    options: [
      { id: "a", text: "The name; tags are optional." },
      { id: "b", text: "The SSN, so matching tuples meet in one reducer; the tag tells the reducer which tuples come from which relation so it pairs Employees with Departments." },
      { id: "c", text: "A random number, to balance load." },
      { id: "d", text: "The department name, so departments are grouped." },
    ],
    answerId: "b",
    explanation: "The join attribute is the key. The reducer for 777777777 receives Tony's employee tuple and two department tuples and outputs Tony–Sales and Tony–Marketing.",
  },
  {
    id: "q-difference",
    prompt: "How is R − S computed with MapReduce?",
    options: [
      { id: "a", text: "Map emits (t, t) for both; reduce outputs t if it has two values." },
      { id: "b", text: "Map emits (t, R) or (t, S); reduce outputs (t, t) only if the value list is exactly [R]." },
      { id: "c", text: "Map filters out tuples of S; no reduce needed." },
      { id: "d", text: "It cannot be computed." },
    ],
    answerId: "b",
    explanation: "The reducer must know where each copy of t came from, so the value is the relation name. Option (a) describes intersection.",
  },
  {
    id: "q-matvec",
    prompt: "Matrix-vector product x = Mv with v in memory at every map task: what does map emit for element mᵢⱼ?",
    options: [
      { id: "a", text: "(j, mᵢⱼ)" },
      { id: "b", text: "(i, mᵢⱼ · vⱼ)" },
      { id: "c", text: "((i, j), vⱼ)" },
      { id: "d", text: "(vⱼ, i)" },
    ],
    answerId: "b",
    explanation: "All terms of $x_i = \\sum_j m_{ij} v_j$ get the key $i$; the reducer sums them. If $v$ doesn't fit in memory, split $M$ into vertical stripes and $v$ into matching horizontal stripes.",
  },
  {
    id: "q-matmul",
    prompt: "In the one-step matrix multiplication C = AB with A of size m × n and B of size n × p, how many key-value pairs does one entry A[i, j] produce?",
    options: [
      { id: "a", text: "1" },
      { id: "b", text: "m" },
      { id: "c", text: "p — one for every output cell (i, k) in row i" },
      { id: "d", text: "n" },
    ],
    answerId: "c",
    explanation: "A[i, j] contributes to every output column of row $i$, so it is sent to keys $(i, 1), \\ldots, (i, p)$. Symmetrically, B[j, k] is sent to the $m$ keys $(1, k), \\ldots, (m, k)$.",
  },
];
