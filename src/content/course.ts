import courseJson from "./generated/course.json";
import type { Course } from "./schema";

export const course = courseJson as Course;
