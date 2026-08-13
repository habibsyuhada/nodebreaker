import { useEffect, useRef, useState } from "react";
import { BASE_PALETTE, LOCK_SPRITE } from "./art/sprites";
import { Sprite } from "./art/spriteEngine";
import { playAmbientPulse, playGlitch } from "./audio/synth";
import { ActionBar, type ContextAction } from "./components/ActionBar";
import { BriefingDialog } from "./components/BriefingDialog";
import { LanguagePicker } from "./components/LanguagePicker";
import { LoginPicker } from "./components/LoginPicker";
import { MonologueDialog } from "./components/MonologueDialog";
import { NetworkMap } from "./components/NetworkMap";
import { NetworkMapHint } from "./components/NetworkMapHint";
import { RestartLevelDialog } from "./components/RestartLevelDialog";
import { StatusBar } from "./components/StatusBar";
import { StoryScene } from "./components/StoryScene";
import { TabBar } from "./components/TabBar";
import { TRACE_HOT_THRESHOLD, TRACE_TICK_INTERVAL_MS } from "./engine/traceSystem";
import { UI } from "./i18n/ui";
import { useT } from "./i18n/useT";
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

function BreachedScreen() {
  const t = useT();
  const level = useGameStore((s) => s.level);
  const loadLevel = useGameStore((s) => s.loadLevel);
  const setScreen = useGameStore((s) => s.setScreen);
  const nextLevel = LEVELS[level.index + 1];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <Sprite grid={LOCK_SPRITE} palette={BASE_PALETTE} size={64} title="unlocked" />
      <p className="text-sm font-semibold tracking-widest text-accent">{t(UI.nodeBreached)}</p>
      <p className="text-xs text-text-dim">
        {nextLevel ? t(UI.nextTargetOnline) : t(UI.moreLevelsComing)}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => loadLevel(level.index)}
          className="min-h-[44px] rounded border border-border px-4 text-xs font-medium tracking-wide text-text-dim active:bg-panel-alt"
        >
          {t(UI.replayLevel)}
        </button>
        {nextLevel && (
          <button
            type="button"
            onClick={() => loadLevel(nextLevel.index)}
            className="min-h-[44px] rounded border border-accent/40 px-4 text-xs font-medium tracking-wide text-accent active:bg-accent-dim"
          >
            {t(UI.nextLevel)}
          </button>
        )}
        <button
          type="button"
          onClick={() => setScreen("menu")}
          className="min-h-[44px] rounded border border-border px-4 text-xs font-medium tracking-wide text-text-dim active:bg-panel-alt"
        >
          {t(UI.mainMenu)}
        </button>
      </div>
    </div>
  );
}

