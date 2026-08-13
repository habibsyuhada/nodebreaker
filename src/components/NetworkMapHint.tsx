import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { isBossLevel } from "../levels/chapters";
import { useGameStore } from "../store/gameStore";

/**
 * Nudge toward the Network Map: appears as soon as a multi-node level loads (once the
 * briefing/intro is dismissed), points at the already-tappable NODE bar, and disappears once
 * dismissed — or once the player opens the map themselves (setNetworkMapOpen marks it seen too,
 * so finding it independently silences this). Deliberately shown before the player has pivoted
 * anywhere: on a boss network with several independent branches, the map is how they decide which
 * branch to pursue in the first place, not just a shortcut for backtracking.
 *
 * Regular multi-node levels only ever show this once, account-wide (`networkMapHintShown`) — the
 * underlying UI doesn't change level to level, so teaching it once is enough. Boss levels re-arm
 * it per level id (`bossMapHintDismissedIds`) instead: each boss is a much bigger, independent
 * navigation decision than the last, so a player who dismissed the hint back on an early 2-node
 * level still needs the reminder the first time they face a 6-7 node boss network.
 */
export function NetworkMapHint() {
  const t = useT();
  const level = useGameStore((s) => s.level);
  const boss = isBossLevel(level.id);
  const networkMapHintShown = useGameStore((s) => s.networkMapHintShown);
  const bossMapHintDismissedIds = useGameStore((s) => s.bossMapHintDismissedIds);
  const shown = boss ? Boolean(bossMapHintDismissedIds[level.id]) : networkMapHintShown;
  const dismiss = useGameStore((s) => s.dismissNetworkMapHint);
  const briefingActive = useGameStore((s) => s.briefingActive);
  const networkMapOpen = useGameStore((s) => s.networkMapOpen);

  if (shown || level.nodes.length <= 1 || briefingActive || networkMapOpen) return null;

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
