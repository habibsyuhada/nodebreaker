import type { LocalizedText } from "../i18n";

export interface PortInfo {
  port: number;
  service: string;
  banner: string;
}

export interface FileMetadata {
  label: string;
  value: string;
}

/**
 * A trace trap on a directory: entering it for the first time (tapping in from its parent
 * listing) immediately spikes trace. The "it's fake" tell should live in `FileEntry.metadata`
 * so a player who inspects (tap-hold) before entering can avoid the trap entirely.
 */
export interface HoneypotDef {
  tracePenalty: number;
  /** Fact id set the first time this fires, so re-entering the folder doesn't spike trace again. */
  triggeredFact: string;
  /** Terminal lines appended (warn tone) when the trap fires. */
  warningText: string[];
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
  /**
   * Fact id required before this file's content can be read — shows a permission-denied message
   * instead, and `grantsFact` (if any) is withheld until the fact is discovered. Used for
   * privilege-escalation gating.
   */
  requiresFact?: string;
  /** Tap-hold (not tap) reveals these fields in place, without opening/entering the entry. */
  metadata?: FileMetadata[];
  /** Only meaningful on a dir — see HoneypotDef. */
  honeypot?: HoneypotDef;
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

/**
 * A one-tap privilege-escalation action (e.g. dropping a payload into a folder a scheduled
 * admin-run job picks up). Instant, gated by requiredFacts, and only offered post-login
 * (see the accessGranted check where this is surfaced in App.tsx). Once granted, its fact
 * unlocks any `FileEntry.requiresFact` gates matching it.
 */
export interface PrivilegeEscalationDef {
  id: string;
  /** Action-bar button label, e.g. "Drop Payload". */
  label: string;
  requiredFacts: string[];
  grantsFact: string;
  /** Terminal lines appended (success tone) when it runs. */
  narrationText: string[];
}

/**
 * Replaces the generic "Delete Logs" action on nodes where outright deletion would raise
 * suspicion. Presence of this field on a node hides Delete Logs entirely and offers Falsify
 * Logs instead, gated by requiredFacts (typically: found a reference for what a normal log
 * entry looks like).
 */
export interface LogFalsificationDef {
  requiredFacts: string[];
  tracePenaltyReduction: number;
  /** Action-bar button label, e.g. "Falsify Logs". */
  label: string;
}

/**
 * A one-tap "plant backdoor" action — same shape as PrivilegeEscalationDef (instant, gated by
 * requiredFacts, only offered post-login) but kept as its own type since it's a distinct game
 * verb: its grantsFact is meant to be required elsewhere (e.g. another node's completionRequires
 * or a final gated action) as proof of a persistent foothold, not to unlock a requiresFact gate.
 */
export interface BackdoorDef {
  id: string;
  /** Action-bar button label, e.g. "Plant Backdoor". */
  label: string;
  requiredFacts: string[];
  grantsFact: string;
  /** Terminal lines appended (success tone) when it runs. */
  narrationText: string[];
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
  privilegeEscalations?: PrivilegeEscalationDef[];
  logFalsification?: LogFalsificationDef;
  backdoors?: BackdoorDef[];
  /**
   * Trace % at which an admin is considered actively connected to this node. Presence of this
   * field (regardless of value) is what surfaces the "Check Connections" and "Hide" actions —
   * Check Connections reports online/clear by comparing traceLevel against it; Hide reduces
   * traceLevel, usable any time (not gated by login) as a general risk-management tool.
   */
  adminOnlineThreshold?: number;
}

/** Who a scene card's content is attributed to — drives the card's visual chrome (border color, avatar sprite). */
export type SceneSourceKind = "victim" | "perp" | "bystander" | "system" | "public";

/**
 * One beat of an intro/outro scene: an intercepted message (chat line, ticket, memo excerpt).
 * Intro scenes read like a leaked feed the player is watching before they act; outro scenes
 * mirror it back, each card answering a specific intro card by id.
 */
export interface SceneCard {
  id: string;
  kind: SceneSourceKind;
  /** Where this was intercepted, e.g. "Building Group Chat", "#ops-internal", "Ticket #4471". */
  channel: LocalizedText;
  /** Who appears to have written it, e.g. "Mrs. Adisa (4A)". */
  author: LocalizedText;
  /** Optional small detail line, e.g. a timestamp or "19 days open". */
  meta?: LocalizedText;
  body: LocalizedText[];
  /**
   * Outro cards only: id of the intro card this answers. StoryScene renders that card's first
   * body line struck-through above this card's own content as the visual payoff.
   */
  answers?: string;
  /** Outro cards only: card is skipped unless every one of these facts was discovered this playthrough. */
  requiresFacts?: string[];
}

/** A full before-hack or after-hack scene: a short sequence of intercepted-comms cards. */
export interface SceneDef {
  /** Small label above the first card, e.g. "SIGNAL INTERCEPT" / "FALLOUT". */
  kicker: LocalizedText;
  cards: SceneCard[];
  /** Optional final stinger line, rendered bare and centered after the last card. */
  closer?: LocalizedText;
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
  /** Before-hack scene shown ahead of BriefingDialog — the victim being hurt, then the perpetrator gloating. */
  intro?: SceneDef;
  /** After-hack scene shown once the level completes — mirrors intro cards via SceneCard.answers. */
  outro?: SceneDef;
}
