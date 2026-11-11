# Detect domain and features

Classify the material by teaching need, not by its file name:

| Evidence in the source | Prefer | Omit when absent |
| --- | --- | --- |
| Definitions, lecture explanations | `prose`, `concepts`, `info` | widgets |
| Mathematical notation or derivations | `formula`, `steps` | runnable code |
| Algorithms or programming examples | `code`, `steps` | unrelated domain widgets |
| Processes, chronology, comparisons | `timeline`, `table`, `steps` | invented chronology |
| Recall prompts | `recall`, `quiz` | exam pages without evidence |
| Genuine practice tasks | `practice` or `exercises` | guessed answers |
| A matching interactive from the widget catalogue | `widget` | custom code |

## Widgets per domain pack

Pages with examples: [`widgets/`](widgets/index.md).

| Pack | Typical material | Widgets that fit |
| --- | --- | --- |
| Core | Any subject | `flow-stepper`, `concept-map`, `categorize`, `match-pairs`, `order-items`, `cloze`, `chart`; `mock-exam` on the exam page |
| Math | Formulas, derivations, functions | `parameter-explorer`, `function-plot`, `chart`, plus `formula` and `steps` blocks |
| CS | Algorithms, systems, code | `flow-stepper` (pipelines, protocols), `order-items` (algorithm steps), `parameter-explorer` (cost models), `code` blocks |
| Memorise-heavy | Vocabulary, anatomy, law articles, dates | `match-pairs`, `cloze`, `categorize`, `recall` blocks |
| Humanities | History, literature, philosophy | `timeline` blocks, `order-items` (chronology), `concept-map` (schools, influences), `categorize` |

Use Core for ordinary explanations and assessment. Add Math, CS, Memorise-heavy, or Humanities
patterns only when the source clearly needs them. A domain choice changes presentation, not facts.
The agent decides the number of lectures, sections, widgets, quizzes, exercises, and optional pages.

Done means the outline records each selected feature and each deliberate omission.
