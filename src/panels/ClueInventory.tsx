import { CLUE_TYPE_LABEL } from "../engine/clueSystem";
import { useGameStore } from "../store/gameStore";

export function ClueInventory() {
  const clues = useGameStore((s) => s.clues);

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
        {clues.length} clue{clues.length === 1 ? "" : "s"} saved
      </p>
      {clues.map((clue) => (
        <div
          key={clue.id}
          className="flex items-start gap-3 rounded border border-border bg-panel p-3"
        >
          <span className="mt-0.5 shrink-0 rounded border border-accent/40 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-accent">
            {CLUE_TYPE_LABEL[clue.type]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="selectable truncate font-mono text-xs text-text-bright">{clue.value}</p>
            <p className="mt-0.5 text-[10px] text-text-dim">
              {clue.label} · from {clue.source}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
