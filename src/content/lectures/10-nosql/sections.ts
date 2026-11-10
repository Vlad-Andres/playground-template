import type { Block, SectionBlocks } from "@/content/types";
import { lecture10Meta, lecture10Outline } from "./meta";
import { ReplicaQuorumLab } from "@/widgets/dis/ReplicaQuorumLab";

const objectives: Block[] = [
  {
    kind: "prose",
    md: "This lecture asks what lies beyond relational databases, and why storage had to scale up. It follows **NoSQL Distilled** by Sadalage and Fowler — for the exam **Chapters 1, 2, 3 and 5**: why NoSQL, aggregate data models, more details on data models, and consistency. Distribution models (Chapter 4) and the later chapters are not exam material.",
  },
  { kind: "list", variant: "objectives", items: lecture10Meta.objectives },
];

const relationalValue: Block[] = [
  {
    kind: "prose",
    md: "**Why would we want a database at all?** It solves four problems:\n\n1. **Sharing** — concurrent access by multiple readers and writers.\n2. **Data model enforcement** — all applications see clean, organized data.\n3. **Scale** — work with data sets too large to fit in memory.\n4. **Flexibility** — use the data in new, unanticipated ways.\n\nA **data model** has three components: **structures**, **constraints** and **operations**. A raw genome annotation file has none of them — a stream of lines whose meaning lives only in the program that reads it.",
  },
  {
    kind: "prose",
    md: "**The relational model** (Codd, 1970): everything is a table, every row of a table has the same columns, and relationships are implicit — a student id in one table matches a student id in another, with no pointers. In the book's terms a tuple is a set of name–value pairs, a relation a set of tuples, and SQL operations consume and return relations.",
  },
  {
    kind: "table",
    headers: ["Value of relational databases (NoSQL Distilled 1.1)", "What it means"],
    rows: [
      ["Getting at persistent data", "Keep large amounts of data on a backing store, with more flexible access than a file"],
      ["Concurrency", "Many users and applications at once; transactions handle errors and conflicting updates"],
      ["Integration", "Several applications share one database and see each other's data"],
      ["A (mostly) standard model", "The same relational model, SQL and transactions across vendors"],
    ],
  },
  { kind: "concepts", ids: ["data-model"] },
  {
    kind: "recall",
    cards: [
      { prompt: "What are the three components of a data model?", answer: "Structures, constraints and operations." },
      { prompt: "Name the four benefits of relational databases in NoSQL Distilled.", answer: "Persistent data, concurrency control, integration, and a (mostly) standard model." },
      { prompt: "Data model versus storage model?", answer: "The data model is how we see and manipulate the data; the storage model is how the database stores it internally." },
    ],
  },
];

const impedanceMismatch: Block[] = [
  {
    kind: "prose",
    md: "Application developers' biggest frustration with relational databases is the **impedance mismatch**: the difference between the relational model and the **in-memory data structures** of the program. Relational tuples must hold **simple values** — no nested records, no lists. An order on screen is one structure: an id, a customer, a list of line items, and payment details. In the database it is split into rows of **orders**, **customers**, **order lines** and **credit cards**, and has to be translated back and forth on every save and load.",
  },
  {
    kind: "figure",
    src: "nosql/order-impedance.jpg",
    alt: "An order with id 1001, customer Ann, three line items and payment details, with arrows to the rows it becomes in the orders, customers, order lines and credit cards tables.",
    width: 1136,
    height: 850,
    caption: "Impedance mismatch: one order in memory becomes rows in four tables.",
  },
  {
    kind: "info",
    variant: "note",
    title: "Why object databases did not win",
    md: "In the 1990s many expected object-oriented databases — which store in-memory structures directly — to replace relational ones. They faded: relational databases won through their role as an **integration mechanism** with a mostly standard language (SQL). Object-relational mappers such as Hibernate and iBATIS remove a lot of the grunt work, but the mapping problem remains, and ignoring the database leads to poor query performance.",
  },
  { kind: "concepts", ids: ["impedance-mismatch"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Why does an order cause an impedance mismatch?", answer: "It is one nested structure in memory (line items, payment) but must be split over several flat tables." },
      { prompt: "What reduces, but does not remove, the impedance mismatch?", answer: "Object-relational mapping frameworks such as Hibernate and iBATIS." },
    ],
  },
];

