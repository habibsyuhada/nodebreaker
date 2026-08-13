import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { setAudioOutput } from "../audio/synth";
import { addClue, resumeClueCounter } from "../engine/clueSystem";
import type { Clue, ClueInput } from "../engine/clueSystem";
import { tryCombine } from "../engine/combineRules";
import { findEntry, tryLogin } from "../engine/nodeState";
import { computeRunResult } from "../engine/runMetrics";
import type { RunResult } from "../engine/runMetrics";
import {
  AMBIENT_TRACE_LOGS,
  clampTrace,
  TRACE_MAX,
  traceLogFactId,
} from "../engine/traceSystem";
import { CRACK_DURATION_MS, tryCrack, tryDecode, tryLeakCheck } from "../engine/transformRules";
import { detectLang, format, t as translate } from "../i18n";
import type { Lang, LocalizedText } from "../i18n";
import { UI } from "../i18n/ui";
import { LEVELS } from "../levels";
import type { LevelDef, LevelNodeDef } from "../levels/types";

export type PanelId = "terminal" | "files" | "clues" | "settings";

export type ScreenId = "menu" | "levels" | "game" | "settings";

export type TerminalTone = "input" | "output" | "success" | "warn" | "system";

export interface TerminalLine {
  id: string;
  text: string;
  tone: TerminalTone;
}

export interface CombineFeedback {
  kind: "success" | "invalid";
  message: string;
}

export interface MonologueEntry {
  id: string;
  lines: string[];
}

export interface AudioSettings {
  muted: boolean;
  /** 0..1, multiplied into every generated sound via the synth's master gain. */
  volume: number;
}

/**
 * Everything the player accumulates across levels, as one nested object.
 *
 * Persistence in this store is hand-written in three places (the `PersistedState` interface,
 * `partialize`, and `merge`), so every new top-level persisted field is three edits and one
 * chance to forget. Nesting account-wide state here means those three places stop growing:
 * new profile fields only need a default in `DEFAULT_PROFILE` and a spread in `mergeProfile`.
 */
export interface ProfileState {
  /** Best (not latest) result per level id — a worse replay never overwrites a better run. */
  bestRuns: Record<string, RunResult>;
  /** Free-form tallies driving achievements, bumped through the single `bumpCounter` helper. */
  counters: Record<string, number>;
  /** Achievement id -> epoch ms it was unlocked. */
  achievements: Record<string, number>;
  daily: {
    /** Seed of the most recently completed daily contract, or null if none ever was. */
    lastCompletedSeed: string | null;
    streak: number;
    longest: number;
  };
  audio: AudioSettings;
  /** Level ids where a persistent foothold was planted — read by later levels that gate on one. */
  footholds: Record<string, true>;
}

/**
 * Measurements for the run currently in progress. Reset by `loadLevel`, unlike `ProfileState`.
 * Kept separate from the profile precisely so `loadLevel` can clear it in one assignment.
 */
export interface RunState {
  /** Set when the briefing is dismissed — the clock starts when the player starts it, like trace. */
  startedAt: number | null;
  endedAt: number | null;
  peakTrace: number;
  failedLogins: number;
  /** The graded result, once the run has completed successfully. Null while in progress or burned. */
  result: RunResult | null;
}

const DEFAULT_PROFILE: ProfileState = {
  bestRuns: {},
  counters: {},
  achievements: {},
  daily: { lastCompletedSeed: null, streak: 0, longest: 0 },
  audio: { muted: false, volume: 0.8 },
  footholds: {},
};

const DEFAULT_RUN: RunState = {
  startedAt: null,
  endedAt: null,
  peakTrace: 0,
  failedLogins: 0,
  result: null,
};

/**
 * Restores a persisted profile onto the current defaults.
 *
 * A single shallow spread is not enough: `{...DEFAULT_PROFILE, ...persisted}` would replace whole
 * sub-objects, so a save written before a new sub-field existed (say `daily.longest`) would
 * rehydrate that field as undefined. Each sub-object therefore gets its own spread.
 */
function mergeProfile(persisted: Partial<ProfileState> | undefined): ProfileState {
  return {
    ...DEFAULT_PROFILE,
    ...persisted,
    daily: { ...DEFAULT_PROFILE.daily, ...persisted?.daily },
    audio: { ...DEFAULT_PROFILE.audio, ...persisted?.audio },
  };
}

/**
 * Everything "Reset Progress" wipes, in one place — so account-wide state can't be added to the
 * store and silently survive a reset. Preferences are deliberately not progress: the language
 * choice and the audio settings carry over, since wiping a save shouldn't un-mute the game.
 */
function freshAccount(current: ProfileState) {
  return {
    completedLevels: {} as Record<string, true>,
    networkMapHintShown: false,
    profile: { ...DEFAULT_PROFILE, audio: { ...current.audio } },
    run: { ...DEFAULT_RUN },
  };
}

let lineCounter = 0;
function makeLine(text: string, tone: TerminalTone): TerminalLine {
  lineCounter += 1;
  return { id: `line-${lineCounter}`, text, tone };
}

let monologueCounter = 0;

function computeLevelComplete(
  level: LevelDef,
  accessGrantedNodes: Record<string, true>,
  discovered: Record<string, true>,
): boolean {
  if (Object.keys(accessGrantedNodes).length === 0) return false;
  const required = level.completionRequires ?? [];
  return required.every((f) => discovered[f]);
}