function BurnedScreen() {
  const t = useT();
  const level = useGameStore((s) => s.level);
  const loadLevel = useGameStore((s) => s.loadLevel);

  useEffect(() => {
    navigator.vibrate?.([30, 60, 30, 60, 30]);
    playGlitch();
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-semibold tracking-widest text-warn crt-flicker glitch-shift">
        {t(UI.connectionLost)}
      </p>
      <p className="text-xs text-text-dim">{t(UI.burnedBody)}</p>
      <button
        type="button"
        onClick={() => loadLevel(level.index)}
        className="min-h-[44px] rounded border border-warn/40 px-4 text-xs font-medium tracking-wide text-warn active:bg-warn-dim"
      >
        {t(UI.retryLevel)}
      </button>
    </div>
  );
}

function SettingsPanel() {
  const t = useT();
  const resetProgress = useGameStore((s) => s.resetProgress);
  const setScreen = useGameStore((s) => s.setScreen);
  const screen = useGameStore((s) => s.screen);
  const lang = useGameStore((s) => s.lang);
  const setLang = useGameStore((s) => s.setLang);
  const audio = useGameStore((s) => s.profile.audio);
  const setAudio = useGameStore((s) => s.setAudio);
  const openRestartConfirm = useGameStore((s) => s.openRestartConfirm);
  const [confirming, setConfirming] = useState(false);
  const inGame = screen === "game";

  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(() => setConfirming(false), 3000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <h1 className="text-sm font-semibold tracking-widest text-text-bright">{t(UI.settingsTitle)}</h1>
      <p className="text-xs text-text-dim">{t(UI.reducedMotionNote)}</p>
      <p className="text-xs text-text-dim">{t(UI.autosaveNote)}</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-dim">{t(UI.audioLabel)}</p>
          <button
            type="button"
            onClick={() => setAudio({ muted: !audio.muted })}
            className={`min-h-[44px] rounded border px-4 text-xs font-medium tracking-wide ${
              audio.muted
                ? "border-warn/40 text-warn active:bg-warn-dim"
                : "border-accent/40 text-accent active:bg-accent-dim"
            }`}
          >
            {audio.muted ? t(UI.muteOn) : t(UI.muteOff)}
          </button>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-text-dim">{t(UI.volumeLabel)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={audio.volume}
            disabled={audio.muted}
            onChange={(e) => setAudio({ volume: Number(e.target.value) })}
            className="h-[44px] w-full accent-accent disabled:opacity-40"
          />
        </label>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-text-dim">{t(UI.languageLabel)}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`min-h-[44px] flex-1 rounded border px-4 text-xs font-medium tracking-wide ${
              lang === "en"
                ? "border-accent/40 text-accent active:bg-accent-dim"
                : "border-border text-text-dim active:bg-panel-alt"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang("id")}
            className={`min-h-[44px] flex-1 rounded border px-4 text-xs font-medium tracking-wide ${
              lang === "id"
                ? "border-accent/40 text-accent active:bg-accent-dim"
                : "border-border text-text-dim active:bg-panel-alt"
            }`}
          >
            Bahasa Indonesia
          </button>
        </div>
      </div>
      {inGame && (
        <button
          type="button"
          onClick={openRestartConfirm}
          className="min-h-[44px] rounded border border-warn/40 px-4 text-xs font-medium tracking-wide text-warn active:bg-warn-dim"
        >
          {t(UI.restartLevel)}
        </button>
      )}
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
        {confirming ? t(UI.resetConfirm) : t(UI.resetProgress)}
      </button>
      <button
        type="button"
        onClick={() => setScreen("menu")}
        className="min-h-[44px] rounded border border-border px-4 text-xs font-medium tracking-wide text-text-dim active:bg-panel-alt"
      >
        {t(UI.backToMainMenu)}
      </button>
    </div>
  );
}

