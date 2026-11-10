# Learning Playground Agent Guide

Use this recipe when turning files in `materials/` into a course. The output is trusted JSON
content; the renderer and widget registry are existing implementation.

## Workflow

1. **Ingest.** Read every supplied source and record page/slide provenance. Follow
   [`docs/agent/01-ingest.md`](docs/agent/01-ingest.md). Completion: you can cite the source
   page for every planned lecture and figure.
2. **Choose the shape.** Follow [`docs/agent/02-detect-domain.md`](docs/agent/02-detect-domain.md).
   Choose only domain packs and features supported by the material. Completion: the feature
   decisions say what is included and what is intentionally omitted.
3. **Outline.** Follow [`docs/agent/03-outline.md`](docs/agent/03-outline.md). Create
   `content/course.json` and lecture outlines before writing long blocks. Completion: every source
   topic belongs to one lecture and every lecture has objectives.
4. **Write content.** Follow [`docs/agent/04-write-lecture.md`](docs/agent/04-write-lecture.md)
   and the block references in [`docs/agent/blocks/`](docs/agent/blocks/). Completion: all claims
   are source-grounded, every block has the right kind, and no course code was added.
5. **Validate and repair.** Follow [`docs/agent/05-validate.md`](docs/agent/05-validate.md).
   Completion: validation has zero errors and the production build succeeds.
6. **Review the result.** Check the generated pages, links, figures, quizzes, and optional routes.
   Completion: the site contains no invented feature, unsafe Markdown, or DIS-specific assumption
   unless the source is DIS.

## Hard interface

- Course data lives in `content/`; source working files live in `materials/`.
- Use only the JSON shapes in `schema/*.schema.json`.
- Use only widgets listed in `src/widgets/manifest.ts`; omit a widget when no registered widget
  matches the teaching need.
- `exam.json` and `expected.json` are optional. Omit them when the source has no exam evidence.
- Content may contain Markdown, but not executable code or raw HTML.
- Preserve uncertainty as an explicit note; never fill a missing fact from general knowledge.

## Completion

Run `npm run validate`, `npm test`, `npm run lint`, and `npm run build`. Report the command output,
the source coverage, and any warnings before calling the course complete.
