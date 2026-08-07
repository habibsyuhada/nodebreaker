import { useEffect, useRef, useState } from "react";
import { BASE_PALETTE, LOCK_SPRITE } from "./art/sprites";
import { Sprite } from "./art/spriteEngine";
import { playAmbientPulse, playGlitch } from "./audio/synth";
import { ActionBar, type ContextAction } from "./components/ActionBar";
import { BriefingDialog } from "./components/BriefingDialog";
import { NetworkMap } from "./components/NetworkMap";
import { NotificationToast } from "./components/NotificationToast";
import { StatusBar } from "./components/StatusBar";
import { TabBar } from "./components/TabBar";
import { TRACE_HOT_THRESHOLD, TRACE_TICK_INTERVAL_MS } from "./engine/traceSystem";
import { LEVELS } from "./levels";
import { ClueInventory } from "./panels/ClueInventory";
import { FileBrowser } from "./panels/FileBrowser";
import { Terminal } from "./panels/Terminal";
import { Workbench } from "./panels/Workbench";
import { LevelSelect } from "./screens/LevelSelect";
import { MainMenu } from "./screens/MainMenu";
import {
  type PanelId,
  useCurrentNode,
  useCurrentNodeAccessGranted,
  useGameStore,
  useLevelComplete,
} from "./store/gameStore";

function TraceTicker() {
  const tickTrace = useGameStore((s) => s.tickTrace);
  const traceLevel = useGameStore((s) => s.traceLevel);
  const traceEnabled = useCurrentNode().traceEnabled;
  const burned = useGameStore((s) => s.burned);
  const level = useGameStore((s) => s.level);
  const briefingActive = useGameStore((s) => s.briefingActive);
  const markLevelComplete = useGameStore((s) => s.markLevelComplete);
  const levelComplete = useLevelComplete();
  const hotAlertedRef = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    hotAlertedRef.current = false;
    completedRef.current = false;
  }, [level.id]);

  useEffect(() => {
    if (!traceEnabled || burned || levelComplete || briefingActive) return;
    const id = window.setInterval(() => {
      tickTrace();
      if (traceLevel > 0) playAmbientPulse();
    }, TRACE_TICK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [traceEnabled, burned, levelComplete, briefingActive, tickTrace, traceLevel]);

  useEffect(() => {
    if (traceLevel >= TRACE_HOT_THRESHOLD && !hotAlertedRef.current) {
      hotAlertedRef.current = true;
      navigator.vibrate?.([15, 40, 15]);
      playGlitch();
    }
  }, [traceLevel]);

  useEffect(() => {
    if (levelComplete && !completedRef.current) {
      completedRef.current = true;
      markLevelComplete(level.id);
    }
  }, [levelComplete, level.id, markLevelComplete]);

  return null;
}

/**
 * Watches useContextActions()'s cross-panel `notableActions` (login, post-access recon, pivot,
 * escalation, workbench — deliberately not the routine Close/Up/Search/per-selection-transform
 * chrome, which appears and disappears too often from ordinary navigation to be worth announcing)
 * and toasts any that weren't there a moment ago ("New action unlocked: X"). Cross-panel matters:
 * a fact discovered while reading a file can unlock Login on the Terminal panel, and a player who
 * isn't currently looking at the Terminal would otherwise never notice. The baseline resets
 * (silently, no toast) whenever the node/level changes or the mission briefing dismisses, so the
 * level's starting toolkit never fires as "new".
 */
function ActionNotifier({ actions }: { actions: ContextAction[] }) {
  const pushNotification = useGameStore((s) => s.pushNotification);
  const briefingActive = useGameStore((s) => s.briefingActive);
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const levelId = useGameStore((s) => s.level.id);
  const seenIdsRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    seenIdsRef.current = null;
  }, [currentNodeId, levelId, briefingActive]);

  useEffect(() => {
    if (briefingActive) return;
    const currentIds = new Set(actions.map((a) => a.id));
    const seen = seenIdsRef.current;
    if (seen) {
      for (const action of actions) {
        if (!seen.has(action.id)) pushNotification(`New action unlocked: ${action.label}`);
      }
    }
    seenIdsRef.current = currentIds;
  }, [actions, briefingActive, pushNotification]);

  return null;
}

