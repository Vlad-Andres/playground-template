import type { Metadata } from "next";
import { LectureAssistant } from "@/components/assistant/LectureAssistant";
import { LectureHeader } from "@/components/lecture/LectureHeader";
import { LectureSectionView } from "@/components/lecture/LectureSectionView";
import { LectureToc } from "@/components/lecture/LectureToc";
import { examTraining } from "@/content/exam";
import { lectureToContext } from "@/lib/assistant/lectureContext";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Exam Training" };

export default function ExamPage() {
  if (!examTraining) notFound();
  const exam = examTraining;
  const sectionTitles = Object.fromEntries(exam.sections.map((section) => [section.id, section.title]));

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-10 pb-24 sm:px-6 sm:pt-14">
      <LectureHeader meta={exam.meta} badge="Final test" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
        <aside className="lg:col-start-2 lg:row-start-1 lg:sticky lg:top-24">
          <LectureToc meta={exam.meta} progressLabel="Exam training progress" />
        </aside>

        <article data-assistant-scope className="grid gap-14 lg:col-start-1 lg:row-start-1">
          {exam.sections.map((section) => (
            <LectureSectionView key={section.id} lecture={exam} section={section} />
          ))}
        </article>
      </div>

      <LectureAssistant
        slug={exam.meta.slug}
        label="Exam training"
        context={lectureToContext(exam)}
        sectionTitles={sectionTitles}
      />
    </div>
  );
}
