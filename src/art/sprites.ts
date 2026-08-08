import type { SpriteGrid, SpritePalette } from "./spriteEngine";

/**
 * Shared palette for the terminal-phosphor art style.
 * o = outline/edge, f = body fill, h = highlight, a = accent glow (success/active), w = warning glow.
 */
export const BASE_PALETTE: SpritePalette = {
  o: "#141c22",
  f: "#3a4750",
  h: "#c7d8d1",
  a: "#35e0a1",
  w: "#ff6b4a",
};

// 16x16 — three rack units, each with a glowing status LED.
export const SERVER_SPRITE: SpriteGrid = [
  "................",
  ".hhhhhhhhhhhhhh.",
  ".hfffffffffffah.",
  ".hhhhhhhhhhhhhh.",
  "................",
  ".hhhhhhhhhhhhhh.",
  ".hfffffffffffah.",
  ".hhhhhhhhhhhhhh.",
  "................",
  ".hhhhhhhhhhhhhh.",
  ".hfffffffffffah.",
  ".hhhhhhhhhhhhhh.",
  "................",
  "................",
  "................",
  "................",
];

// 16x16 — padlock with a glowing keyhole.
export const LOCK_SPRITE: SpriteGrid = [
  "................",
  "......hhhh......",
  ".....h....h.....",
  ".....h....h.....",
  ".....h....h.....",
  "..ffffffffffff..",
  ".ffffffffffffff.",
  ".ffffffffffffff.",
  ".fffffaaaaffffh.",
  ".fffffaaaaffffh.",
  ".ffffffffffffff.",
  ".ffffffffffffff.",
  ".ffffffffffffff.",
  ".hhhhhhhhhhhhhh.",
  "................",
  "................",
];

// 16x16 — folder with tab.
export const FOLDER_SPRITE: SpriteGrid = [
  "................",
  ".ffff...........",
  ".ffffffffffffff.",
  ".hhhhhhhhhhhhhh.",
  ".hffffffffffffh.",
  ".hffffffffffffh.",
  ".hffffffffffffh.",
  ".hffffffffffffh.",
  ".hffffffffffffh.",
  ".hffffffffffffh.",
  ".hffffffffffffh.",
  ".hffffffffffffh.",
  ".hffffffffffffh.",
  ".hhhhhhhhhhhhhh.",
  "................",
  "................",
];

// 16x16 — plain silhouette: head + shoulders. Used for scene cards with kind "victim"/"bystander".
export const PERSON_SPRITE: SpriteGrid = [
  "................",
  "......hhhh......",
  ".....h....h.....",
  ".....h....h.....",
  "......hhhh......",
  "................",
  "....hhhhhhhh....",
  "...hffffffffh...",
  "..hffffffffffh..",
  "..hffffffffffh..",
  "..hffffffffffh..",
  "..hffffffffffh..",
  "..hffffffffffh..",
  "..hhhhhhhhhhhh..",
  "................",
  "................",
];

// 16x16 — same silhouette with a warning-toned necktie. Used for scene cards with kind "perp".
export const SUIT_SPRITE: SpriteGrid = [
  "................",
  "......hhhh......",
  ".....h....h.....",
  ".....h....h.....",
  "......hhhh......",
  "................",
  "....hhhhhhhh....",
  "...hfffwwfffh...",
  "..hffffwwffffh..",
  "..hffffwwffffh..",
  "..hffffffffffh..",
  "..hffffffffffh..",
  "..hffffffffffh..",
  "..hhhhhhhhhhhh..",
  "................",
  "................",
];

// 16x16 — warning triangle with an exclamation mark. Used for scene cards with kind "system".
export const ALERT_SPRITE: SpriteGrid = [
  "................",
  "................",
  "................",
  ".......hh.......",
  "......hffh......",
  ".....hffffh.....",
  "....hffffffh....",
  "...hfffwwfffh...",
  "..hffffwwffffh..",
  ".hfffffwwfffffh.",
  "hffffffffffffffh",
  "hhhhhhhhhhhhhhhh",
  "................",
  "................",
  "................",
  "................",
];

// 16x16 — megaphone bell, opening to the right. Used for scene cards with kind "public".
export const MEGAPHONE_SPRITE: SpriteGrid = [
  "................",
  "............aa..",
  ".............hhh",
  "...........hfffh",
  ".........hfffffh",
  ".......hfffffffh",
  ".....hfffffffffh",
  "...hfffffffffffh",
  "...hfffffffffffh",
  ".....hfffffffffh",
  ".......hfffffffh",
  ".........hfffffh",
  "...........hfffh",
  ".............hhh",
  ".............a..",
  "................",
];
