import { useMemo } from "react";
import {
  computeNetworkMapLayout,
  NETWORK_MAP_NODE_H,
  NETWORK_MAP_NODE_W,
  type MapNodePosition,
} from "../engine/networkMapLayout";
import { shortNodeLabel } from "../engine/nodeState";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { isBossLevel } from "../levels/chapters";
import { useGameStore } from "../store/gameStore";

type NodeState = "current" | "reachable" | "visited" | "locked";

const STATE_CLASSES: Record<NodeState, string> = {
  current: "border-accent/40 bg-accent-dim",
  reachable: "border-accent/60 active:bg-panel-alt",
  visited: "border-border opacity-90 active:bg-panel-alt",
  locked: "border-dashed border-border/70 opacity-50",
};

/**
 * Overlay showing every node the player can orient by. Boss levels (`isBossLevel`) render an
 * actual node-graph diagram — hub + branches, computed by `computeNetworkMapLayout` — since a
 * boss network has several independent branches the player needs to see the shape of *before*
 * picking one, not just a flat list of what they've already found. Regular multi-node levels
 * (a simple 2-node public/internal pair) keep the plain list — a diagram would be overkill for
 * two nodes. Either way, tapping a reachable node fires the same `pivotTo()` the Terminal
 * ActionBar's "Pivot to <ip>" button already offers — this doesn't add a new navigation
 * capability, just a clearer, always-available view of it.
 */
export function NetworkMap() {
  const t = useT();
  const networkMapOpen = useGameStore((s) => s.networkMapOpen);
  const setNetworkMapOpen = useGameStore((s) => s.setNetworkMapOpen);
  const level = useGameStore((s) => s.level);
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const visitedNodeIds = useGameStore((s) => s.visitedNodeIds);
  const discovered = useGameStore((s) => s.discovered);
  const pivotTo = useGameStore((s) => s.pivotTo);
  const boss = isBossLevel(level.id);
  const layout = useMemo(
    () => computeNetworkMapLayout(level.nodes, level.entryNodeId),
    [level],
  );

  if (!networkMapOpen) return null;

  const currentNode = level.nodes.find((n) => n.id === currentNodeId);
  const readyPivots = (currentNode?.pivots ?? []).filter((p) =>
    p.requiredFacts.every((f) => discovered[f]),
  );

  function stateOf(nodeId: string): NodeState {
    if (nodeId === currentNodeId) return "current";
    if (readyPivots.some((p) => p.targetNodeId === nodeId)) return "reachable";
    if (visitedNodeIds[nodeId]) return "visited";
    return "locked";
  }

  const rows = level.nodes
    .filter((n) => visitedNodeIds[n.id] || readyPivots.some((p) => p.targetNodeId === n.id))
    .map((n) => ({
      node: n,
      isCurrent: n.id === currentNodeId,
      pivot: readyPivots.find((p) => p.targetNodeId === n.id),
    }));

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end bg-bg/90 p-3"
      onClick={() => setNetworkMapOpen(false)}
    >
      <div
        className="flex max-h-[70%] flex-col gap-2 rounded border border-border bg-panel p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-widest text-text-bright">{t(UI.networkMap)}</h2>
          <button
            type="button"
            onClick={() => setNetworkMapOpen(false)}
            className="min-h-[32px] px-2 text-xs text-text-dim active:text-accent"
          >
            {t(UI.close)}
          </button>
        </div>
        {boss ? (
          <div className="relative w-full overflow-visible" style={{ aspectRatio: `${layout.viewBoxW} / ${layout.viewBoxH}` }}>
            <svg
              viewBox={`0 0 ${layout.viewBoxW} ${layout.viewBoxH}`}
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {layout.edges.map(({ a, b }) => {
                const posA = layout.nodes.find((n) => n.nodeId === a);
                const posB = layout.nodes.find((n) => n.nodeId === b);
                if (!posA || !posB) return null;
                const known = stateOf(a) !== "locked" || stateOf(b) !== "locked";
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={posA.x}
                    y1={posA.y}
                    x2={posB.x}
                    y2={posB.y}
                    className={known ? "stroke-accent/50" : "stroke-border"}
                    strokeWidth={known ? 1.5 : 1}
                    strokeDasharray={known ? undefined : "3 3"}
                  />
                );
              })}
            </svg>
            {layout.nodes.map((pos: MapNodePosition) => {
              const node = level.nodes.find((n) => n.id === pos.nodeId);
              if (!node) return null;
              const state = stateOf(pos.nodeId);
              const pivot = readyPivots.find((p) => p.targetNodeId === pos.nodeId);
              const tappable = state === "reachable";
              return (
                <button
                  key={pos.nodeId}
                  type="button"
                  disabled={!tappable}
                  onClick={() => pivot && pivotTo(pivot.id)}
                  style={{
                    left: `${(pos.x / layout.viewBoxW) * 100}%`,
                    top: `${(pos.y / layout.viewBoxH) * 100}%`,
                    width: `${(NETWORK_MAP_NODE_W / layout.viewBoxW) * 100}%`,
                    minHeight: NETWORK_MAP_NODE_H,
                  }}
                  className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded border px-1.5 py-1 text-center ${STATE_CLASSES[state]}`}
                >
                  {state === "locked" ? (
                    <span className="text-sm text-text-dim" aria-hidden="true">
                      ?
                    </span>
                  ) : (
                    <>
                      <span className="block w-full truncate text-[10px] font-medium text-text-bright">
                        {shortNodeLabel(node.orgName)}
                      </span>
                      <span className="block text-[9px] text-text-dim">{node.ip}</span>
                      {state === "reachable" && (
                        <span className="text-[8px] font-semibold tracking-wide text-accent">
                          {t(UI.pivotAvailable)}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto">
            {rows.map(({ node, isCurrent, pivot }) => {
              const tappable = !isCurrent && Boolean(pivot);
              return (
                <button
                  key={node.id}
                  type="button"
                  disabled={!tappable}
                  onClick={() => pivot && pivotTo(pivot.id)}
                  className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded border px-3 py-2 text-left ${
                    isCurrent
                      ? "border-accent/40 bg-accent-dim"
                      : tappable
                        ? "border-border active:bg-panel-alt"
                        : "border-border opacity-50"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-text-bright">
                      {shortNodeLabel(node.orgName)}
                    </span>
                    <span className="block text-[10px] text-text-dim">{node.ip}</span>
                  </span>
                  <span
                    className={`shrink-0 text-[10px] font-semibold tracking-wide ${
                      isCurrent || tappable ? "text-accent" : "text-text-dim"
                    }`}
                  >
                    {isCurrent ? t(UI.here) : tappable ? t(UI.pivotAvailable) : t(UI.visited)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
