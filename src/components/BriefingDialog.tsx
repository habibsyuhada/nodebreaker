import { BASE_PALETTE, LOCK_SPRITE } from "../art/sprites";
import { Sprite } from "../art/spriteEngine";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { useGameStore } from "../store/gameStore";

/**
 * Blocking overlay shown from the moment a level (re)loads until the player taps "Start Hack".
 * Covers the whole game screen (StatusBar/panel/ActionBar/TabBar sit underneath, inert) so the
 * player reads the job before anything — trace included — starts moving.
 */
export function BriefingDialog() {
  const t = useT();
  const briefingActive = useGameStore((s) => s.briefingActive);
  const level = useGameStore((s) => s.level);
  const dismissBriefing = useGameStore((s) => s.dismissBriefing);

  if (!briefingActive) return null;

  const entryNode = level.nodes.find((n) => n.id === level.entryNodeId);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-bg p-6 text-center">
      <Sprite grid={LOCK_SPRITE} palette={BASE_PALETTE} size={48} title="target node" />
      <p className="text-[10px] tracking-widest text-text-dim">{t(UI.incomingJob)}</p>
      <h1 className="text-sm font-semibold tracking-widest text-accent">{level.title}</h1>
      {entryNode && (
        <p className="text-xs text-text-dim">
          {t(UI.target)} <span className="text-text-bright">{entryNode.ip}</span> — {entryNode.orgName}
        </p>
      )}
      <div className="flex max-w-xs flex-col gap-2 text-xs leading-relaxed text-text">
        {level.briefing.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <button
        type="button"
        onClick={dismissBriefing}
        className="mt-2 min-h-[44px] rounded border border-accent/40 px-6 text-xs font-medium tracking-wide text-accent active:bg-accent-dim"
      >
        {t(UI.startHack)}
      </button>
      <p className="text-[10px] text-text-dim">{t(UI.traceWontMove)}</p>
    </div>
  );
}
