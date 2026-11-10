import type { Block, SectionBlocks } from "@/content/types";
import { lecture04Meta, lecture04Outline } from "./meta";
import { ClusteringLab } from "@/widgets/dis/ClusteringLab";

const objectives: Block[] = [
  {
    kind: "prose",
    md: "A second guest lecture by Prof. Dr. Maximilian E. Schüle (Universität Bamberg). What the course expects you to know is **the idea of in-database machine learning and its benefits**. The rest of the lecture shows, step by step, that SQL is enough to express real learning algorithms — read those parts for understanding, not to memorise the queries.",
  },
  { kind: "list", variant: "objectives", items: lecture04Meta.objectives },
];

const why: Block[] = [
  {
    kind: "prose",
    md: "**In-database machine learning** means running machine learning directly where your data is stored, rather than extracting it into the memory of your system to run the algorithm there. Depending on the database, it may support training models, making predictions, or both.",
  },
  {
    kind: "table",
    headers: ["Benefit", "Why"],
    rows: [
      ["Less data movement", "No copying of large datasets between the database and a separate ML platform — saving transfer time and duplicated storage."],
      ["Fresher predictions", "Models work with current database records, without the delay of periodic exports."],
      ["Simpler workflows", "Data preparation and predictions fit into existing SQL queries, reports and applications, with fewer separate pipelines to maintain."],
      ["Easier access for analysts", "People who know SQL can use machine learning without building a full Python application."],
      ["More centralised security", "Keeping data in the database avoids exported copies and reuses existing access controls and auditing."],
      ["Efficient processing at scale", "Supported operations use the database's parallel processing instead of pulling large amounts of data onto a single machine."],
    ],
    caption: "The benefits the course expects you to know.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "Example",
    md: "An online store scores each customer's likelihood of leaving and joins those predictions directly with the customer records to produce a retention report — all inside the database, with no export, no separate pipeline and no copy of the customer data elsewhere.",
  },
  { kind: "concepts", ids: ["in-database-ml"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Define in-database machine learning.", answer: "Running machine learning (training, prediction or both) directly where the data is stored, instead of extracting it into a separate system." },
      { prompt: "List the six benefits.", answer: "Less data movement, fresher predictions, simpler workflows, easier access for SQL analysts, more centralised security, efficient processing at scale." },
      { prompt: "Give an example of in-database ML.", answer: "Scoring customers' churn likelihood and joining the predictions with customer records into a retention report, all in the database." },
    ],
  },
];

