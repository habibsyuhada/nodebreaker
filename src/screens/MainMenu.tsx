import { useEffect, useState } from "react";
import { IconSpeakerMuted, IconSpeakerOn } from "../art/icons";
import { BASE_PALETTE, LOCK_SPRITE } from "../art/sprites";
import { Sprite } from "../art/spriteEngine";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { promptInstall, useInstallAvailable } from "../pwa/installPrompt";
import { useGameStore } from "../store/gameStore";
import { TitleTerminal } from "./TitleTerminal";

/**
 * Deliberately visible before any sound has played — a player who wants silence shouldn't have to
 * hear a beep first to find the button that stops it. Top-right, out of the way of the primary CTA.
 */
function MuteToggle() {
  const t = useT();
  const muted = useGameStore((s) => s.profile.audio.muted);
  const setAudio = useGameStore((s) => s.setAudio);

  return (
    <button
      type="button"
      onClick={() => setAudio({ muted: !muted })}
      aria-label={muted ? t(UI.muteOn) : t(UI.muteOff)}
      className="absolute right-2 top-2 flex min-h-[44px] min-w-[44px] items-center justify-center text-text-dim active:text-accent"
    >
      {muted ? <IconSpeakerMuted size={20} /> : <IconSpeakerOn size={20} />}
    </button>
  );
}

/**
 * Small, dismissable suggestion — not the old first-run blocking overlay. `lang` is already usable
 * from the first boot via `detectLang()`, so this only offers a one-tap override for when the
 * guess was wrong, and disappears for good the moment the player acts on it either way.
 */
function LanguageChip() {
  const t = useT();
  const lang = useGameStore((s) => s.lang);
  const langChosen = useGameStore((s) => s.langChosen);
  const setLang = useGameStore((s) => s.setLang);

  if (langChosen) return null;

  const other = lang === "en" ? "id" : "en";
  const suggestion = lang === "en" ? UI.switchToIndonesian : UI.switchToEnglish;

  return (
    <div className="flex items-center gap-2 rounded border border-border px-2 py-1 text-[11px] text-text-dim">
      <button type="button" onClick={() => setLang(other)} className="min-h-[32px] px-1 active:text-accent">
        {t(suggestion)}
      </button>
      <button
        type="button"
        onClick={() => setLang(lang)}
        aria-label="Dismiss"
        className="flex min-h-[32px] min-w-[32px] items-center justify-center text-text-dim active:text-accent"
      >
        {t(UI.switchLangDismiss)}
      </button>
    </div>
  );
}

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
  const loadLevel = useGameStore((s) => s.loadLevel);
  const clueCount = useGameStore((s) => s.clues.length);
  const discoveredCount = useGameStore((s) => Object.keys(s.discovered).length);
  const traceLevel = useGameStore((s) => s.traceLevel);
  const accessGrantedCount = useGameStore((s) => Object.keys(s.accessGrantedNodes).length);
  const completedCount = useGameStore((s) => Object.keys(s.completedLevels).length);
  const installAvailable = useInstallAvailable();
  const [exited, setExited] = useState(false);

  const hasProgress =
    clueCount > 0 ||
    discoveredCount > 0 ||
    traceLevel > 0 ||
    accessGrantedCount > 0 ||
    completedCount > 0;

  if (exited) return <ExitScreen onCancel={() => setExited(false)} />;

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
      <MuteToggle />
      <Sprite grid={LOCK_SPRITE} palette={BASE_PALETTE} size={64} title="nodebreaker" />
      <div>
        <h1 className="text-lg font-semibold tracking-[0.3em] text-accent">NODEBREAKER</h1>
        <p className="mt-1 text-[10px] tracking-widest text-text-dim">{t(UI.tagline)}</p>
      </div>
      <TitleTerminal />
      <LanguageChip />
      <div className="flex w-full max-w-xs flex-col gap-2">
        {hasProgress ? (
          <button
            type="button"
            onClick={() => setScreen("game")}
            className="min-h-[44px] rounded border border-accent/40 px-4 text-xs font-medium tracking-wide text-accent active:bg-accent-dim"
          >
            {t(UI.continueBtn)}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              loadLevel(0);
              setScreen("game");
            }}
            className="min-h-[44px] rounded border border-accent/40 px-4 text-xs font-medium tracking-wide text-accent active:bg-accent-dim"
          >
            {t(UI.startBtn)}
          </button>
        )}
        <button
          type="button"
          onClick={() => setScreen("levels")}
          className="min-h-[44px] rounded border border-border px-4 text-xs font-medium tracking-wide text-text-dim active:bg-panel-alt"
        >
          {t(UI.selectLevel)}
        </button>
        <button
          type="button"
          onClick={() => setScreen("records")}
          className="min-h-[44px] rounded border border-border px-4 text-xs font-medium tracking-wide text-text-dim active:bg-panel-alt"
        >
          {t(UI.opsRecord)}
        </button>
        <button
          type="button"
          onClick={() => setScreen("settings")}
          className="min-h-[44px] rounded border border-border px-4 text-xs font-medium tracking-wide text-text-dim active:bg-panel-alt"
        >
          {t(UI.settings)}
        </button>
        {installAvailable && (
          <button
            type="button"
            onClick={() => void promptInstall()}
            className="min-h-[44px] rounded border border-accent/40 px-4 text-xs font-medium tracking-wide text-accent active:bg-accent-dim"
          >
            {t(UI.installApp)}
          </button>
        )}
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
