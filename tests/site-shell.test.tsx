import { renderToReadableStream } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// The real component renders nothing; a marker shows whether the shell mounted it.
vi.mock("next/navigation", () => ({ usePathname: () => "/courses/x-12345678/", useRouter: () => ({ push: () => undefined }), useSearchParams: () => new URLSearchParams() }));
vi.mock("@site/components/layout/ServiceWorkerRegistration", () => ({ ServiceWorkerRegistration: () => <i data-sw="on" /> }));

import { buildSiteData } from "@core/site";
import { SiteShell } from "@site/screens/SiteShell";
import { loadCourse } from "../scripts/content/load";

const loaded = loadCourse("examples/showcase");
if (!loaded.course) throw new Error("The showcase course did not load.");
const data = buildSiteData({ key: loaded.course.id, course: loaded.course, lectures: loaded.lectures.map((entry) => entry.data), exam: loaded.exam, expected: loaded.expected });

async function html(offline?: boolean) {
  const stream = await renderToReadableStream(<SiteShell data={data} base="/courses/x-12345678" {...(offline === undefined ? {} : { offline })}>body</SiteShell>);
  await stream.allReady;
  return new Response(stream).text();
}

describe("SiteShell offline support", () => {
  it("registers the service worker by default (the template's own static site)", async () => {
    expect(await html()).toContain('data-sw="on"');
  });

  it("skips it when a host serves many sites from one origin", async () => {
    expect(await html(false)).not.toContain('data-sw="on"');
  });
});
