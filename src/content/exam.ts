import examJson from "./generated/exam.json";
import type { Lecture } from "./types";

export const examTraining = examJson as Lecture;
export const examQuiz = examTraining.quiz;
