import type { LectureMeta, SectionOutline } from "@/content/types";

export const lecture04Outline = [
  { id: "objectives", title: "Learning objectives", kind: "objectives" },
  { id: "why", title: "Why machine learning in the database", kind: "intuition" },
  { id: "k-means", title: "Clustering with k-means", kind: "playground" },
  { id: "k-means-sql", title: "k-means in SQL", kind: "examples" },
  { id: "dbscan", title: "Density-based clustering: DBSCAN", kind: "concepts" },
  { id: "gradient-descent", title: "Gradient descent with recursive SQL", kind: "examples" },
  { id: "autodiff", title: "Automatic differentiation", kind: "concepts" },
  { id: "matrices", title: "Matrices and matrix algebra in SQL", kind: "examples" },
  { id: "neural-network", title: "Training a neural network in SQL", kind: "examples" },
  { id: "mistakes", title: "Common mistakes", kind: "mistakes" },
  { id: "quiz", title: "Check your understanding", kind: "quiz" },
  { id: "summary", title: "Cheat sheet", kind: "summary" },
] as const satisfies readonly SectionOutline[];

export const lecture04Meta: LectureMeta = {
  slug: "in-database-machine-learning",
  number: 4,
  title: "In-Database Machine Learning",
  subtitle: "Running machine learning where the data is stored",
  summary:
    "Instead of exporting data into a separate machine-learning platform, run the learning inside the database. This guest lecture shows how far plain SQL gets you: k-means and DBSCAN clustering, gradient descent written as a recursive query, automatic differentiation, matrices stored as relations, and a neural network trained entirely in SQL. What you are expected to know is the idea and its benefits; the SQL shows that it really works.",
  topics: [
    "In-database ML benefits",
    "k-means",
    "DBSCAN",
    "Recursive SQL",
    "Gradient descent",
    "Automatic differentiation",
    "Matrices in SQL",
    "One-hot encoding",
    "Neural networks in SQL",
  ],
  difficulty: "core",
  estimatedMinutes: 60,
  sources: [
    { label: "In-Database Machine Learning", kind: "slides", detail: "Prof. Dr. Maximilian E. Schüle, Universität Bamberg" },
    { label: "Course description", kind: "notes", detail: "Expected knowledge: the idea of in-database ML and its benefits" },
  ],
  objectives: [
    "Explain what in-database machine learning is and list its benefits over exporting data.",
    "Run k-means by hand on a small example and state what it minimises, its strengths and weaknesses.",
    "Read the recursive SQL query that implements k-means.",
    "Describe DBSCAN's parameters ε and minPts and how it differs from k-means.",
    "Derive the gradient of a squared loss and express gradient descent as a recursive SQL query.",
    "Compare forward-mode and reverse-mode automatic differentiation on (x + y) · z.",
    "Represent matrices relationally, one-hot encode a category, and write matrix multiplication in SQL.",
    "Outline how a neural network is trained in SQL with forward and backward passes.",
  ],
  takeaways: [
    "In-database ML runs learning where the data lives: less data movement, fresher predictions, simpler workflows, access for SQL analysts, centralised security, and the database's parallel processing.",
    "k-means: pick k centres, assign each point to the nearest centre, move each centre to the mean of its points, repeat until nothing changes; it minimises Σ‖p − c‖² but is sensitive to outliers and needs k up front.",
    "A recursive CTE iterates: the base case holds the initial centres or weights, the recursive step computes the next iteration from the previous one.",
    "DBSCAN merges points closer than ε into clusters and marks clusters smaller than minPts as noise — no k needed.",
    "Gradient descent: w ← w − γ ∇l(w); for l = (ax + b − y)², ∂l/∂a = 2(ax + b − y)x and ∂l/∂b = 2(ax + b − y).",
    "Forward-mode autodiff needs one pass per input variable; reverse mode gets all partial derivatives in one backward pass — what backpropagation uses.",
    "Matrices are stored as (i, j, v) relations; multiplication is a join on m.j = n.i with SUM(m.v · n.v) grouped by (m.i, n.j).",
    "A neural network in SQL is a recursive query whose step runs the forward pass, backpropagates the error and updates both weight matrices.",
  ],
  outline: lecture04Outline,
};
