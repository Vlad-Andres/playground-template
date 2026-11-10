import type { Lecture } from "@/content/types";
import { lecture07Concepts } from "./concepts";
import { lecture07Meta, lecture07Outline } from "./meta";
import { lecture07Quiz } from "./quiz";
import { lecture07Blocks } from "./sections";

export const lecture07: Lecture = {
  meta: lecture07Meta,
  concepts: lecture07Concepts,
  quiz: lecture07Quiz,
  sections: lecture07Outline.map((section) => ({
    ...section,
    blocks: lecture07Blocks[section.id],
  })),
};
