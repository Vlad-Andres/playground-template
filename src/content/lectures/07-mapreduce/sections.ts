import type { Block, SectionBlocks } from "@/content/types";
import { lecture07Meta, lecture07Outline } from "./meta";
import { MapReduceLab } from "./interactive/MapReduceLab";

const objectives: Block[] = [
  {
    kind: "prose",
    md: "You are expected to know what MapReduce is and to be able to **write a MapReduce program for basic tasks**. The study material is chapter 2 of *Mining of Massive Datasets*; know its examples — building an inverted index, multiplying matrices, and computing joins. The original Google paper (Dean & Ghemawat) is optional reading.",
  },
  { kind: "list", variant: "objectives", items: lecture07Meta.objectives },
];

const scalable: Block[] = [
  {
    kind: "table",
    headers: ["What does scalable mean?", "In the past", "Now / soon"],
    rows: [
      ["Operationally", "Works even if data doesn't fit in main memory", "Can make use of 1000s of cheap computers"],
      ["Formally", "No more than Nᵏ operations — polynomial time", "No more than N · log N operations — and only one pass at the data, so make it count"],
    ],
  },
  {
    kind: "steps",
    title: "Finding GATTACGATATTA",
    steps: [
      { title: "Scan", md: "Compare the target with every sequence: 40 records, 40 comparisons — $N$ records, $N$ comparisons, $O(N)$." },
      { title: "Sort, then binary search", md: "Start at the 50% mark, skip to 75%, back to 62.5%, 68.75%… 40 records, only 4 comparisons: $O(\\log N)$, far better scalability." },
      { title: "Databases do this for you", md: "Relational databases are good at *needle in a haystack* problems — extracting small results from big data. `CREATE INDEX seq_idx ON sequence(seq)` is built once and used automatically." },
    ],
  },
  {
    kind: "prose",
    md: "**Read trimming** is different: trim the final $n$ bases of every sequence and produce a new dataset. No index helps — every record must be touched, so the task is fundamentally $O(N)$. What helps is parallelism: distribute the reads among $k$ computers, apply the trimming function $f$ to every item, and 40 records on 6 workers take 7 cycles — $O(N/k)$.\n\nThe same pattern appears everywhere: convert 405k TIFF images to PNG (the *New York Times* archive), run thousands of small simulations, find the most common word in each of millions of documents, compute each document's word frequencies. **There's a pattern here**: a function maps one item to a result, applied independently to every item.",
  },
  {
    kind: "info",
    variant: "warning",
    title: "But what about one histogram over all documents?",
    md: "Mapping each document to its word frequencies yields many little histograms. We want **one big histogram**: how can a single computer see every occurrence of a given word, regardless of which document it appeared in? That question is what MapReduce answers.",
  },
  { kind: "concepts", ids: ["scalable"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What does scalable mean operationally today?", answer: "Can make use of thousands of cheap computers (and you may get only one pass over the data)." },
      { prompt: "Why can't an index speed up read trimming?", answer: "Every record must be touched; the task is fundamentally O(N). Only parallelism helps: O(N/k) with k workers." },
    ],
  },
];

