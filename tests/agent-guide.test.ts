import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("agent guide", () => {
  const guide = fs.readFileSync("AGENTS.md", "utf8");
  const lecture = fs.readFileSync("docs/agent/04-write-lecture.md", "utf8");

  it("keeps the no-HTML rule and names the one sandboxed exception", () => {
    expect(guide).toContain("not executable code or raw HTML");
    expect(guide).toContain("scanCustomHtml");
  });

  it("explains custom exercises in the lecture-writing step", () => {
    expect(lecture).toContain("## Custom exercises");
    expect(lecture).toContain("scanCustomHtml");
  });
});
