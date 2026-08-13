import { getThemeById, toSpritePalette } from "../engine/theme";
import { useGameStore } from "../store/gameStore";
import type { SpritePalette } from "./spriteEngine";

/** The active theme's palette, in the sprite renderer's o/f/h/a/w shape. Re-renders on theme change. */
export function useSpritePalette(): SpritePalette {
  const activeThemeId = useGameStore((s) => s.profile.activeThemeId);
  return toSpritePalette(getThemeById(activeThemeId).colors);
}
