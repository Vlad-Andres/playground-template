# Outline

Create `content/course.json` with a stable lowercase `id`, title, short title, language,
description, and `indexable`. Add overview/footer text only when supported by the source.

Split material into lectures at natural source boundaries. Each lecture filename is
`NN-slug.json`; its `meta.number`, `meta.slug`, title, subtitle, summary, topics, difficulty,
estimated minutes, sources, objectives, and takeaways must agree. Use `number: 0` only for an
optional exam-shaped file.

Each section has a unique identifier, title, allowed section kind, and ordered blocks. Start with
objectives or orientation when useful; end with summary, practice, or quiz only when supported.
Keep sections focused enough that a reader can complete one sitting.

Done means every source heading is accounted for, with no duplicate lecture or section ids.
