import { useEffect } from "react";
import { playCombineInvalid, playCombineSuccess } from "../audio/synth";
import { CLUE_TYPE_LABEL, type Clue } from "../engine/clueSystem";
import { shortNodeLabel } from "../engine/nodeState";
import { useGameStore } from "../store/gameStore";

interface ClueRowProps {
  clue: Clue;
  selected: boolean;
  cracking: boolean;
  onToggle: () => void;
}

function ClueRow({ clue, selected, cracking, onToggle }: ClueRowProps) {
  return (
    <div
      onClick={onToggle}
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
}

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

  // Clues carry the node they were found/derived on. Group by node only once a level has actually
  // shown the player more than one — on single-node levels (the majority) a group header per clue
  // would just be noise repeating the same label over and over.
  const nodeIds = [...new Set(clues.map((c) => c.nodeId))];
  const grouped = nodeIds.length > 1;
  const groups = grouped
    ? nodeIds.map((nodeId) => ({
        nodeId,
        nodeLabel: shortNodeLabel(clues.find((c) => c.nodeId === nodeId)?.nodeLabel ?? nodeId),
        clues: clues.filter((c) => c.nodeId === nodeId),
      }))
    : [{ nodeId: "all", nodeLabel: "", clues }];

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto p-3">
      <p className="px-1 text-[11px] tracking-wide text-text-dim">
        {clues.length} clue{clues.length === 1 ? "" : "s"} saved · tap a clue to select it
      </p>
      {groups.map((group) => (
        <div key={group.nodeId} className="flex flex-col gap-2">
          {grouped && (
            <p className="mt-1 px-1 text-[10px] font-semibold tracking-widest text-accent first:mt-0">
              {group.nodeLabel}
            </p>
          )}
          {group.clues.map((clue) => (
            <ClueRow
              key={clue.id}
              clue={clue}
              selected={clue.id === selectedClueId}
              cracking={clue.id === crackingClueId}
              onToggle={() => toggleClueSelection(clue.id)}
            />
          ))}
        </div>
      ))}
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
