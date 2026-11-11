import { describe, expect, it } from "vitest";
import { parseExpr } from "@core/expr";

function value(source: string, scope: Record<string, number> = {}): number {
  const parsed = parseExpr(source);
  if (!parsed.ok) throw new Error(parsed.error);
  return parsed.evaluate(scope);
}

describe("parseExpr", () => {
  it("evaluates a polynomial and lists its variables", () => {
    const parsed = parseExpr("2*x^2+1");
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.evaluate({ x: 3 })).toBe(19);
    expect(parsed.variables).toEqual(["x"]);
  });
  it("binds unary minus looser than power", () => expect(value("-2^2")).toBe(-4));
  it("is right-associative for power", () => expect(value("2^3^2")).toBe(512));
  it("calls functions with several arguments", () => expect(value("min(3, 1+1)")).toBe(2));
  it("knows pi, e and log10", () => {
    expect(value("pi")).toBeCloseTo(Math.PI);
    expect(value("ln(e)")).toBeCloseTo(1);
    expect(value("log(1000)")).toBeCloseTo(3);
  });
  it("handles decimals, exponents and precedence", () => {
    expect(value("1.5e2 / (2 + 1) - .5")).toBe(49.5);
    expect(value("a*b + c", { a: 2, b: 3, c: 4 })).toBe(10);
  });
  it("lists each variable once, constants excluded", () => {
    const parsed = parseExpr("k * x + k * pi");
    expect(parsed.ok && parsed.variables).toEqual(["k", "x"]);
  });
  it.each(["x.constructor", "x=>x", "a[0]", "1;2", "alert(1)", "", "1 +", "(1", "sqrt", "sqrt(1, 2)", "max()", "x y", "'a'", "`a`"])(
    "rejects %j",
    (source) => expect(parseExpr(source).ok).toBe(false),
  );
  it("rejects sources longer than 200 characters", () => {
    expect(parseExpr("1+".repeat(100) + "1").ok).toBe(false);
    expect(parseExpr("1".repeat(200)).ok).toBe(true);
  });
  it("treats an unknown variable as NaN instead of reaching prototypes", () => {
    expect(value("constructor")).toBeNaN();
    expect(value("toString + 1")).toBeNaN();
  });
});
