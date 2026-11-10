import type { Lecture } from "@/content/types";
import { lecture12Concepts } from "./concepts";
import { lecture12Meta, lecture12Outline } from "./meta";
import { lecture12Quiz } from "./quiz";
import { lecture12Blocks } from "./sections";

export const lecture12: Lecture = {
  meta: lecture12Meta,
  concepts: lecture12Concepts,
  quiz: lecture12Quiz,
  sections: lecture12Outline.map((section) => ({
    ...section,
    blocks: lecture12Blocks[section.id],
  })),
};
