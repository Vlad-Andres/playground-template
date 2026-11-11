import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { makeBundle } from "../../core/generate/bundle";
import { DEFAULT_BUDGET, finishCourse } from "../../core/generate/finish";
import { checkMaterials, renderMaterials } from "../../core/generate/ingest";
import { writeLecture } from "../../core/generate/lecture";
import { lintLecture } from "../../core/generate/lint";
import { Budget, withBudget, type ModelClient } from "../../core/generate/model";
import { planCourse } from "../../core/generate/plan";
import { briefSchema, type Brief } from "../../core/generate/types";
import type { LectureFile } from "../../core/schema";
import { writeContent } from "../content/import";
import { geminiClient, openAiCompatibleClient } from "./clients";
import { readMaterials } from "./extract-pdf";
import { cannedModel } from "./fake";

export interface CliOptions {
  materials: string;
  out: string;
  depth: Brief["depth"];
  language: string;
  level: Brief["level"];
  exam: boolean;
  widgets: boolean;
  quizzes: boolean;
  provider: "gemini" | "openai";
  model?: string;
  fake: boolean;
  title?: string;
  accent?: string;
  context: string;
  bundle?: string;
  report?: string;
  trace?: string;
  priceIn?: number;
  priceOut?: number;
}

export function parseArgs(args: string[]): CliOptions {
  const value = (name: string) => {
    const index = args.indexOf(`--${name}`);
    return index >= 0 ? args[index + 1] : undefined;
  };
  const number = (name: string) => (value(name) === undefined ? undefined : Number(value(name)));
  return {
    materials: value("materials") ?? "materials",
    out: value("out") ?? "content",
    depth: (value("depth") ?? "standard") as Brief["depth"],
    language: value("language") ?? "en",
    level: (value("level") ?? "university") as Brief["level"],
    exam: args.includes("--exam"),
    widgets: !args.includes("--no-widgets"),
    quizzes: !args.includes("--no-quizzes"),
    provider: (value("provider") ?? "gemini") as CliOptions["provider"],
    model: value("model"),
    fake: args.includes("--fake"),
    title: value("title"),
    accent: value("accent"),
    context: value("context") ?? "",
    bundle: value("bundle"),
    report: value("report"),
    trace: value("trace"),
    priceIn: number("price-in"),
    priceOut: number("price-out"),
  };
}

function loadEnvFile(): void {
  const file = path.resolve(".env.local");
  if (fs.existsSync(file) && typeof process.loadEnvFile === "function") process.loadEnvFile(file);
}