function BreachedScreen() {
  const level = useGameStore((s) => s.level);
  const loadLevel = useGameStore((s) => s.loadLevel);
  const nextLevel = LEVELS[level.index + 1];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <Sprite grid={LOCK_SPRITE} palette={BASE_PALETTE} size={64} title="unlocked" />
      <p className="text-sm font-semibold tracking-widest text-accent">NODE BREACHED</p>
      <p className="text-xs text-text-dim">
        {nextLevel
          ? "Next target is online whenever you're ready."
          : "More levels are on the way. Replay this one, or sit with the win."}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => loadLevel(level.index)}
          className="min-h-[44px] rounded border border-border px-4 text-xs font-medium tracking-wide text-text-dim active:bg-panel-alt"
        >
          Replay Level
        </button>
        {nextLevel && (
          <button
            type="button"
            onClick={() => loadLevel(nextLevel.index)}
            className="min-h-[44px] rounded border border-accent/40 px-4 text-xs font-medium tracking-wide text-accent active:bg-accent-dim"
          >
            Next Level
          </button>
        )}
      </div>
    </div>
  );
}

function BurnedScreen() {
  const level = useGameStore((s) => s.level);
  const loadLevel = useGameStore((s) => s.loadLevel);

  useEffect(() => {
    navigator.vibrate?.([30, 60, 30, 60, 30]);
    playGlitch();
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-semibold tracking-widest text-warn crt-flicker glitch-shift">
        CONNECTION LOST — NODE BURNED
      </p>
      <p className="text-xs text-text-dim">
        They caught the session before you finished. The node is off-limits now — try again.
      </p>
      <button
        type="button"
        onClick={() => loadLevel(level.index)}
        className="min-h-[44px] rounded border border-warn/40 px-4 text-xs font-medium tracking-wide text-warn active:bg-warn-dim"
      >
        Retry Level
      </button>
    </div>
  );
}

function SettingsPanel() {
  const resetProgress = useGameStore((s) => s.resetProgress);
  const setScreen = useGameStore((s) => s.setScreen);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const t = window.setTimeout(() => setConfirming(false), 3000);
    return () => window.clearTimeout(t);
  }, [confirming]);

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <h1 className="text-sm font-semibold tracking-widest text-text-bright">SETTINGS</h1>
      <p className="text-xs text-text-dim">
        Reduced motion is auto-detected from your system, and sound respects it too.
      </p>
      <p className="text-xs text-text-dim">
        Your level, clues, and trace save automatically to this device — closing the tab won't
        lose your place.
      </p>
      <button
        type="button"
        onClick={() => {
          if (confirming) {
            resetProgress();
            setConfirming(false);
          } else {
            setConfirming(true);
          }
        }}
        className="min-h-[44px] rounded border border-warn/40 px-4 text-xs font-medium tracking-wide text-warn active:bg-warn-dim"
      >
        {confirming ? "Tap again to confirm — this can't be undone" : "Reset Progress"}
      </button>
      <button
        type="button"
        onClick={() => setScreen("menu")}
        className="min-h-[44px] rounded border border-border px-4 text-xs font-medium tracking-wide text-text-dim active:bg-panel-alt"
      >
        Back to Main Menu
      </button>
    </div>
  );
}

interface ContextActionsResult {
  /** Actions for whichever panel is currently active — what ActionBar renders. */
  actions: ContextAction[];
  /**
   * Every `notable` action across all panels, computed regardless of which one is active — so
   * ActionNotifier can catch e.g. Login becoming available on the Terminal panel while the player
   * is sitting in Files. Deliberately NOT scoped to activePanel, unlike `actions`.
   */
  notableActions: ContextAction[];
}

