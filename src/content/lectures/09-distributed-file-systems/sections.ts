import type { Block, SectionBlocks } from "@/content/types";
import { lecture09Meta, lecture09Outline } from "./meta";
import { ReplicaPlacementLab } from "@/widgets/dis/ReplicaPlacementLab";

const objectives: Block[] = [
  {
    kind: "prose",
    md: "This lecture is about how big data is **stored**: file systems that span hundreds or thousands of machines. Expected knowledge: how the different file systems below work, and for **GFS and HDFS** everything in Borthakur's *HDFS Architecture and Design* together with the **GFS paper**. The HDFS paper by Shvachko et al. is for information only.",
  },
  { kind: "list", variant: "objectives", items: lecture09Meta.objectives },
];

const whyDfs: Block[] = [
  {
    kind: "prose",
    md: "Traditionally, data was small enough for one machine, and computation was CPU-bound. Big data turns this around. Take **10 billion web pages of 20 KB each**: about **200 TB**. Reading it from one disk at **50 MB/s takes 4+ million seconds — about 46 days**, before any processing. Spread over **1000 computers** reading in parallel, it takes **a little over an hour**.",
  },
  {
    kind: "formula",
    tex: "\\frac{10^{10} \\times 20\\,\\text{KB}}{50\\,\\text{MB/s}} = \\frac{2 \\times 10^{14}\\,\\text{B}}{5 \\times 10^{7}\\,\\text{B/s}} = 4 \\times 10^{6}\\,\\text{s} \\approx 46\\,\\text{days};\\qquad \\frac{4 \\times 10^{6}\\,\\text{s}}{1000} \\approx 67\\,\\text{min}",
    caption: "One disk versus a thousand disks reading in parallel. 10 billion × 20 KB is 200 TB (often misquoted as 20 TB) — the size that matches 46 days.",
  },
  {
    kind: "prose",
    md: "So the data has to be **split over many machines**, and the computation moved to where the data is. A file system that does this transparently is a **distributed file system** (DFS). What it must offer:",
  },
  {
    kind: "table",
    headers: ["Requirement", "Meaning"],
    rows: [
      ["Fault tolerance", "Keep working and lose no data when machines, disks or the network fail"],
      ["Consistency", "Clients see the same data, whatever replica they read"],
      ["Security", "Access control over files spread across machines"],
      ["Efficiency", "High throughput, little network traffic"],
      ["Scalability", "Adding machines adds capacity and bandwidth"],
      ["Operations", "Read, write and update files through a normal file interface"],
      ["Hardware independence", "Run on heterogeneous, commodity machines"],
    ],
  },
  { kind: "concepts", ids: ["dfs"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Why is one machine not enough to read 10 billion pages of 20 KB?", answer: "That is 200 TB: at 50 MB/s one disk needs about 46 days; 1000 disks in parallel need a little over an hour." },
      { prompt: "Name five requirements of a distributed file system.", answer: "Fault tolerance, consistency, security, efficiency, scalability (also read/write/update operations and hardware independence)." },
    ],
  },
];

const earlySystems: Block[] = [
  {
    kind: "prose",
    md: "**Microsoft DFS** gives a single namespace over shares on many Windows servers: a client opens `\\\\domain\\root\\folder` and is referred to the server that actually holds it; folders can be replicated between servers. **HTTP and FTP** also give access to remote files, but as whole-file transfers, not as a file system.",
  },
  {
    kind: "prose",
    md: "**NFS** — Sun's *Network File System*, around since **1985** — is the classic network file system. A client **mounts** a directory exported by a server into its own tree, and from then on uses it like a local directory. The server is **stateless**: every request (read block *k* of file handle *h*) carries everything needed to serve it, so a server crash and restart is invisible apart from a delay. Clients **cache** data and **read ahead** to hide network latency, which means a client can briefly see stale data. NFS is simple and everywhere, but each export lives on one server: it is **not very fault tolerant and not very scalable**.",
  },
  {
    kind: "figure",
    src: "dfs/nfs.jpg",
    alt: "NFS architecture: on the client, the system-calls interface and VFS interface route to the UNIX file system, other file systems or the NFS client, which talks RPC/XDR over the network to the NFS server, its VFS interface and UNIX file system on the server's disk.",
    width: 2472,
    height: 1700,
    caption: "NFS: remote files behind the same VFS interface as local ones, reached by RPC.",
  },
  {
    kind: "prose",
    md: "**RAID** — *Redundant Array of Independent Disks* — works inside one machine: several disks act as one, for speed (**striping** data over disks so they read in parallel) and/or reliability (**mirroring** or **parity**).",
  },
  {
    kind: "figure",
    src: "dfs/raid5.jpg",
    alt: "Three disks D1, D2 and D3: blocks A1–A4 and B1–B4 of two files spread across them.",
    width: 470,
    height: 245,
    caption: "Striping: the blocks of files A and B are spread over three disks, so they can be read in parallel. Parity levels add a parity block per stripe.",
  },
  {
    kind: "table",
    headers: ["Level", "How it works", "Survives"],
    rows: [
      ["RAID 0", "Striping only, no redundancy — fastest", "No disk failure"],
      ["RAID 1", "Mirroring: every disk has a copy", "One disk of each pair"],
      ["RAID 2", "Bit-level striping with Hamming error-correcting code disks", "One disk"],
      ["RAID 3", "Byte-level striping with one dedicated parity disk", "One disk"],
      ["RAID 4", "Block-level striping with one dedicated parity disk — a write bottleneck", "One disk"],
      ["RAID 5", "Block-level striping with the parity distributed over all disks", "One disk"],
    ],
    caption: "Parity: the XOR of the data blocks of a stripe, so any one lost block can be recomputed from the others.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "From one machine to a cluster",
    md: "RAID protects against a failed **disk**, NFS shares one **server**. Neither helps when the whole machine dies, or when the data does not fit on one machine. GFS and HDFS take the RAID ideas — splitting data into pieces and keeping redundant copies — and apply them **across machines**.",
  },
  { kind: "concepts", ids: ["nfs", "raid"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What does it mean that the NFS server is stateless?", answer: "It keeps no per-client state: each request carries all the information needed, so a server restart only delays clients." },
      { prompt: "Why is NFS not enough for big data?", answer: "Each export lives on one server: limited fault tolerance and scalability." },
      { prompt: "RAID 4 versus RAID 5?", answer: "Both stripe blocks with parity; RAID 4 keeps parity on one disk (bottleneck), RAID 5 distributes it over all disks." },
    ],
  },
];

