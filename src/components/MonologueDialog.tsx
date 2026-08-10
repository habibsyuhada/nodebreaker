import { BASE_PALETTE, PERSON_SPRITE } from "../art/sprites";
import { Sprite } from "../art/spriteEngine";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { useGameStore } from "../store/gameStore";

/**
 * Player "session notes" dialog — shows one entry at a time from the monologue queue (clue saves,
 * blocked gated actions) framed as the protagonist's own aside instead of a corner toast or a
 * terminal dump. Tapping anywhere, or the button, dismisses and reveals the next queued entry.
 */
export function MonologueDialog() {
  const t = useT();
  const queue = useGameStore((s) => s.monologueQueue);
  const dismissMonologue = useGameStore((s) => s.dismissMonologue);
  const entry = queue[0];

  if (!entry) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-bg/70 p-4"
      onClick={() => dismissMonologue(entry.id)}
    >
      <div
        className="card-in flex w-full max-w-xs flex-col gap-2 rounded border border-dashed border-text-bright/30 bg-panel p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <Sprite grid={PERSON_SPRITE} palette={BASE_PALETTE} size={20} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-text-bright">{t(UI.youAuthorLabel)}</p>
            <p className="text-[10px] text-text-dim">{t(UI.sessionNotesChannel)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs leading-relaxed text-text">
          {entry.lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismissMonologue(entry.id);
          }}
          className="mt-1 min-h-[36px] rounded border border-accent/40 text-xs font-medium tracking-wide text-accent active:bg-accent-dim"
        >
          {t(UI.continueBtn)}
        </button>
      </div>
    </div>
  );
}
