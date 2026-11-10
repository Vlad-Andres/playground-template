import type { Lecture } from "@/content/types";
import { lecture03Concepts } from "./concepts";
import { lecture03Meta, lecture03Outline } from "./meta";
import { lecture03Quiz } from "./quiz";
import { lecture03Blocks } from "./sections";

export const lecture03: Lecture = {
  meta: lecture03Meta,
  concepts: lecture03Concepts,
  quiz: lecture03Quiz,
  sections: lecture03Outline.map((section) => ({
    ...section,
    blocks: lecture03Blocks[section.id],
  })),
};
