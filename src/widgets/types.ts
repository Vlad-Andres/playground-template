export const WIDGET_TYPES = [
  "b-plus-tree-lab",
  "band-tuner",
  "clustering-lab",
  "clustering-threshold",
  "cypher-shakespeare-lab",
  "distance-lab",
  "er-pipeline",
  "extendible-hashing-lab",
  "fragmentation-lab",
  "greenplum-explorer",
  "hash-spread-lab",
  "join-strategy-explorer",
  "lazy-evaluation-lab",
  "map-reduce-lab",
  "minhash-lab",
  "mock-exam",
  "pair-cost-calculator",
  "quorum-lab",
  "rdf-storage-lab",
  "replica-placement-lab",
  "replica-quorum-lab",
  "semi-join-bloom-lab",
  "shingling-explorer",
  "string-similarity-lab",
  "two-phase-commit-simulator",
  "vector-search-lab",
] as const;

export type WidgetType = (typeof WIDGET_TYPES)[number];

export function isWidgetType(type: string): type is WidgetType {
  return (WIDGET_TYPES as readonly string[]).includes(type);
}