const integration: Block[] = [
  {
    kind: "prose",
    md: "**The need for integration.** An organization has many sources of data. Two classic architectures bring them together:\n\n- A **data warehouse**: data cleaning and ETL tools (extract–transform–load) copy the sources into one relational warehouse, used for OLAP, decision support, data cubes and data mining.\n- **Virtual integration**: data stays in the sources (relational databases, Excel files, web sites, web services), each with a local schema; users query a **global schema**, and **schema mappings** translate the queries to the sources.",
  },
  {
    kind: "figure",
    src: "nosql/data-warehouse.jpg",
    alt: "Data sources feed a relational warehouse through data cleaning and ETL tools; users and applications use it for OLAP, decision support, data cubes and data mining.",
    width: 1030,
    height: 560,
    caption: "Data warehouse architecture.",
  },
  {
    kind: "figure",
    src: "nosql/virtual-integration.jpg",
    alt: "Users and applications query a global schema; schema mappings connect it to the local schemas of the data sources (relational databases, Excel files, web sites, web services).",
    width: 1040,
    height: 680,
    caption: "Virtual integration architecture: the data stays in the sources.",
  },
  {
    kind: "prose",
    md: "Within applications, the book contrasts two roles for a database:\n\n- An **integration database** is shared by several applications, usually built by separate teams. Everybody sees a consistent set of data, but the schema becomes far more complex than any one application needs, every change needs coordination, an index that helps one application can hurt another's inserts, and the database must enforce integrity itself because it cannot trust the applications.\n- An **application database** is accessed only by a single application codebase owned by one team. The team evolves the schema and keeps integrity in its own code. Other applications integrate through **services** — web services exchanging richer structures (XML or JSON documents with nested records and lists) over HTTP.\n\nOnce the database is hidden behind services, the outside world no longer cares how the data is stored — so the team is free to use a **non-relational** store. The speculative retailer's web application below is an example: user sessions, financial data, shopping cart, recommendations, product catalog, reporting, analytics and activity logs could each use a different store.",
  },
  {
    kind: "figure",
    src: "nosql/polyglot-retailer.jpg",
    alt: "A speculative retailer's web application with separate stores for user sessions, financial data, shopping cart, recommendations, product catalog, reporting, analytics and user activity logs.",
    width: 1136,
    height: 850,
    caption: "Polyglot persistence: each part of the application can use the store that suits it.",
  },
  { kind: "concepts", ids: ["integration-database", "polyglot-persistence"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Two drawbacks of an integration database?", answer: "A schema more complex than any application needs, and every change must be coordinated with all applications (also: conflicting index needs, integrity must live in the database)." },
      { prompt: "How do application databases integrate with each other?", answer: "Through services, e.g. JSON or XML over HTTP, instead of a shared schema." },
      { prompt: "Data warehouse versus virtual integration?", answer: "A warehouse copies the sources via ETL into one database; virtual integration leaves data in the sources and maps queries from a global schema." },
    ],
  },
];

const clusters: Block[] = [
  {
    kind: "prose",
    md: "**The need for scaling up.** Data used to be produced by employees; then came internet users, and now machine-generated data — far more again. Websites track activity in detail and serve huge numbers of visitors: **lots of traffic**. There are two ways to cope:\n\n- **Scale up**: a bigger machine with more processors, disk and memory. It gets ever more expensive and has real limits.\n- **Scale out**: a **cluster** of many small commodity machines. Cheaper at this scale, and more resilient: individual machines fail, but the cluster keeps going.\n\nSQL is happy on one big server and unhappy on the cluster. **Relational databases are not designed for clusters**: clustered relational databases (Oracle RAC, SQL Server) share a disk subsystem, which remains a single point of failure; running separate servers for different data (**sharding**) leaves the application to track which server holds what, and loses querying, referential integrity, transactions and consistency across shards. Licences priced per server made it worse.",
  },
  {
    kind: "timeline",
    items: [
      { label: "late 1990s", title: "Strozzi NoSQL", md: "An open-source *relational* database that did not use SQL — unrelated to today's meaning." },
      { label: "2000s", title: "Bigtable and Dynamo", md: "Google and Amazon, running huge clusters, publish papers on **Bigtable** and **Dynamo**." },
      { label: "11 June 2009", title: "The NoSQL meetup", md: "Johan Oskarsson organizes a San Francisco meetup on open-source, distributed, non-relational databases; “NoSQL” is chosen as a Twitter hashtag. Talks: Voldemort, Cassandra, Dynomite, HBase, Hypertable, CouchDB, MongoDB." },
    ],
  },
  {
    kind: "prose",
    md: "There is **no definition of NoSQL** — only common characteristics: **non-relational**, **cluster-friendly**, **open source**, built for the **21st-century web**, and **schema-less**. (“Not Only SQL” does not really work: Oracle would qualify.) The book's reading: an ill-defined set of mostly open-source databases, mostly developed in the early 21st century, mostly not using SQL.\n\nNoSQL is best seen as a movement whose main result is **polyglot persistence**: relational databases remain one option — and still the most common — among several. There are two reasons to consider NoSQL: **large-scale data** that demands a cluster, and **easier development** through a more convenient data interaction style.",
  },
  { kind: "concepts", ids: ["scale-out", "nosql"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Why are relational databases awkward on clusters?", answer: "Shared-disk clusters keep a single point of failure; sharding by the application loses cross-shard queries, integrity, transactions and consistency." },
      { prompt: "Which two papers inspired NoSQL?", answer: "Google's Bigtable and Amazon's Dynamo." },
      { prompt: "List the five common characteristics of NoSQL databases.", answer: "Non-relational, cluster-friendly, open source, 21st-century web, schemaless." },
      { prompt: "What are the two reasons to consider NoSQL?", answer: "Large-scale data that needs a cluster, and easier application development." },
    ],
  },
];

