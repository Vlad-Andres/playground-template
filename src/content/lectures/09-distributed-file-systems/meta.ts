import type { LectureMeta, SectionOutline } from "@/content/types";

export const lecture09Outline = [
  { id: "objectives", title: "Learning objectives", kind: "objectives" },
  { id: "why-dfs", title: "Why distributed file systems", kind: "intuition" },
  { id: "early-systems", title: "Early systems: DFS, NFS and RAID", kind: "concepts" },
  { id: "gfs-design", title: "GFS: assumptions and design", kind: "concepts" },
  { id: "gfs-operations", title: "GFS: reads, writes and record append", kind: "examples" },
  { id: "gfs-fault-tolerance", title: "GFS: consistency and fault tolerance", kind: "concepts" },
  { id: "hdfs-architecture", title: "HDFS: NameNode, DataNodes and metadata", kind: "concepts" },
  { id: "hdfs-replication", title: "HDFS: blocks, replication and rack awareness", kind: "playground" },
  { id: "hdfs-io", title: "HDFS: reading, writing and robustness", kind: "examples" },
  { id: "mistakes", title: "Common mistakes", kind: "mistakes" },
  { id: "quiz", title: "Check your understanding", kind: "quiz" },
  { id: "summary", title: "Cheat sheet", kind: "summary" },
] as const satisfies readonly SectionOutline[];

export const lecture09Meta: LectureMeta = {
  slug: "distributed-file-systems",
  number: 9,
  title: "Distributed File Systems",
  subtitle: "From NFS and RAID to the Google File System and HDFS",
  summary:
    "One disk is far too slow to read the web. Distributed file systems spread files over many commodity machines and survive their constant failures. This lecture goes from the requirements of a DFS and early systems (Microsoft DFS, NFS, RAID) to the Google File System — a single master, 64 MB chunks, three replicas, leases and atomic record append — and its open-source counterpart HDFS, with its NameNode, DataNodes, rack-aware replication and read/write pipelines.",
  topics: ["DFS requirements", "NFS", "RAID", "GFS", "Chunks and replicas", "Leases", "Record append", "HDFS", "NameNode", "Rack awareness"],
  difficulty: "core",
  estimatedMinutes: 75,
  sources: [
    { label: "Distributed File Systems", kind: "slides", detail: "Yannis Velegrakis" },
    { label: "The Google File System", kind: "notes", detail: "Ghemawat, Gobioff, Leung — SOSP 2003" },
    { label: "The Hadoop Distributed File System: Architecture and Design", kind: "notes", detail: "Dhruba Borthakur — Apache Software Foundation" },
    { label: "The Hadoop Distributed File System", kind: "notes", detail: "Shvachko et al., MSST 2010 — for information only" },
  ],
  objectives: [
    "Explain why big data needs a distributed file system and list the requirements of one.",
    "Describe how Microsoft DFS, NFS and the RAID levels work, and their limits.",
    "Explain the assumptions behind GFS and its design: single master, 64 MB chunks, replicas, metadata.",
    "Trace a GFS read, a write with leases and data pushing, and an atomic record append.",
    "Explain the GFS consistency model and its fault-tolerance mechanisms: operation log, checksums, version numbers, garbage collection.",
    "Describe the HDFS architecture: NameNode, DataNodes, namespace, EditLog and FsImage, Secondary NameNode.",
    "Explain HDFS block replication, rack-aware placement, heartbeats, blockreports and re-replication.",
    "Trace HDFS reads and writes, including staging and the replication pipeline.",
  ],
  takeaways: [
    "A DFS must be fault tolerant, consistent, secure, efficient, scalable and hardware independent — at scale, hardware failure is the norm.",
    "NFS (1985) is stateless and mounts remote directories, but is not very fault tolerant or scalable; RAID gives redundancy and speed within one machine.",
    "GFS: one master holds all metadata in memory; files are split into 64 MB chunks stored three times on chunkservers; data never flows through the master.",
    "A GFS write pushes data to all replicas, then the primary — holding a 60-second lease — orders the mutation and the secondaries apply it in the same order.",
    "Record append writes a record atomically at least once at an offset GFS chooses; if it does not fit, the chunk is padded and the client retries on a new chunk.",
    "GFS survives failures with a replicated operation log and checkpoints, 32-bit checksums per 64 KB block, chunk version numbers and lazy garbage collection.",
    "HDFS: one NameNode keeps the namespace (EditLog + FsImage) and the block map; DataNodes store blocks and send Heartbeats and Blockreports.",
    "HDFS replicates each block (default 3) rack-aware: never all on one rack or one node; writes go through a DataNode pipeline, reads use the closest replica.",
  ],
  outline: lecture09Outline,
};
