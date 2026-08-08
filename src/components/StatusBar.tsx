import { shortNodeLabel } from "../engine/nodeState";
import { TRACE_HOT_THRESHOLD, TRACE_WARM_THRESHOLD } from "../engine/traceSystem";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { useCurrentNode, useGameStore } from "../store/gameStore";

export function StatusBar() {
  const t = useT();
  const node = useCurrentNode();
  const level = useGameStore((s) => s.level);
  const traceLevel = useGameStore((s) => s.traceLevel);
  const burned = useGameStore((s) => s.burned);
  const setNetworkMapOpen = useGameStore((s) => s.setNetworkMapOpen);
  const multiNode = level.nodes.length > 1;

  const isHot = traceLevel >= TRACE_HOT_THRESHOLD;
  const isWarm = traceLevel >= TRACE_WARM_THRESHOLD;

  return (
    <header className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-border bg-panel px-3 text-xs tracking-wide">
      {multiNode ? (
        <button
          type="button"
          onClick={() => setNetworkMapOpen(true)}
          className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden rounded border border-border bg-panel-alt px-2 py-1 text-text-dim active:border-accent/40 active:bg-accent-dim active:text-accent"
        >
          <span className="shrink-0 whitespace-nowrap">
            NODE: <span className="text-text-bright">{node.ip}</span>
          </span>
          <span className="min-w-0 flex-1 truncate text-left text-text-dim">
            · {shortNodeLabel(node.orgName)}
          </span>
          <span className="shrink-0 text-accent" aria-hidden="true">
            ▾
          </span>
        </button>
      ) : (
        <span className="truncate text-text-dim">
          NODE: <span className="text-text-bright">{node.ip}</span>
        </span>
      )}
      {node.traceEnabled ? (
        <span
          className={`shrink-0 whitespace-nowrap ${
            burned
              ? "font-semibold text-warn crt-flicker"
              : isHot
                ? "font-semibold text-warn crt-flicker"
                : isWarm
                  ? "text-warn"
                  : "text-text-dim"
          }`}
        >
          {burned ? t(UI.traceBurned) : `TRACE ${traceLevel}%`}
        </span>
      ) : (
        <span className="shrink-0 whitespace-nowrap text-text-dim">{t(UI.traceOff)}</span>
      )}
    </header>
  );
}