const model: Block[] = [
  {
    kind: "prose",
    md: "Take the **word-length histogram**: how many big (10+ letters), medium (5–9), small (2–4) and tiny (1) words does a document use? Split the document into chunks and process each chunk on a different computer: map task 1 (204 words) emits (yellow, 20), (red, 71), (blue, 93), (pink, 6); map task 2 (190 words) emits (yellow, 17), (red, 77), (blue, 107), (pink, 3). The **shuffle** step brings the pairs with the same key together — (yellow, 17) with (yellow, 20) — and the **reduce** tasks add them: (yellow, 37), (red, 148), (blue, 200), (pink, 9).",
  },
  {
    kind: "info",
    variant: "insight",
    title: "The MapReduce programming model",
    md: "Input and output are each a set of **key/value pairs**. The programmer specifies two functions:\n\n- `map(in_key, in_value) -> list(out_key, intermediate_value)` processes an input pair and produces a set of intermediate pairs;\n- `reduce(out_key, list(intermediate_value)) -> list(out_value)` combines all intermediate values for one key and produces a set of merged output values (usually just one).\n\nIn between, the system **groups by key**. The model is inspired by primitives from functional languages such as Lisp, Scheme and Haskell.",
  },
  {
    kind: "code",
    lang: "python",
    code: `def map(input_key, input_value):
    # input_key: document name, input_value: document contents
    for word in input_value.split():
        emit_intermediate(word, 1)

def reduce(output_key, intermediate_values):
    # output_key: a word, intermediate_values: a list of counts
    result = 0
    for v in intermediate_values:
        result += v
    emit(output_key, result)`,
    caption: "“What does this do?” — Google's classic example: word count.",
  },
  {
    kind: "interactive",
    title: "MapReduce, stage by stage",
    description: "Pick a job from the lecture, edit its input, and watch the map output, the shuffle and the reducers.",
    component: MapReduceLab,
  },
  {
    kind: "prose",
    md: "**In more detail** (MMDS §2.2). A **map task** gets one or more chunks of the input and turns each element into zero or more key-value pairs — keys need not be unique. **Grouping by key** is done by the system: the master picks the number $r$ of reduce tasks, a hash function sends every key to one of them, and all values of a key are merged into one list. A **reduce task** receives some keys with their value lists; one application of the reduce function to one key is a *reducer*. Using fewer reduce tasks than keys reduces overhead, and since value lists differ in length (**skew**), more reduce tasks than compute nodes balances the load.",
  },
  {
    kind: "prose",
    md: "**Combiners.** When the reduce function is **associative and commutative** — values can be combined in any order and grouping — part of it can run inside each map task. Word count then sends one pair $(w, m)$ per map task instead of $m$ pairs $(w, 1)$. The reducers are still needed to combine the partial results of different map tasks. Try the combiner toggle above: same output, fewer pairs shuffled.",
  },
  {
    kind: "steps",
    title: "Count friends — a social-network example",
    intro: "Input: friendship pairs in both directions — (Jim, Sue), (Sue, Jim), (Lin, Joe), (Joe, Lin), (Jim, Kai), (Kai, Jim), (Jim, Lin), (Lin, Jim). Desired output: Jim 3, Lin 2, Sue 1, Kai 1, Joe 1.",
    steps: [
      { title: "Map", md: "For each pair (person, friend) emit (person, 1)." },
      { title: "Shuffle", md: "Jim → (1, 1, 1), Lin → (1, 1), Sue → (1), Kai → (1), Joe → (1)." },
      { title: "Reduce", md: "Sum the list: (Jim, 3), (Lin, 2), (Sue, 1), (Kai, 1), (Joe, 1)." },
    ],
  },
  { kind: "concepts", ids: ["map", "shuffle", "reduce", "combiner"] },
  {
    kind: "practice",
    id: "l7-model",
    tasks: [
      {
        id: "max-temp",
        prompt: "Input: lines (city, temperature). Write map and reduce functions that output the maximum temperature per city. Can the reduce function serve as a combiner?",
        check: { mode: "open" },
        solution: "Map: for (city, t) emit (city, t). Reduce: for (city, [t₁, …, tₙ]) emit (city, max(tᵢ)). **Yes** — max is associative and commutative, so each map task may pre-compute a local maximum per city.",
      },
      {
        id: "average",
        prompt: "Is “average” safe as a combiner if the reducer averages the combiners' outputs? Answer yes or no.",
        check: { mode: "text", accept: ["no"], placeholder: "yes / no" },
        solution: "**No** — the average of averages is wrong when groups have different sizes. Emit (sum, count) pairs instead and divide only in the final reducer.",
      },
    ],
  },
];

