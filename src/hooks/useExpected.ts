"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createPersistentStore } from "@site/lib/store";
import { storageKey } from "@site/lib/storageKey";

/** Which items of the "Expected at the exam" page the student already knows. */
interface ExpectedState {
  known: string[];
  hideKnown: boolean;
}

const fallback: ExpectedState = { known: [], hideKnown: false };

const store = createPersistentStore<ExpectedState>(storageKey("expected:v1"), fallback, (raw) => {
  if (!raw || typeof raw !== "object") return null;
  const source = raw as Partial<ExpectedState>;
  return {
    known: Array.isArray(source.known) ? source.known.filter((key): key is string => typeof key === "string") : [],
    hideKnown: source.hideKnown === true,
  };
});

export function useExpected() {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  const setKnown = useCallback((keys: string[], known: boolean) => {
    store.set((previous) => {
      const next = new Set(previous.known);
      for (const key of keys) {
        if (known) next.add(key);
        else next.delete(key);
      }
      return { ...previous, known: [...next] };
    });
  }, []);

  const setHideKnown = useCallback((hideKnown: boolean) => {
    store.set((previous) => ({ ...previous, hideKnown }));
  }, []);

  const reset = useCallback(() => store.set((previous) => ({ ...previous, known: [] })), []);

  return { state, setKnown, setHideKnown, reset };
}
