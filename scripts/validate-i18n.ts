/**
 * i18n content validator — run with `npm run validate-i18n`.
 *
 * Promoting level content (FileEntry.content, narration, labels, ...) to `LocalizedText` in
 * Stage 20 opened three ways a translation can silently break the game rather than fail loudly:
 *
 *   1. A `[[type:value|label]]` clue markup's `value` gets translated by mistake — the game
 *      becomes unwinnable in that language, since credentials/transform rules are matched by
 *      exact value, and nothing in the type system catches a translator changing it.
 *   2. Prose gets translated so thoroughly that the six search preset chips (password/admin/
 *      key/backup/config/email — the *only* search input in the whole game) no longer match
 *      content they used to, silently making a level unsolvable via Search.
 *   3. A `FileCompareDef`'s two diffed files end up with different line counts between
 *      languages, breaking Compare Configs' line-by-line diff for one language.
 *
 * This script checks all three across every level, in both directions (missing-in-en and
 * missing-in-id are both reported), and exits non-zero on any failure so it can gate CI.
 */
import { parseHoldableContent, clueKey } from "../src/engine/clueSystem";
import { generateDailyContract } from "../src/engine/dailyContract";
import { findEntry, searchFilesystem } from "../src/engine/nodeState";
import type { Lang, LocalizedText } from "../src/i18n";
import { t } from "../src/i18n";
import { LEVELS } from "../src/levels";
import type { FileEntry, LevelDef } from "../src/levels/types";

const LANGS: Lang[] = ["en", "id"];
const SEARCH_CHIPS = ["password", "admin", "key", "backup", "config", "email"];

let failures = 0;

function fail(message: string): void {
  failures += 1;
  console.error(`  ✗ ${message}`);
}

/** A Proxy that reports every fact as discovered — search parity is a translation concern, orthogonal to which facts a real playthrough has unlocked yet. */
const ALL_DISCOVERED = new Proxy(
  {},
  { get: () => true },
) as Record<string, true>;

function clueKeysOf(text: string): Set<string> {
  const keys = new Set<string>();
  for (const segment of parseHoldableContent(text)) {
    if (segment.kind === "clue") keys.add(clueKey(segment.type, segment.value));
  }
  return keys;
}

function diffSets(a: Set<string>, b: Set<string>): { onlyInA: string[]; onlyInB: string[] } {
  return {
    onlyInA: [...a].filter((k) => !b.has(k)),
    onlyInB: [...b].filter((k) => !a.has(k)),
  };
}

/** Checks 1: every language variant of a LocalizedText embeds the exact same set of clue markup values. */
function checkClueParity(label: string, text: LocalizedText | undefined): void {
  if (text === undefined || typeof text === "string") return; // nothing to compare against
  const [enKeys, idKeys] = LANGS.map((lang) => clueKeysOf(t(text, lang)));
  const { onlyInA, onlyInB } = diffSets(enKeys, idKeys);
  if (onlyInA.length || onlyInB.length) {
    fail(
      `${label}: clue markup differs between languages` +
        (onlyInA.length ? ` — only in en: ${onlyInA.join(", ")}` : "") +
        (onlyInB.length ? ` — only in id: ${onlyInB.join(", ")}` : ""),
    );
  }
}

function walkTreeForClueParity(entry: FileEntry, path: string, levelId: string): void {
  checkClueParity(`${levelId} ${path}`, entry.content);
  if (entry.honeypot) {
    entry.honeypot.warningText.forEach((line, i) =>
      checkClueParity(`${levelId} ${path} honeypot.warningText[${i}]`, line),
    );
  }
  for (const child of entry.children ?? []) {
    const childPath = path === "/" ? `/${child.name}` : `${path}/${child.name}`;
    walkTreeForClueParity(child, childPath, levelId);
  }
}

/** Checks 2: each of the six search chips matches the same file paths in every language. */
function checkSearchParity(level: LevelDef): void {
  for (const node of level.nodes) {
    for (const chip of SEARCH_CHIPS) {
      const [enPaths, idPaths] = LANGS.map((lang) =>
        new Set(searchFilesystem(node.root, chip, ALL_DISCOVERED, lang).map((r) => r.path.join("/"))),
      );
      const { onlyInA, onlyInB } = diffSets(enPaths, idPaths);
      if (onlyInA.length || onlyInB.length) {
        fail(
          `${level.id} ${node.id}: search chip "${chip}" matches differ between languages` +
            (onlyInA.length ? ` — only in en: ${onlyInA.join(", ")}` : "") +
            (onlyInB.length ? ` — only in id: ${onlyInB.join(", ")}` : ""),
        );
      }
    }
  }
}

/** Checks 3: both files in every FileCompareDef keep the same line count across languages, so the diff stays coherent regardless of active language. */
function checkCompareLineParity(level: LevelDef): void {
  for (const node of level.nodes) {
    for (const compare of node.compares ?? []) {
      for (const [side, path] of [["A", compare.pathA], ["B", compare.pathB]] as const) {
        const entry = findEntry(node.root, path);
        if (!entry?.content) continue;
        const counts = LANGS.map((lang) => t(entry.content!, lang).split("\n").length);
        if (counts[0] !== counts[1]) {
          fail(
            `${level.id} ${node.id} compare "${compare.id}" side ${side} (${path.join("/")}): ` +
              `line count differs between languages (en=${counts[0]}, id=${counts[1]})`,
          );
        }
      }
    }
  }
}

function validateLevel(level: LevelDef): void {
  console.log(`Checking ${level.id}...`);
  checkClueParity(`${level.id} title`, level.title);
  level.briefing.forEach((line, i) => checkClueParity(`${level.id} briefing[${i}]`, line));
  level.successText.forEach((line, i) => checkClueParity(`${level.id} successText[${i}]`, line));

  for (const node of level.nodes) {
    walkTreeForClueParity(node.root, node.root.name, level.id);
    for (const escalation of node.privilegeEscalations ?? []) {
      escalation.narrationText.forEach((line, i) =>
        checkClueParity(`${level.id} ${node.id} escalation ${escalation.id} narrationText[${i}]`, line),
      );
    }
    for (const backdoor of node.backdoors ?? []) {
      backdoor.narrationText.forEach((line, i) =>
        checkClueParity(`${level.id} ${node.id} backdoor ${backdoor.id} narrationText[${i}]`, line),
      );
    }
  }

  checkSearchParity(level);
  checkCompareLineParity(level);
}

for (const level of LEVELS) validateLevel(level);

// The Daily Contract (Stage 22) is never one of LEVELS — it's regenerated from a UTC-day seed —
// so it needs its own i18n coverage. Its content is templated (see `generateDailyContract`), not
// hand-authored per-day, so a spread of sample seeds is enough to catch a template bug; it doesn't
// need one check per calendar day.
const SAMPLE_DAILY_SEEDS = [
  "2024-01-01",
  "2024-06-15",
  "2025-02-29",
  "2025-12-31",
  "2030-07-04",
  "2099-11-20",
];
for (const seed of SAMPLE_DAILY_SEEDS) validateLevel(generateDailyContract(seed));

console.log("");
if (failures > 0) {
  console.error(`${failures} i18n parity failure(s) found.`);
  process.exit(1);
} else {
  console.log(`All ${LEVELS.length} levels and ${SAMPLE_DAILY_SEEDS.length} sampled Daily Contract seeds pass i18n parity checks.`);
}