const gfsDesign: Block[] = [
  {
    kind: "prose",
    md: "Google needed to store the web crawl and its derived data on **thousands of cheap machines**. With a server lasting about **1000 days**, a cluster of **1000 servers sees about one failure per day** — and copying 10 TB over a 1 Gbps network link takes about a day. The **Google File System** (Ghemawat, Gobioff and Leung, 2003) was designed around its workload rather than around POSIX.",
  },
  {
    kind: "table",
    headers: ["Assumption (GFS paper, 2.1)", "Consequence"],
    rows: [
      ["Component failures are the norm", "Constant monitoring, error detection, automatic recovery"],
      ["Files are huge — multi-GB is common", "Large blocks; few millions of files rather than billions of small ones"],
      ["Most files are mutated by appending, rarely overwritten", "Optimize appends; random writes are supported but not efficient"],
      ["Reads are large and streaming, or small and random", "High sustained bandwidth matters more than low latency"],
      ["Many clients append to one file concurrently", "Atomic record append with minimal synchronisation"],
      ["Co-designed with the applications", "A relaxed consistency model is acceptable"],
    ],
  },
  {
    kind: "prose",
    md: "**Architecture.** A GFS cluster has **one master** and many **chunkservers**, accessed by many **clients**. Files are divided into fixed-size **chunks of 64 MB**, each identified by an immutable, globally unique **64-bit chunk handle** assigned by the master. Chunkservers store chunks as plain Linux files, and each chunk is replicated on **three chunkservers** by default (more for hot files).\n\nThe **master** keeps all metadata: the file and chunk **namespaces**, the **mapping from files to chunks**, and the **locations of each chunk's replicas**. It also manages chunk leases, garbage collection and chunk migration, and talks to every chunkserver through periodic **HeartBeat** messages. Clients ask the master only for **metadata**; all data goes directly between clients and chunkservers.\n\n**No data caching**: neither clients nor chunkservers cache file data — streaming reads would gain little, and the Linux buffer cache already caches chunk files on chunkservers. Clients **do cache metadata**. On top of the usual create, delete, open, close, read and write, GFS offers **snapshot** and **record append**.",
  },
  {
    kind: "figure",
    src: "dfs/gfs-architecture.jpg",
    alt: "GFS architecture: the application's GFS client sends (file name, chunk index) to the GFS master, which holds the file namespace and replies with chunk handle and chunk locations; the client sends (chunk handle, byte range) to a GFS chunkserver and receives chunk data. The master sends instructions to chunkservers and receives chunkserver state.",
    width: 2730,
    height: 1616,
    caption: "GFS architecture: control messages go to the master, data flows directly between client and chunkservers.",
  },
  {
    kind: "info",
    variant: "insight",
    title: "Why a single master works",
    md: "A single master makes placement and replication decisions with global knowledge, which is far simpler than a distributed agreement. It does not become a bottleneck because it is **never on the data path**: a client asks once which chunkservers hold a chunk, caches the answer, and then reads and writes directly.",
  },
  {
    kind: "prose",
    md: "**Why 64 MB chunks?** A large chunk size (1) cuts client–master interaction, since reads and writes on one chunk need one location lookup; (2) lets a client do many operations over one **persistent TCP connection** to a chunkserver; and (3) keeps the master's metadata small — **less than 64 bytes per 64 MB chunk** — so all of it fits in **memory**. The drawback: a small file of a single chunk can become a **hot spot** when many clients read it at once (Google saw this with an executable read by hundreds of machines, and raised its replication factor).\n\n**Metadata persistence.** The namespaces and the file-to-chunk mapping are made persistent in an **operation log**, replicated on remote machines; the master **checkpoints** its state (in a compact B-tree form) whenever the log grows too large, so recovery replays only the log after the last checkpoint. The **chunk locations are not persisted**: at start-up and in HeartBeats the master simply asks each chunkserver which chunks it has — the chunkserver has the final word anyway.",
  },
  { kind: "concepts", ids: ["gfs-master", "chunk"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What does the GFS master store, and where?", answer: "Namespaces, file-to-chunk mapping and replica locations, all in memory; the first two are also in the replicated operation log, the locations are polled from chunkservers." },
      { prompt: "Name three advantages and one drawback of 64 MB chunks.", answer: "Fewer master interactions, persistent TCP connections, small metadata (< 64 bytes per chunk). Drawback: small one-chunk files can become hot spots." },
      { prompt: "Does a GFS client cache file data?", answer: "No — only metadata (chunk handles and locations). Streaming workloads gain little from data caching." },
    ],
  },
  {
    kind: "practice",
    id: "l9-gfs-design",
    tasks: [
      {
        id: "chunk-index",
        prompt: "A client wants to read byte offset 200,000,000 of a GFS file. Which chunk index does it ask the master for (chunks of 64 MB = 67,108,864 bytes, counting from 0)?",
        check: { mode: "text", accept: ["2"], placeholder: "index" },
        solution: "200,000,000 / 67,108,864 ≈ 2.98, so chunk index **2** (the third chunk). The client computes this itself from the fixed chunk size.",
      },
      {
        id: "metadata-size",
        prompt: "Roughly how much master memory do the chunk metadata of 1 PB of files take (64 MB chunks, 64 bytes each)? Give the order of magnitude in GB.",
        check: { mode: "text", accept: ["1", "1gb", "1 gb", "~1gb", "about 1 gb"], placeholder: "GB" },
        solution: "1 PB / 64 MB ≈ 1.6 × 10⁷ chunks × 64 bytes ≈ **1 GB** — easily held in memory.",
      },
    ],
  },
];

