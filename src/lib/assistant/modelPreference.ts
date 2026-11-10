import { ASSISTANT_MODELS, DEFAULT_ASSISTANT_MODEL, type AssistantModelId } from "@/lib/assistant/gemini";

const STORAGE_KEY = "dis-playground:gemini-model";

const listeners = new Set<() => void>();

const isAssistantModel = (value: string | null): value is AssistantModelId =>
  ASSISTANT_MODELS.some((model) => model.id === value);

export function readAssistantModel(): AssistantModelId {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isAssistantModel(stored) ? stored : DEFAULT_ASSISTANT_MODEL;
  } catch {
    return DEFAULT_ASSISTANT_MODEL;
  }
}

export function storeAssistantModel(model: AssistantModelId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, model);
  } catch {}
  for (const listener of listeners) listener();
}

export function subscribeToAssistantModel(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
