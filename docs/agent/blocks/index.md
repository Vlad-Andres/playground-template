# Block reference

All blocks are strict JSON objects with a `kind`. The canonical schemas are in `schema/` and
`src/content/schema.ts`.

| Kind | Shape summary | Use |
| --- | --- | --- |
| `prose` | `{ "kind": "prose", "md": "..." }` | Explanations |
| `info` | `variant`, `title`, `md` | Note, insight, warning, pitfall |
| `concepts` | `ids` | Glossary concepts defined in the lecture |
| `formula` | `tex`, optional `caption` | Mathematical notation |
| `code` | `lang`, `code`, optional `run` | Source-backed code |
| `table` | `headers`, `rows`, optional `caption` | Comparisons and structured data |
| `figure` | `src`, `alt`, `width`, `height`, optional `caption` | Existing source figure |
| `steps` | `title`, optional `intro`, `steps[{title,md}]` | Derivations and procedures |
| `timeline` | `items[{label,title,md}]` | Ordered events or stages |
| `list` | `variant`, `items` | Objectives or takeaways |
| `recall` | `cards[{prompt,answer}]` | Short retrieval practice |
| `practice` | `id`, `tasks` | Interactive tasks with checks |
| `exercises` | `sheet` with tasks | A larger exercise sheet |
| `widget` | registered `type`, title, optional props | Existing reusable interaction |

Prefer the smallest block that preserves the source's teaching purpose. Never use a widget as a
decoration and never put executable course logic in JSON.
