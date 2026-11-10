"use client";

import { useCallback, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type ResolvedTheme } from "@/lib/theme";

type ThemeSnapshot = ResolvedTheme | "pending";

const listeners = new Set<() => void>();
let snapshot: ThemeSnapshot = "pending";
let hydrated = false;

function apply(theme: ResolvedTheme) {
  snapshot = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  for (const listener of listeners) listener();
}

function hydrate() {
  if (hydrated) return;
  hydrated = true;

  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    // Storage may be blocked; fall back to the system preference.
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  apply(stored === "dark" || stored === "light" ? stored : prefersDark ? "dark" : "light");
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  hydrate();
  return () => {
    listeners.delete(listener);
  };
}

export function useTheme() {
  const value = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => "pending" as ThemeSnapshot,
  );

  const setTheme = useCallback((next: ResolvedTheme) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Ignored: the theme still applies for the current session.
    }
    apply(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(snapshot === "dark" ? "light" : "dark");
  }, [setTheme]);

  return {
    theme: value === "pending" ? ("light" as ResolvedTheme) : value,
    mounted: value !== "pending",
    setTheme,
    toggleTheme,
  };
}
