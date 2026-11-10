import type { Lecture } from "@/content/types";
import { examMeta, examOutline } from "./meta";
import { examQuiz } from "./quiz";
import { examBlocks } from "./sections";

/** The exam-training page, shaped like a lecture so it reuses the lecture components. */
export const examTraining: Lecture = {
  meta: examMeta,
  concepts: [],
  quiz: examQuiz,
  sections: examOutline.map((section) => ({
    ...section,
    blocks: examBlocks[section.id],
  })),
};

