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