const kMeans: Block[] = [
  {
    kind: "prose",
    md: "We start with data mining. **k-means** (MacQueen 1967, Steinhaus 1957) groups points into $k$ clusters:\n\n1. select $k$ points as initial centres;\n2. assign each point to the nearest centre;\n3. compute each new centre as the middle (mean) of its cluster;\n4. repeat from step 2 until the clusters converge.\n\nThe running example has eight points: A(1, 5), B(3, 5), C(6, 1), D(7, 2), E(8, 1), F(8, 9), G(10, 8), H(12, 10), with $k = 3$ and initial centres A, B and H.",
  },
  {
    kind: "interactive",
    title: "k-means and DBSCAN on eight points",
    description: "Step through k-means from the initial centres A, B and H, or switch to DBSCAN and move ε and minPts.",
    component: ClusteringLab,
  },
  {
    kind: "steps",
    title: "The first iteration, by hand",
    steps: [
      { title: "Assign", md: "A is a centre itself → $C_1$. B, C, D and E are nearest to B → $C_2$ (e.g. C(6,1): squared distance 25 to B, 117 to H). F, G and H are nearest to H → $C_3$." },
      { title: "Recompute the centres", md: "$C_1 = (1, 5)$. $C_2 = \\left(\\frac{3+6+7+8}{4}, \\frac{5+1+2+1}{4}\\right) = (6, 2.25)$. $C_3 = \\left(\\frac{8+10+12}{3}, \\frac{9+8+10}{3}\\right) = (10, 9)$." },
      { title: "Iterate", md: "Now B is closer to $C_1$ (squared distance 4) than to $C_2$ (16.6), so it switches: $C_1 = (2, 5)$, $C_2 = (7, 1.33)$, $C_3$ stays. The next assignment changes nothing — converged." },
    ],
  },
  {
    kind: "info",
    variant: "note",
    title: "Check the arithmetic",
    md: "The $y$-values of B, C, D and E are 5, 1, 2 and 1, so $C_2$'s $y$ is $9/4 = 2.25$. Adding the wrong values — $(5 + 2 + 3 + 1)/4 = 2.75$ — is an easy slip.",
  },
  {
    kind: "formula",
    tex: "cluster(c) = \\{p \\in P : \\nexists d \\in C : d \\ne c \\wedge \\|d - p\\|_2 < \\|c - p\\|_2\\} \\qquad c_{i+1} = \\frac{\\sum_{x \\in cluster(c_i)} x}{|cluster(c_i)|}",
    caption: "Formally: points x ∈ P ⊂ ℝⁿ, initial centres C₀ ⊂ P with |C₀| = k, Euclidean distance. A point belongs to the centre no other centre beats; each centre moves to its cluster's mean.",
  },
  {
    kind: "table",
    headers: ["k-means", ""],
    rows: [
      ["Minimises", "Σ over centres c Σ over p in cluster(c) of ‖p − c‖²"],
      ["+", "Easy to implement"],
      ["−", "Ignores outliers — every point is forced into some cluster"],
      ["−", "The number of centres is predetermined"],
    ],
    caption: "k-means: conclusion.",
  },
  { kind: "concepts", ids: ["k-means"] },
  {
    kind: "practice",
    id: "l4-kmeans",
    tasks: [
      {
        id: "centre",
        prompt: "Cluster C₃ contains F(8, 9), G(10, 8) and H(12, 10). Give its new centre as (x, y).",
        check: { mode: "text", accept: ["(10,9)", "10,9", "(10, 9)"], placeholder: "(x, y)" },
        solution: "$x = 30/3 = 10$, $y = 27/3 = 9$: **(10, 9)**.",
      },
    ],
  },
];

const kMeansSql: Block[] = [
  {
    kind: "prose",
    md: "k-means is iterative, and SQL can iterate with a **recursive common table expression**. The points and the initial centres are inline tables; the recursive table `clusters(iter, cid, x, y)` starts with the initial centres (iteration 0) and adds the centres of iteration $i + 1$ computed from those of iteration $i$.",
  },
  {
    kind: "code",
    lang: "sql",
    code: `with recursive points (pid, x, y) as (
    values ('A', 1, 5), ('B', 3, 5), ('C', 6, 1), ('D', 7, 2),
           ('E', 8, 1), ('F', 8, 9), ('G', 10, 8), ('H', 12, 10)),
  clusters0 (cid, x, y) as (
    values ('1', 1e0, 5e0), ('2', 3e0, 5e0), ('3', 12e0, 10e0)),
  clusters (iter, cid, x, y) as (
    (select 0, * from clusters0)
    union all
    select iter + 1, cid, avg(px), avg(py) from (
      -- assign every point to the centre no other centre beats
      select iter, pid, p.x as px, p.y as py, min(cid) as cid
      from points p, clusters c
      where not exists (
        select * from clusters d
        where c.iter = d.iter
          and (d.x - p.x)^2 + (d.y - p.y)^2 < (c.x - p.x)^2 + (c.y - p.y)^2)
      group by iter, pid, p.x, p.y)   -- never assign a point to two clusters
    where iter < 100
    group by cid, iter)              -- new centre = mean of the cluster
select * from clusters;`,
    caption: "k-means in SQL. The NOT EXISTS subquery is the formal definition of cluster(c); min(cid) breaks ties.",
    run: {
      note: "PostgreSQL does not allow aggregates inside the recursive part of WITH RECURSIVE (Umbra, used in the lecture, does), so this version keeps the k centres of an iteration in two arrays and recomputes them in a LATERAL subquery. Same algorithm, same points.",
      hint: "move a starting centre (e.g. 12 → 5) or add a point to the VALUES list and rerun",
      code: `-- k-means, PostgreSQL version: the centres of one iteration live in arrays cx, cy
with recursive points (pid, x, y) as (
    values ('A', 1, 5), ('B', 3, 5), ('C', 6, 1), ('D', 7, 2),
           ('E', 8, 1), ('F', 8, 9), ('G', 10, 8), ('H', 12, 10)),
  km (iter, cx, cy) as (
    select 0, array[1, 3, 12]::float[], array[5, 5, 10]::float[]  -- initial centres
  union all
    select iter + 1, step.cx, step.cy
    from km, lateral (
      select array_agg(ax order by k) as cx, array_agg(ay order by k) as cy
      from (
        -- assign every point to its nearest centre k, then average per centre
        select nearest.k, avg(p.x)::float as ax, avg(p.y)::float as ay
        from points p,
             lateral (select k from generate_subscripts(km.cx, 1) k
                      order by (km.cx[k] - p.x)^2 + (km.cy[k] - p.y)^2, k
                      limit 1) nearest
        group by nearest.k) moved) step
    where iter < 10)
select iter, cx as centre_x, cy as centre_y from km order by iter;`,
    },
  },
  {
    kind: "info",
    variant: "insight",
    title: "Where the iteration lives",
    md: "There is no loop: each recursive step reads only the rows of the previous iteration and appends the next ones. The `iter < 100` condition bounds the recursion, and the final `select` returns the centres of every iteration.",
  },
  { kind: "concepts", ids: ["recursive-cte"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What are the base case and the recursive step of the k-means query?", answer: "Base case: the initial centres at iteration 0. Step: assign points to the nearest centre of iteration i, then average each cluster to get the centres of iteration i + 1." },
      { prompt: "Which part of the query encodes “nearest centre”?", answer: "The NOT EXISTS subquery: no other centre d of the same iteration is closer to p than c." },
    ],
  },
];

