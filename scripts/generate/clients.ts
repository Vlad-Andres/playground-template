import { GoogleGenAI } from "@google/genai";
import type { ModelClient } from "../../core/generate/model";

/** Short, safe error text: never the provider's response body, never a key. */
function providerError(provider: string, status?: number): Error {
  return new Error(`${provider} request failed${status ? ` (HTTP ${status})` : ""}.`);
}

export function geminiClient(options: { apiKey: string; model: string }): ModelClient {
  const ai = new GoogleGenAI({ apiKey: options.apiKey });
  return {
    async complete(request) {
      let response;
      try {
        response = await ai.models.generateContent({
          model: options.model,
          contents: [{ role: "user", parts: [{ text: request.user }] }],
          config: {
            systemInstruction: request.system,
            responseMimeType: "application/json",
            temperature: 0.2,
            maxOutputTokens: request.maxOutputTokens,
          },
        });
      } catch (error) {
        const status = typeof error === "object" && error && "status" in error ? Number((error as { status: unknown }).status) : undefined;
        throw providerError("Gemini", Number.isFinite(status) ? status : undefined);
      }
      return {
        text: response.text ?? "",
        inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: (response.usageMetadata?.candidatesTokenCount ?? 0) + (response.usageMetadata?.thoughtsTokenCount ?? 0),
      };
    },
  };
}

export function openAiCompatibleClient(
  options: { baseUrl: string; apiKey: string; model: string },
  fetchImpl: typeof fetch = fetch,
): ModelClient {
  const url = `${options.baseUrl.replace(/\/+$/, "")}/chat/completions`;
  return {
    async complete(request) {
      let response: Response;
      try {
        response = await fetchImpl(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${options.apiKey}` },
          body: JSON.stringify({
            model: options.model,
            temperature: 0.2,
            max_tokens: request.maxOutputTokens,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: request.system },
              { role: "user", content: request.user },
            ],
          }),
        });
      } catch {
        throw providerError("Model");
      }
      if (!response.ok) throw providerError("Model", response.status);
      const body = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      return {
        text: body.choices?.[0]?.message?.content ?? "",
        inputTokens: body.usage?.prompt_tokens ?? 0,
        outputTokens: body.usage?.completion_tokens ?? 0,
      };
    },
  };
}
