import { BASE_PALETTE, LOCK_SPRITE } from "../art/sprites";
import { Sprite } from "../art/spriteEngine";
import { useGameStore } from "../store/gameStore";

/** First thing the app shows on every boot, regardless of saved progress. */
export function MainMenu() {
  const setScreen = useGameStore((s) => s.setScreen);
  const clueCount = useGameStore((s) => s.clues.length);
  const discoveredCount = useGameStore((s) => Object.keys(s.discovered).length);
  const traceLevel = useGameStore((s) => s.traceLevel);
  const accessGrantedCount = useGameStore((s) => Object.keys(s.accessGrantedNodes).length);
  const completedCount = useGameStore((s) => Object.keys(s.completedLevels).length);

  const hasProgress =
    clueCount > 0 ||
    discoveredCount > 0 ||
    traceLevel > 0 ||
    accessGrantedCount > 0 ||
    completedCount > 0;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
      <Sprite grid={LOCK_SPRITE} palette={BASE_PALETTE} size={64} title="nodebreaker" />
      <div>
        <h1 className="text-lg font-semibold tracking-[0.3em] text-accent">NODEBREAKER</h1>
        <p className="mt-1 text-[10px] tracking-widest text-text-dim">
          FIND THE OPENING. GET IN. STAY QUIET.
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-2">
        {hasProgress && (
          <button
            type="button"
            onClick={() => setScreen("game")}
            className="min-h-[44px] rounded border border-accent/40 px-4 text-xs font-medium tracking-wide text-accent active:bg-accent-dim"
          >
            Continue
          </button>
        )}
        <button
          type="button"
          onClick={() => setScreen("levels")}
          className={`min-h-[44px] rounded border px-4 text-xs font-medium tracking-wide active:bg-panel-alt ${
            hasProgress ? "border-border text-text-dim" : "border-accent/40 text-accent active:bg-accent-dim"
          }`}
        >
          Select Level
        </button>
      </div>
    </div>
  );
}