const dbscan: Block[] = [
  {
    kind: "prose",
    md: "**DBSCAN** — Density-Based Spatial Clustering of Applications with Noise (Ester, Kriegel, Sander, Xu, KDD 1996) — has two parameters: $\\varepsilon$, a distance, and $minPts$, the minimal number of points to form a cluster. In this simplified formulation:\n\n1. every point forms a single cluster;\n2. merge clusters that are less than $\\varepsilon$ away;\n3. repeat until the clusters converge;\n4. mark every point in a cluster with fewer than $minPts$ points as **noise**.\n\nTry it on the eight points: with $\\varepsilon = 2.5$ and $minPts = 2$, the points give {A, B}, {C, D, E} and {F, G}, while H — 2.83 from G — is noise. Try it in the playground above.",
  },
  {
    kind: "table",
    headers: ["", "k-means", "DBSCAN"],
    rows: [
      ["Number of clusters", "Fixed in advance (k)", "Follows from the data"],
      ["Outliers", "Forced into some cluster", "Marked as noise"],
      ["Cluster shape", "Around a centre (mean)", "Any shape that is densely connected"],
      ["Parameters", "k, initial centres", "ε, minPts"],
    ],
  },
  { kind: "concepts", ids: ["dbscan"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What do ε and minPts mean in DBSCAN?", answer: "ε: the distance under which clusters merge. minPts: the minimal number of points for a cluster — smaller groups are noise." },
      { prompt: "Which two weaknesses of k-means does DBSCAN avoid?", answer: "It needs no predetermined number of clusters, and outliers become noise instead of distorting a cluster." },
    ],
  },
];

