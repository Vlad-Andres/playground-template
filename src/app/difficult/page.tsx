import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DifficultHub } from "@/components/difficult/DifficultHub";
import { features } from "@/content/course";

export const metadata: Metadata = {
  title: "Difficult parts",
  description: "Review the parts of the lectures you flagged as difficult, with concept maps, fill-in-the-gaps, flashcards and spaced repetition.",
};

export default function DifficultPage() {
  if (!features.difficult) notFound();
  return <DifficultHub />;
}