const aggregates: Block[] = [
  {
    kind: "prose",
    md: "The relational model splits data into **tuples**, which cannot nest. **Aggregate orientation** recognizes that we often want to operate on a more complex unit — a record with nested lists and records. The term comes from Domain-Driven Design: an **aggregate** is *a collection of related objects that we wish to treat as a unit* for data manipulation and consistency. We update aggregates atomically and communicate with the store in terms of aggregates.\n\nThe order from the impedance-mismatch figure is exactly that: stored as one **Order 1001** aggregate instead of rows in four tables. In UML the order **contains** its line items (the black diamond, composition).",
  },
  {
    kind: "figure",
    src: "nosql/order-aggregate.jpg",
    alt: "The order with id 1001, customer Ann, line items and payment details stored as a single Order 1001 aggregate in the database.",
    width: 1136,
    height: 850,
    caption: "The whole order stored as one aggregate.",
  },
  {
    kind: "code",
    lang: "json",
    code: `// in customers
{ "id": 1,
  "name": "Martin",
  "billingAddress": [{ "city": "Chicago" }] }

// in orders
{ "id": 99,
  "customerId": 1,
  "orderItems": [
    { "productId": 27, "price": 32.45, "productName": "NoSQL Distilled" } ],
  "shippingAddress": [{ "city": "Chicago" }],
  "orderPayment": [
    { "ccinfo": "1000-1000-1000-1000",
      "txnId": "abelif879rft",
      "billingAddress": { "city": "Chicago" } } ] }`,
    caption: "Two aggregates: customer and order (NoSQL Distilled, 2.1.1).",
  },
  {
    kind: "prose",
    md: "Notice three choices:\n\n- The address appears **three times**, copied as a value rather than referenced by id — we do not want an order's shipping address to change when the customer moves.\n- The product name is **denormalized** into the order item, so reading an order touches fewer aggregates.\n- The link from order to customer (**customerId**) is a relationship **between** aggregates.\n\nThe boundary could also be drawn differently: put all orders **inside** the customer aggregate. Which is right depends entirely on **how the data is accessed** — the customer with all orders at once, or one order at a time.",
  },
  {
    kind: "prose",
    md: "**Consequences of aggregate orientation.**\n\n- **Aggregate-ignorant** models — relational and graph — do not know about aggregates. That is not bad: if the same data is used in many contexts, there may be no good boundary. Orders make good aggregates for customers and order processing, but to analyze product sales over months you would have to dig into every order (a product / revenue / prior revenue report like the one below).\n- **Clusters**: an aggregate tells the database which data is used together and should live **on the same node** — the clinching reason for aggregates.\n- **Transactions**: aggregate-oriented databases support **atomic updates of a single aggregate**, not ACID transactions across aggregates; atomicity across aggregates must be handled in the application. Graph and other aggregate-ignorant databases usually support ACID.",
  },
  {
    kind: "figure",
    src: "nosql/product-revenue.jpg",
    alt: "Table of products with revenue and prior revenue.",
    width: 1136,
    height: 850,
    caption: "A product sales report: this cuts across every order aggregate.",
  },
  { kind: "concepts", ids: ["aggregate"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Define an aggregate.", answer: "A collection of related objects treated as a unit for data manipulation and consistency — the unit of atomic updates and of distribution." },
      { prompt: "Which models are aggregate-ignorant?", answer: "Relational and graph." },
      { prompt: "What transactional guarantee do aggregate-oriented databases give?", answer: "Atomic updates within a single aggregate; multi-aggregate atomicity is up to the application." },
    ],
  },
  {
    kind: "practice",
    id: "l10-aggregates",
    tasks: [
      {
        id: "boundary",
        prompt: "An application always shows a customer's profile together with the full list of their orders, and never processes an order on its own. Where would you draw the aggregate boundary, and what is the risk?",
        check: { mode: "open" },
        solution: "Put the orders **inside the customer aggregate**: one lookup returns everything, and updates to a customer and their orders are atomic. The risk: if later the business wants to process or analyze orders independently (e.g. sales per product), every customer aggregate must be read — the boundary then works against you.",
      },
    ],
  },
];