const gradientDescent: Block[] = [
  {
    kind: "prose",
    md: "Machine learning proper — already in SQL-92 terms — fits a **model** $m_{\\vec w}(X)$ with weights $\\vec w$ to given labels $\\vec y$ by minimising a **loss function** $l_{X,\\vec y}(\\vec w)$. Take a line and the mean squared error:",
  },
  {
    kind: "formula",
    tex: "m_{a,b}(x) = a \\cdot x + b \\approx y \\qquad l_{x,y}(a,b) = (a x + b - y)^2 \\qquad \\nabla l_{x,y}(a,b) = \\begin{pmatrix} 2(ax + b - y) \\cdot x \\\\ 2(ax + b - y) \\end{pmatrix}",
    caption: "The model, its loss, and the manually derived gradient.",
  },
  {
    kind: "formula",
    tex: "\\vec w_{t+1} = \\vec w_t - \\gamma \\, \\nabla l_{X,\\vec y}(\\vec w_t) \\qquad \\vec w_\\infty \\approx \\lim_{t \\to \\infty} \\vec w_t",
    caption: "Gradient descent with learning rate γ.",
  },
  {
    kind: "code",
    lang: "sql",
    code: `create table data (x float, y float);
insert into data ...;

with recursive gd (id, a, b) as (
    select 0, 1::float, 1::float                      -- initial weights
  union all
    select id + 1,
           a - 0.05 * avg(2 * x * (a * x + b - y)),   -- a - γ ∂l/∂a
           b - 0.05 * avg(2 * (a * x + b - y))        -- b - γ ∂l/∂b
    from gd, (select * from data tablesample reservoir(8)) as batch
    where id < 5
    group by id, a, b)
select * from gd order by id;`,
    caption: "Gradient descent (mini-batch) as a recursive query: five iterations, two weights, γ = 0.05.",
    run: {
      note: "The data table is already filled (10 points near y = 2x + 1). PostgreSQL forbids aggregates in the recursive part and has no tablesample reservoir, so the gradient is averaged in a LATERAL subquery over a random BERNOULLI(80) mini-batch.",
      hint: "raise the iterations (id < 50) or the learning rate 0.05 and watch a and b approach 2 and 1",
      code: `with recursive gd (id, a, b) as (
    select 0, 1::float, 1::float                       -- initial weights
  union all
    select id + 1,
           a - 0.05 * g.da,                            -- a - γ ∂l/∂a
           b - 0.05 * g.db                             -- b - γ ∂l/∂b
    from gd, lateral (
      select avg(2 * x * (a * x + b - y)) as da,
             avg(2 * (a * x + b - y))     as db
      from data tablesample bernoulli(80)) as g        -- random mini-batch
    where id < 5)
select * from gd order by id;`,
    },
  },
  {
    kind: "info",
    variant: "note",
    title: "Mini-batch",
    md: "`tablesample reservoir(8)` draws a random sample of 8 rows in every iteration, so each step averages the gradient over a small batch instead of all data — cheaper steps, noisier direction. `avg` turns the per-row gradients into the batch gradient.",
  },
  { kind: "concepts", ids: ["gradient-descent"] },
  {
    kind: "practice",
    id: "l4-gradient",
    tasks: [
      {
        id: "step",
        prompt: "One data point x = 1, y = 3; current weights a = 1, b = 1; γ = 0.05. What is the new value of b after one step?",
        check: { mode: "text", accept: ["1.1"], placeholder: "b" },
        hint: "∂l/∂b = 2(ax + b − y).",
        solution: "$ax + b - y = 1 + 1 - 3 = -1$, so $\\partial l/\\partial b = -2$ and $b \\leftarrow 1 - 0.05 \\cdot (-2) = $ **1.1**. (Likewise $a \\leftarrow 1 - 0.05 \\cdot (-2) \\cdot 1 = 1.1$.)",
      },
    ],
  },
];

