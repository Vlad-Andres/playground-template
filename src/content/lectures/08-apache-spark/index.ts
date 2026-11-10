import type { Lecture } from "@/content/types";
import { lecture08Concepts } from "./concepts";
import { lecture08Meta, lecture08Outline } from "./meta";
import { lecture08Quiz } from "./quiz";
import { lecture08Blocks } from "./sections";

export const lecture08: Lecture = {
  meta: lecture08Meta,
  concepts: lecture08Concepts,
  quiz: lecture08Quiz,
  sections: lecture08Outline.map((section) => ({
    ...section,
    blocks: lecture08Blocks[section.id],
  })),
};
