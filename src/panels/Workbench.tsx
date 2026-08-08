import { useEffect, useRef, useState } from "react";
import { playCombineInvalid, playCombineSuccess } from "../audio/synth";
import { CLUE_TYPE_LABEL, type Clue } from "../engine/clueSystem";
import { shortNodeLabel } from "../engine/nodeState";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { useGameStore } from "../store/gameStore";

interface DragState {
  clue: Clue;
  x: number;
  y: number;
}

function ClueChip({ clue, onGrab }: { clue: Clue; onGrab: (e: React.PointerEvent) => void }) {
  return (
    <div
      onPointerDown={onGrab}
      className="touch-none select-none rounded border border-border bg-panel px-2 py-1.5 text-xs active:cursor-grabbing active:border-accent"
    >
      <span className="mr-1.5 text-accent">{CLUE_TYPE_LABEL[clue.type]}</span>
      <span className="text-text-bright">{clue.value}</span>
    </div>
  );
}

function Slot({
  label,
  clue,
  slotRef,
  onClear,
}: {
  label: string;
  clue: Clue | null;
  slotRef: React.RefObject<HTMLDivElement | null>;
  onClear: () => void;
}) {
  return (
    <div
      ref={slotRef}
      onClick={clue ? onClear : undefined}
      className={`flex h-16 flex-1 flex-col items-center justify-center rounded border-2 border-dashed px-2 text-center ${
        clue ? "border-accent bg-accent-dim" : "border-border"
      }`}
    >
      {clue ? (
        <>
          <span className="text-[10px] text-accent">{CLUE_TYPE_LABEL[clue.type]}</span>
          <span className="truncate text-xs text-text-bright">{clue.value}</span>
        </>
      ) : (
        <span className="text-[10px] text-text-dim">SLOT {label}</span>
      )}
    </div>
  );
}

export function Workbench() {
  const t = useT();
  const clues = useGameStore((s) => s.clues);
  const slotA = useGameStore((s) => s.slotA);
  const slotB = useGameStore((s) => s.slotB);
  const placeInSlot = useGameStore((s) => s.placeInSlot);
  const clearSlot = useGameStore((s) => s.clearSlot);
  const combineFeedback = useGameStore((s) => s.combineFeedback);
  const clearCombineFeedback = useGameStore((s) => s.clearCombineFeedback);

  const slotARef = useRef<HTMLDivElement>(null);
  const slotBRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  useEffect(() => {
    if (!combineFeedback) return;
    if (combineFeedback.kind === "success") {
      navigator.vibrate?.([20]);
      playCombineSuccess();
    } else {
      navigator.vibrate?.([15, 40, 15]);
      playCombineInvalid();
    }
    const timer = window.setTimeout(clearCombineFeedback, 1800);
    return () => window.clearTimeout(timer);
  }, [combineFeedback, clearCombineFeedback]);

  const placedIds = new Set([slotA?.id, slotB?.id].filter(Boolean));
  const tray = clues.filter((c) => !placedIds.has(c.id));

  // Same rule as the Clue Inventory: only show a per-node header once a level has shown the
  // player more than one node, so single-node levels don't get a noisy repeated label.
  const trayNodeIds = [...new Set(tray.map((c) => c.nodeId))];
  const trayGrouped = trayNodeIds.length > 1;
  const trayGroups = trayGrouped
    ? trayNodeIds.map((nodeId) => ({
        nodeId,
        nodeLabel: shortNodeLabel(tray.find((c) => c.nodeId === nodeId)?.nodeLabel ?? nodeId),
        clues: tray.filter((c) => c.nodeId === nodeId),
      }))
    : [{ nodeId: "all", nodeLabel: "", clues: tray }];

  function isOverSlot(ref: React.RefObject<HTMLDivElement | null>, x: number, y: number): boolean {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return false;
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  function grab(clue: Clue, e: React.PointerEvent) {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Capture is a nice-to-have for fast drags; the pointer events still bubble without it.
    }
    setDrag({ clue, x: e.clientX, y: e.clientY });
  }

  function move(e: React.PointerEvent) {
    if (!drag) return;
    setDrag({ ...drag, x: e.clientX, y: e.clientY });
  }

  function release(e: React.PointerEvent) {
    if (!drag) return;
    if (isOverSlot(slotARef, e.clientX, e.clientY)) placeInSlot("A", drag.clue);
    else if (isOverSlot(slotBRef, e.clientX, e.clientY)) placeInSlot("B", drag.clue);
    setDrag(null);
  }

  return (
    <div
      className="flex h-full flex-col"
      onPointerMove={move}
      onPointerUp={release}
      onPointerCancel={() => setDrag(null)}
    >
      <div className="border-b border-border bg-panel p-4">
        <p className="mb-3 text-[11px] tracking-wide text-text-dim">{t(UI.dragTwoClues)}</p>
        <div className="flex items-center gap-3">
          <Slot label="A" clue={slotA} slotRef={slotARef} onClear={() => clearSlot("A")} />
          <span className="text-lg text-text-dim">+</span>
          <Slot label="B" clue={slotB} slotRef={slotBRef} onClear={() => clearSlot("B")} />
        </div>
        {combineFeedback && (
          <p
            className={`mt-3 text-center text-xs ${
              combineFeedback.kind === "success" ? "text-accent" : "text-warn"
            }`}
          >
            {combineFeedback.message}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {tray.length === 0 ? (
          <p className="p-3 text-center text-xs text-text-dim">{t(UI.noMoreCluesInTray)}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {trayGroups.map((group) => (
              <div key={group.nodeId} className="flex flex-col gap-2">
                {trayGrouped && (
                  <p className="px-1 text-[10px] font-semibold tracking-widest text-accent">
                    {group.nodeLabel}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {group.clues.map((clue) => (
                    <ClueChip key={clue.id} clue={clue} onGrab={(e) => grab(clue, e)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {drag && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded border border-accent bg-panel-alt px-2 py-1.5 text-xs text-accent shadow-lg"
          style={{ left: drag.x, top: drag.y }}
        >
          {drag.clue.value}
        </div>
      )}
    </div>
  );
}
