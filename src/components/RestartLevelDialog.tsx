import { PERSON_SPRITE } from "../art/sprites";
import { Sprite } from "../art/spriteEngine";
import { useSpritePalette } from "../art/themePalette";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { useGameStore } from "../store/gameStore";

/**
 * Confirm-to-restart overlay for the current level, opened from Settings. Framed as the player's
 * own second-guessing rather than a plain system dialog — lets them bail on a run in place instead
 * of backing out to the main menu and re-entering Level Select.
 */
export function RestartLevelDialog() {
  const t = useT();
  const open = useGameStore((s) => s.restartConfirmOpen);
  const level = useGameStore((s) => s.level);
  const levelSource = useGameStore((s) => s.levelSource);
  const loadLevel = useGameStore((s) => s.loadLevel);
  const loadDailyContract = useGameStore((s) => s.loadDailyContract);
  const closeRestartConfirm = useGameStore((s) => s.closeRestartConfirm);
  const palette = useSpritePalette();

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-bg/80 p-6"
      onClick={closeRestartConfirm}
    >
      <div
        className="card-in flex w-full max-w-xs flex-col gap-3 rounded border border-dashed border-text-bright/30 bg-panel p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <Sprite grid={PERSON_SPRITE} palette={palette} size={20} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-text-bright">{t(UI.youAuthorLabel)}</p>
            <p className="text-[10px] text-text-dim">{t(UI.sessionNotesChannel)}</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-text">{t(UI.restartLevelPrompt)}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={closeRestartConfirm}
            className="min-h-[44px] flex-1 rounded border border-border px-3 text-xs font-medium tracking-wide text-text-dim active:bg-panel-alt"
          >
            {t(UI.keepGoing)}
          </button>
          <button
            type="button"
            onClick={() => {
              if (levelSource.kind === "daily") loadDailyContract();
              else loadLevel(level.index);
              closeRestartConfirm();
            }}
            className="min-h-[44px] flex-1 rounded border border-warn/40 px-3 text-xs font-medium tracking-wide text-warn active:bg-warn-dim"
          >
            {t(UI.restartLevel)}
          </button>
        </div>
      </div>
    </div>
  );
}
