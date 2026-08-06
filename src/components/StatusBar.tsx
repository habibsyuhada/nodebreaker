import { TRACE_HOT_THRESHOLD, TRACE_WARM_THRESHOLD } from "../engine/traceSystem";
import { useCurrentNode, useGameStore } from "../store/gameStore";

export function StatusBar() {
  const node = useCurrentNode();
  const traceLevel = useGameStore((s) => s.traceLevel);
  const burned = useGameStore((s) => s.burned);

  const isHot = traceLevel >= TRACE_HOT_THRESHOLD;
  const isWarm = traceLevel >= TRACE_WARM_THRESHOLD;

  return (
    <header className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-panel px-3 text-xs tracking-wide">
      <span className="text-text-dim">
        NODE: <span className="text-text-bright">{node.ip}</span>
      </span>
      {node.traceEnabled ? (
        <span
          className={
            burned
              ? "font-semibold text-warn crt-flicker"
              : isHot
                ? "font-semibold text-warn crt-flicker"
                : isWarm
                  ? "text-warn"
                  : "text-text-dim"
          }
        >
          {burned ? "TRACE — BURNED" : `TRACE ${traceLevel}%`}
        </span>
      ) : (
        <span className="text-text-dim">TRACE — off</span>
      )}
    </header>
  );
}
