import type {
  Block,
  Concept,
  Exercise,
  ExerciseCheck,
  ExerciseSheet,
  ExerciseTask,
  LectureMeta as ContentLectureMeta,
  LectureSource,
  LectureSection,
  RecallCard,
  QuizQuestion,
  RunConfig,
  SectionKind,
  SectionOutline,
  TimelineItem,
  WorkedStep,
  QuizOption,
  LectureFile,
  InfoVariant,
} from "./schema";

export type {
  Block,
  Concept,
  Exercise,
  ExerciseCheck,
  ExerciseSheet,
  ExerciseTask,
  LectureSection,
  LectureSource,
  RecallCard,
  QuizQuestion,
  QuizOption,
  RunConfig,
  SectionKind,
  SectionOutline,
  TimelineItem,
  WorkedStep,
  LectureFile,
  InfoVariant,
};
export type LectureMeta = ContentLectureMeta & { outline: SectionOutline[] };

export interface Lecture {
  meta: ContentLectureMeta & { outline: SectionOutline[] };
  concepts: Concept[];
  quiz: QuizQuestion[];
  sections: LectureSection[];
}

export interface LectureIndexEntry {
  meta: ContentLectureMeta & { outline: SectionOutline[] };
  concepts: Concept[];
  quiz: QuizQuestion[];
  exercises: ExerciseSheet[];
}
