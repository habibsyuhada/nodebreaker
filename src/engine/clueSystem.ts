export type ClueType =
  | "username"
  | "password"
  | "hash"
  | "pattern"
  | "email"
  | "path"
  | "version"
  | "encoded"
  | "token";

export const CLUE_TYPE_LABEL: Record<ClueType, string> = {
  username: "USER",
  password: "PASS",
  hash: "HASH",
  pattern: "PTRN",
  email: "MAIL",
  path: "PATH",
  version: "VERS",
  encoded: "ENC",
  token: "TOKN",
};

export interface Clue {
  id: string;
  type: ClueType;
  value: string;
  label: string;
  source: string;
}

export interface ClueInput {
  type: ClueType;
  value: string;
  label: string;
  source: string;
}

export interface TextSegment {
  kind: "text";
  text: string;
}

export interface ClueSegment {
  kind: "clue";
  type: ClueType;
  value: string;
  label: string;
}

export type ContentSegment = TextSegment | ClueSegment;

/**
 * Content strings can embed hold-to-save clue markup: [[type:value|label]].
 * The rest of the string renders as plain text.
 */
function holdPattern(): RegExp {
  return /\[\[(\w+):([^|]+?)\|([^\]]+)\]\]/g;
}

export function parseHoldableContent(content: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let lastIndex = 0;
  for (const match of content.matchAll(holdPattern())) {
    const [full, type, value, label] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ kind: "text", text: content.slice(lastIndex, index) });
    }
    segments.push({ kind: "clue", type: type as ClueType, value, label });
    lastIndex = index + full.length;
  }
  if (lastIndex < content.length) {
    segments.push({ kind: "text", text: content.slice(lastIndex) });
  }
  return segments;
}

/** Strips clue markup down to just the visible value — used while text is still typing in. */
export function stripHoldMarkup(content: string): string {
  return content.replace(holdPattern(), (_full, _type, value: string) => value);
}

export function clueKey(type: ClueType, value: string): string {
  return `${type}:${value}`;
}

let clueCounter = 0;

export function addClue(existing: Clue[], input: ClueInput): { clues: Clue[]; added: boolean } {
  const key = clueKey(input.type, input.value);
  if (existing.some((c) => clueKey(c.type, c.value) === key)) {
    return { clues: existing, added: false };
  }
  clueCounter += 1;
  const clue: Clue = { id: `clue-${clueCounter}`, ...input };
  return { clues: [...existing, clue], added: true };
}
