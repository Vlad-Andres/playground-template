"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createPersistentStore } from "@/lib/store";
import {
  emptyTaskState,
  reviveExerciseState,
  type ExerciseState,
  type SelfMark,
  type TaskState,
} from "@/lib/exercises";

const store = createPersistentStore<ExerciseState>(
  "dis-playground:exercises:v1",
  {},
  reviveExerciseState,
);

export function useExerciseState() {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  const update = useCallback((key: string, patch: Partial<TaskState>) => {
    store.set((previous) => ({
      ...previous,
      [key]: { ...(previous[key] ?? emptyTaskState), ...patch },
    }));
  }, []);

  const setValue = useCallback(
    (key: string, value: string) => update(key, { value }),
    [update],
  );

  const toggleOption = useCallback((key: string, option: string) => {
    store.set((previous) => {
      const current = previous[key] ?? emptyTaskState;
      const selected = current.selected.includes(option)
        ? current.selected.filter((value) => value !== option)
        : [...current.selected, option];
      return { ...previous, [key]: { ...current, selected } };
    });
  }, []);

  const reveal = useCallback((key: string) => update(key, { revealed: true }), [update]);

  const setSelfMark = useCallback(
    (key: string, selfMark: SelfMark) => update(key, { selfMark }),
    [update],
  );

  const resetSheet = useCallback((sheetId: string) => {
    store.set((previous) =>
      Object.fromEntries(
        Object.entries(previous).filter(([key]) => !key.startsWith(`${sheetId}:`)),
      ),
    );
  }, []);

  return { state, update, setValue, toggleOption, reveal, setSelfMark, resetSheet };
}
