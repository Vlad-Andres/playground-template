# Learning Playground Template

A generic Next.js template for generated, interactive learning sites. Course content is
validated JSON; the rendering engine stays trusted and fixed. A generation agent can decide
which lectures, blocks, widgets, quizzes, exercises, figures, and optional exam pages fit the
source materials.

## What a generated course offers

- **Lectures** built from 15 validated block kinds: prose, formula (KaTeX), table, steps (worked
  examples), timeline, list, code, figure, info, concepts, recall cards, practice, exercises, catalogue
  widgets and `custom` simulations. Maths (`$…$`) renders in prose, tables and lists.
- **Catalogue widgets**: order items, match pairs, categorize, cloze, chart, function plot, parameter
  explorer, concept map, flow stepper, and the timed mock exam.
- **Model-written simulations** (`custom` blocks): when an idea is better shown than told — something
  that moves, changes over time or reacts to the learner — the generator writes its own HTML/CSS/JS
  simulation from the material's values (e.g. a pendulum's energy, Newton's cradle, a resonant LC
  circuit). It runs in a sandboxed frame with its own CSP, must pass a static safety scan, and should work
  at 360 px and in dark mode. Cap per lecture by depth: cram 0, standard 1, deep 2.
- **Studying**: course home with continue/progress, **study next** suggestions from your own answers, a
  **due today** review counter, an exam countdown, a "difficult parts" hub (flip cards, cloze drill,
  match game, mini quiz, concept map), and a timed **practice exam** whose results are remembered in the
  browser with links back to each lecture's quiz.
- **Ask AI** about the course or a selected passage; answers link to the sections they use.
- Course content in the course's own language (e.g. English or Romanian), light and dark mode,
  phone-first layout; progress stays in browser
  storage. Course pages announce `study-event` DOM events (quiz, review, exam completed) so a host such as
  the portal can count them; the template itself sends nothing over the network.

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
after changing the content schema implementation, and `npm run docs:reference` after changing block or
widget examples (it rewrites `docs/agent/blocks/`).

## Examples

- [`examples/dis/`](examples/dis/): the original Data Intensive Systems site, kept as a course-specific
  golden example (`npm run dev:dis`, `npm run build:dis`). It does not define what every generated course
  must contain.
- [`examples/showcase/`](examples/showcase/): a hand-made course that uses every block kind except `figure`
  (`npm run dev:showcase`, `npm run build:showcase`).
- [`examples/demo-energy/`](examples/demo-energy/): source notes (EN and RO) for the public demo course
  *Energy on the Move: from Newton's Cradle to the Tesla Coil*, adapted from Siyavula *Everything Science*
  (CC BY 3.0, credited in the files) plus our own sections. Generate it with
  `npm run generate -- --materials <folder with notes-en.md> --depth deep --level school --exam`.

## Stack and deployment

The template uses Next.js App Router, React, TypeScript, Tailwind CSS, typed JSON content,
React Markdown, KaTeX, and static export. The generated `out/` directory can be published with
the included GitHub Pages workflow. The assistant runs in the browser with the reader’s own
configured model key; progress and preferences remain in browser storage. The
[Learning Playground Portal](https://github.com/Vlad-Andres/playground-portal) vendors `core/` and the
shared UI from this repository (`npm run sync:core` there) and hosts generated courses itself.
