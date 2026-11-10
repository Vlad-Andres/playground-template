import type { Lecture } from "@/content/types";
import { lecture11Concepts } from "./concepts";
import { lecture11Meta, lecture11Outline } from "./meta";
import { lecture11Quiz } from "./quiz";
import { lecture11Blocks } from "./sections";

export const lecture11: Lecture = {
  meta: lecture11Meta,
  concepts: lecture11Concepts,
  quiz: lecture11Quiz,
  sections: lecture11Outline.map((section) => ({
    ...section,
    blocks: lecture11Blocks[section.id],
  })),
};
