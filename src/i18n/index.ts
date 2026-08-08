export type Lang = "en" | "id";

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
