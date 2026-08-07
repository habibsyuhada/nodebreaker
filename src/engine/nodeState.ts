import { stripHoldMarkup } from "./clueSystem";
import type { FileEntry, LevelNodeDef } from "../levels/types";

export function findEntry(root: FileEntry, path: readonly string[]): FileEntry | undefined {
  let current: FileEntry = root;
  for (const segment of path) {
    if (current.kind !== "dir" || !current.children) return undefined;
    const next = current.children.find((c) => c.name === segment);
    if (!next) return undefined;
    current = next;
  }
  return current;
}

export function listDir(root: FileEntry, path: readonly string[]): FileEntry[] {
  const dir = findEntry(root, path);
  if (!dir || dir.kind !== "dir") return [];
  return dir.children ?? [];
}

export function pathToString(path: readonly string[]): string {
  return path.length === 0 ? "/" : "/" + path.join("/");
}

export function tryLogin(node: LevelNodeDef, username: string, password: string): boolean {
  return node.users.some((u) => u.username === username && u.password === password);
}

/**
 * A compact per-node label for UI that needs to tell nodes apart at a glance (StatusBar, the
 * Network Map, grouped Clue Inventory headers). Every multi-node level's orgName already follows
 * "Company — Descriptor" (see level05/level08), so the descriptor after the last " — " is a good
 * short label with no extra per-node data field needed; falls back to the full orgName otherwise.
 */
export function shortNodeLabel(orgName: string): string {
  const parts = orgName.split(" — ");
  return parts[parts.length - 1];
}

export interface SearchResult {
  path: string[];
  snippet: string;
}

/**
 * Recursively searches readable file contents (and names) for a keyword, case-insensitively.
 * Files still gated behind `requiresFact` (not yet discovered) are skipped entirely, same as
 * unreadable binary files — a keyword index shouldn't surface content you can't actually open.
 */
export function searchFilesystem(
  root: FileEntry,
  keyword: string,
  discovered: Record<string, true>,
): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerKeyword = keyword.toLowerCase();

  function visit(entry: FileEntry, path: string[]) {
    if (entry.kind === "file") {
      if (entry.readable === false) return;
      if (entry.requiresFact && !discovered[entry.requiresFact]) return;
      const content = stripHoldMarkup(entry.content ?? "");
      const matchLine = content.split("\n").find((l) => l.toLowerCase().includes(lowerKeyword));
      const nameMatches = entry.name.toLowerCase().includes(lowerKeyword);
      if (matchLine || nameMatches) {
        results.push({ path, snippet: matchLine ?? entry.name });
      }
      return;
    }
    for (const child of entry.children ?? []) {
      visit(child, [...path, child.name]);
    }
  }

  for (const child of root.children ?? []) {
    visit(child, [child.name]);
  }
  return results;
}
