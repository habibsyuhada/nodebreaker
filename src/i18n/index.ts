export type Lang = "en" | "id";

/**
 * Best-guess language from the browser, used to seed a fresh save so a new player never has to
 * answer a language question before touching the game. Anything not explicitly Indonesian falls
 * back to English, matching the rest of the game's English-first defaults.
 */
export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  return navigator.language?.toLowerCase().startsWith("id") ? "id" : "en";
}

/** Either a plain string (same in every language) or a per-language map. */
export type LocalizedText = string | Partial<Record<Lang, string>>;

/** Resolves LocalizedText to a plain string for the given language, falling back to English, then to whatever's available. */
export function t(text: LocalizedText, lang: Lang): string {
  if (typeof text === "string") return text;
  return text[lang] ?? text.en ?? Object.values(text)[0] ?? "";
}

/** Substitutes {key} tokens in a resolved string, e.g. format("Clue saved: {label}", { label: "X" }). */
export function format(resolved: string, vars: Record<string, string>): string {
  return resolved.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}
