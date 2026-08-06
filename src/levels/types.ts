export interface PortInfo {
  port: number;
  service: string;
  banner: string;
}

export interface FileEntry {
  name: string;
  kind: "file" | "dir";
  /** Plain text content, only for kind "file" and readable !== false. */
  content?: string;
  /** false = binary/unreadable — opening it shows a placeholder instead of content. Defaults to true. */
  readable?: boolean;
  /** Fact id granted the first time this file is opened (drives what actions unlock next). */
  grantsFact?: string;
  children?: FileEntry[];
}

export interface UserAccount {
  username: string;
  password: string;
  role: string;
}

/** What the "List Users" recon action reveals — usernames/roles only, no credentials. */
export interface SystemUser {
  username: string;
  role: string;
}

/**
 * A one-tap login the game offers once its required facts have been discovered.
 * Only for early levels that don't yet require combining clues in the Workbench —
 * later levels omit this and rely on matching username/password clues from the inventory instead.
 */
export interface QuickLogin {
  requiredFacts: string[];
  username: string;
  password: string;
  /** Action-bar button label, e.g. "Login (admin/default)". */
  label: string;
}

/**
 * A "compare two files" recon action: diffs two file contents line-by-line and prints the
 * result to the terminal (unchanged lines plain, changed lines marked). Diff output can embed
 * clue markup, e.g. so a changed hash line stays tap-hold-savable in the diff view itself.
 */
export interface FileCompareDef {
  id: string;
  /** Action-bar button label, e.g. "Compare Configs". */
  label: string;
  pathA: string[];
  pathB: string[];
  /** Facts required before this action appears — typically "both files have been read". */
  requiredFacts: string[];
  /** Fact id granted once the compare has been run. */
  grantsFact?: string;
}

/**
 * A "pivot" recon/access action: jumps `currentNodeId` to another node in the same level once
 * its required facts are discovered (e.g. an internal IP found on a public-facing node). Clues,
 * discovered facts, and trace level all carry over — only navigation state (path/open file/search)
 * resets, same as loading a fresh node.
 */
export interface PivotDef {
  id: string;
  targetNodeId: string;
  /** Action-bar button label, e.g. "Pivot to 192.168.20.5". */
  label: string;
  requiredFacts: string[];
}

export interface LevelNodeDef {
  id: string;
  ip: string;
  orgName: string;
  ports: PortInfo[];
  root: FileEntry;
  users: UserAccount[];
  systemUsers: SystemUser[];
  quickLogin?: QuickLogin;
  traceEnabled: boolean;
  compares?: FileCompareDef[];
  pivots?: PivotDef[];
}

export interface LevelDef {
  id: string;
  index: number;
  title: string;
  /** Lines typed into the terminal when the level loads. */
  briefing: string[];
  entryNodeId: string;
  nodes: LevelNodeDef[];
  /** Lines typed into the terminal on a successful login. */
  successText: string[];
  /**
   * Extra fact ids required (beyond a successful login) before the level counts as complete.
   * E.g. level 3 requires "logs-deleted" — access alone isn't enough, you have to cover your tracks.
   */
  completionRequires?: string[];
}
