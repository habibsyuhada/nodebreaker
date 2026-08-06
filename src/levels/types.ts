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
