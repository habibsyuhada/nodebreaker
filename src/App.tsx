import { useEffect } from "react";
import { BASE_PALETTE, LOCK_SPRITE } from "./art/sprites";
import { Sprite } from "./art/spriteEngine";
import { ActionBar, type ContextAction } from "./components/ActionBar";
import { StatusBar } from "./components/StatusBar";
import { TabBar } from "./components/TabBar";
import { TRACE_TICK_INTERVAL_MS } from "./engine/traceSystem";
import { LEVELS } from "./levels";
import { ClueInventory } from "./panels/ClueInventory";
import { FileBrowser } from "./panels/FileBrowser";
import { Terminal } from "./panels/Terminal";
import { Workbench } from "./panels/Workbench";
import { useCurrentNode, useGameStore, useLevelComplete } from "./store/gameStore";

function TraceTicker() {
  const tickTrace = useGameStore((s) => s.tickTrace);
  const traceEnabled = useCurrentNode().traceEnabled;
  const burned = useGameStore((s) => s.burned);
  const levelComplete = useLevelComplete();

  useEffect(() => {
    if (!traceEnabled || burned || levelComplete) return;
    const id = window.setInterval(tickTrace, TRACE_TICK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [traceEnabled, burned, levelComplete, tickTrace]);

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

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-semibold tracking-widest text-warn crt-flicker">
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

function SettingsPlaceholder() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <h1 className="text-sm font-semibold tracking-widest text-text-bright">SETTINGS</h1>
      <p className="text-xs text-text-dim">
        Reduced motion is auto-detected from your system. Sound and progress reset land later.
      </p>
    </div>
  );
}

function useContextActions(): ContextAction[] {
  const activePanel = useGameStore((s) => s.activePanel);
  const openFilePath = useGameStore((s) => s.openFilePath);
  const currentPath = useGameStore((s) => s.currentPath);
  const searchOpen = useGameStore((s) => s.searchOpen);
  const discovered = useGameStore((s) => s.discovered);
  const accessGranted = useGameStore((s) => s.accessGranted);
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
  const compareFiles = useGameStore((s) => s.compareFiles);
  const pivotTo = useGameStore((s) => s.pivotTo);
  const closeFile = useGameStore((s) => s.closeFile);
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

  if (levelComplete || burned) return [];

  if (activePanel === "terminal") {
    const actions: ContextAction[] = [{ id: "scan", label: "Scan Ports", onClick: runScan }];
    if (node.systemUsers.length > 0) {
      actions.push({ id: "list-users", label: "List Users", onClick: listUsers });
    }
    if (node.traceEnabled) {
      actions.push({ id: "check-trace", label: "Check Trace", onClick: checkTrace });
    }
    if (accessGranted && !discovered["logs-deleted"]) {
      actions.push({ id: "delete-logs", label: "Delete Logs", onClick: deleteLogs, danger: true });
    }
    for (const compare of node.compares ?? []) {
      const ready = compare.requiredFacts.every((f) => discovered[f]);
      const done = compare.grantsFact ? discovered[compare.grantsFact] : false;
      if (ready && !done) {
        actions.push({ id: `compare-${compare.id}`, label: compare.label, onClick: () => compareFiles(compare.id) });
      }
    }
    for (const pivot of node.pivots ?? []) {
      const ready = pivot.requiredFacts.every((f) => discovered[f]);
      if (ready) {
        actions.push({ id: `pivot-${pivot.id}`, label: pivot.label, onClick: () => pivotTo(pivot.id) });
      }
    }
    if (node.quickLogin) {
      const loginReady = node.quickLogin.requiredFacts.every((f) => discovered[f]);
      if (loginReady) {
        actions.push({ id: "login", label: node.quickLogin.label, onClick: attemptQuickLogin });
      }
    } else if (!accessGranted) {
      const hasUsername = clues.some((c) => c.type === "username");
      const hasPassword = clues.some((c) => c.type === "password");
      if (hasUsername && hasPassword) {
        actions.push({ id: "login", label: "Login", onClick: attemptLogin });
      }
    }
    return actions;
  }

  if (activePanel === "files") {
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
  }

  if (activePanel === "clues") {
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
      actions.push({ id: "open-workbench", label: "Workbench", onClick: () => setWorkbenchOpen(true) });
    }
    return actions;
  }

  return [];
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
      return <SettingsPlaceholder />;
  }
}

function App() {
  const actions = useContextActions();

  return (
    <div className="mx-auto flex h-dvh max-w-[430px] flex-col overflow-hidden bg-bg text-text">
      <div className="relative flex min-h-0 flex-1 flex-col">
        <TraceTicker />
        <StatusBar />
        <main className="min-h-0 flex-1 overflow-hidden">
          <ActivePanel />
        </main>
        <ActionBar actions={actions} />
        <TabBar />
        <div className="scanlines" />
      </div>
    </div>
  );
}

export default App;