const aggregateModels: Block[] = [
  {
    kind: "prose",
    md: "Four families of NoSQL databases: **key-value** (Redis, Riak, Project Voldemort), **document** (MongoDB, CouchDB, RavenDB), **column-family** (Cassandra, HBase) and **graph** (Neo4j). The first three are **aggregate-oriented**.\n\n**Key-value and document stores** both hold many aggregates, each under a key.\n\n- In a **key-value** store the value — the aggregate — is **opaque**: a blob the database does not look into. You can store anything (up to a size limit), but you can only **look it up by key** and get the whole aggregate.\n- In a **document** store the database **sees the structure** of the aggregate. It limits what you can store, but you can **query on fields**, **retrieve part** of a document, and **index** its contents. There is no schema: the next order document may carry a field such as \"discount-code\" that the others lack.\n\nThe line is blurry: key-value stores add **metadata** (Riak can attach customer_id:7231 to a value for indexing and links; Redis splits values into lists and sets), and document stores use an **id** field for key-style lookups. Still, value == aggregate and document == aggregate.",
  },
  {
    kind: "figure",
    src: "nosql/document-no-schema.jpg",
    alt: "Two order documents: the first has id, customer_id and line items; the second also has a discount-code field the first lacks.",
    width: 1136,
    height: 850,
    caption: "Documents have no schema: the second order carries a field the first does not.",
  },
  {
    kind: "prose",
    md: "**Column-family stores** follow Google's Bigtable (HBase, Cassandra). Think of a **two-level map**: a **row key** (1234) selects the aggregate, and inside it **column families** group **columns** (column key → column value) that are usually accessed together.",
  },
  {
    kind: "figure",
    src: "nosql/column-family.jpg",
    alt: "Row key 1234 points to the profile column family (name, billingAddress, payment) and the orders column family (OR1001 to OR1004); each column has a column key and a column value.",
    width: 1136,
    height: 850,
    caption: "Customer 1234 in a column-family store.",
  },
  {
    kind: "table",
    headers: ["Row key", "Column family", "Column key", "Column value"],
    rows: [
      ["1234", "profile", "name", "\"martin\""],
      ["1234", "profile", "billingAddress", "data…"],
      ["1234", "profile", "payment", "data…"],
      ["1234", "orders", "OR1001", "data…"],
      ["1234", "orders", "OR1002", "data…"],
      ["1234", "orders", "OR1003", "data…"],
    ],
    caption: "Customer 1234 in a column-family store: get('1234', 'name') returns \"martin\".",
  },
  {
    kind: "prose",
    md: "Two ways to read it: **row-oriented** — each row is an aggregate, with column families as useful chunks of it; **column-oriented** — each column family is a record type, and a row is the join of its records across families. **Skinny** rows have few columns shared by all rows (a record); **wide** rows have many different columns (a list, e.g. one column per order). Columns can be **sorted**, so keys like 20111027-1001 give date ranges. New columns are added freely; new column families rarely. Cassandra calls the inner level *super columns*.",
  },
  {
    kind: "table",
    headers: ["Model", "Aggregate is", "Access"],
    rows: [
      ["Key-value", "Opaque value", "Lookup of the whole aggregate by key"],
      ["Document", "Transparent document, no schema", "Queries on fields, partial retrieval, indexes"],
      ["Column-family", "Row divided into column families", "Row key plus column; families as units of access"],
      ["Graph", "No aggregates — nodes and edges", "Traversal along relationships"],
    ],
    caption: "Summary of the data models (NoSQL Distilled 2.4).",
  },
  { kind: "concepts", ids: ["key-value-document", "column-family"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Key-value versus document store, in one line?", answer: "Key-value: the aggregate is opaque, accessed only by key. Document: the structure is visible, so you can query, partially retrieve and index." },
      { prompt: "Describe a column-family store as a map.", answer: "A two-level map: row key → (column family → column key → value)." },
      { prompt: "Skinny versus wide rows?", answer: "Skinny: few shared columns, like a record. Wide: many different columns, like a list." },
    ],
  },
  {
    kind: "practice",
    id: "l10-models",
    tasks: [
      {
        id: "choose-model",
        prompt: "You must find all orders whose shipping city is Chicago without reading every order, and you only ever store orders as JSON aggregates. Key-value or document store?",
        check: { mode: "select", options: ["Key-value store", "Document store"], answer: ["Document store"] },
        solution: "A **document store**: it can query and index on a field inside the aggregate. A key-value store only finds aggregates by key, so you would read every order.",
      },
    ],
  },
];

