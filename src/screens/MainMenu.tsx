import { useEffect, useState } from "react";
import { BASE_PALETTE, LOCK_SPRITE } from "../art/sprites";
import { Sprite } from "../art/spriteEngine";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { useGameStore } from "../store/gameStore";

/**
 * The web platform has no real "quit the app" — window.close() only works on a tab the page
 * itself opened, so on an ordinary tab it silently no-ops. Attempt it anyway (covers PWA/webview
 * contexts where it does work), but always land on a themed screen with a way back in so the
 * player is never stuck looking at a dead button.
 */
function ExitScreen({ onCancel }: { onCancel: () => void }) {
  const t = useT();

  useEffect(() => {
    window.close();
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-sm font-semibold tracking-widest text-warn crt-flicker">
        {t(UI.connectionTerminated)}
      </p>
      <p className="max-w-xs text-xs text-text-dim">{t(UI.exitBody)}</p>
      <button
        type="button"
        onClick={onCancel}
        className="mt-2 min-h-[44px] rounded border border-border px-4 text-xs font-medium tracking-wide text-text-dim active:bg-panel-alt"
      >
        {t(UI.backIn)}
      </button>
    </div>
  );
}

/** First thing the app shows on every boot, regardless of saved progress. */
export function MainMenu() {
  const t = useT();
  const setScreen = useGameStore((s) => s.setScreen);
  const clueCount = useGameStore((s) => s.clues.length);
  const discoveredCount = useGameStore((s) => Object.keys(s.discovered).length);
  const traceLevel = useGameStore((s) => s.traceLevel);
  const accessGrantedCount = useGameStore((s) => Object.keys(s.accessGrantedNodes).length);
  const completedCount = useGameStore((s) => Object.keys(s.completedLevels).length);
  const [exited, setExited] = useState(false);

  const hasProgress =
    clueCount > 0 ||
    discoveredCount > 0 ||
    traceLevel > 0 ||
    accessGrantedCount > 0 ||
    completedCount > 0;

  if (exited) return <ExitScreen onCancel={() => setExited(false)} />;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
      <Sprite grid={LOCK_SPRITE} palette={BASE_PALETTE} size={64} title="nodebreaker" />
      <div>
        <h1 className="text-lg font-semibold tracking-[0.3em] text-accent">NODEBREAKER</h1>
        <p className="mt-1 text-[10px] tracking-widest text-text-dim">{t(UI.tagline)}</p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-2">
        {hasProgress && (
          <button
            type="button"
            onClick={() => setScreen("game")}
            className="min-h-[44px] rounded border border-accent/40 px-4 text-xs font-medium tracking-wide text-accent active:bg-accent-dim"
          >
            {t(UI.continueBtn)}
          </button>
        )}
        <button
          type="button"
          onClick={() => setScreen("levels")}
          className={`min-h-[44px] rounded border px-4 text-xs font-medium tracking-wide active:bg-panel-alt ${
            hasProgress ? "border-border text-text-dim" : "border-accent/40 text-accent active:bg-accent-dim"
          }`}
        >
          {t(UI.selectLevel)}
        </button>
        <button
          type="button"
          onClick={() => setScreen("settings")}
          className="min-h-[44px] rounded border border-border px-4 text-xs font-medium tracking-wide text-text-dim active:bg-panel-alt"
        >
          {t(UI.settings)}
        </button>
        <button
          type="button"
          onClick={() => setExited(true)}
          className="min-h-[44px] rounded border border-warn/40 px-4 text-xs font-medium tracking-wide text-warn active:bg-warn-dim"
        >
          {t(UI.exit)}
        </button>
      </div>
    </div>
  );
}
