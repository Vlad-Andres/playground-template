import { describe, expect, it } from "vitest";
import { Budget, BudgetExceeded, extractJson, fakeModel, withBudget } from "@core/generate/index";

describe("extractJson", () => {
  it("parses plain JSON", () => expect(extractJson('{"a":1}')).toEqual({ a: 1 }));
  it("strips code fences", () => expect(extractJson('```json\n{"a":[1,2]}\n```')).toEqual({ a: [1, 2] }));
  it("ignores a sentence before and after", () => expect(extractJson('Here is the lecture:\n{"a":{"b":"}"}}\nHope this helps!')).toEqual({ a: { b: "}" } }));
  it("handles a top-level array", () => expect(extractJson("Result: [1, 2]")).toEqual([1, 2]));
  it("throws on garbage", () => {
    expect(() => extractJson("no json here")).toThrow("not JSON");
    expect(() => extractJson("{broken: ")).toThrow("not JSON");
  });
});

describe("Budget", () => {
  const reply = (input: number, output: number) => ({ text: "{}", inputTokens: input, outputTokens: output });
  it("adds usage", () => {
    const budget = new Budget({ inputTokens: 100, outputTokens: 50 });
    budget.add(reply(10, 5));
    budget.add(reply(10, 5));
    expect(budget.used).toEqual({ inputTokens: 20, outputTokens: 10, calls: 2 });
  });
  it("throws on the call that crosses a limit", () => {
    const budget = new Budget({ inputTokens: 100, outputTokens: 50 });
    budget.add(reply(90, 10));
    expect(() => budget.add(reply(20, 1))).toThrow(BudgetExceeded);
  });
  it("withBudget counts every call and refuses once exhausted", async () => {
    const budget = new Budget({ inputTokens: 1000, outputTokens: 10 });
    const model = withBudget(fakeModel(() => '{"ok":true}'), budget);
    await model.complete({ system: "s", user: "u", maxOutputTokens: 5 });
    expect(budget.used.calls).toBe(1);
    expect(budget.used.outputTokens).toBeGreaterThan(0);
    await expect(async () => {
      for (let i = 0; i < 20; i += 1) await model.complete({ system: "s", user: "u", maxOutputTokens: 5 });
    }).rejects.toThrow(BudgetExceeded);
  });
});

describe("fakeModel", () => {
  it("answers from the function and estimates tokens", async () => {
    const reply = await fakeModel((request) => `{"echo":${JSON.stringify(request.user)}}`).complete({ system: "sys", user: "hello", maxOutputTokens: 10 });
    expect(JSON.parse(reply.text)).toEqual({ echo: "hello" });
    expect(reply.inputTokens).toBeGreaterThan(0);
  });
});
