import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DIS Study Playground",
    short_name: "DIS Study",
    description: "An interactive companion for the Data Intensive Systems course that also works offline.",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#0b0f19",
    theme_color: "#4f46e5",
    icons: [{ src: `${basePath}/favicon.ico`, sizes: "32x32", type: "image/x-icon" }],
  };
}
