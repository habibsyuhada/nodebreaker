import type { FileEntry, LevelDef } from "../levels/types";
import { clueKey, parseHoldableContent } from "./clueSystem";

/**
 * Per-run measurement and grading.
 *
 * The types live here from the persistence refactor onward because `ProfileState.bestRuns` is
 * typed against `RunResult`; the measurement and grading logic itself arrives with the scoring
 * stage. Keeping the shape stable now means adding scoring later touches no persistence code.
 */

/** Used when a level doesn't set its own `parSeconds`. */
export const DEFAULT_PAR_SECONDS = 240;

/**
 * How loud the run was, best to worst. Stored per level in `ProfileState.bestRuns`, so renaming
 * or reordering these breaks existing saves — treat the string values as a persisted format.
 */
export type Rank = "GHOST" | "CLEAN" | "LOUD" | "SLOPPY";

export const RANK_ORDER: Rank[] = ["GHOST", "CLEAN", "LOUD", "SLOPPY"];

/** mm:ss, for the results screen — this game only ever shows sub-hour run times. */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

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

function collectClueKeys(content: string, keys: Set<string>): void {
  for (const segment of parseHoldableContent(content)) {
    if (segment.kind === "clue") keys.add(clueKey(segment.type, segment.value));
  }
}

function walkEntryForClues(entry: FileEntry, keys: Set<string>): void {
  if (entry.content) collectClueKeys(entry.content, keys);
  if (entry.kind === "dir" && entry.honeypot) {
    for (const line of entry.honeypot.warningText) collectClueKeys(line, keys);
  }
  for (const child of entry.children ?? []) walkEntryForClues(child, keys);
}

/**
 * Counts distinct clues reachable through `[[type:value|label]]` markup across an entire level —
 * every node's filesystem tree (including honeypot warning text, since inspecting one is a
 * legitimate way to encounter it), port banners, privilege-escalation and backdoor narration, and
 * the level's own briefing/success text. Deliberately excludes `compares` output (the diffed
 * lines are literally the two files' own content, already walked) and anything produced by
 * decode/crack/leak/combine — those live in rule tables keyed by value, not attributable to a
 * level, and their result is implied by the run having completed at all.
 */
export function countAvailableClues(level: LevelDef): number {
  const keys = new Set<string>();
  for (const node of level.nodes) {
    walkEntryForClues(node.root, keys);
    for (const port of node.ports) collectClueKeys(port.banner, keys);
    for (const escalation of node.privilegeEscalations ?? []) {
      for (const line of escalation.narrationText) collectClueKeys(line, keys);
    }
    for (const backdoor of node.backdoors ?? []) {
      for (const line of backdoor.narrationText) collectClueKeys(line, keys);
    }
  }
  for (const line of level.briefing) collectClueKeys(line, keys);
  for (const line of level.successText) collectClueKeys(line, keys);
  return keys.size;
}

function walkEntryForHoneypots(
  entry: FileEntry,
  discovered: Record<string, true>,
): number {
  let count = entry.kind === "dir" && entry.honeypot && discovered[entry.honeypot.triggeredFact] ? 1 : 0;
  for (const child of entry.children ?? []) count += walkEntryForHoneypots(child, discovered);
  return count;
}

/** How many of the level's honeypot traps were actually triggered this run, derived from `discovered`. */
export function countHoneypotsTripped(level: LevelDef, discovered: Record<string, true>): number {
  let count = 0;
  for (const node of level.nodes) count += walkEntryForHoneypots(node.root, discovered);
  return count;
}

/**
 * GHOST/CLEAN read as a clean run, LOUD/SLOPPY as a loud one — the game's two-color palette
 * (accent = success, warn = risk) has no room for four distinct rank colors, so ranks share those
 * two Tailwind text-color classes rather than introducing new ones.
 */
export function rankToneClass(rank: Rank): "text-accent" | "text-warn" {
  return rank === "GHOST" || rank === "CLEAN" ? "text-accent" : "text-warn";
}

function gradeScore(score: number): Rank {
  if (score >= 90) return "GHOST";
  if (score >= 70) return "CLEAN";
  if (score >= 45) return "LOUD";
  return "SLOPPY";
}

export interface RunMetricsInput {
  elapsedMs: number;
  peakTrace: number;
  failedLogins: number;
}

/**
 * Turns raw run measurements into a graded `RunResult`. Penalty-point formula (starts at 100,
 * subtracts for what went loud, adds back a small bonus for thoroughness) rather than a weighted
 * average — easier to tune per-term and to show a breakdown of on the results screen:
 *
 *   score = 100
 *     - peakTrace * 0.6                                    (0..60)
 *     - honeypotsTripped * 12
 *     - failedLogins * 5
 *     - min(20, overtime-past-par-as-a-fraction * 20)       (0..20)
 *     + min(1, cluesFound / cluesAvailable) * 10            (0..10 — capped so a derived
 *                                                             credential saved on top of every
 *                                                             markup clue can't push this past 1)
 *
 * `cluesFound` is intentionally not filtered down to only markup-derived clues (unlike the
 * denominator) — it's simply `clues.length` at completion, so the min(1, ...) cap above is what
 * keeps a player who *also* collected decode/crack/leak/combine outputs from getting free bonus
 * points for intel that was never actually "available" to find as markup.
 */
export function computeRunResult(
  level: LevelDef,
  metrics: RunMetricsInput,
  discovered: Record<string, true>,
  cluesFound: number,
  now: number = Date.now(),
): RunResult {
  const cluesAvailable = countAvailableClues(level);
  const honeypotsTripped = countHoneypotsTripped(level, discovered);
  const par = level.parSeconds ?? DEFAULT_PAR_SECONDS;
  const elapsedSec = metrics.elapsedMs / 1000;
  const overtimePenalty = Math.min(20, Math.max(0, (elapsedSec - par) / par) * 20);
  const intelBonus = cluesAvailable > 0 ? Math.min(1, cluesFound / cluesAvailable) * 10 : 10;

  const rawScore =
    100 -
    metrics.peakTrace * 0.6 -
    honeypotsTripped * 12 -
    metrics.failedLogins * 5 -
    overtimePenalty +
    intelBonus;
  const score = Math.round(Math.max(0, Math.min(100, rawScore)));

  return {
    levelId: level.id,
    rank: gradeScore(score),
    score,
    elapsedMs: metrics.elapsedMs,
    peakTrace: metrics.peakTrace,
    cluesFound,
    cluesAvailable,
    honeypotsTripped,
    failedLogins: metrics.failedLogins,
    at: now,
  };
}
