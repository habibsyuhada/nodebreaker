import { useEffect } from "react";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import { useGameStore, useLevelComplete } from "../store/gameStore";

const IDLE_MS = 45_000;
const CHECK_INTERVAL_MS = 5_000;

interface Hint {
  /** Fact id stamped into `discovered` the first time this fires — guards it to once per level. */
  fact: string;
  active: boolean;
  line: string;
}

/**
 * Diegetic, one-shot idle coaching — the original design brief called for a "subtle hint after
 * 45s idle" that never shipped. Delivered through the existing player-monologue channel
 * (`pushMonologue`) rather than a new popup, so it reads as the player's own thought and the
 * project's "no tutorial popups" rule stays intact. Each hint can fire at most once per level,
 * gated by a fact in `discovered` — checked in priority order, so on any idle tick at most one
 * hint fires, whichever is both relevant and hasn't been shown yet.
 */
export function GestureCoach() {
  const t = useT();
  const activePanel = useGameStore((s) => s.activePanel);
  const openFilePath = useGameStore((s) => s.openFilePath);
  const inspectingPath = useGameStore((s) => s.inspectingPath);
  const currentPath = useGameStore((s) => s.currentPath);
  const clues = useGameStore((s) => s.clues);
  const workbenchOpen = useGameStore((s) => s.workbenchOpen);
  const discovered = useGameStore((s) => s.discovered);
  const briefingActive = useGameStore((s) => s.briefingActive);
  const introActive = useGameStore((s) => s.introActive);
  const outroActive = useGameStore((s) => s.outroActive);
  const burned = useGameStore((s) => s.burned);
  const lastInteractionAt = useGameStore((s) => s.lastInteractionAt);
  const pushMonologue = useGameStore((s) => s.pushMonologue);
  const markDiscovered = useGameStore((s) => s.markDiscovered);
  const levelComplete = useLevelComplete();

  useEffect(() => {
    if (briefingActive || introActive || outroActive || burned || levelComplete) return;

    const id = window.setInterval(() => {
      if (Date.now() - lastInteractionAt < IDLE_MS) return;

      const hints: Hint[] = [
        {
          // Browsing a folder listing, nothing opened or inspected yet, nothing found at all —
          // the very first thing a new player does, before they've discovered tap-hold exists.
          fact: "hint-tap-hold-inspect-shown",
          active:
            activePanel === "files" &&
            openFilePath === null &&
            inspectingPath === null &&
            currentPath.length > 0 &&
            Object.keys(discovered).length === 0,
          line: t(UI.hintTapHoldInspect),
        },
        {
          // Reading a file's contents but has never saved a clue — the tap-hold-to-save gesture.
          fact: "hint-save-clue-shown",
          active: activePanel === "files" && openFilePath !== null && clues.length === 0,
          line: t(UI.hintSaveClue),
        },
        {
          // Enough clues to combine but the Workbench has never been opened.
          fact: "hint-open-workbench-shown",
          active: clues.length >= 2 && !workbenchOpen,
          line: t(UI.hintOpenWorkbench),
        },
      ];

      const next = hints.find((h) => h.active && !discovered[h.fact]);
      if (!next) return;
      markDiscovered(next.fact);
      pushMonologue([next.line]);
    }, CHECK_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [
    briefingActive,
    introActive,
    outroActive,
    burned,
    levelComplete,
    lastInteractionAt,
    activePanel,
    openFilePath,
    inspectingPath,
    currentPath,
    clues,
    workbenchOpen,
    discovered,
    pushMonologue,
    markDiscovered,
    t,
  ]);

  return null;
}
