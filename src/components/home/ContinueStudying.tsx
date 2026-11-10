"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import type { LectureMeta } from "@/content/types";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useProgress } from "@/hooks/useProgress";
import { lectureStats } from "@/lib/progress";
import { lecturePath } from "@/lib/format";

interface ContinueStudyingProps {
  metas: LectureMeta[];
}

export function ContinueStudying({ metas }: ContinueStudyingProps) {
  const { progress } = useProgress();

  const inProgress = metas.find((meta) => {
    const stats = lectureStats(progress, meta);
    return stats.started && !stats.completed;
  });
  const target = inProgress ?? metas.find((meta) => !lectureStats(progress, meta).completed) ?? metas[0];

  if (!target) return null;

  const stats = lectureStats(progress, target);
  const nextSection = target.outline.find((section) => !progress[target.slug]?.sections.includes(section.id));

  return (
    <Card className="grid content-start gap-4 border-brand/30 bg-brand-soft/40 p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-brand-strong">
        <GraduationCap size={16} aria-hidden />
        {stats.started ? "Continue studying" : "Start here"}
      </p>

      <div className="grid gap-1">
        <h2 className="text-lg font-semibold text-ink">
          Lecture {target.number} — {target.title}
        </h2>
        <p className="text-sm text-muted">
          {nextSection ? `Next up: ${nextSection.title}` : "Every section is marked as read."}
        </p>
      </div>

      <ProgressBar value={stats.ratio} label={`Lecture ${target.number} progress`} />
      <p className="text-xs text-faint">
        {stats.completedSections} of {stats.totalSections} sections ·{" "}
        {stats.quizTotal > 0 ? `quiz best ${stats.quizBest}/${stats.quizTotal}` : "quiz not attempted"}
      </p>

      <Link
        href={nextSection ? `${lecturePath(target.slug)}#${nextSection.id}` : lecturePath(target.slug)}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-ink transition-opacity hover:opacity-90"
      >
        {stats.started ? "Resume" : "Open lecture"}
        <ArrowRight size={15} aria-hidden />
      </Link>
    </Card>
  );
}
