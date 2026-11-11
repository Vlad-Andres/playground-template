import type { Metadata } from "next";
import { staticSite } from "@site/content/static";
import { findLecture } from "@site/content/lectures";
import { LectureScreen } from "@site/screens/LectureScreen";

interface LecturePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return staticSite.lectures.map((lecture) => ({ slug: lecture.meta.slug }));
}

export async function generateMetadata({ params }: LecturePageProps): Promise<Metadata> {
  const { slug } = await params;
  const lecture = findLecture(staticSite.lectures, slug);
  if (!lecture) return {};

  return {
    title: lecture.meta.title,
    description: lecture.meta.summary,
  };
}

export default async function LecturePage({ params }: LecturePageProps) {
  const { slug } = await params;
  return <LectureScreen data={staticSite} slug={slug} />;
}
