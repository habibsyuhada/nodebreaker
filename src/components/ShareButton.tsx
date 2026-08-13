import { useState } from "react";
import { buildShareText } from "../engine/shareText";
import type { RunResult } from "../engine/runMetrics";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import type { LevelDef } from "../levels/types";
import { useGameStore } from "../store/gameStore";

/**
 * Last-resort copy path for a browser with neither the Web Share API nor the async Clipboard API
 * (some older in-app webviews). `execCommand` is deprecated but still the only way to trigger a
 * copy from a synchronous user gesture in that situation — a temporary off-screen textarea is
 * selected and copied, then removed immediately.
 */
function tryLegacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  document.body.removeChild(textarea);
  return copied;
}

type ShareState = "idle" | "copied" | "manual";

/**
 * Degrades through four tiers, each only attempted if the one before it isn't available or fails:
 * native share sheet → async clipboard → legacy execCommand copy → a visible block the player
 * copies by hand. The button itself never errors or goes dead — worst case it just shows text to
 * select, same as the game's find affordance for anything else offline-first.
 */
export function ShareButton({ level, result }: { level: LevelDef; result: RunResult }) {
  const t = useT();
  const lang = useGameStore((s) => s.lang);
  const [state, setState] = useState<ShareState>("idle");

  const text = buildShareText(level, result, lang);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (err) {
        // AbortError = the player dismissed the native share sheet — not a failure, just stop
        // rather than falling through to a clipboard copy they didn't ask for.
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setState("copied");
        window.setTimeout(() => setState("idle"), 2000);
        return;
      } catch {
        // Permission denied or unavailable — keep falling through.
      }
    }

    if (tryLegacyCopy(text)) {
      setState("copied");
      window.setTimeout(() => setState("idle"), 2000);
      return;
    }

    setState("manual");
  }

  if (state === "manual") {
    return (
      <div className="flex w-full max-w-xs flex-col gap-2">
        <textarea
          readOnly
          value={text}
          onFocus={(e) => e.currentTarget.select()}
          rows={5}
          className="w-full select-text rounded border border-border bg-panel-alt p-2 text-[10px] text-text"
        />
        <p className="text-[10px] text-text-dim">{t(UI.shareManualHint)}</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      className="min-h-[44px] rounded border border-border px-4 text-xs font-medium tracking-wide text-text-dim active:bg-panel-alt"
    >
      {state === "copied" ? t(UI.shareCopied) : t(UI.shareResult)}
    </button>
  );
}
