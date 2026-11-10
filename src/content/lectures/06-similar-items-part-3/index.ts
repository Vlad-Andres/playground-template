import type { Lecture } from "@/content/types";
import { lecture06Concepts } from "./concepts";
import { lecture06Meta, lecture06Outline } from "./meta";
import { lecture06Quiz } from "./quiz";
import { lecture06Blocks } from "./sections";

export const lecture06: Lecture = {
  meta: lecture06Meta,
  concepts: lecture06Concepts,
  quiz: lecture06Quiz,
  sections: lecture06Outline.map((section) => ({
    ...section,
    blocks: lecture06Blocks[section.id],
  })),
};
