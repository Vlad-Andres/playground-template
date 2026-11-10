import type { Concept } from "@/content/types";

export const lecture04Concepts: Concept[] = [
  {
    id: "in-database-ml",
    term: "In-database machine learning",
    short: "Training models and making predictions inside the database, instead of exporting the data into a separate system.",
    detail:
      "Depending on the database, it may support training, prediction, or both. The data never leaves the system that already stores, secures and parallelises it.",
    tags: ["idea"],
  },
  {
    id: "k-means",
    term: "k-means",
    short: "Choose k centres, assign each point to the nearest one, move each centre to the mean of its cluster, repeat.",
    detail:
      "It minimises $\\sum_{c \\in C} \\sum_{p \\in cluster(c)} \\|p - c\\|^2$. Easy to implement, but sensitive to outliers, and the number of centres must be fixed in advance.",
    tags: ["clustering"],
  },
  {
    id: "recursive-cte",
    term: "Recursive SQL (WITH RECURSIVE)",
    short: "A common table expression that refers to itself: a base case UNION ALL a step computed from the previous rows.",
    detail:
      "Iterative algorithms map onto it naturally: the base case holds the initial centres or weights, each recursive step produces iteration $i + 1$ from iteration $i$, and a condition such as `iter < 100` stops it.",
    tags: ["SQL"],
  },
  {
    id: "dbscan",
    term: "DBSCAN",
    short: "Density-Based Spatial Clustering of Applications with Noise: clusters are dense regions, sparse points are noise.",
    detail:
      "Two parameters: the distance $\\varepsilon$ and $minPts$, the minimal number of points to form a cluster. In a simplified version every point starts as its own cluster, clusters less than $\\varepsilon$ apart are merged until nothing changes, and clusters with fewer than $minPts$ points are marked as noise.",
    tags: ["clustering"],
  },
  {
    id: "gradient-descent",
    term: "Gradient descent",
    short: "Repeatedly step the weights against the gradient of the loss: w ← w − γ ∇l(w).",
    detail:
      "With learning rate $\\gamma$, the sequence $\\vec w_{t+1} = \\vec w_t - \\gamma \\nabla l_{X,\\vec y}(\\vec w_t)$ approaches a minimum of the loss. Computing the gradient on a random sample instead of all data is mini-batch gradient descent.",
    tags: ["training"],
  },
  {
    id: "autodiff",
    term: "Automatic differentiation",
    short: "Compute exact derivatives of an expression by applying the chain rule to its expression tree.",
    detail:
      "**Forward mode** carries (value, derivative) pairs up the tree in one pass, but needs a separate pass per input variable. **Reverse mode** evaluates first, then propagates derivatives down from the output in one extra pass and obtains the derivative for every input at once — backpropagation.",
    tags: ["training"],
  },
  {
    id: "relational-matrix",
    term: "Relational matrix representation",
    short: "Store a matrix as a coordinate list of (i, j, v) tuples rather than as a table with one column per matrix column.",
    detail:
      "The tabular representation (row number plus columns col₁ … colₙ) mirrors the data; the relational one has a fixed schema whatever the dimensions, so matrix algebra becomes joins and aggregates. Sparse matrices only store non-zero entries.",
    tags: ["SQL", "matrices"],
  },
  {
    id: "one-hot",
    term: "One-hot encoding",
    short: "Turn a category with n values into n columns, exactly one of which is 1.",
    detail:
      "For the Iris species, setosa becomes {1, 0, 0}, versicolor {0, 1, 0} and virginica {0, 0, 1}. In SQL a dictionary numbers the distinct species with ROW_NUMBER(), and the sparse matrix (i, rank, 1) holds the ones.",
    tags: ["matrices"],
  },
  {
    id: "matrix-sql",
    term: "Matrix algebra in SQL",
    short: "Multiplication is a join on m.j = n.i with SUM(m.v * n.v) grouped by m.i, n.j.",
    detail:
      "Hadamard (element-wise) product joins on both indices and multiplies; transpose swaps i and j; an element-wise function such as the sigmoid $1/(1 + e^{-v})$ is a simple projection.",
    tags: ["matrices", "SQL"],
  },
  {
    id: "nn-sql",
    term: "Neural network in SQL",
    short: "A recursive query whose step does the forward pass, backpropagates the loss and updates the weight matrices.",
    detail:
      "With one hidden layer, $m(\\vec x) = sig(sig(\\vec x^T w_{xh}) w_{ho})$ and loss $(m(\\vec x) - \\vec y)^2$. The step computes activations, the deltas $\\delta_{ho}$ and $\\delta_{xh}$ via the sigmoid derivative $a(1-a)$, and updates $w_{ho}$ and $w_{xh}$ with learning rate $\\gamma$.",
    tags: ["training"],
  },
];
