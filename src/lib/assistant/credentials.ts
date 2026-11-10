const STORAGE_KEY = "dis-playground:gemini-api-key";

export type KeyPersistence = "session" | "device";
export type KeyStatus = "none" | KeyPersistence;

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function safely<T>(read: () => T, fallback: T): T {
  try {
    return read();
  } catch {
    return fallback;
  }
}

export function readApiKey(): string | null {
  return safely(
    () => window.sessionStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(STORAGE_KEY),
    null,
  );
}

export function apiKeyStatus(): KeyStatus {
  return safely<KeyStatus>(() => {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return "session";
    if (window.localStorage.getItem(STORAGE_KEY)) return "device";
    return "none";
  }, "none");
}

export function storeApiKey(apiKey: string, persistence: KeyPersistence) {
  safely(() => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STORAGE_KEY);
    const storage = persistence === "device" ? window.localStorage : window.sessionStorage;
    storage.setItem(STORAGE_KEY, apiKey);
  }, undefined);
  emit();
}

export function clearApiKey() {
  safely(() => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STORAGE_KEY);
  }, undefined);
  emit();
}

export function subscribeToApiKey(listener: () => void) {
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