const moreModels: Block[] = [
  {
    kind: "prose",
    md: "**Relationships.** Data that is related is not always accessed together — orders may need to be processed on their own, yet look up their customer. The simplest link is to **embed the customer id** in the order and make a second call. Many stores let the database know about such links (indexes in document stores, link metadata in Riak). But atomicity covers **one aggregate**: updating several at once means handling a failure halfway yourself. Aggregate-oriented databases grow awkward as you work across aggregates — yet relational databases are no stars at complex relationships either: SQL with many joins becomes hairy and slow.\n\n**Graph databases** take the opposite approach to aggregates: **small records with complex interconnections** — nodes connected by edges, with properties. Queries such as *find the books in the Databases category written by someone whom a friend of mine likes* follow the edges. Traversal is cheap because the work of navigating relationships is moved from **query time to insert time**. They suit social networks, product preferences and eligibility rules, usually run on a single server, and support **ACID transactions** across nodes and edges. Examples: Neo4j, Sparksee, OrientDB, GraphDB, AllegroGraph, Blazegraph, RDF stores. Lecture 11 covers graph databases in depth.",
  },
  {
    kind: "prose",
    md: "**Schemaless databases.** All NoSQL families let you store data without defining a schema first: any value under a key, any document, any column, any new edge or property. That makes it easy to **change** what you store as you learn, and to handle **nonuniform data** without sparse tables or meaningless columns like *customField6*.\n\nBut there is nearly always an **implicit schema**. Code such as anOrder[\"price\"] * anOrder[\"quantity\"] assumes those fields exist and hold numbers; a program cannot guess that *qty* means *quantity*. So:\n\n- to understand the data you must read the application code;\n- the database cannot use the schema to store data efficiently or **validate** it;\n- several applications sharing the store can disagree — mitigated by encapsulating the store in one application (services again) or giving each application its own section of the aggregate;\n- the flexibility applies **within** an aggregate — changing aggregate boundaries is as hard as any relational migration.",
  },
  {
    kind: "prose",
    md: "**Materialized views.** Aggregates work against queries that cut across them — *how much did this product sell in the last two weeks?* Relational databases answer with **views**, computed on access, and **materialized views**, computed in advance and cached on disk, for data read often that may be slightly stale. NoSQL stores reuse the term for precomputed, cached queries, often built with **map-reduce**. Two strategies:\n\n- **Eager**: update the view together with the base data (adding an order also updates each product's purchase history) — good when reads of the view outnumber writes and freshness matters.\n- **Batch**: recompute at regular intervals — cheaper writes, staler views.\n\nViews can live outside the store, be computed by the store, or sit **inside an aggregate** (an order summary in the order document) or in **their own column family**, updated in the same atomic operation.",
  },
  {
    kind: "prose",
    md: "**Modeling for data access.** Design aggregates for the reads you need:\n\n- **Key-value, everything embedded**: one key returns the customer with all orders, but to list orders or products the client reads and parses the whole value. Splitting into Customer and Order objects with references (the customer keeps a list of order ids) lets orders be found independently, at the cost of updating the customer on every new order.\n- **Analytics aggregates**: on each order, update an item aggregate such as {\"itemid\": 27, \"orders\": [99, 545, 897, 678]} — real-time BI instead of end-of-day batch runs.\n- **Document store**: since you can query inside documents, the customer no longer needs a list of order ids; find orders by customerId.\n- **Column-family**: model for the **queries**, not for writing — denormalize during the write; order columns so frequent ones are fetched first.\n- **Graph**: customers, orders and products are nodes connected by typed, directed relationships such as PURCHASED, PAID_WITH and BELONGS_TO. *Who purchased Refactoring Databases?* — start at the product node and follow incoming PURCHASED edges.",
  },
  { kind: "concepts", ids: ["graph-database", "implicit-schema", "materialized-view"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Why are traversals cheap in a graph database?", answer: "The work of navigating relationships is moved from query time to insert time." },
      { prompt: "What is an implicit schema?", answer: "The assumptions about field names, meanings and types that the code accessing a schemaless store relies on." },
      { prompt: "Eager versus batch materialized views?", answer: "Eager: update the view with every base-data update (fresh, slower writes). Batch: recompute periodically (cheaper, staler)." },
      { prompt: "What is the general rule for column-family modeling?", answer: "Model for the queries; denormalize during the write." },
    ],
  },
];

