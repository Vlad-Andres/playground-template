import fs from "node:fs";
import path from "node:path";
import {
  courseSchema,
  expectedFileSchema,
  lectureFileSchema,
  type Course,
  type ExpectedTopic,
  type LectureFile,
} from "../../core/schema";
import { schemaProblems, type Problem } from "../../core/validate";

export type { Problem };

export interface LoadedCourse {
  course: Course | null;
  lectures: { file: string; data: LectureFile }[];
  exam: LectureFile | null;
  expected: ExpectedTopic[];
  problems: Problem[];
}

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
}

function parseJson(filePath: string, relativeFile: string): { value: unknown; problem?: Problem } {
  try {
    return { value: readJson(filePath) };
  } catch {
    return {
      value: null,
      problem: {
        code: "E001",
        severity: "error",
        file: relativeFile,
        path: "",
        message: "The file is not valid JSON.",
        fix: "Fix the JSON syntax in this file.",
      },
    };
  }
}

export function loadCourse(contentDir: string): LoadedCourse {
  const problems: Problem[] = [];
  const lectures: { file: string; data: LectureFile }[] = [];
  let course: Course | null = null;
  let exam: LectureFile | null = null;
  let expected: ExpectedTopic[] = [];

  const coursePath = path.join(contentDir, "course.json");
  if (!fs.existsSync(coursePath)) {
    problems.push({
      code: "E002",
      severity: "error",
      file: "course.json",
      path: "",
      message: "course.json is missing.",
      fix: "Add a valid course.json file to the content folder.",
    });
  } else {
    const parsed = parseJson(coursePath, "course.json");
    if (parsed.problem) problems.push(parsed.problem);
    else {
      const result = courseSchema.safeParse(parsed.value);
      if (result.success) course = result.data;
      else problems.push(...schemaProblems("course.json", result.error.issues));
    }
  }

  const lecturesDir = path.join(contentDir, "lectures");
  const lectureFiles = fs.existsSync(lecturesDir)
    ? fs
        .readdirSync(lecturesDir, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
        .map((entry) => entry.name)
        .sort()
    : [];
  if (lectureFiles.length === 0) {
    problems.push({
      code: "E002",
      severity: "error",
      file: "lectures/",
      path: "",
      message: "No lecture files were found.",
      fix: "Add at least one lecture JSON file under lectures/.",
    });
  }

  for (const file of lectureFiles) {
    const relativeFile = `lectures/${file}`;
    const parsed = parseJson(path.join(lecturesDir, file), relativeFile);
    if (parsed.problem) {
      problems.push(parsed.problem);
      continue;
    }
    const result = lectureFileSchema.safeParse(parsed.value);
    if (result.success) lectures.push({ file: relativeFile, data: result.data });
    else problems.push(...schemaProblems(relativeFile, result.error.issues));
  }

  const examPath = path.join(contentDir, "exam.json");
  if (fs.existsSync(examPath)) {
    const parsed = parseJson(examPath, "exam.json");
    if (parsed.problem) problems.push(parsed.problem);
    else {
      const result = lectureFileSchema.safeParse(parsed.value);
      if (result.success) exam = result.data;
      else problems.push(...schemaProblems("exam.json", result.error.issues));
    }
  }

  const expectedPath = path.join(contentDir, "expected.json");
  if (fs.existsSync(expectedPath)) {
    const parsed = parseJson(expectedPath, "expected.json");
    if (parsed.problem) problems.push(parsed.problem);
    else {
      const result = expectedFileSchema.safeParse(parsed.value);
      if (result.success) expected = result.data;
      else problems.push(...schemaProblems("expected.json", result.error.issues));
    }
  }

  return { course, lectures, exam, expected, problems };
}
