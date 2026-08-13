import { THEMES } from "../engine/theme";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { useGameStore } from "../store/gameStore";

/** Locked/unlocked list of every skin — off Settings, not tied to any one level. */
export function ThemeGallery() {
  const t = useT();
  const setScreen = useGameStore((s) => s.setScreen);
  const unlockedThemeIds = useGameStore((s) => s.profile.unlockedThemeIds);
  const activeThemeId = useGameStore((s) => s.profile.activeThemeId);
  const setActiveTheme = useGameStore((s) => s.setActiveTheme);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-panel px-3 py-2">
        <button
          type="button"
          onClick={() => setScreen("settings")}
          className="min-h-[44px] px-1 text-xs text-text-dim active:text-accent"
        >
          {t(UI.backToSettingsLabel)}
        </button>
        <h1 className="flex-1 text-center text-xs font-semibold tracking-widest text-text-bright">
          {t(UI.themeGalleryTitle)}
        </h1>
        <span className="w-12" aria-hidden="true" />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-2">
          {THEMES.map((theme) => {
            const unlocked = Boolean(unlockedThemeIds[theme.id]);
            const active = theme.id === activeThemeId;
            return (
              <button
                key={theme.id}
                type="button"
                disabled={!unlocked}
                onClick={() => setActiveTheme(theme.id)}
                className={`flex min-h-[56px] w-full items-center gap-3 rounded border px-3 py-2 text-left ${
                  unlocked
                    ? active
                      ? "border-accent/40 active:bg-accent-dim"
                      : "border-border active:bg-panel-alt"
                    : "cursor-not-allowed border-border opacity-50"
                }`}
              >
                <span
                  className="h-8 w-8 shrink-0 rounded-full border border-border"
                  style={{ background: theme.colors.accent }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-medium tracking-wide ${unlocked ? "text-text-bright" : "text-text-dim"}`}
                    >
                      {t(theme.name)}
                    </span>
                    {active && <span className="text-[9px] tracking-wide text-accent">{t(UI.themeActiveLabel)}</span>}
                    {!unlocked && <span className="text-[9px] tracking-wide text-text-dim">{t(UI.locked)}</span>}
                  </div>
                  <span className="text-[11px] text-text-dim">{t(theme.hint)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
