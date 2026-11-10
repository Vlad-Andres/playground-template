import fs from "node:fs";
import path from "node:path";
import { allLectures } from "../src/content/lectures";
import { examTraining } from "../src/content/exam";
import { expectedTopics } from "../src/content/expected";
import { toWidgetType } from "../src/widgets/naming";
import type { Lecture } from "../src/content/types";

const outputDirectory = path.resolve("examples/dis");
const lectureDirectory = path.join(outputDirectory, "lectures");

function convertValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(convertValue);
  if (!value || typeof value !== "object") return value;

  const record = value as Record<string, unknown>;
  if (record.kind === "interactive" && typeof record.component === "function") {
    const component = record.component as { name?: string };
    return {
      kind: "widget",
      type: toWidgetType(component.name ?? ""),
      title: record.title,
      ...(record.description === undefined ? {} : { description: record.description }),
    };
  }

  return Object.fromEntries(
    Object.entries(record)
      .filter(([key]) => key !== "component")
      .map(([key, entry]) => [key, convertValue(entry)]),
  );
}

function lectureFile(lecture: Lecture): object {
  const { outline: _outline, ...meta } = lecture.meta;
  return {
    meta,
    concepts: convertValue(lecture.concepts),
    quiz: convertValue(lecture.quiz),
    sections: convertValue(lecture.sections),
  };
}

fs.mkdirSync(lectureDirectory, { recursive: true });
for (const lecture of allLectures()) {
  const file = `${String(lecture.meta.number).padStart(2, "0")}-${lecture.meta.slug}.json`;
  fs.writeFileSync(path.join(lectureDirectory, file), `${JSON.stringify(lectureFile(lecture), null, 2)}\n`);
}

if (examTraining) {
  fs.writeFileSync(path.join(outputDirectory, "exam.json"), `${JSON.stringify(lectureFile(examTraining), null, 2)}\n`);
}
fs.writeFileSync(path.join(outputDirectory, "expected.json"), `${JSON.stringify(expectedTopics, null, 2)}\n`);
