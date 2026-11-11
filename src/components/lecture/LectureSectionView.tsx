import type { Block, Lecture, LectureSection, SectionKind } from "@/content/types";
import { BlockRenderer } from "@/components/content/BlockRenderer";
import { QuizCard } from "@/components/content/QuizCard";
import { SectionCompleteToggle } from "@/components/lecture/SectionCompleteToggle";
import { DifficultBlock } from "@/components/difficult/DifficultBlock";
import { features } from "@/content/course";
import { DifficultSectionToggle } from "@/components/difficult/DifficultSectionToggle";

const KIND_LABEL: Record<SectionKind, string> = {
  objectives: "Objectives",
  intuition: "Big picture",
  concepts: "Core concepts",
  visual: "Visual explanation",
  playground: "Interactive playground",
  examples: "Worked examples",
  mistakes: "Common mistakes",
  quiz: "Check understanding",
  exercises: "Practice",
  summary: "Summary",
};

/** Block kinds that can be flagged one by one; lists of objectives and exercise sheets cannot. */
const FLAGGABLE = new Set<Block["kind"]>([
  "prose", "info", "concepts", "formula", "code", "table", "figure", "steps", "timeline", "recall", "practice", "widget",
]);

interface LectureSectionViewProps {
  lecture: Lecture;
  section: LectureSection;
}

export function LectureSectionView({ lecture, section }: LectureSectionViewProps) {
  return (
    <section id={section.id} className="grid scroll-mt-24 gap-6">
      <header className="flex items-end justify-between gap-3">
        <div className="grid gap-1">
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">
            {KIND_LABEL[section.kind]}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
        </div>
        {features.difficult && section.kind !== "objectives" ? (
          <DifficultSectionToggle lectureSlug={lecture.meta.slug} sectionId={section.id} />
        ) : null}
      </header>

      {section.blocks.map((block, index) =>
        features.difficult && FLAGGABLE.has(block.kind) ? (
          <DifficultBlock key={index} lectureSlug={lecture.meta.slug} sectionId={section.id} blockIndex={index}>
            <BlockRenderer block={block} concepts={lecture.concepts} />
          </DifficultBlock>
        ) : (
          <BlockRenderer key={index} block={block} concepts={lecture.concepts} />
        ),
      )}

      {section.kind === "quiz" ? (
        <QuizCard
          lectureSlug={lecture.meta.slug}
          sectionId={section.id}
          questions={lecture.quiz}
        />
      ) : null}

      <div className="flex justify-end border-t border-line pt-4">
        <SectionCompleteToggle lectureSlug={lecture.meta.slug} sectionId={section.id} />
      </div>
    </section>
  );
}
