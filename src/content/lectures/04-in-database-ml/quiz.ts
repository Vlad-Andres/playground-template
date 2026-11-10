import type { QuizQuestion } from "@/content/types";

export const lecture04Quiz: QuizQuestion[] = [
  {
    id: "q-idea",
    prompt: "What does in-database machine learning mean?",
    options: [
      { id: "a", text: "Using machine learning to tune the database's query optimizer." },
      { id: "b", text: "Running training and/or prediction directly where the data is stored, instead of extracting it into a separate ML system." },
      { id: "c", text: "Storing trained models as BLOBs in a table." },
      { id: "d", text: "Copying the database into the memory of a Python process." },
    ],
    answerId: "b",
    explanation:
      "The learning moves to the data rather than the data to the learning. Depending on the database, it may support training models, making predictions, or both.",
  },
  {
    id: "q-benefits",
    prompt: "Which of these is NOT one of the benefits of in-database ML?",
    options: [
      { id: "a", text: "Less data movement and duplicated storage." },
      { id: "b", text: "Predictions on current records instead of periodic exports." },
      { id: "c", text: "Models that are always more accurate than those trained in Python." },
      { id: "d", text: "Reuse of the database's access controls, auditing and parallel processing." },
    ],
    answerId: "c",
    explanation:
      "The benefits are about the workflow: less data movement, fresher predictions, simpler pipelines, access for SQL users, centralised security and efficient processing at scale. Accuracy depends on the model, not on where it runs.",
  },
  {
    id: "q-kmeans-step",
    prompt: "With initial centres A(1,5), B(3,5) and H(12,10), cluster C₂ gets B(3,5), C(6,1), D(7,2) and E(8,1). Where does C₂ move?",
    options: [
      { id: "a", text: "(6, 2.25)" },
      { id: "b", text: "(6, 2.75)" },
      { id: "c", text: "(3, 5)" },
      { id: "d", text: "(6, 1)" },
    ],
    answerId: "a",
    explanation:
      "The new centre is the mean of its points: $x = (3+6+7+8)/4 = 6$, $y = (5+1+2+1)/4 = 2.25$. (2.75 comes from adding the wrong y-values.)",
  },
  {
    id: "q-kmeans-cons",
    prompt: "Which pair are drawbacks of k-means?",
    options: [
      { id: "a", text: "It is hard to implement and very slow." },
      { id: "b", text: "It ignores (is sensitive to) outliers, and the number of centres must be fixed in advance." },
      { id: "c", text: "It only works in SQL and needs labelled data." },
      { id: "d", text: "It cannot use Euclidean distance." },
    ],
    answerId: "b",
    explanation:
      "k-means is easy to implement and minimises the squared distance to the centres, but every point — outliers included — is forced into a cluster, and $k$ is predetermined. DBSCAN addresses both.",
  },
  {
    id: "q-dbscan",
    prompt: "What do DBSCAN's two parameters mean?",
    options: [
      { id: "a", text: "k, the number of clusters, and the number of iterations." },
      { id: "b", text: "ε, the distance under which clusters merge, and minPts, the minimal number of points to form a cluster; smaller groups are noise." },
      { id: "c", text: "The learning rate and the batch size." },
      { id: "d", text: "The number of bands and rows." },
    ],
    answerId: "b",
    explanation:
      "Density-based clustering finds as many clusters as the data contains: points within $\\varepsilon$ end up together, and clusters with fewer than $minPts$ points are marked as noise.",
  },
  {
    id: "q-recursive",
    prompt: "How does a recursive SQL query express an iterative algorithm such as k-means or gradient descent?",
    options: [
      { id: "a", text: "With a stored procedure that loops." },
      { id: "b", text: "The base case selects the initial state; the recursive part, joined via UNION ALL, computes iteration i + 1 from iteration i until a stop condition such as iter < 100." },
      { id: "c", text: "By running the same query 100 times from an application." },
      { id: "d", text: "It cannot — SQL has no iteration." },
    ],
    answerId: "b",
    explanation:
      "`WITH RECURSIVE` keeps appending the rows the recursive step produces from the previous iteration. The WHERE condition on the iteration counter makes it terminate.",
  },
  {
    id: "q-gradient",
    prompt: "For the loss l(a, b) = (ax + b − y)², what is ∂l/∂a?",
    options: [
      { id: "a", text: "2(ax + b − y)" },
      { id: "b", text: "2(ax + b − y) · x" },
      { id: "c", text: "(ax + b − y) · x" },
      { id: "d", text: "2x" },
    ],
    answerId: "b",
    explanation:
      "By the chain rule the outer square gives $2(ax + b - y)$ and the inner derivative with respect to $a$ is $x$. With respect to $b$ the inner derivative is 1, giving $2(ax + b - y)$.",
  },
  {
    id: "q-autodiff",
    prompt: "Why does training neural networks use reverse-mode rather than forward-mode automatic differentiation?",
    options: [
      { id: "a", text: "Reverse mode needs no evaluation of the function." },
      { id: "b", text: "Reverse mode obtains the derivatives for every input variable in one backward pass; forward mode needs one pass per input." },
      { id: "c", text: "Forward mode gives only approximate derivatives." },
      { id: "d", text: "Reverse mode avoids the chain rule." },
    ],
    answerId: "b",
    explanation:
      "A network has many weights (inputs to the loss) and one output. Forward mode would repeat the pass for each weight; reverse mode evaluates once and then propagates $\\partial f / \\partial \\cdot$ down the expression tree once — backpropagation.",
  },
  {
    id: "q-reverse-example",
    prompt: "For f(x, y, z) = (x + y) · z at x = 2, y = 3, z = 6, what are ∂f/∂x and ∂f/∂z?",
    options: [
      { id: "a", text: "6 and 5" },
      { id: "b", text: "5 and 6" },
      { id: "c", text: "1 and 1" },
      { id: "d", text: "30 and 30" },
    ],
    answerId: "a",
    explanation:
      "Seed 1 at the root. The product sends $1 \\cdot z = 6$ to $(x + y)$ and $1 \\cdot (x + y) = 5$ to $z$. The sum passes 6 unchanged to $x$ and $y$. So $\\partial f/\\partial x = \\partial f/\\partial y = 6$ and $\\partial f/\\partial z = 5$.",
  },
  {
    id: "q-matmul",
    prompt: "Matrices m and n are stored as (i, j, v). Which query computes their product?",
    options: [
      { id: "a", text: "select m.i, m.j, m.v * n.v from m join n on m.i = n.i and m.j = n.j" },
      { id: "b", text: "select m.i, n.j, sum(m.v * n.v) from m join n on m.j = n.i group by m.i, n.j" },
      { id: "c", text: "select i as j, j as i, v from m" },
      { id: "d", text: "select m.i, n.j, max(m.v * n.v) from m, n group by m.i, n.j" },
    ],
    answerId: "b",
    explanation:
      "$l_{ij} = \\sum_k m_{ik} n_{kj}$: join where the column index of m meets the row index of n, multiply, and sum per result cell. Option (a) is the Hadamard product, (c) the transpose.",
  },
];
