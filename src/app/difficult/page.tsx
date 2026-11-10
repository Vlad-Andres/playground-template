import type { Metadata } from "next";
import { DifficultHub } from "@/components/difficult/DifficultHub";

export const metadata: Metadata = {
  title: "Difficult parts",
  description: "Review the parts of the lectures you flagged as difficult, with concept maps, fill-in-the-gaps, flashcards and spaced repetition.",
};

export default function DifficultPage() {
  return <DifficultHub />;
}
