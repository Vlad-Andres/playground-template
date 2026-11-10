import type { Metadata } from "next";
import { LectureAssistant } from "@/components/assistant/LectureAssistant";
import { LectureHeader } from "@/components/lecture/LectureHeader";
import { LectureSectionView } from "@/components/lecture/LectureSectionView";
import { LectureToc } from "@/components/lecture/LectureToc";
import { examTraining } from "@/content/exam";
import { lectureToContext } from "@/lib/assistant/lectureContext";

export const metadata: Metadata = {
  title: examTraining.meta.title,
  description: examTraining.meta.summary,
};

export default function ExamPage() {
  const sectionTitles = Object.fromEntries(examTraining.sections.map((section) => [section.id, section.title]));

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-10 pb-24 sm:px-6 sm:pt-14">
      <LectureHeader meta={examTraining.meta} badge="Final test" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
        <aside className="lg:col-start-2 lg:row-start-1 lg:sticky lg:top-24">
          <LectureToc meta={examTraining.meta} progressLabel="Exam training progress" />
        </aside>

        <article data-assistant-scope className="grid gap-14 lg:col-start-1 lg:row-start-1">
          {examTraining.sections.map((section) => (
            <LectureSectionView key={section.id} lecture={examTraining} section={section} />
          ))}
        </article>
      </div>

      <LectureAssistant
        slug={examTraining.meta.slug}
        label="Exam training"
        context={lectureToContext(examTraining)}
        sectionTitles={sectionTitles}
      />
    </div>
  );
}
