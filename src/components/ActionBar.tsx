export interface ContextAction {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** Warning-styled action (e.g. risky/destructive), rendered in the warn accent. */
  danger?: boolean;
}

interface ActionBarProps {
  actions: ContextAction[];
}

/** Bottom contextual action bar — the primary way players trigger actions (no typing). */
export function ActionBar({ actions }: ActionBarProps) {
  if (actions.length === 0) {
    return (
      <div className="flex h-16 shrink-0 items-center justify-center border-t border-border bg-panel-alt px-3 text-xs text-text-dim">
        no actions available
      </div>
    );
  }

  return (
    <div className="flex h-16 shrink-0 items-center gap-2 border-t border-border bg-panel-alt px-2">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={action.disabled}
          onClick={action.onClick}
          className={`min-h-[44px] flex-1 rounded border px-2 text-xs font-medium tracking-wide transition-colors ${
            action.disabled
              ? "cursor-not-allowed border-border text-text-dim opacity-50"
              : action.danger
                ? "border-warn/40 text-warn active:bg-warn-dim"
                : "border-accent/40 text-accent active:bg-accent-dim"
          }`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
