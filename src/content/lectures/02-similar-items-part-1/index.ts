import type { Lecture } from "@/content/types";
import { lecture02Concepts } from "./concepts";
import { lecture02Meta, lecture02Outline } from "./meta";
import { lecture02Quiz } from "./quiz";
import { lecture02Blocks } from "./sections";

export const lecture02: Lecture = {
  meta: lecture02Meta,
  concepts: lecture02Concepts,
  quiz: lecture02Quiz,
  sections: lecture02Outline.map((section) => ({
    ...section,
    blocks: lecture02Blocks[section.id],
  })),
};
