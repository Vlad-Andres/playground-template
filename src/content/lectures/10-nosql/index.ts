import type { Lecture } from "@/content/types";
import { lecture10Concepts } from "./concepts";
import { lecture10Meta, lecture10Outline } from "./meta";
import { lecture10Quiz } from "./quiz";
import { lecture10Blocks } from "./sections";

export const lecture10: Lecture = {
  meta: lecture10Meta,
  concepts: lecture10Concepts,
  quiz: lecture10Quiz,
  sections: lecture10Outline.map((section) => ({
    ...section,
    blocks: lecture10Blocks[section.id],
  })),
};