const autodiff: Block[] = [
  {
    kind: "prose",
    md: "Deriving gradients by hand does not scale to real models. **Automatic differentiation** applies the chain rule $\\frac{\\partial f(g(x))}{\\partial x} = \\frac{\\partial f}{\\partial g} \\cdot \\frac{\\partial g}{\\partial x}$ mechanically to the expression tree of the loss. It comes in two modes.",
  },
  {
    kind: "table",
    headers: ["Forward mode", "Reverse mode"],
    rows: [
      ["Applies the chain rule during the forward pass: every node returns {value, derivative}", "Evaluates first, then back-propagates the derivatives from the output to the inputs"],
      ["One pass only (operator overloading)", "A separate, reverse pass is required"],
      ["A separate pass per independent input variable", "The derivatives for all input variables in one pass"],
      ["Can lead to expression swell", "What backpropagation in neural networks uses"],
    ],
  },
  {
    kind: "steps",
    title: "Reverse mode on f(x, y, z) = (x + y) · z with x = 2, y = 3, z = 6",
    intro: "Evaluate bottom-up: $x + y = 5$, $f = 5 \\cdot 6 = 30$. Then call `derive` top-down with seed 1.",
    steps: [
      { title: "Root (multiplication)", md: "`derive((x+y)·z, 1)`: a product passes seed × the *other* factor to each side — $1 \\cdot z = 6$ to $x + y$, and $1 \\cdot (x + y) = 5$ to $z$. So $\\partial f/\\partial z = 5$." },
      { title: "Sum node", md: "`derive(x+y, 6)`: a sum passes its seed unchanged to both operands." },
      { title: "Leaves", md: "`derive(x, 6)` and `derive(y, 6)`: $\\partial f/\\partial x = \\partial f/\\partial y = 6$. One backward pass produced every partial derivative." },
    ],
  },
  {
    kind: "steps",
    title: "Forward mode on the same expression, with respect to x",
    intro: "Each call `eval(expr, x)` returns the pair {value, ∂value/∂x}.",
    steps: [
      { title: "Leaves", md: "`eval(x, x)` = {2, 1}; `eval(y, x)` = {3, 0}; `eval(z, x)` = {6, 0}." },
      { title: "Sum", md: "`eval(x+y, x)` = {5, 1 + 0 = 1}." },
      { title: "Product", md: "`eval((x+y)·z, x)` = {30, 1 · 6 + 5 · 0 = 6}. The result is $\\partial f/\\partial x = 6$ — but $\\partial f/\\partial y$ and $\\partial f/\\partial z$ need two more passes." },
    ],
  },
  {
    kind: "info",
    variant: "note",
    title: "Inside the database",
    md: "A research database system, Umbra, implements both modes in C++ on its expression trees, which is what lets a query take a lambda expression for the loss and derive its gradient automatically.",
  },
  { kind: "concepts", ids: ["autodiff"] },
  {
    kind: "recall",
    cards: [
      { prompt: "How many passes does forward mode need for n input variables? Reverse mode?", answer: "Forward: one pass per input variable (n). Reverse: one forward evaluation plus one backward pass for all of them." },
      { prompt: "In reverse mode, what does a product node pass to each child? A sum node?", answer: "Product: the seed times the other factor. Sum: the seed unchanged." },
    ],
  },
];