function useContextActions(): ContextActionsResult {
  const activePanel = useGameStore((s) => s.activePanel);
  const openFilePath = useGameStore((s) => s.openFilePath);
  const inspectingPath = useGameStore((s) => s.inspectingPath);
  const currentPath = useGameStore((s) => s.currentPath);
  const searchOpen = useGameStore((s) => s.searchOpen);
  const discovered = useGameStore((s) => s.discovered);
  const accessGranted = useCurrentNodeAccessGranted();
  const burned = useGameStore((s) => s.burned);
  const clues = useGameStore((s) => s.clues);
  const workbenchOpen = useGameStore((s) => s.workbenchOpen);
  const slotA = useGameStore((s) => s.slotA);
  const slotB = useGameStore((s) => s.slotB);
  const selectedClueId = useGameStore((s) => s.selectedClueId);
  const crackingClueId = useGameStore((s) => s.crackingClueId);
  const runScan = useGameStore((s) => s.runScan);
  const listUsers = useGameStore((s) => s.listUsers);
  const checkTrace = useGameStore((s) => s.checkTrace);
  const deleteLogs = useGameStore((s) => s.deleteLogs);
  const falsifyLogs = useGameStore((s) => s.falsifyLogs);
  const compareFiles = useGameStore((s) => s.compareFiles);
  const pivotTo = useGameStore((s) => s.pivotTo);
  const escalatePrivilege = useGameStore((s) => s.escalatePrivilege);
  const plantBackdoor = useGameStore((s) => s.plantBackdoor);
  const checkConnections = useGameStore((s) => s.checkConnections);
  const goQuiet = useGameStore((s) => s.goQuiet);
  const closeFile = useGameStore((s) => s.closeFile);
  const closeInspect = useGameStore((s) => s.closeInspect);
  const openSearch = useGameStore((s) => s.openSearch);
  const closeSearch = useGameStore((s) => s.closeSearch);
  const goToPath = useGameStore((s) => s.goToPath);
  const attemptQuickLogin = useGameStore((s) => s.attemptQuickLogin);
  const attemptLogin = useGameStore((s) => s.attemptLogin);
  const setWorkbenchOpen = useGameStore((s) => s.setWorkbenchOpen);
  const combineSlots = useGameStore((s) => s.combineSlots);
  const clearSlots = useGameStore((s) => s.clearSlots);
  const decodeClue = useGameStore((s) => s.decodeClue);
  const startCrackHash = useGameStore((s) => s.startCrackHash);
  const checkLeakDatabase = useGameStore((s) => s.checkLeakDatabase);
  const node = useCurrentNode();
  const levelComplete = useLevelComplete();

  if (levelComplete || burned) return { actions: [], notableActions: [] };

  const terminalActions: ContextAction[] = (() => {
    const actions: ContextAction[] = [{ id: "scan", label: "Scan Ports", onClick: runScan }];
    if (node.systemUsers.length > 0) {
      actions.push({ id: "list-users", label: "List Users", onClick: listUsers });
    }
    if (node.traceEnabled) {
      actions.push({ id: "check-trace", label: "Check Trace", onClick: checkTrace });
    }
    if (accessGranted && !discovered["logs-deleted"] && !node.logFalsification) {
      actions.push({ id: "delete-logs", label: "Delete Logs", onClick: deleteLogs, danger: true, notable: true });
    }
    if (node.logFalsification && accessGranted && !discovered["logs-falsified"]) {
      const ready = node.logFalsification.requiredFacts.every((f) => discovered[f]);
      if (ready) {
        actions.push({
          id: "falsify-logs",
          label: node.logFalsification.label,
          onClick: falsifyLogs,
          danger: true,
          notable: true,
        });
      }
    }
    for (const compare of node.compares ?? []) {
      const ready = compare.requiredFacts.every((f) => discovered[f]);
      const done = compare.grantsFact ? discovered[compare.grantsFact] : false;
      if (ready && !done) {
        actions.push({
          id: `compare-${compare.id}`,
          label: compare.label,
          onClick: () => compareFiles(compare.id),
          notable: true,
        });
      }
    }
    for (const pivot of node.pivots ?? []) {
      const ready = pivot.requiredFacts.every((f) => discovered[f]);
      if (ready) {
        actions.push({
          id: `pivot-${pivot.id}`,
          label: pivot.label,
          onClick: () => pivotTo(pivot.id),
          notable: true,
        });
      }
    }
    for (const esc of node.privilegeEscalations ?? []) {
      const ready = accessGranted && esc.requiredFacts.every((f) => discovered[f]);
      const done = discovered[esc.grantsFact];
      if (ready && !done) {
        actions.push({
          id: `escalate-${esc.id}`,
          label: esc.label,
          onClick: () => escalatePrivilege(esc.id),
          notable: true,
        });
      }
    }
    for (const bd of node.backdoors ?? []) {
      const ready = accessGranted && bd.requiredFacts.every((f) => discovered[f]);
      const done = discovered[bd.grantsFact];
      if (ready && !done) {
        actions.push({
          id: `backdoor-${bd.id}`,
          label: bd.label,
          onClick: () => plantBackdoor(bd.id),
          notable: true,
        });
      }
    }
    if (node.adminOnlineThreshold !== undefined) {
      actions.push({ id: "check-connections", label: "Check Connections", onClick: checkConnections });
      actions.push({ id: "hide", label: "Hide", onClick: goQuiet });
    }
    if (node.quickLogin) {
      const loginReady = node.quickLogin.requiredFacts.every((f) => discovered[f]);
      if (loginReady) {
        actions.push({ id: "login", label: node.quickLogin.label, onClick: attemptQuickLogin, notable: true });
      }
    } else if (!accessGranted) {
      const hasUsername = clues.some((c) => c.type === "username");
      const hasPassword = clues.some((c) => c.type === "password");
      if (hasUsername && hasPassword) {
        actions.push({ id: "login", label: "Login", onClick: attemptLogin, notable: true });
      }
    }
    return actions;
  })();

  const filesActions: ContextAction[] = (() => {
    if (inspectingPath) {
      return [{ id: "close-inspect", label: "Close", onClick: closeInspect }];
    }
    if (openFilePath) {
      return [{ id: "close", label: "Close", onClick: closeFile }];
    }
    if (searchOpen) {
      return [{ id: "close-search", label: "Close Search", onClick: closeSearch }];
    }
    const actions: ContextAction[] = [];
    if (currentPath.length > 0) {
      actions.push({ id: "up", label: ".. Up", onClick: () => goToPath(currentPath.slice(0, -1)) });
    }
    actions.push({ id: "search", label: "Search", onClick: openSearch });
    return actions;
  })();

  const cluesActions: ContextAction[] = (() => {
    if (workbenchOpen) {
      const actions: ContextAction[] = [];
      if (slotA && slotB) {
        actions.push({ id: "combine", label: "Combine", onClick: combineSlots });
      }
      if (slotA || slotB) {
        actions.push({ id: "clear-slots", label: "Clear Slots", onClick: clearSlots });
      }
      actions.push({
        id: "close-workbench",
        label: "Close Workbench",
        onClick: () => setWorkbenchOpen(false),
      });
      return actions;
    }
    const actions: ContextAction[] = [];
    const selectedClue = clues.find((c) => c.id === selectedClueId);
    if (selectedClue?.type === "encoded") {
      actions.push({ id: "decode", label: "Decode", onClick: decodeClue });
    }
    if (selectedClue?.type === "hash") {
      actions.push({
        id: "crack",
        label: crackingClueId === selectedClue.id ? "Cracking..." : "Crack Hash",
        onClick: startCrackHash,
        disabled: crackingClueId !== null,
      });
    }
    if (selectedClue?.type === "email") {
      actions.push({ id: "leak-check", label: "Check Leak DB", onClick: checkLeakDatabase });
    }
    if (clues.length >= 2) {
      actions.push({
        id: "open-workbench",
        label: "Workbench",
        onClick: () => setWorkbenchOpen(true),
        notable: true,
      });
    }
    return actions;
  })();

  const byPanel: Record<PanelId, ContextAction[]> = {
    terminal: terminalActions,
    files: filesActions,
    clues: cluesActions,
    settings: [],
  };

  return {
    actions: byPanel[activePanel],
    notableActions: [...terminalActions, ...filesActions, ...cluesActions].filter((a) => a.notable),
  };
}

