"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Flag, GraduationCap, Menu, Search, Target, X } from "lucide-react";
import type { LectureMeta } from "@/content/types";
import type { SearchRecord } from "@/lib/search";
import { SearchDialog } from "@/components/layout/SearchDialog";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { DIFFICULT_PATH, EXAM_PATH, EXPECTED_PATH, lecturePath } from "@/lib/format";
import { useDifficult } from "@/hooks/useDifficult";
import { cn } from "@/lib/cn";
import { course } from "@/content/course";
import { examTraining } from "@/content/exam";
import { expectedTopics } from "@/content/expected";

interface SiteHeaderProps {
  metas: LectureMeta[];
  records: SearchRecord[];
}

export function SiteHeader({ metas, records }: SiteHeaderProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lecturesOpen, setLecturesOpen] = useState(false);
  const lecturesRef = useRef<HTMLDivElement>(null);
  const { state: difficult } = useDifficult();
  const difficultCount = Object.keys(difficult.items).length;
  const hasExam = examTraining !== null;
  const hasExpected = expectedTopics.length > 0;

  const closeMenus = useCallback(() => {
    setMenuOpen(false);
    setLecturesOpen(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!lecturesRef.current?.contains(event.target as Node)) setLecturesOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" onClick={closeMenus} className="flex items-center gap-2.5 font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-sm text-brand-ink">
            {course.shortTitle.slice(0, 3).toUpperCase()}
          </span>
          <span className="hidden sm:inline">Study Playground</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {hasExam ? <Link
            href="/"
            onClick={closeMenus}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-sunken",
              pathname === "/" ? "text-brand" : "text-muted",
            )}
          >
            Overview
          </Link> : null}

          <div className="relative" ref={lecturesRef}>
            <button
              type="button"
              onClick={() => setLecturesOpen((open) => !open)}
              aria-expanded={lecturesOpen}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-sunken",
                pathname.startsWith("/lectures") ? "text-brand" : "text-muted",
              )}
            >
              Lectures
              <ChevronDown
                size={14}
                className={cn("transition-transform", lecturesOpen && "rotate-180")}
                aria-hidden
              />
            </button>

            {lecturesOpen ? (
              <div className="animate-rise absolute left-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-[var(--shadow-card)]">
                {metas.map((meta) => (
                  <Link
                    key={meta.slug}
                    href={lecturePath(meta.slug)}
                    onClick={closeMenus}
                    className="grid gap-0.5 rounded-lg px-3 py-2 hover:bg-brand-soft/50"
                  >
                    <span className="text-sm font-medium text-ink">
                      {meta.number}. {meta.title}
                    </span>
                    <span className="truncate text-xs text-faint">{meta.subtitle}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {hasExam ? <Link
            href={EXAM_PATH}
            onClick={closeMenus}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-sunken",
              pathname.startsWith("/exam") ? "text-brand" : "text-muted",
            )}
          >
            <GraduationCap size={15} aria-hidden />
            Exam training
          </Link> : null}

          {hasExpected ? <Link
            href={EXPECTED_PATH}
            onClick={closeMenus}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-sunken",
              pathname.startsWith("/expected") ? "text-brand" : "text-muted",
            )}
          >
            <Target size={15} aria-hidden />
            Expected
          </Link> : null}

          <Link
            href={DIFFICULT_PATH}
            onClick={closeMenus}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-sunken",
              pathname.startsWith("/difficult") ? "text-brand" : "text-muted",
            )}
          >
            <Flag size={15} aria-hidden />
            Difficult
            {difficultCount > 0 ? (
              <span className="rounded-full bg-warning-soft px-1.5 text-xs font-semibold text-warning tabular-nums">{difficultCount}</span>
            ) : null}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-2 text-sm text-faint transition-colors hover:border-brand/40 hover:text-brand sm:px-3"
          >
            <Search size={16} aria-hidden />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden rounded border border-line bg-sunken px-1.5 py-0.5 font-sans text-[10px] lg:inline">
              ⌘K
            </kbd>
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-muted md:hidden"
          >
            {menuOpen ? <X size={17} aria-hidden /> : <Menu size={17} aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="animate-rise border-t border-line bg-surface px-4 py-3 md:hidden">
          <Link
            href="/"
            onClick={closeMenus}
            className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-sunken"
          >
            Overview
          </Link>
          {hasExam ? <Link
            href={EXAM_PATH}
            onClick={closeMenus}
            className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-sunken"
          >
            Exam training
          </Link> : null}
          {hasExpected ? <Link
            href={EXPECTED_PATH}
            onClick={closeMenus}
            className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-sunken"
          >
            Expected at the exam
          </Link> : null}
          <Link
            href={DIFFICULT_PATH}
            onClick={closeMenus}
            className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-sunken"
          >
            Difficult parts{difficultCount > 0 ? ` (${difficultCount})` : ""}
          </Link>
          <p className="px-3 pb-1 pt-3 text-xs font-semibold tracking-wide text-faint uppercase">
            Lectures
          </p>
          {metas.map((meta) => (
            <Link
              key={meta.slug}
              href={lecturePath(meta.slug)}
              onClick={closeMenus}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-sunken"
            >
              {meta.number}. {meta.title}
            </Link>
          ))}
        </nav>
      ) : null}

      {searchOpen ? (
        <SearchDialog records={records} onClose={() => setSearchOpen(false)} />
      ) : null}
    </header>
  );
}
