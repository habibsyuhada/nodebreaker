import { IconClues, IconFiles, IconSettings, IconTerminal } from "../art/icons";
import { type PanelId, useGameStore } from "../store/gameStore";

const TABS: { id: PanelId; label: string; Icon: typeof IconTerminal }[] = [
  { id: "terminal", label: "TERM", Icon: IconTerminal },
  { id: "files", label: "FILE", Icon: IconFiles },
  { id: "clues", label: "CLUE", Icon: IconClues },
  { id: "settings", label: "", Icon: IconSettings },
];

export function TabBar() {
  const activePanel = useGameStore((s) => s.activePanel);
  const setActivePanel = useGameStore((s) => s.setActivePanel);
  const clueCount = useGameStore((s) => s.clues.length);

  return (
    <nav className="flex h-16 shrink-0 border-t border-border bg-panel">
      {TABS.map(({ id, label, Icon }) => {
        const active = activePanel === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setActivePanel(id)}
            aria-current={active ? "page" : undefined}
            aria-label={label || id}
            className={`relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 transition-colors ${
              active ? "text-accent" : "text-text-dim active:text-text"
            }`}
          >
            <span
              className={`h-1 w-1 rounded-full transition-opacity ${
                active ? "bg-accent opacity-100" : "opacity-0"
              }`}
            />
            <span className="relative">
              <Icon size={20} />
              {id === "clues" && clueCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-bg">
                  {clueCount}
                </span>
              )}
            </span>
            {label && <span className="text-[10px] tracking-wider">{label}</span>}
          </button>
        );
      })}
    </nav>
  );
}
