import type { Metadata } from "next";
import { ExpectedBoard } from "@/components/expected/ExpectedBoard";

export const metadata: Metadata = {
  title: "Expected at the exam",
  description: "Everything the course says you are expected to know for the exam, lecture by lecture, in concise form — with what you already know hidden.",
};

export default function ExpectedPage() {
  return <ExpectedBoard />;
}
