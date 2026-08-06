import type { Clue, ClueType } from "./clueSystem";

export interface CombineResult {
  type: ClueType;
  value: string;
  label: string;
}

interface CombineRecipe {
  id: string;
  aType: ClueType;
  bType: ClueType;
  resolve: (a: Clue, b: Clue) => CombineResult;
}

const RECIPES: CombineRecipe[] = [
  {
    id: "username-pattern-to-password",
    aType: "username",
    bType: "pattern",
    resolve: (username, pattern) => ({
      type: "password",
      value: pattern.value,
      label: `Guessed password for ${username.value}`,
    }),
  },
];

/** Order-independent — tries both (a,b) and (b,a) against each recipe. Returns null if nothing matches. */
export function tryCombine(a: Clue, b: Clue): CombineResult | null {
  for (const recipe of RECIPES) {
    if (a.type === recipe.aType && b.type === recipe.bType) return recipe.resolve(a, b);
    if (b.type === recipe.aType && a.type === recipe.bType) return recipe.resolve(b, a);
  }
  return null;
}
