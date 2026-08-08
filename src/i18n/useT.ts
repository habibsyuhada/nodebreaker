import { useGameStore } from "../store/gameStore";
import type { LocalizedText } from "./index";
import { t } from "./index";

/** Bound translator for the current UI language — components call t(SOME_STRING) directly. */
export function useT() {
  const lang = useGameStore((s) => s.lang);
  return (text: LocalizedText) => t(text, lang);
}
