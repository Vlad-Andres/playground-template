"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Content } from "@google/genai";
import { AssistantError, streamReply, type AssistantErrorKind, type AssistantModelId } from "@/lib/assistant/gemini";
import { readApiKey } from "@/lib/assistant/credentials";
import { readAssistantModel } from "@/lib/assistant/modelPreference";
import { buildSystem, formatQuestion, type AssistantSelection } from "@/lib/assistant/prompt";

export type TurnStatus = "thinking" | "streaming" | "done" | "truncated" | "stopped" | "error";

export interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  text: string;
  selection?: AssistantSelection;
  status?: TurnStatus;
  model?: AssistantModelId;
  error?: string;
  errorKind?: AssistantErrorKind;
  errorDetails?: string;
}

const conversations = new Map<string, ChatTurn[]>();

function toContents(turns: ChatTurn[]): Content[] {
  return turns.flatMap<Content>((turn) => {
    if (turn.role === "user") {
      return [{ role: "user", parts: [{ text: formatQuestion(turn.text, turn.selection) }] }];
    }
    const text = turn.text.trim();
    return text && turn.status !== "error" ? [{ role: "model", parts: [{ text }] }] : [];
  });
}

export function useAssistantChat(slug: string, lectureContext: string) {
  const [turns, setTurns] = useState<ChatTurn[]>(() => conversations.get(slug) ?? []);
  const controller = useRef<AbortController | null>(null);
  const system = useMemo(() => buildSystem(lectureContext), [lectureContext]);

  useEffect(() => {
    conversations.set(slug, turns);
  }, [slug, turns]);

  useEffect(() => {
    const active = controller;
    return () => active.current?.abort();
  }, []);

  const busy = turns.some((turn) => turn.status === "thinking" || turn.status === "streaming");

  const updateTurn = useCallback((id: string, patch: Partial<ChatTurn>) => {
    setTurns((previous) => previous.map((turn) => (turn.id === id ? { ...turn, ...patch } : turn)));
  }, []);

  const send = useCallback(
    async (question: string, selection?: AssistantSelection) => {
      const apiKey = readApiKey();
      if (!apiKey || busy) return;

      const model = readAssistantModel();
      const userTurn: ChatTurn = { id: crypto.randomUUID(), role: "user", text: question, selection };
      const assistantTurn: ChatTurn = { id: crypto.randomUUID(), role: "assistant", text: "", status: "thinking", model };
      const history = [...turns, userTurn];
      setTurns([...history, assistantTurn]);

      const request = new AbortController();
      controller.current = request;

      try {
        const reply = await streamReply({
          apiKey,
          model,
          system,
          contents: toContents(history),
          signal: request.signal,
          onText: (text) => updateTurn(assistantTurn.id, { text, status: "streaming" }),
        });
        updateTurn(assistantTurn.id, { text: reply.text, status: reply.truncated ? "truncated" : "done" });
      } catch (error) {
        const failure =
          error instanceof AssistantError ? error : new AssistantError("other", "Something went wrong.");
        updateTurn(
          assistantTurn.id,
          failure.kind === "aborted"
            ? { status: "stopped" }
            : { status: "error", error: failure.message, errorKind: failure.kind, errorDetails: failure.diagnostics },
        );
      } finally {
        if (controller.current === request) controller.current = null;
      }
    },
    [busy, turns, system, updateTurn],
  );

  const stop = useCallback(() => controller.current?.abort(), []);

  const reset = useCallback(() => {
    controller.current?.abort();
    setTurns([]);
  }, []);

  return { turns, busy, send, stop, reset };
}
