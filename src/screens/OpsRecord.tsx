import { ACHIEVEMENTS } from "../engine/achievements";
import { UI } from "../i18n/ui";
import { format } from "../i18n";
import { useT } from "../i18n/useT";
import { useGameStore } from "../store/gameStore";

/** Locked/unlocked list of every achievement, plus the Daily Contract streak — off the Main Menu, not tied to any one level. */
export function OpsRecord() {
  const t = useT();
  const setScreen = useGameStore((s) => s.setScreen);
  const unlocked = useGameStore((s) => s.profile.achievements);
  const daily = useGameStore((s) => s.profile.daily);
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlocked[a.id]).length;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-panel px-3 py-2">
        <button
          type="button"
          onClick={() => setScreen("menu")}
          className="min-h-[44px] px-1 text-xs text-text-dim active:text-accent"
        >
          {t(UI.menuBack)}
        </button>
        <h1 className="flex-1 text-center text-xs font-semibold tracking-widest text-text-bright">
          {t(UI.opsRecordTitle)}
        </h1>
        <span className="w-12" aria-hidden="true" />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-3 flex flex-col gap-2 rounded border border-border p-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-dim">{t(UI.opsRecord)}</span>
            <span className="text-text-bright">
              {format(t(UI.opsRecordProgress), { n: String(unlockedCount), total: String(ACHIEVEMENTS.length) })}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-dim">{t(UI.dailyStreakLabel)}</span>
            <span className="text-accent">
              {daily.streak} · {format(t(UI.dailyStreakBest), { n: String(daily.longest) })}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {ACHIEVEMENTS.map((a) => {
            const earned = Boolean(unlocked[a.id]);
            return (
              <div
                key={a.id}
                className={`flex flex-col gap-0.5 rounded border px-3 py-2 ${
                  earned ? "border-accent/40" : "border-border opacity-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-medium tracking-wide ${earned ? "text-accent" : "text-text-dim"}`}
                  >
                    {t(a.name)}
                  </span>
                  {!earned && <span className="text-[9px] tracking-wide text-text-dim">{t(UI.locked)}</span>}
                </div>
                <span className="text-[11px] text-text-dim">{t(a.description)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