function ActivePanel() {
  const activePanel = useGameStore((s) => s.activePanel);
  const burned = useGameStore((s) => s.burned);
  const workbenchOpen = useGameStore((s) => s.workbenchOpen);
  const levelComplete = useLevelComplete();

  if (burned) return <BurnedScreen />;
  if (levelComplete) return <BreachedScreen />;

  switch (activePanel) {
    case "terminal":
      return <Terminal />;
    case "files":
      return <FileBrowser />;
    case "clues":
      return workbenchOpen ? <Workbench /> : <ClueInventory />;
    case "settings":
      return <SettingsPanel />;
  }
}

function App() {
  const screen = useGameStore((s) => s.screen);
  const { actions, notableActions } = useContextActions();

  return (
    <div className="mx-auto flex h-dvh max-w-[430px] flex-col overflow-hidden bg-bg text-text">
      <div className="relative flex min-h-0 flex-1 flex-col">
        {screen === "menu" && <MainMenu />}
        {screen === "levels" && <LevelSelect />}
        {screen === "game" && (
          <>
            <TraceTicker />
            <ActionNotifier actions={notableActions} />
            <StatusBar />
            <main className="min-h-0 flex-1 overflow-hidden">
              <ActivePanel />
            </main>
            <ActionBar actions={actions} />
            <TabBar />
            <NotificationToast />
            <NetworkMap />
            <BriefingDialog />
          </>
        )}
        <div className="scanlines" />
      </div>
    </div>
  );
}

export default App;
