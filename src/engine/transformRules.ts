import type { CombineResult } from "./combineRules";
import type { Clue } from "./clueSystem";

/** Simulated processing time for the hash cracker — trace keeps ticking while this runs. */
export const CRACK_DURATION_MS = 4000;

/** Keyed by the exact encoded clue value. Values are real base64 so `atob` genuinely decodes them. */
const DECODE_RECIPES: Record<string, CombineResult> = {
  "ZGVwbG95LWJvdA==": {
    type: "username",
    value: atob("ZGVwbG95LWJvdA=="),
    label: "Decoded from a base64 comment left in the source",
  },
  "UmVjMHZlcnlTbGlwIzQ=": {
    type: "password",
    value: atob("UmVjMHZlcnlTbGlwIzQ="),
    label: "Decoded from a base64 comment left in the sync script",
  },
  "TjFtYnVzI1ZlbmQwcg==": {
    type: "pattern",
    value: atob("TjFtYnVzI1ZlbmQwcg=="),
    label: "Decoded rotation pattern from the vendor onboarding notes",
  },
  "d2VsbG5lc3Nib3Q=": {
    type: "username",
    value: atob("d2VsbG5lc3Nib3Q="),
    label: "Decoded from a base64 comment left in the config",
  },
  "QzBhc3RhbCNCcmlkZ2U=": {
    type: "pattern",
    value: atob("QzBhc3RhbCNCcmlkZ2U="),
    label: "Decoded rotation pattern from the vendor onboarding notes",
  },
};

/** Keyed by the exact hash clue value — simulates a cracker matching against a known wordlist. */
const CRACK_RECIPES: Record<string, CombineResult> = {
  "9f86d081884c7d659a2feaa0c55ad015": {
    type: "password",
    value: "Aut0Deploy#9",
    label: "Cracked from the rotated password hash",
  },
  "5f8a0c2e91b6d4317aa4e2c9f0b1d6a3": {
    type: "token",
    value: "AURELIA-LINK-4471",
    label: "Cracked ledger checksum — reveals an internal routing token",
  },
  "c74d97b01eae257e44aa9d5bade97baf": {
    type: "password",
    value: "C0nsentWide9!",
    label: "Cracked from the rotated password hash",
  },
};

/** Keyed by the exact email clue value — simulates checking a public breach-dump database. */
const LEAK_RECIPES: Record<string, CombineResult> = {
  "jwilson@riversidehealth.org": {
    type: "password",
    value: "Sunshine88!",
    label: "Found in a public breach dump — this account reuses it",
  },
  "finops@halcyondynamics.com": {
    type: "password",
    value: "Ledger$ecure9",
    label: "Found in a public breach dump — this account reuses it",
  },
  "tokafor@alamedaregional.org": {
    type: "password",
    value: "Riverbank77!",
    label: "Found in a public breach dump — this account reuses it",
  },
};

/** Single-input transform: decode an `encoded` clue. Returns null if it doesn't decode to anything useful. */
export function tryDecode(clue: Clue): CombineResult | null {
  if (clue.type !== "encoded") return null;
  return DECODE_RECIPES[clue.value] ?? null;
}

/** Single-input transform: crack a `hash` clue. Returns null if it's not in the (simulated) wordlist. */
export function tryCrack(clue: Clue): CombineResult | null {
  if (clue.type !== "hash") return null;
  return CRACK_RECIPES[clue.value] ?? null;
}

/** Single-input transform: check an `email` clue against a leaked-credential database. */
export function tryLeakCheck(clue: Clue): CombineResult | null {
  if (clue.type !== "email") return null;
  return LEAK_RECIPES[clue.value] ?? null;
}
