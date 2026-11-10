import { z } from "zod";

const identifier = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/);
const courseId = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);
const language = z.string().regex(/^[a-z]{2,3}(-[A-Za-z0-9]+)*$/);
const positiveInt = z.number().int().positive();

const sectionKind = z.enum([
  "objectives",
  "intuition",
  "concepts",
  "visual",
  "playground",
  "examples",
  "mistakes",
  "quiz",
  "exercises",
  "summary",
]);

const sectionOutlineSchema = z
  .object({ id: identifier, title: z.string(), kind: sectionKind })
  .strict();

const sourceSchema = z
  .object({
    label: z.string(),
    kind: z.enum(["slides", "chapter", "notes"]),
    detail: z.string().optional(),
  })
  .strict();

const metaSchema = z
  .object({
    slug: identifier,
    number: positiveInt,
    title: z.string(),
    subtitle: z.string(),
    summary: z.string(),
    topics: z.array(z.string()),
    difficulty: z.enum(["intro", "core", "advanced"]),
    estimatedMinutes: positiveInt,
    sources: z.array(sourceSchema),
    objectives: z.array(z.string()),
    takeaways: z.array(z.string()),
  })
  .strict();

const conceptSchema = z
  .object({
    id: identifier,
    term: z.string(),
    short: z.string(),
    detail: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })
  .strict();

const quizOptionSchema = z.object({ id: identifier, text: z.string() }).strict();
const quizQuestionSchema = z
  .object({
    id: identifier,
    prompt: z.string(),
    options: z.array(quizOptionSchema).min(2).max(6),
    answerId: identifier,
    explanation: z.string(),
  })
  .strict();

const exerciseCheckSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("open"), palette: z.enum(["algebra"]).optional() }).strict(),
  z
    .object({ mode: z.literal("text"), accept: z.array(z.string()), placeholder: z.string().optional() })
    .strict(),
  z
    .object({ mode: z.literal("select"), options: z.array(z.string()), answer: z.array(z.string()) })
    .strict(),
]);

const exerciseTaskSchema = z
  .object({
    id: identifier,
    prompt: z.string(),
    check: exerciseCheckSchema,
    solution: z.string(),
    hint: z.string().optional(),
  })
  .strict();

const exerciseSchema = z
  .object({
    id: identifier,
    title: z.string(),
    intro: z.string().optional(),
    tasks: z.array(exerciseTaskSchema),
  })
  .strict();

const exerciseSheetSchema = z
  .object({
    id: identifier,
    title: z.string(),
    description: z.string(),
    source: z.string(),
    exercises: z.array(exerciseSchema),
  })
  .strict();

const runConfigSchema = z
  .object({
    code: z.string().optional(),
    note: z.string().optional(),
    hint: z.string().optional(),
  })
  .strict();

const workedStepSchema = z.object({ title: z.string(), md: z.string() }).strict();
const timelineItemSchema = z
  .object({ label: z.string(), title: z.string(), md: z.string() })
  .strict();
const recallCardSchema = z.object({ prompt: z.string(), answer: z.string() }).strict();

const proseBlockSchema = z.object({ kind: z.literal("prose"), md: z.string() }).strict();
const infoBlockSchema = z
  .object({
    kind: z.literal("info"),
    variant: z.enum(["note", "insight", "warning", "pitfall"]),
    title: z.string(),
    md: z.string(),
  })
  .strict();
const conceptsBlockSchema = z.object({ kind: z.literal("concepts"), ids: z.array(identifier) }).strict();
const formulaBlockSchema = z
  .object({ kind: z.literal("formula"), tex: z.string(), caption: z.string().optional() })
  .strict();
const codeBlockSchema = z
  .object({
    kind: z.literal("code"),
    lang: z.string(),
    code: z.string(),
    caption: z.string().optional(),
    run: z.union([runConfigSchema, z.literal(false)]).optional(),
  })
  .strict();
const tableBlockSchema = z
  .object({
    kind: z.literal("table"),
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
    caption: z.string().optional(),
  })
  .strict();
const figureBlockSchema = z
  .object({
    kind: z.literal("figure"),
    src: z.string(),
    alt: z.string(),
    width: positiveInt,
    height: positiveInt,
    caption: z.string().optional(),
  })
  .strict();
const stepsBlockSchema = z
  .object({
    kind: z.literal("steps"),
    title: z.string(),
    intro: z.string().optional(),
    steps: z.array(workedStepSchema),
  })
  .strict();
const timelineBlockSchema = z.object({ kind: z.literal("timeline"), items: z.array(timelineItemSchema) }).strict();
const listBlockSchema = z
  .object({ kind: z.literal("list"), variant: z.enum(["objectives", "takeaways"]), items: z.array(z.string()) })
  .strict();
const exercisesBlockSchema = z.object({ kind: z.literal("exercises"), sheet: exerciseSheetSchema }).strict();
const recallBlockSchema = z.object({ kind: z.literal("recall"), cards: z.array(recallCardSchema) }).strict();
const practiceBlockSchema = z
  .object({ kind: z.literal("practice"), id: identifier, tasks: z.array(exerciseTaskSchema) })
  .strict();
const widgetBlockSchema = z
  .object({
    kind: z.literal("widget"),
    type: identifier,
    title: z.string(),
    description: z.string().optional(),
    props: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const blockSchema = z.discriminatedUnion("kind", [
  proseBlockSchema,
  infoBlockSchema,
  conceptsBlockSchema,
  formulaBlockSchema,
  codeBlockSchema,
  tableBlockSchema,
  figureBlockSchema,
  stepsBlockSchema,
  timelineBlockSchema,
  listBlockSchema,
  exercisesBlockSchema,
  recallBlockSchema,
  practiceBlockSchema,
  widgetBlockSchema,
]);

const lectureSectionSchema = z
  .object({ id: identifier, title: z.string(), kind: sectionKind, blocks: z.array(blockSchema) })
  .strict();

export const courseSchema = z
  .object({
    id: courseId,
    title: z.string(),
    shortTitle: z.string(),
    description: z.string(),
    language,
    indexable: z.boolean(),
    overviewMd: z.string().optional(),
  })
  .strict();

export const lectureFileSchema = z
  .object({
    meta: metaSchema,
    concepts: z.array(conceptSchema),
    quiz: z.array(quizQuestionSchema),
    sections: z.array(lectureSectionSchema).min(1),
  })
  .strict();

const expectedItemSchema = z
  .object({ id: identifier, title: z.string(), md: z.string() })
  .strict();
const expectedTopicSchema = z
  .object({
    id: identifier,
    lectures: z.string(),
    title: z.string(),
    links: z.array(z.object({ slug: identifier, label: z.string() }).strict()),
    official: z.string(),
    items: z.array(expectedItemSchema),
  })
  .strict();

export const expectedFileSchema = z.array(expectedTopicSchema);

export type Course = z.infer<typeof courseSchema>;
export type LectureFile = z.infer<typeof lectureFileSchema>;
export type ExpectedTopic = z.infer<typeof expectedTopicSchema>;