/** Fallback label for a missing fact when the level data doesn't supply a `requiredFactHints` entry. */
function humanizeFact(fact: string, lang: Lang): string {
  return format(translate(UI.stillMissingFact, lang), { fact: fact.replace(/-/g, " ") });
}

/** Lines for a blocked gated action (privilege escalation / backdoor) — shown as a player monologue, not dumped to the terminal. */
function missingFactMonologue(
  label: LocalizedText,
  requiredFacts: string[],
  discovered: Record<string, true>,
  hints: Record<string, LocalizedText> | undefined,
  lang: Lang,
): string[] {
  const missing = requiredFacts.filter((f) => !discovered[f]);
  return [
    format(translate(UI.gatedActionBlockedMonologue, lang), { label: translate(label, lang) }),
    ...missing.map((f) => (hints?.[f] ? translate(hints[f], lang) : humanizeFact(f, lang))),
  ];
}

/** Node context to stamp onto a newly-created clue — whichever node was current when it was made. */
function nodeTag(level: LevelDef, currentNodeId: string): { id: string; label: string } {
  const node = level.nodes.find((n) => n.id === currentNodeId);
  return { id: currentNodeId, label: node?.orgName ?? currentNodeId };
}

interface GameState {
  /** Which top-level screen is showing — always boots to "menu" regardless of saved progress. */
  screen: ScreenId;
  setScreen: (screen: ScreenId) => void;

  /** Account-wide accumulated state — see ProfileState. Survives loadLevel, wiped by resetProgress. */
  profile: ProfileState;
  /** Measurements for the run in progress — see RunState. Reset by loadLevel. */
  run: RunState;
  /** Updates audio preferences and applies them to the synth immediately. */
  setAudio: (patch: Partial<AudioSettings>) => void;

  /** Level ids that have been completed at least once — drives Level Select's lock/checkmark state. */
  completedLevels: Record<string, true>;
  /** Sets outroActive (if the level has an outro) in the same call — see outroActive doc below. */
  markLevelComplete: (levelId: string) => void;

  /**
   * True from the moment a level (re)loads until the player dismisses its mission-briefing
   * dialog. While true, TraceTicker doesn't tick and a blocking overlay covers the game screen —
   * the player decides when the clock starts, not the level load.
   */
  briefingActive: boolean;
  dismissBriefing: () => void;

  /** UI language for scene content (SceneCard/SceneDef text) — persisted, doesn't affect other UI strings. */
  lang: Lang;
  /** Sets lang and marks langChosen true — used by both the Settings toggle and the MainMenu's dismissable language chip. */
  setLang: (lang: Lang) => void;
  /**
   * False until the player has ever explicitly confirmed or overridden the auto-detected
   * language — gates a small, non-blocking suggestion chip on MainMenu, not a first-run overlay.
   * `lang` itself is always usable from the very first boot via `detectLang()`. Persisted.
   */
  langChosen: boolean;

  /**
   * True from the moment a level (re)loads until the player dismisses its intro victim scene
   * (if the level has one — levels without `intro` never set this true). Covers BriefingDialog
   * too, so the order is: intro scene → briefing → play.
   */
  introActive: boolean;
  dismissIntro: () => void;

  /**
   * True once markLevelComplete fires for a level with an `outro` scene, until the player
   * dismisses it. Covers StatusBar/ActionBar/TabBar so it reads as a full scene, not a panel.
   */
  outroActive: boolean;
  dismissOutro: () => void;

  /**
   * Queue of player "session notes" dialogs — a clue getting saved, or a gated action (privilege
   * escalation / backdoor) attempted before its preconditions are met. Rendered one at a time by
   * MonologueDialog and dismissed by the player, instead of a corner toast or a terminal dump.
   */
  monologueQueue: MonologueEntry[];
  pushMonologue: (lines: string[]) => void;
  dismissMonologue: (id: string) => void;

  /** Whether the "restart this level from scratch" confirm dialog is open. Transient, not persisted. */
  restartConfirmOpen: boolean;
  openRestartConfirm: () => void;
  closeRestartConfirm: () => void;

  activePanel: PanelId;
  setActivePanel: (panel: PanelId) => void;

  level: LevelDef;
  currentNodeId: string;

  /** Every node id the player has been on this level (via loadLevel's entry node or pivotTo). Drives the Network Map's node list. */
  visitedNodeIds: Record<string, true>;
  /** Whether the Network Map overlay is open — transient UI state, not persisted. */
  networkMapOpen: boolean;
  setNetworkMapOpen: (open: boolean) => void;
  /**
   * Whether the player has ever opened the Network Map (persisted, account-wide — not per-level).
   * Gates NetworkMapHint: it appears once, automatically, the first time a level's pivot count
   * makes the map actually useful, and never again once the player has found it themselves.
   */
  networkMapHintShown: boolean;
  dismissNetworkMapHint: () => void;

  currentPath: string[];
  openFilePath: string[] | null;
  /** Set by tap-hold on a file/dir row in Files — shows its FileEntry.metadata without opening/entering it. */
  inspectingPath: string[] | null;

  searchOpen: boolean;
  searchKeyword: string | null;

  discovered: Record<string, true>;
  /** Which node ids have had a successful login — per-node, since a level can require logging into several. */
  accessGrantedNodes: Record<string, true>;
  traceLevel: number;
  burned: boolean;

  terminalLines: TerminalLine[];
  /**
   * How many terminalLines have finished their typewriter reveal. Lives here (not local Terminal
   * state) so switching panels and back doesn't retype the whole scrollback — only genuinely new
   * lines appended since last view animate in.
   */
  terminalRevealCount: number;
  setTerminalRevealCount: (count: number) => void;
  clues: Clue[];