const gfsOperations: Block[] = [
  {
    kind: "steps",
    title: "Reading a file",
    steps: [
      { title: "Translate", md: "Using the fixed chunk size, the client turns the file name and byte offset into a **chunk index**." },
      { title: "Ask the master", md: "It sends the file name and chunk index to the master, which replies with the **chunk handle** and the **locations of the replicas**. The client caches this." },
      { title: "Read from a chunkserver", md: "The client sends the chunk handle and a byte range to one replica, usually the **closest** one. Further reads of the same chunk need no master interaction until the cache entry expires." },
    ],
  },
  {
    kind: "figure",
    src: "dfs/gfs-read-master.jpg",
    alt: "Read steps 1–3: the application passes (file name, byte range) to the GFS client, which sends (file name, chunk index) to the master and receives (chunk handle, replica locations).",
    width: 2158,
    height: 984,
    caption: "Reading, steps 1–3: the client asks the master where the chunk is.",
  },
  {
    kind: "figure",
    src: "dfs/gfs-read-chunkserver.jpg",
    alt: "Read steps 4–6: the GFS client sends (chunk handle, byte range) to one of three chunk servers, receives the data and passes it to the application.",
    width: 2242,
    height: 964,
    caption: "Reading, steps 4–6: the data comes straight from one chunkserver.",
  },
  {
    kind: "prose",
    md: "**Mutations and leases.** A mutation (write or record append) changes a chunk and must be applied to **all its replicas**. The master grants a **chunk lease** to one replica, the **primary**, for an initial **60 seconds**; the primary can ask for extensions, piggybacked on HeartBeat messages. The primary picks a **serial order** for all mutations to the chunk, and every replica applies them in that order. So the global order is defined by the lease grant order, then by the primary's serial numbers.",
  },
  {
    kind: "steps",
    title: "Writing — control flow and data flow are separated",
    steps: [
      { title: "1–2. Find the replicas", md: "The client asks the master which chunkserver holds the lease and where the other replicas are; the master grants a lease if nobody holds one. The client caches the answer." },
      { title: "3. Push the data", md: "The client **pushes the data to all replicas**, in any order. Each chunkserver keeps it in an internal buffer. Data is pushed linearly along a chain of chunkservers, each forwarding to the closest one not yet reached, so every machine's full outbound bandwidth is used." },
      { title: "4. Write request to the primary", md: "Once all replicas acknowledge the data, the client sends the write request to the **primary**, which assigns it a serial number and applies it locally." },
      { title: "5. Forward", md: "The primary forwards the request to all **secondary** replicas, which apply it in the same serial order." },
      { title: "6–7. Reply", md: "The secondaries report completion to the primary, and the primary replies to the client. If any replica failed, the client is told and retries steps 3–7." },
    ],
  },
  {
    kind: "figure",
    src: "dfs/gfs-write-master.jpg",
    alt: "Write steps 1–3: the application passes (file name, data) to the GFS client, which asks the master and receives the chunk handle and the primary and secondary replica locations.",
    width: 2344,
    height: 938,
    caption: "Writing, steps 1–3: find the primary and the secondaries.",
  },
  {
    kind: "figure",
    src: "dfs/gfs-write-primary.jpg",
    alt: "Write steps 5–7: the client sends the write command to the primary, which applies data D1–D4 in its serial order and sends the write command with that serial order to both secondaries.",
    width: 1588,
    height: 858,
    caption: "Writing, steps 5–7: after the data has been pushed to every buffer, the primary orders the write and forwards it.",
  },
  {
    kind: "figure",
    src: "dfs/gfs-write-response.jpg",
    alt: "Write steps 8–9: the secondaries respond to the primary, and the primary responds to the GFS client; the buffers are empty again.",
    width: 1746,
    height: 854,
    caption: "Writing, steps 8–9: replies flow back to the client.",
  },
  {
    kind: "prose",
    md: "**Atomic record append.** In a normal write the client specifies the offset; concurrent writers to the same region can leave mingled fragments. In a **record append** the client gives **only the data**. GFS appends it **atomically** — as one continuous sequence of bytes — **at least once**, at an offset of **GFS's choosing**, and returns that offset. This is like `O_APPEND` in Unix without the race conditions, and is ideal for files used as **multiple-producer / single-consumer queues** or for merged results from many clients, without a distributed lock manager.",
  },
  {
    kind: "steps",
    title: "Record append at the primary",
    steps: [
      { title: "Push", md: "The client pushes the record to all replicas of the **last chunk** of the file and sends its request to the primary." },
      { title: "Does it fit?", md: "The primary checks whether appending the record would make the chunk exceed **64 MB**." },
      { title: "No: pad and retry", md: "It **pads** the chunk to the maximum size, tells the secondaries to do the same, and replies that the client must **retry on the next chunk**. Records are at most **one quarter** of the chunk size, to keep this padding waste low." },
      { title: "Yes: append", md: "The primary appends the record, tells the secondaries to write it at the **exact same offset**, and replies success to the client." },
      { title: "On failure", md: "If the append fails at any replica, the client retries. Replicas may then contain **duplicates** of the record; GFS only guarantees the data is written at least once as an atomic unit." },
    ],
  },
  {
    kind: "prose",
    md: "**Snapshot** makes a copy of a file or directory tree almost instantly, using **copy-on-write**: the master revokes outstanding leases, logs the operation and duplicates only the metadata; a chunk is physically copied only when someone first writes to it after the snapshot.",
  },
  { kind: "concepts", ids: ["lease", "record-append"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Why does a GFS client push data to all replicas before the write request?", answer: "To separate data flow from control flow: data moves along a chain of chunkservers using all network bandwidth, while the primary only orders the mutation." },
      { prompt: "How long is a chunk lease, and how is it extended?", answer: "60 seconds initially; extended on request, piggybacked on HeartBeat messages." },
      { prompt: "What does record append guarantee?", answer: "The record is written atomically (contiguously) at least once, at an offset GFS chooses and returns." },
      { prompt: "Why limit records to a quarter of the chunk size?", answer: "A record that does not fit causes the chunk to be padded; the limit bounds the wasted space." },
    ],
  },
  {
    kind: "practice",
    id: "l9-record-append",
    tasks: [
      {
        id: "append-fit",
        prompt: "The last chunk of a file holds 60 MB. Three clients record-append 3 MB, 2 MB and 4 MB, in that order at the primary. At which chunk offsets (in MB) do the first two land, and what happens to the third?",
        check: { mode: "open" },
        solution: "The 3 MB record lands at **60 MB** (chunk now 63 MB). The 2 MB record does not fit (63 + 2 > 64): the primary **pads** the chunk to 64 MB and the client retries on a **new chunk**, where it lands at offset **0**. The 4 MB record then lands at offset **2 MB** of the new chunk.",
      },
    ],
  },
];

