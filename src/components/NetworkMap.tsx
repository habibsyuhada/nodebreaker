import { shortNodeLabel } from "../engine/nodeState";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { useGameStore } from "../store/gameStore";

/**
 * Overlay listing nodes the player can orient by: every node visited this level, plus any node a
 * pivot from the *current* node reaches once its requiredFacts are met. Tapping a reachable row
 * fires the same pivotTo() the Terminal ActionBar's "Pivot to <ip>" button already offers — this
 * doesn't add a new navigation capability, just a clearer, always-available view of it (with org
 * names instead of memorizing IPs) plus a sense of where you've already been.
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

  if (!networkMapOpen) return null;

  const currentNode = level.nodes.find((n) => n.id === currentNodeId);
  const readyPivots = (currentNode?.pivots ?? []).filter((p) =>
    p.requiredFacts.every((f) => discovered[f]),
  );

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
                  {isCurrent ? t(UI.here) : tappable ? "PIVOT" : t(UI.visited)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