/** Actions for whichever panel is currently active — what ActionBar renders. */
function useContextActions(): ContextAction[] {
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
  const setLoginPickerOpen = useGameStore((s) => s.setLoginPickerOpen);
  const setWorkbenchOpen = useGameStore((s) => s.setWorkbenchOpen);
  const combineSlots = useGameStore((s) => s.combineSlots);
  const clearSlots = useGameStore((s) => s.clearSlots);
  const decodeClue = useGameStore((s) => s.decodeClue);
  const startCrackHash = useGameStore((s) => s.startCrackHash);
  const checkLeakDatabase = useGameStore((s) => s.checkLeakDatabase);
  const node = useCurrentNode();
  const levelComplete = useLevelComplete();
  const t = useT();

  if (levelComplete || burned) return [];

  const terminalActions: ContextAction[] = (() => {
    const actions: ContextAction[] = [{ id: "scan", label: t(UI.scanPorts), onClick: runScan }];
    if (node.systemUsers.length > 0) {
      actions.push({ id: "list-users", label: t(UI.listUsers), onClick: listUsers });
    }
    if (node.traceEnabled) {
      actions.push({ id: "check-trace", label: t(UI.checkTrace), onClick: checkTrace });
    }
    if (accessGranted && !discovered["logs-deleted"] && !node.logFalsification) {
      actions.push({ id: "delete-logs", label: t(UI.deleteLogs), onClick: deleteLogs, danger: true });
    }
    if (node.logFalsification && accessGranted && !discovered["logs-falsified"]) {
      const ready = node.logFalsification.requiredFacts.every((f) => discovered[f]);
      if (ready) {
        actions.push({
          id: "falsify-logs",
          label: node.logFalsification.label,
          onClick: falsifyLogs,
          danger: true,
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
        });
      }
    }
    for (const esc of node.privilegeEscalations ?? []) {
      const done = discovered[esc.grantsFact];
      if (accessGranted && !done) {
        actions.push({
          id: `escalate-${esc.id}`,
          label: esc.label,
          onClick: () => escalatePrivilege(esc.id),
        });
      }
    }
    for (const bd of node.backdoors ?? []) {
      const done = discovered[bd.grantsFact];
      if (accessGranted && !done) {
        actions.push({
          id: `backdoor-${bd.id}`,
          label: bd.label,
          onClick: () => plantBackdoor(bd.id),
        });
      }
    }
    if (node.adminOnlineThreshold !== undefined) {
      actions.push({ id: "check-connections", label: t(UI.checkConnections), onClick: checkConnections });
      actions.push({ id: "hide", label: t(UI.hide), onClick: goQuiet });
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
        actions.push({
          id: "login",
          label: t(UI.login),
          onClick: () => setLoginPickerOpen(true),
        });
      }
    }
    return actions;
  })();

  const filesActions: ContextAction[] = (() => {
    if (inspectingPath) {
      return [{ id: "close-inspect", label: t(UI.close), onClick: closeInspect }];
    }
    if (openFilePath) {
      return [{ id: "close", label: t(UI.close), onClick: closeFile }];
    }
    if (searchOpen) {
      return [{ id: "close-search", label: t(UI.closeSearch), onClick: closeSearch }];
    }
    const actions: ContextAction[] = [];
    if (currentPath.length > 0) {
      actions.push({ id: "up", label: t(UI.upNav), onClick: () => goToPath(currentPath.slice(0, -1)) });
    }
    actions.push({ id: "search", label: t(UI.search), onClick: openSearch });
    return actions;
  })();

  const cluesActions: ContextAction[] = (() => {
    if (workbenchOpen) {
      const actions: ContextAction[] = [];
      if (slotA && slotB) {
        actions.push({ id: "combine", label: t(UI.combine), onClick: combineSlots });
      }
      if (slotA || slotB) {
        actions.push({ id: "clear-slots", label: t(UI.clearSlots), onClick: clearSlots });
      }
      actions.push({
        id: "close-workbench",
        label: t(UI.closeWorkbench),
        onClick: () => setWorkbenchOpen(false),
      });
      return actions;
    }
    const actions: ContextAction[] = [];
    const selectedClue = clues.find((c) => c.id === selectedClueId);
    if (selectedClue?.type === "encoded") {
      actions.push({ id: "decode", label: t(UI.decode), onClick: decodeClue });
    }
    if (selectedClue?.type === "hash") {
      actions.push({
        id: "crack",
        label: crackingClueId === selectedClue.id ? t(UI.crackingAction) : t(UI.crackHash),
        onClick: startCrackHash,
        disabled: crackingClueId !== null,
      });
    }
    if (selectedClue?.type === "email") {
      actions.push({ id: "leak-check", label: t(UI.checkLeakDb), onClick: checkLeakDatabase });
    }
    if (clues.length >= 2) {
      actions.push({
        id: "open-workbench",
        label: t(UI.workbench),
        onClick: () => setWorkbenchOpen(true),
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

  return byPanel[activePanel];
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
  const actions = useContextActions();

  return (
    <div className="mx-auto flex h-dvh max-w-[430px] flex-col overflow-hidden bg-bg text-text">
      <div className="relative flex min-h-0 flex-1 flex-col">
        {screen === "menu" && <MainMenu />}
        {screen === "levels" && <LevelSelect />}
        {screen === "settings" && <SettingsPanel />}
        {screen === "game" && (
          <>
            <TraceTicker />
            <StatusBar />
            <main className="min-h-0 flex-1 overflow-hidden">
              <ActivePanel />
            </main>
            <ActionBar actions={actions} />
            <TabBar />
            <NetworkMapHint />
            <NetworkMap />
            <LoginPicker />
            <MonologueDialog />
            <RestartLevelDialog />
            <BriefingDialog />
            <StoryScene />
          </>
        )}
        <div className="scanlines" />
        <LanguagePicker />
      </div>
    </div>
  );
}

export default App;