const gfsFaultTolerance: Block[] = [
  {
    kind: "prose",
    md: "**Consistency model.** Namespace mutations (such as creating a file) are atomic — the master handles them with locks and its operation log fixes their order. For file data, the paper defines two properties of a file region:\n\n- **consistent** — all clients always see the same data, whichever replica they read;\n- **defined** — consistent, *and* clients see what one mutation wrote in its entirety.",
  },
  {
    kind: "table",
    headers: ["Outcome", "Write", "Record append"],
    rows: [
      ["Serial success", "Defined", "Defined, interspersed with inconsistent regions"],
      ["Concurrent successes", "Consistent but undefined", "Defined, interspersed with inconsistent regions"],
      ["Failure", "Inconsistent", "Inconsistent"],
    ],
    caption: "File region state after a mutation (GFS paper, Table 1).",
  },
  {
    kind: "prose",
    md: "Applications live with this by **appending rather than overwriting**, **checkpointing**, and writing **self-validating, self-identifying records**: checksums let readers skip padding and fragments, and unique record ids let them drop duplicates.\n\n**Fault-tolerance mechanisms.**\n\n- **Fast recovery** — the master and chunkservers restore their state and start in seconds, however they were terminated.\n- **Chunk replication** — three replicas on different machines and **different racks**; the master **re-replicates** as soon as a replica count drops, giving priority to the chunks that lost most replicas.\n- **Master replication** — the operation log and checkpoints are replicated on several machines; a mutation commits only when its log record is flushed locally and remotely. If the master dies, a new one starts elsewhere from the log. **Shadow masters** give read-only access while the master is down.\n- **Data integrity** — each chunk is divided into **64 KB blocks**, each with a **32-bit checksum**, kept in memory and logged. A chunkserver verifies the checksums before returning data, so corruption never propagates; on a mismatch the reader goes to another replica and the master clones a good copy.\n- **Stale replicas** — the master keeps a **chunk version number** and increments it whenever it grants a new lease. A replica that missed mutations while its chunkserver was down keeps an old version, is detected when the chunkserver reports its chunks, and is garbage-collected.",
  },
  {
    kind: "prose",
    md: "**Garbage collection.** Deleting a file does not free its space immediately. The master logs the deletion and **renames the file to a hidden name** with the deletion timestamp. During its regular namespace scan it removes hidden files **older than three days** (configurable); until then the file can be undeleted by renaming it back. In the scan of the chunk namespace, the master finds **orphaned chunks** — not reachable from any file — and erases their metadata; in HeartBeat exchanges, chunkservers learn which of their chunks are no longer known and delete them. This lazy approach is simple and reliable in a system where creations and deletions can fail halfway.",
  },
  { kind: "concepts", ids: ["consistency-model"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Consistent versus defined?", answer: "Consistent: every replica shows the same bytes. Defined: consistent and showing exactly what one mutation wrote." },
      { prompt: "How does GFS detect corrupted data?", answer: "A 32-bit checksum per 64 KB block, verified by the chunkserver before it returns data." },
      { prompt: "How does GFS detect stale replicas?", answer: "Chunk version numbers, incremented by the master at each new lease." },
      { prompt: "What happens when a GFS file is deleted?", answer: "It is renamed to a hidden name; the master removes it after three days, and chunkservers delete the orphaned chunks via HeartBeats." },
    ],
  },
];