const execution: Block[] = [
  {
    kind: "table",
    headers: ["Implementation"],
    rows: [
      ["There is one master node."],
      ["The master partitions the input file into M splits, by key."],
      ["The master assigns workers (= servers) to the M map tasks and keeps track of their progress."],
      ["Workers write their output to local disk, partitioned into R regions."],
      ["The master assigns workers to the R reduce tasks."],
      ["Reduce workers read their regions from the map workers' local disks."],
    ],
  },
  {
    kind: "timeline",
    items: [
      { label: "Map task", title: "Split → record reader → map → combine", md: "Reads its split from HDFS, parses records, applies map and the optional combiner, and writes partitioned output to **local storage**." },
      { label: "Reduce task", title: "Copy → sort → reduce", md: "Copies its region from every map worker, sorts and merges by key, applies reduce, and writes the result as a file to **HDFS**." },
    ],
  },
  {
    kind: "prose",
    md: "**Hadoop at a glance**: data on HDFS is divided into input partitions, one map per partition, the map outputs are shuffled across the network, sorted in parallel, reduced, and written back to HDFS as output partitions.\n\n**Failures** (MMDS §2.2.6) are the normal case when thousands of components run for hours. The master pings workers periodically. If a **map worker** fails, all its map tasks are redone — even completed ones, because their output sat on that node's local disk — and the reduce tasks are told where to read instead. If a **reduce worker** fails, its running tasks are simply rescheduled. Only the failure of the **master** forces the whole job to restart.",
  },
  {
    kind: "prose",
    md: "**Where MapReduce runs.** Cluster computing uses a large number of commodity servers connected by a high-speed commodity network: a **rack** holds a small number of servers (8–64 in the book), a **data center** holds many racks, and racks are connected by a switch. In the design space of systems — transaction processing, shared-memory and data-parallel search, HPC, grid — this is **DISC**, data-intensive scalable computing. Of the parallel architectures (shared memory, shared disk, shared nothing), **shared nothing** scales to thousands of computers; shared memory is easiest to program, but expensive.\n\nIt relies on a **distributed file system** (MMDS §2.1): huge files, rarely updated, divided into chunks of typically 64 MB, each replicated (perhaps three times) on different racks, with a master node recording where the chunks are. Lecture 9 covers GFS and HDFS in detail.",
  },
  { kind: "concepts", ids: ["master-workers", "failures"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Where does map output go, and why does that matter for failures?", answer: "To the map worker's local disk, partitioned into R regions. If that worker fails, even its completed map tasks must be redone." },
      { prompt: "Which failure restarts the entire job?", answer: "Only the failure of the master node." },
      { prompt: "Name the phases of a map task and a reduce task.", answer: "Map: split, record reader, map, combine. Reduce: copy, sort, reduce." },
    ],
  },
];

const invertedIndex: Block[] = [
  {
    kind: "prose",
    md: "An **inverted index** lists, for every word, the documents that contain it — the core of every search engine. For example:",
  },
  {
    kind: "table",
    headers: ["Input", "Desired output"],
    rows: [
      ["tweet1, (“I love pancakes for breakfast”)", "“pancakes”, (tweet1, tweet2)"],
      ["tweet2, (“I dislike pancakes”)", "“breakfast”, (tweet1, tweet3)"],
      ["tweet3, (“What should I eat for breakfast?”)", "“eat”, (tweet3, tweet4)"],
      ["tweet4, (“I love to eat”)", "“love”, (tweet1, tweet4)"],
    ],
  },
  {
    kind: "code",
    lang: "python",
    code: `def map(tweet_id, text):
    for word in set(text.lower().split()):
        emit_intermediate(word, tweet_id)

def reduce(word, tweet_ids):
    emit(word, sorted(set(tweet_ids)))`,
    caption: "Inverted index. Choose “Inverted index” in the playground above to run exactly this.",
  },
  { kind: "concepts", ids: ["inverted-index"] },
  {
    kind: "practice",
    id: "l7-inverted",
    tasks: [
      {
        id: "positions",
        prompt: "Change the inverted index so it also records how often each word occurs in each document. What do map and reduce emit?",
        check: { mode: "open" },
        solution: "Map: for document d, count each word locally and emit (w, (d, count)). Reduce: for word w, output (w, list of (d, count)). Alternatively map emits ((w, d), 1), a first reduce sums, and a second job regroups by w.",
      },
    ],
  },
];

