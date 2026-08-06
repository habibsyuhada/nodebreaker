import { create } from "zustand";
import { addClue } from "../engine/clueSystem";
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
import { LEVELS } from "../levels";
import type { LevelDef, LevelNodeDef } from "../levels/types";

export type PanelId = "terminal" | "files" | "clues" | "settings";

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

let lineCounter = 0;
function makeLine(text: string, tone: TerminalTone): TerminalLine {
  lineCounter += 1;
  return { id: `line-${lineCounter}`, text, tone };
}

function computeLevelComplete(
  level: LevelDef,
  accessGrantedNodes: Record<string, true>,
  discovered: Record<string, true>,
): boolean {
  if (Object.keys(accessGrantedNodes).length === 0) return false;
  const required = level.completionRequires ?? [];
  return required.every((f) => discovered[f]);
}

interface GameState {
  activePanel: PanelId;
  setActivePanel: (panel: PanelId) => void;

  level: LevelDef;
  currentNodeId: string;

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
  attemptLogin: () => void;
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
}

function briefingLines(level: LevelDef): TerminalLine[] {
  return level.briefing.map((text) => makeLine(text, "system"));
}

export const useGameStore = create<GameState>((set, get) => ({
  activePanel: "terminal",
  setActivePanel: (panel) => set({ activePanel: panel }),

  level: LEVELS[0],
  currentNodeId: LEVELS[0].entryNodeId,
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

    const filename = path[path.length - 1];
    const lines: TerminalLine[] = [makeLine(`$ cat ${filename}`, "input")];
    const locked = Boolean(entry.requiresFact && !discovered[entry.requiresFact]);
    if (locked) {
      lines.push(makeLine("PERMISSION DENIED — administrator privileges required.", "warn"));
    } else if (entry.readable === false) {
      lines.push(makeLine("[binary data — not human-readable]", "warn"));
    } else {
      lines.push(...(entry.content ?? "").split("\n").map((l) => makeLine(l, "output")));
    }

    const nextDiscovered =
      !locked && entry.grantsFact && !discovered[entry.grantsFact]
        ? { ...discovered, [entry.grantsFact]: true as const }
        : discovered;

    set((state) => ({
      openFilePath: path,
      inspectingPath: null,
      currentPath: path.slice(0, -1),
      searchOpen: false,
      terminalLines: [...state.terminalLines, ...lines],
      discovered: nextDiscovered,
    }));
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
      currentPath: [],
      openFilePath: null,
      inspectingPath: null,
      searchOpen: false,
      searchKeyword: null,
      terminalLines: [...state.terminalLines, ...lines],
    }));
  },

  escalatePrivilege: (escalationId) => {
    const { level, currentNodeId } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    const escalation = node?.privilegeEscalations?.find((e) => e.id === escalationId);
    if (!node || !escalation) return;
    const lines = escalation.narrationText.map((t) => makeLine(t, "success"));
    set((state) => ({
      terminalLines: [...state.terminalLines, ...lines],
      discovered: { ...state.discovered, [escalation.grantsFact]: true },
    }));
  },

  plantBackdoor: (backdoorId) => {
    const { level, currentNodeId } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    const backdoor = node?.backdoors?.find((b) => b.id === backdoorId);
    if (!node || !backdoor) return;
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

  attemptLogin: () => {
    const { level, currentNodeId, clues } = get();
    const node = level.nodes.find((n) => n.id === currentNodeId);
    if (!node) return;
    const usernames = clues.filter((c) => c.type === "username");
    const passwords = clues.filter((c) => c.type === "password");
    if (usernames.length === 0 || passwords.length === 0) return;

    let matchedUser: Clue | null = null;
    for (const u of usernames) {
      const hasMatch = passwords.some((p) => tryLogin(node, u.value, p.value));
      if (hasMatch) {
        matchedUser = u;
        break;
      }
    }

    const attemptedUser = matchedUser ?? usernames[0];
    const success = matchedUser !== null;
    const lines: TerminalLine[] = [
      makeLine(`$ login --user ${attemptedUser.value} --pass ********`, "input"),
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

  loadLevel: (index) => {
    const level = LEVELS[index];
    if (!level) return;
    set({
      level,
      currentNodeId: level.entryNodeId,
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
    const { clues } = get();
    const result = addClue(clues, input);
    if (result.added) set({ clues: result.clues });
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
    const { slotA, slotB, clues } = get();
    if (!slotA || !slotB) return;
    const result = tryCombine(slotA, slotB);
    if (result) {
      const added = addClue(clues, {
        type: result.type,
        value: result.value,
        label: result.label,
        source: "workbench",
      });
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
    const { selectedClueId, clues } = get();
    const clue = clues.find((c) => c.id === selectedClueId);
    if (!clue) return;
    const result = tryDecode(clue);
    if (result) {
      const added = addClue(clues, {
        type: result.type,
        value: result.value,
        label: result.label,
        source: "decode",
      });
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
    const { selectedClueId, clues } = get();
    const clue = clues.find((c) => c.id === selectedClueId);
    if (!clue) return;
    const result = tryLeakCheck(clue);
    if (result) {
      const added = addClue(clues, {
        type: result.type,
        value: result.value,
        label: result.label,
        source: "leak database",
      });
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
        const added = addClue(get().clues, {
          type: result.type,
          value: result.value,
          label: result.label,
          source: "hash cracker",
        });
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
}));

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