const hdfsArchitecture: Block[] = [
  {
    kind: "prose",
    md: "**HDFS**, the *Hadoop Distributed File System*, is the open-source file system modelled on GFS. It was built as infrastructure for the Apache Nutch web search engine and is part of Apache Hadoop. It is **highly fault tolerant**, designed for **low-cost hardware**, and gives **high-throughput** access to large data sets by relaxing a few POSIX requirements.",
  },
  {
    kind: "table",
    headers: ["Assumption and goal", "What it means"],
    rows: [
      ["Hardware failure", "Hundreds or thousands of machines: some component is always failing, so detection and quick automatic recovery are core"],
      ["Streaming data access", "Batch processing rather than interactive use; high throughput over low latency"],
      ["Large data sets", "Files of gigabytes to terabytes; hundreds of nodes; tens of millions of files"],
      ["Simple coherency model", "Write-once-read-many: a file once created, written and closed is not changed"],
      ["Moving computation is cheaper than moving data", "Run the computation near its data to avoid network congestion"],
      ["Portability", "Java, so it runs on heterogeneous hardware and software platforms"],
    ],
  },
  {
    kind: "prose",
    md: "**NameNode and DataNodes.** HDFS has a **master/slave** architecture. A cluster has a single **NameNode**, a master server that manages the file system **namespace** and regulates access by clients, and many **DataNodes**, usually one per machine, that manage the storage attached to their machine. A file is split into **blocks** stored on DataNodes. The NameNode executes namespace operations — open, close, rename files and directories — and decides the **mapping of blocks to DataNodes**. DataNodes serve read and write requests and create, delete and replicate blocks **on the NameNode's instruction**. User data **never flows through the NameNode**.\n\n**Namespace.** A traditional hierarchy: directories and files that can be created, removed, moved and renamed (Borthakur's 2007 version had no quotas, permissions or links). The NameNode records every change, including each file's **replication factor** — the number of copies the application asked for.",
  },
  {
    kind: "figure",
    src: "dfs/hdfs-architecture.jpg",
    alt: "HDFS architecture: clients send metadata operations to the NameNode, which stores metadata such as /home/foo/data with 3 replicas and sends block operations to DataNodes; clients read from and write to DataNodes in rack 1 and rack 2, and blocks are replicated between racks.",
    width: 2296,
    height: 1354,
    caption: "HDFS architecture: metadata through the NameNode, data directly to and from DataNodes on several racks.",
  },
  {
    kind: "prose",
    md: "**Metadata persistence.** The NameNode keeps the whole namespace and the block map **in memory** — compact enough that 4 GB of RAM supports a huge number of files. On disk it uses two files in its local file system:\n\n- the **EditLog**, a transaction log recording every change to the metadata (creating a file, changing a replication factor…);\n- the **FsImage**, the entire namespace including the mapping of blocks to files.\n\nAt a **checkpoint**, the NameNode reads the FsImage and EditLog, applies all EditLog transactions to the in-memory image, writes a new FsImage and truncates the log. Several copies of both files can be kept, updated synchronously. The **Secondary NameNode** — a good machine, on a **separate rack** — takes these periodic checkpoints (**every hour**), so the EditLog does not grow without bound. It is **not** a standby: the NameNode is a **single point of failure** and its failure needed manual intervention. Later versions add **high availability**: an active and a standby NameNode sharing the edit logs, with ZooKeeper and failover controllers electing the leader.\n\nA DataNode knows nothing about HDFS files: it stores each block as a separate file in its local file system, spread over subdirectories. At start-up it scans its disks and sends the list of its blocks to the NameNode — the **Blockreport**.",
  },
  {
    kind: "figure",
    src: "dfs/hdfs-checkpoint.jpg",
    alt: "The NameNode holds editlog and fsimage; the Secondary NameNode merges editlog.copy and fsimage.copy into fsimage.ckpt and uploads the new fsimage to the NameNode.",
    width: 1840,
    height: 842,
    caption: "A checkpoint by the Secondary NameNode, every hour.",
  },
  {
    kind: "figure",
    src: "dfs/hdfs-high-availability.jpg",
    alt: "HDFS high availability: an active and a standby NameNode share edit logs; failover controllers monitor their health and a ZooKeeper service elects the leader; DataNodes report to both.",
    width: 2266,
    height: 1202,
    caption: "High availability in later HDFS versions: an active and a standby NameNode.",
  },
  {
    kind: "table",
    headers: ["GFS", "HDFS"],
    rows: [
      ["Master", "NameNode"],
      ["Chunkserver", "DataNode"],
      ["Chunk, 64 MB", "Block, 64 MB (later 128 MB)"],
      ["Operation log and checkpoint", "EditLog and FsImage"],
      ["HeartBeat", "Heartbeat and Blockreport"],
      ["Shadow master", "Secondary NameNode (checkpoints only)"],
      ["Record append, multiple writers", "Write-once, a single writer at a time"],
    ],
    caption: "The same design under two sets of names.",
  },
  { kind: "concepts", ids: ["namenode", "editlog-fsimage"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What does the NameNode do, and what do DataNodes do?", answer: "NameNode: namespace operations and the block-to-DataNode mapping. DataNodes: store blocks, serve reads and writes, create/delete/replicate blocks on instruction." },
      { prompt: "EditLog versus FsImage?", answer: "EditLog: log of every metadata change. FsImage: full namespace and block mapping. A checkpoint applies the log to the image." },
      { prompt: "Is the Secondary NameNode a backup NameNode?", answer: "No — it only makes hourly checkpoints. The NameNode remains a single point of failure." },
      { prompt: "Which HDFS assumption allows its simple coherency model?", answer: "Write-once-read-many: files are not changed after they are closed." },
    ],
  },
];

