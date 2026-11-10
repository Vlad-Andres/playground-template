import indexJson from "./generated/index.json";
import type { LectureMeta } from "./types";
import type { LectureIndexEntry } from "./types";

export type { LectureIndexEntry } from "./types";
export const lectureIndex = indexJson as LectureIndexEntry[];
export const lectureMetas: LectureMeta[] = lectureIndex.map((entry) => entry.meta);

export function countExercises(entry: LectureIndexEntry): number {
  return entry.exercises.reduce((sum, sheet) => sum + sheet.exercises.length, 0);
}

export function findLectureEntry(slug: string): LectureIndexEntry | undefined {
  return lectureIndex.find((entry) => entry.meta.slug === slug);
}

export function neighbourLectures(slug: string) {
  const position = lectureIndex.findIndex((entry) => entry.meta.slug === slug);
  return {
    previous: position > 0 ? lectureIndex[position - 1].meta : null,
    next: position >= 0 && position < lectureIndex.length - 1 ? lectureIndex[position + 1].meta : null,
  };
}
