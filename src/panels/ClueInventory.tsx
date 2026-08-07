import { useEffect } from "react";
import { playCombineInvalid, playCombineSuccess } from "../audio/synth";
import { CLUE_TYPE_LABEL } from "../engine/clueSystem";
import { useGameStore } from "../store/gameStore";

export function ClueInventory() {
  const clues = useGameStore((s) => s.clues);
  const selectedClueId = useGameStore((s) => s.selectedClueId);
  const crackingClueId = useGameStore((s) => s.crackingClueId);
  const toggleClueSelection = useGameStore((s) => s.toggleClueSelection);
  const transformFeedback = useGameStore((s) => s.transformFeedback);
  const clearTransformFeedback = useGameStore((s) => s.clearTransformFeedback);

  useEffect(() => {
    if (!transformFeedback) return;
    if (transformFeedback.kind === "success") {
      navigator.vibrate?.([20]);
      playCombineSuccess();
    } else {
      navigator.vibrate?.([15, 40, 15]);
      playCombineInvalid();
    }
    const t = window.setTimeout(clearTransformFeedback, 1800);
    return () => window.clearTimeout(t);
  }, [transformFeedback, clearTransformFeedback]);

  if (clues.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-sm font-semibold tracking-widest text-text-bright">
          CLUE INVENTORY — EMPTY
        </p>
        <p className="text-xs text-text-dim">
          Tap and hold text you find in Terminal or Files to save it here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto p-3">
      <p className="px-1 text-[11px] tracking-wide text-text-dim">
        {clues.length} clue{clues.length === 1 ? "" : "s"} saved · tap a clue to select it
      </p>
      {clues.map((clue) => {
        const selected = clue.id === selectedClueId;
        const cracking = clue.id === crackingClueId;
        return (
          <div
            key={clue.id}
            onClick={() => toggleClueSelection(clue.id)}
            className={`flex items-start gap-3 rounded border bg-panel p-3 ${
              selected ? "border-accent bg-accent-dim" : "border-border"
            }`}
          >
            <span className="mt-0.5 shrink-0 rounded border border-accent/40 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-accent">
              {CLUE_TYPE_LABEL[clue.type]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-xs text-text-bright">{clue.value}</p>
              <p className="mt-0.5 text-[10px] text-text-dim">
                {cracking ? "cracking..." : `${clue.label} · from ${clue.source}`}
              </p>
            </div>
          </div>
        );
      })}
      {transformFeedback && (
        <p
          className={`px-1 text-center text-xs ${
            transformFeedback.kind === "success" ? "text-accent" : "text-warn"
          }`}
        >
          {transformFeedback.message}
        </p>
      )}
    </div>
  );
}
