import { IconDoc, IconFiles } from "../art/icons";
import { HoldableText } from "../components/HoldableText";
import { findEntry, pathToString, searchFilesystem } from "../engine/nodeState";
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
  const node = useCurrentNode();
  const searchKeyword = useGameStore((s) => s.searchKeyword);
  const setSearchKeyword = useGameStore((s) => s.setSearchKeyword);
  const openFile = useGameStore((s) => s.openFile);

  const results = searchKeyword ? searchFilesystem(node.root, searchKeyword) : [];

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-panel p-3">
        <p className="mb-2 text-[11px] tracking-wide text-text-dim">
          Search file contents for a keyword
        </p>
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
        {!searchKeyword && (
          <p className="p-3 text-xs text-text-dim">Tap a chip above to search.</p>
        )}
        {searchKeyword && results.length === 0 && (
          <p className="p-3 text-xs text-text-dim">No matches for "{searchKeyword}".</p>
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

export function FileBrowser() {
  const node = useCurrentNode();
  const currentPath = useGameStore((s) => s.currentPath);
  const openFilePath = useGameStore((s) => s.openFilePath);
  const searchOpen = useGameStore((s) => s.searchOpen);
  const goToPath = useGameStore((s) => s.goToPath);
  const openFile = useGameStore((s) => s.openFile);

  if (openFilePath) {
    const entry = findEntry(node.root, openFilePath);
    const filename = openFilePath[openFilePath.length - 1];
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-border bg-panel px-3 py-2 text-xs text-text-bright">
          <IconDoc size={16} />
          {filename}
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {entry?.readable === false ? (
            <p className="text-xs text-warn">[binary data — not human-readable]</p>
          ) : (
            <pre className="selectable whitespace-pre-wrap font-mono text-xs text-text">
              <HoldableText content={entry?.content ?? ""} source={filename} />
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
            (empty directory — {pathToString(currentPath)})
          </p>
        ) : (
          entries.map((entry) => (
            <button
              key={entry.name}
              type="button"
              onClick={() =>
                entry.kind === "dir"
                  ? goToPath([...currentPath, entry.name])
                  : openFile([...currentPath, entry.name])
              }
              className="flex min-h-[44px] w-full items-center gap-3 border-b border-border px-3 text-left text-xs text-text active:bg-panel-alt"
            >
              {entry.kind === "dir" ? <IconFiles size={18} /> : <IconDoc size={18} />}
              <span className={entry.kind === "dir" ? "text-text-bright" : ""}>{entry.name}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
