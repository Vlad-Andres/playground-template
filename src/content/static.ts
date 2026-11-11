import { buildSiteData } from "@core/site";
import courseJson from "./generated/course.json";
import examJson from "./generated/exam.json";
import expectedJson from "./generated/expected.json";
import lecturesJson from "./generated/lectures.json";
import type { Course, ExpectedTopic, Lecture } from "./types";

/**
 * The template's own course. This is the only module that reads
 * `content/generated/*`; everything else takes a `SiteData` value.
 */
export const staticSite = buildSiteData({
  key: (courseJson as Course).id,
  course: courseJson as Course,
  lectures: lecturesJson as Lecture[],
  exam: examJson as Lecture | null,
  expected: expectedJson as ExpectedTopic[],
});