const matrices: Block[] = [
  {
    kind: "prose",
    md: "Neural networks are matrix algebra, so first: **how to represent matrices in SQL?** Two options — a **tabular representation** (a row number plus one column per matrix column, as data usually arrives) or a **relational representation**, a coordinate list of $(i, j, v)$ tuples. The relational one has a fixed schema whatever the dimensions, so the tabular representation is transformed into it.",
  },
  {
    kind: "code",
    lang: "sql",
    code: `-- feature matrix of the Iris data: one (i, j, v) row per measurement
create table if not exists img (i int, j int, v float);
insert into img (select id, 1, sepal_length from iris);
insert into img (select id, 2, sepal_width  from iris);
insert into img (select id, 3, petal_length from iris);
insert into img (select id, 4, petal_width  from iris);`,
    caption: "The Iris data — sepal and petal length and width of 150 flowers of three species — as a relational feature matrix.",
    run: {
      note: "The sample database has 12 Iris rows; a SELECT is added at the end so you can see the matrix.",
      code: `-- feature matrix of the Iris data: one (i, j, v) row per measurement
create table if not exists img (i int, j int, v float);
insert into img (select id, 1, sepal_length from iris);
insert into img (select id, 2, sepal_width  from iris);
insert into img (select id, 3, petal_length from iris);
insert into img (select id, 4, petal_width  from iris);

select * from img order by i, j;`,
    },
  },
  {
    kind: "code",
    lang: "sql",
    code: `with dict as (               -- dictionary: treat species as an enumeration
  select species, cast(row_number() over () as int) as rank
  from (select distinct(species) from iris) oh
)
select iris.row as i, dict.rank as j, 1 as v   -- sparse matrix: the 1s only
from iris, dict
where iris.species = dict.species;`,
    caption: "One-hot encoding the label: setosa → {1,0,0}, versicolor → {0,1,0}, virginica → {0,0,1}. An outer join with all (i, j) pairs adds the zeros if a dense matrix is needed.",
    run: { hint: "drop the WHERE clause to see every (row, class) pair — the dense matrix needs a 0 for those" },
  },
  {
    kind: "table",
    headers: ["Operation", "Definition", "SQL on m(i, j, v) and n(i, j, v)"],
    rows: [
      ["Matrix multiplication", "L = M · N, lᵢⱼ = Σₖ mᵢₖ · nₖⱼ", "select m.i, n.j, sum(m.v * n.v) from m inner join n on m.j = n.i group by m.i, n.j"],
      ["Hadamard product", "L = M ∘ N, lᵢⱼ = mᵢⱼ · nᵢⱼ", "select m.i, m.j, m.v * n.v from m inner join n on m.i = n.i and m.j = n.j"],
      ["Sigmoid (element-wise)", "1 / (1 + e^(−v))", "select i, j, 1 / (1 + exp(-v)) from m"],
      ["Transpose", "L = Mᵀ, lⱼᵢ = mᵢⱼ", "select i as j, j as i, v from m"],
    ],
    caption: "Matrix algebra in SQL.",
  },
  { kind: "concepts", ids: ["relational-matrix", "one-hot", "matrix-sql"] },
  {
    kind: "practice",
    id: "l4-matrices",
    tasks: [
      {
        id: "hadamard",
        prompt: "Which join condition does the Hadamard product need, compared with matrix multiplication?",
        check: { mode: "open" },
        solution: "Hadamard multiplies cells at the same position, so it joins on **both** indices, `m.i = n.i and m.j = n.j`, with no aggregation. Multiplication joins the column index of m with the row index of n, `m.j = n.i`, and sums per `(m.i, n.j)`.",
      },
    ],
  },
];

const neuralNetwork: Block[] = [
  {
    kind: "prose",
    md: "A fully connected neural network with one hidden layer of size $h$, an output vector of probabilities $L$, and two weight matrices $w_{xh} \\in \\mathbb{R}^{|\\vec x| \\times h}$ and $w_{ho} \\in \\mathbb{R}^{h \\times |L|}$, with the sigmoid as activation:",
  },
  {
    kind: "formula",
    tex: "m_{w_{xh},w_{ho}}(\\vec x) = sig\\big(sig(\\vec x^T \\cdot w_{xh}) \\cdot w_{ho}\\big) \\qquad l_{w_{xh},w_{ho}}(\\vec x, \\vec y) = \\big(m_{w_{xh},w_{ho}}(\\vec x) - \\vec y\\big)^2",
    caption: "Forward pass and loss (Eq. 9–10). For Iris: 4 inputs, a hidden layer of 10, and 3 outputs compared with the one-hot species.",
  },
  {
    kind: "steps",
    title: "One training step: backpropagation (Eq. 11–16)",
    steps: [
      { title: "Forward pass", md: "$a_{xh} = sig(x \\cdot w_{xh})$ and $a_{ho} = sig(a_{xh} \\cdot w_{ho})$." },
      { title: "Output error", md: "$l_{ho} = 2 \\cdot (m(x) - y_{ones})$, then $\\delta_{ho} = l_{ho} \\circ sig'(a_{ho}) = l_{ho} \\circ a_{ho} \\circ (1 - a_{ho})$." },
      { title: "Update the output weights", md: "$w'_{ho} = w_{ho} - \\gamma \\cdot a_{xh}^T \\cdot \\delta_{ho}$." },
      { title: "Propagate back", md: "$l_{xh} = \\delta_{ho} \\cdot w_{ho}^T$, then $\\delta_{xh} = l_{xh} \\circ a_{xh} \\circ (1 - a_{xh})$." },
      { title: "Update the input weights", md: "$w'_{xh} = w_{xh} - \\gamma \\cdot x^T \\cdot \\delta_{xh}$." },
    ],
  },
  {
    kind: "prose",
    md: "In SQL the whole step is one recursive query over relational matrices: a recursive table `w(iter, id, i, j, v)` holds both weight matrices, and each step defines `a_xh`, `a_ho`, `l_ho`, `d_ho`, `l_xh`, … as CTEs built from the matrix operations above, then appends the updated weights. Alternatively, a database with array types and automatic differentiation lets the step be written as a lambda for the loss and derives the gradient itself:",
  },
  {
    kind: "code",
    lang: "sql",
    code: `with recursive gd (id, w_xh, w_ho) as (
    select 0, array_fill(0.1::float, array[4, 10]), array_fill(0.1::float, array[10, 3])
  union all
    select id + 1, w_xh - 0.1 * avg(d_w_xh), w_ho - 0.1 * avg(d_w_ho)
    from umbra.derivation(TABLE(select * from data, gd where id < 10),
         lambda (x) ((sig(sig(x.img * x.w_xh) * x.w_ho) - one_hot)^2))
    group by id, w_ho, w_xh)
select * from gd order by id;`,
    caption: "Training a neural network when applying matrix algebra on arrays (Listing 4): the database derives d_w_xh and d_w_ho from the loss lambda.",
    run: false,
  },
  { kind: "concepts", ids: ["nn-sql"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What is the derivative of the sigmoid in terms of its output a?", answer: "sig′ = a · (1 − a)." },
      { prompt: "What does one recursive step of the SQL training query do?", answer: "Forward pass, compute the output and hidden deltas, and append updated weight matrices w_ho and w_xh for the next iteration." },
    ],
  },
];