const relational: Block[] = [
  {
    kind: "table",
    headers: ["Operation (MMDS §2.3)", "Map", "Reduce"],
    rows: [
      ["Selection σ_C(R)", "For each tuple t satisfying C, emit (t, t)", "Identity (can even be skipped)"],
      ["Projection π_S(R)", "Emit (t′, t′) with t′ the tuple restricted to S", "Turn (t′, [t′, …, t′]) into (t′, t′) — duplicate elimination"],
      ["Union R ∪ S", "Emit (t, t) for tuples of both", "Emit (t, t) once"],
      ["Intersection R ∩ S", "Emit (t, t) for tuples of both", "Emit (t, t) only if the list is [t, t]"],
      ["Difference R − S", "Emit (t, R) or (t, S)", "Emit (t, t) only if the list is [R]"],
      ["Natural join R(A,B) ⋈ S(B,C)", "Emit (b, (R, a)) and (b, (S, c))", "For key b, output every (a, b, c) pairing an R value with an S value"],
      ["Grouping γ_{A,θ(B)}(R)", "For (a, b, c) emit (a, b)", "Apply θ (SUM, MAX…) to [b₁, …, bₙ]: emit (a, x)"],
    ],
    caption: "Relational-algebra operations in MapReduce.",
  },
  {
    kind: "steps",
    title: "A join: Employee ⋈ Assigned Departments",
    intro: "Employee(Name, SSN) = {(Sue, 999999999), (Tony, 777777777)}; Assigned Departments(EmpSSN, DepName) = {(999999999, Accounts), (777777777, Sales), (777777777, Marketing)}.",
    steps: [
      { title: "Before map: lump the tuples together", md: "Tag every tuple with its relation and put them in one dataset: (Employee, Sue, 999999999), …, (Department, 777777777, Marketing). The tags let the reducer tell the relations apart." },
      { title: "Map: key = the join attribute", md: "key = 999999999 → (Employee, Sue, 999999999) and (Department, 999999999, Accounts); key = 777777777 → Tony's employee tuple and the Sales and Marketing tuples. The SSN is the key so that matching tuples meet." },
      { title: "Reduce: pair them up", md: "Key 999999999 yields (Sue, 999999999, 999999999, Accounts); key 777777777 yields (Tony, …, Sales) and (Tony, …, Marketing)." },
      { title: "Same pattern, again", md: "Order(orderid, account, date) ⋈ LineItem(orderid, itemid, qty): key = orderid, values tagged “Order” or “Line”; the reducer for key 1 outputs (1, aaa, d1, 1, 10, 1) and (1, aaa, d1, 1, 20, 3)." },
    ],
  },
  { kind: "concepts", ids: ["mr-join"] },
  {
    kind: "practice",
    id: "l7-relational",
    tasks: [
      {
        id: "projection-combiner",
        prompt: "Projection eliminates duplicates in the reducer. Can a combiner help, and why are the reducers still needed?",
        check: { mode: "open" },
        solution: "Yes: duplicate elimination is associative and commutative, so each map task can drop its local duplicates. The reducers are still needed to remove identical tuples produced by **different** map tasks.",
      },
    ],
  },
];

