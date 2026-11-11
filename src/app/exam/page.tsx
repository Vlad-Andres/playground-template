import type { Metadata } from "next";
import { staticSite } from "@site/content/static";
import { ExamScreen } from "@site/screens/ExamScreen";

export const metadata: Metadata = { title: "Exam Training" };

export default function ExamPage() {
  return <ExamScreen data={staticSite} />;
}
