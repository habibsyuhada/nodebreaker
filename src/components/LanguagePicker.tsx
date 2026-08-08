import { BASE_PALETTE, LOCK_SPRITE } from "../art/sprites";
import { Sprite } from "../art/spriteEngine";
import { useGameStore } from "../store/gameStore";

/**
 * Blocking overlay shown above every screen (menu, level select, in-game) until the player has
 * ever picked a language — first-run only, gated on the persisted `langChosen` flag. Picking a
 * language here just calls the same `setLang` the Settings toggle uses, which also flips
 * `langChosen` true, so this never shows again afterward.
 */
export function LanguagePicker() {
  const langChosen = useGameStore((s) => s.langChosen);
  const setLang = useGameStore((s) => s.setLang);

  if (langChosen) return null;

  return (
    <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-bg p-6 text-center">
      <Sprite grid={LOCK_SPRITE} palette={BASE_PALETTE} size={64} title="nodebreaker" />
      <div>
        <h1 className="text-lg font-semibold tracking-[0.3em] text-accent">NODEBREAKER</h1>
        <p className="mt-1 text-[10px] tracking-widest text-text-dim">
          CHOOSE LANGUAGE / PILIH BAHASA
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <button
          type="button"
          onClick={() => setLang("en")}
          className="min-h-[44px] rounded border border-accent/40 px-4 text-xs font-medium tracking-wide text-accent active:bg-accent-dim"
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLang("id")}
          className="min-h-[44px] rounded border border-accent/40 px-4 text-xs font-medium tracking-wide text-accent active:bg-accent-dim"
        >
          Bahasa Indonesia
        </button>
      </div>
      <p className="max-w-xs text-[10px] text-text-dim">
        You can change this later in Settings. / Anda bisa mengubahnya nanti di Pengaturan.
      </p>
    </div>
  );
}
