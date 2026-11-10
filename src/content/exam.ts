import examJson from "./generated/exam.json";
import type { Lecture } from "./types";

export const examTraining = examJson as Lecture | null;
export const examQuiz = examTraining?.quiz ?? [];