const hdfsReplication: Block[] = [
  {
    kind: "prose",
    md: "**Blocks.** Files are shredded into **blocks** of a typical **64 or 128 MB** (configurable per file); all blocks of a file have the same size **except the last**. If possible, each block of a file lives on a different DataNode. Files have **strictly one writer** at a time.\n\n**Replication.** Every block is replicated for fault tolerance — **default replication factor 3**, set per file at creation and changeable later. The NameNode makes all replication decisions. It periodically receives from each DataNode a **Heartbeat** (the DataNode is working) and a **Blockreport** (the list of all its blocks). DataNode failure is the common case: with 1000 machines that last 1000 days each, expect one a day.",
  },
  {
    kind: "prose",
    md: "**Rack awareness.** A large cluster spreads over many **racks** of 30–40 DataNodes; traffic between racks goes through switches, so bandwidth inside a rack is higher. Each DataNode reports its **rack id** to the NameNode when it registers. Replicas must **not all be on the same rack, and not on the same node**.\n\n- Putting every replica on a **unique rack** survives rack failures and uses several racks' bandwidth for reads, but every write crosses racks.\n- Borthakur's default for factor 3: **one replica on a node in the local rack, another on a different node in the local rack, the last on a node in a different rack**. Rack failures are far rarer than node failures, so this keeps reliability while cutting inter-rack write traffic. One third of the replicas are on one node, two thirds on one rack.\n\n**Replica selection.** A reader is served from the replica **closest** to it — same rack first, then the local data centre. Note that the storage needed is **3×** the data size.",
  },
  {
    kind: "interactive",
    title: "Rack-aware replication and re-replication",
    description: "Six blocks with three replicas each over three racks. Fail DataNodes or a whole rack, then let the NameNode restore the replication factor.",
    component: ReplicaPlacementLab,
  },
  {
    kind: "prose",
    md: "**Re-replication.** The NameNode marks a DataNode without recent Heartbeats **dead** and sends it no more I/O; its blocks are no longer available, and some blocks fall below their replication factor. The NameNode constantly tracks these and starts **re-replication** from a surviving replica. It is also needed when a replica is corrupted, a disk fails, or a file's replication factor is increased.\n\n**SafeMode.** On start-up the NameNode is in **SafeMode** and replicates nothing. It collects Heartbeats and Blockreports; a block is *safely replicated* once its minimum number of replicas has checked in. When a configurable percentage of blocks is safe (plus 30 seconds), the NameNode leaves SafeMode and replicates the blocks that still have too few replicas.",
  },
  { kind: "concepts", ids: ["rack-awareness", "heartbeat"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Where does HDFS put the three replicas of a block?", answer: "Two on different nodes of one rack, the third on a node of a different rack — never all on one rack or one node." },
      { prompt: "What is in a Blockreport?", answer: "The list of all blocks stored on a DataNode." },
      { prompt: "What triggers re-replication?", answer: "A dead DataNode, a corrupted replica, a failed disk, or an increased replication factor." },
      { prompt: "What is SafeMode?", answer: "The NameNode's start-up state: no replication until enough blocks have reported their minimum number of replicas." },
    ],
  },
  {
    kind: "practice",
    id: "l9-replication",
    tasks: [
      {
        id: "blocks-of-file",
        prompt: "A 300 MB file is stored with 128 MB blocks and replication factor 3. How many block replicas are stored in total?",
        check: { mode: "text", accept: ["9"], placeholder: "replicas" },
        solution: "300 / 128 → **3 blocks** (128, 128 and a last block of 44 MB). With 3 replicas each: **9** block replicas, using 900 MB of disk.",
      },
      {
        id: "rack-failure",
        prompt: "Why does losing a whole rack never lose a block under the default placement?",
        check: { mode: "open" },
        solution: "Every block has replicas on **two different racks**. A single rack failure removes at most two of the three replicas, and the NameNode re-replicates from the survivor.",
      },
    ],
  },
];

