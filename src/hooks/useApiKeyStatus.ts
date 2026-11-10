"use client";

import { useSyncExternalStore } from "react";
import { apiKeyStatus, subscribeToApiKey, type KeyStatus } from "@/lib/assistant/credentials";

export function useApiKeyStatus() {
  return useSyncExternalStore<KeyStatus>(subscribeToApiKey, apiKeyStatus, () => "none");
}
