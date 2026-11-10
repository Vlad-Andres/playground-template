import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCourse, type Problem } from "./load";
import { widgetManifest } from "../../src/widgets/manifest";

function duplicateProblem(file: string, valuePath: string, value: string, kind: string): Problem {
  return {
    code: "E101",
    severity: "error",
    file,
    path: valuePath,
    message: `Duplicate ${kind} "${value}".`,
    fix: `Change this ${kind} so it is unique.`,
  };
}

function addDuplicate(
  seen: Map<string, string>,
  value: string,
  file: string,
  valuePath: string,
  kind: string,
  problems: Problem[],
): void {
  if (seen.has(value)) problems.push(duplicateProblem(file, valuePath, value, kind));
  else seen.set(value, file);
}

function wordCount(value: string): number {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

export function validateCourse(contentDir: string): Problem[] {
  const loaded = loadCourse(contentDir);
  const problems = [...loaded.problems];
  const slugs = new Map<string, string>();
  const numbers = new Map<string, string>();
  const lectureSlugs = new Set(loaded.lectures.map(({ data }) => data.meta.slug));

  for (const { file, data } of loaded.lectures) {
    addDuplicate(slugs, data.meta.slug, file, "meta.slug", data.meta.slug, problems);
    addDuplicate(numbers, String(data.meta.number), file, "meta.number", "lecture number", problems);

    const expectedFile = `${String(data.meta.number).padStart(2, "0")}-${data.meta.slug}.json`;
    if (path.basename(file) !== expectedFile) {
      problems.push({
        code: "E107",
        severity: "error",
        file,
        path: "",
        message: `Lecture filename must be "${expectedFile}".`,
        fix: `Rename this file to "${expectedFile}".`,
      });
    }

    const conceptIds = new Map<string, string>();
    for (let index = 0; index < data.concepts.length; index += 1) {
      addDuplicate(conceptIds, data.concepts[index].id, file, `concepts[${index}].id`, "concept id", problems);
    }

    const questionIds = new Map<string, string>();
    for (let index = 0; index < data.quiz.length; index += 1) {
      const question = data.quiz[index];
      addDuplicate(questionIds, question.id, file, `quiz[${index}].id`, "quiz question id", problems);
      if (!question.options.some((option) => option.id === question.answerId)) {
        problems.push({
          code: "E103",
          severity: "error",
          file,
          path: `quiz[${index}].answerId`,
          message: `Answer "${question.answerId}" is not one of the question's options.`,
          fix: "Set answerId to the id of one of this question's options.",
        });
      }
    }

    const sectionIds = new Map<string, string>();
    for (let sectionIndex = 0; sectionIndex < data.sections.length; sectionIndex += 1) {
      const section = data.sections[sectionIndex];
      addDuplicate(sectionIds, section.id, file, `sections[${sectionIndex}].id`, "section id", problems);
      for (let blockIndex = 0; blockIndex < section.blocks.length; blockIndex += 1) {
        const block = section.blocks[blockIndex];
        const blockPath = `sections[${sectionIndex}].blocks[${blockIndex}]`;
        if (block.kind === "concepts") {
          block.ids.forEach((id, idIndex) => {
            if (!conceptIds.has(id)) {
              problems.push({
                code: "E102",
                severity: "error",
                file,
                path: `${blockPath}.ids[${idIndex}]`,
                message: `Concept "${id}" is not defined in this lecture.`,
                fix: `Add a concept with id "${id}" to "concepts", or remove "${id}" from this block.`,
              });
            }
          });
        }
        if (block.kind === "widget") {
          const manifestEntry = widgetManifest[block.type as keyof typeof widgetManifest];
          if (!manifestEntry) {
            problems.push({
              code: "E104",
              severity: "error",
              file,
              path: `${blockPath}.type`,
              message: `Widget "${block.type}" is not registered.`,
              fix: `Set type to a widget listed in the widget manifest.`,
            });
          } else if (block.props && !manifestEntry.props.safeParse(block.props).success) {
            problems.push({
              code: "E105",
              severity: "error",
              file,
              path: `${blockPath}.props`,
              message: `Props do not match the "${block.type}" widget schema.`,
              fix: `Remove unsupported props or change them to match the "${block.type}" widget schema.`,
            });
          }
        }
        if (block.kind === "figure" && !fs.existsSync(path.join(contentDir, "figures", block.src))) {
          problems.push({
            code: "E106",
            severity: "error",
            file,
            path: `${blockPath}.src`,
            message: `Figure "${block.src}" does not exist.`,
            fix: `Add "${block.src}" under the content folder's figures directory, or change src.`,
          });
        }
        if (block.kind === "exercises") {
          block.sheet.exercises.forEach((exercise, exerciseIndex) =>
            exercise.tasks.forEach((task, taskIndex) => {
              if (task.check.mode !== "select") return;
              const check = task.check;
              check.answer.forEach((answer, answerIndex) => {
                if (!check.options.includes(answer)) {
                  problems.push({
                    code: "E108",
                    severity: "error",
                    file,
                    path: `${blockPath}.sheet.exercises[${exerciseIndex}].tasks[${taskIndex}].check.answer[${answerIndex}]`,
                    message: `Answer "${answer}" is not one of the check options.`,
                    fix: "Set every answer to one of the check options.",
                  });
                }
              });
            }),
          );
        }
        if (block.kind === "practice") {
          block.tasks.forEach((task, taskIndex) => {
            if (task.check.mode !== "select") return;
            const check = task.check;
            check.answer.forEach((answer, answerIndex) => {
              if (!check.options.includes(answer)) {
                problems.push({
                  code: "E108",
                  severity: "error",
                  file,
                  path: `${blockPath}.tasks[${taskIndex}].check.answer[${answerIndex}]`,
                  message: `Answer "${answer}" is not one of the check options.`,
                  fix: "Set every answer to one of the check options.",
                });
              }
            });
          });
        }
        if ((block.kind === "prose" || block.kind === "info") && wordCount(block.md) > 80) {
          problems.push({
            code: "W201",
            severity: "warning",
            file,
            path: `${blockPath}.md`,
            message: "This Markdown block has more than 80 words.",
            fix: "Shorten this block to 80 words or fewer.",
          });
        }
      }
    }
  }

  loaded.expected.forEach((topic, topicIndex) =>
    topic.links.forEach((link, linkIndex) => {
      if (!lectureSlugs.has(link.slug)) {
        problems.push({
          code: "E109",
          severity: "error",
          file: "expected.json",
          path: `[${topicIndex}].links[${linkIndex}].slug`,
          message: `Lecture slug "${link.slug}" is not defined.`,
          fix: `Change slug to one of the lecture slugs in the content folder.`,
        });
      }
    }),
  );

  return problems;
}

export function formatProblem(problem: Problem): string {
  return `${problem.code} ${problem.file} ${problem.path}: ${problem.message} Fix: ${problem.fix}`;
}

function main(args: string[]): number {
  const strict = args.includes("--strict");
  const contentDir = args.find((arg) => !arg.startsWith("--")) ?? process.env.CONTENT_DIR ?? "content";
  const loaded = loadCourse(contentDir);
  const problems = validateCourse(contentDir);
  for (const problem of problems) console.log(formatProblem(problem));
  const errors = problems.filter((problem) => problem.severity === "error").length;
  const warnings = problems.filter((problem) => problem.severity === "warning").length;
  if (errors > 0) console.log(`FAILED: ${errors} errors, ${warnings} warnings`);
  else console.log(`OK: ${loaded.lectures.length} lectures, ${errors} errors, ${warnings} warnings`);
  return errors > 0 || (strict && warnings > 0) ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
