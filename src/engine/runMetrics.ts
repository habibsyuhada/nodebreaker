/**
 * Per-run measurement and grading.
 *
 * The types live here from the persistence refactor onward because `ProfileState.bestRuns` is
 * typed against `RunResult`; the measurement and grading logic itself arrives with the scoring
 * stage. Keeping the shape stable now means adding scoring later touches no persistence code.
 */

/**
 * How loud the run was, best to worst. Stored per level in `ProfileState.bestRuns`, so renaming
 * or reordering these breaks existing saves — treat the string values as a persisted format.
 */
export type Rank = "GHOST" | "CLEAN" | "LOUD" | "SLOPPY";

export const RANK_ORDER: Rank[] = ["GHOST", "CLEAN", "LOUD", "SLOPPY"];

/**
 * The finished measurement of one completed run. Only successful runs produce one — a burned run
 * never writes to `bestRuns`, so a failure can't overwrite a good score.
 *
 * `cluesAvailable` counts clues reachable through `[[type:value|label]]` markup only. Credentials
 * derived via decode/crack/leak/combine are deliberately excluded: they live in global rule tables
 * that can't be attributed to a level, and they're implied by the run having completed at all.
 */
export interface RunResult {
  levelId: string;
  rank: Rank;
  score: number;
  elapsedMs: number;
  peakTrace: number;
  cluesFound: number;
  cluesAvailable: number;
  honeypotsTripped: number;
  failedLogins: number;
  /** Epoch ms the run finished — lets the records screen order runs without a separate field. */
  at: number;
}
