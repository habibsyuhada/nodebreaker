import { useRef, useState } from "react";
import { playClueDuplicate, playClueSaved } from "../audio/synth";
import type { ClueType } from "../engine/clueSystem";
import { parseHoldableContent } from "../engine/clueSystem";
import { useGameStore } from "../store/gameStore";

export const HOLD_MS = 550;

type FeedbackState = "idle" | "holding" | "saved" | "duplicate";

interface HoldSpanProps {
  type: ClueType;
  value: string;
  label: string;
  source: string;
}

function HoldSpan({ type, value, label, source }: HoldSpanProps) {
  const saveClue = useGameStore((s) => s.saveClue);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const timerRef = useRef<number | null>(null);

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function start() {
    clearTimer();
    setFeedback("holding");
    timerRef.current = window.setTimeout(() => {
      const added = saveClue({ type, value, label, source });
      navigator.vibrate?.(added ? [20] : [10, 30, 10]);
      if (added) playClueSaved();
      else playClueDuplicate();
      setFeedback(added ? "saved" : "duplicate");
      window.setTimeout(() => setFeedback("idle"), 700);
    }, HOLD_MS);
  }

  function cancel() {
    clearTimer();
    setFeedback((f) => (f === "holding" ? "idle" : f));
  }

  return (
    <span
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
      className={`holdable relative inline-block rounded px-0.5 underline decoration-dotted underline-offset-2 ${
        feedback === "saved"
          ? "bg-accent-dim text-accent"
          : feedback === "duplicate"
            ? "bg-warn-dim text-warn"
            : "text-text-bright"
      }`}
      style={{
        backgroundImage:
          feedback === "holding"
            ? "linear-gradient(var(--color-accent-dim), var(--color-accent-dim))"
            : undefined,
        backgroundRepeat: "no-repeat",
        backgroundSize: feedback === "holding" ? "100% 100%" : "0% 100%",
        transition:
          feedback === "holding"
            ? `background-size ${HOLD_MS}ms linear`
            : "background-size 120ms ease-out",
      }}
    >
      {value}
    </span>
  );
}

interface HoldableTextProps {
  content: string;
  source: string;
}

/** Renders content that may embed [[type:value|label]] clue markup as tap-hold-to-save spans. */
export function HoldableText({ content, source }: HoldableTextProps) {
  const segments = parseHoldableContent(content);
  return (
    <>
      {segments.map((seg, i) =>
        seg.kind === "text" ? (
          <span key={i}>{seg.text}</span>
        ) : (
          <HoldSpan key={i} type={seg.type} value={seg.value} label={seg.label} source={source} />
        ),
      )}
    </>
  );
}