  workbenchOpen: boolean;
  slotA: Clue | null;
  slotB: Clue | null;
  combineFeedback: CombineFeedback | null;

  selectedClueId: string | null;
  /** Clue id of a hash currently being cracked — null when no crack is in progress. */
  crackingClueId: string | null;
  transformFeedback: CombineFeedback | null;

  goToPath: (path: string[]) => void;
  openFile: (path: string[]) => void;
  closeFile: () => void;
  openInspect: (path: string[]) => void;
  closeInspect: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchKeyword: (keyword: string) => void;
  runScan: () => void;
  listUsers: () => void;
  checkTrace: () => void;
  deleteLogs: () => void;
  falsifyLogs: () => void;
  compareFiles: (compareId: string) => void;
  pivotTo: (pivotId: string) => void;
  escalatePrivilege: (escalationId: string) => void;
  plantBackdoor: (backdoorId: string) => void;
  checkConnections: () => void;
  goQuiet: () => void;
  tickTrace: () => void;
  /** Bumps `run.peakTrace` if `value` is a new high — called from a traceLevel-reactive effect in TraceTicker, so it catches every source of trace change (ticks, honeypots, reducers) without each of them needing to know about scoring. */
  notePeakTrace: (value: number) => void;
  attemptQuickLogin: () => void;

  /**
   * Generic (non-quickLogin) Login is a deliberate pick, not an auto-guess: on multi-node levels
   * the Clue Inventory can hold credentials for several different nodes at once, and silently
   * looping through every username x password combo (the old behavior) meant the terminal could
   * narrate an attempt with a clue the player didn't consciously choose. The picker's selection
   * state is transient — not persisted, resets whenever it closes.
   */
  loginPickerOpen: boolean;
  setLoginPickerOpen: (open: boolean) => void;
  loginUsernameClueId: string | null;
  loginPasswordClueId: string | null;
  selectLoginUsername: (id: string) => void;
  selectLoginPassword: (id: string) => void;
  confirmLogin: () => void;

  loadLevel: (index: number) => void;
  /** Returns true if a new clue was added, false if it was already saved. */
  saveClue: (input: ClueInput) => boolean;

  setWorkbenchOpen: (open: boolean) => void;
  placeInSlot: (slot: "A" | "B", clue: Clue) => void;
  clearSlot: (slot: "A" | "B") => void;
  clearSlots: () => void;
  combineSlots: () => void;
  clearCombineFeedback: () => void;

  toggleClueSelection: (id: string) => void;
  decodeClue: () => void;
  startCrackHash: () => void;
  checkLeakDatabase: () => void;
  clearTransformFeedback: () => void;

  /** Wipes the localStorage save and returns to a fresh Level 1. */
  resetProgress: () => void;

  /**
   * Epoch ms of the last real pointer interaction anywhere in the app — updated by one listener
   * on the app root (App.tsx), not per component. Drives GestureCoach's idle-hint timer. Reset by
   * `loadLevel` so each level gets its own fresh idle window. Transient — not persisted, since
   * restarting the idle timer after a reload is harmless.
   */
  lastInteractionAt: number;
  touchInteraction: () => void;
  /** Generic one-off fact setter — used by GestureCoach so its once-per-level hint guards don't need a bespoke store action each. */
  markDiscovered: (fact: string) => void;
}

function briefingLines(level: LevelDef, lang: Lang): TerminalLine[] {
  return level.briefing.map((text) => makeLine(translate(text, lang), "system"));
}

/**
 * What survives a reload: which level/node you're on and what you've earned there, plus which
 * levels have ever been completed (Level Select's lock/checkmark state) and whether the current
 * level's mission-briefing dialog has already been dismissed. Deliberately excludes transient
 * navigation/UI state (which top-level screen is showing, active panel, file/search/workbench
 * state, terminal scrollback and its reveal animation, in-flight selection/crack/transform
 * feedback) — those reset fresh on load rather than trying to resume mid-interaction. `screen`
 * in particular always boots to "menu" on purpose, even with a save present.
 */
interface PersistedState {
  /**
   * Account-wide state and the in-progress run's measurements. These two nest everything added
   * from the scoring/achievements/daily work onward, so this interface, `partialize`, and `merge`
   * stop growing a line per feature — see ProfileState's note.
   */
  profile: ProfileState;
  run: RunState;
  levelIndex: number;
  currentNodeId: string;
  discovered: Record<string, true>;
  accessGrantedNodes: Record<string, true>;
  traceLevel: number;
  burned: boolean;
  clues: Clue[];
  completedLevels: Record<string, true>;
  briefingActive: boolean;
  visitedNodeIds: Record<string, true>;
  networkMapHintShown: boolean;
  lang: Lang;
  langChosen: boolean;
  introActive: boolean;
  outroActive: boolean;
}

