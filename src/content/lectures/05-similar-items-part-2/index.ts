import type { Lecture } from "@/content/types";
import { lecture05Concepts } from "./concepts";
import { lecture05Meta, lecture05Outline } from "./meta";
import { lecture05Quiz } from "./quiz";
import { lecture05Blocks } from "./sections";

export const lecture05: Lecture = {
  meta: lecture05Meta,
  concepts: lecture05Concepts,
  quiz: lecture05Quiz,
  sections: lecture05Outline.map((section) => ({
    ...section,
    blocks: lecture05Blocks[section.id],
  })),
};
