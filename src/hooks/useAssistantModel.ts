"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_ASSISTANT_MODEL, type AssistantModelId } from "@/lib/assistant/gemini";
import { readAssistantModel, subscribeToAssistantModel } from "@/lib/assistant/modelPreference";

export function useAssistantModel() {
  return useSyncExternalStore<AssistantModelId>(
    subscribeToAssistantModel,
    readAssistantModel,
    () => DEFAULT_ASSISTANT_MODEL,
  );
}
