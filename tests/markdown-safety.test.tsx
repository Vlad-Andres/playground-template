import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Markdown } from "@/components/content/Markdown";

describe("Markdown safety", () => {
  it("does not render raw HTML from content", () => {
    const html = renderToStaticMarkup(<Markdown>{"<script>alert('xss')</script><b>text</b>"}</Markdown>);

    expect(html).not.toContain("<script");
    expect(html).not.toContain("<b>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("does not create links for javascript URLs", () => {
    const html = renderToStaticMarkup(<Markdown>{"[run](javascript:alert('xss'))"}</Markdown>);

    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<a");
    expect(html).toContain("run");
  });

  it("does not treat a protocol-relative URL as a local link", () => {
    const html = renderToStaticMarkup(<Markdown>{"[go](//evil.example/track)"}</Markdown>);

    expect(html).not.toContain("evil.example");
    expect(html).not.toContain("<a");
    expect(html).toContain("go");
  });

  it("does not load remote images from content", () => {
    const html = renderToStaticMarkup(<Markdown>{"![pixel](https://evil.example/track.png)"}</Markdown>);

    expect(html).not.toContain("evil.example");
    expect(html).not.toContain("<img");
  });

  it("does not load protocol-relative images from content", () => {
    const html = renderToStaticMarkup(<Markdown>{"![pixel](//evil.example/track.png)"}</Markdown>);

    expect(html).not.toContain("evil.example");
    expect(html).not.toContain("<img");
  });
});
