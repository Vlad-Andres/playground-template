# DIS Study Playground

An interactive study companion for the **Data Intensive Systems** course: visual explanations,
playgrounds, worked examples and quizzes, one lecture at a time. Fully static, deployable to
GitHub Pages.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, `output: "export"`) + React 19 + TypeScript |
| Styling | Tailwind CSS v4, semantic design tokens in `src/app/globals.css` |
| Markdown & math | `react-markdown` with `remark-gfm`, `remark-math`, `rehype-katex` |
| Syntax highlighting | Shiki, rendered at build time (no client-side highlighter) |
| Charts | Chart.js via `react-chartjs-2` |
| Icons | `lucide-react` |

Lecture pages are server-rendered at build time; only the interactive pieces ship JavaScript.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export into ./out
npm run lint
```

## Architecture

```
src/
  app/                     routes: homepage, /lectures/[slug], 404
  components/
    ui/                    primitives (Card, Badge, ProgressBar/Ring, RangeField, Stat)
    content/               block renderers (Markdown, InfoBox, ConceptCard, QuizCard)
    layout/                header, search dialog, theme toggle, footer
    lecture/               lecture header, table of contents, section view, prev/next
    home/                  course overview, lecture cards, progress and continue cards
  content/
    types.ts               the content model every lecture conforms to
    registry.ts            metadata-only index (homepage, navigation, search)
    lectures.ts            full lecture index (lecture route only)
    lectures/<slug>/       one self-contained folder per lecture
  hooks/                   useTheme, useProgress
  lib/                     search, progress maths, persistence, formatting
```

### The content model

A lecture is data, not markup. `src/content/types.ts` defines a small set of **blocks** --
`prose`, `info`, `concepts`, `formula`, `code`, `table`, `steps`, `timeline`, `list` and
`interactive` -- and `BlockRenderer` maps each one to a component. Adding a new kind of content
means adding one block variant and one renderer, never touching a lecture.

Each lecture folder is self-contained:

```
src/content/lectures/01-entity-resolution/
  meta.ts          metadata, learning objectives, takeaways, section outline
  concepts.ts      glossary entries referenced by `concepts` blocks
  quiz.ts          quiz questions
  sections.ts      the blocks of every section, keyed by section id
  index.ts         assembles the four into one `Lecture`
  interactive/     React components used only by this lecture
```

`meta.ts`, `concepts.ts` and `quiz.ts` are plain data with no component imports, so
`registry.ts` can feed the homepage, the navigation and the search index without pulling any
lecture's interactive components into those bundles. `sections.ts` holds the component
references and is reached only from the lecture route.

The section outline is declared once in `meta.ts`; `sections.ts` types its export as
`SectionBlocks<typeof lecture01Outline>`, so a missing or misspelled section id is a compile
error.

### Adding a lecture

1. Create `src/content/lectures/<nn>-<slug>/` with the files above.
2. Register the metadata in `src/content/registry.ts` and the full lecture in
   `src/content/lectures.ts`.

Navigation, search, the progress tracker and the static route for `/lectures/<slug>/` all follow
automatically. Existing lectures are untouched.

### Progress and theme

Progress (sections read, best quiz score) and the theme live in `localStorage` behind
`useProgress` and `useTheme`, both built on `useSyncExternalStore`, so every component stays in
sync and server rendering is unaffected. A small inline script in the root layout applies the
stored theme before first paint. Nothing leaves the browser.

### Ask AI

Every lecture page has an assistant: select any text and an **Ask AI** button appears next to it,
or use the button in the corner for general questions. Answers are grounded in that lecture.

- **Model.** Gemini 3.8 Flash at its lowest thinking level, through Google's official
  `@google/genai` SDK. Its free tier costs nothing and scores at or above Claude Sonnet 5 on
  independent benchmarks; on the free tier Google may use prompts to improve its products.
- **No server.** The browser calls `generativelanguage.googleapis.com` directly with the reader's
  own key from Google AI Studio. The SDK is code-split and only downloaded when the assistant is
  first used.
- **Key storage.** Kept in `sessionStorage` by default (gone when the tab closes); "Remember on
  this device" moves it to `localStorage`. The key is verified before it is stored and is only
  ever sent in the request header to Google.
- **Content Security Policy.** Production builds ship a CSP meta tag (`src/lib/security.ts`) whose
  `connect-src` and `img-src` only allow this origin and the Gemini API, so injected code could
  not send the key anywhere else. `script-src` needs `'unsafe-inline'` because a static export
  cannot use nonces.
- **Context.** `src/lib/assistant/lectureContext.ts` serialises the whole lecture — sections,
  worked examples, glossary, quiz answers and exercise solutions — at build time and sends it as
  the system instruction.

## Deployment

`.github/workflows/deploy.yml` builds the site and publishes `./out` to GitHub Pages on every
push to `main`, and can also be run manually from the Actions tab.

`next.config.mjs` derives `basePath` and `assetPrefix` from `GITHUB_REPOSITORY` when running in
Actions, so the site works both at the repository sub-path and locally at the root.

One-time setup: in the repository, open **Settings -> Pages** and set **Source** to
**GitHub Actions**.
