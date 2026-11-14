import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DataTable } from "@/components/content/DataTable";
import { HighlightList } from "@/components/content/HighlightList";
import { InlineMarkdown } from "@/components/content/Markdown";

describe("maths in short text", () => {
  it("renders $…$ in table headers and cells", () => {
    const html = renderToStaticMarkup(
      <DataTable headers={["Momentum ($\\text{kg·m·s}^{-1}$)"]} rows={[["$0.10 \\times 0.99 = 0.099$"]]} />,
    );
    expect(html).toContain('class="katex"');
    expect(html).not.toContain("$0.10");
    expect(html).toContain('<span class="mbin">×</span>');
    expect(html).toContain("<table");
  });

  it("renders $…$ in list items", () => {
    const html = renderToStaticMarkup(<HighlightList variant="takeaways" items={["$E_K = \\frac{1}{2}mv^2$"]} />);
    expect(html).toContain('class="katex"');
  });

  it("keeps plain text plain and adds no paragraph", () => {
    const html = renderToStaticMarkup(<InlineMarkdown>{"Elastic **collision**"}</InlineMarkdown>);
    expect(html).not.toContain("<p");
    expect(html).toMatch(/<strong[^>]*>collision<\/strong>/);
  });

  it("does not render raw HTML", () => {
    const html = renderToStaticMarkup(<InlineMarkdown>{"<script>alert(1)</script>"}</InlineMarkdown>);
    expect(html).not.toContain("<script");
  });
});