const SAVE_KEY = "nodebreaker-save";

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      screen: "menu",
  setScreen: (screen) => set({ screen }),

  profile: DEFAULT_PROFILE,
  run: DEFAULT_RUN,
  setAudio: (patch) => {
    const audio = { ...get().profile.audio, ...patch };
    setAudioOutput(audio);
    set((state) => ({ profile: { ...state.profile, audio } }));
  },

  completedLevels: {},
  markLevelComplete: (levelId) =>
    set((state) => {
      if (state.level.id !== levelId) {
        // Defensive — the single call site always passes the current level's own id, but a
        // RunResult is meaningless for a level that isn't the one actually being completed.
        return { completedLevels: { ...state.completedLevels, [levelId]: true } };
      }

      const endedAt = Date.now();
      const elapsedMs = state.run.startedAt !== null ? endedAt - state.run.startedAt : 0;
      const result = computeRunResult(
        state.level,
        { elapsedMs, peakTrace: state.run.peakTrace, failedLogins: state.run.failedLogins },
        state.discovered,
        state.clues.length,
        endedAt,
      );
      const prevBest = state.profile.bestRuns[levelId];
      const bestRuns =
        !prevBest || result.score > prevBest.score
          ? { ...state.profile.bestRuns, [levelId]: result }
          : state.profile.bestRuns;

      return {
        completedLevels: { ...state.completedLevels, [levelId]: true },
        outroActive: Boolean(state.level.outro),
        run: { ...state.run, endedAt, result },
        profile: { ...state.profile, bestRuns },
      };
    }),

  briefingActive: true,
  dismissBriefing: () =>
    set((state) => ({
      briefingActive: false,
      // ?? guards against a second dismiss (shouldn't happen, but restarting an already-running
      // clock would be worse than a no-op) — the player decides when the run clock starts, same
      // as trace itself.
      run: { ...state.run, startedAt: state.run.startedAt ?? Date.now() },
    })),

  lang: detectLang(),
  setLang: (lang) => set({ lang, langChosen: true }),
  langChosen: false,

  introActive: false,
  dismissIntro: () => set({ introActive: false }),

  outroActive: false,
  dismissOutro: () => set({ outroActive: false }),

  monologueQueue: [],
  pushMonologue: (lines) => {
    monologueCounter += 1;
    const id = `monologue-${monologueCounter}`;
    set((state) => ({ monologueQueue: [...state.monologueQueue, { id, lines }] }));
  },
  dismissMonologue: (id) =>
    set((state) => ({ monologueQueue: state.monologueQueue.filter((m) => m.id !== id) })),

  restartConfirmOpen: false,
  openRestartConfirm: () => set({ restartConfirmOpen: true }),
  closeRestartConfirm: () => set({ restartConfirmOpen: false }),

  activePanel: "terminal",
  setActivePanel: (panel) => set({ activePanel: panel }),

  level: LEVELS[0],
  currentNodeId: LEVELS[0].entryNodeId,
  visitedNodeIds: { [LEVELS[0].entryNodeId]: true },
  networkMapOpen: false,
  setNetworkMapOpen: (open) => set({ networkMapOpen: open, networkMapHintShown: open || get().networkMapHintShown }),
  networkMapHintShown: false,
  dismissNetworkMapHint: () => set({ networkMapHintShown: true }),
  currentPath: [],
  openFilePath: null,
  inspectingPath: null,
  searchOpen: false,
  searchKeyword: null,
  discovered: {},
  accessGrantedNodes: {},
  traceLevel: 0,
  burned: false,
  terminalLines: briefingLines(LEVELS[0], detectLang()),
  terminalRevealCount: 0,
  setTerminalRevealCount: (count) => set({ terminalRevealCount: count }),
  clues: [],
  workbenchOpen: false,
  slotA: null,
  slotB: null,
  combineFeedback: null,
  selectedClueId: null,
  crackingClueId: null,
  transformFeedback: null,

  goToPath: (path) => {
    const { level, currentNodeId, discovered, lang } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    const entry = node ? findEntry(node.root, path) : undefined;
    const honeypot = entry?.kind === "dir" ? entry.honeypot : undefined;

    if (honeypot && !discovered[honeypot.triggeredFact]) {
      const lines = honeypot.warningText.map((t) => makeLine(translate(t, lang), "warn"));
      set((state) => {
        const next = clampTrace(state.traceLevel + honeypot.tracePenalty);
        const burnedNow = next >= TRACE_MAX;
        return {
          currentPath: path,
          openFilePath: null,
          inspectingPath: null,
          discovered: { ...state.discovered, [honeypot.triggeredFact]: true },
          traceLevel: next,
          burned: burnedNow,
          // Unlike tickTrace, this path has no top-level "already burned" guard (a burned game
          // blocks navigation via the UI, not the store), so the state.burned check here matters.
          run: burnedNow && !state.burned ? { ...state.run, endedAt: Date.now() } : state.run,
          terminalLines: [...state.terminalLines, ...lines],
        };
      });
      return;
    }

    set({ currentPath: path, openFilePath: null, inspectingPath: null });
  },

  openFile: (path) => {
    const { level, currentNodeId, discovered } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    if (!node) return;
    const entry = findEntry(node.root, path);
    if (!entry || entry.kind !== "file") return;

    // File content is shown entirely within the Files panel's own view (see FileBrowser.tsx) —
    // deliberately not echoed into the Terminal too, so a read doesn't leave a duplicate copy in
    // the scrollback.
    const locked = Boolean(entry.requiresFact && !discovered[entry.requiresFact]);
    const nextDiscovered =
      !locked && entry.grantsFact && !discovered[entry.grantsFact]
        ? { ...discovered, [entry.grantsFact]: true as const }
        : discovered;

    set({
      openFilePath: path,
      inspectingPath: null,
      currentPath: path.slice(0, -1),
      searchOpen: false,
      discovered: nextDiscovered,
    });
  },

  closeFile: () => set({ openFilePath: null }),

  openInspect: (path) => set({ inspectingPath: path, openFilePath: null, searchOpen: false }),
  closeInspect: () => set({ inspectingPath: null }),

  openSearch: () => set({ searchOpen: true, openFilePath: null, inspectingPath: null }),
  closeSearch: () => set({ searchOpen: false }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  runScan: () => {
    const { level, currentNodeId } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    if (!node) return;
    const lines: TerminalLine[] = [
      makeLine("$ scan-ports " + node.ip, "input"),
      ...node.ports.map((p) => makeLine(`  ${p.port}/tcp  ${p.service}  ${p.banner}`, "output")),
    ];
    set((state) => ({
      terminalLines: [...state.terminalLines, ...lines],
      discovered: { ...state.discovered, scanned: true },
    }));
  },

  listUsers: () => {
    const { level, currentNodeId } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    if (!node) return;
    const lines: TerminalLine[] = [
      makeLine("$ list-users", "input"),
      ...node.systemUsers.map((u) => makeLine(`  ${u.username}  (${u.role})`, "output")),
    ];
    set((state) => ({
      terminalLines: [...state.terminalLines, ...lines],
      discovered: { ...state.discovered, "listed-users": true },
    }));
  },

  checkTrace: () => {
    const { traceLevel } = get();
    const mood =
      traceLevel >= 70
        ? "Getting hot. Wrap up soon."
        : traceLevel >= 40
          ? "Someone might be watching. Stay careful."
          : "Still quiet.";
    const lines: TerminalLine[] = [
      makeLine("$ trace-status", "input"),
      makeLine(`Current exposure: ${traceLevel}%. ${mood}`, traceLevel >= 70 ? "warn" : "output"),
    ];
    set((state) => ({ terminalLines: [...state.terminalLines, ...lines] }));
  },

  deleteLogs: () => {
    const lines: TerminalLine[] = [
      makeLine("$ clear-logs --target access.log", "input"),
      makeLine("Wiping suspicious session entries...", "output"),
      makeLine("Access logs cleared. Trace pressure easing.", "success"),
    ];
    set((state) => ({
      terminalLines: [...state.terminalLines, ...lines],
      discovered: { ...state.discovered, "logs-deleted": true },
      traceLevel: clampTrace(state.traceLevel - 15),
    }));
  },

  falsifyLogs: () => {
    const { level, currentNodeId } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    if (!node?.logFalsification) return;
    const lines: TerminalLine[] = [
      makeLine("$ edit-log --target access.log --mode overwrite", "input"),
      makeLine("Rewriting session entries to match routine traffic...", "output"),
      makeLine("Logs falsified. Nothing here looks out of place.", "success"),
    ];
    const reduction = node.logFalsification.tracePenaltyReduction;
    set((state) => ({
      terminalLines: [...state.terminalLines, ...lines],
      discovered: { ...state.discovered, "logs-falsified": true },
      traceLevel: clampTrace(state.traceLevel - reduction),
    }));
  },

  compareFiles: (compareId) => {
    const { level, currentNodeId, lang } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    const compare = node?.compares?.find((c) => c.id === compareId);
    if (!node || !compare) return;
    const entryA = findEntry(node.root, compare.pathA);
    const entryB = findEntry(node.root, compare.pathB);
    if (!entryA || !entryB) return;

    // The two languages' content must have matching line counts and matching changed-line
    // positions for this diff to make sense — enforced by the i18n content validator, not here.
    const linesA = translate(entryA.content ?? "", lang).split("\n");
    const linesB = translate(entryB.content ?? "", lang).split("\n");
    const rowCount = Math.max(linesA.length, linesB.length);
    const lines: TerminalLine[] = [
      makeLine(`$ diff ${compare.pathA.at(-1)} ${compare.pathB.at(-1)}`, "input"),
    ];
    for (let i = 0; i < rowCount; i++) {
      const a = linesA[i] ?? "";
      const b = linesB[i] ?? "";
      if (a === b) {
        lines.push(makeLine(`  ${a}`, "output"));
        continue;
      }
      if (a) lines.push(makeLine(`- ${a}`, "warn"));
      if (b) lines.push(makeLine(`+ ${b}`, "success"));
    }

    set((state) => ({
      terminalLines: [...state.terminalLines, ...lines],
      discovered: compare.grantsFact
        ? { ...state.discovered, [compare.grantsFact]: true }
        : state.discovered,
    }));
  },

  pivotTo: (pivotId) => {
    const { level, currentNodeId } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    const pivot = node?.pivots?.find((p) => p.id === pivotId);
    if (!node || !pivot) return;
    const target = level.nodes.find((n) => n.id === pivot.targetNodeId);
    if (!target) return;

    const lines: TerminalLine[] = [
      makeLine(`$ pivot --target ${target.ip}`, "input"),
      makeLine(`Connection re-routed to ${target.ip}.`, "success"),
    ];

    set((state) => ({
      currentNodeId: target.id,
      visitedNodeIds: { ...state.visitedNodeIds, [target.id]: true },
      networkMapOpen: false,
      currentPath: [],
      openFilePath: null,
      inspectingPath: null,
      searchOpen: false,
      searchKeyword: null,
      terminalLines: [...state.terminalLines, ...lines],
    }));
  },

  escalatePrivilege: (escalationId) => {
    const { level, currentNodeId, discovered, lang } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    const escalation = node?.privilegeEscalations?.find((e) => e.id === escalationId);
    if (!node || !escalation) return;
    if (!escalation.requiredFacts.every((f) => discovered[f])) {
      get().pushMonologue(
        missingFactMonologue(escalation.label, escalation.requiredFacts, discovered, escalation.requiredFactHints, lang),
      );
      return;
    }
    const lines = escalation.narrationText.map((t) => makeLine(translate(t, lang), "success"));
    set((state) => ({
      terminalLines: [...state.terminalLines, ...lines],
      discovered: { ...state.discovered, [escalation.grantsFact]: true },
    }));
  },

  plantBackdoor: (backdoorId) => {
    const { level, currentNodeId, discovered, lang } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    const backdoor = node?.backdoors?.find((b) => b.id === backdoorId);
    if (!node || !backdoor) return;
    if (!backdoor.requiredFacts.every((f) => discovered[f])) {
      get().pushMonologue(
        missingFactMonologue(backdoor.label, backdoor.requiredFacts, discovered, backdoor.requiredFactHints, lang),
      );
      return;
    }
    const lines = backdoor.narrationText.map((t) => makeLine(translate(t, lang), "success"));
    set((state) => ({
      terminalLines: [...state.terminalLines, ...lines],
      discovered: { ...state.discovered, [backdoor.grantsFact]: true },
    }));
  },

  checkConnections: () => {
    const { level, currentNodeId, traceLevel } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    if (!node || node.adminOnlineThreshold === undefined) return;
    const online = traceLevel >= node.adminOnlineThreshold;
    const lines: TerminalLine[] = [
      makeLine("$ check-connections", "input"),
      makeLine(
        online
          ? "ADMIN ONLINE — an administrator is actively connected. Proceed carefully."
          : "No other active sessions detected. Clear for now.",
        online ? "warn" : "output",
      ),
    ];
    set((state) => ({ terminalLines: [...state.terminalLines, ...lines] }));
  },

  goQuiet: () => {
    const lines: TerminalLine[] = [
      makeLine("$ disconnect --soft --reroute", "input"),
      makeLine("Backing off and rerouting through a cleaner path...", "output"),
      makeLine("Exposure reduced.", "success"),
    ];
    set((state) => ({
      terminalLines: [...state.terminalLines, ...lines],
      traceLevel: clampTrace(state.traceLevel - 20),
    }));
  },

  tickTrace: () => {
    const { level, currentNodeId, traceLevel, burned, accessGrantedNodes, discovered } = get();
    if (burned) return;
    const node = level.nodes.find((n) => n.id === currentNodeId);
    if (!node?.traceEnabled) return;
    if (computeLevelComplete(level, accessGrantedNodes, discovered)) return;

    const next = clampTrace(traceLevel + 2);
    const newlyCrossed = AMBIENT_TRACE_LOGS.filter(
      (log) => next >= log.atPercent && !discovered[traceLogFactId(log.atPercent)],
    );

    const lines = newlyCrossed.map((log) => makeLine(log.text, "warn"));
    const nextDiscovered = newlyCrossed.length
      ? {
          ...discovered,
          ...Object.fromEntries(newlyCrossed.map((log) => [traceLogFactId(log.atPercent), true as const])),
        }
      : discovered;

    const burnedNow = next >= TRACE_MAX;
    set((state) => ({
      traceLevel: next,
      burned: burnedNow,
      discovered: nextDiscovered,
      terminalLines: lines.length ? [...state.terminalLines, ...lines] : state.terminalLines,
      // Reached from tickTrace's own `if (burned) return` guard above: this only runs on the
      // exact tick that first crosses 100%, so no extra "already burned" check is needed here.
      run: burnedNow ? { ...state.run, endedAt: Date.now() } : state.run,
    }));
  },

  notePeakTrace: (value) =>
    set((state) => (value > state.run.peakTrace ? { run: { ...state.run, peakTrace: value } } : {})),

  attemptQuickLogin: () => {
    const { level, currentNodeId, discovered, lang } = get();
    const node: LevelNodeDef | undefined = level.nodes.find((n) => n.id === currentNodeId);
    if (!node?.quickLogin) return;
    const { quickLogin } = node;
    const ready = quickLogin.requiredFacts.every((f) => discovered[f]);
    if (!ready) return;

    const success = tryLogin(node, quickLogin.username, quickLogin.password);
    const lines: TerminalLine[] = [
      makeLine(`$ login --user ${quickLogin.username} --pass ********`, "input"),
      makeLine("AUTHENTICATING...", "output"),
    ];
    if (success) {
      lines.push(...level.successText.map((t) => makeLine(translate(t, lang), "success")));
    } else {
      lines.push(makeLine("ACCESS DENIED.", "warn"));
    }

    set((state) => ({
      terminalLines: [...state.terminalLines, ...lines],
      accessGrantedNodes: success
        ? { ...state.accessGrantedNodes, [currentNodeId]: true }
        : state.accessGrantedNodes,
    }));
  },

  loginPickerOpen: false,
  setLoginPickerOpen: (open) => {
    if (!open) {
      set({ loginPickerOpen: false });
      return;
    }
    // Opening fresh: auto-preselect when there's exactly one of each, so single-credential
    // levels (everything but Level 8 so far) stay a two-tap confirm instead of forcing a pick
    // from a list of one.
    const { clues } = get();
    const usernames = clues.filter((c) => c.type === "username");
    const passwords = clues.filter((c) => c.type === "password");
    set({
      loginPickerOpen: true,
      loginUsernameClueId: usernames.length === 1 ? usernames[0].id : null,
      loginPasswordClueId: passwords.length === 1 ? passwords[0].id : null,
    });
  },
  loginUsernameClueId: null,
  loginPasswordClueId: null,
  selectLoginUsername: (id) =>
    set((state) => ({ loginUsernameClueId: state.loginUsernameClueId === id ? null : id })),
  selectLoginPassword: (id) =>
    set((state) => ({ loginPasswordClueId: state.loginPasswordClueId === id ? null : id })),

  confirmLogin: () => {
    const { level, currentNodeId, clues, loginUsernameClueId, loginPasswordClueId, lang } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    const usernameClue = clues.find((c) => c.id === loginUsernameClueId);
    const passwordClue = clues.find((c) => c.id === loginPasswordClueId);
    if (!node || !usernameClue || !passwordClue) return;

    const success = tryLogin(node, usernameClue.value, passwordClue.value);
    const lines: TerminalLine[] = [
      makeLine(`$ login --user ${usernameClue.value} --pass ********`, "input"),
      makeLine("AUTHENTICATING...", "output"),
    ];
    if (success) {
      lines.push(...level.successText.map((t) => makeLine(translate(t, lang), "success")));
    } else {
      lines.push(makeLine("ACCESS DENIED.", "warn"));
    }

    set((state) => ({
      terminalLines: [...state.terminalLines, ...lines],
      accessGrantedNodes: success
        ? { ...state.accessGrantedNodes, [currentNodeId]: true }
        : state.accessGrantedNodes,
      run: success ? state.run : { ...state.run, failedLogins: state.run.failedLogins + 1 },
      loginPickerOpen: false,
      loginUsernameClueId: null,
      loginPasswordClueId: null,
    }));
  },

  loadLevel: (index) => {
    const level = LEVELS[index];
    if (!level) return;
    set({
      briefingActive: !level.coldOpen,
      introActive: Boolean(level.intro),
      outroActive: false,
      monologueQueue: [],
      restartConfirmOpen: false,
      level,
      currentNodeId: level.entryNodeId,
      visitedNodeIds: { [level.entryNodeId]: true },
      networkMapOpen: false,
      loginPickerOpen: false,
      loginUsernameClueId: null,
      loginPasswordClueId: null,
      currentPath: [],
      openFilePath: null,
      inspectingPath: null,
      searchOpen: false,
      searchKeyword: null,
      discovered: {},
      accessGrantedNodes: {},
      traceLevel: 0,
      burned: false,
      terminalLines: briefingLines(level, get().lang),
      terminalRevealCount: 0,
      clues: [],
      workbenchOpen: false,
      slotA: null,
      slotB: null,
      combineFeedback: null,
      selectedClueId: null,
      crackingClueId: null,
      transformFeedback: null,
      activePanel: "terminal",
      // coldOpen levels skip BriefingDialog entirely, so dismissBriefing (the usual place the run
      // clock starts) never fires — start it here instead. Non-coldOpen levels leave it null; the
      // player decides when their run starts, same as trace.
      run: { ...DEFAULT_RUN, startedAt: level.coldOpen ? Date.now() : null },
      lastInteractionAt: Date.now(),
    });
  },

  saveClue: (input) => {
    const { clues, level, currentNodeId, lang } = get();
    const result = addClue(clues, input, nodeTag(level, currentNodeId));
    if (result.added) {
      set({ clues: result.clues });
      get().pushMonologue([format(translate(UI.clueSavedMonologue, lang), { label: input.label })]);
    }
    return result.added;
  },

  setWorkbenchOpen: (open) => set({ workbenchOpen: open }),

  placeInSlot: (slot, clue) => {
    set((state) => {
      const otherSlot = slot === "A" ? state.slotB : state.slotA;
      if (otherSlot?.id === clue.id) return {};
      return slot === "A" ? { slotA: clue } : { slotB: clue };
    });
  },

  clearSlot: (slot) => set(slot === "A" ? { slotA: null } : { slotB: null }),
  clearSlots: () => set({ slotA: null, slotB: null }),

  combineSlots: () => {
    const { slotA, slotB, clues, level, currentNodeId } = get();
    if (!slotA || !slotB) return;
    const result = tryCombine(slotA, slotB);
    if (result) {
      const added = addClue(
        clues,
        { type: result.type, value: result.value, label: result.label, source: "workbench" },
        nodeTag(level, currentNodeId),
      );
      set({
        clues: added.clues,
        slotA: null,
        slotB: null,
        combineFeedback: { kind: "success", message: `${result.value} — ${result.label}` },
      });
    } else {
      set({
        slotA: null,
        slotB: null,
        combineFeedback: { kind: "invalid", message: "Doesn't match. No harm done — try another pair." },
      });
    }
  },

  clearCombineFeedback: () => set({ combineFeedback: null }),

  toggleClueSelection: (id) =>
    set((state) => ({ selectedClueId: state.selectedClueId === id ? null : id })),

  decodeClue: () => {
    const { selectedClueId, clues, level, currentNodeId } = get();
    const clue = clues.find((c) => c.id === selectedClueId);
    if (!clue) return;
    const result = tryDecode(clue);
    if (result) {
      const added = addClue(
        clues,
        { type: result.type, value: result.value, label: result.label, source: "decode" },
        nodeTag(level, currentNodeId),
      );
      set({
        clues: added.clues,
        selectedClueId: null,
        transformFeedback: { kind: "success", message: `${result.value} — ${result.label}` },
      });
    } else {
      set({
        selectedClueId: null,
        transformFeedback: { kind: "invalid", message: "Doesn't decode to anything useful." },
      });
    }
  },

  checkLeakDatabase: () => {
    const { selectedClueId, clues, level, currentNodeId } = get();
    const clue = clues.find((c) => c.id === selectedClueId);
    if (!clue) return;
    const result = tryLeakCheck(clue);
    if (result) {
      const added = addClue(
        clues,
        { type: result.type, value: result.value, label: result.label, source: "leak database" },
        nodeTag(level, currentNodeId),
      );
      set({
        clues: added.clues,
        selectedClueId: null,
        transformFeedback: { kind: "success", message: `${result.value} — ${result.label}` },
      });
    } else {
      set({
        selectedClueId: null,
        transformFeedback: { kind: "invalid", message: "No match in the leak database." },
      });
    }
  },

  startCrackHash: () => {
    const { selectedClueId, clues, crackingClueId } = get();
    if (crackingClueId) return;
    const clue = clues.find((c) => c.id === selectedClueId);
    if (!clue || clue.type !== "hash") return;
    const result = tryCrack(clue);

    set((state) => ({
      crackingClueId: clue.id,
      terminalLines: [
        ...state.terminalLines,
        makeLine(`$ crack-hash ${clue.value}`, "input"),
        makeLine("Running cracker against known wordlists...", "output"),
      ],
    }));

    window.setTimeout(() => {
      if (get().crackingClueId !== clue.id) return;
      if (result) {
        const { clues: liveClues, level: liveLevel, currentNodeId: liveNodeId } = get();
        const added = addClue(
          liveClues,
          { type: result.type, value: result.value, label: result.label, source: "hash cracker" },
          nodeTag(liveLevel, liveNodeId),
        );
        set((state) => ({
          clues: added.clues,
          crackingClueId: null,
          selectedClueId: null,
          terminalLines: [...state.terminalLines, makeLine(`Password recovered: ${result.value}`, "success")],
        }));
      } else {
        set((state) => ({
          crackingClueId: null,
          terminalLines: [...state.terminalLines, makeLine("Cracker failed — hash not in the wordlist.", "warn")],
        }));
      }
    }, CRACK_DURATION_MS);
  },

  clearTransformFeedback: () => set({ transformFeedback: null }),

  resetProgress: () => {
    useGameStore.persist.clearStorage();
    set(freshAccount(get().profile));
    get().loadLevel(0);
  },

  lastInteractionAt: Date.now(),
  touchInteraction: () => set({ lastInteractionAt: Date.now() }),
  markDiscovered: (fact) => set((state) => ({ discovered: { ...state.discovered, [fact]: true } })),
}),
{
  name: SAVE_KEY,
  storage: createJSONStorage(() => localStorage),
  version: 1,
  partialize: (state): PersistedState => ({
    profile: state.profile,
    run: state.run,
    levelIndex: state.level.index,
    currentNodeId: state.currentNodeId,
    discovered: state.discovered,
    accessGrantedNodes: state.accessGrantedNodes,
    traceLevel: state.traceLevel,
    burned: state.burned,
    clues: state.clues,
    completedLevels: state.completedLevels,
    briefingActive: state.briefingActive,
    visitedNodeIds: state.visitedNodeIds,
    networkMapHintShown: state.networkMapHintShown,
    lang: state.lang,
    langChosen: state.langChosen,
    introActive: state.introActive,
    outroActive: state.outroActive,
  }),
  merge: (persisted, current) => {
    const p = persisted as Partial<PersistedState> | undefined;
    if (!p || p.levelIndex === undefined) return current as GameState;
    const level = LEVELS[p.levelIndex] ?? LEVELS[0];
    const clues = p.clues ?? [];
    resumeClueCounter(clues);
    const profile = mergeProfile(p.profile);
    // The synth keeps its own copy of the audio settings, so a restored mute has to be pushed
    // into it here — otherwise the first sound of the session plays at the default volume.
    setAudioOutput(profile.audio);
    const lang = p.lang ?? detectLang();
    return {
      ...(current as GameState),
      profile,
      run: { ...DEFAULT_RUN, ...p.run },
      level,
      currentNodeId: p.currentNodeId ?? level.entryNodeId,
      discovered: p.discovered ?? {},
      accessGrantedNodes: p.accessGrantedNodes ?? {},
      traceLevel: p.traceLevel ?? 0,
      burned: p.burned ?? false,
      clues,
      completedLevels: p.completedLevels ?? {},
      briefingActive: p.briefingActive ?? true,
      visitedNodeIds: p.visitedNodeIds ?? { [p.currentNodeId ?? level.entryNodeId]: true },
      networkMapHintShown: p.networkMapHintShown ?? false,
      lang,
      langChosen: p.langChosen ?? false,
      introActive: p.introActive ?? false,
      outroActive: p.outroActive ?? false,
      terminalLines: briefingLines(level, lang),
      terminalRevealCount: 0,
    };
  },
},
  ),
);

export function useCurrentNode(): LevelNodeDef {
  return useGameStore((s) => {
    const node = s.level.nodes.find((n) => n.id === s.currentNodeId);
    if (!node) throw new Error(`Unknown node id: ${s.currentNodeId}`);
    return node;
  });
}

export function useLevelComplete(): boolean {
  return useGameStore((s) => computeLevelComplete(s.level, s.accessGrantedNodes, s.discovered));
}

/** Whether the current node specifically has been logged into — most gating (login button, post-access actions) is per-node. */
export function useCurrentNodeAccessGranted(): boolean {
  return useGameStore((s) => Boolean(s.accessGrantedNodes[s.currentNodeId]));
}
