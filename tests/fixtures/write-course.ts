import fs from "node:fs";
import path from "node:path";
import { minimalCourse, minimalLecture } from "./minimal";

export function writeCourse(
  directory: string,
  parts: {
    course?: unknown;
    lectures?: Record<string, unknown>;
    exam?: unknown;
    expected?: unknown;
    raw?: Record<string, string>;
  } = {},
): void {
  fs.mkdirSync(path.join(directory, "lectures"), { recursive: true });
  fs.writeFileSync(path.join(directory, "course.json"), JSON.stringify(parts.course ?? minimalCourse));
  const lectures = parts.lectures ?? { "01-intro.json": minimalLecture };
  for (const [file, value] of Object.entries(lectures)) {
    fs.writeFileSync(path.join(directory, "lectures", file), JSON.stringify(value));
  }
  if (parts.exam !== undefined) fs.writeFileSync(path.join(directory, "exam.json"), JSON.stringify(parts.exam));
  if (parts.expected !== undefined) fs.writeFileSync(path.join(directory, "expected.json"), JSON.stringify(parts.expected));
  for (const [file, value] of Object.entries(parts.raw ?? {})) {
    const filePath = path.join(directory, file);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, value);
  }
}
