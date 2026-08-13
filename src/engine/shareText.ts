import type { Lang } from "../i18n";
import { t } from "../i18n";
import type { LevelDef } from "../levels/types";
import type { RunResult } from "./runMetrics";
import { formatDuration } from "./runMetrics";
import { TRACE_HOT_THRESHOLD, TRACE_WARM_THRESHOLD } from "./traceSystem";

const BAR_CELLS = 10;

/** Kept as a constant rather than derived from `location` — a shared result should always point at the canonical game, even if this build is running from a preview URL or a packaged TWA. */
const GAME_URL = "https://habibsyuhada.github.io/nodebreaker/";

/**
 * Renders peak trace as a Wordle-style block bar — filled cells colored by how hot the run got
 * (green under the "warm" threshold, yellow under "hot", red above), empty cells for the rest.
 */
function traceBar(peakTrace: number): string {
  const filled = Math.min(BAR_CELLS, Math.round((peakTrace / 100) * BAR_CELLS));
  const fillChar = peakTrace >= TRACE_HOT_THRESHOLD ? "🟥" : peakTrace >= TRACE_WARM_THRESHOLD ? "🟨" : "🟩";
  return fillChar.repeat(filled) + "⬛".repeat(BAR_CELLS - filled);
}

/**
 * A spoiler-free, copy-pasteable summary of a completed run — the actual viral format (works in
 * any chat app, no image rendering required). Deliberately excludes anything discovered *during*
 * play: org names, filenames, credentials, paths. The level's title is fine to include since it's
 * already public in LevelSelect before the level is ever played.
 */
export function buildShareText(level: LevelDef, result: RunResult, lang: Lang): string {
  // Campaign levels get a "Level N —" prefix; a Daily Contract's title already says what it is
  // (see `generateDailyContract`) and isn't a real LEVELS index, so level.index is negative for it.
  const label = level.index >= 0 ? `Level ${level.index + 1} — ${t(level.title, lang)}` : t(level.title, lang);
  return [
    `NODEBREAKER · ${label}`,
    `${result.rank} — ${formatDuration(result.elapsedMs)}`,
    `${traceBar(result.peakTrace)}  ${result.peakTrace}%`,
    `INTEL ${result.cluesFound}/${result.cluesAvailable}`,
    GAME_URL,
  ].join("\n");
}
