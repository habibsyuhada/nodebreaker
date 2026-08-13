import { useRef } from "react";
import { IconDoc, IconFiles } from "../art/icons";
import { HOLD_MS, HoldableText } from "../components/HoldableText";
import { findEntry, pathToString, searchFilesystem } from "../engine/nodeState";
import { format } from "../i18n";
import { UI } from "../i18n/ui";
import { useT } from "../i18n/useT";
import type { FileEntry } from "../levels/types";
import { useCurrentNode, useGameStore } from "../store/gameStore";

const PRESET_KEYWORDS = ["password", "admin", "key", "backup", "config", "email"];

function Breadcrumb({ path, onNavigate }: { path: string[]; onNavigate: (p: string[]) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-panel px-3 py-2 text-xs text-text-dim">
      <button
        type="button"
        onClick={() => onNavigate([])}
        className="min-h-[28px] px-1 text-text-bright active:text-accent"
      >
        /
      </button>
      {path.map((segment, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="text-text-dim">/</span>
          <button
            type="button"
            onClick={() => onNavigate(path.slice(0, i + 1))}
            className="min-h-[28px] px-1 text-text-bright active:text-accent"
          >
            {segment}
          </button>
        </span>
      ))}
    </div>
  );
}

function SearchView() {
  const t = useT();
  const node = useCurrentNode();
  const discovered = useGameStore((s) => s.discovered);
  const searchKeyword = useGameStore((s) => s.searchKeyword);
  const setSearchKeyword = useGameStore((s) => s.setSearchKeyword);
  const openFile = useGameStore((s) => s.openFile);
  const lang = useGameStore((s) => s.lang);

  const results = searchKeyword ? searchFilesystem(node.root, searchKeyword, discovered, lang) : [];

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-panel p-3">
        <p className="mb-2 text-[11px] tracking-wide text-text-dim">{t(UI.searchFileContents)}</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_KEYWORDS.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => setSearchKeyword(kw)}
              className={`min-h-[32px] rounded-full border px-3 text-xs ${
                searchKeyword === kw
                  ? "border-accent text-accent"
                  : "border-border text-text-dim active:text-text"
              }`}
            >
              {kw}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {!searchKeyword && <p className="p-3 text-xs text-text-dim">{t(UI.tapChipToSearch)}</p>}
        {searchKeyword && results.length === 0 && (
          <p className="p-3 text-xs text-text-dim">
            {format(t(UI.noMatchesFor), { keyword: searchKeyword })}
          </p>
        )}
        {results.map((r, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openFile(r.path)}
            className="flex min-h-[44px] w-full flex-col items-start gap-0.5 border-b border-border px-3 py-2 text-left active:bg-panel-alt"
          >
            <span className="text-xs text-text-bright">{pathToString(r.path)}</span>
            <span className="w-full truncate text-[11px] text-text-dim">{r.snippet}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

interface EntryRowProps {
  entry: FileEntry;
  onOpen: () => void;
  onInspect: () => void;
}

/** Tap opens/enters as before. Tap-hold reveals FileEntry.metadata in place instead, if present. */
function EntryRow({ entry, onOpen, onInspect }: EntryRowProps) {
  const timerRef = useRef<number | null>(null);
  const heldRef = useRef(false);

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function start() {
    heldRef.current = false;
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      if (entry.metadata?.length) {
        heldRef.current = true;
        navigator.vibrate?.([15]);
        onInspect();
      }
    }, HOLD_MS);
  }

  function end() {
    clearTimer();
    if (!heldRef.current) onOpen();
    heldRef.current = false;
  }

  function cancel() {
    clearTimer();
    heldRef.current = false;
  }

  return (
    <div
      onPointerDown={start}
      onPointerUp={end}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
      className="holdable flex min-h-[44px] w-full items-center gap-3 border-b border-border px-3 text-left text-xs text-text active:bg-panel-alt"
    >
      {entry.kind === "dir" ? <IconFiles size={18} /> : <IconDoc size={18} />}
      <span className={entry.kind === "dir" ? "text-text-bright" : ""}>{entry.name}</span>
    </div>
  );
}

export function FileBrowser() {
  const t = useT();
  const node = useCurrentNode();
  const discovered = useGameStore((s) => s.discovered);
  const currentPath = useGameStore((s) => s.currentPath);
  const openFilePath = useGameStore((s) => s.openFilePath);
  const inspectingPath = useGameStore((s) => s.inspectingPath);
  const searchOpen = useGameStore((s) => s.searchOpen);
  const goToPath = useGameStore((s) => s.goToPath);
  const openFile = useGameStore((s) => s.openFile);
  const openInspect = useGameStore((s) => s.openInspect);

  if (inspectingPath) {
    const entry = findEntry(node.root, inspectingPath);
    const name = inspectingPath[inspectingPath.length - 1] ?? node.root.name;
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-border bg-panel px-3 py-2 text-xs text-text-bright">
          {entry?.kind === "dir" ? <IconFiles size={16} /> : <IconDoc size={16} />}
          {name} — metadata
        </div>
        <div className="flex flex-col gap-2 p-3">
          {(entry?.metadata ?? []).map((m, i) => (
            <div key={i} className="flex items-baseline justify-between gap-3 text-xs">
              <span className="shrink-0 text-text-dim">{t(m.label)}</span>
              <span className="text-right text-text-bright">{t(m.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (openFilePath) {
    const entry = findEntry(node.root, openFilePath);
    const filename = openFilePath[openFilePath.length - 1];
    const locked = Boolean(entry?.requiresFact && !discovered[entry.requiresFact]);
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-border bg-panel px-3 py-2 text-xs text-text-bright">
          <IconDoc size={16} />
          {filename}
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {locked ? (
            <p className="text-xs text-warn">{t(UI.permissionDenied)}</p>
          ) : entry?.readable === false ? (
            <p className="text-xs text-warn">{t(UI.binaryData)}</p>
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-xs text-text">
              <HoldableText content={t(entry?.content ?? "")} source={filename} />
            </pre>
          )}
        </div>
      </div>
    );
  }

  if (searchOpen) {
    return <SearchView />;
  }

  const dir = findEntry(node.root, currentPath);
  const entries = dir?.kind === "dir" ? (dir.children ?? []) : [];

  return (
    <div className="flex h-full flex-col">
      <Breadcrumb path={currentPath} onNavigate={goToPath} />
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <p className="p-3 text-xs text-text-dim">
            {format(t(UI.emptyDirectory), { path: pathToString(currentPath) })}
          </p>
        ) : (
          entries.map((entry) => (
            <EntryRow
              key={entry.name}
              entry={entry}
              onOpen={() =>
                entry.kind === "dir"
                  ? goToPath([...currentPath, entry.name])
                  : openFile([...currentPath, entry.name])
              }
              onInspect={() => openInspect([...currentPath, entry.name])}
            />
          ))
        )}
      </div>
    </div>
  );
}
