import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LectureAssistant } from "@/components/assistant/LectureAssistant";
import { LectureHeader } from "@/components/lecture/LectureHeader";
import { LectureNav } from "@/components/lecture/LectureNav";
import { LectureSectionView } from "@/components/lecture/LectureSectionView";
import { LectureToc } from "@/components/lecture/LectureToc";
import { allLectures, getLecture } from "@/content/lectures";
import { neighbourLectures } from "@/content/registry";
import { lectureToContext } from "@/lib/assistant/lectureContext";

interface LecturePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return allLectures().map((lecture) => ({ slug: lecture.meta.slug }));
}

export async function generateMetadata({ params }: LecturePageProps): Promise<Metadata> {
  const { slug } = await params;
  const lecture = getLecture(slug);
  if (!lecture) return {};

  return {
    title: lecture.meta.title,
    description: lecture.meta.summary,
  };
}

export default async function LecturePage({ params }: LecturePageProps) {
  const { slug } = await params;
  const lecture = getLecture(slug);
  if (!lecture) notFound();

  const { previous, next } = neighbourLectures(slug);
  const sectionTitles = Object.fromEntries(lecture.sections.map((section) => [section.id, section.title]));

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-10 pb-24 sm:px-6 sm:pt-14">
      <LectureHeader meta={lecture.meta} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
        <aside className="lg:col-start-2 lg:row-start-1 lg:sticky lg:top-24">
          <LectureToc meta={lecture.meta} />
        </aside>

        <article data-assistant-scope className="grid gap-14 lg:col-start-1 lg:row-start-1">
          {lecture.sections.map((section) => (
            <LectureSectionView key={section.id} lecture={lecture} section={section} />
          ))}
        </article>
      </div>

      <LectureNav previous={previous} next={next} />

      <LectureAssistant
        slug={lecture.meta.slug}
        label={`Lecture ${lecture.meta.number} · ${lecture.meta.title}`}
        context={lectureToContext(lecture)}
        sectionTitles={sectionTitles}
      />
    </div>
  );
}
