import { course } from "@site/content/course";

export function makeStorageKey(courseId: string): (name: string) => string {
  return (name) => `${courseId}:${name}`;
}

export const storageKey = makeStorageKey(course.id);
