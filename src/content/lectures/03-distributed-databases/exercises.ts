import type { ExerciseSheet } from "@/content/types";

const QUORUM_SUBSETS = [
  "A1",
  "A2",
  "A3",
  "A4",
  "A1, A2",
  "A1, A3",
  "A1, A4",
  "A2, A3",
  "A2, A4",
  "A3, A4",
  "A1, A2, A3",
  "A1, A2, A4",
  "A1, A3, A4",
  "A2, A3, A4",
  "A1, A2, A3, A4",
];

export const sheet01: ExerciseSheet = {
  id: "sheet-01",
  title: "Exercise sheet 01",
  description:
    "The seven homework problems on fragmentation, quorum consensus and Bloom filter joins. Type your answer, check the ones that grade themselves, and reveal the official solution when you are ready.",
  source: "Data Intensive Systems, Fall 2026 — Sheet 01",
  exercises: [
    {
      id: "hw1",
      title: "Canonical and optimized plan over a combined fragmentation",
      intro: `The relation **Professors**:

| PersNr | Name | Level | Room | Department | Salary | Taxclass |
| --- | --- | --- | --- | --- | --- | --- |
| 2125 | Sokrates | C4 | 226 | Philosophy | 85000 | 1 |
| 2126 | Russel | C4 | 232 | Philosophy | 80000 | 3 |
| 2127 | Kopernikus | C3 | 310 | Physics | 65000 | 5 |
| 2133 | Popper | C3 | 52 | Philosophy | 68000 | 1 |
| 2134 | Augustinus | C3 | 309 | Theology | 55000 | 5 |
| 2136 | Curie | C4 | 36 | Physics | 95000 | 3 |
| 2137 | Kant | C4 | 7 | Philosophy | 98000 | 1 |

It is fragmented in two stages. First **vertically**:

$\\text{ProfVerw} := \\Pi_{PersNr, Name, Salary, Taxclass}(\\text{Professors})$

$\\text{Profs} := \\Pi_{PersNr, Name, Level, Room, Department}(\\text{Professors})$

Then the fragment Profs is fragmented **horizontally**:

$\\text{TheolProfs} := \\sigma_{Department = \\text{'Theology'}}(\\text{Profs})$

$\\text{PhysikProfs} := \\sigma_{Department = \\text{'Physics'}}(\\text{Profs})$

$\\text{PhiloProfs} := \\sigma_{Department = \\text{'Philosophy'}}(\\text{Profs})$

The query to translate:

    select Name, Salary, Level
    from   Professors
    where  salary > 80000;`,
      tasks: [
        {
          id: "hw1-a",
          prompt: "Translate the query into the **canonical form** over the fragments — reconstruct the relation first, then apply the query.",
          check: { mode: "open", palette: "algebra" },
          hint: "Rebuild Profs from its three horizontal fragments with ∪, then rebuild Professors by joining that to ProfVerw on PersNr. Only then apply the selection and the projection.",
          solution: `$\\Pi_{Name, Salary, Level}\\Big(\\sigma_{Salary > 80000}\\big(\\text{ProfVerw} \\bowtie_{PersNr = PersNr} (\\text{TheolProfs} \\cup \\text{PhysikProfs} \\cup \\text{PhiloProfs})\\big)\\Big)$

As a tree, bottom up:

    ProfVerw          TheolProfs ∪ PhysikProfs ∪ PhiloProfs
            ⋈ PersNr = PersNr
            σ Salary > 80000
            Π Name, Salary, Level

This is correct but wasteful: the whole relation is reconstructed before a single tuple is filtered away.`,
        },
        {
          id: "hw1-b",
          prompt: "Now **optimize** the plan using algebraic transformation rules. Name the rules you apply.",
          check: { mode: "open", palette: "algebra" },
          hint: "Two moves: push the selection down towards the table scans, and insert extra projections to keep intermediate results small. Which attribute is stored redundantly in both vertical fragments?",
          solution: `$\\Pi_{Name, Salary, Level}\\Big(\\Pi_{PersNr, Name, Salary}\\big(\\sigma_{Salary > 80000}(\\text{ProfVerw})\\big) \\bowtie_{PersNr = PersNr} \\big(\\Pi_{PersNr, Level}(\\text{TheolProfs}) \\cup \\Pi_{PersNr, Level}(\\text{PhysikProfs}) \\cup \\Pi_{PersNr, Level}(\\text{PhiloProfs})\\big)\\Big)$

The two steps:

1. **Push the selection down.** $\\sigma_{Salary > 80000}$ only mentions Salary, which lives in ProfVerw alone, so it moves below the join and straight onto that fragment scan. The horizontal fragments are untouched by it.
2. **Insert additional projections.** Keep the intermediate results as small as possible: the ProfVerw branch needs only PersNr, Name and Salary, and each horizontal fragment needs only PersNr and Level. Note that **Name is redundant** — it is stored in both vertical fragments — so it is projected away on the Profs side and taken from ProfVerw.`,
        },
      ],
    },
    {
      id: "hw2",
      title: "Fragmenting the exam relation",
      intro: `The relation **exam** with key StudNr:

| StudNr | Name | Grade | Location |
| --- | --- | --- | --- |
| 10101 | Philipp | 1,0 | München |
| 10102 | Magdalena | 1,0 | Garching |
| 10103 | Erik | 1,0 | Garching |
| 10104 | Josef | 1,0 | Garching |
| 10105 | Alex | 1,0 | Garching |
| 10106 | Maximilian | 1,0 | München |

The table is to be fragmented for a distributed database. The goal is to store the **names with the location** of the students locally, and the **grades** separately.`,
      tasks: [
        {
          id: "hw2-a",
          prompt: "Fragment the relation vertically. Give the schema of the two resulting relations **ExamV1** and **ExamV2**, marking the primary key of each.",
          check: { mode: "open" },
          hint: "Both fragments must keep the key, otherwise the join back is not lossless.",
          solution: `$\\text{ExamV1}: \\{[\\underline{StudNr}, Grade]\\}$

$\\text{ExamV2}: \\{[\\underline{StudNr}, Name, Location]\\}$

StudNr is the primary key in both — it is the common candidate key that makes the reconstruction join lossless.`,
        },
        {
          id: "hw2-b",
          prompt: "Specify ExamV1 and ExamV2 in SQL-92 as CTEs (using **with**).",
          check: { mode: "open" },
          solution: `    with ExamV1 as (SELECT StudNr, Grade FROM Persons),
         ExamV2 as (SELECT StudNr, Name, Location FROM Persons)`,
        },
        {
          id: "hw2-c",
          prompt:
            "The more suitable of the two relations is now fragmented horizontally. Which relation, and with which selection predicate?",
          check: {
            mode: "select",
            options: [
              "σ Location = 'Garching' (ExamV2) and σ Location ≠ 'Garching' (ExamV2)",
              "σ Grade = 1,0 (ExamV1) and σ Grade ≠ 1,0 (ExamV1)",
              "σ StudNr ≤ 10103 (ExamV1) and σ StudNr > 10103 (ExamV1)",
              "σ Name < 'M' (ExamV2) and σ Name ≥ 'M' (ExamV2)",
            ],
            answer: ["σ Location = 'Garching' (ExamV2) and σ Location ≠ 'Garching' (ExamV2)"],
          },
          hint: "The point of the exercise is locality: which attribute says where a student's data should live?",
          solution: `ExamV2 is the suitable one, because it carries **Location** — the attribute that decides where a tuple should be stored. The predicate is on that attribute:

$Location = \\text{'Garching'}$ or $Location = \\text{'München'}$

Using the complement for the second fragment ($Location \\neq \\text{'Garching'}$) keeps the fragmentation complete even if a third location appears later.`,
        },
        {
          id: "hw2-d",
          prompt: "Specify the two resulting relations **ExamH1** and **ExamH2** in SQL-92 as CTEs.",
          check: { mode: "open" },
          solution: `    with ExamH1 as (SELECT * FROM ExamV2 WHERE Location = 'Garching'),
         ExamH2 as (SELECT * FROM ExamV2 WHERE Location <> 'Garching')`,
        },
        {
          id: "hw2-e",
          prompt: "Write a SQL query that composes the original relation back from the sub-relations.",
          check: { mode: "open" },
          hint: "Two operators, in this order: union the horizontal fragments, then join the result to the other vertical fragment on the key.",
          solution: `    select ExamV2.*, ExamV1.Grade
    from   ExamV1,
           (select * from ExamH1 union select * from ExamH2) as ExamV2
    where  ExamV1.StudNr = ExamV2.StudNr

Union undoes the horizontal fragmentation, the join on StudNr undoes the vertical one — exactly the two reconstruction operators from the lecture, applied in reverse order of fragmentation.`,
        },
      ],
    },
    {
      id: "hw3",
      title: "Why pairwise key candidates are enough",
      intro: `For the reconstructability of the original relation $R$ from vertical fragments $R_1, \\dots, R_n$, it is actually sufficient that fragments contain a key candidate **in pairs**. Illustrate why it is therefore **not** necessary that the intersection of *all* fragment schemas contains a key candidate — that is, why

$$R_1 \\cap \\cdots \\cap R_n \\supseteq \\kappa$$

need not hold, where $\\kappa$ is a key candidate of $R$.`,
      tasks: [
        {
          id: "hw3-a",
          prompt: "Give an illustrative example, preferably based on the professors relation.",
          check: { mode: "open", palette: "algebra" },
          hint: "Build a chain: fragment 1 and fragment 2 share one key, fragment 2 and fragment 3 share a different one. The reconstruction is then a chain of joins, and no attribute is common to all three.",
          solution: `Take the professors relation and split it into three fragments that form a **chain** rather than a star (primary keys underlined):

$\\text{RoomF}: \\{[\\underline{Room}, Department]\\}$

$\\text{Professors}: \\{[\\underline{PersNr}, Name, Room]\\}$

$\\text{ProfessorsR}: \\{[\\underline{PersNr}, Level]\\}$

The original relation is reconstructed as

$\\text{ProfessorsF} = \\text{RoomF} \\bowtie_{Room = Room} \\big(\\text{Professors} \\bowtie_{PersNr = PersNr} \\text{ProfessorsR}\\big)$

giving back $\\{[\\underline{PersNr}, Name, Level, Room, Department]\\}$.

**Why it works.** Professors and ProfessorsR share PersNr; Professors and RoomF share Room. Each join in the chain has a key candidate available *for that pair*, which is all a lossless join needs. But the intersection of all three schemas is **empty** — RoomF contains neither PersNr nor Name — so the condition $R_1 \\cap R_2 \\cap R_3 \\supseteq \\kappa$ is violated while reconstructability still holds.`,
        },
      ],
    },
    {
      id: "hw4",
      title: "Write-all / read-any as a special case of quorum consensus",
      tasks: [
        {
          id: "hw4-a",
          prompt: "For which kinds of workloads is the write-all / read-any method suitable, and why?",
          check: { mode: "open" },
          solution: `The method requires a very large effort for **writing** — every copy must be reached — but only minimal effort for **reading**, since any single copy suffices.

It is therefore particularly well suited to workloads in which considerably more data is read than written: analytical queries, reporting, read-heavy web serving. It is a poor fit whenever writes are frequent, or whenever a node may be unavailable, because a write fails unless every replica can be locked.`,
        },
        {
          id: "hw4-b",
          prompt: "How are the votes (weights) assigned to simulate write-all / read-any?",
          check: {
            mode: "select",
            options: [
              "Every node gets weight 1",
              "One node gets all the weight, the others get 0",
              "Weights proportional to each node's capacity",
              "Only the node holding the primary copy gets a vote",
            ],
            answer: ["Every node gets weight 1"],
          },
          solution: `$\\forall i : w_i = 1$

Every node gets exactly one vote, so with $n$ nodes the total weight is $W(A) = n$.`,
        },
        {
          id: "hw4-c",
          prompt: "How are Qw and Qr defined in that case?",
          check: {
            mode: "select",
            options: [
              "Qw = W(A) and Qr = 1",
              "Qw = 1 and Qr = W(A)",
              "Qw = Qr = W(A) / 2",
              "Qw = W(A)/2 + 1 and Qr = W(A)/2",
            ],
            answer: ["Qw = W(A) and Qr = 1"],
          },
          hint: "Write-all means the write must lock everything; read-any means one copy is enough.",
          solution: `$Q_w = W(A)$ and $Q_r = 1$.

Both quorum conditions still hold, which is what makes this a special case rather than a different protocol: $Q_r + Q_w = 1 + W > W$, and $2 Q_w = 2W > W$. The protocol is simply the extreme point of the quorum dial where all the cost has been pushed onto writes.`,
        },
      ],
    },
    {
      id: "hw5",
      title: "Enumerating read and write quorums",
      intro: `A data value 'A' is replicated over four nodes, each holding a complete copy. Quorum consensus is applied with these weights:

| Computer | Copy | Weight |
| --- | --- | --- |
| R1 | A1 | 3 |
| R2 | A2 | 1 |
| R3 | A3 | 2 |
| R4 | A4 | 2 |

with $Q_r(A) = 4$ and $Q_w(A) = 5$, so $W(A) = 8$.`,
      tasks: [
        {
          id: "hw5-a",
          prompt: "Select **all** read options — every set of copies whose weights reach the read quorum.",
          check: {
            mode: "select",
            options: QUORUM_SUBSETS,
            answer: [
              "A1, A2",
              "A1, A3",
              "A1, A4",
              "A3, A4",
              "A1, A2, A3",
              "A1, A2, A4",
              "A1, A3, A4",
              "A2, A3, A4",
              "A1, A2, A3, A4",
            ],
          },
          hint: "A set qualifies when the sum of its weights is at least 4. Do not forget that {A3, A4} already reaches it without A1.",
          solution: `Nine sets reach weight 4 or more:

| Set | Weight |
| --- | --- |
| A1, A2 | 4 |
| A1, A3 | 5 |
| A1, A4 | 5 |
| A3, A4 | 4 |
| A1, A2, A3 | 6 |
| A1, A2, A4 | 6 |
| A1, A3, A4 | 7 |
| A2, A3, A4 | 5 |
| A1, A2, A3, A4 | 8 |

Every other non-empty set falls short: {A1} = 3, {A2} = 1, {A3} = {A4} = 2, {A2, A3} = {A2, A4} = 3.`,
        },
        {
          id: "hw5-b",
          prompt: "Select **all** write options — every set of copies whose weights reach the write quorum.",
          check: {
            mode: "select",
            options: QUORUM_SUBSETS,
            answer: [
              "A1, A3",
              "A1, A4",
              "A1, A2, A3",
              "A1, A2, A4",
              "A1, A3, A4",
              "A2, A3, A4",
              "A1, A2, A3, A4",
            ],
          },
          hint: "Same sets, but the bar is 5 instead of 4. Two of the read options drop out.",
          solution: `Seven sets reach weight 5 or more:

| Set | Weight |
| --- | --- |
| A1, A3 | 5 |
| A1, A4 | 5 |
| A1, A2, A3 | 6 |
| A1, A2, A4 | 6 |
| A1, A3, A4 | 7 |
| A2, A3, A4 | 5 |
| A1, A2, A3, A4 | 8 |

Compared with the read options, {A1, A2} (weight 4) and {A3, A4} (weight 4) drop out.`,
        },
        {
          id: "hw5-c",
          prompt:
            "Show that while a transaction T1 holds a write quorum on A, no other transaction Tx can obtain a read quorum on A.",
          check: { mode: "open" },
          solution: `To write, T1 must hold copies with a total weight of at least $Q_w = 5$ locked. All copies together have a total weight of $W = 8$.

That leaves at most $8 - 5 = 3$ of weight available to anyone else — which is **less than the read quorum of 4**. So no other transaction can assemble a read quorum while T1 is writing.

This is exactly the condition $Q_r + Q_w > W$ doing its work: $4 + 5 = 9 > 8$. Reads and writes are forced to overlap, so a reader can never miss the write in progress.`,
        },
      ],
    },
    {
      id: "hw6",
      title: "Computing minimal quorums",
      intro: `A data value 'A' is replicated over four nodes, each holding a copy with a value and an ascending version number:

| Node | Copy | wᵢ(A) | Value | Version |
| --- | --- | --- | --- | --- |
| R1 | A1 | 3 | 1100 | 2 |
| R2 | A2 | 2 | 1100 | 2 |
| R3 | A3 | 1 | 1000 | 1 |
| R4 | A4 | 3 | 1000 | 1 |`,
      tasks: [
        {
          id: "hw6-a",
          prompt: "What is the minimal $Q_w(A)$?",
          check: { mode: "text", accept: ["5", "qw=5", "qw(a)=5"], placeholder: "e.g. 7" },
          hint: "W(A) = 3 + 2 + 1 + 3. The write quorum must satisfy 2·Qw > W.",
          solution: `$W(A) = 3 + 2 + 1 + 3 = 9$, and the condition is $2 Q_w > W$, so $Q_w > 4.5$ and therefore

$$Q_w(A) = 5$$

This is consistent with the table: nodes R1 and R2 carry weight $3 + 2 = 5$ and they are exactly the two holding version 2, so they were the write quorum of the last write.`,
        },
        {
          id: "hw6-b",
          prompt: "What is the minimal $Q_r(A)$ for that write quorum?",
          check: { mode: "text", accept: ["5", "qr=5", "qr(a)=5"], placeholder: "e.g. 7" },
          hint: "Use Qr + Qw > W, and take the smallest integer that satisfies it.",
          solution: `From $Q_r + Q_w > W$ we get $Q_r > 9 - 5 = 4$, so

$$Q_r(A) = W - Q_w + 1 = 9 - 5 + 1 = 5$$

Any set of copies with total weight 5 must include at least one of R1 or R2, so a reader always sees version 2.`,
        },
        {
          id: "hw6-c",
          prompt:
            "Sketch writing a new value, giving the new state as four tuples (node, value, version). Start from (1,1100,2), (2,1100,2), (3,1000,1), (4,1000,1).",
          check: { mode: "open" },
          hint: "Pick any set of nodes whose weights sum to at least 5, bump the version above the highest one you saw, and leave the others untouched.",
          solution: `Lock R1 and R2 (weight $3 + 2 = 5 \\ge Q_w$), read the highest version among them (2), and write value 1200 with version 3:

$$(1, 1200, 3),\\ (2, 1200, 3),\\ (3, 1000, 1),\\ (4, 1000, 1)$$

R3 and R4 stay stale at version 1, which is fine: any later read reaching weight 5 must touch R1 or R2 and will therefore pick up version 3. Other valid write sets would do just as well — for example R1 and R4 (weight 6), giving $(1, 1200, 3), (2, 1100, 2), (3, 1000, 1), (4, 1200, 3)$.`,
        },
        {
          id: "hw6-d",
          prompt:
            "A fifth node R5 holding copy A5 with weight 2 is added. What is the minimum write quorum $Q'_w(A)$ now?",
          check: { mode: "text", accept: ["6", "qw=6", "q'w=6", "qw'(a)=6"], placeholder: "e.g. 7" },
          hint: "Recompute the total weight first.",
          solution: `The total weight becomes $W'(A) = 3 + 2 + 1 + 3 + 2 = 11$. From $2 Q'_w > W'$ we need $Q'_w > 5.5$, so

$$Q'_w(A) = \\left\\lfloor \\frac{11}{2} \\right\\rfloor + 1 = 6$$`,
        },
        {
          id: "hw6-e",
          prompt: "What is the minimum read quorum $Q'_r(A)$ for that write quorum?",
          check: { mode: "text", accept: ["6", "qr=6", "q'r=6", "qr'(a)=6"], placeholder: "e.g. 7" },
          solution: `$$Q'_r(A) = W'(A) - Q'_w(A) + 1 = 11 - 6 + 1 = 6$$

With an odd total weight the two quorums come out equal, which is the balanced point of the dial: reads and writes cost the same.`,
        },
      ],
    },
    {
      id: "hw7",
      title: "Bloom filter join between two servers",
      intro: `Tables **students** and **points** share the key StudNr, and points is stored on a separate server. The query to execute:

    SELECT Name, Bonus FROM Student s, Points p WHERE s.StudNr = p.StudNr;

The administrator uses a Bloom filter to preselect tuples, with the hash function $h(x) = x \\bmod 5$ applied to StudNr.

**Students**

| StudNr | Name | Hash |
| --- | --- | --- |
| 27 | Magda | ? |
| 4 | Josef | ? |
| 19 | Erik | ? |
| 95 | Philipp | ? |

**Points**

| StudNr | Bonus | Hash |
| --- | --- | --- |
| 27 | ja | ? |
| 16 | nein | ? |
| 25 | nein | ? |
| 95 | ja | ? |`,
      tasks: [
        {
          id: "hw7-a",
          prompt: "Calculate the hash values for **students**, in table order (27, 4, 19, 95). Separate them with commas.",
          check: { mode: "text", accept: ["2,4,4,0", "2440"], placeholder: "e.g. 1,2,3,4" },
          solution: `$h(27) = 27 \\bmod 5 = 2$, $h(4) = 4$, $h(19) = 4$, $h(95) = 0$.

| StudNr | Name | Hash |
| --- | --- | --- |
| 27 | Magda | 2 |
| 4 | Josef | 4 |
| 19 | Erik | 4 |
| 95 | Philipp | 0 |

Note that 4 and 19 collide on bucket 4 — that is normal and costs nothing here.`,
        },
        {
          id: "hw7-b",
          prompt: "Calculate the hash values for **points**, in table order (27, 16, 25, 95).",
          check: { mode: "text", accept: ["2,1,0,0", "2100"], placeholder: "e.g. 1,2,3,4" },
          solution: `$h(27) = 2$, $h(16) = 1$, $h(25) = 0$, $h(95) = 0$.

| StudNr | Bonus | Hash |
| --- | --- | --- |
| 27 | ja | 2 |
| 16 | nein | 1 |
| 25 | nein | 0 |
| 95 | ja | 0 |`,
        },
        {
          id: "hw7-c",
          prompt: "Specify the bit vector transferred from students. Write it as a string of bits, position 0 first.",
          check: { mode: "text", accept: ["10101", "1,0,1,0,1"], placeholder: "e.g. 01010" },
          hint: "The hash has five possible outputs, so the vector is five bits long. Set a bit whenever the hash produced that value at least once.",
          solution: `**Bit vector: 10101**

$h(x)$ has five different outputs, so the vector is at minimum 5 bits long. A bit is set when the hash function produced that value at least once. The students hash to $\\{2, 4, 4, 0\\}$, so bits 0, 2 and 4 are set and bits 1 and 3 stay clear.`,
        },
        {
          id: "hw7-d",
          prompt: "Based on that bit vector, which tuples are transferred from points?",
          check: {
            mode: "select",
            options: ["27", "16", "25", "95"],
            answer: ["27", "25", "95"],
          },
          solution: `**27, 25 and 95.**

- 27 hashes to 2 — bit set, transferred (and it is a genuine match).
- 16 hashes to 1 — bit clear, filtered out.
- 25 hashes to 0 — bit set, transferred, but there is no student 25: a **false positive**.
- 95 hashes to 0 — bit set, transferred (a genuine match).`,
        },
        {
          id: "hw7-e",
          prompt: "Calculate the false positive rate.",
          check: {
            mode: "text",
            accept: ["33%", "33", "1/3", "0.33", "33.3%", "33,3%", "0,33"],
            placeholder: "e.g. 50%",
          },
          hint: "Of the tuples that passed the filter, how many turn out to have no join partner?",
          solution: `Three tuples were transferred and one of them (25) has no join partner, so

$$\\frac{1}{3} \\approx 33\\%$$

The false positive costs bandwidth only — the real join at the other side discards it, so the result stays exact.`,
        },
        {
          id: "hw7-f",
          prompt: "Each tuple is 8 bytes. How many bytes are transferred **without** the Bloom filter?",
          check: { mode: "text", accept: ["32", "32bytes", "4*8=32", "4·8=32"], placeholder: "e.g. 24" },
          solution: `All four tuples of points have to be shipped:

$$4 \\cdot 8 = 32 \\text{ bytes}$$`,
        },
        {
          id: "hw7-g",
          prompt: "And **with** the Bloom filter, which itself costs 1 byte?",
          check: { mode: "text", accept: ["25", "25bytes", "3*8+1=25", "3·8+1=25"], placeholder: "e.g. 24" },
          solution: `Only the three tuples that pass the filter are shipped, plus the filter itself:

$$3 \\cdot 8 + 1 = 25 \\text{ bytes}$$

A saving of 7 bytes on this toy example — but the ratio is what matters: the filter is a fixed cost while the tuples scale with the size of the relation.`,
        },
      ],
    },
  ],
};