const consistency: Block[] = [
  {
    kind: "prose",
    md: "**ACID** (atomic, consistent, isolated, durable — defined in Lecture 1) is the relational answer. The book's point: its real core is **atomicity across many rows and tables**, and consistency in a cluster is much more involved than *ACID or not*. This section looks at the kinds of inconsistency a NoSQL store has to deal with.",
  },
  {
    kind: "prose",
    md: "**Update consistency.** Martin and Pramod update the same phone number at the same time — a **write-write conflict**. The server serializes the writes; without concurrency control, Martin's is applied and immediately overwritten: a **lost update**, because Pramod's write was based on the state before Martin's.\n\n- **Pessimistic** approaches prevent conflicts, typically with **write locks**: only Martin gets the lock, and Pramod sees his result first. Risk: poor responsiveness and deadlocks — a trade-off between **safety** and **liveness**.\n- **Optimistic** approaches detect conflicts: a **conditional update** tests that the value is unchanged since it was read, so Pramod's update fails and he must look again. Or **save both** updates, mark the conflict and **merge** — as in version control, often with domain-specific logic.\n\nWith several servers, they must also agree on the order of updates — **sequential consistency**. Replication makes write-write conflicts more likely unless one node handles all writes for a piece of data.",
  },
  {
    kind: "steps",
    title: "Nick and Mary: the business transaction problem",
    steps: [
      { title: "Both read", md: "Nick and Mary each GET the same record through their browsers and servers; both see **version v101**." },
      { title: "Both think", md: "They edit for a while. Holding a database transaction open during this user interaction would block others — so no lock is held." },
      { title: "Nick posts", md: "Nick POSTs his change with version stamp v101. It matches the stored version, so the update is applied and the record becomes **v102**." },
      { title: "Mary posts", md: "Mary POSTs with v101, but the record is now v102: the **offline lock** (a version stamp check) rejects her update instead of silently overwriting Nick's." },
    ],
  },
  {
    kind: "figure",
    src: "nosql/offline-lock.jpg",
    alt: "Sequence diagram: Nick and Mary both get version v101; Nick posts with v101 and the record becomes v102; Mary's post with v101 is checked against the version stamp.",
    width: 1136,
    height: 850,
    caption: "Offline lock with a version stamp.",
  },
  {
    kind: "prose",
    md: "**Read consistency.** Martin adds a line item and then updates the shipping charge; Pramod reads in between and sees new items with the old charge — a **read-write conflict** (an inconsistent read), breaking **logical consistency**. Relational databases prevent it with transactions. Aggregate-oriented stores give it **within one aggregate** — so put the line items and shipping charge in the order aggregate. Across aggregates, there is an **inconsistency window** (Amazon SimpleDB: usually under a second).\n\nReplication adds **replication consistency**: the same item read from different replicas should have the same value. Pramod in Mumbai books the last hotel room; the update reaches Boston before London, so Cindy sees it booked while Martin sees it free. The system is **eventually consistent**: if updates stop, all replicas converge. Out-of-date data is **stale**. Consistency can often be chosen **per request**.\n\nWorst is inconsistency with yourself: you post a comment, refresh, hit another node and your comment is gone. **Read-your-writes** consistency (one of the session guarantees of Lecture 3) — usually provided as **session consistency** — fixes this, with **sticky sessions** (session affinity to one node) or **version stamps** that every node checks before answering.",
  },
  { kind: "concepts", ids: ["conflicts", "eventual-consistency"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Write-write versus read-write conflict?", answer: "Write-write: two concurrent updates of the same item (lost update). Read-write: a read in the middle of another client's multi-step write." },
      { prompt: "Pessimistic versus optimistic concurrency?", answer: "Pessimistic prevents conflicts with locks; optimistic lets them happen and detects them (conditional update, or save both and merge)." },
      { prompt: "Logical versus replication consistency?", answer: "Logical: different items make sense together. Replication: the same item has the same value on all replicas." },
      { prompt: "Two ways to provide session consistency?", answer: "Sticky sessions (session affinity) and version stamps." },
    ],
  },
];

