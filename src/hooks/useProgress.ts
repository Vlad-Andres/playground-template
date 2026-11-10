"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createPersistentStore } from "@/lib/store";
import {
  QUIZ_PASS_RATIO,
  emptyLectureProgress,
  reviveProgress,
  type LectureProgress,
  type ProgressState,
} from "@/lib/progress";

const store = createPersistentStore<ProgressState>(
  "dis-playground:progress:v1",
  {},
  reviveProgress,
);

function updateLecture(
  state: ProgressState,
  slug: string,
  update: (entry: LectureProgress) => LectureProgress,
): ProgressState {
  const entry = state[slug] ?? emptyLectureProgress;
  return { ...state, [slug]: update(entry) };
}

export function useProgress() {
  const progress = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const toggleSection = useCallback((slug: string, sectionId: string) => {
    store.set((state) =>
      updateLecture(state, slug, (entry) => ({
        ...entry,
        sections: entry.sections.includes(sectionId)
          ? entry.sections.filter((id) => id !== sectionId)
          : [...entry.sections, sectionId],
      })),
    );
  }, []);

  const recordQuizResult = useCallback(
    (slug: string, quizSectionId: string, correct: number, total: number) => {
      store.set((state) =>
        updateLecture(state, slug, (entry) => {
          const quizBest = Math.max(entry.quizBest, correct);
          const passed = total > 0 && quizBest / total >= QUIZ_PASS_RATIO;
          return {
            ...entry,
            quizBest,
            quizTotal: total,
            sections:
              passed && !entry.sections.includes(quizSectionId)
                ? [...entry.sections, quizSectionId]
                : entry.sections,
          };
        }),
      );
    },
    [],
  );

  const resetLecture = useCallback((slug: string) => {
    store.set((state) => ({ ...state, [slug]: emptyLectureProgress }));
  }, []);

  return { progress, toggleSection, recordQuizResult, resetLecture };
}
