import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { useGameStore } from "../store/gameStore";

/**
 * One-time nudge toward the Network Map: appears automatically the first time a level's pivot
 * count shows the map is actually useful (more than one node visited), points at the now-tappable
 * NODE bar, and never appears again once dismissed — or once the player opens the map themselves
 * (setNetworkMapOpen marks the hint shown too, so finding it independently silences this).
 */
export function NetworkMapHint() {
  const t = useT();
  const shown = useGameStore((s) => s.networkMapHintShown);
  const dismiss = useGameStore((s) => s.dismissNetworkMapHint);
  const visitedCount = useGameStore((s) => Object.keys(s.visitedNodeIds).length);
  const briefingActive = useGameStore((s) => s.briefingActive);
  const networkMapOpen = useGameStore((s) => s.networkMapOpen);

  if (shown || visitedCount <= 1 || briefingActive || networkMapOpen) return null;

  const [before, after] = t(UI.networkMapHintBody).split("{NODE}");

  return (
    <div className="pointer-events-none absolute inset-x-3 top-24 z-40 flex justify-start">
      <div className="pointer-events-auto flex max-w-[85%] flex-col gap-2 rounded border border-accent/40 bg-panel p-3 shadow-lg">
        <p className="text-xs text-text-bright">
          {before}
          <span className="text-accent">NODE</span>
          {after}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="self-end rounded border border-accent/40 px-3 py-1 text-[11px] font-medium tracking-wide text-accent active:bg-accent-dim"
        >
          {t(UI.gotIt)}
        </button>
      </div>
    </div>
  );
}
