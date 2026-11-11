import type { Metadata } from "next";
import { ExpectedBoard } from "@site/components/expected/ExpectedBoard";
import { expectedTopics } from "@site/content/expected";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Expected at the exam",
  description: "Everything the course says you are expected to know for the exam, lecture by lecture, in concise form — with what you already know hidden.",
};

export default function ExpectedPage() {
  if (expectedTopics.length === 0) notFound();
  return <ExpectedBoard />;
}
