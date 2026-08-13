import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import type { LocalizedText } from "../i18n";
import { useT } from "../i18n/useT";

const BOOT_LINES: LocalizedText[] = [
  { en: "establishing local link...", id: "menyambungkan link lokal..." },
  { en: "shell ready.", id: "shell siap." },
];

const TYPE_MS_PER_CHAR = 22;
const LINE_PAUSE_MS = 260;

/**
 * Purely decorative boot sequence behind the MainMenu buttons — not the store's `terminalLines`,
 * which is game state. This has no bearing on anything tappable: the button stack renders and
 * works from the very first frame regardless of where this animation is. Tapping the block itself
 * (not the whole screen — that would risk swallowing taps meant for the real buttons) jumps
 * straight to the finished text, same as the in-game Terminal's tap-to-skip.
 */
export function TitleTerminal() {
  const t = useT();
  const reducedMotion = usePrefersReducedMotion();
  const lines = BOOT_LINES.map((line) => t(line));

  const [lineIndex, setLineIndex] = useState(reducedMotion ? lines.length : 0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    if (lineIndex >= lines.length) return;

    const current = lines[lineIndex];
    if (charIndex >= current.length) {
      const timer = setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }, LINE_PAUSE_MS);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setCharIndex((c) => c + 1), TYPE_MS_PER_CHAR);
    return () => clearTimeout(timer);
  }, [lines, lineIndex, charIndex, reducedMotion]);

  function skip() {
    setLineIndex(lines.length);
    setCharIndex(0);
  }

  const done = lineIndex >= lines.length;

  return (
    <div
      onClick={skip}
      className="flex min-h-[2.5em] w-full max-w-xs flex-col gap-0.5 px-2 text-left text-[10px] tracking-wide text-accent/80"
      aria-hidden="true"
    >
      {lines.map((line, i) => {
        if (i > lineIndex) return null;
        const text = i === lineIndex && !done ? line.slice(0, charIndex) : line;
        const showCursor = i === lineIndex;
        return (
          <p key={i}>
            <span className="text-text-dim">{"$ "}</span>
            {text}
            {showCursor && <span className="animate-pulse">_</span>}
          </p>
        );
      })}
    </div>
  );
}
