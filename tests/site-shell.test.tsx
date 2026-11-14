import { renderToReadableStream } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// The real component renders nothing; a marker shows whether the shell mounted it.
vi.mock("next/navigation", () => ({ usePathname: () => "/courses/x-12345678/", useRouter: () => ({ push: () => undefined }), useSearchParams: () => new URLSearchParams() }));
vi.mock("@site/components/layout/ServiceWorkerRegistration", () => ({ ServiceWorkerRegistration: () => <i data-sw="on" /> }));

import { buildSiteData, DEFAULT_HOST, type SiteHost } from "@core/site";
import { SiteShell } from "@site/screens/SiteShell";
import { loadCourse } from "../scripts/content/load";

const loaded = loadCourse("examples/showcase");
if (!loaded.course) throw new Error("The showcase course did not load.");
const data = buildSiteData({ key: loaded.course.id, course: loaded.course, lectures: loaded.lectures.map((entry) => entry.data), exam: loaded.exam, expected: loaded.expected });

async function html(props: { base?: string; offline?: boolean; host?: SiteHost } = {}) {
  const { base = "", offline, host } = props;
  const stream = await renderToReadableStream(
    <SiteShell data={data} base={base} {...(offline === undefined ? {} : { offline })} {...(host ? { host } : {})}>
      body
    </SiteShell>,
  );
  await stream.allReady;
  return new Response(stream).text();
}

describe("SiteShell offline support", () => {
  it("registers the service worker for a standalone site (base is root)", async () => {
    expect(await html({ base: "" })).toContain('data-sw="on"');
  });

  it("skips registration when the site is served under a path", async () => {
    expect(await html({ base: "/courses/x-12345678" })).not.toContain('data-sw="on"');
  });

  it("skips registration when a host explicitly disables it", async () => {
    expect(await html({ base: "", offline: false })).not.toContain('data-sw="on"');
  });
});

describe("SiteShell host brand", () => {
  const portal: SiteHost = { brand: { name: "Study with AI", homeUrl: "https://example.test" } };

  it("keeps the standalone brand and no make-your-own link by default", async () => {
    const page = await html();
    expect(DEFAULT_HOST.brand.homeUrl).toBeNull();
    expect(page).toContain(DEFAULT_HOST.brand.name);
    expect(page).not.toContain("make your own");
  });

  it("shows the host brand and a plain make-your-own link", async () => {
    const page = await html({ base: "/courses/x-12345678", host: portal });
    expect(page).toContain("Study with AI");
    expect(page).not.toContain(DEFAULT_HOST.brand.name);
    expect(page).toContain('href="https://example.test?from=course"');
    expect(page).toMatch(/Made with Study with AI.*make your own/);
  });
});
