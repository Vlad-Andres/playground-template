import courseJson from "./generated/course.json";
import type { Course } from "./schema";

export const course = courseJson as Course;

/** Feature switches; each is on unless the course sets it to false. */
export const features = {
  assistant: course.features?.assistant !== false,
  difficult: course.features?.difficult !== false,
  search: course.features?.search !== false,
};