const hdfsIo: Block[] = [
  {
    kind: "steps",
    title: "Reading a file",
    steps: [
      { title: "1. open()", md: "The HDFS client calls open() on the DistributedFileSystem object." },
      { title: "2. Get block locations", md: "DistributedFileSystem asks the NameNode, over RPC, for the locations of the first blocks; for each block the NameNode returns the DataNodes holding a replica, sorted by distance to the client." },
      { title: "3–5. Read", md: "The client reads through an FSDataInputStream, which connects to the **closest** DataNode of the first block and streams it; at the end of the block it closes that connection and moves to the best DataNode for the next block." },
      { title: "6. close()", md: "When the client has read everything, it closes the stream. A corrupted block (checksum mismatch) is read from another replica." },
    ],
  },
  {
    kind: "figure",
    src: "dfs/hdfs-read.jpg",
    alt: "HDFS read: the HDFS client calls open() on the DistributedFileSystem, which gets block locations from the NameNode over RPC; the client reads through an FSDataInputStream from the DataNodes and finally closes it.",
    width: 2402,
    height: 1108,
    caption: "Reading an HDFS file.",
  },
  {
    kind: "figure",
    src: "dfs/hdfs-read-example.jpg",
    alt: "HDFS read example: the client asks the NameNode for blocks A and B, gets the locations DN1 and DN2, and reads both blocks through the core and rack switches from the closest DataNodes on rack 1.",
    width: 2234,
    height: 1158,
    caption: "Read example: blocks A and B are read from the closest DataNodes.",
  },
  {
    kind: "prose",
    md: "**Staging.** A create request does not reach the NameNode immediately. The client first **caches the file data in a temporary local file**; when it holds more than one block, the client contacts the NameNode, which inserts the file name into the namespace, allocates a block and returns the DataNodes for it. The client flushes the block to them. On close, the rest is flushed and the NameNode **commits** the file creation — if the NameNode dies before the close, the file is lost. Writing remote files directly would make throughput depend on network speed and congestion.",
  },
  {
    kind: "steps",
    title: "Writing a block — the replication pipeline",
    steps: [
      { title: "1. create()", md: "The client calls create() on DistributedFileSystem, which asks the NameNode to create the file in the namespace." },
      { title: "2. Get DataNodes", md: "For each block, the NameNode returns the list of DataNodes that will hold a replica, chosen rack-aware." },
      { title: "3–4. Write packets", md: "The client writes through an FSDataOutputStream to the **first** DataNode, in small portions (4 KB in Borthakur's description). The first DataNode stores each portion and forwards it to the second, which stores it and forwards it to the third — a **pipeline**: each DataNode receives from the previous one while forwarding to the next." },
      { title: "5. Acknowledge", md: "Acknowledgements flow back along the pipeline; the write is acknowledged to the client once the required replicas are made." },
      { title: "6. close()", md: "The client closes the stream and tells the NameNode the file is complete." },
    ],
  },
  {
    kind: "figure",
    src: "dfs/hdfs-create-pipeline.jpg",
    alt: "The HDFS client sends addBlock to the NameNode and writes to the first DataNode; the data is pipelined through three DataNodes, which report blocks received to the NameNode.",
    width: 1354,
    height: 768,
    caption: "Creating a file: one block written through a pipeline of three DataNodes.",
  },
  {
    kind: "figure",
    src: "dfs/hdfs-write.jpg",
    alt: "HDFS write: create() on DistributedFileSystem, create at the NameNode, write through an FSDataOutputStream; packets flow through a pipeline of DataNodes (4.1–4.3) and acknowledgements flow back (5.1–5.3); finally close and complete.",
    width: 2220,
    height: 1134,
    caption: "Writing an HDFS file: packets go down the pipeline, acknowledgements come back.",
  },
  {
    kind: "figure",
    src: "dfs/hdfs-write-example.jpg",
    alt: "Write example: the client asks the NameNode to write block A and receives DataNodes DN1, DN6 and DN8; the block goes to DN1 on rack 1, which forwards it to DN6 on rack 2, which forwards it to DN8 on rack 3.",
    width: 2284,
    height: 1166,
    caption: "Write example: block A is pipelined DN1 → DN6 → DN8. This example uses three racks; Borthakur's default policy would put two replicas on one rack.",
  },
  {
    kind: "figure",
    src: "dfs/hdfs-write-acks.jpg",
    alt: "Acknowledgements flow back: DN8 acknowledges to DN6, DN6 to DN1, DN1 to the client, which then knows that DN1, DN6 and DN8 hold block A.",
    width: 2144,
    height: 1178,
    caption: "…and the acknowledgements travel back up the pipeline.",
  },
  {
    kind: "prose",
    md: "**Robustness.** The three common failures are NameNode failures, DataNode failures and network partitions; Heartbeats and re-replication handle the DataNodes. **Data integrity**: when a client creates a file it computes a **checksum of each block** and stores them in a hidden file in the same namespace; on reading it verifies the data and fetches a block from another replica on a mismatch. **Metadata disk failure** is covered by keeping several synchronously updated copies of the FsImage and EditLog. **Rebalancing** schemes can move blocks when a DataNode runs low on space or a file is suddenly in high demand.\n\n**Communication**: all protocols run on TCP/IP — clients use the ClientProtocol and DataNodes the DatanodeProtocol, both wrapped in **RPC**. The NameNode **never initiates an RPC**; it only answers.",
  },
  {
    kind: "table",
    headers: ["Feature", "How it works"],
    rows: [
      ["Delete and undelete", "A deleted file is moved to /trash and can be restored while there; it is removed after a configurable time (6 hours by default in the 2007 design), and only then is its space freed"],
      ["Decrease replication", "The NameNode picks excess replicas; the next Heartbeat tells the DataNodes to delete them"],
      ["DFSShell", "Command line, e.g. bin/hadoop dfs -mkdir /foodir and bin/hadoop dfs -cat /foodir/myfile.txt"],
      ["DFSAdmin", "Administration, e.g. bin/hadoop dfsadmin -safemode enter, -report, -decommission"],
      ["Browser interface", "A web server exposes the namespace and file contents"],
      ["Multiple directories", "A DataNode can spread its blocks over several local directories and disks"],
    ],
    caption: "Other HDFS features.",
  },
  {
    kind: "info",
    variant: "note",
    title: "Advantages of HDFS",
    md: "**Scalable** (add DataNodes), **cost-effective** (commodity hardware), **fault tolerant** (replication, re-replication, checksums) and **secure**. HDFS is not built for low-latency access or many small files: each file costs NameNode memory and data is streamed in large blocks.",
  },
  {
    kind: "recall",
    cards: [
      { prompt: "From which replica does an HDFS reader read?", answer: "The closest one — same node, then same rack, then the local data centre." },
      { prompt: "What is staging in HDFS?", answer: "The client buffers file data in a local temporary file and contacts the NameNode only once a full block has accumulated." },
      { prompt: "How do the three replicas get written?", answer: "Through a pipeline: the client sends to the first DataNode, which forwards to the second, which forwards to the third, while acks flow back." },
      { prompt: "What happens when a user deletes an HDFS file?", answer: "It moves to /trash; it can be undeleted until it expires, then the NameNode deletes it and the blocks are freed." },
    ],
  },
];

