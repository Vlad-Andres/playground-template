import type { Lecture } from "@/content/types";
import { lecture04Concepts } from "./concepts";
import { lecture04Meta, lecture04Outline } from "./meta";
import { lecture04Quiz } from "./quiz";
import { lecture04Blocks } from "./sections";

export const lecture04: Lecture = {
  meta: lecture04Meta,
  concepts: lecture04Concepts,
  quiz: lecture04Quiz,
  sections: lecture04Outline.map((section) => ({
    ...section,
    blocks: lecture04Blocks[section.id],
  })),
};
