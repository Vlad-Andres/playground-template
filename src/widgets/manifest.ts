import { z } from "zod";
import type { WidgetType } from "./types";

const emptyProps = z.object({}).strict();

export const widgetManifest: Record<WidgetType, { title: string; props: z.ZodType }> = {
  "b-plus-tree-lab": { title: "B+ tree lab", props: emptyProps },
  "band-tuner": { title: "Band tuner", props: emptyProps },
  "clustering-lab": { title: "Clustering lab", props: emptyProps },
  "clustering-threshold": { title: "Clustering threshold", props: emptyProps },
  "cypher-shakespeare-lab": { title: "Cypher Shakespeare lab", props: emptyProps },
  "distance-lab": { title: "Distance lab", props: emptyProps },
  "er-pipeline": { title: "Entity-resolution pipeline", props: emptyProps },
  "extendible-hashing-lab": { title: "Extendible hashing lab", props: emptyProps },
  "fragmentation-lab": { title: "Fragmentation lab", props: emptyProps },
  "greenplum-explorer": { title: "Greenplum explorer", props: emptyProps },
  "hash-spread-lab": { title: "Hash spread lab", props: emptyProps },
  "join-strategy-explorer": { title: "Join strategy explorer", props: emptyProps },
  "lazy-evaluation-lab": { title: "Lazy evaluation lab", props: emptyProps },
  "map-reduce-lab": { title: "MapReduce lab", props: emptyProps },
  "minhash-lab": { title: "Minhash lab", props: emptyProps },
  "mock-exam": { title: "Mock exam", props: emptyProps },
  "pair-cost-calculator": { title: "Pair cost calculator", props: emptyProps },
  "quorum-lab": { title: "Quorum lab", props: emptyProps },
  "rdf-storage-lab": { title: "RDF storage lab", props: emptyProps },
  "replica-placement-lab": { title: "Replica placement lab", props: emptyProps },
  "replica-quorum-lab": { title: "Replica quorum lab", props: emptyProps },
  "semi-join-bloom-lab": { title: "Semijoin bloom lab", props: emptyProps },
  "shingling-explorer": { title: "Shingling explorer", props: emptyProps },
  "string-similarity-lab": { title: "String similarity lab", props: emptyProps },
  "two-phase-commit-simulator": { title: "Two-phase commit simulator", props: emptyProps },
  "vector-search-lab": { title: "Vector search lab", props: emptyProps },
};
