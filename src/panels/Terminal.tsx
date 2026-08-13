import { useEffect, useRef, useState } from "react";
import { playTypeTick } from "../audio/synth";
import { HoldableText } from "../components/HoldableText";
import { stripHoldMarkup } from "../engine/clueSystem";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { type TerminalTone, useGameStore } from "../store/gameStore";

const TONE_CLASS: Record<TerminalTone, string> = {
  input: "text-text-bright",
  output: "text-text",
  success: "text-accent",
  warn: "text-warn",
  system: "text-text-dim",
};

const TYPE_MS_PER_CHAR = 12;
const LINE_PAUSE_MS = 90;

export function Terminal() {
  const lines = useGameStore((s) => s.terminalLines);
  const revealCount = useGameStore((s) => s.terminalRevealCount);
  const setRevealCount = useGameStore((s) => s.setTerminalRevealCount);
  const reducedMotion = usePrefersReducedMotion();

  const [charIndex, setCharIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      setRevealCount(lines.length);
      return;
    }
    if (revealCount >= lines.length) return;

    const currentPlain = stripHoldMarkup(lines[revealCount].text);
    if (charIndex >= currentPlain.length) {
      const t = setTimeout(() => {
        setRevealCount(revealCount + 1);
        setCharIndex(0);
      }, LINE_PAUSE_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      if (charIndex % 2 === 0) playTypeTick();
      setCharIndex((c) => c + 1);
    }, TYPE_MS_PER_CHAR);
    return () => clearTimeout(t);
  }, [lines, revealCount, charIndex, reducedMotion, setRevealCount]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, revealCount, charIndex]);

  function skip() {
    setRevealCount(lines.length);
    setCharIndex(0);
  }

  return (
    <div
      ref={scrollRef}
      onClick={skip}
      className="h-full overflow-y-auto p-3 text-xs leading-relaxed"
    >
      {lines.map((line, i) => {
        if (i > revealCount) return null;
        const plain = stripHoldMarkup(line.text);
        const isTyping = i === revealCount && charIndex < plain.length;
        return (
          <p key={line.id} className={`whitespace-pre-wrap ${TONE_CLASS[line.tone]}`}>
            {isTyping ? (
              plain.slice(0, charIndex)
            ) : (
              <HoldableText content={line.text} source="terminal" />
            )}
            {isTyping && <span className="cursor-blink">_</span>}
          </p>
        );
      })}
      {revealCount >= lines.length && (
        <p className="text-accent">
          $<span className="cursor-blink">_</span>
        </p>
      )}
    </div>
  );
}
