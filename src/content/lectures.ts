import lecturesJson from "./generated/lectures.json";
import type { Lecture } from "./types";

const lectures = lecturesJson as Lecture[];

export function allLectures(): Lecture[] {
  return lectures;
}

export function getLecture(slug: string): Lecture | undefined {
  return lectures.find((lecture) => lecture.meta.slug === slug);
}