const matrices: Block[] = [
  {
    kind: "prose",
    md: "**Matrix-vector multiplication** (MMDS §2.3.1) — at the heart of ranking web pages, where $n$ is in the trillions. $x_i = \\sum_j m_{ij} v_j$. If $v$ fits in main memory at every map task: **map** turns element $m_{ij}$ into $(i, m_{ij} v_j)$; **reduce** sums all values with key $i$ to get $(i, x_i)$. If $v$ does not fit, divide $M$ into vertical **stripes** and $v$ into horizontal stripes of the same height; each map task gets a chunk of one matrix stripe and the matching vector stripe.",
  },
  {
    kind: "prose",
    md: "**Matrix multiplication** $P = MN$, $p_{ik} = \\sum_j m_{ij} n_{jk}$, treats the matrices as relations $M(I, J, V)$ and $N(J, K, W)$. It is almost a natural join on $J$ followed by grouping and aggregation — so the book's first method uses **two MapReduce jobs**:\n\n1. **Map:** $m_{ij} \\to (j, (M, i, m_{ij}))$ and $n_{jk} \\to (j, (N, k, n_{jk}))$. **Reduce:** for key $j$, for every $M$ value and every $N$ value emit $((i, k), m_{ij} n_{jk})$.\n2. **Map:** identity. **Reduce:** for key $(i, k)$, sum the values.",
  },
  {
    kind: "prose",
    md: "**One MapReduce step** (MMDS §2.3.10, with a worked example below). Let $A$ be $m \\times n$ and $B$ be $n \\times p$. The key is the **output coordinate** $(i, k)$; one reducer per output cell computes $\\sum_j A[i,j] B[j,k]$.",
  },
  {
    kind: "code",
    lang: "python",
    code: `def map_A(i, j, a):
    for k in range(1, p + 1):          # A[i,j] contributes to every column of row i
        emit((i, k), ("A", j, a))

def map_B(j, k, b):
    for i in range(1, m + 1):          # B[j,k] contributes to every row of column k
        emit((i, k), ("B", j, b))

def reduce(key, values):
    left, right = {}, {}
    for tag, j, value in values:
        (left if tag == "A" else right)[j] = value
    total = sum(left[j] * right[j] for j in left.keys() & right.keys())
    emit(key, total)                    # unmatched entries count as zero`,
    caption: "Keep both the tag and j in every value: the reducer needs to know which operand it has and which can match it.",
  },
  {
    kind: "steps",
    title: "Worked example",
    intro: "$A = \\begin{pmatrix} 1 & 2 & 0 \\\\ -1 & 3 & 2 \\end{pmatrix}$, $B = \\begin{pmatrix} 4 & 0 \\\\ 0 & 5 \\\\ 6 & 7 \\end{pmatrix}$, so $m = 2$, $n = 3$, $p = 2$. Zeros are not stored.",
    steps: [
      { title: "Routing", md: "A[2,3] = 2 emits ((2,1), (A,3,2)) and ((2,2), (A,3,2)). B[3,2] = 7 emits ((1,2), (B,3,7)) and ((2,2), (B,3,7)). They meet at key (2,2)." },
      { title: "Key (1,1)", md: "A values (1,1), (2,2); B values (1,4), (3,6). Shared j = 1: $1 \\times 4 = 4$." },
      { title: "Key (1,2)", md: "A values (1,1), (2,2); B values (2,5), (3,7). Shared j = 2: $2 \\times 5 = 10$." },
      { title: "Key (2,1)", md: "A values (1,−1), (2,3), (3,2); B values (1,4), (3,6): $-1 \\times 4 + 2 \\times 6 = 8$." },
      { title: "Key (2,2)", md: "Shared j = 2 and 3: $3 \\times 5 + 2 \\times 7 = 29$. The A entry at j = 1 has no partner because B[1,2] = 0. So $C = \\begin{pmatrix} 4 & 10 \\\\ 8 & 29 \\end{pmatrix}$." },
    ],
  },
  {
    kind: "info",
    variant: "note",
    title: "One step or two?",
    md: "One step sends every entry of A to $p$ keys and every entry of B to $m$ keys. The book shows (§2.6.7) that two passes usually have lower communication cost — but both are correct, and both are fair exam material.",
  },
  { kind: "concepts", ids: ["mr-matmul"] },
  {
    kind: "practice",
    id: "l7-matrices",
    tasks: [
      {
        id: "copies",
        prompt: "A is 100 × 50 and B is 50 × 20. In the one-step algorithm, how many key-value pairs does each entry of B produce?",
        check: { mode: "text", accept: ["100"], placeholder: "pairs" },
        solution: "Each B[j, k] goes to every output row of column k: **m = 100** pairs. (Each A entry produces p = 20.)",
      },
    ],
  },
];

const mistakes: Block[] = [
  { kind: "info", variant: "pitfall", title: "Using a non-associative reducer as a combiner", md: "Averages, medians and “count distinct” cannot be combined naively. Combine (sum, count) pairs, or don't combine." },
  { kind: "info", variant: "pitfall", title: "Forgetting the relation tag in a join", md: "Without it the reducer cannot tell R-tuples from S-tuples and cannot pair them." },
  { kind: "info", variant: "pitfall", title: "Expecting completed map tasks to survive a failure", md: "Map output is on the worker's local disk; if the worker dies, its finished map tasks run again." },
  { kind: "info", variant: "pitfall", title: "Dropping j in matrix multiplication", md: "Every value must carry its inner index j, or the reducer multiplies the wrong entries." },
];

const quiz: Block[] = [{ kind: "prose", md: "Ten questions on the model, its execution and the algorithms you must be able to write." }];

const summary: Block[] = [
  { kind: "list", variant: "takeaways", items: lecture07Meta.takeaways },
  {
    kind: "table",
    headers: ["Task", "Map emits", "Reduce does"],
    rows: [
      ["Word count", "(w, 1) per word", "sum"],
      ["Inverted index", "(w, doc id)", "collect distinct ids"],
      ["Natural join on B", "(b, (R, a)), (b, (S, c))", "pair every R value with every S value"],
      ["Group by A, θ(B)", "(a, b)", "apply θ"],
      ["Matrix × vector", "(i, mᵢⱼ vⱼ)", "sum"],
      ["Matrix × matrix (one step)", "((i,k), (A, j, aᵢⱼ)) for all k; ((i,k), (B, j, bⱼₖ)) for all i", "match on j, multiply, sum"],
    ],
    caption: "The MapReduce programs to know.",
  },
];

export const lecture07Blocks: SectionBlocks<typeof lecture07Outline> = {
  objectives,
  scalable,
  model,
  execution,
  "inverted-index": invertedIndex,
  relational,
  matrices,
  mistakes,
  quiz,
  summary,
};
