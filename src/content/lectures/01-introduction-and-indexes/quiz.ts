import type { QuizQuestion } from "@/content/types";

export const lecture01Quiz: QuizQuestion[] = [
  {
    id: "q-assessment",
    prompt: "How is Data Intensive Systems assessed?",
    options: [
      { id: "a", text: "A final test worth 40% and a project worth 60%, of which 10 points come from the presentation." },
      { id: "b", text: "A final test worth 60% and a project of your own choosing worth 40%." },
      { id: "c", text: "Weekly quizzes worth 40% and a final exam worth 60%." },
      { id: "d", text: "A project worth 100%, presented in groups." },
    ],
    answerId: "a",
    explanation:
      "The final test (multiple choice or short answers) counts 40%. The project counts 60%: a computationally intensive data-processing task made efficient with distributed techniques and NoSQL technologies. The topic is the same for everyone, and 10 of the 60 points are for the presentation.",
  },
  {
    id: "q-zettabyte",
    prompt: "One zettabyte is 10ⁿ bytes. What is n?",
    options: [
      { id: "a", text: "12" },
      { id: "b", text: "18" },
      { id: "c", text: "21" },
      { id: "d", text: "24" },
    ],
    answerId: "c",
    explanation:
      "1 ZB = $10^{21}$ bytes = 1,000 exabytes = 1,000,000 petabytes = one billion terabytes. The estimated total for 2025 is 200 ZB.",
  },
  {
    id: "q-data-model",
    prompt: "Which three components make up a data model?",
    options: [
      { id: "a", text: "Tables, rows and columns." },
      { id: "b", text: "Structures, constraints and operations." },
      { id: "c", text: "Atomicity, consistency and durability." },
      { id: "d", text: "Storage, indexing and query processing." },
    ],
    answerId: "b",
    explanation:
      "A data model defines the **structures** data is organised in, the **constraints** it must satisfy, and the **operations** available on it. Tables, rows and columns are just the structures of the relational model.",
  },
  {
    id: "q-tf-idf",
    prompt:
      "A collection has 2²⁰ documents and word w appears in 2¹⁰ of them. In document k, w appears once while the most frequent word appears 20 times. What is the TF.IDF score of w in k?",
    options: [
      { id: "a", text: "10" },
      { id: "b", text: "1/20" },
      { id: "c", text: "1/2" },
      { id: "d", text: "20" },
    ],
    answerId: "c",
    explanation:
      "$IDF_w = \\log_2(2^{20}/2^{10}) = 10$ and $TF_{wk} = 1/20$, so the score is $10/20 = 1/2$. In a document where w is itself the most frequent word, $TF = 1$ and the score is 10 — the book's Example 1.4.",
  },
  {
    id: "q-hash-buckets",
    prompt: "Hash-keys are even integers and h(x) = x mod B. Which choice of B spreads them evenly?",
    options: [
      { id: "a", text: "B = 10, because ten buckets match the decimal digits." },
      { id: "b", text: "B = 16, because powers of two are fastest." },
      { id: "c", text: "B = 11, because it shares no factor with the keys." },
      { id: "d", text: "Any B works as long as it is larger than the number of keys." },
    ],
    answerId: "c",
    explanation:
      "With B = 10 (or 16) every even key lands in an even bucket, so half the buckets stay empty. A prime B such as 11 shares no factor with the keys, and each bucket gets 1/11 of them.",
  },
  {
    id: "q-extendible-doubling",
    prompt: "In extendible hashing, when does inserting into a full bucket double the directory?",
    options: [
      { id: "a", text: "Every time a bucket splits." },
      { id: "b", text: "When the full bucket's local depth equals the global depth." },
      { id: "c", text: "When the full bucket's local depth is smaller than the global depth." },
      { id: "d", text: "Never — extendible hashing adds overflow pages instead." },
    ],
    answerId: "b",
    explanation:
      "A bucket of local depth $l$ is pointed to by $2^{d-l}$ directory elements. If $l < d$ there are at least two, and the split just rewires half of them. If $l = d$ only one element points to it, so distinguishing the two halves needs one more bit — the directory doubles and $d$ grows by one.",
  },
  {
    id: "q-linear-split",
    prompt: "In linear hashing, an insert into bucket 3 needs an overflow page while Next = 1. What happens?",
    options: [
      { id: "a", text: "Bucket 3 is split, and Next becomes 4." },
      { id: "b", text: "Bucket 1 is split into bucket 1 and its split image 1 + N_Level, and Next becomes 2; the new entry stays in bucket 3's overflow page." },
      { id: "c", text: "The directory doubles." },
      { id: "d", text: "Nothing — splits only happen at the end of a round." },
    ],
    answerId: "b",
    explanation:
      "Linear hashing always splits the bucket **Next** points to, round-robin, regardless of which bucket overflowed. The overflow page is temporary: bucket 3 will be split later in the round and its entries redistributed with $h_{Level+1}$.",
  },
  {
    id: "q-copy-push",
    prompt: "When a B+ tree of order d = 2 splits a full leaf, and then a full index node, what happens to the separating keys?",
    options: [
      { id: "a", text: "Both are pushed up and disappear from the lower level." },
      { id: "b", text: "Both are copied up and appear twice." },
      { id: "c", text: "The leaf key is copied up (it stays in the leaf); the index key is pushed up (it moves)." },
      { id: "d", text: "The leaf key is pushed up; the index key is copied up." },
    ],
    answerId: "c",
    explanation:
      "Every data entry must remain at the leaf level, so the smallest key of the new leaf is **copied** into the parent. An index node has 2d + 1 keys after the overflow; d stay, d move to the new node, and the middle key is **pushed** up — appearing once. Inserting 8* into the textbook tree copies 5 up and pushes 17 up.",
  },
  {
    id: "q-order",
    prompt: "In a B+ tree of order d = 2, how many entries may a non-root node hold?",
    options: [
      { id: "a", text: "Between 1 and 2." },
      { id: "b", text: "Between 2 and 4." },
      { id: "c", text: "Exactly 4." },
      { id: "d", text: "Any number, as long as the tree stays balanced." },
    ],
    answerId: "b",
    explanation:
      "Each node except the root holds $d \\le m \\le 2d$ entries — between 2 and 4 here — which guarantees at least 50% occupancy. The root only needs $1 \\le m \\le 2d$.",
  },
  {
    id: "q-delete",
    prompt: "Deleting an entry leaves a B+ tree leaf below d entries, and its sibling also holds exactly d entries. What does the algorithm do?",
    options: [
      { id: "a", text: "Redistributes entries from the sibling." },
      { id: "b", text: "Merges the two leaves and removes the separating entry from the parent, which may underflow in turn." },
      { id: "c", text: "Leaves the leaf under-full; B+ trees tolerate it." },
      { id: "d", text: "Rebuilds the tree with bulk-loading." },
    ],
    answerId: "b",
    explanation:
      "Redistribution needs a sibling with entries to spare. With exactly d, the two leaves together hold at most 2d − 1 entries and fit on one page, so they merge and the parent's entry for the right leaf is tossed. If the parent now underflows, the same choice repeats one level up — and if the root loses its last key, the height shrinks.",
  },
  {
    id: "q-range",
    prompt: "Which index should serve “all employees with salary between 40,000 and 60,000”?",
    options: [
      { id: "a", text: "A hash index on salary, because hashing is faster." },
      { id: "b", text: "A B+ tree on salary: one descent to 40,000, then a scan along the leaf chain." },
      { id: "c", text: "Either — both support range searches equally well." },
      { id: "d", text: "No index can help with a range query." },
    ],
    answerId: "b",
    explanation:
      "Hashing scatters neighbouring values over unrelated buckets, so a hash index cannot answer range searches. The B+ tree finds the first qualifying leaf and walks the sorted, chained leaves until the values exceed 60,000.",
  },
  {
    id: "q-clustered",
    prompt: "Why does it matter whether a B+ tree index is clustered for a range query returning many records?",
    options: [
      { id: "a", text: "It does not; the index entries are sorted either way." },
      { id: "b", text: "A clustered index finds the first record faster." },
      { id: "c", text: "With a clustered index matching records sit on few consecutive pages; unclustered, each record can cost its own page read." },
      { id: "d", text: "Only unclustered indexes support range queries." },
    ],
    answerId: "c",
    explanation:
      "The data entries are sorted in both cases, but the **records** they point to are only in that order for a clustered index. Unclustered, consecutive data entries point all over the data file, so retrieving many records can take up to one I/O each.",
  },
];
