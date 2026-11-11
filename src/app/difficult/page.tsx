import type { Metadata } from "next";
import { staticSite } from "@site/content/static";
import { DifficultScreen } from "@site/screens/DifficultScreen";

export const metadata: Metadata = {
  title: "Difficult parts",
  description: "Review the parts of the lectures you flagged as difficult, with concept maps, fill-in-the-gaps, flashcards and spaced repetition.",
};

export default function DifficultPage() {
  return <DifficultScreen data={staticSite} />;
}