const mistakes: Block[] = [
  {
    kind: "info",
    variant: "pitfall",
    title: "Thinking in-database ML is about accuracy",
    md: "The benefits are about data movement, freshness, simpler workflows, access, security and parallel processing — not about better models.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Averaging the wrong points in k-means",
    md: "A new centre is the mean of the points **currently assigned** to it — recompute the assignment first.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Forgetting the inner derivative",
    md: "$\\partial (ax + b - y)^2 / \\partial a$ is $2(ax + b - y) \\cdot x$, not just $2(ax + b - y)$.",
  },
  {
    kind: "info",
    variant: "pitfall",
    title: "Swapping the two autodiff modes",
    md: "Forward mode: derivatives travel with the values, one pass per input. Reverse mode: a backward pass from the output, all inputs at once.",
  },
];

const quiz: Block[] = [
  { kind: "prose", md: "Ten questions: the idea and its benefits first, then the algorithms behind them." },
];

const summary: Block[] = [
  { kind: "list", variant: "takeaways", items: lecture04Meta.takeaways },
  {
    kind: "table",
    headers: ["Quantity", "Formula"],
    rows: [
      ["k-means objective", "Σ_c Σ_{p ∈ cluster(c)} ‖p − c‖²"],
      ["New centre", "c_{i+1} = mean of the points in cluster(c_i)"],
      ["Squared loss", "l(a, b) = (ax + b − y)²"],
      ["Gradient", "(2(ax + b − y)·x, 2(ax + b − y))"],
      ["Update", "w ← w − γ ∇l(w)"],
      ["Sigmoid and derivative", "sig(v) = 1/(1 + e^(−v)), sig′ = a(1 − a)"],
      ["Matrix product in SQL", "join m.j = n.i, SUM(m.v · n.v), GROUP BY m.i, n.j"],
    ],
    caption: "Everything worth memorising from this lecture.",
  },
];

export const lecture04Blocks: SectionBlocks<typeof lecture04Outline> = {
  objectives,
  why,
  "k-means": kMeans,
  "k-means-sql": kMeansSql,
  dbscan,
  "gradient-descent": gradientDescent,
  autodiff,
  matrices,
  "neural-network": neuralNetwork,
  mistakes,
  quiz,
  summary,
};
