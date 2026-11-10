import type { Lecture } from "@/content/types";
import { lecture09Concepts } from "./concepts";
import { lecture09Meta, lecture09Outline } from "./meta";
import { lecture09Quiz } from "./quiz";
import { lecture09Blocks } from "./sections";

export const lecture09: Lecture = {
  meta: lecture09Meta,
  concepts: lecture09Concepts,
  quiz: lecture09Quiz,
  sections: lecture09Outline.map((section) => ({
    ...section,
    blocks: lecture09Blocks[section.id],
  })),
};
