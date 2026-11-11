import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  acceptSandboxMessage,
  clampHeight,
  parseSandboxMessage,
  wrapCustomHtml,
} from "@core/sandbox";
import { CustomFrame } from "@/components/content/CustomFrame";

const CSP_FIRST = /^<!doctype html>\s*<html>\s*<head>\s*<meta http-equiv="Content-Security-Policy"/;

describe("wrapCustomHtml", () => {
  it("puts the CSP meta first in <head> and forbids connections", () => {
    const html = wrapCustomHtml("<p>Hello</p>");
    expect(html).toMatch(CSP_FIRST);
    expect(html).toContain("connect-src 'none'");
  });

  it("places the model HTML after the bootstrap bridge", () => {
    const html = wrapCustomHtml("<p>Hello</p>");
    expect(html.indexOf("window.pg")).toBeGreaterThan(-1);
    expect(html.indexOf("<p>Hello</p>")).toBeGreaterThan(html.indexOf("window.pg"));
  });

  it("keeps the CSP meta first even when the model tries to close or reopen <head>", () => {
    const html = wrapCustomHtml("</head><head><meta http-equiv=\"refresh\" content=\"0\">");
    expect(html).toMatch(CSP_FIRST);
    expect(html.indexOf('http-equiv="Content-Security-Policy"')).toBeLessThan(
      html.indexOf('http-equiv="refresh"'),
    );
  });

  it("allows the script origins it is given", () => {
    const html = wrapCustomHtml("<p>Hello</p>", { scriptOrigins: ["https://cdn.example"] });
    expect(html).toContain("script-src 'unsafe-inline' https://cdn.example");
  });
});

describe("parseSandboxMessage", () => {
  it("accepts the four shapes", () => {
    expect(parseSandboxMessage({ pg: "ready" })).toEqual({ pg: "ready" });
    expect(parseSandboxMessage({ pg: "height", value: 400 })).toEqual({ pg: "height", value: 400 });
    expect(parseSandboxMessage({ pg: "error", message: "Boom" })).toEqual({ pg: "error", message: "Boom" });
    expect(parseSandboxMessage({ pg: "done" })).toEqual({ pg: "done" });
    expect(parseSandboxMessage({ pg: "done", score: 3 })).toEqual({ pg: "done", score: 3 });
  });

  it("accepts a huge height, because clamping happens later", () => {
    expect(parseSandboxMessage({ pg: "height", value: 1e9 })).toEqual({ pg: "height", value: 1e9 });
  });

  it.each([
    ["a string", "ready"],
    ["null", null],
    ["an array", [{ pg: "ready" }]],
    ["an unknown kind", { pg: "later" }],
    ["an extra key", { pg: "ready", extra: true }],
    ["a missing key", { pg: "height" }],
    ["a wrong type", { pg: "height", value: "400" }],
    ["a non-finite height", { pg: "height", value: Number.POSITIVE_INFINITY }],
    ["a wrong error", { pg: "error", message: 1 }],
    ["a wrong score", { pg: "done", score: "3" }],
  ])("rejects %s", (_label, data) => {
    expect(parseSandboxMessage(data)).toBeNull();
  });
});

describe("acceptSandboxMessage", () => {
  it("ignores a message from another window", () => {
    const frame = {};
    expect(acceptSandboxMessage({}, frame, { pg: "ready" })).toBeNull();
    expect(acceptSandboxMessage(frame, frame, { pg: "ready" })).toEqual({ pg: "ready" });
    expect(acceptSandboxMessage(frame, null, { pg: "ready" })).toBeNull();
  });
});

describe("clampHeight", () => {
  it("keeps heights inside 200..900", () => {
    expect(clampHeight(10)).toBe(200);
    expect(clampHeight(1e9)).toBe(900);
    expect(clampHeight(432.6)).toBe(433);
    expect(clampHeight(Number.NaN)).toBe(360);
  });
});

describe("CustomFrame", () => {
  it("renders a scripts-only sandbox without same-origin access", () => {
    const html = renderToStaticMarkup(
      <CustomFrame title="Counter" description="Press the button." html="<button>0</button>" />,
    );
    expect(html).toContain('sandbox="allow-scripts"');
    expect(html).not.toContain("allow-same-origin");
    expect(html).toContain("Content-Security-Policy");
    expect(html).toContain("Press the button.");
  });
});