const cap: Block[] = [
  {
    kind: "prose",
    md: "**The CAP theorem** — consistency, availability, partition tolerance; under a partition, choose C or A — is defined in Lecture 3 (*CAP, PACELC and consistency*). This section adds the NoSQL Distilled view of it.\n\n**The effect of replication.** Nick and Mary write to one database: no problem. Replicate it, and the link between the replicas can break — a *split brain*. Then either the system **refuses** the writes until it can coordinate — *consistency guaranteed* — or it **accepts** both on their own sides — *availability guaranteed*, at the cost of divergence. A **single server** is CA because it cannot partition; a cluster must tolerate partitions, and the choice is **not binary**: you can trade a little consistency for some availability.",
  },
  {
    kind: "figure",
    src: "nosql/replication-consistency.jpg",
    alt: "Two replicas with a broken link between them; both Nick's and Mary's writes are refused.",
    width: 1300,
    height: 400,
    caption: "Partition, option 1: refuse writes — consistency guaranteed.",
  },
  {
    kind: "figure",
    src: "nosql/replication-availability.jpg",
    alt: "Two replicas with a broken link between them; Nick and Mary can both still write to their own replica.",
    width: 1300,
    height: 400,
    caption: "Partition, option 2: accept writes on both sides — availability guaranteed, the replicas may diverge.",
  },
  {
    kind: "table",
    headers: ["Side of the triangle", "Systems (after S. Tiwari)"],
    rows: [
      ["C + P", "Bigtable, HBase, Hypertable"],
      ["A + P", "Dynamo, Riak, Voldemort, Cassandra, CouchDB"],
      ["C + A", "RDBMS"],
    ],
  },
  {
    kind: "figure",
    src: "nosql/cap-triangle.png",
    alt: "CAP triangle: Bigtable, HBase and Hypertable on the C–P side; Dynamo, Riak, Voldemort, Cassandra and CouchDB on the A–P side; RDBMS on the C–A side.",
    width: 670,
    height: 507,
    caption: "Where systems sit in the CAP triangle.",
  },
  {
    kind: "prose",
    md: "**Hotel booking across London and Mumbai.** Insisting on consistency means London must reach Mumbai before confirming Martin's booking — if the link breaks, nobody can book. Making Mumbai the master for that hotel lets Pramod still book; London users can read (possibly stale) but not book. Accepting bookings on both sides keeps availability but risks double-booking the last room — which a hotel may tolerate, since it overbooks for no-shows anyway. The classic case is Dynamo's **shopping cart**: always writable; divergent carts are **merged** at checkout. Such decisions need **domain experts**. Reads are similar: a trading system cannot tolerate stale prices, a news site can serve pages minutes old.\n\nThe book prefers to see the trade-off as **consistency versus latency**: involving more nodes improves consistency but increases response time; *availability* is then the limit of latency we tolerate before treating data as unavailable — which is why availability is often read as *response time*.",
  },
  {
    kind: "prose",
    md: "**BASE.** A common shorthand: *RDBMS = ACID, NoSQL = BASE (well… almost)*.\n\n- **Basically Available** — rather than enforcing immediate consistency, data is spread and replicated across the nodes so it stays available.\n- **Soft state** — without immediate consistency, values may change over time; consistency is delegated to developers.\n- **Eventually consistent** — consistency is reached eventually; until then reads are possible but may not reflect reality.\n\nThe book finds the acronym even more contrived than ACID, and notes that Brewer saw ACID versus BASE as a **spectrum**. And in terms of data models: aggregate-oriented stores lean towards BASE, while **graph databases are ACID**.",
  },
  { kind: "concepts", ids: ["cap"] },
  {
    kind: "recall",
    cards: [
      { prompt: "Two options when the link between two replicas breaks?", answer: "Refuse writes until the replicas can coordinate (consistency), or accept writes on both sides and let them diverge (availability)." },
      { prompt: "Why is a single server CA?", answer: "It cannot partition; if it is up, it is available and consistent." },
      { prompt: "What does BASE stand for?", answer: "Basically Available, Soft state, Eventually consistent." },
      { prompt: "Which trade-off does NoSQL Distilled prefer to CAP's C vs A?", answer: "Consistency versus latency (response time)." },
    ],
  },
];

