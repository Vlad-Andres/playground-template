# Learning Playground Template

A generic Next.js template for generated, interactive learning sites. Course content is
validated JSON; the rendering engine stays trusted and fixed. A generation agent can decide
which lectures, blocks, widgets, quizzes, exercises, figures, and optional exam pages fit the
source materials.

## Quick start

```bash
npm install
npm run dev       # http://localhost:3000
npm run validate  # validate content/
npm run build     # static export into ./out
npm run lint
npm test
```

The starter course lives in [`content/`](content/). Put source PDFs and other working material
in [`materials/`](materials/), and generated JSON in `content/`. The build rejects invalid JSON,
unknown keys, unsafe widget types, and broken lecture references.

## Generate a course from your material

Put PDFs, `.txt` or `.md` files in `materials/` (ignored by git) and a key in `.env.local`
(`GEMINI_API_KEY`, or `OPENAI_COMPATIBLE_API_KEY` + `OPENAI_COMPATIBLE_BASE_URL` with `--provider openai`):

```bash
npm run generate -- --materials materials --out content --exam
```

Options: `--depth cram|standard|deep`, `--language en`, `--level school|university|professional`,
`--no-widgets`, `--no-quizzes`, `--title`, `--accent "#0f766e"`, `--model <id>`, `--bundle <file>`,
`--report <file>`, `--trace <file>` (local log of prompts and replies), `--price-in`/`--price-out`
(USD per million tokens, for the cost line), `--fake` (canned model, no key, no cost). The text is
read locally; only text is sent to the model. Every step runs under a token budget.

A course bundle (`{"format": "playground-bundle@1", "files": {...}}`, e.g. from the portal) is
imported with:

```bash
npm run import -- course-bundle.json --out content
```

## Content

- `content/course.json` defines the course identity and optional overview/footer text.
- `content/lectures/*.json` defines lectures as metadata, concepts, quizzes, and typed sections.
- `content/exam.json` and `content/expected.json` are optional.
- `content/figures/` is copied to `public/figures/`.

Use the JSON Schema files in [`schema/`](schema/) while generating content. Run `npm run schema`
after changing the content schema implementation.

## DIS example

The original Data Intensive Systems site is preserved as a course-specific golden example in
[`examples/dis/`](examples/dis/). It is not the template’s default and does not define what every
generated course must contain.

```bash
npm run dev:dis
npm run build:dis
```

## Stack and deployment

The template uses Next.js App Router, React, TypeScript, Tailwind CSS, typed JSON content,
React Markdown, KaTeX, and static export. The generated `out/` directory can be published with
the included GitHub Pages workflow. The assistant runs in the browser with the reader’s own
configured model key; progress and preferences remain in browser storage.
