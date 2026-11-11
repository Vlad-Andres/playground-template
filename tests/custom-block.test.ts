import { describe, expect, it } from "vitest";
import { CUSTOM_HTML_MAX, scanCustomHtml } from "@core/custom";
import { blockExamples } from "@core/examples";
import { validateBlock } from "@core/validate";

const clean = blockExamples.custom.example;

function custom(html: string) {
  return { kind: "custom", id: "probe", title: "Probe", description: "A probe.", html };
}

const violations: [string, string][] = [
  ["<script src=\"x.js\"></script>", "external source"],
  ["<link rel=\"stylesheet\" href=\"x.css\">", "<link>"],
  ["<iframe></iframe>", "Embedded documents"],
  ["<form></form>", "Forms"],
  ["<base href=\"/\">", "<base>"],
  ["<meta http-equiv=\"refresh\">", "http-equiv"],
  ["fetch('/x')", "fetch()"],
  ["new XMLHttpRequest()", "XMLHttpRequest"],
  ["new WebSocket('ws://x')", "WebSocket"],
  ["new EventSource('/x')", "EventSource"],
  ["navigator.sendBeacon('/x')", "sendBeacon()"],
  ["importScripts('/x.js')", "importScripts()"],
  ["import('/x.js')", "import()"],
  ["eval('1')", "eval()"],
  ["new Function('return 1')", "new Function"],
  ["document.cookie", "document.cookie"],
  ["localStorage.getItem('x')", "localStorage"],
  ["sessionStorage.getItem('x')", "sessionStorage"],
  ["indexedDB.open('x')", "indexedDB"],
  ["top.location = '/'", "top window"],
  ["parent.location = '/'", "parent window"],
  ["window.open('/x')", "window.open()"],
  ["<img src=\"https://example.com/x.png\">", "External URLs"],
  ["<a href=\"http://example.com\">x</a>", "External URLs"],
  ["<style>body { background: url(https://example.com/x.png); }</style>", "External URLs"],
];

describe("scanCustomHtml", () => {
  it("accepts the self-contained example", () => {
    expect(scanCustomHtml(clean.html)).toEqual([]);
  });

  it.each(violations)("rejects %s", (html, message) => {
    const problems = scanCustomHtml(html);
    expect(problems.length).toBeGreaterThan(0);
    expect(problems.every((problem) => problem.code === "E110")).toBe(true);
    expect(problems.some((problem) => problem.message.includes(message))).toBe(true);
  });

  it("reports one problem per matched rule, not one per occurrence", () => {
    const problems = scanCustomHtml("fetch('/a'); fetch('/b');");
    expect(problems).toHaveLength(1);
  });

  it("ignores plain text and safe markup", () => {
    expect(scanCustomHtml("<p>Cookies and top scores are fine.</p><a href=\"#more\">More</a>")).toEqual([]);
  });
});

describe("custom block validation", () => {
  it("accepts the catalogue example", () => {
    expect(validateBlock(clean)).toEqual([]);
  });

  it("scans the html through validateBlock", () => {
    const problems = validateBlock(custom("fetch('/x')"));
    expect(problems.map((problem) => problem.code)).toEqual(["E110"]);
    expect(problems[0].path).toBe("html");
  });

  it("rejects html over the size limit with E003", () => {
    const problems = validateBlock(custom("x".repeat(CUSTOM_HTML_MAX + 1)));
    expect(problems.map((problem) => problem.code)).toEqual(["E003"]);
  });

  it("rejects a height outside 200..900", () => {
    expect(validateBlock({ ...custom("<p>x</p>"), height: 100 })[0]?.code).toBe("E003");
    expect(validateBlock({ ...custom("<p>x</p>"), height: 901 })[0]?.code).toBe("E003");
  });
});
