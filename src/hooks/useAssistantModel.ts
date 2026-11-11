"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_ASSISTANT_MODEL, type AssistantModelId } from "@site/lib/assistant/gemini";
import { readAssistantModel, subscribeToAssistantModel } from "@site/lib/assistant/modelPreference";

export function useAssistantModel() {
  return useSyncExternalStore<AssistantModelId>(
    subscribeToAssistantModel,
    readAssistantModel,
    () => DEFAULT_ASSISTANT_MODEL,
  );
}
