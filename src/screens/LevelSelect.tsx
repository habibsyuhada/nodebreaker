import { IconClues } from "../art/icons";
import { rankToneClass } from "../engine/runMetrics";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { format } from "../i18n";
import { LEVELS } from "../levels";
import { CHAPTERS, isBossLevel } from "../levels/chapters";
import { useGameStore } from "../store/gameStore";

function isUnlocked(index: number, completedLevels: Record<string, true>): boolean {
  if (index === 0) return true;
  const prev = LEVELS[index - 1];
  return Boolean(prev && completedLevels[prev.id]);
}

export function LevelSelect() {
  const t = useT();
  const setScreen = useGameStore((s) => s.setScreen);
  const loadLevel = useGameStore((s) => s.loadLevel);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const bestRuns = useGameStore((s) => s.profile.bestRuns);
  const indexById = new Map(LEVELS.map((l, i) => [l.id, i]));

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
          {t(UI.selectTarget)}
        </h1>
        <span className="w-12" aria-hidden="true" />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-4">
          {CHAPTERS.map((chapter) => {
            const chapterDone = chapter.levelIds.filter((id) => completedLevels[id]).length;
            return (
              <div key={chapter.id} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-2 px-1">
                  <div className="min-w-0">
                    <h2 className="truncate text-[11px] font-semibold tracking-widest text-text-bright">
                      {t(chapter.title)}
                    </h2>
                    <p className="truncate text-[10px] text-text-dim">{t(chapter.tagline)}</p>
                  </div>
                  <span className="shrink-0 text-[10px] tracking-wide text-text-dim">
                    {format(t(UI.opsRecordProgress), { n: String(chapterDone), total: String(chapter.levelIds.length) })}
                  </span>
                </div>
                {chapter.levelIds.map((levelId) => {
                  const index = indexById.get(levelId);
                  const level = index !== undefined ? LEVELS[index] : undefined;
                  if (level === undefined || index === undefined) return null;
                  const unlocked = isUnlocked(index, completedLevels);
                  const complete = Boolean(completedLevels[level.id]);
                  const bestRun = bestRuns[level.id];
                  const entryNode = level.nodes.find((n) => n.id === level.entryNodeId);
                  const boss = isBossLevel(level.id);
                  return (
                    <button
                      key={level.id}
                      type="button"
                      disabled={!unlocked}
                      onClick={() => {
                        loadLevel(index);
                        setScreen("game");
                      }}
                      className={`flex min-h-[56px] w-full flex-col items-start gap-0.5 rounded border px-3 py-2 text-left ${
                        unlocked
                          ? boss
                            ? "border-warn/40 text-text active:bg-warn-dim"
                            : complete
                              ? "border-accent/40 text-text active:bg-accent-dim"
                              : "border-border text-text active:bg-panel-alt"
                          : "cursor-not-allowed border-border text-text-dim opacity-50"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="flex items-center gap-1 text-xs font-medium tracking-wide text-text-bright">
                          {index + 1}. {t(level.title)}
                          {boss && <span className="text-[9px] tracking-widest text-warn">BOSS</span>}
                        </span>
                        {bestRun ? (
                          <span
                            className={`flex items-center gap-1 text-[10px] tracking-wide ${rankToneClass(bestRun.rank)}`}
                          >
                            <IconClues size={12} /> {bestRun.rank}
                          </span>
                        ) : (
                          complete && (
                            <span className="flex items-center gap-1 text-[10px] tracking-wide text-accent">
                              <IconClues size={12} /> {t(UI.done)}
                            </span>
                          )
                        )}
                        {!unlocked && <span className="text-[10px] tracking-wide text-text-dim">{t(UI.locked)}</span>}
                      </div>
                      <span className="text-[11px] text-text-dim">
                        {unlocked && entryNode ? `${entryNode.ip} — ${entryNode.orgName}` : t(UI.completePreviousTarget)}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