const durabilityQuorums: Block[] = [
  {
    kind: "prose",
    md: "**Relaxing durability.** A store can run in memory and flush to disk periodically: much faster, but a crash loses updates since the last flush. Worth it for **user-session state** (losing it annoys less than a slow site) or high-rate **telemetry**. Durability can often be chosen per call.\n\n**Replication durability** fails when a node acknowledges an update and then fails before replicating it — e.g. a master that dies before its slaves receive the write; when it returns, its writes conflict with newer ones. The fix — the master waits for some replicas to acknowledge before acknowledging the client — slows writes and makes the cluster unavailable when slaves fail.",
  },
  {
    kind: "prose",
    md: "**Quorums.** Consistency is not all-or-nothing: the more nodes involved, the safer. This is Lecture 3's quorum consensus with every replica weighing 1, written in NoSQL Distilled's notation. With data replicated on **N** nodes (the **replication factor**):",
  },
  {
    kind: "formula",
    tex: "W > \\frac{N}{2} \\quad\\text{(write quorum)} \\qquad\\qquad R + W > N \\quad\\text{(strongly consistent read)}",
    caption: "W nodes confirm a write, R nodes are contacted for a read, N is the replication factor — not the number of nodes in the cluster.",
  },
  {
    kind: "prose",
    md: "With **N = 3**, two conflicting writes cannot both get a majority of 2. If writes need **W = 2**, reads must contact **R = 2**; if writes are confirmed by **W = 1**, reads must contact all **R = 3** — strongly consistent reads even without strongly consistent writes. For fast reads you can use **N = 3, W = 3, R = 1**: slow writes that fail if any node is down. A replication factor of **3** is usually enough: one node can fail while both quorums still hold. With master-slave replication you avoid conflicts more simply: write to and read from the master.",
  },
  {
    kind: "interactive",
    title: "Quorums with three replicas",
    description: "The Lecture 3 quorum lab with N = 3 equal replicas: Qw is the book's W, Qr its R, and the total weight is N.",
    component: ReplicaQuorumLab,
  },
  { kind: "concepts", ids: ["quorum"] },
  {
    kind: "recall",
    cards: [
      { prompt: "When is relaxing durability acceptable?", answer: "When losing recent updates hurts less than slowness, e.g. session state or high-rate telemetry." },
      { prompt: "What is the write-quorum rule?", answer: "W > N/2 — conflicting writes cannot both reach a majority." },
      { prompt: "What is the read-quorum rule?", answer: "R + W > N — every read overlaps the latest confirmed write." },
      { prompt: "Why is N = 3 a common choice?", answer: "One node can fail while both read and write quorums (2 of 3) still hold." },
    ],
  },
  {
    kind: "practice",
    id: "l10-quorums",
    tasks: [
      {
        id: "min-read",
        prompt: "N = 5 and W = 3. What is the smallest R for strongly consistent reads?",
        check: { mode: "text", accept: ["3"], placeholder: "R" },
        solution: "R + 3 > 5, so **R = 3**.",
      },
      {
        id: "fault",
        prompt: "N = 3, W = 3, R = 1. One replica goes down. Can the system still write? Can it still read consistently?",
        check: { mode: "open" },
        solution: "**Writes fail**: W = 3 needs all three replicas. **Reads still work** from any one live replica and are consistent, because every confirmed write reached all three.",
      },
    ],
  },
];

const mistakes: Block[] = [
  { kind: "info", variant: "pitfall", title: "“NoSQL means no transactions”", md: "Aggregate-oriented stores update a single aggregate atomically, and graph databases support ACID. What they lack is atomicity **across** aggregates." },
  { kind: "info", variant: "pitfall", title: "“Schemaless means no schema”", md: "The schema moves into the application code as an implicit schema — and the database can no longer validate it." },
  { kind: "info", variant: "pitfall", title: "Drawing aggregate boundaries by the data alone", md: "Boundaries come from how the data is **accessed**. The same orders can be separate aggregates in one application and embedded in the customer in another." },
  { kind: "info", variant: "pitfall", title: "Reading CAP as “pick any two”", md: "A cluster cannot give up partition tolerance; the choice is C versus A during a partition, and it is a spectrum — or consistency versus latency." },
  { kind: "info", variant: "pitfall", title: "Confusing N with the cluster size", md: "In R + W > N, N is the replication factor. A 100-node cluster may replicate each item only 3 times." },
];

const quiz: Block[] = [{ kind: "prose", md: "Fourteen questions on the motivation for NoSQL, aggregates and data models, and consistency." }];

const summary: Block[] = [
  { kind: "list", variant: "takeaways", items: lecture10Meta.takeaways },
  {
    kind: "table",
    headers: ["Concept", "Remember"],
    rows: [
      ["Impedance mismatch", "Nested in-memory structures versus flat relational tuples"],
      ["Application database", "One application owns it; integrate via services; free to pick any store"],
      ["NoSQL traits", "Non-relational, cluster-friendly, open source, 21st-century web, schemaless"],
      ["Aggregate", "Unit of manipulation, consistency, atomic update and distribution"],
      ["Key-value / document", "Opaque value by key / visible structure, queries and indexes"],
      ["Column-family", "Row key → column families → columns; skinny and wide rows"],
      ["Graph", "Nodes and edges, cheap traversal, aggregate-ignorant, ACID"],
      ["Materialized view", "Precomputed data for cross-aggregate queries; eager or batch"],
      ["Conflicts", "Write-write (lost update) and read-write (inconsistent read)"],
      ["CAP", "Under a partition: consistency or availability"],
      ["Quorums", "W > N/2 and R + W > N"],
    ],
  },
];

export const lecture10Blocks: SectionBlocks<typeof lecture10Outline> = {
  objectives,
  "relational-value": relationalValue,
  "impedance-mismatch": impedanceMismatch,
  integration,
  clusters,
  aggregates,
  "aggregate-models": aggregateModels,
  "more-models": moreModels,
  consistency,
  cap,
  "durability-quorums": durabilityQuorums,
  mistakes,
  quiz,
  summary,
};
