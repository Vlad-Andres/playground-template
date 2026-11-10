import type { Lecture } from "@/content/types";
import { lecture01Concepts } from "./concepts";
import { lecture01Meta, lecture01Outline } from "./meta";
import { lecture01Quiz } from "./quiz";
import { lecture01Blocks } from "./sections";

export const lecture01: Lecture = {
  meta: lecture01Meta,
  concepts: lecture01Concepts,
  quiz: lecture01Quiz,
  sections: lecture01Outline.map((section) => ({
    ...section,
    blocks: lecture01Blocks[section.id],
  })),
};
