import { useState } from "react";
import type { MouseEvent } from "react";
import { playClueDuplicate, playClueSaved } from "../audio/synth";
import type { ClueType } from "../engine/clueSystem";
import { parseHoldableContent } from "../engine/clueSystem";
import { useGameStore } from "../store/gameStore";

/** Still used by FileBrowser's separate tap-vs-tap-hold row gesture (open vs inspect metadata) — unrelated to clue saving below. */
export const HOLD_MS = 550;

type FeedbackState = "idle" | "saved" | "duplicate";

interface TapSpanProps {
  type: ClueType;
  value: string;
  label: string;
  source: string;
}

function TapSpan({ type, value, label, source }: TapSpanProps) {
  const saveClue = useGameStore((s) => s.saveClue);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");

  function tap(e: MouseEvent) {
    e.stopPropagation();
    const added = saveClue({ type, value, label, source });
    navigator.vibrate?.(added ? [20] : [10, 30, 10]);
    if (added) playClueSaved();
    else playClueDuplicate();
    setFeedback(added ? "saved" : "duplicate");
    window.setTimeout(() => setFeedback("idle"), 700);
  }

  return (
    <span
      onClick={tap}
      onContextMenu={(e) => e.preventDefault()}
      className={`holdable inline-block rounded px-0.5 underline decoration-dotted underline-offset-2 active:opacity-70 ${
        feedback === "saved"
          ? "bg-accent-dim text-accent"
          : feedback === "duplicate"
            ? "bg-warn-dim text-warn"
            : "text-text-bright"
      }`}
    >
      {value}
    </span>
  );
}

interface HoldableTextProps {
  content: string;
  source: string;
}

/** Renders content that may embed [[type:value|label]] clue markup as tap-to-save spans. */
export function HoldableText({ content, source }: HoldableTextProps) {
  const segments = parseHoldableContent(content);
  return (
    <>
      {segments.map((seg, i) =>
        seg.kind === "text" ? (
          <span key={i}>{seg.text}</span>
        ) : (
          <TapSpan key={i} type={seg.type} value={seg.value} label={seg.label} source={source} />
        ),
      )}
    </>
  );
}
