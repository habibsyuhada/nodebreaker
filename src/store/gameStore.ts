import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { addClue, resumeClueCounter } from "../engine/clueSystem";
import type { Clue, ClueInput } from "../engine/clueSystem";
import { tryCombine } from "../engine/combineRules";
import { findEntry, tryLogin } from "../engine/nodeState";
import {
  AMBIENT_TRACE_LOGS,
  clampTrace,
  TRACE_MAX,
  traceLogFactId,
} from "../engine/traceSystem";
import { CRACK_DURATION_MS, tryCrack, tryDecode, tryLeakCheck } from "../engine/transformRules";
import { format, t as translate } from "../i18n";
import type { Lang } from "../i18n";
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

export interface Notification {
  id: string;
  text: string;
}

export interface MonologueEntry {
  id: string;
  lines: string[];
}

let lineCounter = 0;
function makeLine(text: string, tone: TerminalTone): TerminalLine {
  lineCounter += 1;
  return { id: `line-${lineCounter}`, text, tone };
}

const NOTIFICATION_DURATION_MS = 3200;
let notifCounter = 0;
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
function humanizeFact(fact: string): string {
  return `still missing: ${fact.replace(/-/g, " ")}`;
}

/** Lines for a blocked gated action (privilege escalation / backdoor) — shown as a player monologue, not dumped to the terminal. */
function missingFactMonologue(
  label: string,
  requiredFacts: string[],
  discovered: Record<string, true>,
  hints: Record<string, string> | undefined,
  lang: Lang,
): string[] {
  const missing = requiredFacts.filter((f) => !discovered[f]);
  return [
    format(translate(UI.gatedActionBlockedMonologue, lang), { label }),
    ...missing.map((f) => hints?.[f] ?? humanizeFact(f)),
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
  /** Sets lang and marks langChosen true — used by both the first-run LanguagePicker and the Settings toggle. */
  setLang: (lang: Lang) => void;
  /** False until the player has ever picked a language (LanguagePicker or Settings) — gates a blocking first-run overlay above every screen. Persisted. */
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
   * Short-lived toast queue — surfaces things easy to miss while looking at a different panel:
   * a new action appearing in the ActionBar. Purely transient (not persisted); each entry
   * removes itself after NOTIFICATION_DURATION_MS.
   */
  notifications: Notification[];
  pushNotification: (text: string) => void;
  dismissNotification: (id: string) => void;

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
}

function briefingLines(level: LevelDef): TerminalLine[] {
  return level.briefing.map((text) => makeLine(text, "system"));
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

  completedLevels: {},
  markLevelComplete: (levelId) =>
    set((state) => ({
      completedLevels: { ...state.completedLevels, [levelId]: true },
      outroActive: state.level.id === levelId && Boolean(state.level.outro),
    })),

  briefingActive: true,
  dismissBriefing: () => set({ briefingActive: false }),

  lang: "en",
  setLang: (lang) => set({ lang, langChosen: true }),
  langChosen: false,

  introActive: false,
  dismissIntro: () => set({ introActive: false }),

  outroActive: false,
  dismissOutro: () => set({ outroActive: false }),

  notifications: [],
  pushNotification: (text) => {
    notifCounter += 1;
    const id = `notif-${notifCounter}`;
    set((state) => ({ notifications: [...state.notifications, { id, text }] }));
    window.setTimeout(() => {
      set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) }));
    }, NOTIFICATION_DURATION_MS);
  },
  dismissNotification: (id) =>
    set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),

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
  terminalLines: briefingLines(LEVELS[0]),
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
    const { level, currentNodeId, discovered } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    const entry = node ? findEntry(node.root, path) : undefined;
    const honeypot = entry?.kind === "dir" ? entry.honeypot : undefined;

    if (honeypot && !discovered[honeypot.triggeredFact]) {
      const lines = honeypot.warningText.map((t) => makeLine(t, "warn"));
      set((state) => {
        const next = clampTrace(state.traceLevel + honeypot.tracePenalty);
        return {
          currentPath: path,
          openFilePath: null,
          inspectingPath: null,
          discovered: { ...state.discovered, [honeypot.triggeredFact]: true },
          traceLevel: next,
          burned: next >= TRACE_MAX,
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
    const { level, currentNodeId } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    const compare = node?.compares?.find((c) => c.id === compareId);
    if (!node || !compare) return;
    const entryA = findEntry(node.root, compare.pathA);
    const entryB = findEntry(node.root, compare.pathB);
    if (!entryA || !entryB) return;

    const linesA = (entryA.content ?? "").split("\n");
    const linesB = (entryB.content ?? "").split("\n");
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
    const lines = escalation.narrationText.map((t) => makeLine(t, "success"));
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
    const lines = backdoor.narrationText.map((t) => makeLine(t, "success"));
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

    set((state) => ({
      traceLevel: next,
      burned: next >= TRACE_MAX,
      discovered: nextDiscovered,
      terminalLines: lines.length ? [...state.terminalLines, ...lines] : state.terminalLines,
    }));
  },

  attemptQuickLogin: () => {
    const { level, currentNodeId, discovered } = get();
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
      lines.push(...level.successText.map((t) => makeLine(t, "success")));
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
    const { level, currentNodeId, clues, loginUsernameClueId, loginPasswordClueId } = get();
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
      lines.push(...level.successText.map((t) => makeLine(t, "success")));
    } else {
      lines.push(makeLine("ACCESS DENIED.", "warn"));
    }

    set((state) => ({
      terminalLines: [...state.terminalLines, ...lines],
      accessGrantedNodes: success
        ? { ...state.accessGrantedNodes, [currentNodeId]: true }
        : state.accessGrantedNodes,
      loginPickerOpen: false,
      loginUsernameClueId: null,
      loginPasswordClueId: null,
    }));
  },

  loadLevel: (index) => {
    const level = LEVELS[index];
    if (!level) return;
    set({
      briefingActive: true,
      introActive: Boolean(level.intro),
      outroActive: false,
      notifications: [],
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
      terminalLines: briefingLines(level),
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
    set({ completedLevels: {} });
    get().loadLevel(0);
  },
}),
{
  name: SAVE_KEY,
  storage: createJSONStorage(() => localStorage),
  version: 1,
  partialize: (state): PersistedState => ({
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
    return {
      ...(current as GameState),
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
      lang: p.lang ?? "en",
      langChosen: p.langChosen ?? false,
      introActive: p.introActive ?? false,
      outroActive: p.outroActive ?? false,
      terminalLines: briefingLines(level),
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
