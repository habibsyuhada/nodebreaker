import type { Clue } from "../engine/clueSystem";
import { shortNodeLabel } from "../engine/nodeState";
import { useGameStore } from "../store/gameStore";

interface CredentialRowProps {
  clue: Clue;
  selected: boolean;
  showNodeLabel: boolean;
  onSelect: () => void;
}

function CredentialRow({ clue, selected, showNodeLabel, onSelect }: CredentialRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded border px-3 py-2 text-left text-xs ${
        selected ? "border-accent bg-accent-dim text-text-bright" : "border-border text-text active:bg-panel-alt"
      }`}
    >
      <span className="truncate font-mono">{clue.value}</span>
      {showNodeLabel && (
        <span className="shrink-0 text-[10px] text-text-dim">{shortNodeLabel(clue.nodeLabel)}</span>
      )}
    </button>
  );
}

/**
 * Replaces the old auto-guess Login: the player explicitly picks one username clue and one
 * password clue (each labeled with which node it came from) rather than the game silently
 * trying every combo in a level-wide inventory that, on multi-node levels, holds credentials
 * for several different systems at once.
 */
export function LoginPicker() {
  const open = useGameStore((s) => s.loginPickerOpen);
  const setOpen = useGameStore((s) => s.setLoginPickerOpen);
  const clues = useGameStore((s) => s.clues);
  const usernameClueId = useGameStore((s) => s.loginUsernameClueId);
  const passwordClueId = useGameStore((s) => s.loginPasswordClueId);
  const selectUsername = useGameStore((s) => s.selectLoginUsername);
  const selectPassword = useGameStore((s) => s.selectLoginPassword);
  const confirmLogin = useGameStore((s) => s.confirmLogin);

  if (!open) return null;

  const usernames = clues.filter((c) => c.type === "username");
  const passwords = clues.filter((c) => c.type === "password");
  const ready = usernameClueId !== null && passwordClueId !== null;
  const showNodeLabels = new Set([...usernames, ...passwords].map((c) => c.nodeId)).size > 1;

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end bg-bg/90 p-3"
      onClick={() => setOpen(false)}
    >
      <div
        className="flex max-h-[80%] flex-col gap-3 rounded border border-border bg-panel p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-widest text-text-bright">LOGIN</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="min-h-[32px] px-2 text-xs text-text-dim active:text-accent"
          >
            Close
          </button>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto">
          <p className="text-[10px] tracking-widest text-text-dim">USERNAME</p>
          {usernames.length === 0 ? (
            <p className="text-xs text-text-dim">No username clues saved yet.</p>
          ) : (
            usernames.map((c) => (
              <CredentialRow
                key={c.id}
                clue={c}
                selected={c.id === usernameClueId}
                showNodeLabel={showNodeLabels}
                onSelect={() => selectUsername(c.id)}
              />
            ))
          )}
          <p className="mt-2 text-[10px] tracking-widest text-text-dim">PASSWORD</p>
          {passwords.length === 0 ? (
            <p className="text-xs text-text-dim">No password clues saved yet.</p>
          ) : (
            passwords.map((c) => (
              <CredentialRow
                key={c.id}
                clue={c}
                selected={c.id === passwordClueId}
                showNodeLabel={showNodeLabels}
                onSelect={() => selectPassword(c.id)}
              />
            ))
          )}
        </div>
        <button
          type="button"
          disabled={!ready}
          onClick={confirmLogin}
          className={`min-h-[44px] rounded border px-4 text-xs font-medium tracking-wide ${
            ready
              ? "border-accent/40 text-accent active:bg-accent-dim"
              : "cursor-not-allowed border-border text-text-dim opacity-50"
          }`}
        >
          Login
        </button>
      </div>
    </div>
  );
}
