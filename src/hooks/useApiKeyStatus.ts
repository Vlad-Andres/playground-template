"use client";

import { useSyncExternalStore } from "react";
import { apiKeyStatus, subscribeToApiKey, type KeyStatus } from "@site/lib/assistant/credentials";

export function useApiKeyStatus() {
  return useSyncExternalStore<KeyStatus>(subscribeToApiKey, apiKeyStatus, () => "none");
}
