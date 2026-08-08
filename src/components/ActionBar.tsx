import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";

export interface ContextAction {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** Warning-styled action (e.g. risky/destructive), rendered in the warn accent. */
  danger?: boolean;
  /**
   * Marks this as a genuine new-capability unlock (login, post-access recon, pivot, escalation,
   * workbench, etc.) rather than routine UI chrome (Close/Up/Search, per-selection transforms,
   * workbench slot toggles). Only `notable` actions get diffed for the "New action unlocked" toast
   * in App.tsx's ActionNotifier — everything else appears/disappears too often from ordinary
   * navigation to be worth announcing.
   */
  notable?: boolean;
}

interface ActionBarProps {
  actions: ContextAction[];
}

/** Bottom contextual action bar — the primary way players trigger actions (no typing). */
export function ActionBar({ actions }: ActionBarProps) {
  const t = useT();

  if (actions.length === 0) {
    return (
      <div className="flex h-16 shrink-0 items-center justify-center border-t border-border bg-panel-alt px-3 text-xs text-text-dim">
        {t(UI.noActionsAvailable)}
      </div>
    );
  }

  return (
    <div className="flex h-16 shrink-0 items-center gap-2 overflow-x-auto border-t border-border bg-panel-alt px-2">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={action.disabled}
          onClick={action.onClick}
          className={`min-h-[44px] shrink-0 grow basis-24 whitespace-nowrap rounded border px-3 text-xs font-medium tracking-wide transition-colors ${
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
