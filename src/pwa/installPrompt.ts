import { useSyncExternalStore } from "react";

/**
 * Not in the standard DOM lib — this event is a de facto standard (Chromium-family browsers)
 * rather than a formally specified one, hence the minimal hand-written shape instead of a
 * library type.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

/**
 * Registered once at module load (imported from main.tsx before the app renders) rather than
 * inside a component effect, because the browser can fire `beforeinstallprompt` before React has
 * mounted anything — missing that first event would mean no Install button for the whole session.
 */
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    installed = true;
    notify();
  });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): boolean {
  return deferredPrompt !== null && !installed;
}

/** True once the browser has offered an install prompt and the app isn't already installed. */
export function useInstallAvailable(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/** Shows the native install prompt. No-ops quietly if the browser never offered one. */
export async function promptInstall(): Promise<void> {
  if (!deferredPrompt) return;
  const prompt = deferredPrompt;
  deferredPrompt = null;
  notify();
  await prompt.prompt();
  await prompt.userChoice;
}