function modelFor(options: CliOptions): { client: ModelClient; name: string } {
  if (options.fake) return { client: cannedModel(), name: "canned" };
  loadEnvFile();
  if (options.provider === "openai") {
    const apiKey = process.env.OPENAI_COMPATIBLE_API_KEY;
    const baseUrl = process.env.OPENAI_COMPATIBLE_BASE_URL;
    const model = options.model ?? process.env.OPENAI_COMPATIBLE_MODEL;
    if (!apiKey || !baseUrl || !model) throw new Error("Set OPENAI_COMPATIBLE_API_KEY, OPENAI_COMPATIBLE_BASE_URL and --model (or OPENAI_COMPATIBLE_MODEL).");
    return { client: openAiCompatibleClient({ apiKey, baseUrl, model }), name: model };
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Set GEMINI_API_KEY in the environment or .env.local.");
  const model = options.model ?? process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite";
  return { client: geminiClient({ apiKey, model }), name: model };
}

/** Append every request and reply to a local JSONL file (prompts and replies only, never keys). */
function tracing(client: ModelClient, file: string): ModelClient {
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  fs.writeFileSync(file, "");
  return {
    async complete(request) {
      const reply = await client.complete(request);
      fs.appendFileSync(file, `${JSON.stringify({ task: request.system.split("\n")[0], user: request.user.slice(0, 2000), reply: reply.text })}\n`);
      return reply;
    },
  };
}

export interface GenerationSummary {
  model: string;
  lectures: number;
  blocksByKind: Record<string, number>;
  widgetsByType: Record<string, number>;
  quizPerLecture: number[];
  dropped: string[];
  warnings: string[];
  errors: string[];
  usage: { inputTokens: number; outputTokens: number; calls: number };
  seconds: number;
  costUsd?: number;
}

export function summarise(lectures: LectureFile[]): Pick<GenerationSummary, "blocksByKind" | "widgetsByType" | "quizPerLecture"> {
  const blocksByKind: Record<string, number> = {};
  const widgetsByType: Record<string, number> = {};
  for (const block of lectures.flatMap((lecture) => lecture.sections.flatMap((section) => section.blocks))) {
    blocksByKind[block.kind] = (blocksByKind[block.kind] ?? 0) + 1;
    if (block.kind === "widget") widgetsByType[block.type] = (widgetsByType[block.type] ?? 0) + 1;
  }
  return { blocksByKind, widgetsByType, quizPerLecture: lectures.map((lecture) => lecture.quiz.length) };
}

export function reportMarkdown(summary: GenerationSummary): string {
  const total = Object.values(summary.blocksByKind).reduce((sum, count) => sum + count, 0);
  const prose = summary.blocksByKind.prose ?? 0;
  const lines = [
    "# Generation report",
    "",
    `- Model: ${summary.model}`,
    `- Lectures: ${summary.lectures}`,
    `- Blocks: ${total} of ${Object.keys(summary.blocksByKind).length} kinds (prose ${total ? Math.round((prose / total) * 100) : 0}%)`,
    `- Widgets: ${Object.entries(summary.widgetsByType).map(([type, count]) => `${type} ×${count}`).join(", ") || "none"}`,
    `- Quiz questions per lecture: ${summary.quizPerLecture.join(", ")}`,
    `- Dropped items: ${summary.dropped.length}`,
    `- Lint warnings left: ${summary.warnings.length}`,
    `- Validation errors: ${summary.errors.length}`,
    `- Tokens: ${summary.usage.inputTokens.toLocaleString("en")} in, ${summary.usage.outputTokens.toLocaleString("en")} out, ${summary.usage.calls} calls`,
    `- Time: ${summary.seconds.toFixed(0)} s`,
    summary.costUsd === undefined ? "- Cost: (pass --price-in and --price-out in USD per million tokens)" : `- Cost: $${summary.costUsd.toFixed(4)}`,
    "",
    "## Blocks by kind",
    "",
    "| Kind | Count |",
    "| --- | --- |",
    ...Object.entries(summary.blocksByKind)
      .sort((a, b) => b[1] - a[1])
      .map(([kind, count]) => `| ${kind} | ${count} |`),
  ];
  if (summary.dropped.length) lines.push("", "## Dropped", "", ...summary.dropped.map((line) => `- ${line}`));
  if (summary.warnings.length) lines.push("", "## Warnings", "", ...summary.warnings.map((line) => `- ${line}`));
  if (summary.errors.length) lines.push("", "## Errors", "", ...summary.errors.map((line) => `- ${line}`));
  return `${lines.join("\n")}\n`;
}

export async function runGenerate(options: CliOptions, log: (line: string) => void = console.log): Promise<GenerationSummary> {
  const started = Date.now();
  const brief = briefSchema.parse({
    language: options.language,
    level: options.level,
    depth: options.depth,
    examMode: options.exam,
    quizzes: options.quizzes,
    widgets: options.widgets,
    context: options.context,
    ...(options.title ? { title: options.title } : {}),
    ...(options.accent ? { accent: options.accent } : {}),
  });
  const materials = await readMaterials(options.materials);
  log(`materials: ${materials.map((material) => `${material.name} (${material.pages.length} pages)`).join(", ") || "none"}`);
  const check = checkMaterials(materials);
  if (!check.ok) throw new Error(check.message);

  const { client, name } = modelFor(options);
  const budget = new Budget(DEFAULT_BUDGET);
  const model = withBudget(options.trace ? tracing(client, options.trace) : client, budget);

  const plan = await planCourse(materials, brief, model);
  log(`plan: ${plan.lectures.length} lectures — ${plan.lectures.map((lecture) => lecture.slug).join(", ")}`);

  const lectures: LectureFile[] = [];
  const dropped: string[] = [];
  const warnings: string[] = [];
  for (let index = 0; index < plan.lectures.length; index += 1) {
    const { lecture, dropped: lost } = await writeLecture(plan, index, materials, brief, model);
    lectures.push(lecture);
    dropped.push(...lost.map((problem) => `L${lecture.meta.number} ${problem.path}: ${problem.message}`));
    const pageCount = renderMaterials(materials, plan.lectures[index].pages).split("\n=== ").length;
    const left = lintLecture(lecture, brief, pageCount);
    warnings.push(...left.map((problem) => `L${lecture.meta.number} ${problem.code} ${problem.path}: ${problem.message}`));
    const blocks = lecture.sections.reduce((sum, section) => sum + section.blocks.length, 0);
    log(`lecture ${index + 1}/${plan.lectures.length}: ${lecture.meta.slug} — ${blocks} blocks, ${lecture.quiz.length} quiz, ${lost.length} dropped, ${left.length} warnings`);
  }

  const { files, problems } = finishCourse(plan, lectures, brief);
  writeContent(options.out, files);
  log(`finish: wrote ${Object.keys(files).length} files to ${options.out}`);
  if (options.bundle) {
    fs.mkdirSync(path.dirname(path.resolve(options.bundle)), { recursive: true });
    fs.writeFileSync(options.bundle, `${JSON.stringify(makeBundle(files))}\n`);
    log(`bundle: ${options.bundle}`);
  }

  const usage = budget.used;
  const summary: GenerationSummary = {
    model: name,
    lectures: lectures.length,
    ...summarise(lectures),
    dropped,
    warnings: [...warnings, ...problems.filter((problem) => problem.severity === "warning").map((problem) => `${problem.code} ${problem.file} ${problem.path}: ${problem.message}`)],
    errors: problems.filter((problem) => problem.severity === "error").map((problem) => `${problem.code} ${problem.file} ${problem.path}: ${problem.message}`),
    usage,
    seconds: (Date.now() - started) / 1000,
    ...(options.priceIn !== undefined && options.priceOut !== undefined
      ? { costUsd: (usage.inputTokens * options.priceIn + usage.outputTokens * options.priceOut) / 1_000_000 }
      : {}),
  };
  const report = reportMarkdown(summary);
  if (options.report) {
    fs.mkdirSync(path.dirname(path.resolve(options.report)), { recursive: true });
    fs.writeFileSync(options.report, report);
  }
  log(report);
  return summary;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runGenerate(parseArgs(process.argv.slice(2)))
    .then((summary) => {
      process.exitCode = summary.errors.length ? 1 : 0;
    })
    .catch((error: unknown) => {
      console.error(`FAILED: ${error instanceof Error ? error.message : "generation failed"}`);
      process.exitCode = 1;
    });
}
