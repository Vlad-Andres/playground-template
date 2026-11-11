import { examTraining } from "@site/content/exam";
import { allLectures } from "@site/content/lectures";
import type { Lecture } from "@site/content/types";
import { EXAM_PATH, lecturePath } from "@site/lib/format";
import { toReviewBlock, type ReviewData, type ReviewLecture } from "@site/lib/reviewData";

export const dynamic = "force-static";

function toReviewLecture(lecture: Lecture, href: string): ReviewLecture {
  return {
    slug: lecture.meta.slug,
    number: lecture.meta.number,
    title: lecture.meta.title,
    href,
    concepts: lecture.concepts,
    quiz: lecture.quiz,
    sections: lecture.sections.map((section) => ({
      id: section.id,
      title: section.title,
      blocks: section.blocks.map(toReviewBlock),
    })),
  };
}

export function GET() {
  if (!examTraining) return Response.json({ lectures: allLectures().map((lecture) => toReviewLecture(lecture, lecturePath(lecture.meta.slug))) });
  const data: ReviewData = {
    lectures: [
      ...allLectures().map((lecture) => toReviewLecture(lecture, lecturePath(lecture.meta.slug))),
      toReviewLecture(examTraining, EXAM_PATH),
    ],
  };
  return Response.json(data);
}