const mistakes: Block[] = [
  { kind: "info", variant: "pitfall", title: "Thinking data flows through the master", md: "The GFS master and the HDFS NameNode only serve metadata. Clients read and write blocks directly from and to chunkservers or DataNodes." },
  { kind: "info", variant: "pitfall", title: "Calling the Secondary NameNode a backup", md: "It only merges the EditLog into the FsImage every hour. It does not take over when the NameNode fails." },
  { kind: "info", variant: "pitfall", title: "Expecting record append to happen exactly once", md: "It is atomic and **at least once**: retries can leave duplicates and padding, which readers filter with checksums and record ids." },
  { kind: "info", variant: "pitfall", title: "Putting all replicas on different racks", md: "That is the simple policy Borthakur rejects for writes. The default places two replicas on one rack and the third on another rack." },
  { kind: "info", variant: "pitfall", title: "Forgetting that the last block is smaller", md: "All blocks of a file are the same size except the last one, which only holds what is left." },
];

const quiz: Block[] = [{ kind: "prose", md: "Twelve questions on DFS requirements, NFS and RAID, GFS and HDFS." }];

const summary: Block[] = [
  { kind: "list", variant: "takeaways", items: lecture09Meta.takeaways },
  {
    kind: "table",
    headers: ["Concept", "Remember"],
    rows: [
      ["NFS", "1985, stateless server, mount, caching and read-ahead; not very fault tolerant or scalable"],
      ["RAID", "0 striping, 1 mirroring, 2–4 striping with ECC or a parity disk, 5 distributed parity"],
      ["GFS chunk", "64 MB, 64-bit handle, 3 replicas, < 64 bytes of master metadata"],
      ["GFS write", "push data to all replicas → primary (60 s lease) orders → secondaries apply → reply"],
      ["Record append", "atomic, at least once, GFS picks the offset; pad and retry if it does not fit; ≤ 1/4 chunk"],
      ["GFS integrity", "32-bit checksum per 64 KB, chunk version numbers, lazy GC after 3 days"],
      ["HDFS metadata", "EditLog + FsImage on the NameNode; Secondary NameNode checkpoints hourly"],
      ["HDFS replicas", "factor 3: two on one rack, one on another; Heartbeat + Blockreport; re-replicate on failure"],
      ["HDFS write", "staging, then a DataNode pipeline with acks"],
    ],
  },
];

export const lecture09Blocks: SectionBlocks<typeof lecture09Outline> = {
  objectives,
  "why-dfs": whyDfs,
  "early-systems": earlySystems,
  "gfs-design": gfsDesign,
  "gfs-operations": gfsOperations,
  "gfs-fault-tolerance": gfsFaultTolerance,
  "hdfs-architecture": hdfsArchitecture,
  "hdfs-replication": hdfsReplication,
  "hdfs-io": hdfsIo,
  mistakes,
  quiz,
  summary,
};
