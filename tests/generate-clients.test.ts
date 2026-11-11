import { describe, expect, it, vi } from "vitest";
import { openAiCompatibleClient } from "../scripts/generate/clients";

describe("openAiCompatibleClient", () => {
  it("posts a JSON-mode chat request and maps usage", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ choices: [{ message: { content: '{"a":1}' } }], usage: { prompt_tokens: 7, completion_tokens: 3 } })));
    const client = openAiCompatibleClient({ baseUrl: "https://example.test/v1/", apiKey: "secret-key", model: "m" }, fetchMock as unknown as typeof fetch);
    const reply = await client.complete({ system: "s", user: "u", maxOutputTokens: 100 });
    expect(reply).toEqual({ text: '{"a":1}', inputTokens: 7, outputTokens: 3 });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://example.test/v1/chat/completions");
    expect(JSON.parse(String(init.body))).toMatchObject({ response_format: { type: "json_object" }, max_tokens: 100 });
  });
  it("reports an HTTP error without the body or the key", async () => {
    const fetchMock = vi.fn(async () => new Response("invalid key secret-key", { status: 401 }));
    const client = openAiCompatibleClient({ baseUrl: "https://example.test/v1", apiKey: "secret-key", model: "m" }, fetchMock as unknown as typeof fetch);
    const error = await client.complete({ system: "s", user: "u", maxOutputTokens: 1 }).catch((caught: Error) => caught);
    expect(String(error)).toContain("HTTP 401");
    expect(String(error)).not.toContain("secret-key");
  });
});
