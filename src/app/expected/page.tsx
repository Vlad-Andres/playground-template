import type { Metadata } from "next";
import { staticSite } from "@site/content/static";
import { ExpectedScreen } from "@site/screens/ExpectedScreen";

export const metadata: Metadata = {
  title: "Expected at the exam",
  description: "Everything the course says you are expected to know for the exam, lecture by lecture, in concise form — with what you already know hidden.",
};

export default function ExpectedPage() {
  return <ExpectedScreen data={staticSite} />;
}
